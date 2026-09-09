import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  onAction?: () => void;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = AlertCircle,
  onAction,
  actionLabel
}) => {
  return (
    <div className="py-14 px-4 text-center glass-panel rounded-2xl border border-command-700/60 max-w-md mx-auto space-y-3">
      <div className="h-12 w-12 rounded-2xl bg-command-800 border border-command-700 flex items-center justify-center mx-auto text-slate-400 shadow-inner">
        <Icon className="w-6 h-6 text-cyan-400" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white font-mono tracking-wide">{title}</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>
      {onAction && actionLabel && (
        <div className="pt-2">
          <button
            onClick={onAction}
            className="px-4 py-2 rounded-xl bg-command-800 hover:bg-command-700 text-cyan-400 border border-command-700 text-xs font-mono font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};
