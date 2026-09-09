import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Radio, Battery, Wifi, Activity, Droplets, Waves, Mountain, Thermometer } from 'lucide-react';
import { api } from '../services/api';
import { SensorItem } from '../types';

const createSensorIcon = (type: string, status: string) => {
  let color = '#38bdf8'; // soft azure
  if (status === 'critical') color = '#e11d48'; // terracotta rose
  else if (status === 'warning') color = '#d97706'; // warm amber
  else if (status === 'online') color = '#059669'; // forest sage

  let symbol = 'S';
  if (type === 'rainfall') symbol = '🌧';
  else if (type === 'soil_moisture') symbol = '💧';
  else if (type === 'ground_movement') symbol = '⚡';
  else if (type === 'tilt') symbol = '📐';
  else if (type === 'temperature') symbol = '🌡';

  return L.divIcon({
    className: 'sensor-marker',
    html: `
      <div style="
        background: #ffffff;
        border: 2px solid ${color};
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px ${color}40;
        font-size: 15px;
      ">
        ${symbol}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
};

export const SensorMapPage: React.FC = () => {
  const [sensors, setSensors] = useState<SensorItem[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<SensorItem | null>(null);
  const [activeLayer, setActiveLayer] = useState<'warm' | 'dark' | 'satellite'>('warm');

  const tileUrls = {
    warm: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  useEffect(() => {
    api.getSensors().then((res) => {
      if (res?.sensors) setSensors(res.sensors);
    });
  }, []);

  return (
    <div className="p-6 space-y-4 max-w-[1920px] mx-auto animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-emerald-400" /> Sensor Geographic Fleet & Network Map
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Spatial monitoring of in-situ telemetry nodes with battery, radio RSSI, and real-time readings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Base Layer Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-command-900/90 border border-command-700/80 shadow-md">
            {[
              { id: 'warm', label: 'Humanized Topo' },
              { id: 'dark', label: 'Night Ops' },
              { id: 'satellite', label: 'Satellite' }
            ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-sans font-medium transition-all ${
                  activeLayer === layer.id
                    ? 'bg-command-800 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-sans bg-command-900/90 border border-command-700/80 px-3 py-1.5 rounded-xl">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-emerald-400 font-semibold">Online</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
              <span className="text-amber-400 font-semibold">Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-rose-400 font-semibold">Critical</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-13rem)]">
        {/* Map Canvas (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-command-700 glass-panel shadow-2xl relative">
          <MapContainer
            center={[27.2645, 92.4162]}
            zoom={9}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', background: '#f8fafc' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url={tileUrls[activeLayer]}
            />

            {sensors.map((s) => (
              <Marker
                key={s.id}
                position={[s.latitude, s.longitude]}
                icon={createSensorIcon(s.type, s.status)}
                eventHandlers={{
                  click: () => setSelectedSensor(s)
                }}
              >
                <Popup>
                  <div className="text-xs font-sans">
                    <div className="font-bold text-white">{s.name}</div>
                    <div className="text-cyan-300 font-mono font-bold mt-1">
                      {s.current_value} {s.unit}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Selected Sensor Telemetry Card (4 cols) */}
        <div className="lg:col-span-4 glass-panel-elevated p-6 rounded-2xl border border-command-700 flex flex-col justify-between overflow-y-auto">
          {selectedSensor ? (
            <div className="space-y-4">
              <div className="border-b border-command-700 pb-3">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{selectedSensor.id}</span>
                <h3 className="text-lg font-bold text-white mt-1 leading-tight">{selectedSensor.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedSensor.location_name}</p>
              </div>

              <div className="p-4 rounded-xl bg-command-950/80 border border-command-700 flex items-baseline justify-between">
                <span className="text-xs font-mono text-slate-400">Current Reading</span>
                <span className="text-3xl font-mono font-extrabold text-cyan-300">
                  {selectedSensor.current_value} <span className="text-sm font-normal text-slate-400">{selectedSensor.unit}</span>
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2.5 rounded-lg bg-command-950/60 border border-command-700/60">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="text-slate-200">{selectedSensor.latitude.toFixed(4)}°N, {selectedSensor.longitude.toFixed(4)}°E</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-command-950/60 border border-command-700/60">
                  <span className="text-slate-400">Instrument Class:</span>
                  <span className="text-slate-200 uppercase">{selectedSensor.type}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-command-950/60 border border-command-700/60">
                  <span className="text-slate-400">Battery Level:</span>
                  <span className="text-emerald-400 font-bold">{selectedSensor.battery_pct}%</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-command-950/60 border border-command-700/60">
                  <span className="text-slate-400">Radio Signal (RSSI):</span>
                  <span className="text-purple-400 font-bold">{selectedSensor.signal_rssi} dBm</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-command-950/60 border border-command-700/60">
                  <span className="text-slate-400">Hardware UID:</span>
                  <span className="text-slate-400">{selectedSensor.hardware_uid}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-xs font-mono text-slate-400 space-y-2">
              <Radio className="w-8 h-8 text-slate-600 mx-auto" />
              <p>Click any field telemetry marker on the map to inspect in-situ physical readings.</p>
            </div>
          )}

          <div className="pt-4 border-t border-command-700 text-[11px] font-mono text-slate-500">
            * LoRaWAN micro-gateway polling at 30-second cycles.
          </div>
        </div>
      </div>
    </div>
  );
};
