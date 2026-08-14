'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Users, Sparkles, FolderGit2, Star, ArrowRight, GitPullRequest, GitFork, Network } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import type { Developer, Project, GraphNode } from '@/lib/db/types';

interface DevDetailData {
  developer: Developer;
  skills: GraphNode[];
  projects: GraphNode[];
  domains: GraphNode[];
}

interface DevRecommendations {
  recommendedProjects: (Project & { matchingSkills: string[]; matchingTechnologies: string[]; path: string })[];
  skillToTechPaths: { skill: string; technology: string; project: string }[];
}

function DevelopersContent() {
  const searchParams = useSearchParams();
  const selectedIdStr = searchParams.get('id');

  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [selectedDev, setSelectedDev] = useState<DevDetailData | null>(null);
  const [recommendations, setRecommendations] = useState<DevRecommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDevelopers() {
      setLoading(true);
      try {
        const res = await fetch('/api/developers');
        if (!res.ok) throw new Error('Failed to load developers');
        const data: Developer[] = await res.json();
        setDevelopers(data);

        const targetId = selectedIdStr ? parseInt(selectedIdStr, 10) : data[0]?._id;
        if (targetId) {
          loadDeveloperDetail(targetId);
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load developers from CognoDB');
      } finally {
        setLoading(false);
      }
    }

    loadDevelopers();
  }, [selectedIdStr]);

  const loadDeveloperDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const [detailRes, recsRes] = await Promise.all([
        fetch(`/api/developers?id=${id}`),
        fetch(`/api/developers?id=${id}&recommendations=true`),
      ]);

      if (detailRes.ok) {
        const detailData = await detailRes.json();
        setSelectedDev(detailData);
      }
      if (recsRes.ok) {
        const recsData = await recsRes.json();
        setRecommendations(recsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 min-h-screen">
        <LoadingState message="Loading developer directory from CognoDB..." />
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
          DEVELOPER GRAPH • MULTI-HOP RECOMMENDATIONS
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 mt-1">
          Developers & Skill-Matched Projects
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Leverage 3-hop graph traversals to recommend projects to developers based on their skills and technology bridges.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Developer list */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-2">
          {developers.map((dev) => {
            const isSelected = selectedDev?.developer._id === dev._id;
            return (
              <div
                key={dev._id}
                onClick={() => loadDeveloperDetail(dev._id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                    : 'glass-panel hover:bg-slate-900/70 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-100">{dev.name}</span>
                  <Badge variant="Developer" size="sm">
                    {dev.title}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                  {dev.bio}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Developer Profile & Multi-Hop Recommendations */}
        <div className="lg:col-span-7">
          {detailLoading ? (
            <div className="glass-panel p-12 rounded-3xl min-h-[400px] flex items-center justify-center">
              <LoadingState message="Executing multi-hop recommendation query in CognoDB..." />
            </div>
          ) : selectedDev ? (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              {/* Profile Header */}
              <div className="space-y-2 border-b border-slate-800 pb-6">
                <div className="flex items-center justify-between">
                  <Badge variant="Developer">{selectedDev.developer.title}</Badge>
                  <Link
                    href={`/explore?nodeId=${selectedDev.developer._id}`}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <Network className="w-3.5 h-3.5" /> View in Explorer →
                  </Link>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                  {selectedDev.developer.name}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedDev.developer.bio}
                </p>
              </div>

              {/* Skills Known ([:KNOWS]) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Skills & Proficiencies ([:KNOWS])
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDev.skills.map((s) => (
                    <Badge key={s._id} variant="Skill">
                      {s.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Projects Built / Contributed */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  <FolderGit2 className="w-4 h-4" /> Projects Authored / Contributed
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDev.projects.map((p) => (
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

              {/* MULTI-HOP RECOMMENDATIONS SECTION */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                    <GitPullRequest className="w-4 h-4" /> Multi-Hop Recommended Projects
                  </div>
                  <Badge variant="emerald" size="sm">
                    3-Hop Cypher Traversal
                  </Badge>
                </div>

                <p className="text-xs text-slate-400">
                  Projects matching this developer&apos;s skills indirectly through technology capabilities:
                </p>

                <div className="space-y-3">
                  {recommendations?.recommendedProjects.map((rec) => (
                    <div
                      key={rec._id}
                      className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/20 space-y-2 hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/projects?id=${rec._id}`}
                          className="text-sm font-bold text-slate-100 hover:text-cyan-400"
                        >
                          {rec.name}
                        </Link>
                        <div className="flex items-center gap-1 text-xs font-mono text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{rec.stars}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">{rec.description}</p>

                      <div className="pt-2 flex flex-wrap gap-1.5 items-center text-[11px] font-mono">
                        <span className="text-slate-500">Skill overlap:</span>
                        {rec.matchingSkills.map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300"
                          >
                            {sk}
                          </span>
                        ))}
                        {rec.matchingTechnologies?.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300"
                          >
                            via {t}
                          </span>
                        ))}
                      </div>
                    </div>
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

export default function DevelopersPage() {
  return (
    <Suspense fallback={<div className="pt-24 min-h-screen"><LoadingState /></div>}>
      <DevelopersContent />
    </Suspense>
  );
}
