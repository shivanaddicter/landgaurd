import React, { useState } from 'react';
import { LineChart, BarChart2, Filter, Download, Calendar, MapPin } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

export const RiskAnalysisPage: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [timeRange, setTimeRange] = useState('30d');

  // Rainfall vs Landslide Incidents Data
  const correlationData = [
    { month: 'Jan', rainfall_mm: 18, incidents: 0 },
    { month: 'Feb', rainfall_mm: 32, incidents: 1 },
    { month: 'Mar', rainfall_mm: 85, incidents: 2 },
    { month: 'Apr', rainfall_mm: 140, incidents: 4 },
    { month: 'May', rainfall_mm: 280, incidents: 11 },
    { month: 'Jun', rainfall_mm: 480, incidents: 28 },
    { month: 'Jul', rainfall_mm: 520, incidents: 34 },
    { month: 'Aug', rainfall_mm: 410, incidents: 22 },
    { month: 'Sep', rainfall_mm: 310, incidents: 16 },
    { month: 'Oct', rainfall_mm: 120, incidents: 5 },
    { month: 'Nov', rainfall_mm: 40, incidents: 1 },
    { month: 'Dec', rainfall_mm: 15, incidents: 0 },
  ];

  // District Comparison Matrix
  const districtMatrix = [
    { district: 'Tawang (Arunachal)', hazard_score: 84, population_at_risk: 28400, active_sensors: 4, status: 'CRITICAL' },
    { district: 'East Sikkim (Sikkim)', hazard_score: 89, population_at_risk: 42000, active_sensors: 3, status: 'CRITICAL' },
    { district: 'East Khasi Hills (Meghalaya)', hazard_score: 76, population_at_risk: 18500, active_sensors: 2, status: 'HIGH' },
    { district: 'West Kameng (Arunachal)', hazard_score: 48, population_at_risk: 14200, active_sensors: 2, status: 'MEDIUM' },
    { district: 'Kamrup Metro (Assam)', hazard_score: 46, population_at_risk: 88000, active_sensors: 1, status: 'MEDIUM' },
    { district: 'Papum Pare (Arunachal)', hazard_score: 21, population_at_risk: 59300, active_sensors: 1, status: 'LOW' },
    { district: 'Sonitpur (Assam)', hazard_score: 12, population_at_risk: 102500, active_sensors: 1, status: 'LOW' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1750px] mx-auto animate-in fade-in duration-200">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <LineChart className="w-6 h-6 text-cyan-400" /> Advanced Risk Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-variate empirical correlation of hydro-meteorological triggers against slope failures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-command-900 border border-command-700 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-cyan-400 ml-2" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none pr-2"
            >
              <option value="All" className="bg-command-900">All NER Districts</option>
              <option value="Tawang" className="bg-command-900">Tawang (Arunachal)</option>
              <option value="East Sikkim" className="bg-command-900">East Sikkim</option>
              <option value="East Khasi Hills" className="bg-command-900">East Khasi Hills</option>
            </select>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-command-900 border border-command-700 text-xs font-mono">
            {['7d', '30d', '90d', '1y'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-2.5 py-1 rounded-lg uppercase ${
                  timeRange === t ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 1: Rainfall vs Landslide Incidents Correlation */}
      <div className="glass-panel-elevated p-6 rounded-2xl border border-command-700 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide">
              Precipitation Influx vs. Landslide Frequency (Annual NER Distribution)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Dual-axis correlation proving monsoon cloudburst threshold triggers (&gt;300mm/month).
            </p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            r = 0.932 Correlation
          </span>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1b2a4a" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} fontFamily="monospace" />
              <YAxis yAxisId="left" stroke="#38bdf8" fontSize={12} fontFamily="monospace" label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft', fill: '#38bdf8' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" fontSize={12} fontFamily="monospace" label={{ value: 'Slope Incidents', angle: 90, position: 'insideRight', fill: '#f43f5e' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090f1d', borderColor: '#2a3f6d', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }} />
              <Bar yAxisId="left" dataKey="rainfall_mm" name="Monthly Rainfall (mm)" fill="#0284c7" opacity={0.6} radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="incidents" name="Recorded Landslide Incidents" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* District Vulnerability Matrix Table */}
      <div className="glass-panel p-6 rounded-2xl border border-command-700 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide">
          District Vulnerability Matrix (North Eastern Region)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-command-950/80 text-slate-400 font-mono uppercase text-[11px] border-b border-command-700">
              <tr>
                <th className="p-3">District & State</th>
                <th className="p-3">Risk Tier</th>
                <th className="p-3">Composite Hazard Score</th>
                <th className="p-3">Population Exposed</th>
                <th className="p-3">Active Sensor Telemetry</th>
                <th className="p-3">Action Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-command-700/50">
              {districtMatrix.map((row) => (
                <tr key={row.district} className="hover:bg-command-800/40 transition-colors">
                  <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {row.district}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase border ${
                        row.status === 'CRITICAL'
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : row.status === 'HIGH'
                          ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                          : row.status === 'MEDIUM'
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-200">
                    <div className="flex items-center gap-2">
                      <span>{row.hazard_score}/100</span>
                      <div className="w-20 h-1.5 bg-command-950 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${row.hazard_score}%`,
                            backgroundColor: row.hazard_score > 75 ? '#ef4444' : row.hazard_score > 50 ? '#f97316' : '#10b981'
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-slate-300">{row.population_at_risk.toLocaleString()} citizens</td>
                  <td className="p-3 font-mono text-cyan-400">{row.active_sensors} In-Situ Nodes</td>
                  <td className="p-3 font-mono text-slate-400">
                    {row.status === 'CRITICAL' ? 'NDRF Battalions Staged' : 'Routine Monitoring'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
