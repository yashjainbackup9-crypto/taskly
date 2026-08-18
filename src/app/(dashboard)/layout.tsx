'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '../../components/navigation/Sidebar';
import { TaskDetailDrawer } from '../../components/task-details/TaskDetailDrawer';
import { CreateTaskModal } from '../../components/ui/CreateTaskModal';
import { CreateProjectModal } from '../../components/ui/CreateProjectModal';
import { KeyboardShortcutsModal } from '../../components/ui/KeyboardShortcutsModal';
import { RecommendationModal } from '../../components/ui/RecommendationModal';
import { GlobalSearchModal } from '../../components/ui/GlobalSearchModal';
import { ThemeShowcaseModal } from '../../components/ui/ThemeShowcaseModal';
import { TasklyTourProvider, useTour } from '../../components/tour/TasklyTour';
import { useTask } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';

/**
 * Synchronizes URL query parameters (?id=... or ?taskId=...) with selectedTaskId state.
 * Allows direct deep links (e.g. /tasks?id=6a83f61b56757774f5016e6e) to open the task details drawer immediately.
 */
function UrlQueryParamSync() {
  const searchParams = useSearchParams();
  const { selectedTaskId, setSelectedTaskId } = useTask();
  const initializedRef = React.useRef(false);

  // 1. On initial mount only: read query param and open task if specified in URL
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      const urlTaskId = searchParams.get('id') || searchParams.get('taskId');
      if (urlTaskId) {
        setSelectedTaskId(urlTaskId);
      }
    }
  }, [searchParams, setSelectedTaskId]);

  // 2. When selectedTaskId changes, keep URL in sync without infinite reopen loop
  useEffect(() => {
    if (typeof window === 'undefined' || !initializedRef.current) return;
    const url = new URL(window.location.href);
    const currentIdInUrl = url.searchParams.get('id') || url.searchParams.get('taskId');

    if (selectedTaskId && currentIdInUrl !== selectedTaskId) {
      url.searchParams.set('id', selectedTaskId);
      window.history.replaceState(null, '', url.toString());
    } else if (!selectedTaskId && currentIdInUrl) {
      url.searchParams.delete('id');
      url.searchParams.delete('taskId');
      const newPath = url.pathname + (url.search ? url.search : '');
      window.history.replaceState(null, '', newPath);
    }
  }, [selectedTaskId]);

  return null;
}

/**
 * Connects Reactour with TaskContext tutorial triggers and initial onboarding.
 */
function TourController() {
  const { isTutorialOpen, setIsTutorialOpen } = useTask();
  const { setIsOpen, setCurrentStep } = useTour();

  useEffect(() => {
    if (isTutorialOpen) {
      setCurrentStep(0);
      setIsOpen(true);
      setIsTutorialOpen(false);
    }
  }, [isTutorialOpen, setCurrentStep, setIsOpen, setIsTutorialOpen]);

  // Check if first-time visitor
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasCompleted = localStorage.getItem('taskly_reactour_completed');
      if (!hasCompleted) {
        const timer = setTimeout(() => {
          setCurrentStep(0);
          setIsOpen(true);
          localStorage.setItem('taskly_reactour_completed', 'true');
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [setCurrentStep, setIsOpen]);

  return null;
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const {
    selectedTaskId,
    setSelectedTaskId,
    toggleSidebar,
    setActiveView,
    setSearchQuery,
    isShortcutsOpen,
    setIsShortcutsOpen,
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    isRecommendationsOpen,
    setIsRecommendationsOpen,
    setIsTutorialOpen,
    isTaskModalOpen,
    setIsTaskModalOpen,
    isProjectModalOpen,
    setIsProjectModalOpen,
  } = useTask();
  const { toggleTheme } = useTheme();

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

      // 2. Global Search: Cmd + F or '/'
      if ((isCmdOrCtrl && e.key.toLowerCase() === 'f') || e.key === '/') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }

      // 3. Shortcuts Helper: '?' or Cmd + K or Cmd + '/'
      if (e.key === '?' || (isCmdOrCtrl && e.key.toLowerCase() === 'k') || (isCmdOrCtrl && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }

      // 4. New Task: 'C' or 'N' or Alt + N
      if ((!isCmdOrCtrl && !e.altKey && (e.key.toLowerCase() === 'c' || e.key.toLowerCase() === 'n')) || (e.altKey && e.key.toLowerCase() === 'n')) {
        e.preventDefault();
        setIsTaskModalOpen(true);
      }

      // 5. New Project: 'P' or Alt + P
      if ((!isCmdOrCtrl && !e.altKey && e.key.toLowerCase() === 'p') || (e.altKey && e.key.toLowerCase() === 'p')) {
        e.preventDefault();
        setIsProjectModalOpen(true);
      }

      // 6. Toggle Sidebar: '[' or Alt + B
      if (e.key === '[' || (e.altKey && e.key.toLowerCase() === 'b') || (isCmdOrCtrl && e.key.toLowerCase() === 'b')) {
        e.preventDefault();
        toggleSidebar();
      }

      // 7. Switch to Board View: 'B' or '1' or Alt + 1
      if ((!isCmdOrCtrl && (e.key.toLowerCase() === 'b' || e.key === '1')) || (e.altKey && e.key === '1')) {
        e.preventDefault();
        setActiveView('board');
      }

      // 8. Switch to List View: 'L' or '2' or Alt + 2
      if ((!isCmdOrCtrl && (e.key.toLowerCase() === 'l' || e.key === '2')) || (e.altKey && e.key === '2')) {
        e.preventDefault();
        setActiveView('list');
      }

      // 9. Toggle Dark/Light Theme: Alt + D or 'T'
      if ((e.altKey && e.key.toLowerCase() === 'd') || (!isCmdOrCtrl && !e.altKey && e.key.toLowerCase() === 't')) {
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
    isTaskModalOpen,
    isProjectModalOpen,
    isShortcutsOpen,
    setSelectedTaskId,
    setIsShortcutsOpen,
    setIsGlobalSearchOpen,
    setIsRecommendationsOpen,
    setIsTaskModalOpen,
    setIsProjectModalOpen,
    toggleSidebar,
    setActiveView,
    toggleTheme,
    setSearchQuery,
  ]);

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* URL Deep Link Synchronizer */}
      <Suspense fallback={null}>
        <UrlQueryParamSync />
      </Suspense>

      {/* Reactour Tour Controller */}
      <TourController />

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

      {/* First-Time Adaptive Theme Showcase Demo Popover */}
      <ThemeShowcaseModal />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TasklyTourProvider>
      <DashboardContent>{children}</DashboardContent>
    </TasklyTourProvider>
  );
}
