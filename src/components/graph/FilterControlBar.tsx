'use client';

import React from 'react';
import { Search, RotateCcw, Filter, GitFork, Share2 } from 'lucide-react';
import Badge, { BadgeVariant } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export interface FilterState {
  searchQuery: string;
  selectedLabels: Set<string>;
  hops: number;
}

interface FilterControlBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  onOpenPathFinder: () => void;
  availableLabels: string[];
  totalNodes: number;
  totalEdges: number;
}

export default function FilterControlBar({
  filters,
  onFilterChange,
  onReset,
  onOpenPathFinder,
  availableLabels,
  totalNodes,
  totalEdges,
}: FilterControlBarProps) {
  const toggleLabel = (label: string) => {
    const next = new Set(filters.selectedLabels);
    if (next.has(label)) {
      next.delete(label);
    } else {
      next.add(label);
    }
    onFilterChange({ ...filters, selectedLabels: next });
  };

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Filter visible nodes by name or description..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Actions: Hops selection, Path Finder, Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Multi-Hop Depth Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-mono">
            <span className="px-2 text-slate-400 text-[11px]">Hops:</span>
            {[1, 2, 3].map((h) => (
              <button
                key={h}
                onClick={() => onFilterChange({ ...filters, hops: h })}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  filters.hops === h
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Path Finder trigger */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenPathFinder}
            icon={<Share2 className="w-3.5 h-3.5 text-cyan-400" />}
          >
            Find Shortest Path
          </Button>

          {/* Reset Graph */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>

          {/* Live Node / Edge Stats */}
          <div className="text-[11px] font-mono text-slate-400 pl-2 border-l border-slate-800 hidden sm:block">
            <span className="text-cyan-400 font-semibold">{totalNodes}</span> nodes •{' '}
            <span className="text-indigo-400 font-semibold">{totalEdges}</span> rels
          </div>
        </div>
      </div>

      {/* Label Filter Pills */}
      <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-900">
        <span className="text-[11px] font-mono text-slate-500 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Labels:
        </span>
        {availableLabels.map((label) => {
          const isSelected = filters.selectedLabels.has(label);
          return (
            <button
              key={label}
              onClick={() => toggleLabel(label)}
              className="cursor-pointer transition-all"
            >
              <Badge
                variant={label as BadgeVariant}
                size="sm"
                className={
                  isSelected
                    ? 'ring-1 ring-cyan-400 font-bold opacity-100 scale-105'
                    : 'opacity-40 hover:opacity-80'
                }
              >
                {label}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
