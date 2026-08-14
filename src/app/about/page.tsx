'use client';

import React from 'react';
import Link from 'next/link';
import {
  Database,
  Layers,
  Network,
  Cpu,
  Code2,
  CheckCircle2,
  Terminal,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
            TECHNICAL ARCHITECTURE & MODEL
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-xs font-mono text-emerald-400">Wexa AI Take-Home</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100 mt-2">
          Architecture & Graph Data Modeling
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl leading-relaxed">
          How GraphLens uses CognoDB, the official Neo4j driver, and openCypher to solve relationship-heavy technology ecosystem traversals.
        </p>
      </div>

      {/* 1. System Architecture */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          1. System Architecture
        </h2>

        {/* Visual Architecture Flow */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-2">
              <span className="text-cyan-400 font-bold">1. Browser</span>
              <span className="text-[10px] text-slate-400">Next.js 14 App Router + Three.js Canvas</span>
            </div>
            <div className="hidden sm:flex items-center justify-center text-cyan-400 text-lg">→</div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-2">
              <span className="text-cyan-400 font-bold">2. Server API</span>
              <span className="text-[10px] text-slate-400">Next.js Route Handlers + Query Service</span>
            </div>
            <div className="hidden sm:flex items-center justify-center text-cyan-400 text-lg">→</div>
            <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex flex-col items-center justify-center space-y-2 text-cyan-300">
              <span className="font-bold">3. CognoDB</span>
              <span className="text-[10px] text-cyan-200">Bolt 5.4 Protocol + openCypher Engine</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900 text-xs text-slate-400 space-y-2 leading-relaxed">
            <p>
              • <strong>Client-Server Isolation:</strong> Database credentials (<code>COGNODB_URI</code>, <code>COGNODB_PASSWORD</code>) are stored purely in server-side environment variables and are never bundled into client JavaScript.
            </p>
            <p>
              • <strong>Connection Management:</strong> A singleton <code>neo4j-driver</code> instance manages a connection pool with automatic keepalive and configurable acquisition timeouts.
            </p>
            <p>
              • <strong>Security & Injection Prevention:</strong> 100% of openCypher queries are strictly parameterized using driver parameters (e.g. <code>$name</code>, <code>$id</code>).
            </p>
          </div>
        </div>
      </div>

      {/* 2. Why a Graph Database? */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-400" />
          2. Why a Graph Database?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
            <h3 className="text-sm font-bold text-rose-300">The Relational (SQL) Bottleneck</h3>
            <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <li>• Multi-hop queries require expensive cartesian products across N junction tables.</li>
              <li>• Query latency scales with total table row count rather than the neighborhood density.</li>
              <li>• Variable-length paths (e.g. shortest path or 1-to-N degrees of separation) require recursive CTEs that are notoriously slow.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
            <h3 className="text-sm font-bold text-emerald-300">The CognoDB Graph Advantage</h3>
            <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <li>• <strong>Index-Free Adjacency:</strong> Each node directly stores memory pointers to its adjacent relationships, yielding \(O(1)\) hop time.</li>
              <li>• Sub-millisecond multi-hop lookups regardless of graph size.</li>
              <li>• Native Cypher path-finding semantics (<code>shortestPath()</code>, <code>allShortestPaths()</code>).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Graph Data Model */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Network className="w-5 h-5 text-emerald-400" />
          3. Graph Schema & Node Labels
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          The GraphLens schema models 8 distinct labeled node categories and 12 typed directional relationships:
        </p>

        {/* Node Labels Table */}
        <div className="rounded-2xl border border-slate-800 overflow-hidden text-xs">
          <div className="grid grid-cols-3 bg-slate-900/90 p-3 font-mono font-bold text-slate-300 border-b border-slate-800">
            <div>Label</div>
            <div>Key Properties</div>
            <div>Description</div>
          </div>
          {[
            { label: 'Developer', props: 'name, title, bio, githubUrl, avatarSeed', desc: 'Software engineers and architects' },
            { label: 'Project', props: 'name, category, description, stars, githubUrl', desc: 'Open-source and production software systems' },
            { label: 'Technology', props: 'name, category, description, website', desc: 'Frameworks, libraries, runtimes, and databases' },
            { label: 'Skill', props: 'name, category, level, description', desc: 'Technical competencies and engineering proficiencies' },
            { label: 'Domain', props: 'name, description, icon', desc: 'High-level technology domains' },
            { label: 'Concept', props: 'name, category, description', desc: 'Computer science patterns and theoretical foundations' },
            { label: 'Language', props: 'name, paradigm, typedSystem, year', desc: 'Core programming languages' },
            { label: 'Resource', props: 'name, type, url, difficulty', desc: 'Learning materials, courses, and guides' },
          ].map((item) => (
            <div key={item.label} className="grid grid-cols-3 p-3 border-b border-slate-900 bg-slate-950/40 items-center font-mono">
              <div>
                <Badge variant={item.label as any} size="sm">
                  :{item.label}
                </Badge>
              </div>
              <div className="text-slate-400 text-[11px] truncate pr-2">{item.props}</div>
              <div className="text-slate-300 text-[11px]">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Core Cypher Traversal Queries */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          4. Key Cypher Traversal Queries
        </h2>

        {/* Query 1: 3-Hop Recommendations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold">Query A: Multi-Hop Project Recommendation</span>
            <Badge variant="cyan" size="sm">3-Hop Pattern</Badge>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
            <pre>{`MATCH (d:Developer {name: $developerName})-[:KNOWS]->(s:Skill)
MATCH (t:Technology)-[:ENABLES]->(s)
MATCH (p:Project)-[:USES]->(t)
WHERE NOT (d)-[:BUILT|CONTRIBUTED_TO]->(p)
RETURN p.name AS recommendedProject, t.name AS bridgeTech, s.name AS matchedSkill`}</pre>
          </div>
        </div>

        {/* Query 2: Shortest Path */}
        <div className="space-y-2 pt-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-indigo-400 font-bold">Query B: Shortest Path Between Any Two Nodes</span>
            <Badge variant="indigo" size="sm">openCypher Algorithm</Badge>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto">
            <pre>{`MATCH (start) WHERE id(start) = $startId
MATCH (end) WHERE id(end) = $endId
MATCH p = shortestPath((start)-[*..8]-(end))
RETURN nodes(p) AS pathNodes, relationships(p) AS pathRels, length(p) AS pathLength`}</pre>
          </div>
        </div>

        {/* Query 3: Cross-Domain Bridges */}
        <div className="space-y-2 pt-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 font-bold">Query C: Cross-Domain Bridge Technologies</span>
            <Badge variant="emerald" size="sm">Graph-Specific Pattern</Badge>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
            <pre>{`MATCH (t:Technology)-[:PART_OF]->(d1:Domain)
MATCH (t)-[:RELATED_TO]-(t2:Technology)-[:PART_OF]->(d2:Domain)
WHERE d1 <> d2 AND id(d1) < id(d2)
RETURN DISTINCT t.name AS bridge, d1.name AS domain1, d2.name AS domain2`}</pre>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Ready to test traversals in real-time?</h3>
          <p className="text-xs text-slate-400 mt-1">
            Explore all 137 nodes and 379 relationships populated in CognoDB Cloud.
          </p>
        </div>
        <Link href="/explore">
          <Button size="lg" icon={<Compass className="w-5 h-5" />}>
            Launch Graph Explorer
          </Button>
        </Link>
      </div>
    </div>
  );
}
