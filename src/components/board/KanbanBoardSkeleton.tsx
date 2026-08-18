'use client';

import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const KanbanBoardSkeleton: React.FC = () => {
  const columns = ['To Do', 'Doing', 'Completed', 'On Hold'];

  return (
    <div className="p-4 lg:p-6 flex items-start gap-4 overflow-x-auto min-h-[calc(100vh-80px)]">
      {columns.map((col, idx) => (
        <div
          key={idx}
          className="flex flex-col bg-zinc-100/60 dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 p-3 min-w-[280px] max-w-[320px] shrink-0 space-y-3"
        >
          {/* Column Header Skeleton */}
          <div className="flex items-center justify-between px-1 py-1.5 mb-1">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-md" />
              <Skeleton className="w-16 h-4 rounded-md" />
              <Skeleton className="w-6 h-4 rounded-full" />
            </div>
            <Skeleton className="w-4 h-4 rounded-md" />
          </div>

          {/* Card Skeletons */}
          <div className="space-y-3">
            {[1, 2, idx === 0 ? 3 : idx === 3 ? 3 : 2].map((_, cIdx) => (
              <div
                key={cIdx}
                className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-3.5 space-y-3 shadow-xs"
              >
                {/* Title Skeleton */}
                <div className="space-y-1.5">
                  <Skeleton className="w-full h-3.5 rounded-md" />
                  <Skeleton className="w-3/4 h-3.5 rounded-md" />
                </div>

                {/* Assignee & Due Date Row */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="w-12 h-3 rounded-md" />
                  </div>
                  <Skeleton className="w-14 h-4 rounded-md" />
                </div>

                {/* Label Tags */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <Skeleton className="w-16 h-4 rounded-full" />
                  <Skeleton className="w-14 h-4 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Add Task Button Skeleton */}
          <Skeleton className="w-full h-8 rounded-xl mt-2" />
        </div>
      ))}
    </div>
  );
};
