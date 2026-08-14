'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Network, Compass, FolderGit2, Cpu, Sparkles, LineChart, Info, Search, Activity } from 'lucide-react';
import SearchModal from '@/components/ui/SearchModal';

const navItems = [
  { href: '/explore', label: 'Graph Explorer', icon: Compass },
  { href: '/projects', label: 'Projects', icon: FolderGit2 },
  { href: '/technologies', label: 'Technologies', icon: Cpu },
  { href: '/developers', label: 'Developers', icon: Network },
  { href: '/skills', label: 'Skills', icon: Sparkles },
  { href: '/insights', label: 'Insights', icon: LineChart },
  { href: '/about', label: 'Architecture', icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<'healthy' | 'checking' | 'error'>('checking');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Quick health check on mount
    fetch('/api/health')
      .then((res) => (res.ok ? setDbStatus('healthy') : setDbStatus('error')))
      .catch(() => setDbStatus('error'));

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Network className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-100 flex items-center gap-1.5">
                Graph<span className="text-cyan-400">Lens</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-mono -mt-1">
                COGNODB POWERED
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 rounded-full px-3 py-1.5 backdrop-blur-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Search & Database Health */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all group"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span className="hidden sm:inline">Search graph...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-800 rounded border border-slate-700 text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* DB Status Indicator */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
                dbStatus === 'healthy'
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
                  : dbStatus === 'checking'
                  ? 'bg-amber-950/40 text-amber-400 border-amber-800/50'
                  : 'bg-rose-950/40 text-rose-400 border-rose-800/50'
              }`}
              title={
                dbStatus === 'healthy'
                  ? 'CognoDB Cloud Connected (Bolt 5.4)'
                  : dbStatus === 'checking'
                  ? 'Connecting to CognoDB Cloud...'
                  : 'CognoDB Connection Issue'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus === 'healthy'
                    ? 'bg-emerald-400 animate-pulse'
                    : dbStatus === 'checking'
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-rose-400'
                }`}
              />
              <span className="hidden sm:inline">
                {dbStatus === 'healthy' ? 'Bolt 5.4' : dbStatus === 'checking' ? 'Connecting' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
