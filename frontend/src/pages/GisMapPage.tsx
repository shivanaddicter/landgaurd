import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { GisMap } from '../components/map/GisMap';
import { Map, Layers, ShieldAlert, Radio, AlertTriangle } from 'lucide-react';

export const GisMapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedLocation = searchParams.get('location') || undefined;

  const [zones, setZones] = useState<any[]>([]);
  const [sensors, setSensors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [zonesRes, sensorsRes] = await Promise.all([
          api.getRiskZones(),
          api.getSensors()
        ]);
        if (zonesRes?.features) {
          setZones(zonesRes.features.map((f: any) => ({ ...f.properties, geometry: f.geometry })));
        }
        if (sensorsRes?.sensors) {
          setSensors(sensorsRes.sensors);
        }
      } catch (err) {
        console.error('Failed to load GIS data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-4 max-w-[1920px] mx-auto animate-in fade-in duration-200">
      {/* Page Title & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <Map className="w-6 h-6 text-cyan-400" /> Live GIS Landslide Risk Map
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Interactive multi-layered spatial hazard visualization for Arunachal Pradesh, Sikkim, Assam, and Meghalaya.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-command-900 border border-command-700 text-slate-300">
            Active Hazard Polygons: <span className="text-cyan-400 font-bold">{zones.length}</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-command-900 border border-command-700 text-slate-300">
            Telemetry Stations: <span className="text-emerald-400 font-bold">{sensors.length}</span>
          </span>
        </div>
      </div>

      {/* Main Full GIS Map Canvas */}
      {loading ? (
        <div className="h-[calc(100vh-13rem)] rounded-2xl glass-panel flex items-center justify-center text-xs font-mono text-slate-400">
          Loading High-Resolution Geospatial Vectors...
        </div>
      ) : (
        <GisMap
          zones={zones}
          sensors={sensors}
          selectedLocationId={selectedLocation}
          height="calc(100vh - 13rem)"
        />
      )}
    </div>
  );
};
