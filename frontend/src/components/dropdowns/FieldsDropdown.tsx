'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Columns3, List, LayoutGrid, Check } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { cn } from '../../lib/utils';

export const FieldsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { activeView, setActiveView, visibleFields, toggleFieldVisibility } = useTask();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fieldsList: { key: keyof typeof visibleFields; label: string }[] = [
    { key: 'priority', label: 'Priority' },
    { key: 'members', label: 'Members' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'labels', label: 'Labels' },
    { key: 'status', label: 'Status' },
    { key: 'reporter', label: 'Reporter' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 shadow-xs transition-colors"
      >
        <Columns3 className="w-3.5 h-3.5 text-zinc-500" />
        <span>Fields</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200/80 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* View Switcher Toggle */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl mb-3">
            <button
              onClick={() => setActiveView('list')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all',
                activeView === 'list'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              )}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setActiveView('board')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all',
                activeView === 'board'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
          </div>

          {/* Field Checkboxes */}
          <div className="space-y-1">
            {fieldsList.map(({ key, label }) => {
              const isChecked = visibleFields[key];
              return (
                <button
                  key={key}
                  onClick={() => toggleFieldVisibility(key)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-lg transition-colors"
                >
                  <span>{label}</span>
                  <div
                    className={cn(
                      'w-4 h-4 rounded flex items-center justify-center border transition-colors',
                      isChecked
                        ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900'
                        : 'border-zinc-300 dark:border-zinc-700 bg-transparent'
                    )}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
