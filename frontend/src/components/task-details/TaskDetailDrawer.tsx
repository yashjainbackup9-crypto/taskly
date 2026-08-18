'use client';

import React, { useState } from 'react';
import { X, Lock, Eye, Share2, MoreHorizontal, Maximize2, Calendar, Plus, Paperclip } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { SubtasksTable } from './SubtasksTable';
import { CommentStream } from './CommentStream';
import { TaskMetadataSidebar } from './TaskMetadataSidebar';
import { Avatar } from '../ui/Avatar';
import { TagPill } from '../ui/TagPill';

export const TaskDetailDrawer: React.FC = () => {
  const { selectedTask, setSelectedTaskId, updateTask } = useTask();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(selectedTask?.title || '');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [desc, setDesc] = useState(selectedTask?.description || '');

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

  const sampleLabels = selectedTask.labels?.length
    ? selectedTask.labels
    : ['Research', 'Design', 'Development', 'Testing', 'Deployment'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] max-h-[850px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Action Toolbar matching Figma */}
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
            <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors" title="Lock task">
              <Lock className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 text-xs transition-colors" title="Watchers">
              <Eye className="w-3.5 h-3.5" />
              <span>1</span>
            </button>
            <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors" title="Share link">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors" title="More options">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors" title="Split view">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Container */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left / Center Body */}
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
                  {selectedTask.description ||
                    'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.'}
                </p>
              )}
            </div>

            {/* Properties (Assignee & Date) */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-zinc-400 font-medium w-16">Properties</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  <Avatar name={selectedTask.assignee || 'Designer'} size="sm" src={selectedTask.assigneeAvatar} />
                  <span>{selectedTask.assignee || 'Designer'}</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400">
                  <Calendar className="w-3 h-3" />
                  <span>{selectedTask.dueDate || '31 Jul'}</span>
                </div>
              </div>
            </div>

            {/* Labels Row */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-zinc-400 font-medium w-16">Labels</span>
              <div className="flex flex-wrap gap-1.5">
                {sampleLabels.map((lbl, i) => (
                  <TagPill key={i} label={lbl} />
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-zinc-400 font-medium w-16">Resources</span>
              <button className="flex items-center gap-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                <Paperclip className="w-3.5 h-3.5" />
                <span>Add document or link...</span>
              </button>
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
