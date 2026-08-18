'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  PanelLeft,
  Search,
  Plus,
  Command,
  HelpCircle,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { AvatarGroup } from '../ui/Avatar';
import { FieldsDropdown } from '../dropdowns/FieldsDropdown';
import { FilterMenu } from '../dropdowns/FilterMenu';
import { NotificationsPopover } from '../dropdowns/NotificationsPopover';
import { AdminModeToggle } from '../ui/AdminModeToggle';
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
  const { theme, toggleTheme } = useTheme();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when activated
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  const handleOpenSearchModal = () => {
    setIsGlobalSearchOpen(true);
  };

  const handleOpenShortcutsModal = () => {
    setIsShortcutsOpen(true);
  };

  return (
    <header className="h-14 border-b border-zinc-200/80 dark:border-zinc-800 bg-[var(--background)] px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-40 shadow-xs/50 transition-colors">
      {/* Left Area: Sidebar Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shrink-0"
          title="Toggle Navigation Sidebar (⌘B or [)"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          {breadcrumb && (
            <>
              <span className="text-xs text-zinc-400 font-medium truncate">{breadcrumb}</span>
              <span className="text-zinc-300 dark:text-zinc-700 text-xs">/</span>
            </>
          )}
          <h1 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 truncate tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Center Search Input (Responsive Expandable) */}
      <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search tasks, tags, members... (⌘F)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-14 py-1.5 text-xs bg-zinc-100/80 dark:bg-zinc-800/60 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-400 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-md shadow-2xs">
            /
          </kbd>
        </div>
      </div>

      {/* Right Area: Team Avatars, Search, Shortcuts & Control Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
        <div data-tour="fields-dropdown">
          <FieldsDropdown />
        </div>

        {/* Filter Dropdown Button */}
        <div data-tour="filter-dropdown">
          <FilterMenu />
        </div>

        {/* Theme Dark/Light Toggle Icon Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-2xs transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode (T)`}
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-zinc-600" />
          )}
        </button>

        {/* Notifications Popover Button */}
        <NotificationsPopover />

        {/* Admin Mode Showcase Switch */}
        <div data-tour="admin-toggle">
          <AdminModeToggle compact />
        </div>

        {/* Add Task Primary Action Button */}
        <button
          type="button"
          data-tour="header-add-task"
          onClick={() => {
            if (onAddTask) onAddTask();
            else setIsTaskModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white shadow-xs transition-all active:scale-98"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add task</span>
        </button>
      </div>
    </header>
  );
};
