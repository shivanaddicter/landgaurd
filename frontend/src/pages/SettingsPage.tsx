import React, { useState, useEffect } from 'react';
import { Settings, Save, Sliders, Shield, Bell, Moon, Globe, Radio } from 'lucide-react';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    risk_threshold_low: 25,
    risk_threshold_medium: 50,
    risk_threshold_high: 75,
    rainfall_critical_mm: 150.0,
    soil_moisture_critical_pct: 80.0,
    alert_auto_broadcast: false,
    dark_mode_palette: 'tactical_navy',
    language: 'English'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getSettings().then((res) => {
      if (res?.settings) setSettings(res.settings);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-cyan-400" /> Command Center Settings & Preferences
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global hazard boundaries, telemetry intervals, and emergency alert broadcast preferences.
          </p>
        </div>

        {saved && (
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
            Settings persisted successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs font-mono">
        {/* Risk Thresholds Section */}
        <div className="glass-panel-elevated p-6 rounded-2xl border border-command-700 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-command-700">
            <Shield className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Landslide Hazard Score Boundaries (0 - 100 Scale)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-emerald-400 block mb-1">LOW &rarr; MEDIUM Boundary</label>
              <input
                type="number"
                value={settings.risk_threshold_low}
                onChange={(e) => setSettings({ ...settings, risk_threshold_low: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg glass-input"
              />
            </div>
            <div>
              <label className="text-amber-400 block mb-1">MEDIUM &rarr; HIGH Boundary</label>
              <input
                type="number"
                value={settings.risk_threshold_medium}
                onChange={(e) => setSettings({ ...settings, risk_threshold_medium: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg glass-input"
              />
            </div>
            <div>
              <label className="text-rose-400 block mb-1">HIGH &rarr; CRITICAL Boundary</label>
              <input
                type="number"
                value={settings.risk_threshold_high}
                onChange={(e) => setSettings({ ...settings, risk_threshold_high: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg glass-input"
              />
            </div>
          </div>
        </div>

        {/* Environmental Thresholds Section */}
        <div className="glass-panel-elevated p-6 rounded-2xl border border-command-700 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-command-700">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Environmental Alarm Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 block mb-1">24h Rainfall Critical Trigger (mm)</label>
              <input
                type="number"
                value={settings.rainfall_critical_mm}
                onChange={(e) => setSettings({ ...settings, rainfall_critical_mm: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg glass-input"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Soil Moisture Critical Saturation (%)</label>
              <input
                type="number"
                value={settings.soil_moisture_critical_pct}
                onChange={(e) => setSettings({ ...settings, soil_moisture_critical_pct: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg glass-input"
              />
            </div>
          </div>
        </div>

        {/* System & Notification Preferences */}
        <div className="glass-panel-elevated p-6 rounded-2xl border border-command-700 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-command-700">
            <Bell className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Alert Broadcast & Theme Preferences
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-command-950/70 border border-command-700 flex items-center justify-between">
              <div>
                <span className="text-white font-bold block">Autonomous Siren Trigger</span>
                <span className="text-[10px] text-slate-400">Trigger sirens automatically on Level 2 Critical</span>
              </div>
              <input
                type="checkbox"
                checked={settings.alert_auto_broadcast}
                onChange={(e) => setSettings({ ...settings, alert_auto_broadcast: e.target.checked })}
                className="rounded bg-command-900 border-command-700 text-cyan-500 h-4 w-4"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Command Center Palette</label>
              <select
                value={settings.dark_mode_palette}
                onChange={(e) => setSettings({ ...settings, dark_mode_palette: e.target.value })}
                className="w-full p-2.5 rounded-lg glass-input bg-command-900"
              >
                <option value="tactical_navy">Tactical Navy (Command Default)</option>
                <option value="high_contrast_dark">High-Contrast Deep Slate</option>
                <option value="oled_black">OLED Pure Black</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
};
