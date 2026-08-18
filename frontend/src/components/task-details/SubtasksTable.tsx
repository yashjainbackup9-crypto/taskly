'use client';

import React, { useState } from 'react';
import { ChevronDown, Plus, MoreHorizontal, Trash2, CheckCircle2, Circle, X } from 'lucide-react';
import { Subtask, TaskPriority } from '../../types/task';
import { useTask } from '../../context/TaskContext';
import { PrioritySignal } from '../ui/PrioritySignal';
import { Avatar } from '../ui/Avatar';
import { PRIORITY_OPTIONS } from '../../lib/constants';
import { cn } from '../../lib/utils';

interface SubtasksTableProps {
  taskId: string;
  subtasks: Subtask[];
}

export const SubtasksTable: React.FC<SubtasksTableProps> = ({ taskId, subtasks = [] }) => {
  const { addSubtask, updateSubtask, deleteSubtask } = useTask();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('High');
  const [newDueDate, setNewDueDate] = useState('12 Sep 2026');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await addSubtask(taskId, newTitle.trim(), newPriority, newDueDate);
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-2">
      {/* Subtasks Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          <ChevronDown className="w-4 h-4 text-zinc-400" />
          <span>Subtasks</span>
        </div>
      </div>

      {/* Subtasks Table */}
      <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/60 shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 bg-zinc-50/50 dark:bg-zinc-800/30">
              <th className="py-2 px-3">Task</th>
              <th className="py-2 px-3 w-28">Priority</th>
              <th className="py-2 px-3 w-24">Members</th>
              <th className="py-2 px-3 w-28">Due Date</th>
              <th className="py-2 px-3 w-12 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subtasks.map(subtask => (
              <tr
                key={subtask.id}
                className="border-b border-zinc-100/70 dark:border-zinc-800/60 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <td className="py-2 px-3 font-medium text-zinc-800 dark:text-zinc-200">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateSubtask(taskId, subtask.id, { completed: !subtask.completed })}
                      className="text-zinc-400 hover:text-emerald-500 transition-colors"
                    >
                      {subtask.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Circle className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className={cn(subtask.completed && 'line-through text-zinc-400')}>
                      {subtask.title}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-3">
                  <PrioritySignal priority={subtask.priority} />
                </td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1">
                    <Avatar name={subtask.assignee || 'Dexter'} size="sm" src={subtask.assigneeAvatar} />
                  </div>
                </td>
                <td className="py-2 px-3 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                  {subtask.dueDate || '12 Sep 2026'}
                </td>
                <td className="py-2 px-3 text-right">
                  <button
                    onClick={() => deleteSubtask(taskId, subtask.id)}
                    className="p-1 text-zinc-400 hover:text-red-500 rounded"
                    title="Delete subtask"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}

            {/* Inline Add Subtask */}
            {isAdding ? (
              <tr className="bg-blue-50/40 dark:bg-blue-950/20">
                <td colSpan={5} className="p-2">
                  <form onSubmit={handleAdd} className="flex items-center gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="Subtask title..."
                      className="flex-1 text-xs bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none px-2"
                    />
                    <select
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value as TaskPriority)}
                      className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5"
                    >
                      {PRIORITY_OPTIONS.map(p => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
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
                      className="px-2.5 py-0.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold"
                    >
                      Add
                    </button>
                  </form>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={5} className="py-2 px-3">
                  <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Subtasks</span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
