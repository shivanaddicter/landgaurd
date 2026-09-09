import React from 'react';
import { X, ExternalLink, ShieldAlert, Waves, Mountain, Activity, Users, Building, Thermometer, Droplets } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { RiskZone } from '../../types';
import { useNavigate } from 'react-router-dom';

interface SlideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  zone: RiskZone | null;
}

export const SlideDrawer: React.FC<SlideDrawerProps> = ({ isOpen, onClose, zone }) => {
  const navigate = useNavigate();
  if (!isOpen || !zone) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-command-900/95 backdrop-blur-2xl border-l border-command-700/80 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out">
      {/* Drawer Header */}
      <div className="p-5 border-b border-command-700/70 flex items-start justify-between bg-command-950/70">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <RiskBadge level={zone.risk_level} size="sm" />
            <span className="text-xs font-mono text-cyan-400 font-semibold">{zone.id}</span>
          </div>
          <h2 className="text-lg font-bold text-white leading-tight">{zone.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Coords: {zone.geometry.coordinates[0][0][1].toFixed(4)}°N, {zone.geometry.coordinates[0][0][0].toFixed(4)}°E
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-command-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Core Probability Card */}
        <div className="p-4 rounded-xl glass-panel border border-command-700 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-medium">Landslide Probability</span>
            <div className="text-3xl font-extrabold font-mono text-white mt-1">
              {zone.probability.toFixed(1)}%
            </div>
            <span className="text-xs text-cyan-400 font-mono">Confidence: {zone.confidence}%</span>
          </div>
          <div className="h-14 w-14 rounded-full border-4 border-rose-500/30 border-t-rose-500 flex items-center justify-center font-mono font-bold text-xs text-rose-400">
            {zone.risk_level}
          </div>
        </div>

        {/* Primary Geo-Physical Telemetry Grid */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" /> Ground & Weather Telemetry
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-lg bg-command-950/80 border border-command-700/60">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Rainfall (24h)
              </span>
              <div className="text-lg font-mono font-bold text-white mt-1">{zone.rainfall_24h_mm} mm</div>
            </div>

            <div className="p-3 rounded-lg bg-command-950/80 border border-command-700/60">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Waves className="w-3.5 h-3.5 text-emerald-400" /> Soil Saturation
              </span>
              <div className="text-lg font-mono font-bold text-white mt-1">{zone.soil_moisture_pct}%</div>
            </div>

            <div className="p-3 rounded-lg bg-command-950/80 border border-command-700/60">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Mountain className="w-3.5 h-3.5 text-amber-400" /> Slope Angle
              </span>
              <div className="text-lg font-mono font-bold text-white mt-1">{zone.slope_deg}°</div>
            </div>

            <div className="p-3 rounded-lg bg-command-950/80 border border-command-700/60">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-rose-400" /> Ground Motion
              </span>
              <div className="text-lg font-mono font-bold text-white mt-1">{zone.ground_movement_mm} mm</div>
            </div>

            <div className="p-3 rounded-lg bg-command-950/80 border border-command-700/60">
              <span className="text-[11px] text-slate-400">Elevation</span>
              <div className="text-base font-mono font-bold text-slate-200 mt-1">{zone.elevation_m} m</div>
            </div>

            <div className="p-3 rounded-lg bg-command-950/80 border border-command-700/60">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-yellow-400" /> Temp / Humidity
              </span>
              <div className="text-base font-mono font-bold text-slate-200 mt-1">
                {zone.temperature_c}°C / {zone.humidity_pct}%
              </div>
            </div>
          </div>
        </div>

        {/* Hazard Driver */}
        <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-xs text-rose-200">
          <div className="font-semibold text-rose-300 flex items-center gap-1.5 mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> Dominant Trigger Cause
          </div>
          {zone.dominant_cause}
        </div>

        {/* Critical Logistics & Infrastructure */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Surrounding Vulnerable Assets
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-command-950/50 border border-command-700/50">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" /> Population at Risk
              </span>
              <span className="font-mono font-bold text-white">{zone.population_affected.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-command-950/50 border border-command-700/50">
              <span className="text-slate-400">Nearest Lifeline Road</span>
              <span className="text-slate-200 font-medium truncate max-w-[200px]">{zone.nearest_road}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-command-950/50 border border-command-700/50">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-400" /> Nearest Hospital
              </span>
              <span className="text-slate-200 font-medium truncate max-w-[200px]">{zone.nearest_hospital}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-command-950/50 border border-command-700/50">
              <span className="text-slate-400">Nearest Station Node</span>
              <span className="font-mono text-cyan-400">{zone.nearest_sensor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-command-700/80 bg-command-950/80 flex items-center gap-3">
        <button
          onClick={() => {
            onClose();
            navigate(`/prediction?location_id=${zone.location_id}`);
          }}
          className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition-all"
        >
          View Detailed AI Analysis <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
