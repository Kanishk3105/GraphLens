import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: boolean;
}

export default function Card({
  children,
  hoverEffect = true,
  glow = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'glass-panel rounded-2xl p-6 transition-all duration-300 relative overflow-hidden',
          hoverEffect && 'glass-panel-hover hover:-translate-y-1',
          glow && 'glow-cyan',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
