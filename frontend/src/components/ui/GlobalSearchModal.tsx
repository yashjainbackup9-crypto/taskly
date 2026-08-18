'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  LayoutGrid,
  FolderKanban,
  User,
  MessageSquare,
  Sparkles,
  Command,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { StatusBadge } from './StatusBadge';
import { PrioritySignal } from './PrioritySignal';
import { cn } from '../../lib/utils';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { tasks, projects, setSelectedTaskId, setActiveView } = useTask();
  const [query, setQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const teams = ['All', 'Engineering', 'Design', 'QA', 'Security', 'Product', 'DevOps'];

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filteredTasks = tasks.filter(t => {
      const matchTeam = selectedTeam === 'All' || t.team === selectedTeam;
      if (!matchTeam) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        (t.assignee || '').toLowerCase().includes(q) ||
        (t.labels || []).some(l => l.toLowerCase().includes(q))
      );
    });

    const filteredProjects = projects.filter(p => {
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.lead || '').toLowerCase().includes(q)
      );
    });

    return {
      tasks: filteredTasks,
      projects: filteredProjects,
    };
  }, [tasks, projects, query, selectedTeam]);

  if (!isOpen) return null;

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Field */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tasks, projects, assignees, or tags..."
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none placeholder:text-zinc-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-zinc-400 hover:text-zinc-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-bold">
            Esc
          </kbd>
        </div>

        {/* Role & Team Filter Strip */}
        <div className="flex items-center gap-1.5 px-6 py-2 border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto bg-zinc-50/30 dark:bg-zinc-900">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mr-1">
            Team:
          </span>
          {teams.map(team => (
            <button
              key={team}
              onClick={() => setSelectedTeam(team)}
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
                selectedTeam === team
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              )}
            >
              {team}
            </button>
          ))}
        </div>

        {/* Results Stream */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Tasks Section */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Tasks ({searchResults.tasks.length})</span>
            </h3>

            {searchResults.tasks.length === 0 ? (
              <p className="text-xs text-zinc-400 italic py-2">No matching tasks found.</p>
            ) : (
              <div className="space-y-1.5">
                {searchResults.tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleSelectTask(task.id)}
                    className="flex items-center justify-between p-3 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 hover:border-blue-400 dark:hover:border-blue-700 bg-zinc-50/40 dark:bg-zinc-800/20 hover:bg-white dark:hover:bg-zinc-800/60 transition-all cursor-pointer shadow-2xs hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <LayoutGrid className="w-4 h-4 text-zinc-400 shrink-0" />
                      <div className="truncate">
                        <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                          <span>{task.team}</span>
                          <span>•</span>
                          <span>{task.assignee}</span>
                          <span>•</span>
                          <span>{task.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={task.status} />
                      <PrioritySignal priority={task.priority} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects Section */}
          {searchResults.projects.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Projects ({searchResults.projects.length})
              </h3>
              <div className="space-y-1.5">
                {searchResults.projects.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      window.location.href = '/projects';
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 hover:border-blue-400 dark:hover:border-blue-700 bg-zinc-50/40 dark:bg-zinc-800/20 hover:bg-white dark:hover:bg-zinc-800/60 transition-all cursor-pointer shadow-2xs hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FolderKanban className="w-4 h-4 text-purple-500 shrink-0" />
                      <div className="truncate">
                        <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {proj.name}
                        </h4>
                        <p className="text-[10px] text-zinc-400 truncate">
                          Lead: {proj.lead} • Due: {proj.dueDate}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">
              ↑ ↓
            </kbd>
            <span>Select:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">
              ↵
            </kbd>
          </div>
          <span>Role-aware multi-attribute search</span>
        </div>
      </div>
    </div>
  );
};
