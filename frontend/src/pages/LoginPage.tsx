import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  User,
  KeyRound,
  LogIn,
  CheckCircle2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth, DEMO_PERSONAS } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { user, isAuthenticated, login, logout, switchPersona } = useAuth();
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState('t.norbu@ndma.gov.in');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState('Disaster Incident Commander');

  const handlePersonaSelect = (personaId: string) => {
    switchPersona(personaId);
    navigate('/');
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = DEMO_PERSONAS.find((p) => p.email.toLowerCase() === emailInput.toLowerCase()) || {
      id: 'custom_user',
      name: emailInput.split('@')[0].toUpperCase(),
      role: selectedRole,
      clearanceLevel: 3,
      agency: 'North Eastern Regional Disaster Management',
      sector: 'Arunachal & Sikkim Command',
      avatar: emailInput.slice(0, 2).toUpperCase(),
      email: emailInput,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
    };
    login(found);
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Hero info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="h-16 w-16 rounded-full p-1 bg-gradient-to-br from-emerald-500/40 via-cyan-500/40 to-blue-600/40 border border-cyan-400/50 shadow-2xl shadow-cyan-950/60 flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="AI-SlopeGuard Emblem"
                className="h-full w-full object-contain rounded-full"
              />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
                AI-SlopeGuard
              </h1>
              <span className="text-xs text-cyan-400 font-mono font-semibold">
                GOVT OF INDIA • NDMA COMMAND CENTER
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-100 font-heading leading-tight">
              Early Warning & Landslide Risk Monitoring System
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Dedicated spatial decision support and physics-informed early warning infrastructure protecting 8 North Eastern states along fragile Himalayan corridors.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Physics-Informed Infinite Slope Factor of Safety ($FoS$)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>OASIS Common Alerting Protocol (CAP v1.2) Multi-Gateway</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>LoRaWAN Mesh Telemetry & Sentinel-1A InSAR Monitoring</span>
            </div>
          </div>
        </div>

        {/* Right Authentication Panel (7 cols) */}
        <div className="lg:col-span-7 glass-panel-elevated p-8 rounded-3xl border border-command-700/80 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-command-700/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Operational Command Access
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Select your designated field or command persona to enter:
              </p>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold hover:bg-rose-500/30 transition-colors"
              >
                Log Out Current
              </button>
            )}
          </div>

          {/* 1-Click Persona Grid */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold block">
              1-Click Fast Persona Selection:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEMO_PERSONAS.map((p) => {
                const isSelected = user?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handlePersonaSelect(p.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-command-800/90 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500'
                        : 'bg-command-950/80 border-command-700/70 hover:border-slate-500 hover:bg-command-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-9 w-9 rounded-xl bg-command-900 border border-command-700 flex items-center justify-center font-bold text-cyan-400 text-xs shadow-inner">
                          {p.avatar}
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-command-900 text-slate-400 border border-command-700">
                          LVL {p.clearanceLevel}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors font-heading">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{p.role}</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-command-700/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[140px] text-[10px]">{p.agency.split('(')[0]}</span>
                      <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Enter &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-command-700/60 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              &larr; Continue as Guest Operator
            </button>

            <span className="text-[11px] font-mono text-slate-500">
              Authorized NDMA / SDMA Personnel Only
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
