'use client';

import React, { useState } from 'react';
import { MoreHorizontal, Trash2, ArrowRight } from 'lucide-react';
import { Task, TaskStatus } from '../../types/task';
import { useTask } from '../../context/TaskContext';
import { PrioritySignal } from '../ui/PrioritySignal';
import { Avatar } from '../ui/Avatar';
import { STATUS_COLUMNS } from '../../lib/constants';
import { cn } from '../../lib/utils';

interface TaskRowProps {
  task: Task;
}

export const TaskRow: React.FC<TaskRowProps> = ({ task }) => {
  const { setSelectedTaskId, deleteTask, moveTaskStatus, visibleFields } = useTask();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr
      onClick={() => setSelectedTaskId(task.id)}
      className="group border-b border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors text-xs select-none"
    >
      {/* Task Title Column */}
      <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        <div className="flex items-center gap-2">
          <span>{task.title}</span>
        </div>
      </td>

      {/* Priority Column */}
      {visibleFields.priority && (
        <td className="py-3 px-4">
          <PrioritySignal priority={task.priority} />
        </td>
      )}

      {/* Members Column */}
      {visibleFields.members && (
        <td className="py-3 px-4">
          <div className="flex items-center -space-x-1">
            <Avatar name={task.assignee || 'Dexter'} size="sm" src={task.assigneeAvatar} />
            {task.members && task.members.length > 1 && (
              <Avatar name={task.members[1]} size="sm" />
            )}
            <button
              onClick={e => e.stopPropagation()}
              className="w-5 h-5 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center text-[10px] ml-1 bg-white dark:bg-zinc-900"
            >
              +
            </button>
          </div>
        </td>
      )}

      {/* Due Date Column */}
      {visibleFields.dueDate && (
        <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
          {task.dueDate || '12 Sep 2026'}
        </td>
      )}

      {/* Actions Column */}
      <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
        <div className="relative inline-block text-left">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-md hover:bg-zinc-200/80 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
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
                  className="w-full flex items-center justify-between px-2.5 py-1 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
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
                className="w-full flex items-center gap-1.5 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
