import React from 'react';

interface GaugeChartProps {
  probability: number;
  riskLevel: string;
  confidence: number;
  factorOfSafety?: number;
  size?: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  probability,
  riskLevel,
  confidence,
  factorOfSafety,
  size = 240
}) => {
  const normProb = Math.min(100, Math.max(0, probability));
  
  // Semicircle gauge calculation
  const radius = size * 0.38;
  const strokeWidth = size * 0.08;
  const cx = size / 2;
  const cy = size * 0.55;
  
  // Circumference of half circle = pi * radius
  const arcLength = Math.PI * radius;
  const progressOffset = arcLength * (1 - normProb / 100);

  const getColor = () => {
    if (normProb >= 76) return '#ef4444'; // Red
    if (normProb >= 51) return '#f97316'; // Orange
    if (normProb >= 26) return '#f59e0b'; // Amber
    return '#10b981'; // Emerald
  };

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg width={size} height={size * 0.68} className="overflow-visible">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="65%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Track */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#111d35"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Dynamic Colored Progress Arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          filter="url(#glow)"
          className="transition-all duration-700 ease-out"
        />

        {/* Tick Labels */}
        <text x={cx - radius - 8} y={cy + 16} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">0%</text>
        <text x={cx} y={cy - radius - 6} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">50%</text>
        <text x={cx + radius + 8} y={cy + 16} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">100%</text>
      </svg>

      {/* Center Readout Overlay */}
      <div className="absolute top-[38%] flex flex-col items-center">
        <span className="text-4xl font-extrabold font-mono tracking-tight text-white drop-shadow-md">
          {probability.toFixed(1)}%
        </span>
        <span
          className="text-xs font-bold font-mono tracking-wider px-2.5 py-0.5 rounded-full mt-1 uppercase"
          style={{ backgroundColor: `${getColor()}25`, color: getColor(), border: `1px solid ${getColor()}50` }}
        >
          {riskLevel} HAZARD
        </span>
      </div>

      {/* Sub-metrics */}
      <div className="mt-1 flex items-center gap-6 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">AI CONFIDENCE:</span>
          <span className="text-cyan-400 font-semibold">{confidence}%</span>
        </div>
        {factorOfSafety !== undefined && (
          <div className="flex items-center gap-1.5 border-l border-command-700 pl-4">
            <span className="text-slate-500">FACTOR OF SAFETY:</span>
            <span className={`font-semibold ${factorOfSafety < 1.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {factorOfSafety.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
