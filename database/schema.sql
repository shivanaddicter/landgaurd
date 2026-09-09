-- ==============================================================================
-- AI-SlopeGuard: Smart Landslide Early Warning & Risk Monitoring System
-- Database Schema: PostgreSQL 16 + PostGIS Geospatial Extension
-- Designed for North Eastern Region (NER) Disaster Intelligence Command Center
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "postgis_raster";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM (
    'super_admin',
    'disaster_officer',
    'district_officer',
    'field_officer',
    'analyst',
    'viewer'
);

CREATE TYPE risk_level_enum AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);

CREATE TYPE sensor_type_enum AS ENUM (
    'rainfall',
    'soil_moisture',
    'temperature',
    'humidity',
    'tilt',
    'ground_movement',
    'gnss'
);

CREATE TYPE sensor_status_enum AS ENUM (
    'online',
    'warning',
    'critical',
    'offline'
);

CREATE TYPE alert_severity_enum AS ENUM (
    'critical',
    'high',
    'medium',
    'low',
    'info'
);

CREATE TYPE alert_status_enum AS ENUM (
    'active',
    'acknowledged',
    'escalated',
    'resolved'
);

CREATE TYPE emergency_type_enum AS ENUM (
    'shelter',
    'hospital',
    'police_station',
    'fire_station',
    'ndrf_base'
);

CREATE TYPE route_status_enum AS ENUM (
    'clear',
    'caution',
    'blocked'
);

-- 3. USERS & RBAC TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'viewer',
    department VARCHAR(255) DEFAULT 'Disaster Management Authority',
    jurisdiction VARCHAR(255) DEFAULT 'North Eastern Region',
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. MONITORING LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS locations (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'LOC-TWG-01'
    name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    elevation_m DOUBLE PRECISION NOT NULL,
    average_slope_deg DOUBLE PRECISION NOT NULL,
    population_affected INT DEFAULT 0,
    critical_infra TEXT,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_locations_geom ON locations USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_locations_district ON locations (district);

-- 5. RISK ZONES & POLYGONS
CREATE TABLE IF NOT EXISTS risk_zones (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'RZ-NER-04'
    location_id VARCHAR(50) REFERENCES locations(id) ON DELETE CASCADE,
    zone_name VARCHAR(255) NOT NULL,
    risk_level risk_level_enum NOT NULL DEFAULT 'LOW',
    landslide_probability DOUBLE PRECISION NOT NULL CHECK (landslide_probability BETWEEN 0 AND 100),
    confidence_score DOUBLE PRECISION NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
    dominant_cause VARCHAR(255),
    polygon_geojson JSONB NOT NULL,
    geom GEOMETRY(Polygon, 4326),
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_risk_zones_geom ON risk_zones USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_risk_zones_risk ON risk_zones (risk_level);

-- 6. IOT SENSORS INVENTORY
CREATE TABLE IF NOT EXISTS sensors (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'SNS-TWG-RF-01'
    location_id VARCHAR(50) REFERENCES locations(id) ON DELETE SET NULL,
    type sensor_type_enum NOT NULL,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    battery_pct DOUBLE PRECISION DEFAULT 100.0,
    signal_rssi INT DEFAULT -70,
    status sensor_status_enum NOT NULL DEFAULT 'online',
    firmware_version VARCHAR(50) DEFAULT 'v2.4.1',
    hardware_uid VARCHAR(100) UNIQUE,
    current_value DOUBLE PRECISION DEFAULT 0.0,
    unit VARCHAR(20) NOT NULL,
    last_heartbeat TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    geom GEOMETRY(Point, 4326)
);

CREATE INDEX IF NOT EXISTS idx_sensors_geom ON sensors USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_sensors_type ON sensors (type);
CREATE INDEX IF NOT EXISTS idx_sensors_status ON sensors (status);

-- 7. SENSOR TELEMETRY READINGS (TIME-SERIES)
CREATE TABLE IF NOT EXISTS sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    sensor_id VARCHAR(50) REFERENCES sensors(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) NOT NULL,
    status_flag VARCHAR(50) DEFAULT 'nominal'
);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_time ON sensor_readings (sensor_id, timestamp DESC);

-- 8. RAINFALL METRICS
CREATE TABLE IF NOT EXISTS rainfall_records (
    id BIGSERIAL PRIMARY KEY,
    location_id VARCHAR(50) REFERENCES locations(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    hourly_mm DOUBLE PRECISION NOT NULL,
    cumulative_24h_mm DOUBLE PRECISION NOT NULL,
    cumulative_72h_mm DOUBLE PRECISION NOT NULL,
    cumulative_30d_mm DOUBLE PRECISION NOT NULL,
    anomaly_percentage DOUBLE PRECISION DEFAULT 0.0
);

CREATE INDEX IF NOT EXISTS idx_rainfall_records_time ON rainfall_records (location_id, timestamp DESC);

-- 9. SOIL MOISTURE & GEOTECHNICAL READINGS
CREATE TABLE IF NOT EXISTS soil_moisture_records (
    id BIGSERIAL PRIMARY KEY,
    location_id VARCHAR(50) REFERENCES locations(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    volumetric_water_pct DOUBLE PRECISION NOT NULL,
    pore_water_press_kpa DOUBLE PRECISION NOT NULL,
    depth_cm DOUBLE PRECISION DEFAULT 50.0,
    soil_temperature_c DOUBLE PRECISION DEFAULT 18.5
);

CREATE INDEX IF NOT EXISTS idx_soil_moisture_time ON soil_moisture_records (location_id, timestamp DESC);

-- 10. TERRAIN PARAMETERS
CREATE TABLE IF NOT EXISTS terrain_parameters (
    id VARCHAR(50) PRIMARY KEY,
    location_id VARCHAR(50) REFERENCES locations(id) ON DELETE CASCADE,
    elevation_m DOUBLE PRECISION NOT NULL,
    slope_angle DOUBLE PRECISION NOT NULL,
    aspect VARCHAR(50) NOT NULL,
    curvature DOUBLE PRECISION NOT NULL,
    geology_type VARCHAR(255) NOT NULL,
    vegetation_ndvi DOUBLE PRECISION NOT NULL,
    soil_type VARCHAR(255) NOT NULL,
    drainage_density DOUBLE PRECISION NOT NULL,
    factor_of_safety DOUBLE PRECISION NOT NULL
);

-- 11. SATELLITE & InSAR DEFORMATION
CREATE TABLE IF NOT EXISTS satellite_data (
    id VARCHAR(50) PRIMARY KEY,
    location_id VARCHAR(50) REFERENCES locations(id) ON DELETE CASCADE,
    pass_date DATE NOT NULL,
    satellite_name VARCHAR(100) DEFAULT 'Sentinel-1A / InSAR',
    surface_displacement_mm_yr DOUBLE PRECISION NOT NULL,
    ndvi_index DOUBLE PRECISION NOT NULL,
    land_cover_class VARCHAR(100) NOT NULL,
    coherence_score DOUBLE PRECISION NOT NULL
);

-- 12. HISTORICAL LANDSLIDE INCIDENTS DATABASE
CREATE TABLE IF NOT EXISTS historical_landslides (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'LS-2024-089'
    location_name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    rainfall_trigger_mm DOUBLE PRECISION NOT NULL,
    severity risk_level_enum NOT NULL,
    casualties INT DEFAULT 0,
    population_affected INT DEFAULT 0,
    infrastructure_damage TEXT,
    triggering_factor VARCHAR(255),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326)
);

CREATE INDEX IF NOT EXISTS idx_historical_geom ON historical_landslides USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_historical_date ON historical_landslides (date DESC);

-- 13. ALERTS & EARLY WARNINGS
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'ALT-2026-0041'
    location_id VARCHAR(50) REFERENCES locations(id) ON DELETE CASCADE,
    severity alert_severity_enum NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    risk_score DOUBLE PRECISION NOT NULL,
    affected_population INT DEFAULT 0,
    recommended_actions TEXT NOT NULL,
    status alert_status_enum NOT NULL DEFAULT 'active',
    acknowledged_by UUID REFERENCES users(id),
    triggered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts (status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts (severity);

-- 14. EMERGENCY CENTERS & RESCUE ASSETS
CREATE TABLE IF NOT EXISTS emergency_centers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type emergency_type_enum NOT NULL,
    district VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    capacity INT DEFAULT 100,
    current_occupancy INT DEFAULT 0,
    contact_phone VARCHAR(50) NOT NULL,
    route_status route_status_enum DEFAULT 'clear',
    geom GEOMETRY(Point, 4326)
);

CREATE INDEX IF NOT EXISTS idx_emergency_geom ON emergency_centers USING GIST (geom);

-- 15. AI PREDICTION LOGS & EXPLAINABILITY
CREATE TABLE IF NOT EXISTS ai_predictions (
    id VARCHAR(50) PRIMARY KEY,
    location_id VARCHAR(50) REFERENCES locations(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    horizon VARCHAR(10) NOT NULL, -- '1h', '6h', '24h', '72h'
    probability DOUBLE PRECISION NOT NULL,
    risk_level risk_level_enum NOT NULL,
    feature_contributions JSONB NOT NULL,
    human_explanation TEXT NOT NULL,
    model_version VARCHAR(50) NOT NULL DEFAULT 'v2.0-XGBoost'
);

-- 16. AUDIT LOGS FOR GOVERNMENT DISASTER COMPLIANCE
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(50),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
