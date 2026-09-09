import React, { useState } from 'react';
import { ShieldAlert, MapPin, Navigation, Compass, AlertTriangle, CheckCircle2, Radio, BellRing } from 'lucide-react';
import { LocationWarningModal } from '../components/alerts/LocationWarningModal';
import { RiskBadge } from '../components/common/RiskBadge';

export const LocationWarningPage: React.FC = () => {
  const [activePreset, setActivePreset] = useState<'tawang' | 'gangtok' | 'guwahati'>('tawang');
  const [isSimulatingGps, setIsSimulatingGps] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const presets = {
    tawang: {
      name: 'Tawang Valley High-Ridge Sector (NH-13)',
      district: 'Tawang, Arunachal Pradesh',
      lat: 27.5857,
      lng: 91.8676,
      probability: 82.5,
      risk_level: 'HIGH',
      isInHazardZone: true,
      reason: 'Torrential 24h precipitation (138.4mm) + 74.2% soil saturation + 4.8mm active shear slip.',
      action: 'Immediate evacuation from downhill slopes; avoid NH-13 Km 42-49.'
    },
    gangtok: {
      name: 'Gangtok-Singtam NH-10 Teesta Corridor',
      district: 'East Sikkim, Sikkim',
      lat: 27.3389,
      lng: 88.6065,
      probability: 89.5,
      risk_level: 'CRITICAL',
      isInHazardZone: true,
      reason: '184mm cloudburst, active mudflow scouring base of highway, GNSS movement 8.6mm.',
      action: 'Do NOT traverse Teesta canyon road; seek shelter at Paljor Stadium immediately.'
    },
    guwahati: {
      name: 'Guwahati Nilachal Hills Sector',
      district: 'Kamrup Metro, Assam',
      lat: 26.1856,
      lng: 91.7077,
      probability: 21.0,
      risk_level: 'LOW',
      isInHazardZone: false,
      reason: 'Precipitation 22mm, slope stability nominal, drainage functioning normally.',
      action: 'Standard caution; no immediate evacuation required.'
    }
  };

  const current = presets[activePreset];

  const handleSimulateGeolocation = () => {
    setIsSimulatingGps(true);
    setTimeout(() => {
      setIsSimulatingGps(false);
      if (current.isInHazardZone) {
        setShowWarningModal(true);
      }
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-500" /> Location-Based Geofenced Early Warning
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulated high-precision GPS geofencing detecting whether user's coordinates fall inside active failure polygons.
          </p>
        </div>

        <button
          onClick={handleSimulateGeolocation}
          disabled={isSimulatingGps}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
        >
          <Navigation className={`w-4 h-4 ${isSimulatingGps ? 'animate-spin' : ''}`} />
          <span>{isSimulatingGps ? 'Acquiring GPS Fix...' : 'Test Location Geofence'}</span>
        </button>
      </div>

      {/* Simulator Preset Selection */}
      <div className="glass-panel p-5 rounded-2xl border border-command-700 space-y-3">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
          Select Simulated Citizen Geolocation:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['tawang', 'gangtok', 'guwahati'] as const).map((key) => {
            const item = presets[key];
            const isSelected = activePreset === key;
            return (
              <div
                key={key}
                onClick={() => setActivePreset(key)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-command-800 border-cyan-500/60 shadow-lg shadow-cyan-950/40'
                    : 'bg-command-950/60 border-command-700/60 hover:bg-command-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <RiskBadge level={item.risk_level} size="sm" />
                  <span className="text-[10px] font-mono text-slate-400">
                    {item.lat.toFixed(2)}°N, {item.lng.toFixed(2)}°E
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white font-mono">{item.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{item.district}</p>
                <div className="mt-3 pt-2 border-t border-command-700/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Hazard Probability:</span>
                  <span className="text-white font-bold">{item.probability}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Geofence Assessment Card */}
      <div className="glass-panel-elevated p-6 rounded-2xl border border-command-700 space-y-6">
        <div className="flex items-center justify-between border-b border-command-700/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-command-900 border border-command-700">
              <Compass className="w-6 h-6 text-cyan-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">CURRENT POSITION:</span>
                <span className="text-xs font-bold text-white font-mono">{current.name}</span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Latitude: {current.lat}° | Longitude: {current.lng}°
              </p>
            </div>
          </div>

          <RiskBadge level={current.risk_level} size="md" />
        </div>

        {/* Hazard Zone Status Notice */}
        {current.isInHazardZone ? (
          <div className="p-5 rounded-xl bg-rose-500/15 border border-rose-500/30 space-y-3">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>GEOFENCE BREACH: USER DETECTED INSIDE HIGH-RISK LANDSLIDE CORRIDOR</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Based on live spatial polygon intersection, your current coordinates are within 1.8km of the active shear slip failure plane.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-command-950/70 border border-command-700">
                <span className="text-slate-400 block text-[10px]">Failure Reason:</span>
                <span className="text-slate-200 font-medium">{current.reason}</span>
              </div>
              <div className="p-3 rounded-lg bg-command-950/70 border border-command-700">
                <span className="text-slate-400 block text-[10px]">Action Required:</span>
                <span className="text-cyan-300 font-bold">{current.action}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-emerald-300">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-sm">SAFE ZONE: NOMINAL DISTANCE FROM HAZARD CORRIDORS</div>
              <div className="text-xs text-slate-300 mt-0.5">
                Current coordinates are outside registered high-susceptibility zones. Normal precautions apply.
              </div>
            </div>
          </div>
        )}

        {/* Simulation Geolocation Modal Trigger */}
        {current.isInHazardZone && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setShowWarningModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-950/50 transition-all"
            >
              <BellRing className="w-4 h-4" /> Trigger Simulated Citizen Warning Modal
            </button>
          </div>
        )}
      </div>

      {/* Warning Modal */}
      <LocationWarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        locationName={current.name}
        probability={current.probability}
        riskLevel={current.risk_level}
        reason={current.reason}
        recommendedAction={current.action}
      />
    </div>
  );
};
