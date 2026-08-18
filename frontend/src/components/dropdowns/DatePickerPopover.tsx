'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DatePickerPopoverProps {
  startDate?: string;
  dueDate?: string;
  onSelectDate: (startDate: string, dueDate: string) => void;
  align?: 'left' | 'right';
  className?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({
  startDate = 'Jan 10',
  dueDate = '31 Jul',
  onSelectDate,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState<'due' | 'start'>('due');
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0 = Jan (2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState<number>(10);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Parse existing date to initialize selected day if possible
  useEffect(() => {
    const targetDateStr = activeTarget === 'due' ? dueDate : startDate;
    if (targetDateStr) {
      const match = targetDateStr.match(/\b(\d{1,2})\b/);
      if (match) {
        setSelectedDay(parseInt(match[1], 10));
      }
    }
  }, [activeTarget, dueDate, startDate]);

  // Escape key capture and click-outside dismissal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonthIndex(m => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonthIndex(m => m + 1);
    }
  };

  // Generate calendar grid
  const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay();
  const daysInCurrentMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonthIndex, 0).getDate();

  const days: { day: number; isCurrent: boolean; isPrev?: boolean; isNext?: boolean }[] = [];

  // Trailing previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, isCurrent: false, isPrev: true });
  }

  // Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    days.push({ day: d, isCurrent: true });
  }

  // Leading next month days to fill standard 35 or 42 grid cells
  const totalCells = days.length > 35 ? 42 : 35;
  const remaining = totalCells - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({ day: d, isCurrent: false, isNext: true });
  }

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    const monthShort = MONTHS[currentMonthIndex].substring(0, 3);
    const formatted = `${day} ${monthShort} ${currentYear}`;

    if (activeTarget === 'due') {
      onSelectDate(startDate || `Jan 10`, formatted);
    } else {
      onSelectDate(formatted, dueDate || `31 Jul 2026`);
    }
  };

  const handleQuickPreset = (preset: 'today' | 'tomorrow' | 'nextWeek' | 'endOfMonth') => {
    const now = new Date(2026, 0, 10); // Standard demo date or current
    let target = new Date(now);

    if (preset === 'today') {
      // 10 Jan
    } else if (preset === 'tomorrow') {
      target.setDate(target.getDate() + 1);
    } else if (preset === 'nextWeek') {
      target.setDate(target.getDate() + 7);
    } else if (preset === 'endOfMonth') {
      target = new Date(2026, 0, 31);
    }

    const monthShort = MONTHS[target.getMonth()].substring(0, 3);
    const formatted = `${target.getDate()} ${monthShort} ${target.getFullYear()}`;
    setCurrentMonthIndex(target.getMonth());
    setCurrentYear(target.getFullYear());
    setSelectedDay(target.getDate());

    if (activeTarget === 'due') {
      onSelectDate(startDate || 'Jan 10', formatted);
    } else {
      onSelectDate(formatted, dueDate || '31 Jul 2026');
    }
  };

  return (
    <div className={cn('relative inline-block', className)} ref={popoverRef}>
      {/* Date Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors shadow-xs"
      >
        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
        <span className="font-medium">{startDate || 'Jan 10'}</span>
        <span className="text-zinc-400 font-mono text-[10px]">➔</span>
        <span className="font-medium">{dueDate || 'End'}</span>
      </button>

      {/* Popover Calendar Modal (Positioned right-0 by default to prevent viewport/sidebar clipping) */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-1.5 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          onClick={e => e.stopPropagation()}
        >
          {/* Target Toggle Tabs (Start vs Due) */}
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 mb-3 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setActiveTarget('start')}
              className={cn(
                'flex-1 py-1 rounded-md transition-colors text-center',
                activeTarget === 'start'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              )}
            >
              Start: {startDate || 'Jan 10'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTarget('due')}
              className={cn(
                'flex-1 py-1 rounded-md transition-colors text-center',
                activeTarget === 'due'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              )}
            >
              Due: {dueDate || '31 Jul'}
            </button>
          </div>

          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between mb-2.5 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {MONTHS[currentMonthIndex]} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center mb-1">
            {DAYS_OF_WEEK.map(d => (
              <span key={d} className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                {d}
              </span>
            ))}
          </div>

          {/* Day Numbers Matrix */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((item, index) => {
              const isSelected = item.isCurrent && item.day === selectedDay;
              const isFaded = !item.isCurrent;

              return (
                <button
                  type="button"
                  key={index}
                  onClick={() => item.isCurrent && handleDaySelect(item.day)}
                  disabled={isFaded}
                  className={cn(
                    'h-7 w-7 rounded-full text-xs flex items-center justify-center transition-all mx-auto',
                    isFaded && 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed opacity-40',
                    item.isCurrent && !isSelected && 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium',
                    isSelected && 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold shadow-md scale-105 ring-2 ring-zinc-900/20 dark:ring-white/20'
                  )}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Quick Preset Actions */}
          <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500 font-medium">
            <button
              type="button"
              onClick={() => handleQuickPreset('today')}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('tomorrow')}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('nextWeek')}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              +1 Week
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('endOfMonth')}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Month End
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

