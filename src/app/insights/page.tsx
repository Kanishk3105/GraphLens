'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Cpu,
  Share2,
  GitBranch,
  Layers,
  Sparkles,
  Database,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';

interface InsightResponse {
  mostConnected: { name: string; label: string; connections: number }[];
  domainDistribution: { domain: string; count: number }[];
  bridgingTechnologies: { technology: string; domain1: string; domain2: string }[];
  skillGaps: { skill: string; projectsRequiring: number; developersKnowing: number; gap: number }[];
  multiHopChains: { developer: string; skill: string; technology: string; project: string }[];
}

const COLORS = ['#38bdf8', '#818cf8', '#34d399', '#c084fc', '#fbbf24', '#f43f5e', '#2dd4bf'];

export default function InsightsPage() {
  const [data, setData] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInsights() {
      setLoading(true);
      try {
        const res = await fetch('/api/insights');
        if (!res.ok) throw new Error('Failed to load insights');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError('Unable to load graph analytics from CognoDB');
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, []);

  if (loading) {
    return (
      <div className="pt-28 min-h-screen">
        <LoadingState message="Computing graph centrality, bridging paths, and skill gaps in CognoDB..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="pt-28 max-w-2xl mx-auto min-h-screen px-4">
        <ErrorState message={error || 'Error'} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
            GRAPH ANALYTICS • COGNODB
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-xs font-mono text-emerald-400">openCypher Aggregations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 mt-1">
          Graph Intelligence & Network Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Deep-dive into network degree centrality, cross-domain bridging nodes, multi-hop relationship chains, and ecosystem skill gaps.
        </p>
      </div>

      {/* Row 1: Centrality & Domain Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Most Connected Nodes (Degree Centrality) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Network Centrality (Most Connected Nodes)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                MATCH (n)-[r]-() RETURN n.name, count(r) ORDER BY count DESC
              </p>
            </div>
            <Badge variant="cyan" size="sm">
              Degree Centrality
            </Badge>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.mostConnected} layout="vertical" margin={{ left: 40, right: 20, top: 10, bottom: 10 }}>
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" stroke="#cbd5e1" tick={{ fontSize: 11 }} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1f2937', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="connections" fill="#38bdf8" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Domain Distribution Pie */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Domain Entity Density
              </h3>
              <p className="text-xs text-slate-400 font-mono">Entities per technology domain</p>
            </div>
            <Badge variant="indigo" size="sm">
              Domains
            </Badge>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.domainDistribution}
                  dataKey="count"
                  nameKey="domain"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={50}
                  paddingAngle={4}
                >
                  {data.domainDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1f2937', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: GRAPH-SPECIFIC QUERY — Technologies Bridging Domains */}
      <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 glow-cyan space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                GRAPH PATTERN MATCHING
              </span>
              <Badge variant="emerald" size="sm">
                Awkward in Relational SQL
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mt-1">
              Cross-Domain Bridge Technologies
            </h3>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Finds technologies that connect two distinct technological domains via peer relationships.
          </p>
        </div>

        {/* Floating Cypher Query Box */}
        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
          <pre className="text-cyan-300">
            {`MATCH (t:Technology)-[:PART_OF]->(d1:Domain)
MATCH (t)-[:RELATED_TO]-(t2:Technology)-[:PART_OF]->(d2:Domain)
WHERE d1 <> d2 AND id(d1) < id(d2)
RETURN DISTINCT t.name AS bridge, d1.name AS domain1, d2.name AS domain2`}
          </pre>
        </div>

        {/* Bridges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.bridgingTechnologies.map((b, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-100">{b.technology}</span>
                <Badge variant="Technology" size="sm">
                  Bridge
                </Badge>
              </div>
              <div className="text-xs text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-cyan-400">{b.domain1}</span>
                <span className="text-slate-600">↔</span>
                <span className="text-indigo-400">{b.domain2}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Skill Gap Analysis */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Skill Demand vs Availability Gaps
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Comparing project [:REQUIRES] constraints against developer [:KNOWS] profiles
            </p>
          </div>
          <Badge variant="amber" size="sm">
            Gap Analysis
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.skillGaps.slice(0, 6).map((g, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div className="text-xs font-bold text-slate-200">{g.skill}</div>
              <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800/80">
                <span className="text-slate-400">Required by: <strong className="text-cyan-400">{g.projectsRequiring}</strong></span>
                <span className="text-slate-400">Known by: <strong className="text-emerald-400">{g.developersKnowing}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Multi-Hop 3-Hop Traversal Chains */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              Live 3-Hop Traversal Chains Resolved by CognoDB
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              (:Developer)-[:KNOWS]-&gt;(:Skill)&lt;-[:ENABLES]-(:Technology)&lt;-[:USES]-(:Project)
            </p>
          </div>
          <Badge variant="indigo" size="sm">
            3-Hop Chains
          </Badge>
        </div>

        <div className="space-y-3">
          {data.multiHopChains.map((c, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
            >
              <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                {c.developer}
              </div>
              <span className="text-slate-600">--[KNOWS]--&gt;</span>
              <div className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                {c.skill}
              </div>
              <span className="text-slate-600">&lt;--[ENABLES]--</span>
              <div className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-300">
                {c.technology}
              </div>
              <span className="text-slate-600">&lt;--[USES]--</span>
              <div className="flex items-center gap-2 text-sky-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                {c.project}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
