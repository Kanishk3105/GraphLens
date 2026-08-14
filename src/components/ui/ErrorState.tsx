import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Unable to connect to the graph database',
  message = 'Failed to execute query against CognoDB Cloud. Please verify that the database instance is reachable and the credentials are valid.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="min-h-[300px] w-full flex flex-col items-center justify-center p-8 text-center glass-panel rounded-2xl border border-rose-900/30 bg-rose-950/10">
      <div className="w-14 h-14 rounded-2xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-center mb-4 text-rose-400">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      <p className="text-xs text-slate-400 max-w-md mt-1.5 mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRetry}>
          Retry Query
        </Button>
      )}
    </div>
  );
}
