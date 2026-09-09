import React, { useState, useEffect } from 'react';
import { HeartPulse, CheckCircle2, AlertTriangle, RefreshCw, Cpu, Database, Server } from 'lucide-react';
import { api } from '../services/api';

export const SystemHealthPage: React.FC = () => {
  const [healthData, setHealthData] = useState<any>(null);

  useEffect(() => {
    api.getSystemHealth().then((res) => {
      if (res?.success) setHealthData(res);
    });
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1750px] mx-auto animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <HeartPulse className="w-6 h-6 text-emerald-400" /> System Health & Infrastructure Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time latency, micro-service status, and uptime reliability across command center nodes.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>OVERALL UPTIME: {healthData?.average_uptime_pct || '99.96'}%</span>
        </div>
      </div>

      {/* Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthData?.services?.map((svc: any) => (
          <div key={svc.service_name} className="glass-panel p-5 rounded-2xl border border-command-700 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="text-xs font-bold text-white font-mono leading-tight">{svc.service_name}</h3>
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {svc.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="p-2 rounded-lg bg-command-950/70 border border-command-700/60">
                <span className="text-slate-500 block text-[10px]">Roundtrip Latency:</span>
                <span className="text-cyan-300 font-bold">{svc.latency_ms} ms</span>
              </div>
              <div className="p-2 rounded-lg bg-command-950/70 border border-command-700/60">
                <span className="text-slate-500 block text-[10px]">Uptime Rate:</span>
                <span className="text-emerald-400 font-bold">{svc.uptime_pct}%</span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-400 pt-1">
              Log Note: {svc.last_incident}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
