import React from 'react';
import { Network } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export default function LoadingState({
  message = 'Traversing CognoDB graph...',
  subtext = 'Querying nodes, relationships, and multi-hop paths',
}: LoadingStateProps) {
  return (
    <div className="min-h-[350px] w-full flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-6">
        {/* Outer pulsing ring */}
        <div className="w-16 h-16 rounded-full border border-cyan-500/30 animate-ping absolute inset-0" />
        {/* Inner spinning glow */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-600/20 border border-cyan-500/40 backdrop-blur-md flex items-center justify-center animate-pulse">
          <Network className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-200 tracking-tight">{message}</h3>
      <p className="text-xs text-slate-400 max-w-sm mt-1.5 font-mono">{subtext}</p>
    </div>
  );
}
