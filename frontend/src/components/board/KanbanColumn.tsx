'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  GripVertical,
  Plus,
  MoreHorizontal,
  Check,
  X,
  ArrowUpDown,
  Calendar,
  AlertCircle,
  SortAsc,
} from 'lucide-react';
import { Task, TaskStatus } from '../../types/task';
import { TaskCard } from './TaskCard';
import { useTask } from '../../context/TaskContext';
import { cn } from '../../lib/utils';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks }) => {
  const { createTask, reorderTask, sortColumn } = useTask();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isOver, setIsOver] = useState(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const columnMenuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside or escape
  useEffect(() => {
    if (!showColumnMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(e.target as Node)) {
        setShowColumnMenu(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowColumnMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showColumnMenu]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await createTask({
      title: newTitle.trim(),
      status,
      priority: 'High',
      assignee: 'Admin',
      dueDate: '29 Jul',
      labels: ['Deployment'],
    });

    setNewTitle('');
    setIsAdding(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isOver) setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      // If dropped directly into column container, append at the end
      await reorderTask(taskId, status, tasks.length);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col bg-zinc-100/60 dark:bg-zinc-900/40 rounded-3xl border transition-all duration-150 p-3 min-w-[280px] max-w-[320px] shrink-0 h-full max-h-[calc(100vh-140px)]',
        isOver
          ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
          : 'border-zinc-200/60 dark:border-zinc-800/60'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-1 py-1.5 mb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="w-3.5 h-3.5 text-zinc-400 cursor-grab" />
          <h2 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
            {status}
          </h2>
          <span className="px-1.5 py-0.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1 relative" ref={columnMenuRef}>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            title="Add task in this column"
            className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            title="Sort & Column options"
            className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Column Sort & Options Menu */}
          {showColumnMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-2 py-1 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Sort Column
                </span>
                <button
                  type="button"
                  onClick={() => setShowColumnMenu(false)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await sortColumn(status, 'priority', 'asc');
                  setShowColumnMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                <span>By Priority (Urgent First)</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await sortColumn(status, 'dueDate', 'asc');
                  setShowColumnMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>By Due Date</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await sortColumn(status, 'title', 'asc');
                  setShowColumnMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
              >
                <SortAsc className="w-3.5 h-3.5 text-emerald-500" />
                <span>By Title (A to Z)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Column Cards Container (Scrollable & Drop Target) */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2">
        {/* Quick Add Inline Form */}
        {isAdding && (
          <form onSubmit={handleCreateTask} className="bg-white dark:bg-zinc-900 border border-blue-400 dark:border-blue-500 rounded-2xl p-3 shadow-sm space-y-2">
            <input
              type="text"
              autoFocus
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full text-xs bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewTitle('');
                }}
                className="p-1 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90"
              >
                Add
              </button>
            </div>
          </form>
        )}

        {/* Task Cards in Sequence */}
        {tasks.map((task, idx) => (
          <TaskCard
            key={task.id}
            task={task}
            index={idx}
          />
        ))}

        {/* Empty Drop Zone when column has no tasks */}
        {tasks.length === 0 && !isAdding && (
          <div className="h-28 border-2 border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-2xl flex flex-col items-center justify-center p-3 text-center text-zinc-400 text-xs">
            <span>Drag tickets here</span>
          </div>
        )}
      </div>

      {/* Bottom Add Task Button */}
      {!isAdding && (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      )}
    </div>
  );
};
