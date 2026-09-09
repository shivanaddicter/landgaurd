"""
Disaster Intelligence Report Generator API Endpoints
Generates formal audit, daily, and incident assessment payloads for NDMA/SDMA PDF/CSV downloads.
"""
from fastapi import APIRouter, Query, Response
from typing import Optional
from datetime import datetime, timezone
import json
from app.mock_data.seed_data import LOCATIONS, RISK_ZONES, ALERTS, SENSORS

router = APIRouter(prefix="/reports", tags=["Reports"])

REPORT_TEMPLATES = [
    {
        "id": "rep-daily-01",
        "title": "Daily Landslide Hazard Assessment Report",
        "type": "daily",
        "frequency": "Every 24 Hours (06:00 IST)",
        "intended_recipients": "District Magistrates, SDMA Control Room, BRO Vartak HQ"
    },
    {
        "id": "rep-weekly-02",
        "title": "Weekly North Eastern Region Hydro-Geological Intelligence Brief",
        "type": "weekly",
        "frequency": "Every Monday",
        "intended_recipients": "National Disaster Management Authority (NDMA), GSI Director General"
    },
    {
        "id": "rep-incident-03",
        "title": "Special Landslide Early Warning & Evacuation Action Plan",
        "type": "incident",
        "frequency": "Event-Driven",
        "intended_recipients": "Superintendent of Police, NDRF 12th Battalion, Health Officers"
    },
    {
        "id": "rep-sensor-04",
        "title": "IoT Telemetry Fleet Health & Sensor Calibration Audit",
        "type": "sensor",
        "frequency": "Bi-Weekly",
        "intended_recipients": "Geotechnical Instrumentation Team, IT & Telemetry Division"
    }
]

@router.get("/templates")
def get_report_templates():
    return {"success": True, "templates": REPORT_TEMPLATES}

@router.get("/generate")
def generate_report(
    report_type: str = Query("daily", pattern="^(daily|weekly|incident|sensor)$"),
    district: Optional[str] = "Tawang"
):
    """
    Constructs a comprehensive, executive-ready disaster intelligence report.
    """
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    
    # Filter target zone
    target_zone = next((z for z in RISK_ZONES if district.lower() in z["name"].lower() or district.lower() in z["location_id"].lower()), RISK_ZONES[0])
    
    report_payload = {
        "report_id": f"REP-NER-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{report_type.upper()[:3]}",
        "title": f"Official NDMA/SDMA {report_type.capitalize()} Landslide Assessment - {district} Sector",
        "classification": "CONFIDENTIAL // DISASTER MANAGEMENT OPERATIONAL USE ONLY",
        "generated_at": now_str,
        "issuing_authority": "AI-SlopeGuard Command Centre, North Eastern Region",
        "executive_summary": (
            f"During the preceding 24-hour observation window, intense precipitation in the {district} sector "
            f"triggered severe ground saturation. Peak landslide probability is currently evaluated at {target_zone['probability']}% "
            f"with an AI model confidence rating of {target_zone['confidence']}%. "
            f"A Level-2 Red Alert remains in effect along critical transportation lifelines."
        ),
        "key_metrics": {
            "24h_rainfall_mm": target_zone["rainfall_24h_mm"],
            "soil_moisture_saturation_pct": target_zone["soil_moisture_pct"],
            "slope_angle_deg": target_zone["slope_deg"],
            "ground_creep_displacement_mm": target_zone["ground_movement_mm"],
            "vulnerable_population": target_zone["population_affected"],
            "nearest_hospital_distance_km": target_zone["nearest_hospital"],
            "corridor_status": "Traffic restricted to emergency relief vehicles only"
        },
        "geotechnical_risk_analysis": {
            "factor_of_safety": 0.94,
            "shear_failure_mechanism": "Planar translational slip along weathered gneiss-schist bedding contact",
            "dominant_trigger": target_zone["dominant_cause"],
            "pore_pressure_rise_rate": "+1.8 kPa/hour"
        },
        "recommended_command_actions": [
            "Maintain 24x7 roadblock at Sela Tunnel approach to prevent civilian stranding.",
            "Pre-position 2 heavy excavators from Project Vartak (BRO) at km 44.",
            "Stage 4 ambulances at Tawang Government Higher Secondary Shelter.",
            "Transmit VHF radio bulletins to outlying hamlets lacking cellular reception."
        ],
        "active_alerts_count": len(ALERTS),
        "sensors_audited_count": len(SENSORS),
        "signatory": "Officer-in-Charge, AI-SlopeGuard Early Warning System"
    }
    
    return {
        "success": True,
        "report": report_payload
    }
