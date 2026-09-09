import React, { useState, useEffect } from 'react';
import { CloudRain, Droplets, AlertTriangle, Settings, ArrowUpRight } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { api } from '../services/api';

export const RainfallPage: React.FC = () => {
  const [rainfallData, setRainfallData] = useState<any>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [thresholds, setThresholds] = useState({
    normal_max: 50.0,
    elevated_max: 100.0,
    high_max: 150.0,
    critical_min: 150.0
  });

  useEffect(() => {
    api.getRainfall().then((res) => {
      if (res?.success) {
        setRainfallData(res);
        if (res.current_thresholds) setThresholds(res.current_thresholds);
      }
    });
  }, []);

  const handleSaveThresholds = async () => {
    await api.updateRainfallThresholds(thresholds);
    setShowConfig(false);
    alert('Rainfall warning thresholds updated across early warning engines.');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1750px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <CloudRain className="w-6 h-6 text-cyan-400" /> Precipitation & Cloudburst Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Doppler Weather Radar (IMD) + Ground Automated Weather Station (AWS) pluviometer stream.
          </p>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="px-4 py-2 rounded-xl bg-command-800 hover:bg-command-700 text-slate-300 border border-command-700 text-xs font-mono font-bold flex items-center gap-2 transition-colors"
        >
          <Settings className="w-4 h-4 text-cyan-400" />
          <span>Configure Thresholds</span>
        </button>
      </div>

      {/* Configurable Threshold Drawer */}
      {showConfig && (
        <div className="p-5 rounded-2xl glass-panel-elevated border border-cyan-500/50 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-command-700">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wide">
              Adjust Hazard Warning Thresholds (24h Rainfall mm)
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono">Government SDMA Parameter Tuning</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <label className="block text-emerald-400 mb-1">NORMAL Ceiling (&lt; mm)</label>
              <input
                type="number"
                value={thresholds.normal_max}
                onChange={(e) => setThresholds({ ...thresholds, normal_max: Number(e.target.value) })}
                className="w-full p-2 rounded-lg glass-input"
              />
            </div>
            <div>
              <label className="block text-amber-400 mb-1">ELEVATED Ceiling (mm)</label>
              <input
                type="number"
                value={thresholds.elevated_max}
                onChange={(e) => setThresholds({ ...thresholds, elevated_max: Number(e.target.value) })}
                className="w-full p-2 rounded-lg glass-input"
              />
            </div>
            <div>
              <label className="block text-orange-400 mb-1">HIGH Ceiling (mm)</label>
              <input
                type="number"
                value={thresholds.high_max}
                onChange={(e) => setThresholds({ ...thresholds, high_max: Number(e.target.value) })}
                className="w-full p-2 rounded-lg glass-input"
              />
            </div>
            <div>
              <label className="block text-rose-400 mb-1">CRITICAL Trigger (&gt; mm)</label>
              <input
                type="number"
                value={thresholds.critical_min}
                onChange={(e) => setThresholds({ ...thresholds, critical_min: Number(e.target.value) })}
                className="w-full p-2 rounded-lg glass-input"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowConfig(false)}
              className="px-3 py-1.5 rounded-lg bg-command-800 text-slate-400 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveThresholds}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono"
            >
              Save New Thresholds
            </button>
          </div>
        </div>
      )}

      {/* Rainfall Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {rainfallData?.stations?.map((st: any) => (
          <div key={st.station_id} className="glass-panel p-4 rounded-xl border border-command-700 space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{st.station_id}</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                st.threshold_status === 'CRITICAL' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                st.threshold_status === 'HIGH' ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' :
                st.threshold_status === 'ELEVATED' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}>
                {st.threshold_status}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white line-clamp-1">{st.location}</h4>
              <div className="text-2xl font-mono font-extrabold text-cyan-300 mt-1">
                {st.rain_24h_mm} <span className="text-xs font-normal text-slate-400">mm/24h</span>
              </div>
            </div>

            <div className="pt-2 border-t border-command-700/60 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Hourly Rate:</span>
                <span className="text-white font-bold">{st.hourly_mm} mm/hr</span>
              </div>
              <div className="flex justify-between">
                <span>7-Day Accumulation:</span>
                <span className="text-slate-200">{st.rain_7d_mm} mm</span>
              </div>
              <div className="flex justify-between">
                <span>30-Day Monsoon Anomaly:</span>
                <span className="text-rose-400 font-bold">{st.anomaly_pct}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hourly Intensity Chart */}
      <div className="glass-panel-elevated p-6 rounded-2xl border border-command-700 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide">
            24-Hour Diurnal Hourly Rainfall Intensity
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Tawang Ridge Pluviometer</span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rainfallData?.hourly_trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1b2a4a" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} fontFamily="monospace" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" label={{ value: 'Hourly Rain (mm)', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090f1d', borderColor: '#2a3f6d', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="rainfall_mm" name="Rainfall (mm)" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
