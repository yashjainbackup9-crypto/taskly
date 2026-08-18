'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DatePickerPopoverProps {
  startDate?: string;
  dueDate?: string;
  onSelectDate: (startDate: string, dueDate: string) => void;
}

export const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({
  startDate = 'Jan 10',
  dueDate = '31 Jul',
  onSelectDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('January');
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(10);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  // January 2026 starts on Thursday (index 4)
  const daysInMonth = [
    { day: 30, prevMonth: true },
    { day: 31, prevMonth: true },
    { day: 1, current: true },
    { day: 2, current: true },
    { day: 3, current: true },
    { day: 4, current: true },
    { day: 5, current: true },
    { day: 6, current: true },
    { day: 7, current: true },
    { day: 8, current: true },
    { day: 9, current: true },
    { day: 10, current: true, active: true },
    { day: 11, current: true },
    { day: 12, current: true },
    { day: 13, current: true },
    { day: 14, current: true },
    { day: 15, current: true },
    { day: 16, current: true },
    { day: 17, current: true },
    { day: 18, current: true },
    { day: 19, current: true },
    { day: 20, current: true },
    { day: 21, current: true },
    { day: 22, current: true },
    { day: 23, current: true },
    { day: 24, current: true },
    { day: 25, current: true },
    { day: 26, current: true },
    { day: 27, current: true },
    { day: 28, current: true },
    { day: 29, current: true },
    { day: 30, current: true },
    { day: 31, current: true },
    { day: 1, nextMonth: true },
    { day: 2, nextMonth: true },
    { day: 3, nextMonth: true },
  ];

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    const formatted = `${day} ${currentMonth.substring(0, 3)} ${currentYear}`;
    onSelectDate(`Jan ${day}`, formatted);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Date Pill Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
      >
        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
        <span>{startDate || 'Jan 10'}</span>
        <span className="text-zinc-400">➔</span>
        <span>{dueDate || 'End'}</span>
      </button>

      {/* Popover Calendar Modal */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/80 dark:border-zinc-800 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              onClick={() => setCurrentYear(y => y - 1)}
              className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {currentMonth} {currentYear}
            </span>
            <button
              onClick={() => setCurrentYear(y => y + 1)}
              className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center mb-1.5">
            {daysOfWeek.map(d => (
              <span key={d} className="text-[11px] font-medium text-zinc-400">
                {d}
              </span>
            ))}
          </div>

          {/* Day Numbers Matrix */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {daysInMonth.map((item, index) => {
              const isSelected = item.current && item.day === selectedDay;
              const isFaded = item.prevMonth || item.nextMonth;

              return (
                <button
                  key={index}
                  onClick={() => item.current && handleDayClick(item.day)}
                  disabled={isFaded}
                  className={cn(
                    'h-7 w-7 rounded-full text-xs flex items-center justify-center transition-all mx-auto',
                    isFaded && 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed',
                    item.current && !isSelected && 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800',
                    isSelected && 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold shadow-xs'
                  )}
                >
                  {item.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
