import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Sparkline } from './Sparkline';
import { KpiItem } from '../../types';

interface KpiCardProps {
  kpi: KpiItem;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({ kpi, onClick }) => {
  const getStatusBg = () => {
    switch (kpi.status_color) {
      case 'rose':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'amber':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'cyan':
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  const getSparklineColor = () => {
    switch (kpi.status_color) {
      case 'rose':
        return '#f43f5e';
      case 'amber':
        return '#f59e0b';
      case 'emerald':
        return '#10b981';
      case 'cyan':
      default:
        return '#06b6d4';
    }
  };

  return (
    <div
      onClick={onClick}
      className="glass-panel p-4 rounded-xl border border-command-700/60 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-950/40 cursor-pointer flex flex-col justify-between group"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider line-clamp-1">
          {kpi.title}
        </span>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${getStatusBg()}`}>
          {kpi.status}
        </span>
      </div>

      <div className="mt-2.5 flex items-baseline justify-between">
        <div>
          <div className="text-2xl font-extrabold text-white font-mono tracking-tight group-hover:text-cyan-300 transition-colors">
            {kpi.value}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
            {kpi.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />}
            {kpi.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />}
            {kpi.trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
            <span className={kpi.trend === 'up' ? 'text-rose-400 font-semibold' : kpi.trend === 'down' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
              {kpi.change_pct}
            </span>
            <span className="text-slate-500 text-[10px]">vs avg</span>
          </div>
        </div>

        <div className="pt-1">
          <Sparkline data={kpi.sparkline} color={getSparklineColor()} width={85} height={30} />
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-command-700/40 text-[11px] text-slate-400 truncate">
        {kpi.description}
      </div>
    </div>
  );
};
