'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, X } from 'lucide-react';
import { Task, TaskStatus } from '../../types/task';
import { TaskRow } from './TaskRow';
import { useTask } from '../../context/TaskContext';

interface GroupSectionProps {
  status: TaskStatus;
  tasks: Task[];
}

export const GroupSection: React.FC<GroupSectionProps> = ({ status, tasks }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const { createTask, visibleFields } = useTask();

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await createTask({
      title: newTitle.trim(),
      status,
      priority: 'High',
      assignee: 'Dexter',
      dueDate: '12 Sep 2026',
      labels: ['Deployment'],
    });

    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="mb-6 bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-xs">
      {/* Group Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-zinc-50/70 dark:bg-zinc-800/40 border-b border-zinc-200/60 dark:border-zinc-800/60 cursor-pointer select-none"
      >
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        )}
        <h2 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
          {status}
        </h2>
        <span className="px-1.5 py-0.2 rounded-full bg-zinc-200/80 dark:bg-zinc-700 text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
          {tasks.length}
        </span>
      </div>

      {/* Table Content */}
      {isOpen && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
                <th className="py-2.5 px-4">Task</th>
                {visibleFields.priority && <th className="py-2.5 px-4 w-32">Priority</th>}
                {visibleFields.members && <th className="py-2.5 px-4 w-28">Members</th>}
                {visibleFields.dueDate && <th className="py-2.5 px-4 w-36">Due Date</th>}
                <th className="py-2.5 px-4 w-16 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <TaskRow key={task.id} task={task} />
              ))}

              {/* Inline Add Task Row */}
              {isAdding ? (
                <tr className="border-t border-zinc-100 dark:border-zinc-800 bg-blue-50/30 dark:bg-blue-950/20">
                  <td colSpan={5} className="p-2">
                    <form onSubmit={handleCreateTask} className="flex items-center gap-2 px-2">
                      <input
                        type="text"
                        autoFocus
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        placeholder="Task title..."
                        className="flex-1 text-xs bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className="p-1 text-zinc-400 hover:text-zinc-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="submit"
                        disabled={!newTitle.trim()}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 disabled:opacity-50"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={5} className="py-2.5 px-4">
                    <button
                      onClick={() => setIsAdding(true)}
                      className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Task</span>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
