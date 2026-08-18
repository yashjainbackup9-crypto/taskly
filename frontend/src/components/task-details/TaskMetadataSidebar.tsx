'use client';

import React, { useState } from 'react';
import { ChevronDown, Plus, Settings, UserPlus, Tag, Users } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../types/task';
import { useTask } from '../../context/TaskContext';
import { PrioritySignal } from '../ui/PrioritySignal';
import { DatePickerPopover } from '../dropdowns/DatePickerPopover';
import { Avatar } from '../ui/Avatar';
import { PRIORITY_OPTIONS, STATUS_COLUMNS } from '../../lib/constants';

interface TaskMetadataSidebarProps {
  task: Task;
}

export const TaskMetadataSidebar: React.FC<TaskMetadataSidebarProps> = ({ task }) => {
  const { updateTask } = useTask();
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(true);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const handlePrioritySelect = async (priority: TaskPriority) => {
    await updateTask(task.id, { priority });
    setIsPriorityOpen(false);
  };

  const handleStatusSelect = async (status: TaskStatus) => {
    await updateTask(task.id, { status });
    setIsStatusOpen(false);
  };

  return (
    <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-zinc-200/80 dark:border-zinc-800 p-4 space-y-5 bg-zinc-50/50 dark:bg-zinc-900/30 overflow-y-auto">
      {/* Details Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide"
          >
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            <span>Details</span>
          </button>
          <div className="flex items-center gap-1 text-zinc-400">
            <button className="p-1 hover:text-zinc-600 dark:hover:text-zinc-200">
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 hover:text-zinc-600 dark:hover:text-zinc-200">
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {isDetailsOpen && (
          <div className="space-y-2.5 text-xs">
            {/* Status Row */}
            <div className="flex items-center justify-between relative">
              <span className="text-zinc-500 dark:text-zinc-400">Status</span>
              <button
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium hover:bg-zinc-50 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{task.status || 'To Do'}</span>
              </button>

              {isStatusOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-1 z-50">
                  {STATUS_COLUMNS.map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusSelect(s as TaskStatus)}
                      className="w-full text-left px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Priority Row */}
            <div className="flex items-center justify-between relative">
              <span className="text-zinc-500 dark:text-zinc-400">Priority</span>
              <button
                onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium hover:bg-zinc-50 transition-colors"
              >
                <PrioritySignal priority={task.priority} />
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {isPriorityOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Priority
                  </div>
                  {PRIORITY_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handlePrioritySelect(opt.id as TaskPriority)}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <PrioritySignal priority={opt.id} />
                      {task.priority === opt.id && <span className="text-zinc-900 dark:text-zinc-100">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Members Row */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Members</span>
              <button className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 font-medium">
                <UserPlus className="w-3.5 h-3.5 text-zinc-400" />
                <span>Add members</span>
              </button>
            </div>

            {/* Dates Row with Calendar Picker */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Dates</span>
              <DatePickerPopover
                startDate={task.startDate || 'Jan 10'}
                dueDate={task.dueDate || 'End'}
                onSelectDate={(start, end) => updateTask(task.id, { startDate: start, dueDate: end })}
              />
            </div>

            {/* Labels Row */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Labels</span>
              <div className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {task.labels?.[0] || 'Deployment'}
                </span>
              </div>
            </div>

            {/* Teams Row */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Teams</span>
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {task.team || 'Engineering'}
                </span>
              </div>
            </div>

            {/* Reporter Row */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Reporter</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {task.reporter || 'Dexter'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Updates Audit Feed Section matching Figma */}
      <div className="space-y-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-800">
        <button
          onClick={() => setIsUpdatesOpen(!isUpdatesOpen)}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide"
        >
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          <span>Updates</span>
        </button>

        {isUpdatesOpen && (
          <div className="space-y-3 text-xs">
            {task.auditLogs && task.auditLogs.length > 0 ? (
              task.auditLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                  <Avatar name={log.userName || 'You'} size="sm" src={log.userAvatar} className="mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[11px] leading-snug">
                      <strong className="text-zinc-900 dark:text-zinc-200">{log.userName || 'You'}</strong> {log.action}
                    </p>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {log.createdAt ? 'just now' : 'Aug 2026'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                  <span className="text-red-500 mt-0.5">📶</span>
                  <div className="flex-1">
                    <p className="text-[11px] leading-snug">
                      <strong className="text-zinc-900 dark:text-zinc-200">You</strong> changed priority from No priority to Urgent
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                  <Avatar name="You" size="sm" className="mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[11px] leading-snug">
                      <strong className="text-zinc-900 dark:text-zinc-200">You</strong> posted an update - Aug 2026
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
