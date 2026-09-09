import React from 'react';
import { Mountain, Compass } from 'lucide-react';

interface InclinometerBubbleProps {
  tiltDeg: number;
  tiltX?: number;
  tiltY?: number;
  size?: number;
}

export const InclinometerBubble: React.FC<InclinometerBubbleProps> = ({
  tiltDeg,
  tiltX = 2.1,
  tiltY = 2.4,
  size = 180
}) => {
  const maxTilt = 6.0; // Max visual degrees scale
  const center = size / 2;
  const radius = size * 0.42;

  // Calculate bubble offset within circle
  const normX = Math.max(-1, Math.min(1, tiltX / maxTilt));
  const normY = Math.max(-1, Math.min(1, tiltY / maxTilt));
  const bubbleX = center + normX * (radius * 0.75);
  const bubbleY = center - normY * (radius * 0.75);

  const isCritical = tiltDeg > 3.5;
  const bubbleColor = isCritical ? '#ef4444' : tiltDeg > 2.0 ? '#f59e0b' : '#10b981';

  return (
    <div className="glass-panel p-5 rounded-2xl border border-command-700 flex flex-col items-center justify-between text-center space-y-3">
      <div className="w-full flex items-center justify-between pb-2 border-b border-command-700/70 text-left">
        <div>
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-400" />
            Biaxial MEMS Inclinometer
          </h4>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            2D Angular Creep & Bedding Rotation
          </p>
        </div>
        <span
          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
            isCritical
              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {isCritical ? 'SHEAR CREEP' : 'STABLE TILT'}
        </span>
      </div>

      {/* 2D Circular Bubble Level */}
      <div className="relative select-none" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
          {/* Outer Scale Circle */}
          <circle cx={center} cy={center} r={radius} fill="#090f1d" stroke="#1b2a4a" strokeWidth="2.5" />
          {/* Mid Circle (3 deg threshold) */}
          <circle cx={center} cy={center} r={radius * 0.6} fill="none" stroke="#2a3f6d" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Inner Target Center (1 deg) */}
          <circle cx={center} cy={center} r={radius * 0.25} fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />

          {/* Crosshairs */}
          <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="#1e293b" strokeWidth="1.5" />
          <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="#1e293b" strokeWidth="1.5" />

          {/* Cardinal Directions */}
          <text x={center} y={center - radius + 12} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">N</text>
          <text x={center + radius - 10} y={center + 3} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">E</text>
          <text x={center} y={center + radius - 6} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">S</text>
          <text x={center - radius + 10} y={center + 3} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">W</text>

          {/* Glowing Spirit Bubble Indicator */}
          <circle
            cx={bubbleX}
            cy={bubbleY}
            r="10"
            fill={bubbleColor}
            stroke="#ffffff"
            strokeWidth="2"
            style={{
              filter: `drop-shadow(0px 0px 8px ${bubbleColor})`,
              transition: 'cx 0.6s ease-out, cy 0.6s ease-out'
            }}
          />
        </svg>

        {/* Center Readout Badge */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <span className="text-[10px] font-mono text-slate-400">Target</span>
        </div>
      </div>

      <div className="w-full grid grid-cols-3 gap-2 text-xs font-mono pt-1">
        <div className="p-2 rounded-lg bg-command-950/80 border border-command-700/60">
          <span className="text-slate-500 block text-[10px]">Net Vector:</span>
          <span className={`font-bold ${isCritical ? 'text-rose-400' : 'text-white'}`}>{tiltDeg.toFixed(1)}°</span>
        </div>
        <div className="p-2 rounded-lg bg-command-950/80 border border-command-700/60">
          <span className="text-slate-500 block text-[10px]">X-Axis (Dip):</span>
          <span className="text-cyan-300 font-bold">{tiltX.toFixed(1)}°</span>
        </div>
        <div className="p-2 rounded-lg bg-command-950/80 border border-command-700/60">
          <span className="text-slate-500 block text-[10px]">Y-Axis (Strike):</span>
          <span className="text-purple-300 font-bold">{tiltY.toFixed(1)}°</span>
        </div>
      </div>
    </div>
  );
};
