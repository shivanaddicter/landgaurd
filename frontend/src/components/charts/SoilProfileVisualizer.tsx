import React from 'react';
import { Waves, Droplets, AlertTriangle } from 'lucide-react';

interface SoilProfileVisualizerProps {
  saturationPct: number;
  porePressureKpa?: number;
}

export const SoilProfileVisualizer: React.FC<SoilProfileVisualizerProps> = ({
  saturationPct,
  porePressureKpa = 14.8
}) => {
  const layers = [
    { depth: '0 - 15 cm', name: 'Topsoil & Organic Regolith', sat: Math.min(100, saturationPct * 1.08), color: '#38bdf8' },
    { depth: '15 - 45 cm', name: 'Colluvial Silt-Clay Matrix', sat: Math.min(100, saturationPct * 1.02), color: '#0ea5e9' },
    { depth: '45 - 80 cm', name: 'Weathered Schist Bedding', sat: Math.min(100, saturationPct * 0.95), color: '#0284c7' },
    { depth: '80 - 120 cm', name: 'Potential Basal Slip Plane', sat: Math.min(100, saturationPct * 0.91), color: '#0369a1', isFailurePlane: true }
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-command-700 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-command-700/70">
        <div>
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-cyan-400" />
            2D Soil Stratigraphy Depth Profile (TDR Array)
          </h4>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            Pore Water Infiltration across Vertical Regolith Column
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 block">Pore Pressure</span>
          <span className="text-xs font-mono font-bold text-cyan-300">{porePressureKpa} kPa</span>
        </div>
      </div>

      {/* Stratigraphy Column */}
      <div className="space-y-2">
        {layers.map((layer, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border relative overflow-hidden transition-all ${
              layer.isFailurePlane && saturationPct > 70
                ? 'bg-rose-500/10 border-rose-500/40 glow-border-critical'
                : 'bg-command-950/70 border-command-700/60'
            }`}
          >
            {/* Water Infiltration Fill */}
            <div
              className="absolute inset-y-0 left-0 opacity-20 transition-all duration-700 pointer-events-none"
              style={{
                width: `${layer.sat}%`,
                backgroundColor: layer.isFailurePlane && saturationPct > 70 ? '#ef4444' : '#06b6d4'
              }}
            />

            <div className="relative z-10 flex items-center justify-between text-xs font-mono">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">{layer.depth}</span>
                  <span className="text-white font-semibold">{layer.name}</span>
                </div>
                {layer.isFailurePlane && saturationPct > 70 && (
                  <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-3 h-3" /> Hydrostatic Liquefaction & Shear Slip Zone
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className={`text-sm font-extrabold ${layer.sat > 75 ? 'text-rose-400' : 'text-cyan-300'}`}>
                  {layer.sat.toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 block">Saturation</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
        <span>Instrument: Campbell Scientific CS655 Multi-Depth Array</span>
        <span>Sampling: 5 min cycle</span>
      </div>
    </div>
  );
};
