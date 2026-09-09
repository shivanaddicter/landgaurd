import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, Printer, CheckCircle2, Shield, Calendar, MapPin, FileText } from 'lucide-react';
import { api } from '../services/api';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('daily');
  const [district, setDistrict] = useState('Tawang');
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.generateReport(reportType, district);
      if (res?.report) setGeneratedReport(res.report);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [reportType, district]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-[1500px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-cyan-400" /> Disaster Intelligence Report Generator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated production of compliance and tactical situation reports for NDMA, SDMA, and District Magistrates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-command-800 hover:bg-command-700 text-slate-200 border border-command-700 text-xs font-mono font-bold flex items-center gap-2 transition-colors shadow-md"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Report Customizer Filter Bar */}
      <div className="p-4 rounded-xl glass-panel border border-command-700 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs font-mono flex-wrap">
          <div>
            <label className="text-slate-400 mr-2">Report Template:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="p-2 rounded-lg glass-input bg-command-900 text-white"
            >
              <option value="daily">Daily Landslide Hazard Assessment</option>
              <option value="weekly">Weekly Hydro-Geological Brief</option>
              <option value="incident">Special Landslide Early Warning Report</option>
              <option value="sensor">IoT Sensor Telemetry Audit Report</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 mr-2">Jurisdiction Sector:</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="p-2 rounded-lg glass-input bg-command-900 text-white"
            >
              <option value="Tawang">Tawang Sector (Arunachal Pradesh)</option>
              <option value="Gangtok">Gangtok / NH-10 Sector (Sikkim)</option>
              <option value="Bomdila">Bomdila Pass Sector</option>
              <option value="Cherrapunji">Cherrapunji (Sohra) Sector</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs shadow-md"
        >
          {loading ? 'Compiling Audit...' : 'Re-Generate Payload'}
        </button>
      </div>

      {/* Formal Printable Document Preview Container */}
      {generatedReport && (
        <div className="glass-panel-elevated p-8 rounded-2xl border border-command-700 space-y-6 shadow-2xl print:border-none print:shadow-none print:bg-white print:text-black">
          {/* Government Formal Letterhead */}
          <div className="text-center border-b border-command-700/80 pb-6 space-y-1">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img
                src="/logo.png"
                alt="AI-SlopeGuard Emblem"
                className="h-16 w-16 object-contain rounded-full shadow-lg border border-cyan-500/30 p-0.5"
              />
            </div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 print:text-gray-600">
              Government of India • National Disaster Management Intelligence Network
            </div>
            <h2 className="text-xl font-extrabold text-white font-mono tracking-tight print:text-black">
              {generatedReport.title}
            </h2>
            <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-400 pt-1 print:text-gray-500">
              <span>Report Ref: {generatedReport.report_id}</span>
              <span>•</span>
              <span>Issued: {generatedReport.generated_at}</span>
            </div>
          </div>

          {/* Classification Banner */}
          <div className="p-2 rounded bg-command-950/80 border border-command-700 text-center font-mono text-[11px] text-cyan-400 tracking-wider">
            {generatedReport.classification}
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wide print:text-black">
              1. Executive Intelligence Summary
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed print:text-gray-800">
              {generatedReport.executive_summary}
            </p>
          </div>

          {/* Key Sensor & Hazard Metrics Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wide print:text-black">
              2. Hydro-Geotechnical Telemetry Summary
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-command-950/70 border border-command-700/60 print:border-gray-300">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">24h Rainfall</span>
                <span className="text-lg font-bold text-cyan-300 font-mono print:text-black">
                  {generatedReport.key_metrics?.['24h_rainfall_mm'] ?? 138.4} mm
                </span>
              </div>
              <div className="p-3 rounded-xl bg-command-950/70 border border-command-700/60 print:border-gray-300">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Soil Saturation</span>
                <span className="text-lg font-bold text-emerald-400 font-mono print:text-black">
                  {generatedReport.key_metrics?.['soil_moisture_saturation_pct'] ?? 74.2}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-command-950/70 border border-command-700/60 print:border-gray-300">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Slope Gradient</span>
                <span className="text-lg font-bold text-amber-400 font-mono print:text-black">
                  {generatedReport.key_metrics?.['slope_angle_deg'] ?? 38.4}°
                </span>
              </div>
              <div className="p-3 rounded-xl bg-command-950/70 border border-command-700/60 print:border-gray-300">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Factor of Safety (FoS)</span>
                <span className="text-lg font-bold text-rose-400 font-mono print:text-black">
                  {generatedReport.geotechnical_risk_analysis?.factor_of_safety ?? 0.94} (&lt; 1.0)
                </span>
              </div>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wide print:text-black">
              3. Operational Directives & Resource Orders
            </h4>
            <div className="space-y-2 text-xs font-mono text-slate-300 print:text-gray-800">
              {(generatedReport.recommended_command_actions || []).map((act: string, i: number) => (
                <div key={i} className="p-2.5 rounded-lg bg-command-950/50 border border-command-700/50 flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">{i + 1}.</span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signatory Footer */}
          <div className="pt-8 border-t border-command-700/80 flex items-center justify-between text-xs font-mono text-slate-400 print:text-gray-600">
            <div>
              <div>Issuing Command: AI-SlopeGuard Early Warning Cell</div>
              <div>Digital Hash: SHA256:7a89f3c...b891e4</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-200 print:text-black">{generatedReport.signatory}</div>
              <div>Authorized Signatory (SDMA)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
