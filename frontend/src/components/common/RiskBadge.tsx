import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showPulse = true }) => {
  const normLevel = (level || 'LOW').toUpperCase();

  const getStyle = () => {
    switch (normLevel) {
      case 'CRITICAL':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30 glow-border-critical';
      case 'HIGH':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30 glow-border-high';
      case 'MEDIUM':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'LOW':
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  const getDotColor = () => {
    switch (normLevel) {
      case 'CRITICAL':
        return 'bg-rose-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MEDIUM':
        return 'bg-amber-500';
      case 'LOW':
      default:
        return 'bg-emerald-500';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-2.5 py-1 gap-2',
    lg: 'text-sm font-bold px-3 py-1.5 gap-2.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide font-mono uppercase ${sizeClasses} ${getStyle()}`}
    >
      {showPulse && (
        <span className="relative flex h-2 w-2">
          {normLevel === 'CRITICAL' && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getDotColor()}`}></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${getDotColor()}`}></span>
        </span>
      )}
      {normLevel}
    </span>
  );
};
