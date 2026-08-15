'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import Badge, { BadgeVariant } from './Badge';
import type { SearchResult } from '@/lib/db/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=15`);
        const data = await res.json();
        if (res.ok) {
          setResults(Array.isArray(data) ? data : []);
          setSelectedIndex(0);
        } else {
          setResults([]);
          setError(
            typeof data?.error === 'string'
              ? data.error
              : 'Search query failed. Check CognoDB connection and try again.'
          );
        }
      } catch (err) {
        console.error('Search fetch error:', err);
        setResults([]);
        setError('Unable to reach the search API. Check your network connection.');
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: SearchResult) => {
    onClose();
    if (item.label === 'Project') {
      router.push(`/projects?id=${item._id}`);
    } else if (item.label === 'Technology') {
      router.push(`/technologies?name=${encodeURIComponent(item.name)}`);
    } else if (item.label === 'Developer') {
      router.push(`/developers?id=${item._id}`);
    } else if (item.label === 'Skill') {
      router.push(`/skills?name=${encodeURIComponent(item.name)}`);
    } else {
      router.push(`/explore?nodeId=${item._id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden glass-panel flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search technologies, skills, projects, developers..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="text-xs font-mono text-slate-500 hover:text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading && (
            <div className="p-6 text-center text-xs font-mono text-slate-400">
              Querying CognoDB property graph...
            </div>
          )}

          {!loading && error && (
            <div className="p-8 text-center text-rose-400">
              <p className="text-sm">{error}</p>
              <p className="text-xs text-slate-500 mt-1 font-mono">Verify CognoDB credentials are configured on the server.</p>
            </div>
          )}

          {!loading && !error && query && results.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm">No graph entities found matching &quot;{query}&quot;</p>
              <p className="text-xs text-slate-500 mt-1 font-mono">Try searching for &quot;Python&quot;, &quot;React&quot;, &quot;GraphLens&quot;, &quot;Machine Learning&quot;</p>
            </div>
          )}

          {!loading && !query && (
            <div className="p-6">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Suggested graph searches
              </div>
              <div className="flex flex-wrap gap-2">
                {['CognoDB', 'PyTorch', 'Next.js', 'Graph Modeling', 'Multi-Hop Traversal', 'Elena Rostova', 'Kubernetes'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-xs text-slate-300 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={`${item.label}-${item._id}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected ? 'bg-cyan-500/15 border border-cyan-500/30' : 'hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Badge variant={item.label as BadgeVariant} size="sm">
                    {item.label}
                  </Badge>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-200 truncate">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-slate-400 truncate max-w-md">{item.description}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 flex-shrink-0 ml-2">
                  <span className="text-[10px] font-mono hidden sm:inline">Navigate</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Use ↑ ↓ to navigate</span>
          <span>Powered by CognoDB openCypher</span>
        </div>
      </div>
    </div>
  );
}
