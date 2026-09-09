import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Circle, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import {
  Layers,
  Filter,
  Navigation,
  Sliders,
  Ruler,
  AlertTriangle,
  Hospital,
  Home,
  ShieldAlert,
  Radio,
  Eye,
  Crosshair,
  CloudRain
} from 'lucide-react';
import { RiskZone, SensorItem } from '../../types';
import { SlideDrawer } from '../common/SlideDrawer';
import { RiskBadge } from '../common/RiskBadge';

// Marker creator with humanized badge
const createCustomIcon = (color: string, label: string, isPulsing = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; width: 28px; height: 28px;">
        ${isPulsing ? `<span style="position: absolute; inset: 0; border-radius: 50%; background: ${color}; opacity: 0.5; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>` : ''}
        <div style="
          position: relative;
          background: #ffffff;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2.5px solid ${color};
          box-shadow: 0 4px 12px ${color}50;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-weight: 800;
          color: ${color};
        ">
          ${label}
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

interface GisMapProps {
  zones: RiskZone[];
  sensors?: SensorItem[];
  height?: string;
  selectedLocationId?: string;
}

const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

// Distance measurement tool helper
const MeasurementTool: React.FC<{
  active: boolean;
  onPointAdded: (coords: [number, number]) => void;
}> = ({ active, onPointAdded }) => {
  useMapEvents({
    click(e) {
      if (active) {
        onPointAdded([e.latlng.lat, e.latlng.lng]);
      }
    }
  });
  return null;
};

export const GisMap: React.FC<GisMapProps> = ({
  zones,
  sensors = [],
  height = 'calc(100vh - 11rem)',
  selectedLocationId
}) => {
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null);
  const [activeLayer, setActiveLayer] = useState<'warm' | 'dark' | 'satellite' | 'terrain'>('warm');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  
  // Layer visibility toggles
  const [showPolygons, setShowPolygons] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showEvacRoute, setShowEvacRoute] = useState(true);
  const [showPulseRings, setShowPulseRings] = useState(true);
  const [showWeatherOverlay, setShowWeatherOverlay] = useState(false);
  const [polygonOpacity, setPolygonOpacity] = useState(0.45);
  const [showLayersDropdown, setShowLayersDropdown] = useState(false);

  // Measurement tool state
  const [measureMode, setMeasureMode] = useState(false);
  const [measuredPoints, setMeasuredPoints] = useState<[number, number][]>([]);
  const [measuredDistKm, setMeasuredDistKm] = useState<number | null>(null);

  // Center state
  const [mapCenter, setMapCenter] = useState<[number, number]>([27.5857, 91.8676]);
  const [mapZoom, setMapZoom] = useState(10);

  useEffect(() => {
    if (selectedLocationId && zones.length > 0) {
      const match = zones.find((z) => z.location_id === selectedLocationId || z.id === selectedLocationId);
      if (match) {
        setSelectedZone(match);
        setMapCenter([match.geometry.coordinates[0][0][1], match.geometry.coordinates[0][0][0]]);
        setMapZoom(12);
      }
    }
  }, [selectedLocationId, zones]);

  // Humanized Tile layer URLs
  const tileUrls = {
    warm: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  };

  const filteredZones = zones.filter((z) => {
    if (riskFilter === 'ALL') return true;
    return z.risk_level.toUpperCase() === riskFilter.toUpperCase();
  });

  const getPolygonColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'CRITICAL': return '#e11d48'; // Rose Terracotta
      case 'HIGH': return '#ea580c';     // Warm Tangerine
      case 'MEDIUM': return '#d97706';   // Golden Honey
      case 'LOW': default: return '#059669'; // Forest Sage Green
    }
  };

  // Safe Evacuation Corridor Coordinates (Tawang Sector)
  const evacuationCorridorCoords: [number, number][] = [
    [27.5857, 91.8676], // Origin (High Risk Ridge)
    [27.5875, 91.8650], // Checkpoint 1 (Bypass Junction)
    [27.5890, 91.8630], // Checkpoint 2 (Military Cantonment Gate)
    [27.5885, 91.8640]  // Relief Shelter Destination
  ];

  const handleAddMeasurePoint = (pt: [number, number]) => {
    const updated = [...measuredPoints, pt];
    setMeasuredPoints(updated);
    if (updated.length >= 2) {
      // Calculate approximate Haversine distance
      let total = 0;
      for (let i = 0; i < updated.length - 1; i++) {
        const [lat1, lon1] = updated[i];
        const [lat2, lon2] = updated[i + 1];
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        total += 6371 * c;
      }
      setMeasuredDistKm(Number(total.toFixed(2)));
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-command-700/80 shadow-2xl glass-panel">
      {/* Top Map HUD Controls */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Risk Level Pills */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-command-900/95 backdrop-blur-xl border border-command-700/80 pointer-events-auto shadow-xl">
          <span className="text-xs font-semibold text-slate-300 px-2 flex items-center gap-1.5 font-sans">
            <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter Risk:
          </span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-sans transition-all ${
                riskFilter === lvl
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-command-800/80'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Right Controls: Layers, Ruler, and Presets */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Base Layer Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-command-900/95 backdrop-blur-xl border border-command-700/80 shadow-xl">
            {[
              { id: 'warm', label: 'Humanized Topo' },
              { id: 'dark', label: 'Night Ops' },
              { id: 'satellite', label: 'Satellite' },
              { id: 'terrain', label: 'Elevation' }
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

          {/* Geodesic Measurement Tool */}
          <button
            onClick={() => {
              setMeasureMode(!measureMode);
              setMeasuredPoints([]);
              setMeasuredDistKm(null);
            }}
            className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 shadow-lg transition-all ${
              measureMode
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                : 'bg-command-900/90 border-command-700/80 text-slate-300 hover:text-white'
            }`}
            title="Click map points to measure geodesic distance"
          >
            <Ruler className="w-4 h-4" />
            <span className="hidden sm:inline">{measureMode ? 'Ruler Active' : 'Measure'}</span>
          </button>

          {/* Layers Configuration Popover */}
          <div className="relative">
            <button
              onClick={() => setShowLayersDropdown(!showLayersDropdown)}
              className="p-2 rounded-xl bg-command-900/90 backdrop-blur-xl border border-command-700/80 text-slate-300 hover:text-white shadow-lg flex items-center gap-1.5 text-xs font-mono"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Overlays</span>
            </button>

            {showLayersDropdown && (
              <div className="absolute right-0 mt-2 w-64 p-4 rounded-xl glass-panel-elevated border border-command-700/90 shadow-2xl space-y-3 z-50 text-xs font-mono">
                <div className="font-bold text-slate-300 pb-1.5 border-b border-command-700 text-[11px] flex justify-between">
                  <span>GIS OVERLAY LAYERS</span>
                  <span className="text-cyan-400">PostGIS 16</span>
                </div>

                <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-white">
                  <span>Hazard Polygons</span>
                  <input
                    type="checkbox"
                    checked={showPolygons}
                    onChange={(e) => setShowPolygons(e.target.checked)}
                    className="rounded bg-command-950 border-command-700 text-cyan-500 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-white">
                  <span>Evacuation Corridors</span>
                  <input
                    type="checkbox"
                    checked={showEvacRoute}
                    onChange={(e) => setShowEvacRoute(e.target.checked)}
                    className="rounded bg-command-950 border-command-700 text-cyan-500 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-white">
                  <span>IoT Ground Telemetry</span>
                  <input
                    type="checkbox"
                    checked={showSensors}
                    onChange={(e) => setShowSensors(e.target.checked)}
                    className="rounded bg-command-950 border-command-700 text-cyan-500 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-white">
                  <span>Relief Shelters & Trauma</span>
                  <input
                    type="checkbox"
                    checked={showShelters}
                    onChange={(e) => setShowShelters(e.target.checked)}
                    className="rounded bg-command-950 border-command-700 text-cyan-500 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-white">
                  <span>Hazard Pulse Rings</span>
                  <input
                    type="checkbox"
                    checked={showPulseRings}
                    onChange={(e) => setShowPulseRings(e.target.checked)}
                    className="rounded bg-command-950 border-command-700 text-cyan-500 focus:ring-0"
                  />
                </label>

                {/* Opacity Slider */}
                <div className="pt-2 border-t border-command-700 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Polygon Fill Opacity:</span>
                    <span className="text-white font-bold">{Math.round(polygonOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={polygonOpacity}
                    onChange={(e) => setPolygonOpacity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-command-800 rounded appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Focus Button */}
          <button
            onClick={() => {
              setMapCenter([27.5857, 91.8676]);
              setMapZoom(11);
            }}
            title="Focus Tawang High-Risk Corridor"
            className="p-2 rounded-xl bg-command-900/90 backdrop-blur-xl border border-command-700/80 text-cyan-400 hover:text-cyan-300 shadow-lg"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Measurement Active Notification HUD */}
      {measureMode && (
        <div className="absolute top-16 left-4 z-[1000] p-3 rounded-xl bg-command-900/95 border border-cyan-500/80 shadow-2xl text-xs font-mono text-white space-y-1">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <Crosshair className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Geodesic Distance Measurement Active</span>
          </div>
          <p className="text-[10px] text-slate-400">Click points on map to measure linear distance.</p>
          {measuredDistKm !== null && (
            <div className="text-sm font-bold text-emerald-400 pt-1">
              Calculated Distance: {measuredDistKm} km
            </div>
          )}
        </div>
      )}

      {/* Map Container */}
      <div style={{ height }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', background: '#f8fafc' }}
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          <MeasurementTool active={measureMode} onPointAdded={handleAddMeasurePoint} />

          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> / <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url={tileUrls[activeLayer]}
          />

          {/* Render Hazard Polygons */}
          {showPolygons &&
            filteredZones.map((zone) => {
              const coords: [number, number][] = zone.geometry.coordinates[0].map((pt) => [pt[1], pt[0]]);
              const color = getPolygonColor(zone.risk_level);
              const centroidLat = coords.reduce((acc, c) => acc + c[0], 0) / coords.length;
              const centroidLng = coords.reduce((acc, c) => acc + c[1], 0) / coords.length;

              return (
                <React.Fragment key={zone.id}>
                  <Polygon
                    positions={coords}
                    pathOptions={{
                      color: color,
                      fillColor: color,
                      fillOpacity: polygonOpacity,
                      weight: 2.5
                    }}
                    eventHandlers={{
                      click: () => setSelectedZone(zone)
                    }}
                  >
                    <Tooltip sticky direction="top">
                      <div className="font-sans text-xs">
                        <div className="font-bold text-white">{zone.name}</div>
                        <div className="text-[11px] text-slate-300">
                          Probability: <span className="font-bold text-rose-400">{zone.probability}%</span> ({zone.risk_level})
                        </div>
                        <div className="text-[10px] text-cyan-300">Click polygon to inspect telemetry &rarr;</div>
                      </div>
                    </Tooltip>
                  </Polygon>

                  {/* Animated Hazard Pulse Circle on Centroid */}
                  {showPulseRings && (zone.risk_level === 'CRITICAL' || zone.risk_level === 'HIGH') && (
                    <Circle
                      center={[centroidLat, centroidLng]}
                      radius={1200}
                      pathOptions={{
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.15,
                        weight: 1.5,
                        dashArray: '4 4'
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}

          {/* Render Evacuation Safe Corridor Polyline */}
          {showEvacRoute && (
            <>
              <Polyline
                positions={evacuationCorridorCoords}
                pathOptions={{
                  color: '#06b6d4',
                  weight: 4,
                  dashArray: '6 6',
                  opacity: 0.85
                }}
              >
                <Tooltip sticky>
                  <span className="font-mono text-xs font-bold text-cyan-300">
                    Evacuation Corridor Green-Alfa (Clear of Debris)
                  </span>
                </Tooltip>
              </Polyline>

              {/* Roadblock Warning Marker on NH-13 */}
              <Marker
                position={[27.584, 91.869]}
                icon={createCustomIcon('#ef4444', '✖', true)}
              >
                <Popup>
                  <div className="text-xs font-mono p-1">
                    <div className="font-bold text-rose-400">NH-13 Km 44 Debris Hazard</div>
                    <div className="text-slate-300 mt-1">
                      Active rockfall blockage. Traffic redirected onto High-Ridge Bypass.
                    </div>
                  </div>
                </Popup>
              </Marker>
            </>
          )}

          {/* Render Measurement Distance Line */}
          {measuredPoints.length >= 2 && (
            <Polyline
              positions={measuredPoints}
              pathOptions={{ color: '#10b981', weight: 3 }}
            />
          )}

          {/* Render IoT Sensor Markers */}
          {showSensors &&
            sensors.map((sensor) => {
              const markerColor =
                sensor.status === 'critical'
                  ? '#ef4444'
                  : sensor.status === 'warning'
                  ? '#f59e0b'
                  : '#06b6d4';
              const label = sensor.type === 'rainfall' ? 'R' : sensor.type === 'soil_moisture' ? 'S' : 'M';
              const isPulsing = sensor.status === 'critical';

              return (
                <Marker
                  key={sensor.id}
                  position={[sensor.latitude, sensor.longitude]}
                  icon={createCustomIcon(markerColor, label, isPulsing)}
                >
                  <Popup>
                    <div className="text-xs font-sans p-1">
                      <div className="font-bold text-white mb-0.5">{sensor.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {sensor.id}</div>
                      <div className="mt-1 text-cyan-300 font-mono font-bold">
                        Reading: {sensor.current_value} {sensor.unit}
                      </div>
                      <div className="text-slate-400 text-[10px]">Battery: {sensor.battery_pct}%</div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* Render Emergency Shelters & Hospitals */}
          {showShelters && (
            <>
              <Marker position={[27.5885, 91.864]} icon={createCustomIcon('#3b82f6', 'SH')}>
                <Popup>
                  <div className="text-xs">
                    <div className="font-bold text-white">Tawang Government Relief Shelter</div>
                    <div className="text-[11px] text-slate-300">Capacity: 650 persons (Medical team active)</div>
                  </div>
                </Popup>
              </Marker>
              <Marker position={[27.583, 91.8625]} icon={createCustomIcon('#10b981', 'HP')}>
                <Popup>
                  <div className="text-xs">
                    <div className="font-bold text-white">District Hospital Tawang</div>
                    <div className="text-[11px] text-slate-300">45 Trauma Beds • 6 Ambulances Staged</div>
                  </div>
                </Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>

      {/* Map Legend Footer */}
      <div className="absolute bottom-4 left-4 z-[1000] p-2.5 rounded-xl bg-command-900/90 backdrop-blur-xl border border-command-700/80 text-xs font-mono flex items-center gap-4 shadow-xl">
        <span className="text-slate-400 text-[11px] font-bold">HAZARD TIERS:</span>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-rose-400">CRITICAL (&gt;75%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-orange-500"></span>
          <span className="text-orange-400">HIGH (51-75%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-amber-500"></span>
          <span className="text-amber-400">MEDIUM (26-50%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
          <span className="text-emerald-400">LOW (0-25%)</span>
        </div>
      </div>

      {/* Side Slide Drawer for Selected Zone Inspection */}
      <SlideDrawer
        isOpen={Boolean(selectedZone)}
        onClose={() => setSelectedZone(null)}
        zone={selectedZone}
      />
    </div>
  );
};
