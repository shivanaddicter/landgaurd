import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, Radio, AlertTriangle, History, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.search(query);
        setResults(data?.results || null);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl glass-panel-elevated rounded-2xl border border-command-700/80 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-command-700/70 flex items-center gap-3 bg-command-900/90">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search locations (e.g. Tawang, Gangtok), sensors, alerts, historical landslides..."
            className="flex-1 bg-transparent text-white placeholder:text-slate-400 text-sm focus:outline-none font-sans"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono bg-command-800 text-slate-400 px-2 py-0.5 rounded border border-command-700">
            ESC
          </span>
        </div>

        {/* Search Results / Suggestion Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="py-8 text-center text-xs text-slate-400 font-mono">
              Querying North Eastern Regional Command Database...
            </div>
          )}

          {!loading && !results && query.length < 2 && (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              Try searching: <span className="text-cyan-400">"Tawang"</span>, <span className="text-cyan-400">"Gangtok"</span>, <span className="text-cyan-400">"Rainfall"</span>, or <span className="text-cyan-400">"NH-10"</span>
            </div>
          )}

          {!loading && results && results.total_matches === 0 && (
            <div className="py-8 text-center text-xs text-slate-400 font-mono">
              No matching intelligence entities found for "{query}".
            </div>
          )}

          {results && results.total_matches > 0 && (
            <div className="space-y-4">
              {/* Matching Locations */}
              {results.locations?.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> High-Risk Sectors & Locations ({results.locations.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.locations.map((loc: any) => (
                      <div
                        key={loc.id}
                        onClick={() => {
                          onClose();
                          navigate(`/map?location=${loc.id}`);
                        }}
                        className="p-2.5 rounded-lg bg-command-950/60 hover:bg-command-800/80 border border-command-700/60 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-cyan-300">
                            {loc.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {loc.district}, {loc.state} • Elev: {loc.elevation_m}m • Slope: {loc.average_slope_deg}°
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Sensors */}
              {results.sensors?.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" /> IoT Field Telemetry Stations ({results.sensors.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.sensors.map((s: any) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onClose();
                          navigate(`/sensors?id=${s.id}`);
                        }}
                        className="p-2.5 rounded-lg bg-command-950/60 hover:bg-command-800/80 border border-command-700/60 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-emerald-300">
                            {s.name} ({s.id})
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Type: {s.type} • Value: {s.current_value} {s.unit} • Battery: {s.battery_pct}%
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Alerts */}
              {results.alerts?.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Active Disaster Warnings ({results.alerts.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.alerts.map((a: any) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          onClose();
                          navigate('/alerts');
                        }}
                        className="p-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-rose-300">{a.title}</div>
                          <div className="text-[10px] text-rose-400/80 font-mono">
                            Severity: {a.severity.toUpperCase()} • Population: {a.affected_population.toLocaleString()}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-rose-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Historical Incidents */}
              {results.historical_landslides?.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" /> Historical Landslide Incidents ({results.historical_landslides.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.historical_landslides.map((h: any) => (
                      <div
                        key={h.id}
                        onClick={() => {
                          onClose();
                          navigate('/historical');
                        }}
                        className="p-2.5 rounded-lg bg-command-950/60 hover:bg-command-800/80 border border-command-700/60 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-amber-300">
                            {h.location_name} ({h.id})
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Date: {h.date} • Trigger: {h.rainfall_trigger_mm}mm rain • Deaths: {h.deaths}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
