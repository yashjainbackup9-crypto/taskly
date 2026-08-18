'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MoreHorizontal,
  Trash2,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Layers,
} from 'lucide-react';
import { Task, TaskStatus } from '../../types/task';
import { useTask } from '../../context/TaskContext';
import { Avatar } from '../ui/Avatar';
import { TagPill } from '../ui/TagPill';
import { STATUS_COLUMNS } from '../../lib/constants';
import { cn } from '../../lib/utils';

interface TaskCardProps {
  task: Task;
  index: number;
  onDropAt?: (targetIndex: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  const {
    setSelectedTaskId,
    deleteTask,
    moveTaskStatus,
    moveTaskSequence,
    reorderTask,
    visibleFields,
  } = useTask();
  const [showMenu, setShowMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dropPosition, setDropPosition] = useState<'top' | 'bottom' | null>(null);

  const isUrgent = task.priority === 'High' || task.priority === 'Urgent';

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.setData('application/json', JSON.stringify({ taskId: task.id, originStatus: task.status, originIndex: index }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDropPosition(null);
  };

  const handleCardDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    if (e.clientY < midY) {
      setDropPosition('top');
    } else {
      setDropPosition('bottom');
    }
  };

  const handleCardDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDropPosition(null);
  };

  const handleCardDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const targetIdx = dropPosition === 'top' ? index : index + 1;
    setDropPosition(null);

    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      await reorderTask(taskId, task.status as TaskStatus, targetIdx);
    }
  };

  // Keyboard shortcut support: Alt+Up / Alt+Down to swap order
  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.altKey && e.key === 'ArrowUp') {
      e.preventDefault();
      await moveTaskSequence(task.id, 'up');
    } else if (e.altKey && e.key === 'ArrowDown') {
      e.preventDefault();
      await moveTaskSequence(task.id, 'down');
    }
  };

  return (
    <div
      draggable
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleCardDragOver}
      onDragLeave={handleCardDragLeave}
      onDrop={handleCardDrop}
      onClick={() => setSelectedTaskId(task.id)}
      className={cn(
        'group relative bg-white dark:bg-zinc-900 border rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none space-y-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40',
        isDragging
          ? 'opacity-40 scale-95 border-dashed border-blue-500 shadow-none'
          : 'border-zinc-200/90 dark:border-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700',
        dropPosition === 'top' && 'border-t-2 border-t-blue-500 ring-2 ring-blue-500/20 -translate-y-0.5',
        dropPosition === 'bottom' && 'border-b-2 border-b-blue-500 ring-2 ring-blue-500/20 translate-y-0.5'
      )}
    >
      {/* Top Drop Indicator Glow */}
      {dropPosition === 'top' && (
        <div className="absolute -top-1.5 left-2 right-2 h-1 bg-blue-500 rounded-full animate-pulse shadow-sm pointer-events-none" />
      )}

      {/* Card Header: Title, Drag Handle & Actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <GripVertical className="w-3 h-3 text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 shrink-0" />
          <h3 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {task.title}
          </h3>
        </div>

        {/* More Options Dropdown */}
        <div className="relative shrink-0" onClick={e => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-opacity"
            title="Card options & sequence"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Sequence & Order
              </div>
              <button
                type="button"
                onClick={async () => {
                  await moveTaskSequence(task.id, 'up');
                  setShowMenu(false);
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Move Up</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">Alt+↑</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  await moveTaskSequence(task.id, 'down');
                  setShowMenu(false);
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <ArrowDown className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Move Down</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">Alt+↓</span>
              </button>

              <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
              <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Move Column
              </div>
              {STATUS_COLUMNS.filter(s => s !== task.status).map(status => (
                <button
                  type="button"
                  key={status}
                  onClick={() => {
                    moveTaskStatus(task.id, status as TaskStatus);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <span>{status}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                </button>
              ))}

              <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
              <button
                type="button"
                onClick={() => {
                  deleteTask(task.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>Delete Task</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Assignee & Due Date Row */}
      <div className="flex items-center justify-between text-xs gap-2">
        {visibleFields.members && (
          <div className="flex items-center gap-1.5">
            <Avatar name={task.assignee || 'Admin'} size="sm" src={task.assigneeAvatar} />
            <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
              {task.assignee || 'Admin'}
            </span>
          </div>
        )}

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

      {/* Bottom Drop Indicator Glow */}
      {dropPosition === 'bottom' && (
        <div className="absolute -bottom-1.5 left-2 right-2 h-1 bg-blue-500 rounded-full animate-pulse shadow-sm pointer-events-none" />
      )}
    </div>
  );
};
