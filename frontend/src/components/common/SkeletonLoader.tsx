import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded-lg bg-command-800/80 border border-command-700/50 ${className}`}
    />
  );
};

export const KpiCardSkeleton: React.FC = () => {
  return (
    <div className="glass-panel p-4 rounded-xl border border-command-700/60 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <div className="flex items-baseline justify-between pt-1">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-7 w-20" />
      </div>
      <div className="pt-2 border-t border-command-700/40">
        <Skeleton className="h-2.5 w-36" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-3">
          <Skeleton className="h-3.5 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
};
