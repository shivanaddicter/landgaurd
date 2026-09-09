import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BrainCircuit,
  Clock,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Sliders,
  Layers,
  TrendingUp,
  TrendingDown,
  Info,
  RefreshCw,
  BarChart3,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { GaugeChart } from '../components/common/GaugeChart';
import { RiskBadge } from '../components/common/RiskBadge';
import { FosSensitivityChart } from '../components/charts/FosSensitivityChart';

export const PredictionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const locationParam = searchParams.get('location_id') || 'LOC-TWG-01';

  const [selectedHorizon, setSelectedHorizon] = useState<'1h' | '6h' | '24h' | '72h'>('24h');
  const [rainfall, setRainfall] = useState(138.4);
  const [moisture, setMoisture] = useState(74.2);
  const [slope, setSlope] = useState(38.4);
  const [movement, setMovement] = useState(4.8);
  const [elevation, setElevation] = useState(3048);

  const [prediction, setPrediction] = useState<any>(null);
  const [contributions, setContributions] = useState<any[]>([]);
  const [explanation, setExplanation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeExplainTab, setActiveExplainTab] = useState<'shap' | 'fos_curve'>('shap');

  const runPrediction = async (r = rainfall, m = moisture, s = slope, g = movement, el = elevation) => {
    setLoading(true);
    try {
      const res = await api.recalculateRisk({
        rainfall_24h_mm: r,
        soil_moisture_pct: m,
        slope_deg: s,
        ground_movement_mm: g,
        elevation_m: el
      });
      if (res?.success) {
        setPrediction(res.prediction);
        setContributions(res.contributions);
        setExplanation(res.explanation);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runPrediction();
  }, [locationParam]);

  const currentProb = prediction?.horizons?.[selectedHorizon] ?? (prediction?.probability || 82.5);
  const calculatedFos = prediction?.factor_of_safety ?? 0.88;

  // Enrich SHAP forces into positive (destabilizing) and negative (stabilizing/buffering)
  const positiveForces = contributions.filter(
    (c) => ['rainfall', 'moisture', 'slope', 'movement'].includes(c.short_name) || c.percentage > 15
  );
  const stabilizingFactors = [
    { name: 'Root Tensile Cohesion (c_r)', value: '6.2 kPa', delta: '-14.5%', factor: 'Vegetation anchoring' },
    { name: 'Basal Friction Angle (φ)', value: '32.0°', delta: '-11.2%', factor: 'Granular interlock' },
    { name: 'Subsurface Drainage Discharge', value: '18.4 L/min', delta: '-7.8%', factor: 'Pore relief' }
  ];

  const resetToDefault = () => {
    setRainfall(138.4);
    setMoisture(74.2);
    setSlope(38.4);
    setMovement(4.8);
    setElevation(3048);
    runPrediction(138.4, 74.2, 38.4, 4.8, 3048);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1750px] mx-auto animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <BrainCircuit className="w-6 h-6 text-cyan-400" /> AI Landslide Risk Prediction & Explainability
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Physics-Informed XGBoost Model v2.4 combining Infinite Slope FoS stability with multi-horizon uncertainty.
          </p>
        </div>

        {/* Prediction Horizon Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefault}
            className="px-3 py-1.5 rounded-xl bg-command-900 hover:bg-command-800 text-slate-300 border border-command-700 text-xs font-mono flex items-center gap-1.5 transition-all"
            title="Reset to default sensor telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Inputs
          </button>

          <div className="flex items-center p-1.5 rounded-xl bg-command-900/90 border border-command-700/80">
            <span className="text-xs font-mono text-slate-400 px-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> HORIZON:
            </span>
            {(['1h', '6h', '24h', '72h'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedHorizon === h
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-command-800'
                }`}
              >
                +{h.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Output Readout + Explainability Waterfall (7 cols) & Input Sandbox (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Prediction Gauge, Explainability, and FoS Curve */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gauge & Horizon Probability Card */}
          <div className="glass-panel-elevated p-6 rounded-2xl border border-command-700 text-center relative overflow-hidden">
            {loading && (
              <div className="absolute inset-0 bg-command-950/60 backdrop-blur-sm z-20 flex items-center justify-center">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold animate-pulse">
                  <Activity className="w-4 h-4 animate-spin" /> Recalculating Physics & AI Vectors...
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-4 pb-3 border-b border-command-700/70">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase">Selected Horizon Target</span>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  Forecast Window: Next {selectedHorizon.toUpperCase()}
                </div>
              </div>
              <RiskBadge level={prediction?.risk_level || 'HIGH'} size="lg" />
            </div>

            <GaugeChart
              probability={currentProb}
              riskLevel={prediction?.risk_level || 'HIGH'}
              confidence={prediction?.confidence || 91.0}
              factorOfSafety={calculatedFos}
              size={260}
            />

            {/* Horizons Bar Comparison */}
            <div className="grid grid-cols-4 gap-2.5 mt-6 pt-4 border-t border-command-700/70">
              {(['1h', '6h', '24h', '72h'] as const).map((h) => {
                const prob = prediction?.horizons?.[h] || 0;
                return (
                  <div
                    key={h}
                    onClick={() => setSelectedHorizon(h)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      selectedHorizon === h
                        ? 'bg-command-800 border-cyan-500/60 shadow-md shadow-cyan-950/40'
                        : 'bg-command-950/60 border-command-700/60 hover:bg-command-800/40'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">+{h}</span>
                    <span className="text-base font-bold font-mono text-white mt-0.5 block">{prob}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Explainability & Physics Tabs */}
          <div className="glass-panel-elevated p-6 rounded-2xl border border-command-700 space-y-4">
            <div className="flex items-center justify-between border-b border-command-700/70 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveExplainTab('shap')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    activeExplainTab === 'shap'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> SHAP Feature Attribution
                </button>
                <button
                  onClick={() => setActiveExplainTab('fos_curve')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    activeExplainTab === 'fos_curve'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-rose-400" /> FoS Sensitivity Curve
                </button>
              </div>

              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                XGBoost + Infinite Slope
              </span>
            </div>

            {activeExplainTab === 'shap' ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Proportional influence of destabilizing shear stresses versus stabilizing geotechnical resistance:
                </p>

                {/* Destabilizing Forces (Red/Rose) */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-rose-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Destabilizing Driving Forces (+Push toward failure)
                  </span>
                  <div className="space-y-2.5">
                    {contributions.map((item) => (
                      <div key={item.short_name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium">{item.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-slate-400 font-mono">{item.value_display}</span>
                            <span className="font-mono font-bold text-rose-400 min-w-[42px] text-right">
                              +{item.percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-command-950 rounded-full overflow-hidden border border-command-700/60">
                          <div
                            className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-amber-500 to-rose-500"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stabilizing / Buffering Resistance Factors (Green/Emerald) */}
                <div className="space-y-2.5 pt-3 border-t border-command-700/60">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" /> Stabilizing Geotechnical Buffers (-Resistance against failure)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {stabilizingFactors.map((st, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-command-950/70 border border-command-700/60 text-xs font-mono">
                        <div className="text-slate-400 text-[10px] truncate">{st.name}</div>
                        <div className="text-white font-bold mt-0.5">{st.value}</div>
                        <div className="text-emerald-400 font-bold text-[10px] mt-0.5 flex items-center justify-between">
                          <span>{st.delta}</span>
                          <span className="text-slate-500 font-normal text-[9px]">{st.factor}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plain-English Geotechnical Advisory */}
                {explanation && (
                  <div className="mt-4 p-4 rounded-xl bg-command-900/90 border border-command-700/80 space-y-2 text-xs">
                    <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-cyan-400" />
                      {explanation.headline}
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{explanation.summary}</p>
                    <div className="pt-2 border-t border-command-700/60">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                        Action Directives:
                      </span>
                      <ul className="mt-1 space-y-1 list-disc list-inside text-slate-300 text-[11px]">
                        {explanation.recommended_actions?.map((act: string, idx: number) => (
                          <li key={idx}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Factor of Safety Sensitivity Curve */
              <FosSensitivityChart currentRainfall={rainfall} currentFos={calculatedFos} />
            )}
          </div>
        </div>

        {/* Right Side: Geotechnical Parameter Sandbox (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-panel-elevated p-6 rounded-2xl border border-command-700 space-y-5">
            <div className="border-b border-command-700/70 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" /> Geotechnical Parameter Sandbox
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Tawang Sector Inputs</span>
            </div>

            <p className="text-xs text-slate-400">
              Modify in-situ environmental factors to recalculate AI hazard vectors immediately:
            </p>

            <div className="space-y-4">
              {/* Rainfall */}
              <div className="p-3 rounded-xl bg-command-950/70 border border-command-700/60">
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">24h Rainfall Intensity</span>
                  <span className="text-cyan-300 font-bold">{rainfall.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="260"
                  step="2"
                  value={rainfall}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setRainfall(val);
                    runPrediction(val, moisture, slope, movement, elevation);
                  }}
                  className="w-full h-2 bg-command-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Soil Moisture */}
              <div className="p-3 rounded-xl bg-command-950/70 border border-command-700/60">
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Soil Moisture Saturation</span>
                  <span className="text-emerald-300 font-bold">{moisture.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="98"
                  step="1"
                  value={moisture}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setMoisture(val);
                    runPrediction(rainfall, val, slope, movement, elevation);
                  }}
                  className="w-full h-2 bg-command-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Slope Angle */}
              <div className="p-3 rounded-xl bg-command-950/70 border border-command-700/60">
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Slope Gradient Angle</span>
                  <span className="text-amber-300 font-bold">{slope.toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="55"
                  step="0.5"
                  value={slope}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setSlope(val);
                    runPrediction(rainfall, moisture, val, movement, elevation);
                  }}
                  className="w-full h-2 bg-command-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Ground Displacement */}
              <div className="p-3 rounded-xl bg-command-950/70 border border-command-700/60">
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Ground Displacement Velocity</span>
                  <span className="text-rose-400 font-bold">{movement.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="12.0"
                  step="0.2"
                  value={movement}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setMovement(val);
                    runPrediction(rainfall, moisture, slope, val, elevation);
                  }}
                  className="w-full h-2 bg-command-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
                />
              </div>

              {/* Static Environmental Parameters Display */}
              <div className="p-3.5 rounded-xl bg-command-950/90 border border-command-700 space-y-2 text-xs font-mono">
                <div className="font-bold text-slate-300 pb-1 border-b border-command-700/60 flex items-center justify-between">
                  <span>Inherent Geological Attributes</span>
                  <span className="text-cyan-400">GSI Survey</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Lithology:</span>
                  <span className="text-slate-200">Gneiss & Weathered Phyllite</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Vegetation NDVI:</span>
                  <span className="text-slate-200">0.54 (Degraded Canopy)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Terrain Curvature:</span>
                  <span className="text-slate-200">-0.24 (Convergent Collector)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Drainage Condition:</span>
                  <span className="text-rose-400">Pore Pressure Overcharge</span>
                </div>
              </div>
            </div>
          </div>

          {/* FoS Stability Boundary Card */}
          <div className="glass-panel p-5 rounded-2xl border border-command-700 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Failure Safety Threshold:</span>
              <span className="text-amber-400 font-bold">FoS &lt; 1.0 (Critical)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Calculated Safety Factor:</span>
              <span className={`font-bold text-sm ${calculatedFos < 1.0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                {calculatedFos.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-command-950 h-2.5 rounded-full overflow-hidden border border-command-700">
              <div
                className={`h-full transition-all duration-500 ${
                  calculatedFos < 1.0 ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (calculatedFos / 2.0) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Calculated via Infinite Slope Stability: FoS = [c&apos; + (&gamma;z - &gamma;w&middot;hw)&middot;cos&sup2;&beta;&middot;tan&phi;&apos;] / [&gamma;z&middot;sin&beta;&middot;cos&beta;]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
