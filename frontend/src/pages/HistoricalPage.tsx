import React, { useState, useEffect } from 'react';
import { History, Search, Download, Filter, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { HistoricalLandslide } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';

export const HistoricalPage: React.FC = () => {
  const [landslides, setLandslides] = useState<HistoricalLandslide[]>([]);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getLandslides({
        query: search,
        district: districtFilter || undefined,
        page,
        limit: 10
      });
      if (res?.items) {
        setLandslides(res.items);
        setTotalPages(res.total_pages || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, districtFilter, severityFilter, page]);

  const handleExportCsv = () => {
    window.open('/api/landslides/export/csv', '_blank');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1750px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <History className="w-6 h-6 text-amber-400" /> Historical Landslide Disaster Archive
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            GSI & NDMA historical landslide inventory for North Eastern mountain corridors.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-command-800 hover:bg-command-700 text-cyan-400 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-2 transition-colors shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Export Archive CSV</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl glass-panel border border-command-700 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by incident ID, highway, or geological cause..."
            className="w-full pl-9 pr-4 py-2 rounded-lg glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <select
            value={districtFilter}
            onChange={(e) => {
              setDistrictFilter(e.target.value);
              setPage(1);
            }}
            className="p-2 rounded-lg glass-input bg-command-900"
          >
            <option value="">All Districts</option>
            <option value="Tawang">Tawang</option>
            <option value="East Sikkim">East Sikkim</option>
            <option value="West Kameng">West Kameng</option>
            <option value="Kamrup Metropolitan">Kamrup Metro</option>
            <option value="East Khasi Hills">East Khasi Hills</option>
            <option value="Noney">Noney (Manipur)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel-elevated rounded-2xl border border-command-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-command-950/90 text-slate-400 uppercase text-[11px] border-b border-command-700">
              <tr>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Location & Corridor</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Rainfall Trigger</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Casualties</th>
                <th className="p-3.5">Affected Pop.</th>
                <th className="p-3.5">Triggering Mechanism</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-command-700/50">
              {landslides.map((row) => (
                <tr key={row.id} className="hover:bg-command-800/40 transition-colors">
                  <td className="p-3.5 text-cyan-400 font-bold">{row.id}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-white font-sans text-xs">{row.location_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {row.district}, {row.state}
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-300">{row.date}</td>
                  <td className="p-3.5 text-cyan-300 font-bold">{row.rainfall_trigger_mm} mm</td>
                  <td className="p-3.5">
                    <RiskBadge level={row.severity} size="sm" showPulse={false} />
                  </td>
                  <td className="p-3.5">
                    {row.deaths > 0 ? (
                      <span className="text-rose-400 font-bold">{row.deaths} Fatalities</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-200">{row.affected_population.toLocaleString()}</td>
                  <td className="p-3.5 text-slate-400 max-w-xs truncate" title={row.triggering_factor}>
                    {row.triggering_factor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-command-700/70 bg-command-950/60 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Showing {landslides.length} records</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 rounded bg-command-800 disabled:opacity-40"
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 rounded bg-command-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
