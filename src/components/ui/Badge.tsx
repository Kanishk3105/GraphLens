import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant =
  | 'default'
  | 'Developer'
  | 'Project'
  | 'Technology'
  | 'Skill'
  | 'Domain'
  | 'Concept'
  | 'Language'
  | 'Resource'
  | 'cyan'
  | 'indigo'
  | 'emerald'
  | 'amber'
  | 'rose';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
  Developer: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60 shadow-sm shadow-indigo-950',
  Project: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60 shadow-sm shadow-cyan-950',
  Technology: 'bg-sky-950/60 text-sky-300 border-sky-800/60 shadow-sm shadow-sky-950',
  Skill: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 shadow-sm shadow-emerald-950',
  Domain: 'bg-purple-950/60 text-purple-300 border-purple-800/60 shadow-sm shadow-purple-950',
  Concept: 'bg-amber-950/60 text-amber-300 border-amber-800/60 shadow-sm shadow-amber-950',
  Language: 'bg-rose-950/60 text-rose-300 border-rose-800/60 shadow-sm shadow-rose-950',
  Resource: 'bg-teal-950/60 text-teal-300 border-teal-800/60 shadow-sm shadow-teal-950',
  cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60',
  indigo: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60',
  emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
  amber: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
  rose: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 font-medium rounded-full border font-mono tracking-tight transition-colors',
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
          variantStyles[variant] || variantStyles.default,
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
