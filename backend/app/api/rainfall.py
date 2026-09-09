"""
Rainfall Analytics & Threshold Monitoring API Endpoints
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(prefix="/rainfall", tags=["Rainfall Monitoring"])

class ThresholdConfig(BaseModel):
    normal_max: float = 50.0
    elevated_max: float = 100.0
    high_max: float = 150.0
    critical_min: float = 150.0

current_thresholds = ThresholdConfig()

@router.get("")
def get_rainfall_summary():
    """
    Returns multi-scale precipitation analytics for the North Eastern Region.
    """
    stations = [
        {
            "location": "Tawang Valley High Ridge",
            "station_id": "IMD-TWG-01",
            "hourly_mm": 42.4,
            "rain_24h_mm": 138.4,
            "rain_7d_mm": 412.0,
            "rain_30d_mm": 890.5,
            "anomaly_pct": "+34.5%",
            "threshold_status": "HIGH",
            "coordinates": [27.5857, 91.8676]
        },
        {
            "location": "Gangtok Ridge NH-10",
            "station_id": "IMD-GTK-02",
            "hourly_mm": 54.0,
            "rain_24h_mm": 184.2,
            "rain_7d_mm": 520.4,
            "rain_30d_mm": 1120.0,
            "anomaly_pct": "+48.2%",
            "threshold_status": "CRITICAL",
            "coordinates": [27.3389, 88.6065]
        },
        {
            "location": "Cherrapunji (Sohra) Escarpment",
            "station_id": "IMD-CHR-03",
            "hourly_mm": 68.0,
            "rain_24h_mm": 242.0,
            "rain_7d_mm": 860.0,
            "rain_30d_mm": 2180.0,
            "anomaly_pct": "+52.0%",
            "threshold_status": "CRITICAL",
            "coordinates": [25.2702, 91.7323]
        },
        {
            "location": "Bomdila Pass BCT Highway",
            "station_id": "IMD-BMD-04",
            "hourly_mm": 18.5,
            "rain_24h_mm": 72.5,
            "rain_7d_mm": 230.0,
            "rain_30d_mm": 580.0,
            "anomaly_pct": "+12.0%",
            "threshold_status": "ELEVATED",
            "coordinates": [27.2645, 92.4162]
        },
        {
            "location": "Itanagar Secretariat Complex",
            "station_id": "IMD-ITA-05",
            "hourly_mm": 6.2,
            "rain_24h_mm": 34.0,
            "rain_7d_mm": 120.0,
            "rain_30d_mm": 340.0,
            "anomaly_pct": "-8.5%",
            "threshold_status": "NORMAL",
            "coordinates": [27.0844, 93.6053]
        }
    ]
    
    # 24-Hour hourly breakdown trend
    hourly_trend = [
        {"hour": "00:00", "rainfall_mm": 12.0, "intensity_class": "Moderate"},
        {"hour": "03:00", "rainfall_mm": 18.5, "intensity_class": "Moderate"},
        {"hour": "06:00", "rainfall_mm": 26.0, "intensity_class": "Heavy"},
        {"hour": "09:00", "rainfall_mm": 41.2, "intensity_class": "Very Heavy"},
        {"hour": "12:00", "rainfall_mm": 58.0, "intensity_class": "Downpour"},
        {"hour": "15:00", "rainfall_mm": 46.5, "intensity_class": "Very Heavy"},
        {"hour": "18:00", "rainfall_mm": 38.0, "intensity_class": "Heavy"},
        {"hour": "21:00", "rainfall_mm": 31.4, "intensity_class": "Heavy"}
    ]
    
    # 30-Day cumulative vs normal baseline
    cumulative_30d = [
        {"day": f"Day {d}", "actual_mm": round(d * 32.5 + (d % 4 * 12)), "normal_mm": d * 22}
        for d in range(1, 31, 3)
    ]
    
    return {
        "success": True,
        "current_thresholds": current_thresholds.model_dump(),
        "stations": stations,
        "hourly_trend": hourly_trend,
        "cumulative_30d": cumulative_30d
    }

@router.post("/thresholds")
def update_thresholds(payload: ThresholdConfig):
    global current_thresholds
    current_thresholds = payload
    return {"success": True, "message": "Thresholds updated successfully", "thresholds": current_thresholds.model_dump()}
