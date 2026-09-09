"""
Automated Verification Test Suite for AI-SlopeGuard Command Center
Tests all REST endpoints, ML physics inference, and simulation recalculation.
"""
import urllib.request
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api"

def test_endpoint(name, path, method="GET", body=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"} if body else {}
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            status = response.status
            content = json.loads(response.read().decode())
            print(f"  [PASS] {name:<35} -> HTTP {status}")
            return content
    except Exception as e:
        print(f"  [FAIL] {name:<35} -> Error: {e}")
        return None

def run_all_tests():
    print("\n========================================================")
    print("AI-SlopeGuard Command Center: Automated API Verification")
    print("========================================================\n")
    
    # 1. Dashboard
    dash = test_endpoint("Executive Dashboard", "/dashboard")
    assert dash and len(dash.get("kpis", [])) == 8, "Expected 8 KPIs"
    
    # 2. Risk Zones GeoJSON
    zones = test_endpoint("Risk Zones GeoJSON", "/risk/zones")
    assert zones and len(zones.get("features", [])) >= 4, "Expected >= 4 risk zones"
    
    # 3. Risk Zone Inspection
    zone_detail = test_endpoint("Tawang Inspection Detail", "/risk/zones/RZ-TWG-01")
    assert zone_detail and "factor_of_safety" in zone_detail, "Expected FoS metric"
    
    # 4. AI Recalculation
    recalc = test_endpoint("AI On-the-Fly Recalculation", "/risk/recalculate", method="POST", body={
        "rainfall_24h_mm": 180.0,
        "soil_moisture_pct": 88.0,
        "slope_deg": 38.4,
        "ground_movement_mm": 5.2
    })
    assert recalc and recalc["prediction"]["risk_level"] in ["HIGH", "CRITICAL"], "Expected High/Critical risk"
    
    # 5. IoT Sensors Fleet
    sensors = test_endpoint("IoT Sensors Fleet", "/sensors")
    assert sensors and sensors["count"] >= 6, "Expected >= 6 sensors"
    
    # 6. Rainfall Monitoring
    rain = test_endpoint("Rainfall Diurnal Analytics", "/rainfall")
    assert rain and len(rain.get("stations", [])) >= 3, "Expected rain stations"
    
    # 7. Soil Moisture Profile
    soil = test_endpoint("Soil Moisture Saturation", "/soil-moisture")
    assert soil and len(soil.get("stations", [])) >= 2, "Expected soil stations"
    
    # 8. Satellite & InSAR
    sat = test_endpoint("Satellite InSAR Deformation", "/satellite")
    assert sat and "comparison_slider" in sat, "Expected comparison slider"
    
    # 9. Terrain & DEM
    terrain = test_endpoint("Cartosat DEM Analytics", "/terrain")
    assert terrain and len(terrain.get("sectors", [])) >= 3, "Expected terrain sectors"
    
    # 10. Historical Landslides Archive
    history = test_endpoint("Historical Landslide Archive", "/landslides?limit=5")
    assert history and len(history.get("items", [])) >= 1, "Expected landslide records"
    
    # 11. Alerts Management
    alerts = test_endpoint("Active Disaster Alerts", "/alerts")
    assert alerts and alerts["total"] >= 2, "Expected active alerts"
    
    # 12. Emergency Resources
    emerg = test_endpoint("Emergency Resources Directory", "/emergency/resources")
    assert emerg and len(emerg["resources"]["shelters"]) >= 2, "Expected shelters"
    
    # 13. Evacuation Route
    evac = test_endpoint("Safe Evacuation Routing", "/emergency/evacuation-route/LOC-TWG-01")
    assert evac and "waypoints" in evac, "Expected evacuation waypoints"
    
    # 14. Simulation Engine
    sim = test_endpoint("Hackathon Simulation Engine", "/simulation/run", method="POST", body={
        "rainfall_increase_mm": 195.0,
        "soil_moisture_pct": 92.0,
        "ground_movement_mm": 6.8,
        "slope_tilt_deg": 38.4,
        "scenario_preset": "monsoon_cloudburst"
    })
    assert sim and sim["prediction"]["probability"] > 80.0, "Expected probability > 80%"
    
    # 15. Reports Generator
    rep = test_endpoint("Official NDMA Report Generator", "/reports/generate?report_type=daily&district=Tawang")
    assert rep and "report" in rep, "Expected generated report"
    
    # 16. AI Model Benchmarks
    models = test_endpoint("AI Model Registry & Metrics", "/models")
    assert models and models["metrics"]["accuracy"] > 0.90, "Expected accuracy > 90%"
    
    # 17. System Health
    health = test_endpoint("System Infrastructure Health", "/system/health")
    assert health and health["overall_status"] == "All Systems Fully Operational"
    
    # 18. Data Sources
    srcs = test_endpoint("Scientific Data Sources", "/system/data-sources")
    assert srcs and len(srcs["sources"]) >= 4, "Expected scientific sources"
    
    # 19. Global Search
    search = test_endpoint("Global Entity Search (Tawang)", "/search?q=Tawang")
    assert search and search["results"]["total_matches"] >= 3, "Expected search results"
    
    print("\n========================================================")
    print("ALL 19 AUTOMATED API ENDPOINTS VERIFIED SUCCESSFULLY (100% PASS)")
    print("========================================================\n")

if __name__ == "__main__":
    run_all_tests()
