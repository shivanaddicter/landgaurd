"""
Alerts & Emergency Warnings Management API Endpoints
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
from app.mock_data.seed_data import ALERTS

router = APIRouter(prefix="/alerts", tags=["Alerts & Warnings"])

# Mutable in-memory alerts store for the active session
alerts_store = [a.copy() for a in ALERTS]

class BroadcastNotificationRequest(BaseModel):
    channels: List[str] = ["CAP-Siren", "NDMA-DisasterPortal", "Public-PA-System"]
    message: Optional[str] = None

@router.get("")
def list_alerts(severity: Optional[str] = None, status: Optional[str] = None):
    """
    Returns active and historical disaster warning notices.
    """
    results = alerts_store
    if severity:
        results = [a for a in results if a["severity"].lower() == severity.lower()]
    if status:
        results = [a for a in results if a["status"].lower() == status.lower()]
        
    return {
        "success": True,
        "total": len(results),
        "active_critical": len([a for a in results if a["severity"] == "critical" and a["status"] == "active"]),
        "alerts": results
    }

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str):
    alert = next((a for a in alerts_store if a["id"] == alert_id), None)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    alert["status"] = "acknowledged"
    alert["acknowledged_at"] = datetime.now(timezone.utc).isoformat()
    return {"success": True, "message": f"Alert {alert_id} acknowledged by duty officer", "alert": alert}

@router.post("/{alert_id}/escalate")
def escalate_alert(alert_id: str):
    alert = next((a for a in alerts_store if a["id"] == alert_id), None)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    alert["status"] = "escalated"
    alert["severity"] = "critical"
    alert["escalated_to"] = "State Disaster Management Executive Committee (SDMA)"
    alert["escalated_at"] = datetime.now(timezone.utc).isoformat()
    return {"success": True, "message": f"Alert {alert_id} escalated to SDMA State Level", "alert": alert}

@router.post("/{alert_id}/resolve")
def resolve_alert(alert_id: str):
    alert = next((a for a in alerts_store if a["id"] == alert_id), None)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    alert["status"] = "resolved"
    alert["resolved_at"] = datetime.now(timezone.utc).isoformat()
    return {"success": True, "message": f"Alert {alert_id} marked resolved", "alert": alert}

@router.post("/{alert_id}/broadcast")
def broadcast_notification(alert_id: str, payload: BroadcastNotificationRequest):
    alert = next((a for a in alerts_store if a["id"] == alert_id), None)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    return {
        "success": True,
        "message": f"Emergency broadcast dispatched across {len(payload.channels)} channels (Simulated NDMA CAP Feed)",
        "alert_id": alert_id,
        "dispatched_channels": payload.channels,
        "estimated_citizens_notified": alert["affected_population"]
    }
