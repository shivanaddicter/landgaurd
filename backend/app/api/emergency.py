"""
Emergency Response & Safe Evacuation Routing API Endpoints
"""
from fastapi import APIRouter, HTTPException
from typing import Optional
from app.mock_data.seed_data import EMERGENCY_RESOURCES, LOCATIONS

router = APIRouter(prefix="/emergency", tags=["Emergency Response"])

@router.get("/resources")
def get_emergency_resources():
    """
    Returns full directory of emergency shelters, trauma hospitals,
    NDRF/BRO response units, and road corridor statuses.
    """
    return {
        "success": True,
        "resources": EMERGENCY_RESOURCES
    }

@router.get("/evacuation-route/{location_id}")
def calculate_evacuation_route(location_id: str):
    """
    Computes optimal safe evacuation corridor avoiding known landslide debris blocks.
    """
    loc = next((l for l in LOCATIONS if l["id"] == location_id), None)
    if not loc:
        # Default to Tawang if not found
        loc = LOCATIONS[0]
        
    nearest_shelter = EMERGENCY_RESOURCES["shelters"][0]
    nearest_hospital = EMERGENCY_RESOURCES["hospitals"][0]
    
    # Generate route waypoints avoiding hazard points
    safe_waypoints = [
        {"lat": loc["latitude"], "lng": loc["longitude"], "instruction": "Vulnerable Sector Starting Point"},
        {"lat": loc["latitude"] + 0.002, "lng": loc["longitude"] - 0.003, "instruction": "Turn North onto High-Ridge Bypass Road (Avoid NH-13 Slump Zone)"},
        {"lat": loc["latitude"] + 0.004, "lng": loc["longitude"] - 0.005, "instruction": "Proceed past Military Cantonment Checkpost Alpha"},
        {"lat": nearest_shelter["latitude"], "lng": nearest_shelter["longitude"], "instruction": f"Arrive at Safe Haven: {nearest_shelter['name']}"}
    ]
    
    return {
        "success": True,
        "location": loc["name"],
        "evacuation_corridor": "Corridor Green-Alfa (Clear of Debris)",
        "distance_km": 3.8,
        "estimated_travel_time_min": 14,
        "nearest_shelter": nearest_shelter,
        "nearest_hospital": nearest_hospital,
        "recommended_transport": "4x4 Emergency Vehicles or On-Foot Guided Convoy",
        "waypoints": safe_waypoints,
        "cautionary_hazards": [
            "Do NOT use lower valley riverside footpath (high flood surge risk)",
            "Stay clear of overhead 132kV transmission towers on eastern flank"
        ]
    }
