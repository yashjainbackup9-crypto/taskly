'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/navigation/Sidebar';
import { TaskDetailDrawer } from '../../components/task-details/TaskDetailDrawer';
import { CreateTaskModal } from '../../components/ui/CreateTaskModal';
import { CreateProjectModal } from '../../components/ui/CreateProjectModal';
import { KeyboardShortcutsModal } from '../../components/ui/KeyboardShortcutsModal';
import { useTask } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    selectedTaskId,
    setSelectedTaskId,
    toggleSidebar,
    setActiveView,
    setSearchQuery,
  } = useTask();
  const { toggleTheme } = useTheme();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Global Keyboard Shortcuts Manager
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // 1. Universal Escape: Dismiss any active modal/drawer/popup
      if (e.key === 'Escape') {
        if (selectedTaskId) {
          setSelectedTaskId(null);
          return;
        }
        if (isTaskModalOpen) {
          setIsTaskModalOpen(false);
          return;
        }
        if (isProjectModalOpen) {
          setIsProjectModalOpen(false);
          return;
        }
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
          return;
        }
        setSearchQuery('');
      }

      // If user is currently typing in an input/textarea, do not trigger global navigation shortcuts (except Esc)
      if (isInput) return;

      // 2. Command Palette / Shortcuts Helper: Cmd + K or '?'
      if ((isCmdOrCtrl && e.key === 'k') || e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }

      // 3. New Task: Cmd + N (without shift)
      if (isCmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsTaskModalOpen(true);
      }

      // 4. New Project: Cmd + Shift + N
      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsProjectModalOpen(true);
      }

      // 5. Toggle Sidebar: Cmd + B
      if (isCmdOrCtrl && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }

      // 6. Switch to Board View: Cmd + 1
      if (isCmdOrCtrl && e.key === '1') {
        e.preventDefault();
        setActiveView('board');
      }

      // 7. Switch to List View: Cmd + 2
      if (isCmdOrCtrl && e.key === '2') {
        e.preventDefault();
        setActiveView('list');
      }

      // 8. Toggle Dark/Light Theme: Cmd + D
      if (isCmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedTaskId,
    isTaskModalOpen,
    isProjectModalOpen,
    isShortcutsOpen,
    setSelectedTaskId,
    toggleSidebar,
    setActiveView,
    toggleTheme,
    setSearchQuery,
  ]);

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Universal Workspace Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </main>

      {/* Task Details Drawer Modal */}
      <TaskDetailDrawer />

      {/* Global Create Task Modal (⌘ + N) */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />

      {/* Global Create Project Modal (⌘ + Shift + N) */}
      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />

      {/* Global Shortcuts Helper Modal (⌘ + K / ?) */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
