'use client';

import React from 'react';
import { TourProvider, useTour, StepType } from '@reactour/tour';

export const TOUR_STEPS: StepType[] = [
  {
    selector: '[data-tour="workspace-sidebar"]',
    content: (
      <div className="space-y-1.5 p-1">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
          <span>📁 Workspace Navigation</span>
        </h4>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Navigate seamlessly between Tasks, Projects Directory, AI Recommendations, and Workspace Settings.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="kanban-board"]',
    content: (
      <div className="space-y-1.5 p-1">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
          <span>⚡ Kanban Sprint Pipelines</span>
        </h4>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Organize tickets across <b>To Do</b>, <b>Doing</b>, <b>Completed</b>, and <b>On Hold</b>. Reorder tasks with drag-and-drop or sort columns instantly.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="member-stack"]',
    content: (
      <div className="space-y-1.5 p-1">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
          <span>👥 Workspace Members Filter</span>
        </h4>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Click any team member avatar to filter the board to their assigned tasks. Click again to clear.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="header-search"]',
    content: (
      <div className="space-y-1.5 p-1">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
          <span>🔍 Global Multi-Attribute Search</span>
        </h4>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Press <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px] font-bold">⌘F</kbd> or <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px] font-bold">/</kbd> to find any task, subtask, or comment in milliseconds.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="header-shortcuts"]',
    content: (
      <div className="space-y-1.5 p-1">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
          <span>⌨️ Keyboard Shortcuts</span>
        </h4>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Press <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px] font-bold">?</kbd> or <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px] font-bold">⌘K</kbd> to inspect Linear-style single-key shortcuts (<kbd>C</kbd> new task, <kbd>B</kbd> board, <kbd>L</kbd> list).
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="header-add-task"]',
    content: (
      <div className="space-y-1.5 p-1">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
          <span>➕ Create Task</span>
        </h4>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Create tickets with rich descriptions, subtask checklists, and direct Cloudinary image uploads.
        </p>
      </div>
    ),
  },
];

export const TasklyTourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TourProvider
      steps={TOUR_STEPS}
      padding={{ mask: 6, popover: [12, 12] }}
      showDots={true}
      showBadge={true}
      showCloseButton={true}
      badgeContent={({ currentStep, totalSteps }) => `${currentStep + 1}/${totalSteps}`}
      styles={{
        popover: (base) => ({
          ...base,
          backgroundColor: 'var(--card-bg, #ffffff)',
          color: 'var(--foreground, #18181b)',
          borderRadius: '1.25rem',
          boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.08)',
          padding: '1.25rem',
          maxWidth: '360px',
        }),
        maskArea: (base) => ({
          ...base,
          rx: 16,
        }),
        maskWrapper: (base) => ({
          ...base,
          color: 'rgba(0, 0, 0, 0.65)',
        }),
        badge: (base) => ({
          ...base,
          backgroundColor: 'var(--primary, #3b82f6)',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '11px',
          borderRadius: '9999px',
          padding: '2px 8px',
        }),
        controls: (base) => ({
          ...base,
          marginTop: '1rem',
        }),
        button: (base) => ({
          ...base,
          cursor: 'pointer',
        }),
        dot: (base, state?: { current?: boolean }) => ({
          ...base,
          backgroundColor: state?.current ? 'var(--primary, #3b82f6)' : 'rgba(156, 163, 175, 0.4)',
          width: state?.current ? 16 : 6,
          height: 6,
          borderRadius: 9999,
          transition: 'all 0.2s ease',
        }),
      }}
    >
      {children}
    </TourProvider>
  );
};

export { useTour };
