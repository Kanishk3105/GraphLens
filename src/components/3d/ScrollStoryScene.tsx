'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  Database,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  GitBranch,
  Network,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import HeroGraphCanvas from './HeroGraphCanvas';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import type { Graph3DNode } from './Instanced3DGraph';

export default function ScrollStoryScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeScene, setActiveScene] = useState(1);
  const [selectedNode, setSelectedNode] = useState<Graph3DNode | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollHeight = containerRef.current.scrollHeight - window.innerHeight;
      const scrollTop = -rect.top;
      const progress = Math.max(0, Math.min(1, scrollTop / (scrollHeight || 1)));

      setScrollProgress(progress);

      // Determine active scene based on scroll percentage
      if (progress < 0.15) setActiveScene(1);
      else if (progress < 0.3) setActiveScene(2);
      else if (progress < 0.45) setActiveScene(3);
      else if (progress < 0.6) setActiveScene(4);
      else if (progress < 0.75) setActiveScene(5);
      else if (progress < 0.88) setActiveScene(6);
      else setActiveScene(7);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-slate-950 text-slate-100">
      {/* Fixed Fullscreen 3D WebGL Canvas Layer */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <HeroGraphCanvas
          scrollProgress={scrollProgress}
          onNodeSelect={(node) => setSelectedNode(node)}
        />
        {/* Subtle vignette gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,7,18,0.7)_100%)] pointer-events-none" />
      </div>

      {/* Persistent HUD Progress Indicator */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-3">
        {[
          { num: 1, label: 'Origin' },
          { num: 2, label: 'The Problem' },
          { num: 3, label: 'The Graph' },
          { num: 4, label: 'Multi-Hop' },
          { num: 5, label: 'Deep Traversal' },
          { num: 6, label: 'Insights' },
          { num: 7, label: 'Architecture' },
        ].map((s) => (
          <div
            key={s.num}
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => {
              const target = ((s.num - 1) / 6.5) * (containerRef.current?.scrollHeight || 0);
              window.scrollTo({ top: target, behavior: 'smooth' });
            }}
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeScene === s.num
                  ? 'w-6 bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                  : 'bg-slate-700 group-hover:bg-slate-500'
              }`}
            />
            <span
              className={`text-[10px] font-mono tracking-wider uppercase transition-opacity duration-300 ${
                activeScene === s.num ? 'text-cyan-400 font-semibold' : 'text-slate-500 opacity-0 group-hover:opacity-100'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Selected Node Drawer (if user clicks any 3D node) */}
      {selectedNode && (
        <div className="fixed bottom-6 right-6 z-30 max-w-sm w-full glass-panel rounded-2xl p-5 border border-cyan-500/30 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between mb-2">
            <Badge variant={selectedNode.type as any} size="sm">
              {selectedNode.type}
            </Badge>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-xs text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
          <div className="text-base font-bold text-slate-100">{selectedNode.name}</div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Position: [{selectedNode.position.map((n) => n.toFixed(1)).join(', ')}]
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <Link
              href={`/explore?nodeId=${selectedNode.id}`}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
            >
              Expand in Graph Explorer →
            </Link>
          </div>
        </div>
      )}

      {/* Scroll Sections Container (Creates vertical scroll space controlling the 3D camera) */}
      <div className="relative z-10">
        {/* ================= SCENE 1: THE HOOK ================= */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="space-y-6 animate-in fade-in duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-400 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>COGNODB GRAPH DATABASE • BOLT 5.4</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gradient">
              Everything is <br />
              <span className="text-gradient-cyan">Connected.</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              Explore how technologies, skills, projects, and developers intersect in a multi-hop knowledge graph.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/explore">
                <Button size="lg" icon={<Compass className="w-5 h-5" />}>
                  Enter the Graph
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  window.scrollTo({ top: window.innerHeight * 1.2, behavior: 'smooth' });
                }}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Scroll Journey
              </Button>
            </div>
          </div>

          <div className="absolute bottom-10 flex flex-col items-center gap-2 text-slate-500 text-xs font-mono animate-bounce">
            <span>SCROLL TO ENTER</span>
            <div className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* ================= SCENE 2: THE PROBLEM ================= */}
        <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                SCENE 02 // THE LIMITATION
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-100">
                Tables Describe Entities. <br />
                <span className="text-cyan-400">Graphs Reveal Relationships.</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Relational tables isolate entities into rigid rows and foreign key columns. But real-world knowledge is inherently networked.
              </p>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                In SQL, answering &quot;Which projects can a developer contribute to based on indirect technology skills?&quot; demands 4+ nested JOINs across multiple bridge tables.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between pb-2 border-b border-slate-800">
                <span>Relational Model vs Graph Model</span>
                <Badge variant="rose" size="sm">
                  SQL Bottleneck
                </Badge>
              </div>
              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-rose-300">
                  ❌ SELECT * FROM dev_skills JOIN skills JOIN tech_skills JOIN tech JOIN proj_tech JOIN projects...
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>MATCH (d)-[:KNOWS]-&gt;(:Skill)&lt;-[:ENABLES]-(:Technology)&lt;-[:USES]-(p)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SCENE 3: THE GRAPH ================= */}
        <section className="min-h-screen flex items-center justify-end px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="max-w-lg glass-panel p-8 rounded-3xl border border-slate-800/80 space-y-5 backdrop-blur-xl">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              SCENE 03 // PROPERTY GRAPH MODEL
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-100">
              The Relationship Fabric
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every connection is a first-class citizen. Nodes carry labeled types and rich properties, while typed edges carry directional semantics.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>:Developer</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>:Skill</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>:Technology</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>:Project</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SCENE 4: MULTI-HOP CYPHER TRAVERSAL ================= */}
        <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="w-full glass-panel p-8 rounded-3xl border border-cyan-500/30 glow-cyan space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                  SCENE 04 // 3-HOP TRAVERSAL
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
                  Developer → Skill → Technology → Project
                </h3>
              </div>
              <Badge variant="emerald" size="sm">
                openCypher over Bolt 5.4
              </Badge>
            </div>

            {/* Floating Cypher Terminal Panel */}
            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300">
              <div className="flex items-center gap-1.5 pb-3 border-b border-slate-900 text-slate-500 text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>recommendations.cypher</span>
              </div>
              <pre className="pt-3 leading-relaxed text-cyan-300">
                {`MATCH (d:Developer {name: $developerName})-[:KNOWS]->(s:Skill)
MATCH (t:Technology)-[:ENABLES]->(s)
MATCH (p:Project)-[:USES]->(t)
WHERE NOT (d)-[:BUILT|CONTRIBUTED_TO]->(p)
RETURN p.name AS recommendedProject, 
       t.name AS bridgeTech, 
       s.name AS matchedSkill
ORDER BY p.stars DESC
LIMIT 5`}
              </pre>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="text-emerald-400">⚡ Traversal Latency: &lt; 1.2ms on CognoDB Cloud</span>
              <span>3 Hops Resolved in Single Pass</span>
            </div>
          </div>
        </section>

        {/* ================= SCENE 5: DEEP TRAVERSAL & SHORTEST PATH ================= */}
        <section className="min-h-screen flex items-center justify-start px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="max-w-lg glass-panel p-8 rounded-3xl border border-slate-800 space-y-5">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              SCENE 05 // GRAPH ALGORITHMS
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-100">
              Shortest Path & Centrality
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Find shortest connection paths between disparate tools, identify central bridging technologies, and uncover hidden knowledge pathways.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Dynamic Shortest Path Query</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                MATCH p = shortestPath((a)-[*..8]-(b)) RETURN p
              </div>
            </div>
          </div>
        </section>

        {/* ================= SCENE 6: GRAPH INSIGHTS PREVIEW ================= */}
        <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-100">Hub Technologies</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Technologies with the highest degree centrality connecting domains and projects.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
                <GitBranch className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-100">Domain Bridges</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tools that bridge frontend, machine learning, and cloud infrastructure ecosystems.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-100">Skill Gap Analytics</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time analysis comparing project requirements against developer skill availability.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SCENE 7: ARCHITECTURE & TRANSITION TO APP ================= */}
        <section className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="space-y-6">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              SCENE 07 // PRODUCTION ARCHITECTURE
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
              Built Around <span className="text-gradient-cyan">Relationships.</span>
            </h2>

            {/* Architecture Flow Diagram */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-6 font-mono text-xs">
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                Browser (Next.js 14)
              </div>
              <span className="text-cyan-400">→</span>
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                REST API Layer
              </div>
              <span className="text-cyan-400">→</span>
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                Neo4j Driver (Bolt 5.4)
              </div>
              <span className="text-cyan-400">→</span>
              <div className="px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 font-bold shadow-lg shadow-cyan-500/20">
                CognoDB Cloud
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              Ready to navigate the live property graph? Launch the interactive explorer with drag-and-drop physics, neighbor expansions, and path finding.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/explore">
                <Button size="lg" icon={<Compass className="w-5 h-5" />}>
                  Open Interactive Graph Explorer
                </Button>
              </Link>
              <Link href="/insights">
                <Button variant="secondary" size="lg" icon={<Layers className="w-5 h-5" />}>
                  View Graph Insights & Analytics
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
