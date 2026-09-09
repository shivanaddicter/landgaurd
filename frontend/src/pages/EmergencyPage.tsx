import React, { useState, useEffect } from 'react';
import {
  Siren,
  Hospital,
  Home,
  Truck,
  ShieldAlert,
  Phone,
  Navigation,
  AlertOctagon,
  CheckCircle2,
  Fuel,
  Clock,
  Radio,
  Compass,
  MapPin,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

export const EmergencyPage: React.FC = () => {
  const [resources, setResources] = useState<any>(null);
  const [evacRoute, setEvacRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedConvoySize, setSelectedConvoySize] = useState<number>(4); // 4 NDRF heavy 4x4 trucks
  const [dispatchStatus, setDispatchStatus] = useState<Record<string, boolean>>({
    ndrf: true,
    bro_excavator: true,
    medical_unit: false,
    airlift_standby: false
  });

  useEffect(() => {
    Promise.all([api.getEmergencyResources(), api.getEvacuationRoute('LOC-TWG-01')]).then(
      ([resRes, routeRes]) => {
        if (resRes?.resources) setResources(resRes.resources);
        if (routeRes?.success) setEvacRoute(routeRes);
        setLoading(false);
      }
    );
  }, []);

  const toggleDispatch = (key: string) => {
    setDispatchStatus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const distance = evacRoute?.distance_km || 14.8;
  const transitMins = evacRoute?.estimated_travel_time_min || 32;
  const dieselLiters = (distance * 0.42 * selectedConvoySize).toFixed(1);

  return (
    <div className="p-6 space-y-6 max-w-[1750px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <Siren className="w-6 h-6 text-rose-500" /> Emergency Management & Safe Evacuation Routing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time rescue battalion staging, designated relief shelters, trauma hospitals, and blocked mountain road clearances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> EMERGENCY PROTOCOL LEVEL 3 ACTIVE
          </span>
        </div>
      </div>

      {/* Evacuation Route Visualizer Card */}
      {evacRoute && (
        <div className="glass-panel-elevated p-6 rounded-2xl border border-cyan-500/50 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-command-700/80 pb-4">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Primary Safe Haven Evacuation Corridor: {evacRoute.evacuation_corridor}
              </span>
              <h2 className="text-lg font-bold text-white leading-tight mt-0.5">
                Safe Corridor: {evacRoute.location} &rarr; {evacRoute.nearest_shelter?.name || 'Tawang Stadium Complex'}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1 rounded-lg bg-command-950 border border-command-700 text-slate-300">
                Distance: <span className="text-cyan-400 font-bold">{distance} km</span>
              </span>
              <span className="px-3 py-1 rounded-lg bg-command-950 border border-command-700 text-slate-300">
                Transit: <span className="text-emerald-400 font-bold">~{transitMins} mins</span>
              </span>
              <span className="px-3 py-1 rounded-lg bg-command-950 border border-command-700 text-slate-300 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-amber-400" /> Fuel: <span className="text-amber-300 font-bold">~{dieselLiters} L</span>
              </span>
            </div>
          </div>

          {/* Stepped Waypoint Corridor */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {(evacRoute.waypoints || []).map((wp: any, i: number) => (
              <div key={i} className="p-3.5 rounded-xl bg-command-950/80 border border-command-700 space-y-1 relative group hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                    Checkpoint {i + 1}
                  </span>
                  <MapPin className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <p className="text-xs text-slate-200 font-medium">{wp.instruction}</p>
                <div className="pt-2 border-t border-command-700/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>GPS: {wp.lat ? Number(wp.lat).toFixed(4) : '27.5857'}°N, {wp.lng ? Number(wp.lng).toFixed(4) : '91.8676'}°E</span>
                  <span className="text-emerald-400">CLEAR</span>
                </div>
              </div>
            ))}
          </div>

          {/* Cautionary Hazards */}
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs">
            <span className="font-bold text-rose-300 flex items-center gap-1.5 mb-1">
              <AlertOctagon className="w-4 h-4 text-rose-400" /> Avoidable Hazards along Mountain Evacuation Route:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
              {(evacRoute.cautionary_hazards || []).map((hz: string, i: number) => (
                <li key={i}>{hz}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Convoy Logistics & Incident Command Staging Checklist */}
      <div className="glass-panel p-6 rounded-2xl border border-command-700 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-command-700">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" /> Convoy Logistics & Emergency Incident Command Staging
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Convoy Vehicles:</span>
            <select
              value={selectedConvoySize}
              onChange={(e) => setSelectedConvoySize(Number(e.target.value))}
              className="bg-command-900 border border-command-700 text-white rounded px-2 py-1"
            >
              <option value={2}>2 Heavy 4x4s</option>
              <option value={4}>4 Heavy 4x4s + Ambulances</option>
              <option value={8}>8 Heavy Convoy Battalion</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div
            onClick={() => toggleDispatch('ndrf')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              dispatchStatus.ndrf
                ? 'bg-command-900 border-emerald-500/60 shadow-sm'
                : 'bg-command-950 border-command-700 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">NDRF 12th Battalion</span>
              <CheckCircle2 className={`w-4 h-4 ${dispatchStatus.ndrf ? 'text-emerald-400' : 'text-slate-600'}`} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">45 Trained Mountain Rescue Personnel Staged</p>
            <span className={`text-[10px] font-bold mt-2 block ${dispatchStatus.ndrf ? 'text-emerald-400' : 'text-slate-500'}`}>
              {dispatchStatus.ndrf ? 'DEPLOYED / EN ROUTE' : 'STANDBY'}
            </span>
          </div>

          <div
            onClick={() => toggleDispatch('bro_excavator')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              dispatchStatus.bro_excavator
                ? 'bg-command-900 border-emerald-500/60 shadow-sm'
                : 'bg-command-950 border-command-700 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">BRO Heavy Earthmovers</span>
              <CheckCircle2 className={`w-4 h-4 ${dispatchStatus.bro_excavator ? 'text-emerald-400' : 'text-slate-600'}`} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">2x Caterpillar 320D & Dozers on NH-13</p>
            <span className={`text-[10px] font-bold mt-2 block ${dispatchStatus.bro_excavator ? 'text-emerald-400' : 'text-slate-500'}`}>
              {dispatchStatus.bro_excavator ? 'CLEARING DEBRIS' : 'STANDBY'}
            </span>
          </div>

          <div
            onClick={() => toggleDispatch('medical_unit')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              dispatchStatus.medical_unit
                ? 'bg-command-900 border-emerald-500/60 shadow-sm'
                : 'bg-command-950 border-command-700 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Mobile Trauma ICU</span>
              <CheckCircle2 className={`w-4 h-4 ${dispatchStatus.medical_unit ? 'text-emerald-400' : 'text-slate-600'}`} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Paramedic Unit + Oxygen & Plasma Units</p>
            <span className={`text-[10px] font-bold mt-2 block ${dispatchStatus.medical_unit ? 'text-emerald-400' : 'text-slate-500'}`}>
              {dispatchStatus.medical_unit ? 'DISPATCHED' : 'CLICK TO MOBILIZE'}
            </span>
          </div>

          <div
            onClick={() => toggleDispatch('airlift_standby')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              dispatchStatus.airlift_standby
                ? 'bg-command-900 border-emerald-500/60 shadow-sm'
                : 'bg-command-950 border-command-700 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">IAF Mi-17 V5 Airlift</span>
              <CheckCircle2 className={`w-4 h-4 ${dispatchStatus.airlift_standby ? 'text-emerald-400' : 'text-slate-600'}`} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Helicopter Evacuation LZ at Tawang Ground</p>
            <span className={`text-[10px] font-bold mt-2 block ${dispatchStatus.airlift_standby ? 'text-cyan-400' : 'text-slate-500'}`}>
              {dispatchStatus.airlift_standby ? 'WEATHER WATCH: READY' : 'CLICK TO ALERT IAF'}
            </span>
          </div>
        </div>
      </div>

      {/* Road Corridors & Blocks */}
      <div className="glass-panel p-6 rounded-2xl border border-command-700 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide flex items-center gap-2">
          <Truck className="w-4 h-4 text-cyan-400" /> Mountain Highway Lifeline Statuses
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources?.road_corridors?.map((rd: any) => (
            <div key={rd.corridor} className="p-4 rounded-xl bg-command-950/80 border border-command-700 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white truncate">{rd.corridor}</h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                  rd.status === 'blocked' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                  rd.status === 'caution' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                }`}>
                  {rd.status}
                </span>
              </div>
              <p className="text-xs text-slate-300">{rd.clearance}</p>
              <div className="pt-2 border-t border-command-700/60 text-[11px] font-mono text-slate-400">
                <span className="text-slate-500">Detour:</span> {rd.detour_available}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shelters & Hospitals Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Designated Shelters */}
        <div className="glass-panel p-6 rounded-2xl border border-command-700 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide flex items-center gap-2">
            <Home className="w-4 h-4 text-emerald-400" /> Designated Evacuation Shelters
          </h3>
          <div className="space-y-3">
            {resources?.shelters?.map((sh: any) => (
              <div key={sh.id} className="p-4 rounded-xl bg-command-950/70 border border-command-700 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{sh.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{sh.district}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {sh.current_occupancy} / {sh.capacity} beds
                  </span>
                </div>
                {/* Occupancy Progress Bar */}
                <div className="w-full h-1.5 bg-command-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.round((sh.current_occupancy / sh.capacity) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-400">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-cyan-400" /> {sh.contact}
                  </span>
                  <span className="text-emerald-400 font-bold">Medical On-Site</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trauma Hospitals */}
        <div className="glass-panel p-6 rounded-2xl border border-command-700 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide flex items-center gap-2">
            <Hospital className="w-4 h-4 text-cyan-400" /> Staged Trauma Hospitals
          </h3>
          <div className="space-y-3">
            {resources?.hospitals?.map((hp: any) => (
              <div key={hp.id} className="p-4 rounded-xl bg-command-950/70 border border-command-700 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{hp.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {hp.district} • {hp.distance_km_from_high_risk} km from landslide zone
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {hp.trauma_beds} Trauma Beds
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-400">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-cyan-400" /> {hp.contact}
                  </span>
                  <span className="text-white font-bold">{hp.available_ambulances} Ambulances Ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
