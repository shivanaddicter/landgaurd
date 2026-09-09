"""
IoT Sensors Telemetry and Diagnostics API Endpoints
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from app.mock_data.seed_data import SENSORS

router = APIRouter(prefix="/sensors", tags=["IoT Sensors"])

class RegisterSensorRequest(BaseModel):
    id: str
    location_id: str
    location_name: str
    type: str
    name: str
    latitude: float
    longitude: float
    unit: str
    hardware_uid: str

class UpdateSensorRequest(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    battery_pct: Optional[float] = None
    current_value: Optional[float] = None

# Mutable in-memory store for active session
sensor_store = [s.copy() for s in SENSORS]

@router.get("")
def list_sensors(sensor_type: Optional[str] = None, status: Optional[str] = None):
    """
    Returns full fleet of ground telemetry stations with health metrics.
    """
    results = sensor_store
    if sensor_type:
        results = [s for s in results if s["type"].lower() == sensor_type.lower()]
    if status:
        results = [s for s in results if s["status"].lower() == status.lower()]
    return {
        "success": True,
        "count": len(results),
        "total_active": len([s for s in results if s["status"] in ["online", "warning"]]),
        "sensors": results
    }

@router.get("/{sensor_id}")
def get_sensor(sensor_id: str):
    """
    Returns telemetry stream and diagnostic logs for a specific sensor.
    """
    sensor = next((s for s in sensor_store if s["id"] == sensor_id), None)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")
        
    # Generate synthetic 24-hour reading history for chart display
    base_val = sensor["current_value"]
    history = []
    for h in range(24, 0, -2):
        variation = (h % 3 - 1) * (base_val * 0.08)
        val = round(max(0.0, base_val + variation), 1)
        history.append({
            "timestamp": f"{h}h ago",
            "value": val,
            "status": "nominal" if val < base_val * 1.3 else "elevated"
        })
    history.append({"timestamp": "Now", "value": base_val, "status": "active"})
    
    diagnostics = {
        "hardware_uid": sensor["hardware_uid"],
        "lorawan_frequency": "865.2 MHz (IN865 Band)",
        "spreading_factor": "SF7",
        "snr_db": 9.4,
        "packet_loss_pct": 0.4,
        "calibration_date": "2026-01-15",
        "next_inspection": "2026-07-15"
    }
    
    return {
        "success": True,
        "sensor": sensor,
        "history": history,
        "diagnostics": diagnostics
    }

@router.post("")
def register_sensor(payload: RegisterSensorRequest):
    """
    Registers a new field telemetry station into the SlopeGuard network.
    """
    existing = next((s for s in sensor_store if s["id"] == payload.id), None)
    if existing:
        raise HTTPException(status_code=400, detail="Sensor ID already registered")
        
    new_sensor = {
        "id": payload.id,
        "location_id": payload.location_id,
        "location_name": payload.location_name,
        "type": payload.type,
        "name": payload.name,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "battery_pct": 100.0,
        "signal_rssi": -65,
        "status": "online",
        "current_value": 0.0,
        "unit": payload.unit,
        "last_update": "Just now",
        "hardware_uid": payload.hardware_uid,
        "sampling_rate": "1 min"
    }
    sensor_store.append(new_sensor)
    return {"success": True, "message": "Sensor registered successfully", "sensor": new_sensor}

@router.put("/{sensor_id}")
def update_sensor(sensor_id: str, payload: UpdateSensorRequest):
    sensor = next((s for s in sensor_store if s["id"] == sensor_id), None)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")
        
    if payload.name is not None:
        sensor["name"] = payload.name
    if payload.status is not None:
        sensor["status"] = payload.status
    if payload.battery_pct is not None:
        sensor["battery_pct"] = payload.battery_pct
    if payload.current_value is not None:
        sensor["current_value"] = payload.current_value
    sensor["last_update"] = "Just now"
    
    return {"success": True, "message": "Sensor updated", "sensor": sensor}

@router.delete("/{sensor_id}")
def delete_sensor(sensor_id: str):
    global sensor_store
    sensor = next((s for s in sensor_store if s["id"] == sensor_id), None)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")
    sensor_store = [s for s in sensor_store if s["id"] != sensor_id]
    return {"success": True, "message": f"Sensor {sensor_id} decommissioned"}
