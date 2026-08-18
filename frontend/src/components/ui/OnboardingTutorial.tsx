'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Kanban,
  ListFilter,
  CheckSquare,
  Palette,
  Command,
  Layers,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTask } from '../../context/TaskContext';
import { cn } from '../../lib/utils';

interface OnboardingTutorialProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({
  forceOpen = false,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { setActiveView } = useTask();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setCurrentStep(0);
      return;
    }

    if (typeof window !== 'undefined') {
      const hasCompleted = localStorage.getItem('taskly_tutorial_completed');
      if (!hasCompleted) {
        // Auto-show tutorial for first-time visitors after short initial delay
        const timer = setTimeout(() => setIsOpen(true), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [forceOpen]);

  const handleDismiss = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('taskly_tutorial_completed', 'true');
    }
    if (onClose) onClose();
  };

  const steps = [
    {
      title: 'Welcome to Taskly 👋',
      badge: 'Getting Started',
      icon: Sparkles,
      iconBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-500',
      description:
        'Your high-performance collaborative task workspace. Preloaded with Dexter’s project environment, ready for real-time task tracking.',
      highlights: [
        'Organized into To Do, Doing, Completed, and On Hold pipelines',
        'Built with Next.js 15 App Router & NestJS with MongoDB Atlas',
      ],
      action: null,
    },
    {
      title: 'Kanban Board & Drag-and-Drop 🖐️',
      badge: 'Board View',
      icon: Kanban,
      iconBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-500',
      description:
        'Easily organize workflow status. You can drag and drop any task card between columns or use the inline quick add at the bottom of each column.',
      highlights: [
        'Native HTML5 drag-and-drop with drop-zone highlight',
        'Card hover menus for 1-click status moves and quick deletion',
      ],
      action: () => setActiveView('board'),
    },
    {
      title: 'Grouped List & Field Controls 📋',
      badge: 'List & Fields',
      icon: ListFilter,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500',
      description:
        'Switch between Board and List view using the Fields dropdown in the header. Customize table column visibility to match your preferences.',
      highlights: [
        'Collapsible status groups with priority signal bars',
        'Toggle Priority, Assignees, Due Dates, and Labels on/off',
      ],
      action: () => setActiveView('list'),
    },
    {
      title: 'Subtasks, Comments & Rich Activity 💬',
      badge: 'Task Details',
      icon: CheckSquare,
      iconBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-500',
      description:
        'Click on any task card to open the Details Drawer. Manage subtask checklists, date range pickers, external resource links, and threaded discussions.',
      highlights: [
        'Interactive subtasks table with strikethrough checkboxes',
        'Real-time comment stream with emoji reactions (👍, ❤️, 🎉, 🚀)',
      ],
      action: null,
    },
    {
      title: 'Themes & 6 Color Mode Palettes 🎨',
      badge: 'Personalization',
      icon: Palette,
      iconBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-500',
      description:
        'Personalize your workspace aesthetic. Switch between Light Theme and Obsidian Dark Mode, and pick from 6 curated color modes.',
      highlights: [
        '6 Accent Modes: Amber, Blue, Pink, Rose, Emerald, and Black',
        'Settings profile editor with avatar and role management',
      ],
      action: null,
    },
    {
      title: 'Power Shortcuts & Fast Actions ⚡',
      badge: 'Pro Tips',
      icon: Command,
      iconBg: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
      description:
        'Navigate Taskly at lightspeed using universal keyboard shortcuts. Press Cmd + K or ? anytime to view the shortcut cheatsheet.',
      highlights: [
        'Esc: Dismiss any modal, drawer, or search bar instantly',
        'Cmd + N: Create new task | Cmd + F: Focus global search',
      ],
      action: null,
    },
  ];

  if (!isOpen) return null;

  const current = steps[currentStep];
  const IconComponent = current.icon;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (current.action) current.action();
    if (isLastStep) {
      handleDismiss();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
              {current.badge}
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1">
          <div
            className="bg-blue-600 h-1 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Main Step Content */}
        <div className="p-6 space-y-5">
          {/* Icon & Title */}
          <div className="flex items-start gap-4">
            <div className={cn('p-3 rounded-2xl shrink-0', current.iconBg)}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {current.title}
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {current.description}
              </p>
            </div>
          </div>

          {/* Highlights Box */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-4 space-y-2.5">
            {current.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="leading-snug">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Actions Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
          <button
            onClick={handleDismiss}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-medium transition-colors"
          >
            Skip Tutorial
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 shadow-xs transition-all"
            >
              <span>{isLastStep ? 'Get Started 🚀' : 'Next Step'}</span>
              {!isLastStep && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
