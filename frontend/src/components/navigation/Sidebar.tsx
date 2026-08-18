'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, FolderKanban, ChevronDown, ChevronRight, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { UserProfileMenu } from './UserProfileMenu';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useTask();
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);

  const isTasksActive = pathname.startsWith('/tasks');
  const isProjectsActive = pathname.startsWith('/projects');

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

          {/* Workspace Section */}
          <div className="pt-2">
            <button
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
                    'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                    isTasksActive
                      ? 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
                  )}
                >
                  <LayoutGrid className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span>Tasks</span>
                </Link>

                <Link
                  href="/projects"
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                    isProjectsActive
                      ? 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
                  )}
                >
                  <FolderKanban className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span>Projects</span>
                </Link>
              </nav>
            )}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 px-1">
          <span className="font-mono text-[11px]">Taskly v1.0</span>
          <button
            onClick={toggleSidebar}
            title="Collapse Sidebar"
            className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
