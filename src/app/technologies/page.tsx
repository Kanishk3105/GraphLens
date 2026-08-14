'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Cpu, Globe, FolderGit2, Sparkles, Network, ArrowUpRight, Share2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import type { Technology, GraphNode } from '@/lib/db/types';

interface TechDetailData {
  technology: Technology;
  relatedTechnologies: Technology[];
  projects: GraphNode[];
  skills: GraphNode[];
  domains: GraphNode[];
}

function TechnologiesContent() {
  const searchParams = useSearchParams();
  const selectedName = searchParams.get('name');

  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [selectedTech, setSelectedTech] = useState<TechDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadTechs() {
      setLoading(true);
      try {
        const res = await fetch('/api/technologies');
        if (!res.ok) throw new Error('Failed to load technologies');
        const data: Technology[] = await res.json();
        setTechnologies(data);

        const target = selectedName || data[0]?.name;
        if (target) {
          loadTechDetail(target);
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load technologies from CognoDB');
      } finally {
        setLoading(false);
      }
    }

    loadTechs();
  }, [selectedName]);

  const loadTechDetail = async (name: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/technologies?name=${encodeURIComponent(name)}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedTech(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredTechs = technologies.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="pt-28 min-h-screen">
        <LoadingState message="Loading technology radar from CognoDB..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-28 max-w-2xl mx-auto min-h-screen px-4">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
          ECOSYSTEM RADAR • COGNODB
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 mt-1">
          Technology Graph & Relationships
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Inspect how technologies interconnect across domains, enable core developer competencies, and power production projects.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter technologies (e.g., PyTorch, CognoDB, Next.js)..."
          className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Technology cards */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-2">
          {filteredTechs.map((tech) => {
            const isSelected = selectedTech?.technology.name === tech.name;
            return (
              <div
                key={tech._id}
                onClick={() => loadTechDetail(tech.name)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                    : 'glass-panel hover:bg-slate-900/70 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-100">{tech.name}</span>
                  <Badge variant="Technology" size="sm">
                    {tech.category}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                  {tech.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Tech Detail & Graph Network */}
        <div className="lg:col-span-7">
          {detailLoading ? (
            <div className="glass-panel p-12 rounded-3xl min-h-[400px] flex items-center justify-center">
              <LoadingState message="Querying technology relationship graph..." />
            </div>
          ) : selectedTech ? (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              {/* Header */}
              <div className="space-y-2 border-b border-slate-800 pb-6">
                <div className="flex items-center justify-between">
                  <Badge variant="Technology">{selectedTech.technology.category}</Badge>
                  {selectedTech.technology.website && (
                    <a
                      href={selectedTech.technology.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-mono"
                    >
                      Website <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                  {selectedTech.technology.name}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedTech.technology.description}
                </p>
              </div>

              {/* Related Technologies ([:RELATED_TO]) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  <Share2 className="w-4 h-4" /> Related Technologies ([:RELATED_TO])
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTech.relatedTechnologies.length > 0 ? (
                    selectedTech.relatedTechnologies.map((rt) => (
                      <button
                        key={rt._id}
                        onClick={() => loadTechDetail(rt.name)}
                        className="cursor-pointer"
                      >
                        <Badge variant="Technology" className="hover:scale-105 transition-transform">
                          {rt.name}
                        </Badge>
                      </button>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">No direct peer links</span>
                  )}
                </div>
              </div>

              {/* Enabled Skills ([:ENABLES]) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Enabled Skills ([:ENABLES])
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTech.skills.map((s) => (
                    <Badge key={s._id} variant="Skill">
                      {s.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Associated Domains ([:PART_OF]) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider">
                  <Globe className="w-4 h-4" /> Ecosystem Domains ([:PART_OF])
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTech.domains.map((d) => (
                    <Badge key={d._id} variant="Domain">
                      {d.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Projects Using This Technology ([:USES]) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-wider">
                  <FolderGit2 className="w-4 h-4" /> Projects Powered By {selectedTech.technology.name}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedTech.projects.map((p) => (
                    <Link
                      key={p._id}
                      href={`/projects?id=${p._id}`}
                      className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-between"
                    >
                      <div className="text-xs font-semibold text-slate-200">{p.name}</div>
                      <Badge variant="Project" size="sm">
                        Project
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function TechnologiesPage() {
  return (
    <Suspense fallback={<div className="pt-24 min-h-screen"><LoadingState /></div>}>
      <TechnologiesContent />
    </Suspense>
  );
}
