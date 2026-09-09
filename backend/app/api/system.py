"""
System Health, Infrastructure Status, Data Sources, and Settings API Endpoints
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any
from app.mock_data.seed_data import DATA_SOURCES

router = APIRouter(prefix="/system", tags=["System & Infrastructure"])

SERVICES_HEALTH = [
    {
        "service_name": "FastAPI Core REST Gateway",
        "status": "Operational",
        "latency_ms": 18,
        "uptime_pct": 99.98,
        "last_incident": "None in last 45 days"
    },
    {
        "service_name": "PostgreSQL / PostGIS Spatial Engine",
        "status": "Operational",
        "latency_ms": 12,
        "uptime_pct": 99.99,
        "last_incident": "None in last 90 days"
    },
    {
        "service_name": "Physics-Informed XGBoost Inference Service",
        "status": "Operational",
        "latency_ms": 45,
        "uptime_pct": 99.95,
        "last_incident": "Worker scale event 3 days ago"
    },
    {
        "service_name": "MapLibre / Leaflet GIS Spatial Tile Server",
        "status": "Operational",
        "latency_ms": 28,
        "uptime_pct": 99.92,
        "last_incident": "Cache flush 12 hours ago"
    },
    {
        "service_name": "LoRaWAN / MQTT Telemetry Gateway",
        "status": "Operational",
        "latency_ms": 32,
        "uptime_pct": 99.85,
        "last_incident": "1 node radio timeout re-polled"
    },
    {
        "service_name": "CAP Public Emergency Alert Broadcaster",
        "status": "Operational",
        "latency_ms": 50,
        "uptime_pct": 100.0,
        "last_incident": "None"
    },
    {
        "service_name": "ISRO / InSAR Satellite Sync Ingestion Service",
        "status": "Operational",
        "latency_ms": 110,
        "uptime_pct": 99.60,
        "last_incident": "Daily pass ingested successfully"
    }
]

class SystemSettings(BaseModel):
    risk_threshold_low: int = 25
    risk_threshold_medium: int = 50
    risk_threshold_high: int = 75
    rainfall_critical_mm: float = 150.0
    soil_moisture_critical_pct: float = 80.0
    alert_auto_broadcast: bool = False
    dark_mode_palette: str = "tactical_navy"
    language: str = "English"

current_settings = SystemSettings()

@router.get("/health")
def get_system_health():
    """
    Returns live operational status and latency for all command center micro-services.
    """
    total_uptime = sum(s["uptime_pct"] for s in SERVICES_HEALTH) / len(SERVICES_HEALTH)
    return {
        "success": True,
        "overall_status": "All Systems Fully Operational",
        "average_uptime_pct": round(total_uptime, 2),
        "active_services_count": len(SERVICES_HEALTH),
        "services": SERVICES_HEALTH
    }

@router.get("/data-sources")
def get_data_sources():
    """
    Returns integration status of external scientific and meteorological providers (IMD, ISRO, GSI, CWC).
    """
    return {
        "success": True,
        "sources": DATA_SOURCES
    }

@router.get("/settings")
def get_settings():
    return {"success": True, "settings": current_settings.model_dump()}

@router.post("/settings")
def update_settings(payload: SystemSettings):
    global current_settings
    current_settings = payload
    return {"success": True, "message": "Settings updated", "settings": current_settings.model_dump()}
