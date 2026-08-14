'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Cpu, FolderGit2, Users, Network, ArrowRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import type { Skill } from '@/lib/db/types';

function SkillsContent() {
  const searchParams = useSearchParams();
  const selectedName = searchParams.get('name');

  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  useEffect(() => {
    async function loadSkills() {
      setLoading(true);
      try {
        const res = await fetch('/api/skills');
        if (!res.ok) throw new Error('Failed to load skills');
        const data: Skill[] = await res.json();
        setSkills(data);

        const target = selectedName ? data.find((s) => s.name === selectedName) : data[0];
        if (target) setSelectedSkill(target);
      } catch (err) {
        console.error(err);
        setError('Unable to load skills from CognoDB');
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, [selectedName]);

  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))];

  const filteredSkills = skills.filter(
    (s) => filterCategory === 'All' || s.category === filterCategory
  );

  if (loading) {
    return (
      <div className="pt-28 min-h-screen">
        <LoadingState message="Loading skills network from CognoDB..." />
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
          SKILL TOPOLOGY • COGNODB
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 mt-1">
          Technical Skills & Capabilities
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Discover how competencies are enabled by technologies and required across diverse project architectures.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              filterCategory === cat
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill._id}
            className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="Skill" size="sm">
                  {skill.category}
                </Badge>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  {skill.level}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100">{skill.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{skill.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
              <Link
                href={`/explore?nodeId=${skill._id}`}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
              >
                <Network className="w-3.5 h-3.5" /> Explore in Graph →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillsPage() {
  return (
    <Suspense fallback={<div className="pt-24 min-h-screen"><LoadingState /></div>}>
      <SkillsContent />
    </Suspense>
  );
}
