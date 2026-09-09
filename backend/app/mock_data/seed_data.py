"""
Realistic Geospatial and Sensor Seed Data for North Eastern Region (NER)
States: Arunachal Pradesh, Assam, Meghalaya, Sikkim
"""
from datetime import datetime, timezone

LOCATIONS = [
    {
        "id": "LOC-TWG-01",
        "name": "Tawang Valley Ridge & NH-13 Corridor",
        "district": "Tawang",
        "state": "Arunachal Pradesh",
        "latitude": 27.5857,
        "longitude": 91.8676,
        "elevation_m": 3048,
        "average_slope_deg": 38.4,
        "population_affected": 28400,
        "critical_infra": "NH-13 Trans-Arunachal Highway, 132kV Substation, Military Supply Corridor",
        "risk_level": "HIGH",
        "landslide_probability": 82.5,
        "confidence_score": 91.0,
        "dominant_cause": "Intense Monsoon Precipitation & Severe Slope Surcharge",
        "soil_type": "Gneissic Colluvium & Weathered Phyllite",
        "vegetation_ndvi": 0.54,
        "drainage_condition": "Poor / Subsurface Pore Overpressure"
    },
    {
        "id": "LOC-BMD-02",
        "name": "Bomdila Pass Escarpment (BCT Road)",
        "district": "West Kameng",
        "state": "Arunachal Pradesh",
        "latitude": 27.2645,
        "longitude": 92.4162,
        "elevation_m": 2415,
        "average_slope_deg": 33.2,
        "population_affected": 14200,
        "critical_infra": "Balipara-Charduar-Tawang (BCT) Highway, District Civil Hospital",
        "risk_level": "MEDIUM",
        "landslide_probability": 48.0,
        "confidence_score": 88.5,
        "dominant_cause": "Toe-Erosion from Mountain Streams & Road Cutting",
        "soil_type": "Schistose Regolith with Silt Pockets",
        "vegetation_ndvi": 0.68,
        "drainage_condition": "Moderate Natural Gullies"
    },
    {
        "id": "LOC-ITA-03",
        "name": "Itanagar Capital Complex Sector-4 Hills",
        "district": "Papum Pare",
        "state": "Arunachal Pradesh",
        "latitude": 27.0844,
        "longitude": 93.6053,
        "elevation_m": 320,
        "average_slope_deg": 26.5,
        "population_affected": 59300,
        "critical_infra": "Civil Secretariat, Banderdewa-Itanagar Four-Lane Highway",
        "risk_level": "LOW",
        "landslide_probability": 21.0,
        "confidence_score": 93.2,
        "dominant_cause": "Urban Hill Terracing & Deforestation",
        "soil_type": "Tertiary Sandstone & Siltstone",
        "vegetation_ndvi": 0.62,
        "drainage_condition": "Adequate Storm Drains"
    },
    {
        "id": "LOC-TEZ-04",
        "name": "Tezpur Riverine Bluff & Foothills",
        "district": "Sonitpur",
        "state": "Assam",
        "latitude": 26.6528,
        "longitude": 92.7926,
        "elevation_m": 48,
        "average_slope_deg": 8.1,
        "population_affected": 102500,
        "critical_infra": "Kolia Bhomora Setu (Brahmaputra Bridge), Indian Air Force Base",
        "risk_level": "LOW",
        "landslide_probability": 11.5,
        "confidence_score": 96.0,
        "dominant_cause": "Riverbank Slumping during Brahmaputra Flood Crest",
        "soil_type": "Alluvial Sand & Clayey Silt",
        "vegetation_ndvi": 0.73,
        "drainage_condition": "Flat River Basin"
    },
    {
        "id": "LOC-GHY-05",
        "name": "Guwahati Nilachal & Narakasur Hills",
        "district": "Kamrup Metropolitan",
        "state": "Assam",
        "latitude": 26.1856,
        "longitude": 91.7077,
        "elevation_m": 165,
        "average_slope_deg": 28.7,
        "population_affected": 88000,
        "critical_infra": "Kamakhya Pilgrim Bypass, Water Treatment Plant, Railway Line",
        "risk_level": "MEDIUM",
        "landslide_probability": 46.2,
        "confidence_score": 89.4,
        "dominant_cause": "Unplanned Hill Settlement & Slope Excavation",
        "soil_type": "Granitic Precambrian Basement Regolith",
        "vegetation_ndvi": 0.49,
        "drainage_condition": "Clogged Hill Nullahs"
    },
    {
        "id": "LOC-GTK-06",
        "name": "Gangtok Ridge & National Highway 10",
        "district": "East Sikkim",
        "state": "Sikkim",
        "latitude": 27.3389,
        "longitude": 88.6065,
        "elevation_m": 1650,
        "average_slope_deg": 37.1,
        "population_affected": 42000,
        "critical_infra": "NH-10 Lifeline, STNM Central Hospital, Chhangu Border Route",
        "risk_level": "CRITICAL",
        "landslide_probability": 89.5,
        "confidence_score": 94.8,
        "dominant_cause": "High Antecedent Moisture, Active Thrust Fault, Cloudburst",
        "soil_type": "Mica Schist & Phyllitic Debris",
        "vegetation_ndvi": 0.58,
        "drainage_condition": "Severe Subsurface Seepage"
    },
    {
        "id": "LOC-CHR-07",
        "name": "Cherrapunji (Sohra) Rim Escarpment",
        "district": "East Khasi Hills",
        "state": "Meghalaya",
        "latitude": 25.2702,
        "longitude": 91.7323,
        "elevation_m": 1430,
        "average_slope_deg": 41.5,
        "population_affected": 18500,
        "critical_infra": "Shillong-Sohra Scenic Highway, Hydropower Catchment",
        "risk_level": "HIGH",
        "landslide_probability": 76.4,
        "confidence_score": 92.1,
        "dominant_cause": "Hyper-Precipitation (>300mm/day) & Karstic Collapse",
        "soil_type": "Limestone Sandstone Alternations",
        "vegetation_ndvi": 0.77,
        "drainage_condition": "Karst Sinkholes & Flash Surface Cascades"
    }
]

# GeoJSON Risk Zones matching the locations
RISK_ZONES = [
    {
        "id": "RZ-TWG-01",
        "location_id": "LOC-TWG-01",
        "name": "Tawang Valley High-Ridge Sector",
        "risk_level": "HIGH",
        "probability": 82.5,
        "confidence": 91.0,
        "dominant_cause": "Heavy continuous precipitation & high soil saturation",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [91.845, 27.575],
                [91.885, 27.575],
                [91.895, 27.598],
                [91.850, 27.602],
                [91.845, 27.575]
            ]]
        },
        "rainfall_24h_mm": 138.4,
        "soil_moisture_pct": 74.2,
        "slope_deg": 38.4,
        "elevation_m": 3048,
        "ground_movement_mm": 4.8,
        "temperature_c": 14.2,
        "humidity_pct": 92.0,
        "nearest_sensor": "SNS-TWG-RF-01",
        "nearest_road": "NH-13 Trans-Arunachal Highway (0.4 km)",
        "nearest_hospital": "District Hospital Tawang (2.1 km)",
        "population_affected": 28400
    },
    {
        "id": "RZ-BMD-02",
        "location_id": "LOC-BMD-02",
        "name": "Bomdila Pass Highway Flank",
        "risk_level": "MEDIUM",
        "probability": 48.0,
        "confidence": 88.5,
        "dominant_cause": "Moderate rain & toe cutting along highway",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [92.395, 27.250],
                [92.435, 27.250],
                [92.440, 27.280],
                [92.400, 27.285],
                [92.395, 27.250]
            ]]
        },
        "rainfall_24h_mm": 72.5,
        "soil_moisture_pct": 58.0,
        "slope_deg": 33.2,
        "elevation_m": 2415,
        "ground_movement_mm": 1.9,
        "temperature_c": 16.8,
        "humidity_pct": 84.0,
        "nearest_sensor": "SNS-BMD-SM-02",
        "nearest_road": "BCT Highway km 68 (0.2 km)",
        "nearest_hospital": "Bomdila Sub-Divisional Hospital (3.4 km)",
        "population_affected": 14200
    },
    {
        "id": "RZ-ITA-03",
        "location_id": "LOC-ITA-03",
        "name": "Itanagar Ganga Lake Hill Slope",
        "risk_level": "LOW",
        "probability": 21.0,
        "confidence": 93.2,
        "dominant_cause": "Stable bedrock, moderate slope, engineered retaining wall",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [93.585, 27.070],
                [93.625, 27.070],
                [93.630, 27.100],
                [93.590, 27.105],
                [93.585, 27.070]
            ]]
        },
        "rainfall_24h_mm": 34.0,
        "soil_moisture_pct": 41.5,
        "slope_deg": 26.5,
        "elevation_m": 320,
        "ground_movement_mm": 0.4,
        "temperature_c": 24.5,
        "humidity_pct": 76.0,
        "nearest_sensor": "SNS-ITA-TL-03",
        "nearest_road": "NH-415 Four Lane (0.8 km)",
        "nearest_hospital": "Tomo Riba Institute of Health (TRIHMS) (4.2 km)",
        "population_affected": 59300
    },
    {
        "id": "RZ-GTK-04",
        "location_id": "LOC-GTK-06",
        "name": "Gangtok-Singtam NH-10 Corridor",
        "risk_level": "CRITICAL",
        "probability": 89.5,
        "confidence": 94.8,
        "dominant_cause": "Severe pore pressure, 172mm rain in 18h, active shear plane",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [98.585, 27.320],
                [98.625, 27.320],
                [98.630, 27.355],
                [98.590, 27.360],
                [98.585, 27.320]
            ]]
        },
        "rainfall_24h_mm": 184.2,
        "soil_moisture_pct": 86.4,
        "slope_deg": 37.1,
        "elevation_m": 1650,
        "ground_movement_mm": 8.6,
        "temperature_c": 15.1,
        "humidity_pct": 98.0,
        "nearest_sensor": "SNS-GTK-GM-06",
        "nearest_road": "NH-10 Lifeline Corridor (0.1 km)",
        "nearest_hospital": "STNM Multispeciality Hospital (1.5 km)",
        "population_affected": 42000
    },
    {
        "id": "RZ-CHR-05",
        "location_id": "LOC-CHR-07",
        "name": "Nohkalikai Escarpment Edge",
        "risk_level": "HIGH",
        "probability": 76.4,
        "confidence": 92.1,
        "dominant_cause": "Extreme torrential monsoon downpour & limestone dissolution",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [91.715, 25.255],
                [91.750, 25.255],
                [91.755, 25.285],
                [91.720, 25.290],
                [91.715, 25.255]
            ]]
        },
        "rainfall_24h_mm": 242.0,
        "soil_moisture_pct": 88.0,
        "slope_deg": 41.5,
        "elevation_m": 1430,
        "ground_movement_mm": 5.2,
        "temperature_c": 19.2,
        "humidity_pct": 99.0,
        "nearest_sensor": "SNS-CHR-RF-07",
        "nearest_road": "Sohra-Shella Road (0.6 km)",
        "nearest_hospital": "Cherrapunji Community Health Centre (2.8 km)",
        "population_affected": 18500
    }
]

# IoT Sensors Fleet
SENSORS = [
    {
        "id": "SNS-TWG-RF-01",
        "location_id": "LOC-TWG-01",
        "location_name": "Tawang High Ridge",
        "type": "rainfall",
        "name": "Tipping-Bucket Pluviometer Station Alpha",
        "latitude": 27.5872,
        "longitude": 91.8690,
        "battery_pct": 94.5,
        "signal_rssi": -68,
        "status": "online",
        "current_value": 42.4,
        "unit": "mm/hr",
        "last_update": "2 mins ago",
        "hardware_uid": "LORA-TWG-RF-868-01",
        "sampling_rate": "1 min"
    },
    {
        "id": "SNS-TWG-SM-01",
        "location_id": "LOC-TWG-01",
        "location_name": "Tawang Slope Mid-Face",
        "type": "soil_moisture",
        "name": "Multi-Depth TDR Soil Saturation Probe",
        "latitude": 27.5861,
        "longitude": 91.8682,
        "battery_pct": 89.0,
        "signal_rssi": -72,
        "status": "warning",
        "current_value": 74.2,
        "unit": "%",
        "last_update": "1 min ago",
        "hardware_uid": "LORA-TWG-SM-868-02",
        "sampling_rate": "5 min"
    },
    {
        "id": "SNS-TWG-GM-01",
        "location_id": "LOC-TWG-01",
        "location_name": "Tawang Toe Bench",
        "type": "ground_movement",
        "name": "Sub-Millimeter Wire Extensometer & Inclinometer",
        "latitude": 27.5849,
        "longitude": 91.8665,
        "battery_pct": 81.2,
        "signal_rssi": -75,
        "status": "critical",
        "current_value": 4.8,
        "unit": "mm",
        "last_update": "30 secs ago",
        "hardware_uid": "LORA-TWG-GM-868-03",
        "sampling_rate": "30 sec"
    },
    {
        "id": "SNS-TWG-TL-01",
        "location_id": "LOC-TWG-01",
        "location_name": "Tawang Upper Cliff",
        "type": "tilt",
        "name": "MEMS Biaxial Tiltmeter",
        "latitude": 27.5880,
        "longitude": 91.8698,
        "battery_pct": 92.0,
        "signal_rssi": -65,
        "status": "warning",
        "current_value": 3.2,
        "unit": "°",
        "last_update": "1 min ago",
        "hardware_uid": "LORA-TWG-TL-868-04",
        "sampling_rate": "1 min"
    },
    {
        "id": "SNS-BMD-SM-02",
        "location_id": "LOC-BMD-02",
        "location_name": "Bomdila Pass",
        "type": "soil_moisture",
        "name": "FDR Capacitive Moisture Node",
        "latitude": 27.2652,
        "longitude": 92.4170,
        "battery_pct": 96.0,
        "signal_rssi": -62,
        "status": "online",
        "current_value": 58.0,
        "unit": "%",
        "last_update": "4 mins ago",
        "hardware_uid": "LORA-BMD-SM-868-01",
        "sampling_rate": "5 min"
    },
    {
        "id": "SNS-BMD-RF-02",
        "location_id": "LOC-BMD-02",
        "location_name": "Bomdila Camp",
        "type": "rainfall",
        "name": "Optical Rain Gauge Station",
        "latitude": 27.2638,
        "longitude": 92.4151,
        "battery_pct": 88.4,
        "signal_rssi": -78,
        "status": "online",
        "current_value": 18.5,
        "unit": "mm/hr",
        "last_update": "3 mins ago",
        "hardware_uid": "LORA-BMD-RF-868-02",
        "sampling_rate": "1 min"
    },
    {
        "id": "SNS-ITA-TL-03",
        "location_id": "LOC-ITA-03",
        "location_name": "Itanagar Secretariat Hill",
        "type": "tilt",
        "name": "Smart Geospatial Inclinometer Node",
        "latitude": 27.0850,
        "longitude": 93.6060,
        "battery_pct": 98.2,
        "signal_rssi": -55,
        "status": "online",
        "current_value": 0.8,
        "unit": "°",
        "last_update": "5 mins ago",
        "hardware_uid": "LORA-ITA-TL-868-01",
        "sampling_rate": "10 min"
    },
    {
        "id": "SNS-GTK-GM-06",
        "location_id": "LOC-GTK-06",
        "location_name": "Gangtok NH-10 Slope",
        "type": "ground_movement",
        "name": "Differential GNSS Geodetic Monitoring Station",
        "latitude": 27.3400,
        "longitude": 88.6080,
        "battery_pct": 74.0,
        "signal_rssi": -81,
        "status": "critical",
        "current_value": 8.6,
        "unit": "mm",
        "last_update": "10 secs ago",
        "hardware_uid": "GNSS-GTK-01-UBLOX",
        "sampling_rate": "10 sec"
    },
    {
        "id": "SNS-CHR-RF-07",
        "location_id": "LOC-CHR-07",
        "location_name": "Cherrapunji Observatory",
        "type": "rainfall",
        "name": "High-Capacity Siphon Rain Gauge",
        "latitude": 25.2715,
        "longitude": 91.7335,
        "battery_pct": 91.0,
        "signal_rssi": -69,
        "status": "online",
        "current_value": 68.0,
        "unit": "mm/hr",
        "last_update": "1 min ago",
        "hardware_uid": "IMD-CHR-SYP-01",
        "sampling_rate": "1 min"
    },
    {
        "id": "SNS-GHY-TH-05",
        "location_id": "LOC-GHY-05",
        "location_name": "Kamakhya Foothill",
        "type": "temperature",
        "name": "Microclimate Ambient Temperature & Humidity",
        "latitude": 26.1865,
        "longitude": 91.7088,
        "battery_pct": 87.5,
        "signal_rssi": -60,
        "status": "online",
        "current_value": 29.4,
        "unit": "°C",
        "last_update": "2 mins ago",
        "hardware_uid": "SHT40-GHY-TH-01",
        "sampling_rate": "5 min"
    }
]

# Active Alerts
ALERTS = [
    {
        "id": "ALT-2026-0041",
        "location_id": "LOC-TWG-01",
        "location_name": "Tawang Valley Ridge & NH-13",
        "district": "Tawang",
        "state": "Arunachal Pradesh",
        "severity": "critical",
        "title": "URGENT: Imminent Slope Failure Threat along NH-13",
        "description": "24h rainfall exceeded 138mm. Subsurface soil saturation reached 74.2% with active shear displacement of 4.8mm detected by sensor SNS-TWG-GM-01.",
        "risk_score": 82.5,
        "affected_population": 28400,
        "recommended_actions": "1. Restrict all civilian transit along NH-13 Km 42-49.\n2. Evacuate 45 hillside homesteads to Tawang Higher Secondary Shelter.\n3. Position NDRF 12th Bn clearance bulldozer at Tawang bypass junction.",
        "nearest_center": "Tawang Community Shelter & STNM Emergency Cell",
        "status": "active",
        "triggered_at": "2026-09-09T18:30:00Z"
    },
    {
        "id": "ALT-2026-0042",
        "location_id": "LOC-GTK-06",
        "location_name": "Gangtok-Singtam NH-10 Corridor",
        "district": "East Sikkim",
        "state": "Sikkim",
        "severity": "critical",
        "title": "CRITICAL: Debris Flow Warning on NH-10 Lifeline",
        "description": "Continuous cloudburst event (184mm in 24h). GNSS displacement accelerating at 8.6mm/day. Extreme probability of mudslide blocking Teesta corridor.",
        "risk_score": 89.5,
        "affected_population": 42000,
        "recommended_actions": "Activate Siren Alert 3. Halt vehicular movement at Rangpo check-post. Divert freight via Lava-Kalimpong alternate route.",
        "nearest_center": "STNM Multispeciality Disaster Ward",
        "status": "active",
        "triggered_at": "2026-09-09T19:05:00Z"
    },
    {
        "id": "ALT-2026-0039",
        "location_id": "LOC-CHR-07",
        "location_name": "Cherrapunji Rim Escarpment",
        "district": "East Khasi Hills",
        "state": "Meghalaya",
        "severity": "high",
        "title": "HIGH ALERT: Torrential Precipitation & Karst Slump",
        "description": "Precipitation crossed 240mm threshold. Soil moisture at 88%. Waterfall cascade scouring base of Sohra escarpment.",
        "risk_score": 76.4,
        "affected_population": 18500,
        "recommended_actions": "Issue yellow alert to all downstream village councils (Dorbar Shnong). Avoid canyon trek routes.",
        "nearest_center": "Cherrapunji Community Health Centre",
        "status": "acknowledged",
        "triggered_at": "2026-09-09T17:15:00Z"
    },
    {
        "id": "ALT-2026-0038",
        "location_id": "LOC-BMD-02",
        "location_name": "Bomdila Pass BCT Highway",
        "district": "West Kameng",
        "state": "Arunachal Pradesh",
        "severity": "medium",
        "title": "ELEVATED RISK: Minor Toe Sloughing near BCT Km 68",
        "description": "Pore pressure rising in schistose formation. Minor rockfall debris observed on shoulder.",
        "risk_score": 48.0,
        "affected_population": 14200,
        "recommended_actions": "BRO (Border Roads Organisation) Project Vartak patrol dispatched. Single-lane movement advised.",
        "nearest_center": "Bomdila Sub-Divisional Hospital",
        "status": "acknowledged",
        "triggered_at": "2026-09-09T16:00:00Z"
    }
]

# Historical Landslide Records
HISTORICAL_LANDSLIDES = [
    {
        "id": "LS-2024-NER-102",
        "location_name": "Tawang-Lumla Road km 18",
        "district": "Tawang",
        "state": "Arunachal Pradesh",
        "date": "2024-06-28",
        "rainfall_trigger_mm": 194.5,
        "severity": "CRITICAL",
        "deaths": 3,
        "affected_population": 8500,
        "infrastructure_damage": "220 meters of NH-13 washed away, fiber optic cable severed for 4 days",
        "triggering_factor": "Monsoon cloudburst + saturated debris slide",
        "latitude": 27.5620,
        "longitude": 91.8150
    },
    {
        "id": "LS-2024-NER-089",
        "location_name": "NH-10 29th Mile Teesta Basin",
        "district": "East Sikkim",
        "state": "Sikkim",
        "date": "2024-06-14",
        "rainfall_trigger_mm": 210.0,
        "severity": "CRITICAL",
        "deaths": 6,
        "affected_population": 25000,
        "infrastructure_damage": "NH-10 closed for 14 days; multiple vehicles buried; supply chain disrupted",
        "triggering_factor": "Toe erosion by swollen Teesta River + heavy rain",
        "latitude": 27.2840,
        "longitude": 88.5210
    },
    {
        "id": "LS-2023-NER-055",
        "location_name": "Bhalukpong-Bomdila Road (Sessa Slide)",
        "district": "West Kameng",
        "state": "Arunachal Pradesh",
        "date": "2023-08-19",
        "rainfall_trigger_mm": 168.0,
        "severity": "HIGH",
        "deaths": 0,
        "affected_population": 12000,
        "infrastructure_damage": "Road blocked for 48 hours; power transmission line damaged",
        "triggering_factor": "Prolonged rainfall inducing planar slide on phyllite bedding",
        "latitude": 27.1850,
        "longitude": 92.5120
    },
    {
        "id": "LS-2023-NER-041",
        "location_name": "Guwahati Boragaon Hill Cut",
        "district": "Kamrup Metropolitan",
        "state": "Assam",
        "date": "2023-06-19",
        "rainfall_trigger_mm": 142.0,
        "severity": "HIGH",
        "deaths": 4,
        "affected_population": 1800,
        "infrastructure_damage": "8 informal residences destroyed; arterial road inundated",
        "triggering_factor": "Steep artificial slope cutting with zero retention structure",
        "latitude": 26.1240,
        "longitude": 91.6850
    },
    {
        "id": "LS-2022-NER-120",
        "location_name": "Tupul Railway Yard Catastrophic Slide",
        "district": "Noney",
        "state": "Manipur",
        "date": "2022-06-30",
        "rainfall_trigger_mm": 260.0,
        "severity": "CRITICAL",
        "deaths": 58,
        "affected_population": 35000,
        "infrastructure_damage": "Tupul railway construction camp destroyed; Ijei river dammed into artificial lake",
        "triggering_factor": "Massive deep-seated rotational failure following multi-day torrential deluge",
        "latitude": 24.8100,
        "longitude": 93.6300
    },
    {
        "id": "LS-2021-NER-078",
        "location_name": "Sohra-Mawsmai Escarpment Slide",
        "district": "East Khasi Hills",
        "state": "Meghalaya",
        "date": "2021-07-11",
        "rainfall_trigger_mm": 380.0,
        "severity": "HIGH",
        "deaths": 1,
        "affected_population": 4200,
        "infrastructure_damage": "Tourist viewpoint trail destroyed; water pumping pipeline shattered",
        "triggering_factor": "Hyper-precipitation saturated limestone joint networks",
        "latitude": 25.2680,
        "longitude": 91.7250
    }
]

# Emergency Resources & Safe Evacuation Corridors
EMERGENCY_RESOURCES = {
    "shelters": [
        {
            "id": "EM-SH-01",
            "name": "Tawang Government Higher Secondary Relief Camp",
            "district": "Tawang",
            "latitude": 27.5885,
            "longitude": 91.8640,
            "capacity": 650,
            "current_occupancy": 124,
            "contact": "+91-3794-222340",
            "status": "ready",
            "medical_team_on_site": True,
            "generator_power": True
        },
        {
            "id": "EM-SH-02",
            "name": "Bomdila Indoor Stadium Community Shelter",
            "district": "West Kameng",
            "latitude": 27.2620,
            "longitude": 92.4190,
            "capacity": 800,
            "current_occupancy": 45,
            "contact": "+91-3782-222108",
            "status": "ready",
            "medical_team_on_site": True,
            "generator_power": True
        },
        {
            "id": "EM-SH-03",
            "name": "Gangtok Paljor Stadium Disaster Relief Facility",
            "district": "East Sikkim",
            "latitude": 27.3320,
            "longitude": 88.6140,
            "capacity": 1200,
            "current_occupancy": 310,
            "contact": "+91-3592-202726",
            "status": "ready",
            "medical_team_on_site": True,
            "generator_power": True
        }
    ],
    "hospitals": [
        {
            "id": "EM-HP-01",
            "name": "Khandro Drowa Tsangmu District Hospital Tawang",
            "district": "Tawang",
            "latitude": 27.5830,
            "longitude": 91.8625,
            "trauma_beds": 45,
            "available_ambulances": 6,
            "blood_bank": "Available",
            "contact": "+91-3794-222216",
            "distance_km_from_high_risk": 2.1
        },
        {
            "id": "EM-HP-02",
            "name": "Sir Thutob Namgyal Memorial (STNM) Multispeciality Hospital",
            "district": "East Sikkim",
            "latitude": 27.3190,
            "longitude": 88.6010,
            "trauma_beds": 120,
            "available_ambulances": 14,
            "blood_bank": "Critical Reserves OK",
            "contact": "+91-3592-281112",
            "distance_km_from_high_risk": 1.5
        },
        {
            "id": "EM-HP-03",
            "name": "Tomo Riba Institute of Health & Medical Sciences (TRIHMS)",
            "district": "Papum Pare",
            "latitude": 27.1080,
            "longitude": 93.6750,
            "trauma_beds": 80,
            "available_ambulances": 10,
            "blood_bank": "Available",
            "contact": "+91-360-2350331",
            "distance_km_from_high_risk": 4.2
        }
    ],
    "rescue_forces": [
        {
            "id": "EM-RF-01",
            "unit": "12th Battalion NDRF (National Disaster Response Force)",
            "base_location": "Doimukh / Itanagar",
            "deployed_team": "Team Alpha (Tawang Sector)",
            "personnel": 45,
            "heavy_equipment": "2x Tracked Hydraulic Excavators, 4x InSAR Drones, SAR Dogs",
            "readiness_min": 15,
            "contact": "+91-360-2277107"
        },
        {
            "id": "EM-RF-02",
            "unit": "Project Vartak Border Roads Organisation (BRO)",
            "base_location": "Tenga Valley & Bomdila",
            "deployed_team": "752 BRTF Quick Road Clearance Unit",
            "personnel": 60,
            "heavy_equipment": "4x Front Wheel Loaders, 2x Rock Breakers, Rapid Bailey Bridge Units",
            "readiness_min": 20,
            "contact": "+91-3782-273220"
        }
    ],
    "road_corridors": [
        {
            "corridor": "NH-13 Tawang - Sela Pass Highway",
            "status": "caution",
            "clearance": "Single lane controlled by traffic police; prone to mud spatter",
            "detour_available": "Via Old Lumla-Tawang link road (42 km longer)"
        },
        {
            "corridor": "NH-10 Sevoke - Teesta Bridge - Rangpo",
            "status": "blocked",
            "clearance": "Road blocked at 29th Mile due to 60m rockslide. Repair work underway.",
            "detour_available": "Diverted via Gorubathan - Lava - Reshi route"
        },
        {
            "corridor": "BCT Highway Bomdila - Rupa - Balipara",
            "status": "clear",
            "clearance": "Open for all two-way military and civilian traffic.",
            "detour_available": "N/A"
        }
    ]
}

# AI Model Specifications & Historical Evaluation Metrics
MODEL_METRICS = {
    "current_model": "AI-SlopeGuard XGBoost Ensemble v2.4",
    "framework": "XGBoost 2.0.3 + Geotechnical Infinite Slope FoS",
    "trained_on": "4,120 Historical Rainfall-Induced Landslide Events (NER 2012-2025)",
    "accuracy": 0.942,
    "precision": 0.928,
    "recall": 0.954,
    "f1_score": 0.941,
    "roc_auc": 0.967,
    "confusion_matrix": {
        "true_negative": 2840,
        "false_positive": 88,
        "false_negative": 42,
        "true_positive": 1150
    },
    "feature_importances": [
        {"feature": "Antecedent Rainfall (72h Cumulative)", "importance": 0.312},
        {"feature": "Pore Water Pressure & Soil Moisture Saturation", "importance": 0.245},
        {"feature": "Slope Gradient Angle", "importance": 0.178},
        {"feature": "Ground Displacement Velocity (Extensometer/InSAR)", "importance": 0.126},
        {"feature": "Lithological Weakness & Geological Shear Zones", "importance": 0.084},
        {"feature": "Terrain Curvature & Elevation", "importance": 0.055}
    ],
    "versions": [
        {"version": "v1.0-Baseline", "date": "2024-03-10", "type": "Random Forest", "f1": 0.865, "status": "deprecated"},
        {"version": "v1.5-Geotech", "date": "2024-11-20", "type": "Hybrid FoS + Logistic Regression", "f1": 0.898, "status": "archived"},
        {"version": "v2.0-XGBoost", "date": "2025-05-15", "type": "XGBoost + SHAP Attributions", "f1": 0.924, "status": "stable"},
        {"version": "v2.4-Production", "date": "2026-02-01", "type": "Physics-Informed XGBoost Multi-Horizon", "f1": 0.941, "status": "active"}
    ]
}

# Data Sources Status
DATA_SOURCES = [
    {
        "id": "SRC-IMD",
        "name": "India Meteorological Department (IMD)",
        "type": "Doppler Weather Radar & AWS Network",
        "coverage": "North Eastern Region (NER)",
        "last_sync": "4 mins ago",
        "status": "Operational",
        "api_status": "Active (Latency 42ms)",
        "records_ingested_today": 142800,
        "refresh_interval": "15 min"
    },
    {
        "id": "SRC-ISRO-NRSC",
        "name": "ISRO / National Remote Sensing Centre (NRSC)",
        "type": "Sentinel-1A SAR InSAR & Cartosat DEM",
        "coverage": "Himalayan Belt (Arunachal & Sikkim)",
        "last_sync": "1 hour ago",
        "status": "Operational",
        "api_status": "Active (Latency 115ms)",
        "records_ingested_today": 18450,
        "refresh_interval": "Daily Pass"
    },
    {
        "id": "SRC-GSI",
        "name": "Geological Survey of India (GSI) Bhuvan",
        "type": "National Landslide Susceptibility Mapping (NLSM)",
        "coverage": "Macro-scale Geo-Hazard Database",
        "last_sync": "2 days ago",
        "status": "Operational",
        "api_status": "Active (Cached Spatial WMS)",
        "records_ingested_today": 6200,
        "refresh_interval": "Weekly"
    },
    {
        "id": "SRC-IOT-GW",
        "name": "LoRaWAN Micro-Telemetry Gateway Network",
        "type": "Ground In-Situ Geotechnical Sensors",
        "coverage": "25 Station Nodes across Arunachal & Assam",
        "last_sync": "Live Stream (30s)",
        "status": "Operational",
        "api_status": "MQTT Broker Active (0 dropped frames)",
        "records_ingested_today": 489200,
        "refresh_interval": "Continuous (30s)"
    },
    {
        "id": "SRC-CWC",
        "name": "Central Water Commission (CWC) River Gauge",
        "type": "Brahmaputra & Tributary Discharge Gauges",
        "coverage": "Tezpur, Guwahati, Pasighat Stations",
        "last_sync": "12 mins ago",
        "status": "Operational",
        "api_status": "Active (Latency 65ms)",
        "records_ingested_today": 24000,
        "refresh_interval": "Hourly"
    }
]
