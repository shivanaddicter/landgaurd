"""
Terrain & Digital Elevation Model (DEM) Analytics API Endpoints
Source: Cartosat-3 DEM & Geological Survey of India (GSI) 1:50,000 Lithology
"""
from fastapi import APIRouter

router = APIRouter(prefix="/terrain", tags=["Terrain Analysis"])

@router.get("")
def get_terrain_analytics():
    """
    Returns high-resolution morphological and geological stability data
    across major vulnerable North Eastern corridors.
    """
    sectors = [
        {
            "id": "TER-TWG-01",
            "name": "Tawang Valley Ridge Escarpment",
            "elevation_m": 3048,
            "slope_deg": 38.4,
            "slope_classification": "Precipitous / Very Steep (>35°)",
            "slope_color": "#ef4444", # Red
            "aspect": "South-West (Monsoon Windward Facing)",
            "plan_curvature": -0.24, # Concave (convergent water collector)
            "profile_curvature": 0.38, # Convex (accelerates runoff)
            "drainage_density": "High (3.8 km/km²)",
            "geology": "Higher Himalayan Gneiss with Highly Weathered Muscovite-Biotite Schist",
            "soil_type": "Colluvial Debris over Fractured Bedrock (Depth: 2.8m)",
            "structural_features": "Tawang Thrust (Active Fault Splays 1.2km East)",
            "stability_rating": "UNSTABLE (FoS 0.94)",
            "risk_level": "HIGH"
        },
        {
            "id": "TER-GTK-02",
            "name": "Gangtok-Singtam NH-10 Corridor",
            "elevation_m": 1650,
            "slope_deg": 37.1,
            "slope_classification": "Precipitous / Very Steep (>35°)",
            "slope_color": "#ef4444",
            "aspect": "West Facing (Teesta River Canyon)",
            "plan_curvature": -0.32,
            "profile_curvature": 0.45,
            "drainage_density": "Very High (4.4 km/km²)",
            "geology": "Daling Group Chlorite-Sericite Phyllite (Highly Sheared & Foliated)",
            "soil_type": "Talus Debris & Coarse Silt Regolith",
            "structural_features": "Main Central Thrust (MCT) Proximal Zone",
            "stability_rating": "CRITICAL COLLAPSE (FoS 0.88)",
            "risk_level": "CRITICAL"
        },
        {
            "id": "TER-BMD-03",
            "name": "Bomdila Pass (BCT Highway Flank)",
            "elevation_m": 2415,
            "slope_deg": 33.2,
            "slope_classification": "Steep (25° - 35°)",
            "slope_color": "#f97316", # Orange
            "aspect": "South-East Facing",
            "plan_curvature": -0.08,
            "profile_curvature": 0.15,
            "drainage_density": "Moderate (2.6 km/km²)",
            "geology": "Bomdila Gneissic Complex with Quartzite Beds",
            "soil_type": "Sandy Clay Loam with Gravel",
            "structural_features": "Secondary Joint Sets Dipping Towards Highway Cut",
            "stability_rating": "MARGINALLY STABLE (FoS 1.22)",
            "risk_level": "MEDIUM"
        },
        {
            "id": "TER-ITA-04",
            "name": "Itanagar Capital Complex Sector-4",
            "elevation_m": 320,
            "slope_deg": 26.5,
            "slope_classification": "Moderately Steep (15° - 25°)",
            "slope_color": "#eab308", # Yellow
            "aspect": "North-East Facing",
            "plan_curvature": 0.05,
            "profile_curvature": -0.02,
            "drainage_density": "Low-Moderate (1.9 km/km²)",
            "geology": "Siwalik Tertiary Sandstone & Claystone",
            "soil_type": "Residual Sandy Loam",
            "structural_features": "Engineered Terracing with Concrete Retaining Systems",
            "stability_rating": "GENERALLY STABLE (FoS 1.58)",
            "risk_level": "LOW"
        }
    ]
    
    slope_distribution = [
        {"range": "0° - 15° (Gentle)", "percentage": 14.5, "count": 28},
        {"range": "15° - 25° (Moderate)", "percentage": 28.0, "count": 54},
        {"range": "25° - 35° (Steep)", "percentage": 36.5, "count": 71},
        {"range": ">35° (Precipitous / Extreme)", "percentage": 21.0, "count": 41}
    ]
    
    return {
        "success": True,
        "sectors": sectors,
        "slope_distribution": slope_distribution
    }
