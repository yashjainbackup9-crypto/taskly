'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Plus,
  Settings,
  UserPlus,
  Tag,
  Users,
  Search,
  Check,
  X,
  Sliders,
  RotateCcw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../types/task';
import { useTask } from '../../context/TaskContext';
import { PrioritySignal } from '../ui/PrioritySignal';
import { DatePickerPopover } from '../dropdowns/DatePickerPopover';
import { Avatar } from '../ui/Avatar';
import {
  PRIORITY_OPTIONS,
  ALL_STATUSES,
  STATUS_COLORS,
  AVAILABLE_MEMBERS,
} from '../../lib/constants';
import { cn } from '../../lib/utils';

interface TaskMetadataSidebarProps {
  task: Task;
}

export const TaskMetadataSidebar: React.FC<TaskMetadataSidebarProps> = ({ task }) => {
  const { updateTask } = useTask();
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(true);

  // Dropdown states
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Sidebar property visibility settings
  const [visibleProperties, setVisibleProperties] = useState({
    status: true,
    priority: true,
    members: true,
    dates: true,
    labels: true,
    teams: true,
    reporter: true,
  });

  // Refs for click outside
  const priorityDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const memberDropdownRef = useRef<HTMLDivElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);

  // Universal Escape key & Click-outside isolation for all popovers
  useEffect(() => {
    const anyOpen = isMembersOpen || isStatusOpen || isPriorityOpen || isSettingsOpen;
    if (!anyOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        setIsMembersOpen(false);
        setIsStatusOpen(false);
        setIsPriorityOpen(false);
        setIsSettingsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (isMembersOpen && memberDropdownRef.current && !memberDropdownRef.current.contains(target)) {
        setIsMembersOpen(false);
      }
      if (isStatusOpen && statusDropdownRef.current && !statusDropdownRef.current.contains(target)) {
        setIsStatusOpen(false);
      }
      if (isPriorityOpen && priorityDropdownRef.current && !priorityDropdownRef.current.contains(target)) {
        setIsPriorityOpen(false);
      }
      if (isSettingsOpen && settingsDropdownRef.current && !settingsDropdownRef.current.contains(target)) {
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMembersOpen, isStatusOpen, isPriorityOpen, isSettingsOpen]);

  const handlePrioritySelect = async (priority: TaskPriority) => {
    await updateTask(task.id, { priority });
    setIsPriorityOpen(false);
  };

  const handleStatusSelect = async (status: TaskStatus) => {
    await updateTask(task.id, { status });
    setIsStatusOpen(false);
  };

  const handleToggleMember = async (memberName: string) => {
    const currentMembers = task.members || [];
    const updatedMembers = currentMembers.includes(memberName)
      ? currentMembers.filter(m => m !== memberName)
      : [...currentMembers, memberName];
    await updateTask(task.id, { members: updatedMembers });
  };

  const togglePropertyVisibility = (prop: keyof typeof visibleProperties) => {
    setVisibleProperties(prev => ({ ...prev, [prop]: !prev[prop] }));
  };

  const resetPropertiesToDefault = () => {
    setVisibleProperties({
      status: true,
      priority: true,
      members: true,
      dates: true,
      labels: true,
      teams: true,
      reporter: true,
    });
  };

  const filteredMembers = AVAILABLE_MEMBERS.filter(m =>
    m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(memberSearchQuery.toLowerCase())
  );

  const currentStatusConfig = STATUS_COLORS[task.status || 'To Do'] || {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  };

  return (
    <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-zinc-200/80 dark:border-zinc-800 p-4 pb-32 space-y-5 bg-zinc-50/50 dark:bg-zinc-900/30 overflow-y-auto">
      {/* Details Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide hover:text-zinc-600 transition-colors"
          >
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-zinc-400 transition-transform duration-200',
                !isDetailsOpen && '-rotate-90'
              )}
            />
            <span>Details</span>
          </button>

          <div className="flex items-center gap-1 text-zinc-400 relative" ref={settingsDropdownRef}>
            <button
              type="button"
              onClick={() => setIsMembersOpen(true)}
              className="p-1 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              title="Add member or property"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* Settings Gear Icon & Customizer Menu */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-1 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              title="Customize Sidebar Properties"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Sidebar Properties Customizer Popover */}
            {isSettingsOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-500" />
                    <span>Sidebar Fields</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Property Toggles List */}
                <div className="space-y-1 text-xs">
                  {Object.entries(visibleProperties).map(([propKey, isVisible]) => (
                    <button
                      key={propKey}
                      type="button"
                      onClick={() => togglePropertyVisibility(propKey as keyof typeof visibleProperties)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors capitalize text-left"
                    >
                      <div className="flex items-center gap-2">
                        {isVisible ? (
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                        <span>{propKey}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => togglePropertyVisibility(propKey as keyof typeof visibleProperties)}
                        className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-0 cursor-pointer"
                        onClick={e => e.stopPropagation()}
                      />
                    </button>
                  ))}
                </div>

                {/* Reset Action */}
                <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={resetPropertiesToDefault}
                    className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Default</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {isDetailsOpen && (
          <div className="space-y-2.5 text-xs">
            {/* Status Row with Colored Dot Indicator */}
            {visibleProperties.status && (
              <div className="flex items-center justify-between relative" ref={statusDropdownRef}>
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Status</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsPriorityOpen(false);
                    setIsMembersOpen(false);
                    setIsSettingsOpen(false);
                    setIsStatusOpen(!isStatusOpen);
                  }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors shadow-xs active:scale-98"
                >
                  <span className={cn('w-2 h-2 rounded-full shrink-0', currentStatusConfig.dot)} />
                  <span className="text-zinc-800 dark:text-zinc-200">{task.status || 'Backlog'}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400 ml-0.5" />
                </button>

                {/* Status Dropdown Popover with Close Button */}
                {isStatusOpen && (
                  <div
                    className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-2 py-1 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Status
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsStatusOpen(false)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                        title="Close"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {ALL_STATUSES.map(s => {
                      const cfg = STATUS_COLORS[s];
                      const isSelected = (task.status || 'Backlog') === s;
                      return (
                        <button
                          type="button"
                          key={s}
                          onClick={() => handleStatusSelect(s as TaskStatus)}
                          className={cn(
                            'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors',
                            isSelected
                              ? 'bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-zinc-100'
                              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className={cn('w-2 h-2 rounded-full shrink-0', cfg?.dot || 'bg-zinc-400')} />
                            <span>{s}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Priority Row with Checkmark */}
            {visibleProperties.priority && (
              <div className="flex items-center justify-between relative" ref={priorityDropdownRef}>
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Priority</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsStatusOpen(false);
                    setIsMembersOpen(false);
                    setIsSettingsOpen(false);
                    setIsPriorityOpen(!isPriorityOpen);
                  }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors shadow-xs active:scale-98"
                >
                  <PrioritySignal priority={task.priority || 'High'} />
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {/* Priority Selector Dropdown with Close Button */}
                {isPriorityOpen && (
                  <div
                    className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-2 py-1 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Priority
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsPriorityOpen(false)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                        title="Close"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {PRIORITY_OPTIONS.map(opt => {
                      const isSelected = (task.priority || 'High') === opt.id;
                      return (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => handlePrioritySelect(opt.id as TaskPriority)}
                          className={cn(
                            'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors',
                            isSelected
                              ? 'bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-zinc-100'
                              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                          )}
                        >
                          <PrioritySignal priority={opt.id} />
                          {isSelected && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Members Row with Search & Multi-Selection Popover */}
            {visibleProperties.members && (
              <div className="space-y-1.5 relative" ref={memberDropdownRef}>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium">Members</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsStatusOpen(false);
                      setIsPriorityOpen(false);
                      setIsSettingsOpen(false);
                      setIsMembersOpen(!isMembersOpen);
                    }}
                    className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium py-0.5 px-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors active:scale-98"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{task.members && task.members.length > 0 ? '+ Add more' : 'Add members'}</span>
                  </button>
                </div>

                {/* Selected Members Preview List */}
                {task.members && task.members.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {task.members.map(member => (
                      <span
                        key={member}
                        className="inline-flex items-center gap-1 pl-1 pr-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 text-[11px] font-medium text-zinc-700 dark:text-zinc-300"
                      >
                        <Avatar name={member} size="sm" showBorder={false} />
                        <span>{member}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleMember(member)}
                          className="p-0.5 text-zinc-400 hover:text-red-500 rounded-full transition-colors ml-0.5"
                          title={`Remove ${member}`}
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Member Search & Selection Popover with Header & Close Button */}
                {isMembersOpen && (
                  <div
                    className="absolute right-0 top-full mt-1.5 w-68 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        <span>Assign Members</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsMembersOpen(false)}
                        className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        title="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative mb-2">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search members by name or role..."
                        value={memberSearchQuery}
                        onChange={e => setMemberSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-7 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                      />
                      {memberSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setMemberSearchQuery('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Members List with Checkboxes */}
                    <div className="max-h-48 overflow-y-auto space-y-0.5">
                      {filteredMembers.length > 0 ? (
                        filteredMembers.map(m => {
                          const isSelected = (task.members || []).includes(m.name);
                          return (
                            <div
                              key={m.id}
                              onClick={() => handleToggleMember(m.name)}
                              className={cn(
                                'flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer text-xs transition-colors',
                                isSelected
                                  ? 'bg-zinc-100 dark:bg-zinc-800 font-medium'
                                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300'
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleMember(m.name)}
                                  onClick={e => e.stopPropagation()}
                                  className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-0 cursor-pointer"
                                />
                                <Avatar name={m.name} size="sm" src={m.avatar} />
                                <div className="text-left">
                                  <p className="text-zinc-900 dark:text-zinc-100 font-medium leading-tight">
                                    {m.name}
                                  </p>
                                  <p className="text-[10px] text-zinc-400 leading-none">{m.role}</p>
                                </div>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-3 text-center text-zinc-400 text-xs">
                          No members found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dates Row with Calendar Picker (Opens Upward to prevent bottom clipping) */}
            {visibleProperties.dates && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Dates</span>
                <DatePickerPopover
                  startDate={task.startDate || 'Jan 10'}
                  dueDate={task.dueDate || '31 Jul'}
                  align="right"
                  openDirection="up"
                  onSelectDate={(start, end) => updateTask(task.id, { startDate: start, dueDate: end })}
                />
              </div>
            )}

            {/* Labels Row */}
            {visibleProperties.labels && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Labels</span>
                <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-medium">
                  <Tag className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{task.labels?.[0] || 'Deployment'}</span>
                </div>
              </div>
            )}

            {/* Teams Row */}
            {visibleProperties.teams && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Teams</span>
                <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-medium">
                  <Users className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{task.team || 'Engineering'}</span>
                </div>
              </div>
            )}

            {/* Reporter Row */}
            {visibleProperties.reporter && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Reporter</span>
                <div className="flex items-center gap-1.5">
                  <Avatar name={task.reporter || 'Dexter'} size="sm" />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {task.reporter || 'Dexter'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Updates Audit Feed Section matching Figma */}
      <div className="space-y-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setIsUpdatesOpen(!isUpdatesOpen)}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide hover:text-zinc-600 transition-colors"
        >
          <ChevronDown
            className={cn(
              'w-3.5 h-3.5 text-zinc-400 transition-transform duration-200',
              !isUpdatesOpen && '-rotate-90'
            )}
          />
          <span>Updates</span>
        </button>

        {isUpdatesOpen && (
          <div className="space-y-2.5 text-xs">
            {task.auditLogs && task.auditLogs.length > 0 ? (
              task.auditLogs.map((log, idx) => {
                const isPriorityChange = log.action.toLowerCase().includes('priority');
                return (
                  <div key={log.id || idx} className="flex items-start gap-2.5 text-zinc-600 dark:text-zinc-400">
                    {isPriorityChange ? (
                      <div className="w-5 h-5 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0 mt-0.5">
                        <PrioritySignal priority="Urgent" showLabel={false} className="scale-75" />
                      </div>
                    ) : (
                      <Avatar
                        name={log.userName || 'You'}
                        size="sm"
                        src={log.userAvatar}
                        className="mt-0.5 shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] leading-snug">
                        <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">
                          {log.userName || 'You'}
                        </strong>{' '}
                        {log.action}
                      </p>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {log.createdAt ? 'just now' : 'Aug 2026'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="space-y-2.5">
                {/* Fallback matching Figma Screenshot 06 */}
                <div className="flex items-start gap-2.5 text-zinc-600 dark:text-zinc-400">
                  <div className="w-5 h-5 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0 mt-0.5">
                    <PrioritySignal priority="Urgent" showLabel={false} className="scale-75" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] leading-snug">
                      <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">You</strong> changed priority from No priority to Urgent
                    </p>
                    <span className="text-[10px] text-zinc-400 font-mono">just now</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-zinc-600 dark:text-zinc-400">
                  <Avatar name="You" size="sm" className="mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] leading-snug">
                      <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">You</strong> posted an update - Aug 2026
                    </p>
                    <span className="text-[10px] text-zinc-400 font-mono">Aug 2026</span>
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
