'use client';

import React, { useState } from 'react';
import { X, Share2, ArrowRight, CornerDownRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge, { BadgeVariant } from '@/components/ui/Badge';
import type { GraphNode, PathResult } from '@/lib/db/types';

interface PathFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableNodes: GraphNode[];
  initialStartNode?: GraphNode | null;
  onHighlightPath?: (nodeIds: number[]) => void;
}

export default function PathFinderModal({
  isOpen,
  onClose,
  availableNodes,
  initialStartNode,
  onHighlightPath,
}: PathFinderModalProps) {
  const [startId, setStartId] = useState<string>(initialStartNode ? String(initialStartNode._id) : '');
  const [endId, setEndId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [pathResult, setPathResult] = useState<PathResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  if (!isOpen) return null;

  const handleFindPath = async () => {
    if (!startId || !endId) return;
    setLoading(true);
    setNotFound(false);
    setPathResult(null);

    try {
      const res = await fetch(`/api/path?start=${startId}&end=${endId}`);
      const data = await res.json();
      if (data.nodes && data.nodes.length > 0) {
        setPathResult(data);
        if (onHighlightPath) {
          onHighlightPath(data.nodes.map((n: GraphNode) => n._id));
        }
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error('Path search error:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl glass-panel space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Find Shortest Path</h3>
              <p className="text-xs text-slate-400 font-mono">openCypher shortestPath() over Bolt</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Node Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">Start Node</label>
            <select
              value={startId}
              onChange={(e) => setStartId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">-- Select Start Node --</option>
              {availableNodes.map((n) => (
                <option key={n._id} value={n._id}>
                  {n.name} ({n._labels?.[0] || 'Node'})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">End Node</label>
            <select
              value={endId}
              onChange={(e) => setEndId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">-- Select End Node --</option>
              {availableNodes.map((n) => (
                <option key={n._id} value={n._id}>
                  {n.name} ({n._labels?.[0] || 'Node'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          variant="primary"
          className="w-full"
          disabled={!startId || !endId || loading}
          onClick={handleFindPath}
        >
          {loading ? 'Traversing Graph Paths...' : 'Find Shortest Path'}
        </Button>

        {/* Path Results Breakdown */}
        {pathResult && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Path Found ({pathResult.length} hops)
              </span>
              <span className="text-slate-400">{pathResult.nodes.length} Nodes in Chain</span>
            </div>

            {/* Sequence flow */}
            <div className="flex flex-col gap-2 pt-2">
              {pathResult.nodes.map((node, i) => {
                const rel = pathResult.relationships[i];
                return (
                  <div key={node._id} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-400">
                          {i + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-200">{node.name}</span>
                      </div>
                      <Badge variant={(node._labels?.[0] as BadgeVariant) || 'default'} size="sm">
                        {node._labels?.[0]}
                      </Badge>
                    </div>

                    {rel && (
                      <div className="flex items-center gap-2 pl-6 text-[11px] font-mono text-cyan-400">
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>[:{rel.type}]</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {notFound && (
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-center text-xs font-mono text-rose-300 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>No relationship path exists between the selected nodes within 8 hops.</span>
          </div>
        )}
      </div>
    </div>
  );
}
