"""
Soil Moisture & Geotechnical Saturation API Endpoints
"""
from fastapi import APIRouter

router = APIRouter(prefix="/soil-moisture", tags=["Soil Moisture"])

@router.get("")
def get_soil_moisture_data():
    """
    Returns multi-depth soil volumetric water content (VWC %) and pore pressure.
    """
    stations = [
        {
            "station_id": "SM-TWG-01",
            "name": "Tawang Valley Ridge Soil Station",
            "vwc_pct": 74.2,
            "pore_pressure_kpa": 14.8,
            "depth_profiles": [
                {"depth": "10 cm (Surface)", "moisture_pct": 82.5, "status": "Saturated"},
                {"depth": "30 cm (Root Zone)", "moisture_pct": 76.0, "status": "Near Saturation"},
                {"depth": "60 cm (Bedrock Interface)", "moisture_pct": 71.4, "status": "Elevated"},
                {"depth": "100 cm (Slip Plane)", "moisture_pct": 68.2, "status": "Critical Pore Rise"}
            ],
            "field_capacity_pct": 65.0,
            "saturation_index": 0.88,
            "risk_flag": "HIGH"
        },
        {
            "station_id": "SM-GTK-02",
            "name": "Gangtok NH-10 Colluvium Station",
            "vwc_pct": 86.4,
            "pore_pressure_kpa": 22.5,
            "depth_profiles": [
                {"depth": "10 cm (Surface)", "moisture_pct": 92.0, "status": "Hyper-Saturated"},
                {"depth": "30 cm (Root Zone)", "moisture_pct": 88.5, "status": "Hyper-Saturated"},
                {"depth": "60 cm (Bedrock Interface)", "moisture_pct": 85.0, "status": "Liquefaction Hazard"},
                {"depth": "100 cm (Slip Plane)", "moisture_pct": 81.2, "status": "Active Failure Zone"}
            ],
            "field_capacity_pct": 68.0,
            "saturation_index": 0.95,
            "risk_flag": "CRITICAL"
        },
        {
            "station_id": "SM-BMD-03",
            "name": "Bomdila Pass Soil Station",
            "vwc_pct": 58.0,
            "pore_pressure_kpa": 6.2,
            "depth_profiles": [
                {"depth": "10 cm (Surface)", "moisture_pct": 62.0, "status": "Normal"},
                {"depth": "30 cm (Root Zone)", "moisture_pct": 59.0, "status": "Normal"},
                {"depth": "60 cm (Bedrock Interface)", "moisture_pct": 56.5, "status": "Normal"},
                {"depth": "100 cm (Slip Plane)", "moisture_pct": 54.0, "status": "Normal"}
            ],
            "field_capacity_pct": 60.0,
            "saturation_index": 0.62,
            "risk_flag": "MEDIUM"
        }
    ]
    
    # 7-day soil moisture saturation trend
    trend_7d = [
        {"date": "Sep 03", "tawang": 52.0, "gangtok": 61.5, "bomdila": 44.0},
        {"date": "Sep 04", "tawang": 55.4, "gangtok": 66.0, "bomdila": 46.2},
        {"date": "Sep 05", "tawang": 61.0, "gangtok": 72.8, "bomdila": 49.0},
        {"date": "Sep 06", "tawang": 66.2, "gangtok": 78.4, "bomdila": 52.5},
        {"date": "Sep 07", "tawang": 70.5, "gangtok": 82.0, "bomdila": 55.0},
        {"date": "Sep 08", "tawang": 72.8, "gangtok": 85.2, "bomdila": 56.8},
        {"date": "Sep 09", "tawang": 74.2, "gangtok": 86.4, "bomdila": 58.0}
    ]
    
    return {
        "success": True,
        "stations": stations,
        "trend_7d": trend_7d
    }
