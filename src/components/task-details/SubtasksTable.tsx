'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Plus,
  MoreHorizontal,
  Trash2,
  CheckCircle2,
  Circle,
  X,
  Check,
  Calendar,
  User,
  Edit2,
} from 'lucide-react';
import { Subtask, TaskPriority } from '../../types/task';
import { useTask } from '../../context/TaskContext';
import { PrioritySignal } from '../ui/PrioritySignal';
import { Avatar } from '../ui/Avatar';
import { PRIORITY_OPTIONS, AVAILABLE_MEMBERS } from '../../lib/constants';
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
  const [newAssignee, setNewAssignee] = useState('Dexter');

  // Active action menu per subtask
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  // Escape key & Click-outside isolation for subtasks actions menu and editing
  useEffect(() => {
    if (!openActionId && !isAdding && !editingSubtaskId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        setOpenActionId(null);
        setIsAdding(false);
        setEditingSubtaskId(null);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenActionId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActionId, isAdding, editingSubtaskId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await addSubtask(taskId, newTitle.trim(), newPriority, newDueDate);
    setNewTitle('');
    setIsAdding(false);
  };

  const handleSaveEdit = async (subtaskId: string) => {
    if (editingTitle.trim()) {
      await updateSubtask(taskId, subtaskId, { title: editingTitle.trim() });
    }
    setEditingSubtaskId(null);
  };

  return (
    <div className="space-y-2">
      {/* Subtasks Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          <span>Subtasks</span>
          <span className="text-[11px] font-normal text-zinc-400 ml-1">({subtasks.length})</span>
        </div>
      </div>

      {/* Subtasks Table matching Figma Screenshot 06 */}
      <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-visible bg-white dark:bg-zinc-900/60 shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 bg-zinc-50/60 dark:bg-zinc-800/40 rounded-t-2xl">
              <th className="py-2.5 px-3.5">Task</th>
              <th className="py-2.5 px-3 w-32">Priority</th>
              <th className="py-2.5 px-3 w-28">Members</th>
              <th className="py-2.5 px-3 w-32">Due Date</th>
              <th className="py-2.5 px-3.5 w-12 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subtasks.map((subtask, idx) => {
              const isActionOpen = openActionId === subtask.id;
              const isEditing = editingSubtaskId === subtask.id;
              const isNearBottom = idx >= Math.max(1, subtasks.length - 2);

              return (
                <tr
                  key={subtask.id}
                  className="border-b border-zinc-100/70 dark:border-zinc-800/60 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group"
                >
                  {/* Task Title & Checkbox */}
                  <td className="py-2.5 px-3.5 font-medium text-zinc-800 dark:text-zinc-200">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => updateSubtask(taskId, subtask.id, { completed: !subtask.completed })}
                        className="text-zinc-400 hover:text-emerald-500 transition-colors shrink-0"
                        title={subtask.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {subtask.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 hover:stroke-zinc-600" />
                        )}
                      </button>

                      {isEditing ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <input
                            type="text"
                            autoFocus
                            value={editingTitle}
                            onChange={e => setEditingTitle(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveEdit(subtask.id);
                              if (e.key === 'Escape') setEditingSubtaskId(null);
                            }}
                            onBlur={() => handleSaveEdit(subtask.id)}
                            className="w-full px-2 py-0.5 text-xs rounded border border-blue-400 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <span
                          onClick={() => {
                            setEditingSubtaskId(subtask.id);
                            setEditingTitle(subtask.title);
                          }}
                          className={cn(
                            'cursor-text hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors',
                            subtask.completed && 'line-through text-zinc-400 dark:text-zinc-500'
                          )}
                        >
                          {subtask.title}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Priority Signal */}
                  <td className="py-2.5 px-3">
                    <PrioritySignal priority={subtask.priority || 'High'} />
                  </td>

                  {/* Members Avatar / Badge / Plus Button */}
                  <td className="py-2.5 px-3">
                    {subtask.assignee ? (
                      subtask.assignee === 'CN' ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-white text-[10px] font-bold">
                          CN
                        </span>
                      ) : (
                        <Avatar
                          name={subtask.assignee}
                          size="sm"
                          src={subtask.assigneeAvatar}
                        />
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => updateSubtask(taskId, subtask.id, { assignee: 'Dexter' })}
                        className="w-5 h-5 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:border-zinc-400 transition-colors"
                        title="Assign member"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    )}
                  </td>

                  {/* Due Date */}
                  <td className="py-2.5 px-3 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                    {subtask.dueDate || '12 Sep 2026'}
                  </td>

                  {/* Actions '···' matching Figma Screenshot 06 */}
                  <td className="py-2.5 px-3.5 text-right relative">
                    <button
                      type="button"
                      onClick={() => setOpenActionId(isActionOpen ? null : subtask.id)}
                      className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                      title="Actions"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Subtask Action Menu Popover */}
                    {isActionOpen && (
                      <div
                        ref={menuRef}
                        className={cn(
                          'absolute right-3 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-left',
                          isNearBottom ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                        )}
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            updateSubtask(taskId, subtask.id, { completed: !subtask.completed });
                            setOpenActionId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{subtask.completed ? 'Mark Incomplete' : 'Mark Complete'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingSubtaskId(subtask.id);
                            setEditingTitle(subtask.title);
                            setOpenActionId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Rename Subtask</span>
                        </button>

                        <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                        <div className="px-3 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                          Priority
                        </div>
                        {PRIORITY_OPTIONS.slice(1).map(p => (
                          <button
                            type="button"
                            key={p.id}
                            onClick={() => {
                              updateSubtask(taskId, subtask.id, { priority: p.id as TaskPriority });
                              setOpenActionId(null);
                            }}
                            className="w-full flex items-center justify-between px-3 py-1 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                          >
                            <PrioritySignal priority={p.id} />
                            {subtask.priority === p.id && <Check className="w-3 h-3 text-zinc-900 dark:text-zinc-100" />}
                          </button>
                        ))}

                        <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                        <button
                          type="button"
                          onClick={() => {
                            deleteSubtask(taskId, subtask.id);
                            setOpenActionId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          <span>Delete Subtask</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {/* Inline Add Subtask */}
            {isAdding ? (
              <tr className="bg-blue-50/40 dark:bg-blue-950/20">
                <td colSpan={5} className="p-2.5">
                  <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="Subtask title..."
                      className="flex-1 min-w-[160px] text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                    />
                    <select
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value as TaskPriority)}
                      className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-zinc-800 dark:text-zinc-200"
                    >
                      {PRIORITY_OPTIONS.map(p => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newDueDate}
                      onChange={e => setNewDueDate(e.target.value)}
                      placeholder="Due date (e.g. 18 Sep 2026)"
                      className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 w-28 text-zinc-800 dark:text-zinc-200"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        type="submit"
                        disabled={!newTitle.trim()}
                        className="px-3 py-1 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={5} className="py-2.5 px-3.5">
                  <button
                    type="button"
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

