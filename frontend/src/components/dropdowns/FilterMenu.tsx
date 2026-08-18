'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ListFilter, ChevronRight, Check, X } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { PRIORITY_OPTIONS, STATUS_COLUMNS } from '../../lib/constants';
import { PrioritySignal } from '../ui/PrioritySignal';
import { cn } from '../../lib/utils';

export const FilterMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<'status' | 'priority' | 'labels' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { statusFilter, setStatusFilter, priorityFilter, setPriorityFilter } = useTask();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilters = Boolean(statusFilter || priorityFilter);

  const clearFilters = () => {
    setStatusFilter(null);
    setPriorityFilter(null);
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 shadow-xs transition-colors',
          hasActiveFilters && 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'
        )}
      >
        <ListFilter className="w-3.5 h-3.5" />
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-blue-500" />
        )}
      </button>

      {/* Main Filter Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200/80 dark:border-zinc-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          {hasActiveFilters && (
            <div className="px-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Active Filter</span>
              <button
                onClick={clearFilters}
                className="text-[11px] text-red-500 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            </div>
          )}

          {/* Status Filter Option */}
          <div className="relative">
            <button
              onClick={() => setActiveSubmenu(activeSubmenu === 'status' ? null : 'status')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border border-zinc-400 dark:border-zinc-600 flex items-center justify-center text-[9px]">○</span>
                <span>Status</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Status Submenu */}
            {activeSubmenu === 'status' && (
              <div className="absolute left-full top-0 ml-1.5 w-44 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200/80 dark:border-zinc-800 py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Filter by Status
                </div>
                {STATUS_COLUMNS.map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(statusFilter === status ? null : status);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <span>{status}</span>
                    {statusFilter === status && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority Filter Option */}
          <div className="relative">
            <button
              onClick={() => setActiveSubmenu(activeSubmenu === 'priority' ? null : 'priority')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">📶</span>
                <span>Priority</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Priority Submenu */}
            {activeSubmenu === 'priority' && (
              <div className="absolute left-full top-0 ml-1.5 w-44 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200/80 dark:border-zinc-800 py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Filter by Priority
                </div>
                {PRIORITY_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setPriorityFilter(priorityFilter === opt.id ? null : opt.id);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <PrioritySignal priority={opt.id} />
                    {priorityFilter === opt.id && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Members (Placeholder for UX completeness) */}
          <div className="px-3 py-2 text-xs text-zinc-400 flex items-center justify-between opacity-60">
            <span>Members</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          {/* Due Date */}
          <div className="px-3 py-2 text-xs text-zinc-400 flex items-center justify-between opacity-60">
            <span>Due Date</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          {/* Teams */}
          <div className="px-3 py-2 text-xs text-zinc-400 flex items-center justify-between opacity-60">
            <span>Teams</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          {/* Labels */}
          <div className="px-3 py-2 text-xs text-zinc-400 flex items-center justify-between opacity-60">
            <span>Labels</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          {/* Reporter */}
          <div className="px-3 py-2 text-xs text-zinc-400 flex items-center justify-between opacity-60">
            <span>Reporter</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}
    </div>
  );
};
