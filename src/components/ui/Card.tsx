import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const shadows = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

export function Card({
  children,
  className,
  padding = 'md',
  shadow = 'md',
}: CardProps) {
  return (
    <div
      className={twMerge(
        'rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
        paddings[padding],
        shadows[shadow],
        className
      )}
    >
      {children}
    </div>
  );
}
