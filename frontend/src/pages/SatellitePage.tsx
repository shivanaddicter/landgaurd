import React, { useState, useEffect } from 'react';
import { Satellite, Sliders, Calendar, Sparkles, AlertTriangle, Eye, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const SatellitePage: React.FC = () => {
  const [satelliteData, setSatelliteData] = useState<any>(null);
  const [sliderPos, setSliderPos] = useState(50);

  useEffect(() => {
    api.getSatellite().then((res) => {
      if (res?.success) setSatelliteData(res);
    });
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1750px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              DEMO DATA / ISRO-NRSC FORMAT
            </span>
            <span className="text-xs text-slate-400 font-mono">Sentinel-1A SAR InSAR & Sentinel-2B MSI</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <Satellite className="w-6 h-6 text-cyan-400" /> Earth Observation & InSAR Surface Deformation
          </h1>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-command-900 border border-command-700 px-3 py-1.5 rounded-xl">
          Last Orbital Pass: <span className="text-cyan-400 font-bold">2026-09-08 04:22 UTC</span>
        </div>
      </div>

      {/* Before / After Satellite Imagery Comparison Slider */}
      <div className="glass-panel-elevated p-6 rounded-2xl border border-command-700 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Multi-Temporal Terrain Comparison Slider
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Drag the center slider to compare pre-monsoon baseline vs post-monsoon detected scarp deformation.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-cyan-400 font-bold">BEFORE: 2026-08-01</span>
            <span className="text-rose-400 font-bold">AFTER: 2026-09-01</span>
          </div>
        </div>

        {/* Interactive Image Split Slider */}
        <div className="relative h-[460px] rounded-xl overflow-hidden select-none border border-command-700/80 shadow-2xl">
          {/* Background: AFTER Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${satelliteData?.comparison_slider?.after_image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80'}')`
            }}
          >
            <div className="absolute top-4 right-4 bg-rose-600/90 text-white font-mono text-xs px-3 py-1 rounded-full font-bold shadow-lg">
              AFTER (2026-09-01) - Active Scarp Failure
            </div>
          </div>

          {/* Foreground: BEFORE Image (Clipped by sliderPos) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden bg-cover bg-center transition-all"
            style={{
              width: `${sliderPos}%`,
              backgroundImage: `url('${satelliteData?.comparison_slider?.before_image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80'}')`
            }}
          >
            <div className="absolute top-4 left-4 bg-cyan-600/90 text-white font-mono text-xs px-3 py-1 rounded-full font-bold shadow-lg">
              BEFORE (2026-08-01) - Intact Canopy
            </div>
          </div>

          {/* Slider Divider Bar */}
          <div
            className="absolute inset-y-0 w-1 bg-white shadow-2xl flex items-center justify-center cursor-ew-resize"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="h-9 w-9 -ml-4 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center shadow-xl text-xs font-mono">
              &harr;
            </div>
          </div>

          {/* Invisible Range Input for Dragging */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />
        </div>

        {/* Change Findings */}
        <div className="p-4 rounded-xl bg-command-950/80 border border-command-700 space-y-2 text-xs">
          <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider block">
            Automated Spectral Change Detection Findings:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {satelliteData?.comparison_slider?.detected_changes?.map((ch: string, i: number) => (
              <div key={i} className="p-2.5 rounded-lg bg-command-900 border border-command-700/60 text-slate-300">
                &bull; {ch}
              </div>
            )) || <div>Analyzing pixel delta...</div>}
          </div>
        </div>
      </div>

      {/* InSAR Deformation Sector Metrics */}
      <div className="glass-panel p-6 rounded-2xl border border-command-700 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide">
          InSAR Line-of-Sight (LOS) Surface Displacement Velocity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {satelliteData?.sectors?.map((sec: any) => (
            <div key={sec.sector_name} className="p-4 rounded-xl bg-command-950/80 border border-command-700/70 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{sec.sector_name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {sec.coordinates[0]}°N, {sec.coordinates[1]}°E
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                  sec.risk_flag === 'CRITICAL' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}>
                  {sec.risk_flag}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-command-900 border border-command-700/60 flex items-baseline justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Displacement Rate</span>
                <span className="text-xl font-mono font-bold text-rose-400">
                  {sec.insar_deformation_rate_mm_yr} mm/yr
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Current NDVI:</span>
                  <span className="text-white font-bold">{sec.current_ndvi} (loss {sec.vegetation_loss_pct}%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Detected Scar Area:</span>
                  <span className="text-white font-bold">{sec.detected_scar_area_sq_m?.toLocaleString()} m²</span>
                </div>
                <div className="flex justify-between">
                  <span>Radar Soil Saturation:</span>
                  <span className="text-cyan-300 font-bold">{sec.soil_moisture_radar_proxy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
