"""
Hackathon Demonstration Simulation Engine API Endpoints
Enables interactive stress-testing of environmental factors and spontaneous AI hazard escalation.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from app.ml.predictor import predictor
from app.ml.explainability import calculate_feature_contributions, generate_plain_english_explanation

router = APIRouter(prefix="/simulation", tags=["Simulation Engine"])

class SimulationRequest(BaseModel):
    rainfall_increase_mm: float = 80.0
    soil_moisture_pct: float = 85.0
    ground_movement_mm: float = 5.5
    slope_tilt_deg: float = 38.4
    simulate_sensor_failure: bool = False
    scenario_preset: Optional[str] = "monsoon_cloudburst" # 'monsoon_cloudburst', 'rapid_saturation', 'fault_slip'

@router.post("/run")
def run_simulation(payload: SimulationRequest):
    """
    Executes real-time physics and ML simulation based on user-controlled sliders.
    Recalculates Factor of Safety, probability, risk level, and generates spontaneous alert.
    """
    effective_rain = payload.rainfall_increase_mm
    effective_moisture = payload.soil_moisture_pct
    effective_movement = payload.ground_movement_mm
    effective_slope = payload.slope_tilt_deg
    
    # Preset modifiers
    if payload.scenario_preset == "monsoon_cloudburst":
        effective_rain = max(160.0, effective_rain)
        effective_moisture = max(88.0, effective_moisture)
    elif payload.scenario_preset == "fault_slip":
        effective_movement = max(7.2, effective_movement)
        
    pred = predictor.predict_landslide_probability(
        rainfall_24h_mm=effective_rain,
        soil_moisture_pct=effective_moisture,
        slope_deg=effective_slope,
        ground_movement_mm=effective_movement,
        elevation_m=3048.0
    )
    
    contributions = calculate_feature_contributions(
        rainfall_24h_mm=effective_rain,
        soil_moisture_pct=effective_moisture,
        slope_deg=effective_slope,
        ground_movement_mm=effective_movement,
        elevation_m=3048.0
    )
    
    explanation = generate_plain_english_explanation(
        zone_name="Tawang Sector Simulation Sandbox",
        probability=pred["probability"],
        risk_level=pred["risk_level"],
        rainfall_24h_mm=effective_rain,
        soil_moisture_pct=effective_moisture,
        slope_deg=effective_slope,
        ground_movement_mm=effective_movement,
        factor_of_safety=pred["factor_of_safety"]
    )
    
    # Generate simulated spontaneous alert if probability >= 50%
    simulated_alert = None
    if pred["probability"] >= 50.0:
        simulated_alert = {
            "id": "SIM-ALT-LIVE-01",
            "title": f"SIMULATION TRIGGER: {pred['risk_level']} Early Warning Generated",
            "severity": pred["risk_level"].lower(),
            "probability": pred["probability"],
            "factor_of_safety": pred["factor_of_safety"],
            "triggered_factors": [
                f"Rainfall pushed to {effective_rain:.1f} mm/24h",
                f"Soil moisture saturated to {effective_moisture:.1f}%",
                f"Ground displacement accelerated to {effective_movement:.1f} mm"
            ],
            "evacuation_recommended": pred["probability"] >= 75.0,
            "simulated_sensor_status": "OFFLINE (Failed)" if payload.simulate_sensor_failure else "ONLINE (Active Creep)"
        }
        
    return {
        "success": True,
        "scenario": payload.scenario_preset,
        "input_parameters": {
            "rainfall_mm": effective_rain,
            "soil_moisture_pct": effective_moisture,
            "ground_movement_mm": effective_movement,
            "slope_deg": effective_slope,
            "sensor_failure": payload.simulate_sensor_failure
        },
        "prediction": pred,
        "contributions": contributions,
        "explanation": explanation,
        "spontaneous_alert": simulated_alert,
        "map_color_shift": {
            "CRITICAL": "#ef4444",
            "HIGH": "#f97316",
            "MEDIUM": "#eab308",
            "LOW": "#22c55e"
        }[pred["risk_level"]]
    }
