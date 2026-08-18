'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, X, AlertCircle, MessageSquare, PlusCircle } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../lib/utils';

export const NotificationsPopover: React.FC = () => {
  const { tasks, setSelectedTaskId } = useTask();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Derive notifications from actual task audit logs and comments
  const notifications = [
    {
      id: '1',
      title: 'Priority Escalation',
      description: 'Write API Documentation priority changed to Urgent',
      time: 'just now',
      taskId: tasks[0]?.id,
      type: 'priority',
    },
    {
      id: '2',
      title: 'New Comment',
      description: 'Ankit Dutta commented "dsds" on Write API Documentation',
      time: '12m ago',
      taskId: tasks[0]?.id,
      type: 'comment',
    },
    {
      id: '3',
      title: 'Task Assigned',
      description: 'You were assigned to Implement Search Function',
      time: '1h ago',
      taskId: tasks[1]?.id,
      type: 'assignment',
    },
  ];

  // Click outside & Escape dismiss
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleNotificationClick = (taskId?: string) => {
    if (taskId) {
      setSelectedTaskId(taskId);
      setIsOpen(false);
      if (unreadCount > 0) setUnreadCount(prev => prev - 1);
    }
  };

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 shadow-xs transition-colors relative active:scale-95"
        title="Notifications & Activity"
      >
        <Bell className="w-3.5 h-3.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-100"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-[10px] font-bold text-red-600 dark:text-red-400">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="p-1 rounded text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n.taskId)}
                className="p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer space-y-1 text-xs border border-transparent hover:border-zinc-200/60 dark:hover:border-zinc-700/60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                    {n.type === 'priority' && <AlertCircle className="w-3 h-3 text-red-500" />}
                    {n.type === 'comment' && <MessageSquare className="w-3 h-3 text-blue-500" />}
                    {n.type === 'assignment' && <PlusCircle className="w-3 h-3 text-emerald-500" />}
                    <span>{n.title}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">{n.time}</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                  {n.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
