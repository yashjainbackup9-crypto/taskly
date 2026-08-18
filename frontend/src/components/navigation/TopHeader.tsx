'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PanelLeft, Search, Plus, X } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { FieldsDropdown } from '../dropdowns/FieldsDropdown';
import { FilterMenu } from '../dropdowns/FilterMenu';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../lib/utils';

interface TopHeaderProps {
  title?: string;
  breadcrumb?: string;
  onAddTask?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title = 'Tasks',
  breadcrumb,
  onAddTask,
}) => {
  const { toggleSidebar, searchQuery, setSearchQuery, isSidebarOpen } = useTask();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd + F or Ctrl + F to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setIsSearchActive(true);
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && isSearchActive) {
        setIsSearchActive(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchActive, setSearchQuery]);

  return (
    <header className="sticky top-0 z-20 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)] px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
      {/* Left Area: Sidebar Toggle & Title / Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          title="Toggle Sidebar"
          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 truncate">
          {breadcrumb && (
            <>
              <span className="text-xs text-zinc-400 font-medium truncate">{breadcrumb}</span>
              <span className="text-xs text-zinc-400">/</span>
            </>
          )}
          <h1 className="text-lg lg:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* Center/Right Area: Presence Avatars, Search, Fields, Filter, Add Task */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time floating Presence Avatars stack */}
        <div className="hidden md:flex items-center -space-x-1.5 mr-1">
          <Avatar name="Admin" size="sm" />
          <Avatar name="Dexter" size="sm" />
          <Avatar name="Ankit" size="sm" />
          <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-semibold flex items-center justify-center ring-2 ring-white dark:ring-zinc-900">
            +2
          </div>
        </div>

        {/* Search Bar matching Figma screenshot 05_search_filter_active.png */}
        <div className="relative">
          {isSearchActive ? (
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 shadow-xs w-48 sm:w-64 transition-all">
              <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full bg-transparent text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">⌘F</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setIsSearchActive(true);
                setTimeout(() => searchInputRef.current?.focus(), 50);
              }}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 shadow-xs transition-colors"
              title="Search (⌘F)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Fields Dropdown Button */}
        <FieldsDropdown />

        {/* Filter Dropdown Button */}
        <FilterMenu />

        {/* Add Task Primary Action Button */}
        <button
          onClick={onAddTask}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white shadow-xs transition-all active:scale-98"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>
    </header>
  );
};
