import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  ArrowUpRight,
  Send,
  CheckCircle2,
  Clock,
  Users,
  Building,
  Volume2,
  VolumeX,
  Code2,
  Copy,
  Check,
  FileText,
  Radio,
  Search
} from 'lucide-react';
import { api } from '../services/api';
import { AlertItem } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { Modal } from '../components/common/Modal';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlertForBroadcast, setSelectedAlertForBroadcast] = useState<AlertItem | null>(null);
  const [selectedAlertForCap, setSelectedAlertForCap] = useState<AlertItem | null>(null);
  const [capFormat, setCapFormat] = useState<'xml' | 'json'>('xml');
  const [copied, setCopied] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Web Audio dual-tone emergency siren
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sirenIntervalRef = useRef<any>(null);

  const toggleEmergencySiren = () => {
    if (isSirenPlaying) {
      // Stop siren
      if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current);
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (e) {}
      }
      setIsSirenPlaying(false);
    } else {
      // Start dual-tone siren (750 Hz <-> 960 Hz alternating every 400ms)
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(750, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        gainRef.current = gain;

        let high = false;
        sirenIntervalRef.current = setInterval(() => {
          if (!oscRef.current || !audioCtxRef.current) return;
          high = !high;
          oscRef.current.frequency.setTargetAtTime(
            high ? 960 : 750,
            audioCtxRef.current.currentTime,
            0.05
          );
        }, 400);

        setIsSirenPlaying(true);
      } catch (err) {
        console.warn('AudioContext not allowed or not supported:', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current);
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (e) {}
      }
    };
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.getAlerts();
      if (res?.alerts) setAlerts(res.alerts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleAcknowledge = async (id: string) => {
    await api.acknowledgeAlert(id);
    loadAlerts();
  };

  const handleEscalate = async (id: string) => {
    await api.escalateAlert(id);
    loadAlerts();
  };

  const handleResolve = async (id: string) => {
    await api.resolveAlert(id);
    loadAlerts();
  };

  const handleSendBroadcast = async () => {
    if (!selectedAlertForBroadcast) return;
    await api.broadcastAlert(selectedAlertForBroadcast.id, ['NDMA-CAP', 'VHF-Radio', 'Siren-Alert']);
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setSelectedAlertForBroadcast(null);
    }, 2000);
  };

  const filtered = alerts.filter((a) => {
    const matchesTab = activeTab === 'all' || a.status === activeTab;
    const matchesQuery =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const getCapXml = (alert: AlertItem) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>IN-NDMA-NER-${alert.id}</identifier>
  <sender>ai-slopeguard-ner@ndma.gov.in</sender>
  <sent>${new Date().toISOString()}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <code>DISASTER_ID:LANDSLIDE_DEBRIS_FLOW</code>
  <info>
    <category>Geo</category>
    <event>Imminent Landslide Hazard Warning</event>
    <urgency>${alert.severity === 'critical' ? 'Immediate' : 'Expected'}</urgency>
    <severity>${alert.severity === 'critical' ? 'Extreme' : 'Severe'}</severity>
    <certainty>Observed</certainty>
    <eventCode>
      <valueName>NDMA_DISASTER_CODE</valueName>
      <value>LS-01-CRIT</value>
    </eventCode>
    <headline>${alert.title}</headline>
    <description>${alert.description}</description>
    <instruction>${alert.recommended_actions}</instruction>
    <area>
      <areaDesc>${alert.location_name}, ${alert.district}, ${alert.state}</areaDesc>
      <circle>27.5857,91.8676,5.0</circle>
    </area>
    <parameter>
      <valueName>PopulationAtRisk</valueName>
      <value>${alert.affected_population}</value>
    </parameter>
    <parameter>
      <valueName>NearestReliefCenter</valueName>
      <value>${alert.nearest_center}</value>
    </parameter>
  </info>
</alert>`;
  };

  const getCapJson = (alert: AlertItem) => {
    return JSON.stringify(
      {
        alert: {
          identifier: `IN-NDMA-NER-${alert.id}`,
          sender: 'ai-slopeguard-ner@ndma.gov.in',
          sent: new Date().toISOString(),
          status: 'Actual',
          msgType: 'Alert',
          scope: 'Public',
          info: {
            category: 'Geo',
            event: 'Landslide Warning',
            urgency: alert.severity === 'critical' ? 'Immediate' : 'Expected',
            severity: alert.severity === 'critical' ? 'Extreme' : 'Severe',
            certainty: 'Observed',
            headline: alert.title,
            description: alert.description,
            instruction: alert.recommended_actions,
            area: {
              areaDesc: `${alert.location_name}, ${alert.district}, ${alert.state}`,
              coordinates: { lat: 27.5857, lng: 91.8676, radius_km: 5.0 }
            },
            parameters: {
              population_at_risk: alert.affected_population,
              nearest_relief_center: alert.nearest_center
            }
          }
        }
      },
      null,
      2
    );
  };

  const handleCopyPayload = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const activeCount = alerts.filter((a) => a.status === 'active').length;
  const escalatedCount = alerts.filter((a) => a.status === 'escalated').length;

  return (
    <div className="p-6 space-y-6 max-w-[1750px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-500" /> Disaster Warning & Alert Management Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Common Alerting Protocol (CAP v1.2) multi-hazard early warning orchestration for NDMA & district authorities.
          </p>
        </div>

        {/* Audio Siren Tester & Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleEmergencySiren}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border shadow-lg ${
              isSirenPlaying
                ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/40 animate-pulse'
                : 'bg-command-900 hover:bg-command-800 text-rose-300 border-rose-500/40'
            }`}
          >
            {isSirenPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isSirenPlaying ? 'SILENCE EMERGENCY SIREN' : 'TEST EMERGENCY SIREN'}
          </button>
        </div>
      </div>

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-panel p-4 rounded-xl border border-command-700/80">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Active Red Warnings</span>
          <span className="text-2xl font-bold font-mono text-rose-400 mt-0.5 block">{criticalCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-command-700/80">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Pending Acknowledgment</span>
          <span className="text-2xl font-bold font-mono text-amber-300 mt-0.5 block">{activeCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-command-700/80">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Escalated to SDMA</span>
          <span className="text-2xl font-bold font-mono text-purple-300 mt-0.5 block">{escalatedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-command-700/80">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">CAP v1.2 Protocol Gateways</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 mt-0.5 block">3 ONLINE</span>
        </div>
      </div>

      {/* Status Filter Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center p-1 rounded-xl bg-command-900 border border-command-700 text-xs font-mono">
          {['all', 'active', 'acknowledged', 'escalated', 'resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                activeTab === tab ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search warning or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl glass-input text-xs font-mono"
          />
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className={`glass-panel-elevated p-6 rounded-2xl border transition-all ${
              alert.severity === 'critical'
                ? 'border-rose-500/60 shadow-lg shadow-rose-950/30'
                : 'border-command-700'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              {/* Alert Title & Location Info */}
              <div className="space-y-1.5 flex-1 min-w-[280px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <RiskBadge level={alert.severity} size="sm" />
                  <span className="text-xs font-mono text-cyan-400 font-bold">{alert.id}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-command-950 px-2 py-0.5 rounded border border-command-700">
                    Status: {alert.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {alert.triggered_at}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-wide">{alert.title}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Sector: {alert.location_name} ({alert.district}, {alert.state})
                </p>
                <p className="text-xs text-slate-300 pt-1 leading-relaxed">{alert.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {alert.status === 'active' && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-200 text-xs font-mono font-semibold transition-colors border border-command-700"
                  >
                    Acknowledge
                  </button>
                )}

                {alert.status !== 'escalated' && alert.status !== 'resolved' && (
                  <button
                    onClick={() => handleEscalate(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-semibold transition-colors"
                  >
                    Escalate to SDMA
                  </button>
                )}

                {alert.status !== 'resolved' && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-semibold transition-colors"
                  >
                    Resolve Alert
                  </button>
                )}

                {/* Inspect CAP Payload Button */}
                <button
                  onClick={() => setSelectedAlertForCap(alert)}
                  className="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-command-700 transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" /> CAP Payload
                </button>

                <button
                  onClick={() => setSelectedAlertForBroadcast(alert)}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch CAP Broadcast
                </button>
              </div>
            </div>

            {/* Sub-info: Actions & Critical Facility */}
            <div className="mt-4 pt-4 border-t border-command-700/60 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-command-950/70 border border-command-700/60">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Recommended Response Directive</span>
                <p className="text-slate-200 text-[11px] whitespace-pre-line">{alert.recommended_actions}</p>
              </div>

              <div className="p-3 rounded-xl bg-command-950/70 border border-command-700/60">
                <span className="text-[10px] text-slate-400 uppercase block mb-1 flex items-center gap-1">
                  <Building className="w-3 h-3 text-cyan-400" /> Staged Emergency Facility
                </span>
                <p className="text-slate-200 font-bold text-[11px]">{alert.nearest_center}</p>
              </div>

              <div className="p-3 rounded-xl bg-command-950/70 border border-command-700/60">
                <span className="text-[10px] text-slate-400 uppercase block mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3 text-emerald-400" /> Population Impact
                </span>
                <p className="text-white font-bold text-sm">{alert.affected_population.toLocaleString()} citizens</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CAP v1.2 Payload Inspector Modal */}
      {selectedAlertForCap && (
        <Modal
          isOpen={Boolean(selectedAlertForCap)}
          onClose={() => setSelectedAlertForCap(null)}
          title={`NDMA Common Alerting Protocol (CAP v1.2): ${selectedAlertForCap.id}`}
          subtitle="Machine-readable disaster schema format for national gateway ingestion"
          maxWidth="4xl"
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-command-700">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCapFormat('xml')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    capFormat === 'xml'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white bg-command-900'
                  }`}
                >
                  XML Schema (OASIS CAP v1.2)
                </button>
                <button
                  onClick={() => setCapFormat('json')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    capFormat === 'json'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white bg-command-900'
                  }`}
                >
                  JSON Feed Format
                </button>
              </div>

              <button
                onClick={() =>
                  handleCopyPayload(
                    capFormat === 'xml' ? getCapXml(selectedAlertForCap) : getCapJson(selectedAlertForCap)
                  )
                }
                className="px-3 py-1 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied to Clipboard' : 'Copy Payload'}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-command-950 border border-command-700 overflow-x-auto text-[11px] text-cyan-300 leading-relaxed max-h-96">
              <code>{capFormat === 'xml' ? getCapXml(selectedAlertForCap) : getCapJson(selectedAlertForCap)}</code>
            </pre>

            <div className="flex items-center justify-between pt-2 border-t border-command-700 text-slate-400 text-[11px]">
              <span>Compliant with ITU-T X.1303 & NDMA Disaster Early Warning Specifications</span>
              <button
                onClick={() => setSelectedAlertForCap(null)}
                className="px-4 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Broadcast Dispatch Confirmation Modal */}
      {selectedAlertForBroadcast && (
        <Modal
          isOpen={Boolean(selectedAlertForBroadcast)}
          onClose={() => setSelectedAlertForBroadcast(null)}
          title="Dispatch NDMA Common Alerting Protocol (CAP) Broadcast"
          subtitle={`Disaster Notification Feed ID: ${selectedAlertForBroadcast.id}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs font-mono">
            <p className="text-slate-300">
              Confirm dispatching emergency public notification payload across the following disaster channels:
            </p>

            <div className="space-y-2 p-3 rounded-xl bg-command-950/80 border border-command-700">
              <label className="flex items-center gap-2 text-slate-300">
                <input type="checkbox" defaultChecked className="rounded bg-command-900 border-command-700 text-cyan-500" />
                <span>State Disaster Management Control Room (SDMA Hotline)</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300">
                <input type="checkbox" defaultChecked className="rounded bg-command-900 border-command-700 text-cyan-500" />
                <span>Local Community Siren & VHF PA Radio System</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300">
                <input type="checkbox" defaultChecked className="rounded bg-command-900 border-command-700 text-cyan-500" />
                <span>District Magistrate & BRO Vartak Highway Dispatch</span>
              </label>
            </div>

            {broadcastSent ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Broadcast packet successfully transmitted to all 3 gateways.</span>
              </div>
            ) : (
              <div className="pt-3 border-t border-command-700 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAlertForBroadcast(null)}
                  className="px-4 py-2 rounded-lg bg-command-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendBroadcast}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Transmit Broadcast
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
