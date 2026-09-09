import React, { useState, useEffect } from 'react';
import { Mountain, Compass, ShieldAlert, Layers, Activity } from 'lucide-react';
import { api } from '../services/api';

export const TerrainPage: React.FC = () => {
  const [terrainData, setTerrainData] = useState<any>(null);

  useEffect(() => {
    api.getTerrain().then((res) => {
      if (res?.success) setTerrainData(res);
    });
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1750px] mx-auto animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <Mountain className="w-6 h-6 text-cyan-400" /> Digital Elevation & Morphometric Terrain Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cartosat-3 DEM 5-meter resolution curvature, aspect vectoring, and geological lithological classifications.
          </p>
        </div>
      </div>

      {/* Slope Gradient Classification Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {terrainData?.slope_distribution?.map((item: any) => (
          <div key={item.range} className="glass-panel p-4 rounded-xl border border-command-700 space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase">{item.range}</span>
            <div className="text-2xl font-extrabold font-mono text-white">{item.percentage}%</div>
            <div className="w-full h-1.5 bg-command-950 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-cyan-400"
                style={{ width: `${item.percentage * 2}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500">{item.count} monitored km² segments</span>
          </div>
        ))}
      </div>

      {/* Terrain Sector Profiles */}
      <div className="glass-panel-elevated p-6 rounded-2xl border border-command-700 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide">
          Geomorphological Stability Index by Sector
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {terrainData?.sectors?.map((sec: any) => (
            <div key={sec.id} className="p-5 rounded-xl bg-command-950/80 border border-command-700 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{sec.id}</span>
                  <h4 className="text-sm font-bold text-white leading-tight mt-0.5">{sec.name}</h4>
                </div>
                <span
                  className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase border"
                  style={{
                    backgroundColor: `${sec.slope_color}20`,
                    borderColor: `${sec.slope_color}50`,
                    color: sec.slope_color
                  }}
                >
                  {sec.stability_rating}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-command-900 border border-command-700/60">
                  <span className="text-slate-400">Elevation:</span>
                  <div className="text-white font-bold mt-0.5">{sec.elevation_m} m</div>
                </div>
                <div className="p-2.5 rounded-lg bg-command-900 border border-command-700/60">
                  <span className="text-slate-400">Slope Gradient:</span>
                  <div className="text-white font-bold mt-0.5">{sec.slope_deg}° ({sec.slope_classification})</div>
                </div>
                <div className="p-2.5 rounded-lg bg-command-900 border border-command-700/60">
                  <span className="text-slate-400">Monsoon Aspect:</span>
                  <div className="text-white font-bold mt-0.5">{sec.aspect}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-command-900 border border-command-700/60">
                  <span className="text-slate-400">Drainage Density:</span>
                  <div className="text-white font-bold mt-0.5">{sec.drainage_density}</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-command-900/90 border border-command-700/60 text-xs font-mono space-y-1">
                <div className="text-slate-400">
                  <span className="text-cyan-400 font-bold">Lithology:</span> {sec.geology}
                </div>
                <div className="text-slate-400">
                  <span className="text-amber-400 font-bold">Structural Thrust:</span> {sec.structural_features}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
