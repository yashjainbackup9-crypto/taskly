'use client';

import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const TaskListViewSkeleton: React.FC = () => {
  const groups = ['To Do', 'Doing', 'Completed'];

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto w-full space-y-6">
      {groups.map((group, gIdx) => (
        <div
          key={gIdx}
          className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-xs"
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-50/70 dark:bg-zinc-800/40 border-b border-zinc-200/60 dark:border-zinc-800/60">
            <Skeleton className="w-4 h-4 rounded-md" />
            <Skeleton className="w-20 h-4 rounded-md" />
            <Skeleton className="w-6 h-4 rounded-full" />
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 p-2 space-y-2">
            {[1, 2, 3].map((_, rIdx) => (
              <div key={rIdx} className="flex items-center justify-between py-2.5 px-4">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="w-4 h-4 rounded-md" />
                  <Skeleton className="w-48 sm:w-64 h-4 rounded-md" />
                </div>
                <div className="flex items-center gap-8">
                  <Skeleton className="w-16 h-4 rounded-md hidden sm:block" />
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="w-12 h-3 rounded-md hidden sm:block" />
                  </div>
                  <Skeleton className="w-16 h-4 rounded-md" />
                  <Skeleton className="w-4 h-4 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
