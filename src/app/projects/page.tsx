'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FolderGit2, Star, Cpu, Sparkles, Layers, Users, ExternalLink, Network, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge, { BadgeVariant } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import type { Project, GraphNode } from '@/lib/db/types';

interface ProjectDetailData {
  project: Project;
  technologies: GraphNode[];
  skills: GraphNode[];
  domains: GraphNode[];
  developers: GraphNode[];
  concepts: GraphNode[];
  languages: GraphNode[];
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const selectedIdStr = searchParams.get('id');

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to load projects');
        const data: Project[] = await res.json();
        setProjects(data);

        // If ID in URL or pick first
        const targetId = selectedIdStr ? parseInt(selectedIdStr, 10) : data[0]?._id;
        if (targetId) {
          loadProjectDetail(targetId);
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load projects from CognoDB');
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [selectedIdStr]);

  const loadProjectDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/projects?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedProject(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter(
    (p) => filterCategory === 'All' || p.category === filterCategory
  );

  if (loading) {
    return (
      <div className="pt-28 min-h-screen">
        <LoadingState message="Loading projects from CognoDB..." />
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
          PROJECT GRAPH • COGNODB
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 mt-1">
          Projects & Connected Dependencies
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Explore how software projects rely on specific technologies, required skill sets, and developer contributions.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              filterCategory === cat
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Split View: Project Cards & Selected Project Multi-Hop Graph Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Project Cards List */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-2">
          {filteredProjects.map((proj) => {
            const isSelected = selectedProject?.project._id === proj._id;
            return (
              <div
                key={proj._id}
                onClick={() => loadProjectDetail(proj._id)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-cyan-950/30 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                    : 'glass-panel hover:bg-slate-900/70 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="Project" size="sm">
                    {proj.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs font-mono text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{proj.stars.toLocaleString()}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-100">{proj.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-cyan-400 font-mono">
                  <span>Explore Graph Connections</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Relationship Network for Selected Project */}
        <div className="lg:col-span-7">
          {detailLoading ? (
            <div className="glass-panel p-12 rounded-3xl min-h-[400px] flex items-center justify-center">
              <LoadingState message="Traversing project relationships..." />
            </div>
          ) : selectedProject ? (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              {/* Project Header */}
              <div className="space-y-2 border-b border-slate-800 pb-6">
                <div className="flex items-center justify-between">
                  <Badge variant="Project">{selectedProject.project.category}</Badge>
                  <Link
                    href={`/explore?nodeId=${selectedProject.project._id}`}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <Network className="w-3.5 h-3.5" /> Open in Explorer →
                  </Link>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                  {selectedProject.project.name}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedProject.project.description}
                </p>
              </div>

              {/* Technologies Used ([:USES]) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  <Cpu className="w-4 h-4" /> Technologies Used ([:USES])
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((t) => (
                    <Link key={t._id} href={`/technologies?name=${encodeURIComponent(t.name)}`}>
                      <Badge variant="Technology" className="hover:scale-105 transition-transform cursor-pointer">
                        {t.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Required Skills ([:REQUIRES]) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Required Skills ([:REQUIRES])
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.skills.map((s) => (
                    <Badge key={s._id} variant="Skill">
                      {s.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Concepts Implemented ([:IMPLEMENTS]) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
                  <Layers className="w-4 h-4" /> Implemented Concepts ([:IMPLEMENTS])
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.concepts.map((c) => (
                    <Badge key={c._id} variant="Concept">
                      {c.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Developers ([:BUILT] / [:CONTRIBUTED_TO]) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-wider">
                  <Users className="w-4 h-4" /> Contributors & Authors
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProject.developers.map((dev) => (
                    <Link
                      key={dev._id}
                      href={`/developers?id=${dev._id}`}
                      className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-between"
                    >
                      <div className="text-xs font-semibold text-slate-200">{dev.name}</div>
                      <Badge variant="Developer" size="sm">
                        Developer
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

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="pt-24 min-h-screen"><LoadingState /></div>}>
      <ProjectsContent />
    </Suspense>
  );
}
