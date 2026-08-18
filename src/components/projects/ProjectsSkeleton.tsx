'use client';

import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const ProjectsSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-md" />
          <Skeleton className="w-28 h-4 rounded-md" />
        </div>
        <Skeleton className="w-24 h-7 rounded-xl" />
      </div>

      {/* Rows */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 p-4 space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center justify-between py-3 px-4">
            <Skeleton className="w-36 h-4 rounded-md" />
            <Skeleton className="w-20 h-4 rounded-md" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="w-14 h-3 rounded-md" />
            </div>
            <Skeleton className="w-24 h-4 rounded-md" />
            <Skeleton className="w-4 h-4 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};
