'use client';

import React, { useState } from 'react';
import { X, Plus, Calendar, Tag, User, AlignLeft, AlertCircle, Loader2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-500" />
            <span>Create New Task</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Title */}
          <div className="space-y-1">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">Task Title *</label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Implement Real-Time Collaboration"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add details, acceptance criteria, or context..."
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          {/* Status & Priority Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-zinc-700 dark:text-zinc-300">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              >
                {STATUS_COLUMNS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-zinc-700 dark:text-zinc-300">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              >
                {PRIORITY_OPTIONS.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-zinc-700 dark:text-zinc-300">Assignee</label>
              <select
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              >
                <option value="Admin">Admin</option>
                <option value="Dexter">Dexter</option>
                <option value="QA Team">QA Team</option>
                <option value="Designer">Designer</option>
                <option value="Security">Security</option>
                <option value="Dev Team">Dev Team</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-zinc-700 dark:text-zinc-300">Due Date</label>
              <input
                type="text"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                placeholder="e.g. 29 Jul or 12 Sep 2026"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Labels */}
          <div className="space-y-1.5">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">Labels (Press Enter)</label>
            <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 min-h-[38px] items-center">
              {labels.map(lbl => (
                <span
                  key={lbl}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-[11px] font-medium"
                >
                  <span>{lbl}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLabel(lbl)}
                    className="text-zinc-400 hover:text-zinc-600"
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
                placeholder={labels.length === 0 ? "Type and press Enter..." : ""}
                className="flex-1 bg-transparent text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none min-w-[80px]"
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
              className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 disabled:opacity-50"
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
