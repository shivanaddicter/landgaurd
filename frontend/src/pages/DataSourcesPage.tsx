import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, CheckCircle2, ShieldCheck, Activity, Wifi } from 'lucide-react';
import { api } from '../services/api';

export const DataSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadSources = async () => {
    setRefreshing(true);
    try {
      const res = await api.getDataSources();
      if (res?.sources) setSources(res.sources);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1750px] mx-auto animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <Database className="w-6 h-6 text-cyan-400" /> Multi-Source Data Ingestion & Scientific APIs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Status of integrated meteorological, radar, synthetic aperture satellite, and ground telemetry pipelines.
          </p>
        </div>

        <button
          onClick={loadSources}
          disabled={refreshing}
          className="px-4 py-2 rounded-xl bg-command-800 hover:bg-command-700 text-cyan-400 border border-command-700 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Sync All Sources</span>
        </button>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sources.map((src) => (
          <div key={src.id} className="glass-panel-elevated p-6 rounded-2xl border border-command-700 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{src.id}</span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {src.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-tight">{src.name}</h3>
              <p className="text-xs text-slate-300 font-mono">{src.type}</p>
            </div>

            <div className="space-y-2 text-xs font-mono bg-command-950/80 p-3.5 rounded-xl border border-command-700/60">
              <div className="flex justify-between">
                <span className="text-slate-400">Coverage:</span>
                <span className="text-slate-200">{src.coverage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sync Interval:</span>
                <span className="text-slate-200">{src.refresh_interval}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Records Ingested:</span>
                <span className="text-cyan-300 font-bold">{src.records_ingested_today?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">API Health:</span>
                <span className="text-emerald-400">{src.api_status}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
              <span>Last polled: {src.last_sync}</span>
              <button
                onClick={() => alert(`Re-polling ${src.name} telemetry feed...`)}
                className="text-cyan-400 hover:underline"
              >
                Poll Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
