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
  CheckCircle2,
  ArrowRight,
  Trash2,
  Layers,
  Crown,
} from 'lucide-react';
import { Task, TaskStatus } from '../../types/task';
import { TaskCard } from './TaskCard';
import { useTask } from '../../context/TaskContext';
import { STATUS_COLUMNS } from '../../lib/constants';
import { cn } from '../../lib/utils';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks }) => {
  const {
    createTask,
    reorderTask,
    sortColumn,
    moveTaskStatus,
    deleteTask,
    isAdminMode,
    toggleAdminMode,
  } = useTask();
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

  const handleMoveAllTo = async (targetStatus: TaskStatus) => {
    for (const task of tasks) {
      await moveTaskStatus(task.id, targetStatus);
    }
    setShowColumnMenu(false);
  };

  const handleClearAll = async () => {
    for (const task of tasks) {
      await deleteTask(task.id);
    }
    setShowColumnMenu(false);
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
      <div className="flex items-center justify-between px-1 py-1.5 mb-2 relative z-20">
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
          {/* Quick Add Button */}
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            title="Add task in this column"
            className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Column More Options Trigger */}
          <button
            type="button"
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            title="Column actions & sorting"
            className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Full-Featured Column Menu Popover */}
          {showColumnMenu && (
            <div
              className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-2 py-1 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {status} Column
                  </span>
                  {isAdminMode && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                      <Crown className="w-2.5 h-2.5" /> Admin
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowColumnMenu(false)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Add Task Action */}
              <button
                type="button"
                onClick={() => {
                  setIsAdding(true);
                  setShowColumnMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
              >
                <Plus className="w-3.5 h-3.5 text-zinc-500" />
                <span>Add New Task</span>
              </button>

              <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

              {/* Sorting Section */}
              <div className="px-2.5 py-0.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Sort Column
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
                <span>By Priority (Urgent first)</span>
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

              {tasks.length > 0 && (
                <>
                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                  {/* Move All Tasks Section */}
                  <div className="px-2.5 py-0.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Move All ({tasks.length})
                  </div>
                  {STATUS_COLUMNS.filter(s => s !== status).map(targetCol => (
                    <button
                      key={targetCol}
                      type="button"
                      onClick={() => handleMoveAllTo(targetCol as TaskStatus)}
                      className="w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                    >
                      <span>Move to {targetCol}</span>
                      <ArrowRight className="w-3 h-3 text-zinc-400" />
                    </button>
                  ))}

                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                  {/* Clear Tasks in Column */}
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    <span>Clear All Tasks</span>
                  </button>
                </>
              )}
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

        {/* Task Cards */}
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
          />
        ))}

        {/* Inline Add Task Trigger Button for Admins */}
        {isAdminMode && !isAdding && tasks.length > 0 && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-all mt-1 group shrink-0"
          >
            <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-zinc-400" />
            <span>Add Task</span>
          </button>
        )}

        {/* Empty State in Column */}
        {tasks.length === 0 && !isAdding && (
          <div className="h-28 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-400 text-xs gap-1">
            <span>No tasks yet</span>
            {isAdminMode ? (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="text-blue-500 hover:underline font-medium"
              >
                + Add a task
              </button>
            ) : (
              <span className="text-[11px] text-zinc-400">Viewer Mode</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
