import React from 'react';
import Link from 'next/link';
import { Network, Database, Sparkles, Code2, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <Network className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-lg text-slate-100 tracking-tight">
                Graph<span className="text-cyan-400">Lens</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
              Explore how technology, skills, projects, and developers are connected in a multi-hop property graph powered by CognoDB and openCypher.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>CognoDB Cloud • Bolt 5.4 • Wexa AI Assignment</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Explore Graph
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explore" className="hover:text-cyan-400 transition-colors">
                  Interactive Graph Explorer
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-cyan-400 transition-colors">
                  Project Dependency Graph
                </Link>
              </li>
              <li>
                <Link href="/technologies" className="hover:text-cyan-400 transition-colors">
                  Technology Ecosystem Radar
                </Link>
              </li>
              <li>
                <Link href="/developers" className="hover:text-cyan-400 transition-colors">
                  Developer Skill Matching
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-cyan-400 transition-colors">
                  Graph Centrality & Bridging
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Technical
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  Architecture & Schema <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <a
                  href="https://console.cognodb.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  CognoDB Cloud Console <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://opencypher.org"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  openCypher Standard <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>© {new Date().getFullYear()} GraphLens. Designed for Wexa AI Take-Home Assignment.</div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Instance: db-7ee2c80f
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
