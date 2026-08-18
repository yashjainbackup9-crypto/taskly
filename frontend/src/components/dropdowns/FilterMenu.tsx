'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ListFilter,
  ChevronRight,
  Check,
  X,
  Tag,
  Calendar,
  CheckSquare,
  Users,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { PRIORITY_OPTIONS, STATUS_COLUMNS } from '../../lib/constants';
import { PrioritySignal } from '../ui/PrioritySignal';
import { Avatar, WORKSPACE_MEMBERS } from '../ui/Avatar';
import { cn } from '../../lib/utils';

export const WORKSPACE_LABELS = [
  'Deployment',
  'Testing',
  'Design',
  'Audit',
  'Development',
  'Research',
  'Optimization',
  'Frontend',
  'Backend',
  'Security',
];

export const FilterMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<
    'status' | 'priority' | 'members' | 'labels' | 'dueDate' | 'subtasks' | null
  >(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    labelFilter,
    setLabelFilter,
    dueDateFilter,
    setDueDateFilter,
    hasSubtasksFilter,
    setHasSubtasksFilter,
    selectedMembers,
    toggleMemberFilter,
    clearAllFilters,
  } = useTask();

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

  const hasActiveFilters = Boolean(
    statusFilter ||
    priorityFilter ||
    labelFilter ||
    dueDateFilter ||
    hasSubtasksFilter !== null ||
    selectedMembers.length > 0
  );

  const activeFilterCount = [
    statusFilter,
    priorityFilter,
    labelFilter,
    dueDateFilter,
    hasSubtasksFilter !== null ? 'subtasks' : null,
    selectedMembers.length > 0 ? 'members' : null,
  ].filter(Boolean).length;

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 shadow-2xs transition-colors',
          hasActiveFilters && 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold'
        )}
        title="Filter tasks by status, priority, member, label, due date, subtasks"
      >
        <ListFilter className="w-3.5 h-3.5" />
        {activeFilterCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center -mr-0.5">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Main Filter Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5 dark:ring-white/10">
          {hasActiveFilters && (
            <div className="px-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Filters Active ({activeFilterCount})
              </span>
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-semibold text-red-500 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Reset all
              </button>
            </div>
          )}

          {/* 1. Status Filter */}
          <div className="relative">
            <button
              onClick={() => setActiveSubmenu(activeSubmenu === 'status' ? null : 'status')}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors',
                statusFilter
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-zinc-400 dark:border-zinc-500 flex items-center justify-center text-[8px]">●</span>
                <span>Status</span>
              </div>
              <div className="flex items-center gap-1">
                {statusFilter && <span className="text-[10px] text-blue-600 dark:text-blue-400">{statusFilter}</span>}
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </div>
            </button>

            {activeSubmenu === 'status' && (
              <div className="absolute right-full sm:left-full top-0 mr-1.5 sm:ml-1.5 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Filter by Status
                </div>
                {STATUS_COLUMNS.map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(statusFilter === status ? null : status);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors',
                      statusFilter === status
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    )}
                  >
                    <span>{status}</span>
                    {statusFilter === status && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Priority Filter */}
          <div className="relative">
            <button
              onClick={() => setActiveSubmenu(activeSubmenu === 'priority' ? null : 'priority')}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors',
                priorityFilter
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">📶</span>
                <span>Priority</span>
              </div>
              <div className="flex items-center gap-1">
                {priorityFilter && <span className="text-[10px] text-blue-600 dark:text-blue-400">{priorityFilter}</span>}
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </div>
            </button>

            {activeSubmenu === 'priority' && (
              <div className="absolute right-full sm:left-full top-0 mr-1.5 sm:ml-1.5 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Filter by Priority
                </div>
                {PRIORITY_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setPriorityFilter(priorityFilter === opt.id ? null : opt.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors',
                      priorityFilter === opt.id
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    )}
                  >
                    <PrioritySignal priority={opt.id} />
                    {priorityFilter === opt.id && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Members Filter */}
          <div className="relative">
            <button
              onClick={() => setActiveSubmenu(activeSubmenu === 'members' ? null : 'members')}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors',
                selectedMembers.length > 0
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              )}
            >
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-zinc-500" />
                <span>Members</span>
              </div>
              <div className="flex items-center gap-1">
                {selectedMembers.length > 0 && (
                  <span className="text-[10px] text-blue-600 dark:text-blue-400">{selectedMembers.length} selected</span>
                )}
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </div>
            </button>

            {activeSubmenu === 'members' && (
              <div className="absolute right-full sm:left-full top-0 mr-1.5 sm:ml-1.5 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 py-1.5 z-50 max-h-64 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Filter by Members
                </div>
                {WORKSPACE_MEMBERS.map(m => {
                  const isSelected = selectedMembers.includes(m.name);
                  return (
                    <button
                      key={m.name}
                      onClick={() => toggleMemberFilter(m.name)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors',
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar name={m.name} size="sm" />
                        <span>{m.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Labels / Tags Filter */}
          <div className="relative">
            <button
              onClick={() => setActiveSubmenu(activeSubmenu === 'labels' ? null : 'labels')}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors',
                labelFilter
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              )}
            >
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-zinc-500" />
                <span>Labels</span>
              </div>
              <div className="flex items-center gap-1">
                {labelFilter && <span className="text-[10px] text-blue-600 dark:text-blue-400">{labelFilter}</span>}
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </div>
            </button>

            {activeSubmenu === 'labels' && (
              <div className="absolute right-full sm:left-full top-0 mr-1.5 sm:ml-1.5 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 py-1.5 z-50 max-h-64 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Filter by Tag
                </div>
                {WORKSPACE_LABELS.map(lbl => (
                  <button
                    key={lbl}
                    onClick={() => {
                      setLabelFilter(labelFilter === lbl ? null : lbl);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors',
                      labelFilter === lbl
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    )}
                  >
                    <span>{lbl}</span>
                    {labelFilter === lbl && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Due Date Filter */}
          <div className="relative">
            <button
              onClick={() => setActiveSubmenu(activeSubmenu === 'dueDate' ? null : 'dueDate')}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors',
                dueDateFilter
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              )}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>Due Date</span>
              </div>
              <div className="flex items-center gap-1">
                {dueDateFilter && <span className="text-[10px] text-blue-600 dark:text-blue-400">{dueDateFilter}</span>}
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </div>
            </button>

            {activeSubmenu === 'dueDate' && (
              <div className="absolute right-full sm:left-full top-0 mr-1.5 sm:ml-1.5 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Due Date Range
                </div>
                {[
                  { id: 'hasdate', label: 'Has Due Date' },
                  { id: 'nodate', label: 'No Due Date' },
                ].map(d => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setDueDateFilter(dueDateFilter === d.id ? null : d.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors',
                      dueDateFilter === d.id
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    )}
                  >
                    <span>{d.label}</span>
                    {dueDateFilter === d.id && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 6. Subtasks / Checklist Filter */}
          <div className="relative">
            <button
              onClick={() => setActiveSubmenu(activeSubmenu === 'subtasks' ? null : 'subtasks')}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors',
                hasSubtasksFilter !== null
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              )}
            >
              <div className="flex items-center gap-2">
                <CheckSquare className="w-3.5 h-3.5 text-zinc-500" />
                <span>Checklist & Subtasks</span>
              </div>
              <div className="flex items-center gap-1">
                {hasSubtasksFilter !== null && (
                  <span className="text-[10px] text-blue-600 dark:text-blue-400">
                    {hasSubtasksFilter ? 'Has items' : 'None'}
                  </span>
                )}
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </div>
            </button>

            {activeSubmenu === 'subtasks' && (
              <div className="absolute right-full sm:left-full top-0 mr-1.5 sm:ml-1.5 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Subtask Status
                </div>
                {[
                  { val: true, label: 'With Subtasks' },
                  { val: false, label: 'Without Subtasks' },
                ].map(s => (
                  <button
                    key={String(s.val)}
                    onClick={() => {
                      setHasSubtasksFilter(hasSubtasksFilter === s.val ? null : s.val);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors',
                      hasSubtasksFilter === s.val
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    )}
                  >
                    <span>{s.label}</span>
                    {hasSubtasksFilter === s.val && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
