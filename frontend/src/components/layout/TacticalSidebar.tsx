import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  BrainCircuit,
  LineChart,
  Radio,
  Satellite,
  CloudRain,
  Mountain,
  History,
  AlertTriangle,
  Siren,
  FileSpreadsheet,
  Database,
  Cpu,
  PlaySquare,
  Users,
  HeartPulse,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  LogIn,
  LogOut,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  alertCount?: number;
}

export const TacticalSidebar: React.FC<SidebarProps> = ({ alertCount = 4 }) => {
  const { user, isAuthenticated, logout, openLoginModal } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/map', label: 'Live Risk Map', icon: Map, highlight: true },
    { to: '/prediction', label: 'AI Risk Prediction', icon: BrainCircuit },
    { to: '/analytics', label: 'Risk Analysis', icon: LineChart },
    { to: '/sensors', label: 'IoT Sensors', icon: Radio },
    { to: '/sensor-map', label: 'Sensor Map', icon: Map },
    { to: '/satellite', label: 'Satellite Monitoring', icon: Satellite },
    { to: '/rainfall', label: 'Rainfall Monitoring', icon: CloudRain },
    { to: '/terrain', label: 'Terrain Analysis', icon: Mountain },
    { to: '/historical', label: 'Historical Landslides', icon: History },
    { to: '/alerts', label: 'Alerts & Warnings', icon: AlertTriangle, badge: alertCount },
    { to: '/location-warning', label: 'Location Warning', icon: ShieldAlert },
    { to: '/emergency', label: 'Emergency Response', icon: Siren },
    { to: '/reports', label: 'Reports', icon: FileSpreadsheet },
    { to: '/data-sources', label: 'Data Sources', icon: Database },
    { to: '/model-performance', label: 'Model Performance', icon: Cpu },
    { to: '/simulation', label: 'Simulation Mode', icon: PlaySquare, special: true },
    { to: '/admin', label: 'User Management', icon: Users },
    { to: '/system-health', label: 'System Health', icon: HeartPulse },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/login', label: 'Identity & Access', icon: KeyRound },
  ];

  return (
    <aside
      className={`h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-xl border-r border-slate-200 flex flex-col justify-between transition-all duration-300 z-20 sticky top-16 select-none shadow-xs ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                  isActive
                    ? item.special
                      ? 'bg-gradient-to-r from-sky-50 to-blue-50 text-sky-800 border border-sky-300 font-bold shadow-xs'
                      : 'bg-sky-50 text-sky-700 border border-sky-200 font-bold shadow-xs'
                    : item.special
                    ? 'text-sky-700 hover:bg-sky-50/80 hover:text-sky-800 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  item.special ? 'text-sky-600 animate-pulse' : 'text-slate-500 group-hover:text-sky-600'
                }`}
              />

              {!collapsed && (
                <span className="truncate flex-1 tracking-wide">{item.label}</span>
              )}

              {/* Notification Badge */}
              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="h-5 px-1.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {item.badge}
                </span>
              )}

              {/* Hackathon Simulation Indicator */}
              {!collapsed && item.special && (
                <span className="text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  DEMO
                </span>
              )}

              {/* Collapsed Alert Dot */}
              {collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Session Quick Control */}
      <div className="p-2 border-t border-slate-200 bg-slate-50/90">
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div
              onClick={openLoginModal}
              className="flex items-center gap-2 cursor-pointer group flex-1 min-w-0"
              title="Click to switch persona or manage profile"
            >
              <div className="h-7 w-7 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-xs font-bold text-sky-700 shrink-0 shadow-inner">
                {user.avatar}
              </div>
              {!collapsed && (
                <div className="truncate text-left">
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-sky-700 transition-colors truncate">
                    {user.name.split(',')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">
                    Lvl {user.clearanceLevel} Clearance
                  </div>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                title="Log Out of Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={openLoginModal}
            className="w-full py-2 px-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
            title="Sign In / Demo Roles"
          >
            <LogIn className="w-3.5 h-3.5" />
            {!collapsed && <span>Sign In</span>}
          </button>
        )}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-2 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        {!collapsed && (
          <div className="text-[10px] font-mono text-slate-500 px-2">
            AI-SlopeGuard v2.4
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 transition-colors mx-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
