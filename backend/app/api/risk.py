"""
Risk Zones and AI Prediction API Endpoints
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from app.mock_data.seed_data import RISK_ZONES, LOCATIONS, SENSORS
from app.ml.predictor import predictor
from app.ml.explainability import calculate_feature_contributions, generate_plain_english_explanation

router = APIRouter(prefix="/risk", tags=["Risk Management"])

class RecalculateRequest(BaseModel):
    location_id: Optional[str] = "LOC-TWG-01"
    rainfall_24h_mm: float
    soil_moisture_pct: float
    slope_deg: Optional[float] = 38.4
    ground_movement_mm: Optional[float] = 0.0
    elevation_m: Optional[float] = 3048.0

@router.get("/zones")
def get_risk_zones(district: Optional[str] = None, risk_level: Optional[str] = None):
    """
    Returns GeoJSON FeatureCollection of all monitored risk zones with polygons,
    environmental metrics, and nearest critical facilities.
    """
    zones = RISK_ZONES
    if risk_level:
        zones = [z for z in zones if z["risk_level"].upper() == risk_level.upper()]
        
    features = []
    for z in zones:
        features.append({
            "type": "Feature",
            "id": z["id"],
            "geometry": z["geometry"],
            "properties": {
                "id": z["id"],
                "location_id": z["location_id"],
                "name": z["name"],
                "risk_level": z["risk_level"],
                "probability": z["probability"],
                "confidence": z["confidence"],
                "dominant_cause": z["dominant_cause"],
                "rainfall_24h_mm": z["rainfall_24h_mm"],
                "soil_moisture_pct": z["soil_moisture_pct"],
                "slope_deg": z["slope_deg"],
                "elevation_m": z["elevation_m"],
                "ground_movement_mm": z["ground_movement_mm"],
                "temperature_c": z["temperature_c"],
                "humidity_pct": z["humidity_pct"],
                "nearest_sensor": z["nearest_sensor"],
                "nearest_road": z["nearest_road"],
                "nearest_hospital": z["nearest_hospital"],
                "population_affected": z["population_affected"],
                "color": "#ef4444" if z["risk_level"] == "CRITICAL" else (
                    "#f97316" if z["risk_level"] == "HIGH" else (
                        "#eab308" if z["risk_level"] == "MEDIUM" else "#22c55e"
                    )
                )
            }
        })
        
    return {
        "type": "FeatureCollection",
        "features": features
    }

@router.get("/zones/{zone_id}")
def get_risk_zone_detail(zone_id: str):
    """
    Retrieves deep inspection telemetry for a single risk polygon.
    """
    zone = next((z for z in RISK_ZONES if z["id"] == zone_id or z["location_id"] == zone_id), None)
    if not zone:
        raise HTTPException(status_code=404, detail="Risk Zone not found")
        
    location = next((loc for loc in LOCATIONS if loc["id"] == zone["location_id"]), None)
    contributions = calculate_feature_contributions(
        rainfall_24h_mm=zone["rainfall_24h_mm"],
        soil_moisture_pct=zone["soil_moisture_pct"],
        slope_deg=zone["slope_deg"],
        ground_movement_mm=zone["ground_movement_mm"],
        elevation_m=zone["elevation_m"]
    )
    
    fos = predictor.calculate_factor_of_safety(zone["slope_deg"], zone["soil_moisture_pct"])
    explanation = generate_plain_english_explanation(
        zone_name=zone["name"],
        probability=zone["probability"],
        risk_level=zone["risk_level"],
        rainfall_24h_mm=zone["rainfall_24h_mm"],
        soil_moisture_pct=zone["soil_moisture_pct"],
        slope_deg=zone["slope_deg"],
        ground_movement_mm=zone["ground_movement_mm"],
        factor_of_safety=fos
    )
    
    nearby_sensors = [s for s in SENSORS if s["location_id"] == zone["location_id"]]
    
    return {
        "success": True,
        "zone": zone,
        "location": location,
        "factor_of_safety": fos,
        "contributions": contributions,
        "explanation": explanation,
        "nearby_sensors": nearby_sensors
    }

@router.post("/recalculate")
def recalculate_risk(payload: RecalculateRequest):
    """
    On-the-fly dynamic AI recalculation triggered by simulation sliders or sensor drifts.
    """
    pred = predictor.predict_landslide_probability(
        rainfall_24h_mm=payload.rainfall_24h_mm,
        soil_moisture_pct=payload.soil_moisture_pct,
        slope_deg=payload.slope_deg or 35.0,
        ground_movement_mm=payload.ground_movement_mm or 0.0,
        elevation_m=payload.elevation_m or 2500.0
    )
    
    contributions = calculate_feature_contributions(
        rainfall_24h_mm=payload.rainfall_24h_mm,
        soil_moisture_pct=payload.soil_moisture_pct,
        slope_deg=payload.slope_deg or 35.0,
        ground_movement_mm=payload.ground_movement_mm or 0.0,
        elevation_m=payload.elevation_m or 2500.0
    )
    
    explanation = generate_plain_english_explanation(
        zone_name="Simulated Regional Sector",
        probability=pred["probability"],
        risk_level=pred["risk_level"],
        rainfall_24h_mm=payload.rainfall_24h_mm,
        soil_moisture_pct=payload.soil_moisture_pct,
        slope_deg=payload.slope_deg or 35.0,
        ground_movement_mm=payload.ground_movement_mm or 0.0,
        factor_of_safety=pred["factor_of_safety"]
    )
    
    return {
        "success": True,
        "prediction": pred,
        "contributions": contributions,
        "explanation": explanation
    }
