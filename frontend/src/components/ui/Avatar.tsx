'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTask } from '../../context/TaskContext';
import { Check, X, Users, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className,
  showBorder = true,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-8 h-8 text-sm',
    xl: 'w-12 h-12 text-base',
  };

  const getInitials = (n: string) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.substring(0, 2).toUpperCase();
  };

  // Generate deterministic color based on name
  const getBgColor = (n: string) => {
    const colors = [
      'bg-indigo-500 text-white',
      'bg-emerald-500 text-white',
      'bg-amber-500 text-white',
      'bg-rose-500 text-white',
      'bg-purple-500 text-white',
      'bg-blue-500 text-white',
      'bg-cyan-500 text-white',
    ];
    let hash = 0;
    for (let i = 0; i < n.length; i++) hash += n.charCodeAt(i);
    return colors[hash % colors.length];
  };

  const avatarUrl = src || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || 'User')}`;

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden flex items-center justify-center shrink-0 font-medium select-none',
        sizeClasses[size],
        showBorder && 'ring-2 ring-white dark:ring-zinc-900',
        getBgColor(name),
        className
      )}
      title={name}
    >
      <img
        src={avatarUrl}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
      <span className="absolute text-[10px] font-bold">{getInitials(name)}</span>
    </div>
  );
};

export interface WorkspaceMember {
  name: string;
  role?: string;
  avatar?: string;
}

export const WORKSPACE_MEMBERS: WorkspaceMember[] = [
  { name: 'Admin', role: 'Workspace Owner' },
  { name: 'Dexter', role: 'Full Stack Dev' },
  { name: 'Ankit Dutta', role: 'Backend Lead' },
  { name: 'QA Team', role: 'Quality Assurance' },
  { name: 'Designer', role: 'Product Design' },
  { name: 'Security', role: 'SecOps Lead' },
  { name: 'Dev Team', role: 'Core Engineering' },
  { name: 'CN', role: 'Frontend Engineer' },
  { name: 'Product Lead', role: 'Product Manager' },
  { name: 'Engineering', role: 'Infrastructure' },
];

export const AvatarGroup: React.FC<{
  members?: WorkspaceMember[];
}> = ({ members = WORKSPACE_MEMBERS }) => {
  const { selectedMembers, toggleMemberFilter, clearMemberFilters } = useTask();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside dismissal
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const visibleMembers = members.slice(0, 4);
  const remainingCount = Math.max(0, members.length - 4);
  const hasHiddenSelected = selectedMembers.some(m => !visibleMembers.some(v => v.name === m));

  return (
    <div className="flex items-center gap-1.5 relative" ref={dropdownRef}>
      {/* Active Member Selection Indicator Pills */}
      {selectedMembers.length > 0 && (
        <div className="flex items-center gap-1 max-w-[260px] overflow-x-auto py-0.5 no-scrollbar">
          {selectedMembers.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => toggleMemberFilter(name)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800 hover:bg-blue-200/80 dark:hover:bg-blue-900/80 transition-all animate-in fade-in shrink-0 shadow-2xs group"
              title={`Remove ${name} filter`}
            >
              <span>{name}</span>
              <X className="w-3 h-3 text-blue-500 group-hover:scale-125 transition-transform" />
            </button>
          ))}
          {selectedMembers.length > 1 && (
            <button
              type="button"
              onClick={clearMemberFilters}
              className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors shrink-0"
              title="Clear all member filters"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Main Avatar Stack */}
      <div className="flex items-center -space-x-1.5 overflow-visible">
        {visibleMembers.map((m) => {
          const isSelected = selectedMembers.includes(m.name);
          return (
            <button
              key={m.name}
              type="button"
              onClick={() => toggleMemberFilter(m.name)}
              className={cn(
                'relative rounded-full transition-all duration-150 transform hover:scale-115 hover:z-30 focus:outline-none',
                isSelected
                  ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-900 scale-110 z-20 shadow-md'
                  : 'z-10 opacity-90 hover:opacity-100'
              )}
              title={`${isSelected ? 'Remove' : 'Add'} ${m.name} (${m.role || 'Member'}) filter`}
            >
              <Avatar name={m.name} src={m.avatar} size="sm" />
            </button>
          );
        })}

        {/* Overflow Count Pill Triggering All Workspace Members Popover */}
        {remainingCount > 0 && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'w-6 h-6 rounded-full ring-2 ring-white dark:ring-zinc-900 flex items-center justify-center text-[10px] font-bold transition-all z-10',
              isOpen || hasHiddenSelected
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
            )}
            title="View all workspace members and multi-select"
          >
            +{remainingCount}
          </button>
        )}
      </div>

      {/* Dropdown Popover Listing All Workspace Members with Checkboxes */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-zinc-100 dark:border-zinc-800 mb-1">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span>Workspace Members</span>
            </span>
            {selectedMembers.length > 0 && (
              <button
                type="button"
                onClick={clearMemberFilters}
                className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear all ({selectedMembers.length})
              </button>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto space-y-0.5">
            {members.map(m => {
              const isSelected = selectedMembers.includes(m.name);
              return (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => toggleMemberFilter(m.name)}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors text-left group',
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Avatar name={m.name} src={m.avatar} size="sm" />
                    <div>
                      <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 leading-tight">
                        {m.name}
                      </p>
                      <p className="text-[10px] text-zinc-400">{m.role}</p>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'w-4 h-4 rounded-md flex items-center justify-center transition-colors border',
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-400'
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
