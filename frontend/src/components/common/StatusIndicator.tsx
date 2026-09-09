import React from 'react';

interface StatusIndicatorProps {
  status: 'online' | 'warning' | 'critical' | 'offline' | string;
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, className = '' }) => {
  const norm = status.toLowerCase();

  const getColor = () => {
    switch (norm) {
      case 'online':
      case 'operational':
        return 'bg-emerald-500 text-emerald-400';
      case 'warning':
      case 'degraded':
      case 'elevated':
        return 'bg-amber-500 text-amber-400';
      case 'critical':
        return 'bg-rose-500 text-rose-400';
      case 'offline':
      default:
        return 'bg-slate-500 text-slate-400';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-2.5 w-2.5">
        {norm === 'online' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
        )}
        {norm === 'critical' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${getColor().split(' ')[0]}`}></span>
      </span>
      {label && <span className={`text-xs font-mono uppercase tracking-wider ${getColor().split(' ')[1]}`}>{label}</span>}
    </div>
  );
};
