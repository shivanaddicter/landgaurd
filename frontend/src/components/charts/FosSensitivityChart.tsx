import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { Activity } from 'lucide-react';

interface FosSensitivityChartProps {
  currentRainfall: number;
  currentFos: number;
}

export const FosSensitivityChart: React.FC<FosSensitivityChartProps> = ({
  currentRainfall,
  currentFos
}) => {
  // Generate curve data points for rainfall 10mm -> 250mm
  const data = [];
  for (let r = 20; r <= 240; r += 20) {
    // Model FoS degradation curve
    const m = Math.min(1.0, 0.25 + (r / 220) * 0.75);
    const resisting = 18.0 + (19.0 - (m * 9.81)) * 3.0 * (Math.cos(38.4 * Math.PI / 180) ** 2) * Math.tan(32.0 * Math.PI / 180);
    const driving = 19.0 * 3.0 * Math.sin(38.4 * Math.PI / 180) * Math.cos(38.4 * Math.PI / 180);
    const fos = Math.max(0.4, Number((resisting / driving).toFixed(2)));
    data.push({
      rainfall_mm: r,
      fos: fos,
      failure_limit: 1.0
    });
  }

  return (
    <div className="glass-panel p-5 rounded-2xl border border-command-700 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-command-700/70">
        <div>
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-rose-400" />
            Geotechnical Factor of Safety (FoS) Sensitivity Curve
          </h4>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            Slope Stability Boundary vs. Infiltrating Precipitation
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 block">Observed State</span>
          <span className={`text-xs font-mono font-bold ${currentFos < 1.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            FoS: {currentFos.toFixed(2)} @ {currentRainfall.toFixed(0)}mm
          </span>
        </div>
      </div>

      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="rainfall_mm" stroke="#64748b" fontSize={10} fontFamily="monospace" label={{ value: 'Precipitation (mm/24h)', position: 'insideBottom', offset: -4, fill: '#64748b', fontSize: 10 }} />
            <YAxis stroke="#64748b" domain={[0.4, 2.0]} fontSize={10} fontFamily="monospace" label={{ value: 'FoS Equilibrium', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '11px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            />
            {/* Critical Failure Boundary Line (FoS = 1.0) */}
            <ReferenceLine y={1.0} stroke="#e11d48" strokeDasharray="4 4" label={{ value: 'FoS = 1.0 Failure Threshold', fill: '#e11d48', fontSize: 10, position: 'top' }} />
            <Line
              type="monotone"
              dataKey="fos"
              name="Factor of Safety"
              stroke="#0284c7"
              strokeWidth={3}
              dot={{ r: 3, fill: '#0284c7' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600 flex items-center justify-between">
        <span>Infinite Slope Stability Criterion: FoS &lt; 1.0 = Imminent Shear Collapse</span>
        <span className="text-sky-700 font-bold">c'=18kPa, φ'=32°, θ=38.4°</span>
      </div>
    </div>
  );
};
