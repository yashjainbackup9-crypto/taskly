'use client';

import React from 'react';
import { X, Keyboard, Sparkles } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'Task & Project Actions',
      shortcuts: [
        { keys: ['C'], label: 'Create New Task (or N / Alt+N)' },
        { keys: ['P'], label: 'Create New Project (or Alt+P)' },
        { keys: ['⌘', 'K'], label: 'Global Search / Command Menu' },
        { keys: ['?'], label: 'Open Shortcuts Cheatsheet' },
        { keys: ['Esc'], label: 'Close Any Popup / Modal / Drawer' },
      ],
    },
    {
      title: 'Navigation & Views',
      shortcuts: [
        { keys: ['B'], label: 'Switch to Board View (or 1)' },
        { keys: ['L'], label: 'Switch to List View (or 2)' },
        { keys: ['['], label: 'Toggle Sidebar (or Alt+B)' },
        { keys: ['/'], label: 'Quick Filter / Search' },
        { keys: ['Alt', 'D'], label: 'Toggle Light / Dark Mode' },
      ],
    },
    {
      title: 'Board Card Reordering',
      shortcuts: [
        { keys: ['Alt', '↑'], label: 'Move Task Card Up in Sequence' },
        { keys: ['Alt', '↓'], label: 'Move Task Card Down in Sequence' },
      ],
    },
    {
      title: 'Inside Task Details & Editor',
      shortcuts: [
        { keys: ['⌘', 'Enter'], label: 'Submit / Save Changes' },
        { keys: ['⌘', 'B'], label: 'Bold Text Formatting' },
        { keys: ['⌘', 'I'], label: 'Italic Text Formatting' },
        { keys: ['Esc'], label: 'Close Task Details Drawer' },
      ],
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Keyboard Shortcuts</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {shortcutGroups.map(group => (
            <div key={group.title} className="space-y-2">
              <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                {group.title}
              </h3>
              <div className="space-y-1.5">
                {group.shortcuts.map((sc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1 px-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-xs transition-colors"
                  >
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{sc.label}</span>
                    <div className="flex items-center gap-1">
                      {sc.keys.map(k => (
                        <kbd
                          key={k}
                          className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-mono text-[10px] font-bold shadow-2xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 text-center">
          <p className="text-[11px] text-zinc-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">Esc</kbd> anytime to dismiss active windows
          </p>
        </div>
      </div>
    </div>
  );
};
