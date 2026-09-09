import React, { useState, useEffect, useRef } from 'react';
import { Shield, Search, Bell, Clock, Activity, User, Radio, AlertTriangle, LogIn, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { LoginModal } from '../auth/LoginModal';
import { telemetryWs } from '../../services/websocket';
import { useAuth } from '../../context/AuthContext';

interface CommandHeaderProps {
  onOpenSearch?: () => void;
}

export const CommandHeader: React.FC<CommandHeaderProps> = () => {
  const { user, isAuthenticated, logout, openLoginModal } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(4);
  const [liveTicker, setLiveTicker] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }) + ' IST'
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    telemetryWs.connect();
    const unsub = telemetryWs.subscribe((data) => {
      if (data.event_type === 'telemetry_tick') {
        setLiveTicker(data);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Top High-Priority Incident Marquee Ticker */}
      <div className="bg-slate-100 border-b border-slate-200/90 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono overflow-hidden">
        <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-slate-300">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="font-extrabold text-rose-600 uppercase tracking-wider">LIVE BULLETIN:</span>
        </div>

        <div className="overflow-hidden whitespace-nowrap flex-1 px-3">
          <div className="inline-block animate-[marquee_25s_linear_infinite] text-slate-700">
            <span className="text-amber-700 font-bold">[TAWANG SECTOR]</span> 24h Rainfall: 138.4mm • Soil Saturation 74.2% • NH-13 Km 44 single-lane caution &nbsp;&nbsp;•&nbsp;&nbsp;
            <span className="text-rose-600 font-bold">[GANGTOK CORRIDOR]</span> NH-10 Teesta Gorge: Critical Debris Flow warning active &nbsp;&nbsp;•&nbsp;&nbsp;
            <span className="text-sky-700 font-bold">[ISRO/NRSC]</span> Sentinel-1A InSAR pass indicates -42.8mm/yr subsidence rate on high ridge &nbsp;&nbsp;•&nbsp;&nbsp;
            <span className="text-emerald-700 font-bold">[BRO VARTAK]</span> 2x Excavators positioned at Sela Tunnel southern approach
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-slate-500 text-[10px] shrink-0 pl-3 border-l border-slate-300">
          <span>NDMA Sachet CAP v1.2 Connected</span>
        </div>
      </div>

      <header className="h-16 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 flex items-center justify-between z-30 sticky top-0 shadow-sm">
        {/* Brand */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 rounded-full p-0.5 bg-gradient-to-br from-emerald-500/30 via-cyan-500/40 to-blue-600/30 border border-cyan-400/40 shadow-lg shadow-cyan-950/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="AI-SlopeGuard Official Emblem"
              className="h-full w-full object-contain rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white tracking-tight font-heading group-hover:text-cyan-300 transition-colors">
                AI-SlopeGuard
              </span>
              <span className="text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                NER-COMMAND
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide font-sans hidden sm:block">
              Early Warning & Landslide Risk Monitoring • North Eastern Region
            </p>
          </div>
        </a>

        {/* Center Live Ticker & Search */}
        <div className="flex items-center gap-4 max-w-xl flex-1 justify-center px-4">
          {liveTicker && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-command-800/80 border border-command-700/80 text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-slate-400">{liveTicker.location}:</span>
              <span className="text-cyan-300 font-bold">
                {liveTicker.value} {liveTicker.unit}
              </span>
              <span className="text-[10px] text-slate-500">({liveTicker.sensor_id})</span>
            </div>
          )}

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-between w-full max-w-xs px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-slate-600 text-xs transition-colors group shadow-inner"
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-sky-600 group-hover:text-sky-700" />
              <span>Search locations, sensors, alerts...</span>
            </span>
            <kbd className="hidden sm:inline-block text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300 text-slate-500 shadow-xs">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Info */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 font-mono bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>{currentTime || 'Syncing IST...'}</span>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SERVICES NOMINAL</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center font-mono animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 glass-panel-elevated rounded-xl border border-command-700/90 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-command-700/60">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Command Notifications</span>
                  <button
                    onClick={() => setNotificationCount(0)}
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    Mark read
                  </button>
                </div>
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                  <div className="p-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-xs">
                    <div className="font-semibold text-rose-300 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> High Risk Alert: Tawang NH-13
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Rainfall exceeded 138mm. Probability 82.5%.</div>
                  </div>
                  <div className="p-2 rounded-lg bg-command-950/80 border border-command-700 text-xs">
                    <div className="font-semibold text-white">Sensor Calibration Update</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">SNS-TWG-GM-01 wire extensometer calibrated.</div>
                  </div>
                  <div className="p-2 rounded-lg bg-command-950/80 border border-command-700 text-xs">
                    <div className="font-semibold text-white">ISRO Sentinel-1A InSAR Pass</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Deformation map updated for Arunachal & Sikkim.</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Login/Logout Option */}
          <div className="relative pl-2 border-l border-command-700/60" ref={menuRef}>
            {isAuthenticated && user ? (
              <div>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-command-800/80 transition-all group"
                  title="Manage account & roles"
                >
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-bold text-xs shadow-sm">
                    {user.avatar}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors leading-tight">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-medium leading-tight">
                      {user.role.split(' ')[0]} (Lvl {user.clearanceLevel})
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors hidden sm:block" />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 glass-panel-elevated rounded-2xl border border-command-700/90 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-2.5 rounded-xl bg-command-950/80 border border-command-700/60 mb-2">
                      <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
                      <div className="text-[11px] text-cyan-400 font-medium mt-0.5">{user.role}</div>
                      <div className="text-[10px] text-slate-400 mt-1 truncate">{user.agency}</div>
                      <div className="mt-2 pt-2 border-t border-command-700/60 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400">Clearance:</span>
                        <span className="text-emerald-400 font-bold">LEVEL {user.clearanceLevel} AUTHORIZED</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          openLoginModal();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-command-800 transition-colors flex items-center justify-between"
                      >
                        <span>Switch Operational Persona</span>
                        <span className="text-[10px] font-mono text-cyan-400">4 Roles</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-500/20 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>Log Out of Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Logged Out / Guest State */
              <button
                onClick={openLoginModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Demo Roles</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <LoginModal />
    </>
  );
};
