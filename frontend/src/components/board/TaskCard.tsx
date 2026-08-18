'use client';

import React, { useState } from 'react';
import { Calendar, MoreHorizontal, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Task, TaskStatus } from '../../types/task';
import { useTask } from '../../context/TaskContext';
import { Avatar } from '../ui/Avatar';
import { TagPill } from '../ui/TagPill';
import { STATUS_COLUMNS } from '../../lib/constants';
import { cn } from '../../lib/utils';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { setSelectedTaskId, deleteTask, moveTaskStatus, visibleFields } = useTask();
  const [showMenu, setShowMenu] = useState(false);

  const isUrgent = task.priority === 'High' || task.priority === 'Urgent';

  return (
    <div
      onClick={() => setSelectedTaskId(task.id)}
      className="group relative bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-3.5 shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer select-none space-y-3"
    >
      {/* Card Header: Title & Actions */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {task.title}
        </h3>

        {/* More Menu */}
        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-opacity"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200/80 dark:border-zinc-800 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Move Status
              </div>
              {STATUS_COLUMNS.filter(s => s !== task.status).map(status => (
                <button
                  key={status}
                  onClick={() => {
                    moveTaskStatus(task.id, status as TaskStatus);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <span>{status}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                </button>
              ))}

              <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
              <button
                onClick={() => {
                  deleteTask(task.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-1.5 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Assignee & Due Date Row */}
      <div className="flex items-center justify-between text-xs gap-2">
        {/* Assignee badge */}
        {visibleFields.members && (
          <div className="flex items-center gap-1.5">
            <Avatar name={task.assignee || 'Admin'} size="sm" src={task.assigneeAvatar} />
            <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
              {task.assignee || 'Admin'}
            </span>
          </div>
        )}

        {/* Due Date Chip */}
        {visibleFields.dueDate && task.dueDate && (
          <div
            className={cn(
              'flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md',
              isUrgent
                ? 'text-red-500 dark:text-red-400 bg-red-50/70 dark:bg-red-950/30'
                : 'text-zinc-500 dark:text-zinc-400 bg-zinc-100/80 dark:bg-zinc-800/60'
            )}
          >
            <Calendar className="w-3 h-3" />
            <span>{task.dueDate}</span>
          </div>
        )}
      </div>

      {/* Labels / Tags Row */}
      {visibleFields.labels && task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {task.labels.map((label, idx) => (
            <TagPill key={idx} label={label} />
          ))}
        </div>
      )}
    </div>
  );
};
