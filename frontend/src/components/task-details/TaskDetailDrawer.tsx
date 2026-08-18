'use client';

import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  Eye,
  Share2,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  Calendar,
  Plus,
  Paperclip,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Users,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { SubtasksTable } from './SubtasksTable';
import { CommentStream } from './CommentStream';
import { TaskMetadataSidebar } from './TaskMetadataSidebar';
import { Avatar } from '../ui/Avatar';
import { TagPill } from '../ui/TagPill';
import { DatePickerPopover } from '../dropdowns/DatePickerPopover';
import { cn } from '../../lib/utils';

export const TaskDetailDrawer: React.FC = () => {
  const { selectedTask, setSelectedTaskId, updateTask, deleteTask, createTask } = useTask();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(selectedTask?.title || '');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [desc, setDesc] = useState(selectedTask?.description || '');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);
  const [showAddLabel, setShowAddLabel] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [showAddResource, setShowAddResource] = useState(false);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resources, setResources] = useState<{ title: string; url: string }[]>([
    { title: 'Figma Design Spec', url: 'https://figma.com' },
  ]);

  if (!selectedTask) return null;

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title.trim() && title !== selectedTask.title) {
      updateTask(selectedTask.id, { title: title.trim() });
    }
  };

  const handleDescBlur = () => {
    setIsEditingDesc(false);
    if (desc !== selectedTask.description) {
      updateTask(selectedTask.id, { description: desc });
    }
  };

  const handleToggleLock = () => {
    updateTask(selectedTask.id, { isLocked: !selectedTask.isLocked });
  };

  const handleToggleWatch = () => {
    const current = selectedTask.watchers || 1;
    updateTask(selectedTask.id, { watchers: current > 1 ? current - 1 : current + 1 });
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/tasks?id=${selectedTask.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleDuplicateTask = async () => {
    await createTask({
      title: `${selectedTask.title} (Copy)`,
      description: selectedTask.description,
      status: selectedTask.status,
      priority: selectedTask.priority,
      assignee: selectedTask.assignee,
      dueDate: selectedTask.dueDate,
      labels: selectedTask.labels,
      team: selectedTask.team,
      projectId: selectedTask.projectId,
    });
    setShowMoreMenu(false);
  };

  const handleAssigneeSelect = (name: string) => {
    updateTask(selectedTask.id, { assignee: name });
    setShowAssigneePicker(false);
  };

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    const updated = [...(selectedTask.labels || []), newLabel.trim()];
    updateTask(selectedTask.id, { labels: updated });
    setNewLabel('');
    setShowAddLabel(false);
  };

  const handleRemoveLabel = (lbl: string) => {
    const updated = (selectedTask.labels || []).filter(l => l !== lbl);
    updateTask(selectedTask.id, { labels: updated });
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitle.trim()) return;
    setResources([...resources, { title: resourceTitle.trim(), url: resourceUrl.trim() || '#' }]);
    setResourceTitle('');
    setResourceUrl('');
    setShowAddResource(false);
  };

  const teamMembers = ['Admin', 'Dexter', 'QA Team', 'Designer', 'Security', 'Dev Team'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={cn(
          'bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200',
          isFullScreen ? 'w-full h-full rounded-none max-w-none' : 'w-full max-w-5xl h-[90vh] max-h-[850px]'
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Action Toolbar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedTaskId(null)}
              className="p-1.5 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-xs text-zinc-400 font-mono">Task Details</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Lock Button */}
            <button
              onClick={handleToggleLock}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                selectedTask.isLocked
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500'
              )}
              title={selectedTask.isLocked ? 'Task is locked (Click to unlock)' : 'Lock task'}
            >
              {selectedTask.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>

            {/* Watchers Button */}
            <button
              onClick={handleToggleWatch}
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs transition-colors"
              title="Toggle watching updates"
            >
              <Eye className="w-3.5 h-3.5 text-zinc-500" />
              <span>{selectedTask.watchers || 1}</span>
            </button>

            {/* Share Link Button */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors relative"
              title="Copy task link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-zinc-900 text-white text-[10px] whitespace-nowrap shadow-sm">
                  Copied!
                </span>
              )}
            </button>

            {/* More Options Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                title="More options"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-1 z-50">
                  <button
                    onClick={handleDuplicateTask}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left"
                  >
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Duplicate Task</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedTask.id);
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left"
                  >
                    <span className="font-mono text-[10px]">#</span>
                    <span>Copy Task ID</span>
                  </button>
                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
                  <button
                    onClick={() => {
                      deleteTask(selectedTask.id);
                      setSelectedTaskId(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    <span>Delete Task</span>
                  </button>
                </div>
              )}
            </div>

            {/* Split / Maximize View */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
              title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left / Center Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div>
              {isEditingTitle ? (
                <input
                  type="text"
                  autoFocus
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  onKeyDown={e => e.key === 'Enter' && handleTitleBlur()}
                  className="w-full text-xl font-bold bg-transparent border-b border-blue-500 focus:outline-none text-zinc-900 dark:text-zinc-100"
                />
              ) : (
                <h2
                  onClick={() => {
                    setTitle(selectedTask.title);
                    setIsEditingTitle(true);
                  }}
                  className="text-xl font-bold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 p-1 -ml-1 rounded-lg cursor-text transition-colors"
                >
                  {selectedTask.title}
                </h2>
              )}
            </div>

            {/* Description */}
            <div>
              {isEditingDesc ? (
                <textarea
                  autoFocus
                  rows={3}
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  onBlur={handleDescBlur}
                  className="w-full text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-blue-400 focus:outline-none resize-none"
                />
              ) : (
                <p
                  onClick={() => {
                    setDesc(selectedTask.description || '');
                    setIsEditingDesc(true);
                  }}
                  className="text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 p-1 -ml-1 rounded-lg cursor-text leading-relaxed transition-colors"
                >
                  {selectedTask.description || 'Add description...'}
                </p>
              )}
            </div>

            {/* Properties (Assignee & Date Picker) */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-zinc-400 font-medium w-16">Properties</span>
              <div className="flex items-center gap-3">
                {/* Interactive Assignee Picker */}
                <div className="relative">
                  <button
                    onClick={() => setShowAssigneePicker(!showAssigneePicker)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <Avatar name={selectedTask.assignee || 'Admin'} size="sm" src={selectedTask.assigneeAvatar} />
                    <span>{selectedTask.assignee || 'Admin'}</span>
                  </button>

                  {showAssigneePicker && (
                    <div className="absolute left-0 top-full mt-1 w-44 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-1 z-50">
                      <div className="px-3 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Reassign Task
                      </div>
                      {teamMembers.map(m => (
                        <button
                          key={m}
                          onClick={() => handleAssigneeSelect(m)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left"
                        >
                          <Avatar name={m} size="sm" />
                          <span>{m}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interactive Due Date Popover */}
                <DatePickerPopover
                  startDate={selectedTask.startDate || 'Jan 10'}
                  dueDate={selectedTask.dueDate || '29 Jul'}
                  onSelectDate={(start, end) => updateTask(selectedTask.id, { startDate: start, dueDate: end })}
                />
              </div>
            </div>

            {/* Labels Row with Adding & Removing */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-zinc-400 font-medium w-16">Labels</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {(selectedTask.labels || ['Deployment']).map((lbl, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60"
                  >
                    <span>{lbl}</span>
                    <button
                      onClick={() => handleRemoveLabel(lbl)}
                      className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    >
                      ×
                    </button>
                  </span>
                ))}

                {showAddLabel ? (
                  <form onSubmit={handleAddLabel} className="flex items-center gap-1">
                    <input
                      type="text"
                      autoFocus
                      value={newLabel}
                      onChange={e => setNewLabel(e.target.value)}
                      placeholder="Label name..."
                      className="px-2 py-0.5 text-xs rounded-lg border border-blue-400 bg-white dark:bg-zinc-800 focus:outline-none"
                    />
                    <button type="submit" className="px-2 py-0.5 text-xs rounded bg-zinc-900 text-white font-medium">
                      Add
                    </button>
                    <button type="button" onClick={() => setShowAddLabel(false)} className="text-zinc-400">
                      ×
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowAddLabel(true)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-xs transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Label</span>
                  </button>
                )}
              </div>
            </div>

            {/* Resources Section with clickable links */}
            <div className="flex items-start gap-4 text-xs">
              <span className="text-zinc-400 font-medium w-16 pt-1">Resources</span>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50 hover:underline font-medium"
                    >
                      <Paperclip className="w-3 h-3" />
                      <span>{res.title}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  ))}
                </div>

                {showAddResource ? (
                  <form onSubmit={handleAddResource} className="flex flex-wrap items-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <input
                      type="text"
                      required
                      placeholder="Title (e.g. Design Doc)"
                      value={resourceTitle}
                      onChange={e => setResourceTitle(e.target.value)}
                      className="px-2 py-1 text-xs rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none"
                    />
                    <input
                      type="url"
                      placeholder="URL (https://...)"
                      value={resourceUrl}
                      onChange={e => setResourceUrl(e.target.value)}
                      className="px-2 py-1 text-xs rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none"
                    />
                    <button type="submit" className="px-2.5 py-1 text-xs rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold">
                      Save
                    </button>
                    <button type="button" onClick={() => setShowAddResource(false)} className="text-zinc-400 text-xs">
                      Cancel
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowAddResource(true)}
                    className="flex items-center gap-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors pt-0.5"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Add document or link...</span>
                  </button>
                )}
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="pt-2">
              <SubtasksTable taskId={selectedTask.id} subtasks={selectedTask.subtasks || []} />
            </div>

            {/* Activity & Comments Stream */}
            <div className="pt-2">
              <CommentStream taskId={selectedTask.id} comments={selectedTask.comments || []} />
            </div>
          </div>

          {/* Right Sidebar (Metadata & Updates Feed) */}
          <TaskMetadataSidebar task={selectedTask} />
        </div>
      </div>
    </div>
  );
};
