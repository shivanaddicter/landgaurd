import React, { useState } from 'react';
import { Users, Shield, UserPlus, Key, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [users, setUsers] = useState([
    {
      id: 'usr-01',
      username: 'admin',
      name: 'Dr. T. Norbu, IAS',
      email: 'command.director@ndma.gov.in',
      role: 'Super Admin',
      department: 'State Disaster Management Authority (SDMA)',
      jurisdiction: 'NER All States',
      status: 'Active'
    },
    {
      id: 'usr-02',
      username: 'officer',
      name: 'Major R. Sharma (Retd.)',
      email: 'tawang.disaster@arunachal.gov.in',
      role: 'Disaster Officer',
      department: 'District Emergency Operations Center, Tawang',
      jurisdiction: 'Tawang & West Kameng',
      status: 'Active'
    },
    {
      id: 'usr-03',
      username: 'analyst',
      name: 'Sunita Hazarika, Ph.D.',
      email: 'geotech.analyst@gsi.gov.in',
      role: 'Analyst',
      department: 'Geological Survey of India (NER)',
      jurisdiction: 'NER Landslide Modeling Lab',
      status: 'Active'
    },
    {
      id: 'usr-04',
      username: 'field_bro',
      name: 'Capt. Ankit Verma',
      email: 'vartak.patrol@bro.gov.in',
      role: 'Field Officer',
      department: 'Border Roads Organisation (752 BRTF)',
      jurisdiction: 'BCT Highway Corridor',
      status: 'Active'
    }
  ]);

  const auditLogs = [
    { timestamp: '19:25 IST', user: 'Dr. T. Norbu', action: 'Acknowledged Critical Alert ALT-2026-0041', ip: '10.14.22.8' },
    { timestamp: '19:10 IST', user: 'Simulation Gateway', action: 'Executed Cloudburst Scenario Stress Injection', ip: '127.0.0.1' },
    { timestamp: '18:45 IST', user: 'Sunita Hazarika', action: 'Recalibrated Factor of Safety for Tawang Ridge', ip: '10.14.50.12' },
    { timestamp: '17:30 IST', user: 'Major R. Sharma', action: 'Staged 2x Excavators at Sela Approach Km 44', ip: '10.14.22.19' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1750px] mx-auto animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2.5">
            <Users className="w-6 h-6 text-cyan-400" /> Role-Based Access Control & User Administration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Government disaster officer credentialing, jurisdiction delegation, and security audit logs.
          </p>
        </div>

        <button
          onClick={() => alert('New user registration dialog is accessible by Super Admin.')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-2 shadow-md"
        >
          <UserPlus className="w-4 h-4" /> Provision Officer Account
        </button>
      </div>

      {/* Users Table */}
      <div className="glass-panel-elevated rounded-2xl border border-command-700 overflow-hidden">
        <div className="p-4 border-b border-command-700 bg-command-900/80">
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Active Disaster Management Personnel
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-command-950 text-slate-400 uppercase text-[11px] border-b border-command-700">
              <tr>
                <th className="p-3.5">Officer Name & ID</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Department / Organization</th>
                <th className="p-3.5">Assigned Jurisdiction</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-command-700/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-command-800/40">
                  <td className="p-3.5">
                    <div className="font-bold text-white font-sans">{u.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] uppercase font-bold">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300 font-sans">{u.department}</td>
                  <td className="p-3.5 text-slate-300">{u.jurisdiction}</td>
                  <td className="p-3.5">
                    <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Active
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button className="text-cyan-400 hover:underline text-[11px]">Edit Perms</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="glass-panel p-6 rounded-2xl border border-command-700 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide">
          Government Disaster Compliance Audit Trail
        </h3>
        <div className="space-y-2 text-xs font-mono">
          {auditLogs.map((log, i) => (
            <div key={i} className="p-3 rounded-xl bg-command-950/70 border border-command-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-bold">{log.timestamp}</span>
                <span className="text-white font-semibold">{log.user}:</span>
                <span className="text-slate-300">{log.action}</span>
              </div>
              <span className="text-slate-500 text-[11px]">{log.ip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
