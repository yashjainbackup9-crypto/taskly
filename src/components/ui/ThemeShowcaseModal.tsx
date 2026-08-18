'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles, X, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Link from 'next/link';

export const ThemeShowcaseModal: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if showcase has already been shown in this browser session
    const hasShown = localStorage.getItem('taskly_theme_showcase_done');
    if (hasShown) return;

    // Start demo after a short delay so user sees the initial UI
    const timer = setTimeout(() => {
      setIsVisible(true);
      const initialTheme = (localStorage.getItem('taskly_theme') as 'light' | 'dark') || theme;

      // Phase 1: Toggle to Light (1.2s)
      setTimeout(() => {
        setTheme('light');
        setStep(1);
      }, 1200);

      // Phase 2: Toggle to Dark (2.7s)
      setTimeout(() => {
        setTheme('dark');
        setStep(2);
      }, 2700);

      // Phase 3: Restore Preferred Theme & Finish (4.2s)
      setTimeout(() => {
        setTheme(initialTheme);
        setStep(3);
      }, 4200);

      // Auto-Close after 5.4s
      setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem('taskly_theme_showcase_done', 'true');
      }, 5400);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Progress Bar Animation
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 100);
    return () => clearInterval(interval);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('taskly_theme_showcase_done', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 p-4 text-zinc-900 dark:text-zinc-100 animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5 dark:ring-white/10">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>Smart Theme Preview</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[9px] font-bold text-blue-600 dark:text-blue-400">
                Auto Demo
              </span>
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Dynamic Status Pill */}
      <div className="my-2.5 p-2.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {step === 1 ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 animate-in zoom-in-95">
              <Sun className="w-4 h-4 animate-spin duration-1000" />
              <span>☀️ Previewing Light Mode</span>
            </div>
          ) : step === 2 ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 animate-in zoom-in-95">
              <Moon className="w-4 h-4" />
              <span>🌙 Previewing Dark Mode</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Restoring your preferences...</span>
            </div>
          )}
        </div>
        <span className="text-[10px] font-mono text-zinc-400">
          {step === 0 ? 'Starting...' : `${step}/3`}
        </span>
      </div>

      <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
        Taskly supports instant dark & light mode adaptation. You can toggle this anytime using the <b>Header Sun/Moon icon</b> or customize accents in{' '}
        <Link
          href="/settings"
          onClick={handleClose}
          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
        >
          <Settings className="w-2.5 h-2.5" /> Settings
        </Link>.
      </p>

      {/* Progress Bar & Actions */}
      <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
        <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="px-2.5 py-1 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold hover:opacity-90 transition-all shrink-0"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
