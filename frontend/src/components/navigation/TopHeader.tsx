'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  PanelLeft,
  Search,
  Plus,
  Command,
  HelpCircle,
  X,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { AvatarGroup } from '../ui/Avatar';
import { FieldsDropdown } from '../dropdowns/FieldsDropdown';
import { FilterMenu } from '../dropdowns/FilterMenu';
import { NotificationsPopover } from '../dropdowns/NotificationsPopover';
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
  const {
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    setIsShortcutsOpen,
    setIsGlobalSearchOpen,
    setIsTaskModalOpen,
  } = useTask();
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

  const handleOpenSearchModal = () => {
    setIsGlobalSearchOpen(true);
  };

  const handleOpenShortcutsModal = () => {
    setIsShortcutsOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)] border-b border-[var(--border)] px-4 lg:px-6 py-3 flex items-center justify-between gap-3 shadow-2xs">
      {/* Left Area: Sidebar Toggle & Title / Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          title="Toggle Sidebar ([ or ⌘B)"
          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 truncate">
          {breadcrumb && (
            <>
              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                {breadcrumb}
              </span>
              <span className="text-zinc-300 dark:text-zinc-600">/</span>
            </>
          )}
          <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* Right Area: Team Avatars, Search, Shortcuts & Control Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Team Members Avatar Stack */}
        <div className="hidden md:block" data-tour="member-stack">
          <AvatarGroup />
        </div>

        {/* Global Multi-Attribute Search Button */}
        <button
          type="button"
          data-tour="header-search"
          onClick={handleOpenSearchModal}
          className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-2xs transition-colors"
          title="Global Search & Quick Find (⌘F or /)"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Keyboard Shortcuts Helper Button (⌘K) */}
        <button
          type="button"
          data-tour="header-shortcuts"
          onClick={handleOpenShortcutsModal}
          className="hidden sm:flex items-center gap-1 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-2xs text-xs font-medium transition-colors"
          title="Keyboard Shortcuts Cheatsheet (? or ⌘K)"
        >
          <Command className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono text-zinc-400">K</span>
        </button>

        {/* Fields Dropdown Button */}
        <FieldsDropdown />

        {/* Filter Dropdown Button */}
        <FilterMenu />

        {/* Notifications Popover Button */}
        <NotificationsPopover />

        {/* Add Task Primary Action Button */}
        <button
          type="button"
          data-tour="header-add-task"
          onClick={() => {
            if (onAddTask) onAddTask();
            else setIsTaskModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white shadow-xs transition-all active:scale-98"
          title="New Task (Press C or N)"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>
    </header>
  );
};
