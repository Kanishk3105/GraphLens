'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Compass, Share2, Filter, Layers, Database } from 'lucide-react';
import GraphCanvas from '@/components/graph/GraphCanvas';
import NodeDetailPanel from '@/components/graph/NodeDetailPanel';
import FilterControlBar, { FilterState } from '@/components/graph/FilterControlBar';
import PathFinderModal from '@/components/graph/PathFinderModal';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import type { GraphData, GraphNode, GraphRelationship } from '@/lib/db/types';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialNodeId = searchParams.get('nodeId') ? parseInt(searchParams.get('nodeId')!, 10) : null;

  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], relationships: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<number[]>([]);
  const [pathFinderOpen, setPathFinderOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedLabels: new Set<string>([
      'Developer',
      'Project',
      'Technology',
      'Skill',
      'Domain',
      'Concept',
      'Language',
      'Resource',
    ]),
    hops: 1,
  });

  // Fetch graph data from CognoDB API
  const fetchGraph = async (nodeId?: number, hops?: number) => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/graph?limit=350';
      if (nodeId) {
        url = `/api/graph?nodeId=${nodeId}&hops=${hops || 1}`;
      }
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Database query returned an error');
      }
      const data: GraphData = await res.json();
      setGraphData(data);

      if (nodeId) {
        const found = data.nodes.find((n) => n._id === nodeId);
        if (found) setSelectedNode(found);
      }
    } catch (err) {
      console.error('Fetch graph error:', err);
      setError('Unable to connect to CognoDB Cloud graph database. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph(initialNodeId || undefined);
  }, [initialNodeId]);

  // Extract all unique labels present in the graph
  const availableLabels = useMemo(() => {
    const set = new Set<string>();
    graphData.nodes.forEach((n) => {
      if (n._labels) n._labels.forEach((l) => set.add(l));
    });
    return Array.from(set);
  }, [graphData.nodes]);

  // Apply filters to nodes and edges
  const filteredNodes = useMemo(() => {
    return graphData.nodes.filter((node) => {
      // 1. Label filter
      const label = node._labels?.[0] || '';
      if (!filters.selectedLabels.has(label)) return false;

      // 2. Search query filter
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = node.name.toLowerCase().includes(q);
        const matchDesc = node.description ? String(node.description).toLowerCase().includes(q) : false;
        if (!matchName && !matchDesc) return false;
      }

      return true;
    });
  }, [graphData.nodes, filters]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n._id)), [filteredNodes]);

  const filteredRelationships = useMemo(() => {
    return graphData.relationships.filter(
      (r) => filteredNodeIds.has(r._startNodeId) && filteredNodeIds.has(r._endNodeId)
    );
  }, [graphData.relationships, filteredNodeIds]);

  const handleExpandNeighbors = (nodeId: number, hops: number) => {
    fetchGraph(nodeId, hops);
  };

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      selectedLabels: new Set(availableLabels),
      hops: 1,
    });
    setSelectedNode(null);
    setHighlightedNodeIds([]);
    fetchGraph();
  };

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen flex flex-col space-y-4">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              COGNO DB EXPLORER
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Bolt Connection
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 mt-1">
            Interactive Property Graph Explorer
          </h1>
        </div>
      </div>

      {/* Filter and Controls */}
      <FilterControlBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleReset}
        onOpenPathFinder={() => setPathFinderOpen(true)}
        availableLabels={availableLabels}
        totalNodes={filteredNodes.length}
        totalEdges={filteredRelationships.length}
      />

      {/* Main Canvas & Inspector Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 relative min-h-[600px]">
        {loading ? (
          <div className="flex-1 glass-panel rounded-2xl flex items-center justify-center">
            <LoadingState />
          </div>
        ) : error ? (
          <div className="flex-1">
            <ErrorState message={error} onRetry={() => fetchGraph()} />
          </div>
        ) : filteredNodes.length === 0 ? (
          <div className="flex-1">
            <EmptyState onAction={handleReset} />
          </div>
        ) : (
          <div className="flex-1 relative">
            <GraphCanvas
              nodes={filteredNodes}
              relationships={filteredRelationships}
              selectedNodeId={selectedNode?._id || null}
              highlightedNodeIds={highlightedNodeIds}
              onSelectNode={(node) => setSelectedNode(node)}
            />
          </div>
        )}

        {/* Side Inspector Panel */}
        {selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            relationships={graphData.relationships}
            allNodes={graphData.nodes}
            onClose={() => setSelectedNode(null)}
            onExpandNeighbors={handleExpandNeighbors}
            onFocusNode={(targetId) => {
              const target = graphData.nodes.find((n) => n._id === targetId);
              if (target) setSelectedNode(target);
            }}
            onFindPathFrom={(node) => {
              setSelectedNode(node);
              setPathFinderOpen(true);
            }}
          />
        )}
      </div>

      {/* Path Finder Modal */}
      <PathFinderModal
        isOpen={pathFinderOpen}
        onClose={() => setPathFinderOpen(false)}
        availableNodes={graphData.nodes}
        initialStartNode={selectedNode}
        onHighlightPath={(nodeIds) => setHighlightedNodeIds(nodeIds)}
      />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="pt-24 min-h-screen"><LoadingState /></div>}>
      <ExploreContent />
    </Suspense>
  );
}
