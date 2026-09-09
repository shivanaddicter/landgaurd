"""
Executive Dashboard API Endpoint
Provides unified command KPIs, sparklines, alert marquee, and situational summary.
"""
from fastapi import APIRouter
from app.mock_data.seed_data import LOCATIONS, SENSORS, ALERTS, RISK_ZONES

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("")
def get_dashboard_summary():
    """
    Returns the 8 Top KPI cards with percentages, trend arrows, sparklines,
    and situational status for the Disaster Command Center.
    """
    high_critical_zones = [z for z in RISK_ZONES if z["risk_level"] in ["HIGH", "CRITICAL"]]
    total_affected_population = sum(loc["population_affected"] for loc in LOCATIONS)
    online_sensors = [s for s in SENSORS if s["status"] in ["online", "warning"]]
    sensor_health_pct = round((len(online_sensors) / max(1, len(SENSORS))) * 100.0, 1)
    
    # 8 KPI Cards
    kpis = [
        {
            "id": "kpi-rainfall",
            "title": "Rainfall (Last 24h)",
            "value": "138.4 mm",
            "numeric_value": 138.4,
            "unit": "mm",
            "change_pct": "+14.2%",
            "trend": "up",
            "status": "CRITICAL",
            "status_color": "rose",
            "sparkline": [45, 62, 78, 92, 110, 128, 138.4],
            "description": "Threshold: >100mm (High Risk)"
        },
        {
            "id": "kpi-moisture",
            "title": "Avg Soil Moisture",
            "value": "74.2%",
            "numeric_value": 74.2,
            "unit": "%",
            "change_pct": "+8.6%",
            "trend": "up",
            "status": "ELEVATED",
            "status_color": "amber",
            "sparkline": [52, 55, 60, 64, 68, 71, 74.2],
            "description": "Near Field Saturation Capacity"
        },
        {
            "id": "kpi-high-risk-zones",
            "title": "Active High-Risk Zones",
            "value": f"{len(high_critical_zones)} Sectors",
            "numeric_value": len(high_critical_zones),
            "unit": "Zones",
            "change_pct": "+1 Zone",
            "trend": "up",
            "status": "HIGH",
            "status_color": "rose",
            "sparkline": [1, 2, 2, 2, 3, 3, len(high_critical_zones)],
            "description": "Tawang & Gangtok Sectors"
        },
        {
            "id": "kpi-active-alerts",
            "title": "Active Warning Alerts",
            "value": f"{len(ALERTS)} Active",
            "numeric_value": len(ALERTS),
            "unit": "Alerts",
            "change_pct": "2 Critical",
            "trend": "up",
            "status": "CRITICAL",
            "status_color": "rose",
            "sparkline": [1, 2, 3, 2, 4, 3, len(ALERTS)],
            "description": "NH-13 & NH-10 Lifelines Impacted"
        },
        {
            "id": "kpi-probability",
            "title": "Peak Landslide Probability",
            "value": "89.5%",
            "numeric_value": 89.5,
            "unit": "%",
            "change_pct": "+18.3%",
            "trend": "up",
            "status": "CRITICAL",
            "status_color": "rose",
            "sparkline": [32, 45, 54, 68, 79, 84, 89.5],
            "description": "Gangtok-Singtam NH-10 Corridor"
        },
        {
            "id": "kpi-sensor-health",
            "title": "IoT Sensor Health",
            "value": f"{sensor_health_pct}%",
            "numeric_value": sensor_health_pct,
            "unit": "%",
            "change_pct": "9/10 Active",
            "trend": "neutral",
            "status": "STABLE",
            "status_color": "emerald",
            "sparkline": [100, 100, 95, 95, 90, 90, sensor_health_pct],
            "description": "1 Node Reporting Creep Anomaly"
        },
        {
            "id": "kpi-population",
            "title": "Affected Population",
            "value": f"{total_affected_population:,}",
            "numeric_value": total_affected_population,
            "unit": "People",
            "change_pct": "+12,400",
            "trend": "up",
            "status": "ELEVATED",
            "status_color": "amber",
            "sparkline": [210000, 220000, 235000, 242000, 245000, 248000, total_affected_population],
            "description": "Across 7 NER Mountain Districts"
        },
        {
            "id": "kpi-infra",
            "title": "Critical Infrastructure",
            "value": "3 Highways / 1 Grid",
            "numeric_value": 4,
            "unit": "Assets",
            "change_pct": "1 Corridor Blocked",
            "trend": "down",
            "status": "HIGH RISK",
            "status_color": "rose",
            "sparkline": [0, 1, 1, 2, 2, 3, 4],
            "description": "NH-13, NH-10, BCT Highway, 132kV"
        }
    ]
    
    return {
        "success": True,
        "timestamp": "2026-09-09T19:30:00Z",
        "command_status": "HIGH ALERT LEVEL 2 (ORANGE/RED)",
        "kpis": kpis,
        "risk_distribution": {
            "CRITICAL": len([z for z in RISK_ZONES if z["risk_level"] == "CRITICAL"]),
            "HIGH": len([z for z in RISK_ZONES if z["risk_level"] == "HIGH"]),
            "MEDIUM": len([z for z in RISK_ZONES if z["risk_level"] == "MEDIUM"]),
            "LOW": len([z for z in RISK_ZONES if z["risk_level"] == "LOW"])
        },
        "recent_alerts": ALERTS[:4],
        "top_vulnerable_locations": LOCATIONS[:4]
    }
