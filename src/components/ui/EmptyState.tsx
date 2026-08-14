import React from 'react';
import { SearchX, RefreshCcw } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = 'No Graph Entities Found',
  description = 'No nodes or relationships match the current search or filter criteria in CognoDB.',
  actionLabel = 'Reset Filters',
  onAction,
}: EmptyStateProps) {
  return (
    <div className="min-h-[300px] w-full flex flex-col items-center justify-center p-8 text-center glass-panel rounded-2xl border border-slate-800">
      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-500">
        <SearchX className="w-7 h-7 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">{description}</p>
      {onAction && (
        <Button variant="secondary" size="sm" icon={<RefreshCcw className="w-3.5 h-3.5" />} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
