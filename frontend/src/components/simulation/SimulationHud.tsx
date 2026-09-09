import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Activity,
  Droplets,
  Waves,
  Mountain,
  ShieldAlert,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  FastForward,
  Navigation
} from 'lucide-react';
import { api } from '../../services/api';
import { GaugeChart } from '../common/GaugeChart';
import { RiskBadge } from '../common/RiskBadge';
import { useNavigate } from 'react-router-dom';

interface SimulationHudProps {
  onSimulationUpdate?: (result: any) => void;
}

// Synthesize alert beep using standard Web Audio API (zero external sound file dependency)
const playAlertSound = (freq = 880, type: OscillatorType = 'sine') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // AudioContext permission may require user gesture
  }
};

export const SimulationHud: React.FC<SimulationHudProps> = ({ onSimulationUpdate }) => {
  const navigate = useNavigate();

  // Manual Slider States
  const [rainfall, setRainfall] = useState(85.0);
  const [moisture, setMoisture] = useState(62.0);
  const [movement, setMovement] = useState(1.8);
  const [slope, setSlope] = useState(38.4);
  const [sensorFailure, setSensorFailure] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Automated 1-Click Demo Runner States
  const [isAutoDemoRunning, setIsAutoDemoRunning] = useState(false);
  const [demoStepIndex, setDemoStepIndex] = useState(0);
  const autoDemoTimerRef = useRef<any>(null);

  const demoSteps = [
    { title: 'Normal Baseline', r: 35.0, m: 42.0, g: 0.4, s: 32.0, status: 'STABLE' },
    { title: 'Monsoon Front Influx', r: 90.0, m: 58.0, g: 1.2, s: 38.4, status: 'ELEVATED' },
    { title: 'Torrential Cloudburst', r: 155.0, m: 76.0, g: 3.1, s: 38.4, status: 'HIGH RISK' },
    { title: 'Bedrock Shear Rupture', r: 210.0, m: 92.0, g: 6.8, s: 38.4, status: 'CRITICAL FAILURE' }
  ];

  const triggerRecalculate = async (
    rainVal = rainfall,
    moistVal = moisture,
    moveVal = movement,
    slopeVal = slope,
    failVal = sensorFailure
  ) => {
    setLoading(true);
    try {
      const res = await api.runSimulation({
        rainfall_increase_mm: rainVal,
        soil_moisture_pct: moistVal,
        ground_movement_mm: moveVal,
        slope_tilt_deg: slopeVal,
        simulate_sensor_failure: failVal
      });
      setSimResult(res);
      if (onSimulationUpdate) onSimulationUpdate(res);
      if (soundEnabled && res?.prediction?.risk_level === 'CRITICAL') {
        playAlertSound(660, 'sawtooth');
      }
    } catch (e) {
      console.error('Simulation run failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    triggerRecalculate();
  }, []);

  // Autonomous Demo Runner Logic
  const startAutoDemo = () => {
    if (isAutoDemoRunning) {
      clearInterval(autoDemoTimerRef.current);
      setIsAutoDemoRunning(false);
      return;
    }

    setIsAutoDemoRunning(true);
    setDemoStepIndex(0);
    let step = 0;

    const executeStep = (idx: number) => {
      const s = demoSteps[idx];
      setRainfall(s.r);
      setMoisture(s.m);
      setMovement(s.g);
      setSlope(s.s);
      triggerRecalculate(s.r, s.m, s.g, s.s, sensorFailure);
      if (soundEnabled) playAlertSound(idx === 3 ? 980 : 440);
    };

    executeStep(0);

    autoDemoTimerRef.current = setInterval(() => {
      step++;
      if (step >= demoSteps.length) {
        clearInterval(autoDemoTimerRef.current);
        setIsAutoDemoRunning(false);
      } else {
        setDemoStepIndex(step);
        executeStep(step);
      }
    }, 4500);
  };

  useEffect(() => {
    return () => {
      if (autoDemoTimerRef.current) clearInterval(autoDemoTimerRef.current);
    };
  }, []);

  const applyPreset = (name: 'cloudburst' | 'saturation' | 'fault' | 'normal') => {
    let r = 85.0, m = 62.0, g = 1.8, s = 38.4;
    if (name === 'cloudburst') {
      r = 195.0; m = 88.0; g = 5.2;
    } else if (name === 'saturation') {
      r = 120.0; m = 94.0; g = 3.6;
    } else if (name === 'fault') {
      r = 140.0; m = 78.0; g = 8.8; s = 42.0;
    } else {
      r = 35.0; m = 42.0; g = 0.4; s = 32.0;
    }
    setRainfall(r);
    setMoisture(m);
    setMovement(g);
    setSlope(s);
    triggerRecalculate(r, m, g, s, sensorFailure);
  };

  return (
    <div className="space-y-6">
      {/* 1-Click Automated Demo Control Bar */}
      <div className="p-4 rounded-2xl glass-panel-elevated border border-cyan-500/60 shadow-xl flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-command-900 via-command-850 to-command-900">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse">
            <Zap className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-extrabold text-cyan-300 uppercase tracking-wider">
                Autonomous Hackathon Evaluation Engine
              </span>
              <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                1-CLICK RUNNER
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Automatically surges rainfall & soil moisture through the full early-warning chain for evaluators.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-command-800 border border-command-700 text-slate-300 hover:text-white"
            title={soundEnabled ? 'Mute Alert Audio' : 'Enable Alert Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={startAutoDemo}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-extrabold flex items-center gap-2 transition-all shadow-xl ${
              isAutoDemoRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950'
            }`}
          >
            {isAutoDemoRunning ? <Pause className="w-4 h-4" /> : <FastForward className="w-4 h-4" />}
            <span>{isAutoDemoRunning ? `Stage ${demoStepIndex + 1}/4 Running...` : 'Run 1-Click Demo Evaluation'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sliders & Presets (7 cols) */}
        <div className="lg:col-span-7 glass-panel-elevated p-6 rounded-2xl border border-command-700 space-y-6">
          <div className="flex items-center justify-between border-b border-command-700/80 pb-4">
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide font-mono uppercase">
                Manual Stress-Testing Console
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect how progressive saturation weakens slope shear equilibrium.
              </p>
            </div>

            <button
              onClick={() => applyPreset('normal')}
              className="p-2 rounded-xl bg-command-800 hover:bg-command-700 text-slate-400 hover:text-white border border-command-700 transition-colors"
              title="Reset to Normal Baseline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Scenario Injection Presets */}
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 block">
              Inject Disaster Scenarios:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => applyPreset('cloudburst')}
                className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all text-left"
              >
                <Droplets className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Cloudburst (195mm)</span>
              </button>
              <button
                onClick={() => applyPreset('saturation')}
                className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all text-left"
              >
                <Waves className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Pore Pressure Surge</span>
              </button>
              <button
                onClick={() => applyPreset('fault')}
                className="px-3 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-all text-left"
              >
                <Activity className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Active Shear Slip</span>
              </button>
              <button
                onClick={() => applyPreset('normal')}
                className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all text-left"
              >
                <Mountain className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Dry Baseline</span>
              </button>
            </div>
          </div>

          {/* Environmental Sliders */}
          <div className="space-y-4 pt-1">
            {/* Precipitation Slider */}
            <div className="p-3.5 rounded-xl bg-command-950/70 border border-command-700/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                  <Droplets className="w-4 h-4 text-cyan-400" /> 24h Cumulative Precipitation
                </span>
                <span className="font-mono font-bold text-cyan-300 text-sm">{rainfall.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="10"
                max="280"
                step="5"
                value={rainfall}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setRainfall(val);
                  triggerRecalculate(val, moisture, movement, slope, sensorFailure);
                }}
                className="w-full h-2 bg-command-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>10 mm (Dry)</span>
                <span>100 mm (Warning)</span>
                <span>150 mm (High)</span>
                <span>280 mm (Extreme Cloudburst)</span>
              </div>
            </div>

            {/* Soil Moisture Slider */}
            <div className="p-3.5 rounded-xl bg-command-950/70 border border-command-700/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                  <Waves className="w-4 h-4 text-emerald-400" /> Volumetric Soil Saturation (VWC)
                </span>
                <span className="font-mono font-bold text-emerald-300 text-sm">{moisture.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="98"
                step="1"
                value={moisture}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setMoisture(val);
                  triggerRecalculate(rainfall, val, movement, slope, sensorFailure);
                }}
                className="w-full h-2 bg-command-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>20% (Dry)</span>
                <span>60% (Field Capacity)</span>
                <span>80% (Pore Rise)</span>
                <span>98% (Liquefaction)</span>
              </div>
            </div>

            {/* Extensometer Displacement Slider */}
            <div className="p-3.5 rounded-xl bg-command-950/70 border border-command-700/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                  <Activity className="w-4 h-4 text-rose-400" /> Extensometer Ground Displacement Velocity
                </span>
                <span className="font-mono font-bold text-rose-400 text-sm">{movement.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="12.0"
                step="0.2"
                value={movement}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setMovement(val);
                  triggerRecalculate(rainfall, moisture, val, slope, sensorFailure);
                }}
                className="w-full h-2 bg-command-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0.1 mm (Stable)</span>
                <span>2.0 mm (Creep)</span>
                <span>5.0 mm (Accelerated Slip)</span>
                <span>12.0 mm (Mass Rupture)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output HUD (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {simResult ? (
            <>
              {/* Dynamic Risk Readout Card */}
              <div className="glass-panel-elevated p-6 rounded-2xl border border-command-700 text-center relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Dynamic AI Inference</span>
                  <RiskBadge level={simResult.prediction.risk_level} size="md" />
                </div>

                <GaugeChart
                  probability={simResult.prediction.probability}
                  riskLevel={simResult.prediction.risk_level}
                  confidence={simResult.prediction.confidence}
                  factorOfSafety={simResult.prediction.factor_of_safety}
                  size={220}
                />

                {/* Spontaneous Alert Banner */}
                {simResult.spontaneous_alert && (
                  <div className="mt-4 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-left animate-in fade-in duration-300 space-y-2">
                    <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
                      <span>{simResult.spontaneous_alert.title}</span>
                    </div>
                    <p className="text-[11px] text-rose-200/90 leading-relaxed">
                      Compounding saturation ({moisture}%) and displacement ({movement}mm) have collapsed Factor of Safety to {simResult.prediction.factor_of_safety}.
                    </p>
                    <div className="pt-2 border-t border-rose-500/30 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-rose-300">Action Recommendation:</span>
                      <button
                        onClick={() => navigate('/emergency')}
                        className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold font-mono flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3" /> Safe Evacuation Route
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Feature Attribution */}
              <div className="glass-panel p-5 rounded-2xl border border-command-700 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> SHAP-Equivalent Attribution
                </h4>
                <div className="space-y-2.5">
                  {simResult.contributions.map((c: any) => (
                    <div key={c.short_name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300">{c.short_name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono">{c.value_display}</span>
                          <span className="font-mono font-bold text-white">{c.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-command-950 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${c.percentage}%`, backgroundColor: c.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 glass-panel rounded-2xl text-center text-xs text-slate-400 font-mono">
              Recalculating geotechnical vectors...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
