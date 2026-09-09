import React from 'react';
import { AlertTriangle, MapPin, ShieldAlert, Compass, Navigation, X, Volume2, CheckCircle2 } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface LocationWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName?: string;
  probability?: number;
  riskLevel?: string;
  reason?: string;
  recommendedAction?: string;
}

export const LocationWarningModal: React.FC<LocationWarningModalProps> = ({
  isOpen,
  onClose,
  locationName = 'Tawang Valley High-Ridge Sector',
  probability = 82.5,
  riskLevel = 'HIGH',
  reason = 'Heavy antecedent rainfall (138.4mm) + high volumetric soil saturation (74.2%)',
  recommendedAction = 'Avoid steep slope corridors, mountain footpaths, and NH-13 Km 42-49.'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel-elevated rounded-2xl border border-rose-500/80 shadow-2xl shadow-rose-950/60 overflow-hidden glow-border-critical">
        {/* Warning Banner Header */}
        <div className="bg-rose-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-black/20 animate-pulse">
              <AlertTriangle className="w-6 h-6 text-white" />
            </span>
            <div>
              <h2 className="text-base font-extrabold tracking-wider font-mono">
                ⚠ GEOLOCATION LANDSLIDE WARNING
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                Simulated In-Zone Proximity Detection (Within 2.0 km of Active Slip)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-rose-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-command-950/80 border border-command-700/80">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Detected Sector</span>
              <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-cyan-400" /> {locationName}
              </div>
            </div>
            <RiskBadge level={riskLevel} size="md" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-command-950/80 border border-command-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Landslide Probability</span>
              <div className="text-2xl font-mono font-extrabold text-rose-400 mt-1">
                {probability.toFixed(1)}%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-command-950/80 border border-command-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Safety Status</span>
              <div className="text-sm font-bold text-amber-400 mt-1.5">
                IMMEDIATE EVACUATION ADVICE
              </div>
            </div>
          </div>

          {/* Trigger Reason */}
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs">
            <div className="font-bold text-rose-300 mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> Primary Hazard Cause:
            </div>
            <p className="text-slate-300">{reason}</p>
          </div>

          {/* Recommended Action */}
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs">
            <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Recommended Action for Citizens & Transport:
            </div>
            <p className="text-slate-300">{recommendedAction}</p>
          </div>

          <p className="text-[10px] text-slate-500 text-center font-mono">
            * Simulated browser geolocation based on IP/coordinates. No actual SMS dispatched without configured gateway.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-command-700/80 bg-command-950/70 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-command-800 hover:bg-command-700 text-slate-300 font-semibold rounded-lg text-xs transition-colors"
          >
            Acknowledge Advisory
          </button>
          <button
            onClick={() => {
              onClose();
              window.location.href = '#/emergency';
            }}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/50"
          >
            <Navigation className="w-4 h-4" /> View Evacuation Route
          </button>
        </div>
      </div>
    </div>
  );
};
