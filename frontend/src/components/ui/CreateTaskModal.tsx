'use client';

import React, { useState } from 'react';
import { X, Plus, Calendar, Tag, User, AlignLeft, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { TaskPriority, TaskStatus } from '../../types/task';
import { PRIORITY_OPTIONS, STATUS_COLUMNS } from '../../lib/constants';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const { createTask, activeProjectId } = useTask();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [priority, setPriority] = useState<TaskPriority>('High');
  const [assignee, setAssignee] = useState('Dexter');
  const [dueDate, setDueDate] = useState('29 Jul');
  const [labelInput, setLabelInput] = useState('');
  const [labels, setLabels] = useState<string[]>(['Deployment']);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAddLabel = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && labelInput.trim()) {
      e.preventDefault();
      if (!labels.includes(labelInput.trim())) {
        setLabels([...labels, labelInput.trim()]);
      }
      setLabelInput('');
    }
  };

  const handleRemoveLabel = (lbl: string) => {
    setLabels(labels.filter(l => l !== lbl));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assignee,
        dueDate,
        labels,
        team: 'Engineering',
        projectId: activeProjectId || undefined,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setStatus('To Do');
      setPriority('High');
      setLabels(['Deployment']);
      onClose();
    } catch (err) {
      console.error('Failed to create task', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Create New Task</h2>
              <p className="text-[11px] text-zinc-400">Add a ticket to the active sprint</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Implement Search Function"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-2xs transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add details, acceptance criteria, or context..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-2xs transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Status & Priority Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200/90 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 shadow-2xs"
              >
                {STATUS_COLUMNS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200/90 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 shadow-2xs"
              >
                {PRIORITY_OPTIONS.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Assignee</label>
              <select
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200/90 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 shadow-2xs"
              >
                <option value="Admin">Admin</option>
                <option value="Dexter">Dexter</option>
                <option value="QA Team">QA Team</option>
                <option value="Designer">Designer</option>
                <option value="Security">Security</option>
                <option value="Dev Team">Dev Team</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Due Date</label>
              <input
                type="text"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                placeholder="e.g. 29 Jul"
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200/90 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Labels */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Labels (Press Enter to add)</label>
            <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-zinc-200/90 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/40 min-h-[40px] items-center shadow-2xs">
              {labels.map(lbl => (
                <span
                  key={lbl}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 shadow-2xs"
                >
                  <span>{lbl}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLabel(lbl)}
                    className="text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={labelInput}
                onChange={e => setLabelInput(e.target.value)}
                onKeyDown={handleAddLabel}
                placeholder={labels.length === 0 ? "Type label and press Enter..." : ""}
                className="flex-1 bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none min-w-[100px] px-1"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="px-5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white shadow-xs active:scale-98 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Create Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
