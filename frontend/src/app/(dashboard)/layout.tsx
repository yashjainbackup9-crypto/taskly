'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/navigation/Sidebar';
import { TaskDetailDrawer } from '../../components/task-details/TaskDetailDrawer';
import { CreateTaskModal } from '../../components/ui/CreateTaskModal';
import { CreateProjectModal } from '../../components/ui/CreateProjectModal';
import { KeyboardShortcutsModal } from '../../components/ui/KeyboardShortcutsModal';
import { OnboardingTutorial } from '../../components/ui/OnboardingTutorial';
import { RecommendationModal } from '../../components/ui/RecommendationModal';
import { GlobalSearchModal } from '../../components/ui/GlobalSearchModal';
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
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Global Keyboard Shortcuts Manager
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // 1. Universal Escape: Dismiss any active modal/drawer/popup
      if (e.key === 'Escape') {
        if (selectedTaskId) {
          setSelectedTaskId(null);
          return;
        }
        if (isGlobalSearchOpen) {
          setIsGlobalSearchOpen(false);
          return;
        }
        if (isRecommendationsOpen) {
          setIsRecommendationsOpen(false);
          return;
        }
        if (isTutorialOpen) {
          setIsTutorialOpen(false);
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

      // 2. Global Search: Cmd + F
      if (isCmdOrCtrl && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }

      // 3. Command Palette / Shortcuts Helper: Cmd + K or '?'
      if ((isCmdOrCtrl && e.key === 'k') || e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }

      // 4. New Task: Cmd + N
      if (isCmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsTaskModalOpen(true);
      }

      // 5. New Project: Cmd + Shift + N
      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsProjectModalOpen(true);
      }

      // 6. Toggle Sidebar: Cmd + B
      if (isCmdOrCtrl && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }

      // 7. Switch to Board View: Cmd + 1
      if (isCmdOrCtrl && e.key === '1') {
        e.preventDefault();
        setActiveView('board');
      }

      // 8. Switch to List View: Cmd + 2
      if (isCmdOrCtrl && e.key === '2') {
        e.preventDefault();
        setActiveView('list');
      }

      // 9. Toggle Dark/Light Theme: Cmd + D
      if (isCmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedTaskId,
    isGlobalSearchOpen,
    isRecommendationsOpen,
    isTutorialOpen,
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
      <Sidebar
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenRecommendations={() => setIsRecommendationsOpen(true)}
        onOpenSearch={() => setIsGlobalSearchOpen(true)}
      />

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

      {/* Role-Based Smart Recommendations Modal */}
      <RecommendationModal
        isOpen={isRecommendationsOpen}
        onClose={() => setIsRecommendationsOpen(false)}
      />

      {/* Global Multi-Attribute Role Search Modal (⌘ + F) */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
      />

      {/* First-Time Onboarding Tutorial Walkthrough */}
      <OnboardingTutorial
        forceOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
}
