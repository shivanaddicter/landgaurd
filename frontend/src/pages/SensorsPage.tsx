import React, { useState, useEffect } from 'react';
import {
  Radio,
  Plus,
  Activity,
  Battery,
  Wifi,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Terminal,
  Pause,
  Play,
  Layers,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { SensorItem } from '../types';
import { StatusIndicator } from '../components/common/StatusIndicator';
import { Modal } from '../components/common/Modal';
import { SoilProfileVisualizer } from '../components/charts/SoilProfileVisualizer';
import { InclinometerBubble } from '../components/charts/InclinometerBubble';

interface TelemetryPacket {
  id: string;
  devEui: string;
  station: string;
  rssi: number;
  snr: number;
  freq: string;
  payloadHex: string;
  parsedVal: string;
  timestamp: string;
}

export const SensorsPage: React.FC = () => {
  const [sensors, setSensors] = useState<SensorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedSensor, setSelectedSensor] = useState<any>(null);
  const [sensorHistory, setSensorHistory] = useState<any[]>([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // New sensor form state
  const [newSensorId, setNewSensorId] = useState('');
  const [newSensorName, setNewSensorName] = useState('');
  const [newSensorType, setNewSensorType] = useState('rainfall');
  const [newLocation, setNewLocation] = useState('Tawang High Ridge');

  // Simulated live LoRaWAN packets feed
  const [packets, setPackets] = useState<TelemetryPacket[]>([
    {
      id: 'PKT-9421',
      devEui: '70B3D57ED0054A11',
      station: 'SNS-TWG-RAIN-01',
      rssi: -92,
      snr: 8.4,
      freq: '865.2 MHz (SF8)',
      payloadHex: '01 67 01 24 02 68 84',
      parsedVal: 'Rain: 138.4 mm/24h',
      timestamp: 'Just now'
    },
    {
      id: 'PKT-9420',
      devEui: '70B3D57ED0054B22',
      station: 'SNS-TWG-TILT-02',
      rssi: -101,
      snr: 4.2,
      freq: '865.4 MHz (SF9)',
      payloadHex: '03 71 00 1E 00 28',
      parsedVal: 'Tilt: X=+3.2° Y=+4.1°',
      timestamp: '4s ago'
    },
    {
      id: 'PKT-9419',
      devEui: '70B3D57ED0054C33',
      station: 'SNS-TWG-SOIL-03',
      rssi: -88,
      snr: 9.8,
      freq: '865.1 MHz (SF7)',
      payloadHex: '02 02 02 E6 04 02',
      parsedVal: 'Moisture: 74.2% VWC',
      timestamp: '9s ago'
    }
  ]);
  const [terminalPaused, setTerminalPaused] = useState(false);

  const loadSensors = async () => {
    try {
      setLoading(true);
      const res = await api.getSensors();
      if (res?.sensors) setSensors(res.sensors);
    } catch (e) {
      console.error('Failed to load sensors:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSensors();
  }, []);

  // Periodic simulated packet generation
  useEffect(() => {
    if (terminalPaused) return;
    const interval = setInterval(() => {
      const hexRandom = Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .toUpperCase()
        .padStart(6, '0');
      const randomSensor = sensors[Math.floor(Math.random() * (sensors.length || 1))];
      const newPkt: TelemetryPacket = {
        id: `PKT-${Math.floor(1000 + Math.random() * 9000)}`,
        devEui: `70B3D57ED005${Math.floor(10 + Math.random() * 89)}`,
        station: randomSensor?.id || 'SNS-TWG-RAIN-01',
        rssi: -85 - Math.floor(Math.random() * 25),
        snr: Number((3.0 + Math.random() * 8.0).toFixed(1)),
        freq: `865.${Math.floor(1 + Math.random() * 8)} MHz (SF${7 + Math.floor(Math.random() * 3)})`,
        payloadHex: `01 02 ${hexRandom.slice(0, 2)} ${hexRandom.slice(2, 4)} ${hexRandom.slice(4, 6)}`,
        parsedVal: `${randomSensor?.name?.split(' ')[0] || 'Telemetry'}: ${(Math.random() * 50 + 10).toFixed(1)} ${randomSensor?.unit || 'val'}`,
        timestamp: 'Just now'
      };

      setPackets((prev) => [newPkt, ...prev.slice(0, 7)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [terminalPaused, sensors]);

  const handleInspectSensor = async (s: SensorItem) => {
    try {
      const res = await api.getSensorDetail(s.id);
      setSelectedSensor(res?.sensor || s);
      setSensorHistory(res?.history || []);
    } catch (e) {
      setSelectedSensor(s);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSensorId || !newSensorName) return;

    const unitMap: Record<string, string> = {
      rainfall: 'mm/hr',
      soil_moisture: '%',
      ground_movement: 'mm',
      tilt: '°',
      temperature: '°C'
    };

    await api.registerSensor({
      id: newSensorId,
      name: newSensorName,
      type: newSensorType,
      location_id: 'LOC-TWG-01',
      location_name: newLocation,
      latitude: 27.5857,
      longitude: 91.8676,
      unit: unitMap[newSensorType] || 'units',
      hardware_uid: `LORA-MANUAL-${Math.floor(Math.random() * 10000)}`
    });

    setShowRegisterModal(false);
    setNewSensorId('');
    setNewSensorName('');
    loadSensors();
  };

  const handleDelete = async (sensorId: string) => {
    if (confirm(`Decommission sensor node ${sensorId}?`)) {
      await api.deleteSensor(sensorId);
      setSelectedSensor(null);
      loadSensors();
    }
  };

  const filtered = sensors.filter((s) => {
    if (filterType === 'all') return true;
    return s.type === filterType;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1750px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-emerald-400" /> IoT Ground Telemetry Fleet & Geotechnical Diagnostics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time wireless LoRaWAN sensor network across critical mountain slope sections in North East India.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono tracking-wide shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Register Sensor Node
          </button>
        </div>
      </div>

      {/* Geotechnical Diagnostics Section: Subsurface Profile & Inclinometer Bubble */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subsurface Stratigraphy (7 cols) */}
        <div className="lg:col-span-7">
          <SoilProfileVisualizer saturationPct={74.2} porePressureKpa={18.4} />
        </div>

        {/* Biaxial Spirit Inclinometer & LoRaWAN Health (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <InclinometerBubble tiltDeg={4.1} tiltX={3.2} tiltY={4.1} size={180} />

          {/* LoRaWAN Network Health Summary */}
          <div className="glass-panel p-5 rounded-2xl border border-command-700 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-command-700/70">
              <span className="font-bold text-white uppercase flex items-center gap-1.5">
                <Wifi className="w-4 h-4 text-cyan-400" /> Gateway Gateway-NER-TWG-01
              </span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE • 99.8% PDR
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2.5 rounded-xl bg-command-950/80 border border-command-700/60">
                <span className="text-[10px] text-slate-400 block">Nodes Online</span>
                <span className="text-base font-bold text-white mt-0.5 block">{sensors.length} / 24</span>
              </div>
              <div className="p-2.5 rounded-xl bg-command-950/80 border border-command-700/60">
                <span className="text-[10px] text-slate-400 block">Mean RSSI</span>
                <span className="text-base font-bold text-purple-300 mt-0.5 block">-94 dBm</span>
              </div>
              <div className="p-2.5 rounded-xl bg-command-950/80 border border-command-700/60">
                <span className="text-[10px] text-slate-400 block">Band</span>
                <span className="text-base font-bold text-cyan-300 mt-0.5 block">IN865</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live LoRaWAN Packet Terminal */}
      <div className="glass-panel p-5 rounded-2xl border border-command-700 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-command-700/70">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Live LoRaWAN Telemetry Packet Sniffer
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> STREAMING
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTerminalPaused(!terminalPaused)}
              className="px-2.5 py-1 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono flex items-center gap-1 transition-all"
            >
              {terminalPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
              {terminalPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={() => setPackets([])}
              className="px-2.5 py-1 rounded-lg bg-command-800 hover:bg-command-700 text-slate-400 text-xs font-mono transition-all"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-command-950 text-slate-400 border-b border-command-700">
              <tr>
                <th className="p-2">Frame ID</th>
                <th className="p-2">Station Node</th>
                <th className="p-2">DevEUI</th>
                <th className="p-2">Frequency / SF</th>
                <th className="p-2">RSSI / SNR</th>
                <th className="p-2">Payload (Hex)</th>
                <th className="p-2">Decoded Telemetry</th>
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-command-700/40">
              {packets.map((pkt) => (
                <tr key={pkt.id} className="hover:bg-command-800/30 transition-colors">
                  <td className="p-2 text-cyan-400 font-bold">{pkt.id}</td>
                  <td className="p-2 text-white font-medium">{pkt.station}</td>
                  <td className="p-2 text-slate-400 text-[11px]">{pkt.devEui}</td>
                  <td className="p-2 text-slate-300">{pkt.freq}</td>
                  <td className="p-2 text-purple-300">{pkt.rssi} dBm / {pkt.snr} dB</td>
                  <td className="p-2 text-amber-300/90 font-mono text-[11px]">{pkt.payloadHex}</td>
                  <td className="p-2 text-emerald-300 font-bold">{pkt.parsedVal}</td>
                  <td className="p-2 text-slate-500">{pkt.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        {[
          { id: 'all', label: 'All Sensors' },
          { id: 'rainfall', label: 'Rainfall Pluviometers' },
          { id: 'soil_moisture', label: 'TDR Soil Moisture' },
          { id: 'ground_movement', label: 'Wire Extensometers / GNSS' },
          { id: 'tilt', label: 'Biaxial Inclinometers' },
          { id: 'temperature', label: 'Temperature / Humidity' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              filterType === tab.id
                ? 'bg-command-800 text-cyan-400 font-bold border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white bg-command-900/60 border border-command-700/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((s) => (
          <div
            key={s.id}
            onClick={() => handleInspectSensor(s)}
            className="glass-panel p-5 rounded-2xl border border-command-700/80 hover:border-cyan-500/50 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  {s.id}
                </span>
                <StatusIndicator status={s.status} label={s.status} />
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                {s.name}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{s.location_name}</p>

              {/* Main Reading */}
              <div className="mt-4 p-3 rounded-xl bg-command-950/80 border border-command-700/60 flex items-baseline justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Live Telemetry</span>
                <div className="text-2xl font-extrabold font-mono text-white">
                  {s.current_value} <span className="text-xs font-normal text-slate-400">{s.unit}</span>
                </div>
              </div>
            </div>

            {/* Health Specs Footer */}
            <div className="mt-4 pt-3 border-t border-command-700/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                <Battery className={`w-3.5 h-3.5 ${s.battery_pct < 30 ? 'text-rose-400' : 'text-emerald-400'}`} />
                <span>{s.battery_pct}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                <span>{s.signal_rssi} dBm</span>
              </div>
              <span className="text-slate-500">{s.last_update}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sensor Inspection Modal */}
      {selectedSensor && (
        <Modal
          isOpen={Boolean(selectedSensor)}
          onClose={() => setSelectedSensor(null)}
          title={`Telemetry Station: ${selectedSensor.name}`}
          subtitle={`Node UID: ${selectedSensor.hardware_uid} • LoRaWAN IN865 Band`}
          maxWidth="2xl"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-command-950/80 border border-command-700">
                <span className="text-[10px] font-mono text-slate-400 block">Current Telemetry</span>
                <span className="text-2xl font-bold font-mono text-cyan-300 mt-0.5 block">
                  {selectedSensor.current_value} {selectedSensor.unit}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-command-950/80 border border-command-700">
                <span className="text-[10px] font-mono text-slate-400 block">Battery Level</span>
                <span className="text-2xl font-bold font-mono text-emerald-300 mt-0.5 block">
                  {selectedSensor.battery_pct}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-command-950/80 border border-command-700">
                <span className="text-[10px] font-mono text-slate-400 block">Signal RSSI</span>
                <span className="text-2xl font-bold font-mono text-purple-300 mt-0.5 block">
                  {selectedSensor.signal_rssi} dBm
                </span>
              </div>
            </div>

            {/* Reading History Table */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider mb-2">
                24-Hour Telemetry History
              </h4>
              <div className="max-h-48 overflow-y-auto border border-command-700 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-command-950 text-slate-400 border-b border-command-700">
                    <tr>
                      <th className="p-2.5">Time</th>
                      <th className="p-2.5">Observed Reading</th>
                      <th className="p-2.5">Telemetry Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-command-700/50">
                    {sensorHistory.map((h, i) => (
                      <tr key={i} className="hover:bg-command-800/40">
                        <td className="p-2.5 text-slate-400">{h.timestamp}</td>
                        <td className="p-2.5 text-white font-bold">{h.value} {selectedSensor.unit}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            h.status === 'nominal' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                          }`}>
                            {h.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-command-700/70">
              <button
                onClick={() => handleDelete(selectedSensor.id)}
                className="px-3 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Decommission Node
              </button>

              <button
                onClick={() => setSelectedSensor(null)}
                className="px-4 py-2 rounded-lg bg-command-800 hover:bg-command-700 text-white text-xs font-mono font-semibold transition-colors"
              >
                Close Console
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Register Sensor Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Register New Field Telemetry Node"
        subtitle="Provision and commission a LoRaWAN / MQTT station in the NER network."
        maxWidth="md"
      >
        <form onSubmit={handleRegister} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-slate-300 mb-1">Sensor Station ID</label>
            <input
              type="text"
              required
              value={newSensorId}
              onChange={(e) => setNewSensorId(e.target.value)}
              placeholder="e.g. SNS-TWG-EXT-05"
              className="w-full p-2.5 rounded-lg glass-input text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Station Hardware Name</label>
            <input
              type="text"
              required
              value={newSensorName}
              onChange={(e) => setNewSensorName(e.target.value)}
              placeholder="e.g. Tawang Ridge Optical Inclinometer"
              className="w-full p-2.5 rounded-lg glass-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Sensor Type</label>
              <select
                value={newSensorType}
                onChange={(e) => setNewSensorType(e.target.value)}
                className="w-full p-2.5 rounded-lg glass-input text-xs"
              >
                <option value="rainfall">Rainfall Pluviometer</option>
                <option value="soil_moisture">TDR Soil Moisture</option>
                <option value="ground_movement">GNSS Extensometer</option>
                <option value="tilt">Biaxial Inclinometer</option>
                <option value="temperature">Ambient Temp/Humidity</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Target Sector</label>
              <select
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full p-2.5 rounded-lg glass-input text-xs"
              >
                <option value="Tawang High Ridge">Tawang High Ridge</option>
                <option value="Bomdila Pass Corridor">Bomdila Pass Corridor</option>
                <option value="Bhalukpong Valley">Bhalukpong Valley</option>
                <option value="Sela Tunnel Approach">Sela Tunnel Approach</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-command-700 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowRegisterModal(false)}
              className="px-4 py-2 rounded-lg bg-command-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md"
            >
              Commission Station
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
