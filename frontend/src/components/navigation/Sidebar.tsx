'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  FolderKanban,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  Sparkles,
  HelpCircle,
  Search,
  Inbox,
  CheckSquare,
  UserPlus,
  Settings,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { UserProfileMenu } from './UserProfileMenu';
import { InviteMemberModal } from '../ui/InviteMemberModal';
import { cn } from '../../lib/utils';

interface SidebarProps {
  onOpenTutorial?: () => void;
  onOpenRecommendations?: () => void;
  onOpenSearch?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenTutorial,
  onOpenRecommendations,
  onOpenSearch,
}) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isSidebarOpen, toggleSidebar, setSearchQuery, searchQuery } = useTask();
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const isTasksActive = pathname.startsWith('/tasks');
  const isProjectsActive = pathname.startsWith('/projects');
  const isSettingsActive = pathname.startsWith('/settings');

  const handleMyTasksFilter = () => {
    if (searchQuery === (user?.name || 'Admin')) {
      setSearchQuery('');
    } else {
      setSearchQuery(user?.name || 'Admin');
    }
  };

  const isMyTasksActive = searchQuery === (user?.name || 'Admin');

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen z-40 bg-[var(--sidebar-bg)] border-r border-[var(--border)] transition-all duration-200 flex flex-col justify-between p-3.5',
          isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-0 lg:-translate-x-full overflow-hidden p-0 border-r-0'
        )}
      >
        <div className="space-y-4">
          {/* User Profile Selector */}
          <div className="pt-1">
            <UserProfileMenu />
          </div>

          {/* Quick Search Shortcut */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/60 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-all border border-zinc-200/50 dark:border-zinc-700/50 shadow-2xs active:scale-98"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search everywhere...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono text-[9px] font-bold">
              ⌘F
            </kbd>
          </button>

          {/* Workspace Section */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase tracking-wider"
            >
              <span>Workspace</span>
              {isWorkspaceOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {isWorkspaceOpen && (
              <nav className="mt-1.5 space-y-1">
                <Link
                  href="/tasks"
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all group',
                    isTasksActive && !isMyTasksActive
                      ? 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
                  )}
                >
                  <LayoutGrid className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:scale-110 transition-transform" />
                  <span>Tasks</span>
                </Link>

                {/* My Tasks Fast Filter */}
                <button
                  type="button"
                  onClick={handleMyTasksFilter}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all group text-left',
                    isMyTasksActive
                      ? 'bg-blue-100/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:scale-110 transition-transform" />
                    <span>My Tasks</span>
                  </div>
                  {isMyTasksActive && (
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </button>

                <Link
                  href="/projects"
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all group',
                    isProjectsActive
                      ? 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
                  )}
                >
                  <FolderKanban className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:scale-110 transition-transform" />
                  <span>Projects</span>
                </Link>

                {/* Smart Recommendations Item */}
                <button
                  type="button"
                  onClick={onOpenRecommendations}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-purple-500 group-hover:rotate-12 transition-transform" />
                    <span>Recommendations</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-[10px] font-bold">
                    AI
                  </span>
                </button>

                {/* Invite Members */}
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all text-left group"
                >
                  <UserPlus className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:scale-110 transition-transform" />
                  <span>Invite Members</span>
                </button>

                {/* Settings Link */}
                <Link
                  href="/settings"
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all group',
                    isSettingsActive
                      ? 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
                  )}
                >
                  <Settings className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:scale-110 transition-transform" />
                  <span>Settings</span>
                </Link>
              </nav>
            )}
          </div>
        </div>

        {/* Sidebar Footer with Tutorial Trigger */}
        <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800/80 space-y-2 px-1">
          <button
            type="button"
            onClick={onOpenTutorial}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>First-Time Tutorial</span>
          </button>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <span className="font-mono text-[11px]">Taskly v1.0</span>
            <button
              type="button"
              onClick={toggleSidebar}
              title="Collapse Sidebar"
              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </>
  );
};
