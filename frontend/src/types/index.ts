export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface KpiItem {
  id: string;
  title: string;
  value: string;
  numeric_value: number;
  unit: string;
  change_pct: string;
  trend: 'up' | 'down' | 'neutral';
  status: string;
  status_color: 'rose' | 'amber' | 'emerald' | 'cyan';
  sparkline: number[];
  description: string;
}

export interface RiskZone {
  id: string;
  location_id: string;
  name: string;
  risk_level: RiskLevel;
  probability: number;
  confidence: number;
  dominant_cause: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  rainfall_24h_mm: number;
  soil_moisture_pct: number;
  slope_deg: number;
  elevation_m: number;
  ground_movement_mm: number;
  temperature_c: number;
  humidity_pct: number;
  nearest_sensor: string;
  nearest_road: string;
  nearest_hospital: string;
  population_affected: number;
  color?: string;
}

export interface SensorItem {
  id: string;
  location_id: string;
  location_name: string;
  type: 'rainfall' | 'soil_moisture' | 'temperature' | 'humidity' | 'tilt' | 'ground_movement';
  name: string;
  latitude: number;
  longitude: number;
  battery_pct: number;
  signal_rssi: number;
  status: 'online' | 'warning' | 'critical' | 'offline';
  current_value: number;
  unit: string;
  last_update: string;
  hardware_uid: string;
  sampling_rate?: string;
}

export interface AlertItem {
  id: string;
  location_id: string;
  location_name: string;
  district: string;
  state: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  risk_score: number;
  affected_population: number;
  recommended_actions: string;
  nearest_center: string;
  status: 'active' | 'acknowledged' | 'escalated' | 'resolved';
  triggered_at: string;
}

export interface FeatureContribution {
  name: string;
  short_name: string;
  percentage: number;
  value_display: string;
  severity: string;
  color: string;
}

export interface PredictionResult {
  probability: number;
  risk_level: RiskLevel;
  confidence: number;
  factor_of_safety: number;
  horizons: {
    '1h': number;
    '6h': number;
    '24h': number;
    '72h': number;
  };
  parameters: {
    rainfall_24h_mm: number;
    soil_moisture_pct: number;
    slope_deg: number;
    ground_movement_mm: number;
    elevation_m: number;
  };
}

export interface ExplanationResult {
  headline: string;
  key_reasons: string[];
  recommended_actions: string[];
  summary: string;
}

export interface HistoricalLandslide {
  id: string;
  location_name: string;
  district: string;
  state: string;
  date: string;
  rainfall_trigger_mm: number;
  severity: RiskLevel;
  deaths: number;
  affected_population: number;
  infrastructure_damage: string;
  triggering_factor: string;
  latitude: number;
  longitude: number;
}
