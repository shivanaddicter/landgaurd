import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { KpiCard } from '../components/common/KpiCard';
import { GisMap } from '../components/map/GisMap';
import { RiskBadge } from '../components/common/RiskBadge';
import { KpiCardSkeleton } from '../components/common/SkeletonLoader';
import {
  AlertTriangle,
  ArrowRight,
  Radio,
  RefreshCw,
  Activity,
  ExternalLink,
  ShieldAlert,
  Zap,
  Navigation,
  Send,
  Truck,
  Droplets,
  Layers,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [riskZones, setRiskZones] = useState<any[]>([]);
  const [sensors, setSensors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'threat_matrix' | 'sensor_matrix' | 'soil_trends'>('overview');
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const [dash, zonesRes, sensorsRes] = await Promise.all([
        api.getDashboard(),
        api.getRiskZones(),
        api.getSensors()
      ]);
      setDashboardData(dash);
      if (zonesRes?.features) {
        setRiskZones(zonesRes.features.map((f: any) => ({ ...f.properties, geometry: f.geometry })));
      }
      if (sensorsRes?.sensors) {
        setSensors(sensorsRes.sensors);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1750px] mx-auto animate-in fade-in duration-300">
      {/* Critical Incident Alert Ribbon */}
      {dashboardData?.recent_alerts?.[0] && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/80 via-command-900 to-command-900 border border-rose-500/50 flex flex-wrap items-center justify-between gap-4 shadow-lg shadow-rose-950/30">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                  CRITICAL DISASTER NOTICE
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {dashboardData.recent_alerts[0].location_name}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200 mt-0.5">
                {dashboardData.recent_alerts[0].title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/alerts')}
              className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-rose-950/50"
            >
              Take Action <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Incident Command Action Ribbon */}
      <div className="p-3 rounded-2xl glass-panel border border-command-700/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white uppercase tracking-wider">Quick Response Directives:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate('/emergency')}
            className="px-3 py-1.5 rounded-xl bg-command-800 hover:bg-command-700 text-cyan-300 border border-command-700 flex items-center gap-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-cyan-400" /> Safe Evacuation Route
          </button>
          <button
            onClick={() => navigate('/alerts')}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-rose-400" /> Broadcast CAP Bulletin
          </button>
          <button
            onClick={() => navigate('/simulation')}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold flex items-center gap-1.5 shadow-md"
          >
            <Activity className="w-3.5 h-3.5" /> 1-Click Evaluation Demo &rarr;
          </button>
        </div>
      </div>

      {/* Header Controls & Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            Operational Situation Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time hydro-geological risk synthesis across 7 North Eastern Himalayan Sectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Dashboard View Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-command-900 border border-command-700 text-xs font-mono">
            {[
              { id: 'overview', label: 'GIS Overview' },
              { id: 'threat_matrix', label: 'Regional Hazard Matrix' },
              { id: 'sensor_matrix', label: 'Sensor Fleet' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-xl bg-command-800 hover:bg-command-700 text-slate-300 border border-command-700 text-xs font-mono flex items-center gap-2 transition-all"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 8 KPI Cards Grid with Skeleton Fallbacks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <KpiCardSkeleton key={i} />)
          : dashboardData?.kpis?.map((kpi: any) => (
              <KpiCard
                key={kpi.id}
                kpi={kpi}
                onClick={() => {
                  if (kpi.id === 'kpi-rainfall') navigate('/rainfall');
                  else if (kpi.id === 'kpi-moisture') navigate('/analytics');
                  else if (kpi.id === 'kpi-high-risk-zones') navigate('/map');
                  else if (kpi.id === 'kpi-active-alerts') navigate('/alerts');
                  else if (kpi.id === 'kpi-probability') navigate('/prediction');
                  else if (kpi.id === 'kpi-sensor-health') navigate('/sensors');
                  else if (kpi.id === 'kpi-population') navigate('/emergency');
                  else navigate('/map');
                }}
              />
            ))}
      </div>

      {/* Dynamic Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Interactive Map Preview (8 cols) */}
          <div className="lg:col-span-8 glass-panel-elevated p-5 rounded-2xl border border-command-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <h2 className="text-sm font-extrabold text-white uppercase font-mono tracking-wide">
                  Live Geospatial Risk Map & Evacuation Corridor
                </h2>
              </div>
              <button
                onClick={() => navigate('/map')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 hover:underline"
              >
                Open Fullscreen GIS <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <GisMap zones={riskZones} sensors={sensors} height="490px" />
          </div>

          {/* Right Side: Active High Hazard Sectors & Sensors Ticker (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-5 rounded-2xl border border-command-700 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
                  High-Hazard Sectors
                </h3>
                <span className="text-[10px] font-mono text-slate-400">7 Monitored</span>
              </div>

              <div className="space-y-2.5">
                {riskZones.slice(0, 4).map((zone) => (
                  <div
                    key={zone.id}
                    onClick={() => navigate(`/map?location=${zone.location_id}`)}
                    className="p-3 rounded-xl bg-command-950/60 hover:bg-command-800/80 border border-command-700/60 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                        {zone.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Rain: {zone.rainfall_24h_mm}mm • Saturation: {zone.soil_moisture_pct}% • Slope: {zone.slope_deg}°
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <RiskBadge level={zone.risk_level} size="sm" />
                      <div className="text-[11px] font-mono font-bold text-white mt-1">
                        {zone.probability}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/prediction')}
                className="w-full py-2 bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-semibold rounded-lg transition-colors text-center"
              >
                Analyze Geotechnical Factors &rarr;
              </button>
            </div>

            {/* IoT Telemetry Summary Widget */}
            <div className="glass-panel p-5 rounded-2xl border border-command-700 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" /> IoT Telemetry Gateway
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  MQTT ACTIVE
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {sensors.slice(0, 3).map((s) => (
                  <div key={s.id} className="p-2.5 rounded-lg bg-command-950/70 border border-command-700/60 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white truncate max-w-[170px]">{s.name}</div>
                      <div className="text-[10px] text-slate-500">{s.location_name}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-cyan-300">{s.current_value} {s.unit}</span>
                      <div className="text-[10px] text-slate-400">{s.status}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/sensors')}
                className="w-full py-2 bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-semibold rounded-lg transition-colors text-center"
              >
                Manage Sensor Fleet &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'threat_matrix' && (
        <div className="glass-panel-elevated p-6 rounded-2xl border border-command-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide">
              Regional Threat Matrix (All 7 North Eastern Sectors)
            </h3>
            <span className="text-xs font-mono text-cyan-400">PostGIS 16 Synced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-command-950 text-slate-400 uppercase text-[11px] border-b border-command-700">
                <tr>
                  <th className="p-3">Sector & Lifeline</th>
                  <th className="p-3">District & State</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Probability</th>
                  <th className="p-3">Rainfall (24h)</th>
                  <th className="p-3">Soil Saturation</th>
                  <th className="p-3">Affected Citizens</th>
                  <th className="p-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-command-700/50">
                {riskZones.map((z) => (
                  <tr key={z.id} className="hover:bg-command-800/40">
                    <td className="p-3 font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {z.name}
                    </td>
                    <td className="p-3 text-slate-300">{z.location_id}</td>
                    <td className="p-3"><RiskBadge level={z.risk_level} size="sm" /></td>
                    <td className="p-3 font-bold text-white">{z.probability}%</td>
                    <td className="p-3 text-cyan-300">{z.rainfall_24h_mm} mm</td>
                    <td className="p-3 text-emerald-300">{z.soil_moisture_pct}%</td>
                    <td className="p-3 text-slate-200">{z.population_affected?.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => navigate(`/map?location=${z.location_id}`)}
                        className="text-cyan-400 hover:underline"
                      >
                        Inspect &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'sensor_matrix' && (
        <div className="glass-panel-elevated p-6 rounded-2xl border border-command-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide">
              Real-Time In-Situ Station Telemetry Matrix
            </h3>
            <span className="text-xs font-mono text-emerald-400">LoRaWAN IN865 Live</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sensors.map((s) => (
              <div key={s.id} className="p-4 rounded-xl bg-command-950/80 border border-command-700/70 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{s.id}</span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{s.name}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300">{s.current_value} {s.unit}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 flex justify-between pt-1">
                  <span>Battery: {s.battery_pct}%</span>
                  <span>Signal: {s.signal_rssi} dBm</span>
                  <span>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
