import React, { useState } from 'react';
import {
  Shield,
  User,
  KeyRound,
  LogOut,
  LogIn,
  CheckCircle2,
  ShieldCheck,
  Building,
  MapPin,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth, DEMO_PERSONAS, User as UserType } from '../../context/AuthContext';

export const LoginModal: React.FC = () => {
  const { user, isAuthenticated, login, logout, switchPersona, isLoginModalOpen, closeLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'personas' | 'credentials'>('personas');
  const [emailInput, setEmailInput] = useState('t.norbu@ndma.gov.in');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState('Disaster Incident Commander');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Log in with entered credentials or first matching persona
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
  };

  return (
    <Modal
      isOpen={isLoginModalOpen}
      onClose={closeLoginModal}
      title="Command Center Access & Identity"
      subtitle="Authenticate via NDMA Single Sign-On or switch active operational command persona."
      maxWidth="2xl"
    >
      <div className="space-y-5 font-sans">
        {/* Emblem Brand Header */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-command-950/70 border border-command-700/70">
          <div className="h-12 w-12 rounded-full p-0.5 bg-gradient-to-br from-emerald-500/30 via-cyan-500/40 to-blue-600/30 border border-cyan-400/40 shadow-md shrink-0">
            <img src="/logo.png" alt="AI-SlopeGuard Emblem" className="h-full w-full object-contain rounded-full" />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-heading">AI-SlopeGuard Early Warning System</div>
            <div className="text-[11px] text-slate-400">Official Disaster Command & Geotechnical Risk Authority • North East India</div>
          </div>
        </div>

        {/* Active Session Ribbon */}
        {isAuthenticated && user ? (
          <div className="p-4 rounded-xl bg-command-950/80 border border-command-700/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center font-bold text-cyan-300 text-sm shadow-md">
                {user.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-heading">{user.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border bg-emerald-500/15 text-emerald-400 border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    LOGGED IN
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{user.role} • {user.agency}</p>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5 block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" /> {user.sector}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>You are currently operating in <strong>Guest Read-Only Mode</strong>. Log in to broadcast CAP alerts.</span>
            </div>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex items-center p-1 rounded-xl bg-command-950 border border-command-700/80 text-xs font-medium">
          <button
            onClick={() => setActiveTab('personas')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'personas'
                ? 'bg-command-800 text-cyan-300 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> 1-Click Operational Personas (Hackathon Demo)
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'credentials'
                ? 'bg-command-800 text-cyan-300 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" /> Official Credentials SSO
          </button>
        </div>

        {/* Tab Content: 1-Click Personas */}
        {activeTab === 'personas' ? (
          <div className="space-y-2.5">
            <p className="text-xs text-slate-400">
              Select an official role below to simulate real-world disaster management clearances and operational responsibilities:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEMO_PERSONAS.map((p) => {
                const isSelected = user?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => switchPersona(p.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-command-800/90 border-cyan-500 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                        : 'bg-command-950/70 border-command-700/70 hover:border-slate-500 hover:bg-command-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-lg bg-command-900 border border-command-700 flex items-center justify-center font-bold text-cyan-400 text-xs shadow-inner">
                          {p.avatar}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors font-heading leading-tight">
                            {p.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 leading-tight block">
                            {p.role}
                          </span>
                        </div>
                      </div>

                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-command-900 text-slate-400 border border-command-700/80">
                          LVL {p.clearanceLevel}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-command-700/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[170px]">{p.agency}</span>
                      <span className="text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center">
                        Select &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Tab Content: Manual Credentials */
          <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Official Government Email / Service ID</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="commander.ndma@gov.in"
                className="w-full p-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Password / Sachet 2FA Token</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-2.5 rounded-xl glass-input text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Operational Role Authorization</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-2.5 rounded-xl glass-input text-xs"
              >
                <option value="Disaster Incident Commander">Disaster Incident Commander (NDMA)</option>
                <option value="Tactical Field Commander">Tactical Field Commander (NDRF / BRO)</option>
                <option value="Senior Geotechnical Scientist">Senior Geotechnical Scientist (GSI)</option>
                <option value="IoT Telemetry Specialist">IoT Telemetry Specialist (SDMA)</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={closeLoginModal}
                className="px-4 py-2 rounded-xl bg-command-900 hover:bg-command-800 text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" /> Authorize Session
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
