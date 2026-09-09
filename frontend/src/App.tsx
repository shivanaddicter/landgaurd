import React from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, BrainCircuit, AlertTriangle, Radio, PlaySquare, Siren, LineChart } from 'lucide-react';
import { CommandHeader } from './components/layout/CommandHeader';
import { TacticalSidebar } from './components/layout/TacticalSidebar';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { GisMapPage } from './pages/GisMapPage';
import { PredictionPage } from './pages/PredictionPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { SensorsPage } from './pages/SensorsPage';
import { SensorMapPage } from './pages/SensorMapPage';
import { SatellitePage } from './pages/SatellitePage';
import { RainfallPage } from './pages/RainfallPage';
import { TerrainPage } from './pages/TerrainPage';
import { HistoricalPage } from './pages/HistoricalPage';
import { AlertsPage } from './pages/AlertsPage';
import { LocationWarningPage } from './pages/LocationWarningPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { ReportsPage } from './pages/ReportsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { SimulationPage } from './pages/SimulationPage';
import { AdminPage } from './pages/AdminPage';
import { SystemHealthPage } from './pages/SystemHealthPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-800">
        {/* Top Tactical Command Header */}
        <CommandHeader />

      {/* Main Body Area: Sidebar + Scrollable View */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Desktop Collapsible Sidebar */}
        <div className="hidden md:block shrink-0">
          <TacticalSidebar alertCount={4} />
        </div>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/map" element={<GisMapPage />} />
            <Route path="/prediction" element={<PredictionPage />} />
            <Route path="/analytics" element={<RiskAnalysisPage />} />
            <Route path="/sensors" element={<SensorsPage />} />
            <Route path="/sensor-map" element={<SensorMapPage />} />
            <Route path="/satellite" element={<SatellitePage />} />
            <Route path="/rainfall" element={<RainfallPage />} />
            <Route path="/terrain" element={<TerrainPage />} />
            <Route path="/historical" element={<HistoricalPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/location-warning" element={<LocationWarningPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/data-sources" element={<DataSourcesPage />} />
            <Route path="/model-performance" element={<ModelPerformancePage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/system-health" element={<SystemHealthPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Tactical Bottom Navigation (Section 28) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-command-900/95 backdrop-blur-2xl border-t border-command-700/80 flex items-center justify-around z-40 px-2">
        {[
          { to: '/', label: 'Overview', icon: LayoutDashboard },
          { to: '/map', label: 'GIS Map', icon: Map },
          { to: '/prediction', label: 'AI Predict', icon: BrainCircuit },
          { to: '/alerts', label: 'Alerts', icon: AlertTriangle, badge: 4 },
          { to: '/simulation', label: 'Simulate', icon: PlaySquare, special: true }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 text-[10px] font-mono py-1 px-2 rounded-lg transition-colors relative ${
                  isActive
                    ? item.special
                      ? 'text-cyan-300 font-bold'
                      : 'text-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="absolute -top-1 right-1 h-3.5 w-3.5 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
      </div>
    </AuthProvider>
  );
};
