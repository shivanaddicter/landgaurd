"""
AI-SlopeGuard: Landslide Early Warning & Risk Monitoring System
Main FastAPI Application Entrypoint
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import random
from typing import List

from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.risk import router as risk_router
from app.api.sensors import router as sensors_router
from app.api.rainfall import router as rainfall_router
from app.api.soil_moisture import router as soil_moisture_router
from app.api.satellite import router as satellite_router
from app.api.terrain import router as terrain_router
from app.api.landslides import router as landslides_router
from app.api.alerts import router as alerts_router
from app.api.emergency import router as emergency_router
from app.api.simulation import router as simulation_router
from app.api.reports import router as reports_router
from app.api.models import router as models_router
from app.api.system import router as system_router
from app.mock_data.seed_data import LOCATIONS, SENSORS, ALERTS, HISTORICAL_LANDSLIDES

app = FastAPI(
    title="AI-SlopeGuard Command Center API",
    version=settings.APP_VERSION,
    description="Enterprise Landslide Early Warning & Risk Monitoring Platform for North Eastern Region"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(dashboard_router, prefix=settings.API_PREFIX)
app.include_router(risk_router, prefix=settings.API_PREFIX)
app.include_router(sensors_router, prefix=settings.API_PREFIX)
app.include_router(rainfall_router, prefix=settings.API_PREFIX)
app.include_router(soil_moisture_router, prefix=settings.API_PREFIX)
app.include_router(satellite_router, prefix=settings.API_PREFIX)
app.include_router(terrain_router, prefix=settings.API_PREFIX)
app.include_router(landslides_router, prefix=settings.API_PREFIX)
app.include_router(alerts_router, prefix=settings.API_PREFIX)
app.include_router(emergency_router, prefix=settings.API_PREFIX)
app.include_router(simulation_router, prefix=settings.API_PREFIX)
app.include_router(reports_router, prefix=settings.API_PREFIX)
app.include_router(models_router, prefix=settings.API_PREFIX)
app.include_router(system_router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "system": "AI-SlopeGuard Command Center API",
        "version": settings.APP_VERSION,
        "region": "North Eastern Region (NER), India",
        "status": "OPERATIONAL",
        "docs_url": "/docs"
    }

# Global Command Search (Section 27)
@app.get("/api/search")
def global_search(q: str = Query(..., min_length=2)):
    """
    Unified global search across Locations, Sensors, Alerts, and Historical Landslide Incidents.
    Example: Search 'Tawang' -> Returns Tawang risk, sensors, alerts, historical incidents.
    """
    term = q.lower().strip()
    
    # Locations
    matching_locations = [
        loc for loc in LOCATIONS
        if term in loc["name"].lower() or term in loc["district"].lower() or term in loc["state"].lower()
    ]
    
    # Sensors
    matching_sensors = [
        s for s in SENSORS
        if term in s["name"].lower() or term in s["location_name"].lower() or term in s["id"].lower() or term in s["type"].lower()
    ]
    
    # Alerts
    matching_alerts = [
        a for a in ALERTS
        if term in a["title"].lower() or term in a["location_name"].lower() or term in a["description"].lower()
    ]
    
    # Historical Incidents
    matching_landslides = [
        ls for ls in HISTORICAL_LANDSLIDES
        if term in ls["location_name"].lower() or term in ls["district"].lower() or term in ls["id"].lower()
    ]
    
    return {
        "success": True,
        "query": q,
        "results": {
            "locations": matching_locations,
            "sensors": matching_sensors,
            "alerts": matching_alerts,
            "historical_landslides": matching_landslides,
            "total_matches": len(matching_locations) + len(matching_sensors) + len(matching_alerts) + len(matching_landslides)
        }
    }

# WebSocket Manager for Real-Time Telemetry Broadcasting (Section 29)
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Generate subtle realistic live sensor fluctuations every 4 seconds
            await asyncio.sleep(4)
            sensor_delta = random.choice(SENSORS)
            jitter = (random.random() - 0.45) * 0.4
            new_val = round(max(0.1, sensor_delta["current_value"] + jitter), 1)
            
            telemetry_tick = {
                "event_type": "telemetry_tick",
                "sensor_id": sensor_delta["id"],
                "sensor_name": sensor_delta["name"],
                "location": sensor_delta["location_name"],
                "value": new_val,
                "unit": sensor_delta["unit"],
                "battery": round(max(10.0, sensor_delta["battery_pct"] - 0.01), 1),
                "timestamp": "Just now"
            }
            await websocket.send_json(telemetry_tick)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
