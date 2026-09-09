import React, { useState } from 'react';
import { PlaySquare, Sparkles, Navigation, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SimulationHud } from '../components/simulation/SimulationHud';
import { useNavigate } from 'react-router-dom';

export const SimulationPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);

  const demoSteps = [
    { step: 1, title: 'Inspect Dashboard', desc: 'Observe baseline normal conditions across NER sectors.' },
    { step: 2, title: 'Precipitation Surge', desc: 'Rainfall intensifies from 80mm to 195mm (Monsoon cloudburst).' },
    { step: 3, title: 'Pore Saturation', desc: 'Soil moisture surges past 85%, weakening bedrock shear plane.' },
    { step: 4, title: 'Sensor Creep Detection', desc: 'Extensometer detects 4.8mm displacement along NH-13 shoulder.' },
    { step: 5, title: 'AI Recalculates Probability', desc: 'Physics-informed XGBoost model spikes probability from 34% to 89.5%.' },
    { step: 6, title: 'Map Color Transition', desc: 'Tawang hazard polygon transitions from Amber (Medium) to glowing Red (Critical).' },
    { step: 7, title: 'Inspect Explainability', desc: 'AI waterfall proves heavy rain (38%) + saturation (27%) caused failure.' },
    { step: 8, title: 'CAP Alert Dispatched', desc: 'Emergency siren and NDMA Common Alerting Protocol notice generated.' },
    { step: 9, title: 'Citizen Geofence Warning', desc: 'Simulated location modal pops up advising immediate road evacuation.' },
    { step: 10, title: 'Safe Evacuation Routing', desc: 'Emergency response route planned avoiding NH-13 to Tawang Shelter.' },
    { step: 11, title: 'Executive Report Download', desc: 'Generate printable official NDMA daily landslide assessment.' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1750px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              SMART INDIA HACKATHON LIVE DEMONSTRATION ENGINE
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <PlaySquare className="w-6 h-6 text-cyan-400" /> Interactive Simulation & Stress-Test Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamically adjust environmental variables to test instant AI hazard recalculation, alert generation, and evacuation routing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/location-warning')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-950/40"
          >
            <AlertTriangle className="w-4 h-4" /> Test Geofence Alert &rarr;
          </button>
        </div>
      </div>

      {/* 11-Step Hackathon Guided Walkthrough Rail */}
      <div className="glass-panel p-5 rounded-2xl border border-command-700 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Hackathon 11-Step Demonstration Protocol
          </span>
          <span className="text-[10px] font-mono text-cyan-400">Step {activeStep} of 11</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-2">
          {demoSteps.map((s) => (
            <div
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                activeStep === s.step
                  ? 'bg-command-800 border-cyan-500 shadow-md shadow-cyan-950/40'
                  : s.step < activeStep
                  ? 'bg-command-950/80 border-emerald-500/40 opacity-80'
                  : 'bg-command-950/40 border-command-700/50 hover:bg-command-800/30'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className={activeStep === s.step ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                  STEP {s.step}
                </span>
                {s.step < activeStep && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="text-[11px] font-bold text-white leading-tight truncate">{s.title}</div>
            </div>
          ))}
        </div>

        {/* Current Active Step Banner */}
        <div className="p-3.5 rounded-xl bg-command-950/80 border border-command-700 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-cyan-300 font-mono">Current Action Step {activeStep}:</span>{' '}
            <span className="text-slate-300">{demoSteps[activeStep - 1].desc}</span>
          </div>
          <button
            onClick={() => setActiveStep(Math.min(11, activeStep + 1))}
            className="px-3 py-1 rounded bg-command-800 hover:bg-command-700 text-cyan-400 font-mono font-bold text-xs"
          >
            Advance Step &rarr;
          </button>
        </div>
      </div>

      {/* Main Simulation HUD Console */}
      <SimulationHud />
    </div>
  );
};
