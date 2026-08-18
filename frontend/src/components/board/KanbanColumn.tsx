'use client';

import React, { useState } from 'react';
import { GripVertical, Plus, MoreHorizontal, Check, X } from 'lucide-react';
import { Task, TaskStatus } from '../../types/task';
import { TaskCard } from './TaskCard';
import { useTask } from '../../context/TaskContext';
import { cn } from '../../lib/utils';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks }) => {
  const { createTask, moveTaskStatus } = useTask();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isOver, setIsOver] = useState(false);

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
      await moveTaskStatus(taskId, status);
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

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsAdding(true)}
            title="Add task in this column"
            className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            title="Column options"
            className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
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
                disabled={!newTitle.trim()}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </form>
        )}

        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && !isAdding && (
          <div className="h-24 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-[11px] text-zinc-400">
            Drop tasks here
          </div>
        )}
      </div>

      {/* Bottom "+ Add Task" Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-2 flex items-center justify-center gap-1.5 py-2 w-full rounded-xl text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      )}
    </div>
  );
};
