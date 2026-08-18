'use client';

import React from 'react';
import { useTask } from '../../context/TaskContext';
import { Crown, ShieldCheck, Eye, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AdminModeToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isAdminMode, toggleAdminMode } = useTask();

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleAdminMode}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border shadow-2xs active:scale-95',
          isAdminMode
            ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 ring-1 ring-amber-500/20'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
        )}
        title={isAdminMode ? 'Admin Mode is ON (Click to switch to Member View)' : 'Member View (Click to activate Admin Mode)'}
      >
        {isAdminMode ? (
          <>
            <Crown className="w-3.5 h-3.5 fill-amber-500/30 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Admin</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Member</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/60 shadow-2xs">
      <button
        type="button"
        onClick={() => !isAdminMode && toggleAdminMode()}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
          isAdminMode
            ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
        )}
      >
        <Crown className="w-3.5 h-3.5 fill-amber-500/20 text-amber-500" />
        <span>Admin Mode</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
      </button>

      <button
        type="button"
        onClick={() => isAdminMode && toggleAdminMode()}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
          !isAdminMode
            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
        )}
      >
        <Eye className="w-3.5 h-3.5 text-zinc-400" />
        <span>Viewer</span>
      </button>
    </div>
  );
};
