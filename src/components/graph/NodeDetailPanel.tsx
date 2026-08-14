'use client';

import React from 'react';
import Link from 'next/link';
import { X, Network, Share2, ZoomIn, ExternalLink, Sparkles, FolderGit2, Cpu } from 'lucide-react';
import Badge, { BadgeVariant } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { GraphNode, GraphRelationship } from '@/lib/db/types';

interface NodeDetailPanelProps {
  node: GraphNode | null;
  relationships: GraphRelationship[];
  allNodes: GraphNode[];
  onClose: () => void;
  onExpandNeighbors: (nodeId: number, hops: number) => void;
  onFocusNode: (nodeId: number) => void;
  onFindPathFrom: (node: GraphNode) => void;
}

export default function NodeDetailPanel({
  node,
  relationships,
  allNodes,
  onClose,
  onExpandNeighbors,
  onFocusNode,
  onFindPathFrom,
}: NodeDetailPanelProps) {
  if (!node) return null;

  const nodeLabel = (node._labels && node._labels[0]) || 'Node';

  // Find relationships connected to this node
  const connectedRels = relationships.filter(
    (r) => r._startNodeId === node._id || r._endNodeId === node._id
  );

  const nodesById = new Map<number, GraphNode>();
  allNodes.forEach((n) => nodesById.set(n._id, n));

  const connectedEntities = connectedRels.map((r) => {
    const isOut = r._startNodeId === node._id;
    const targetId = isOut ? r._endNodeId : r._startNodeId;
    const targetNode = nodesById.get(targetId);
    return {
      relType: r._type,
      direction: isOut ? 'outgoing' : 'incoming',
      target: targetNode,
    };
  });

  return (
    <div className="w-full lg:w-96 glass-panel border-l border-slate-800 p-6 flex flex-col h-full overflow-y-auto animate-in slide-in-from-right-10 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Badge variant={nodeLabel as BadgeVariant}>{nodeLabel}</Badge>
          <span className="text-[11px] font-mono text-slate-500">ID #{node._id}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Details */}
      <div className="py-4 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">{node.name}</h2>
          {node.description && (
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{node.description as string}</p>
          )}
        </div>

        {/* Dynamic Properties Table */}
        <div className="space-y-1.5 pt-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
            Node Properties
          </div>
          <div className="rounded-xl bg-slate-900/90 border border-slate-800/80 p-3 space-y-1.5 text-xs font-mono">
            {Object.entries(node)
              .filter(([k]) => !k.startsWith('_') && k !== 'name' && k !== 'description')
              .map(([key, value]) => (
                <div key={key} className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-500">{key}:</span>
                  <span className="text-slate-200 font-semibold truncate max-w-[180px]">
                    {String(value)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Traversal Actions */}
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
            Graph Actions
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onExpandNeighbors(node._id, 1)}
              icon={<Network className="w-3.5 h-3.5 text-cyan-400" />}
            >
              1-Hop Neighbors
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onExpandNeighbors(node._id, 2)}
              icon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
            >
              2-Hop Expansion
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onFindPathFrom(node)}
            icon={<Share2 className="w-3.5 h-3.5 text-cyan-400" />}
          >
            Find Shortest Path From Here
          </Button>
        </div>

        {/* Connected Entities Breakdown */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-500">
            <span>Connected Edges ({connectedEntities.length})</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {connectedEntities.map((item, idx) => {
              if (!item.target) return null;
              const targetLabel = (item.target._labels && item.target._labels[0]) || 'Node';

              return (
                <div
                  key={idx}
                  onClick={() => onFocusNode(item.target!._id)}
                  className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/30 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                        {item.direction === 'outgoing' ? '→' : '←'} {item.relType}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 truncate">
                      {item.target.name}
                    </div>
                  </div>
                  <Badge variant={targetLabel as BadgeVariant} size="sm">
                    {targetLabel}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
