'use client';

import React, { useState } from 'react';
import { TopHeader } from '../../../components/navigation/TopHeader';
import { useTask } from '../../../context/TaskContext';
import { PrioritySignal } from '../../../components/ui/PrioritySignal';
import { Avatar } from '../../../components/ui/Avatar';
import { Plus, MoreHorizontal, FolderKanban } from 'lucide-react';
import { TaskListView } from '../../../components/list/TaskListView';

export default function ProjectsPage() {
  const { projects, activeProjectId, setActiveProjectId, tasks } = useTask();
  const [selectedProjectTab, setSelectedProjectTab] = useState<'all' | 'detail'>('all');

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  return (
    <div className="flex flex-col min-h-screen">
      <TopHeader
        title={activeProject ? activeProject.name : 'Projects'}
        breadcrumb="Projects"
        onAddTask={() => {}}
      />

      <div className="p-4 lg:p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Projects Overview Table matching Figma screenshot 09/10/12 */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-zinc-500" />
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Projects Directory</h2>
            </div>
            <span className="text-xs text-zinc-400 font-medium">{projects.length} Active Projects</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 bg-zinc-50/30 dark:bg-zinc-800/20">
                  <th className="py-3 px-6">Projects</th>
                  <th className="py-3 px-6 w-32">Priority</th>
                  <th className="py-3 px-6 w-28">Lead</th>
                  <th className="py-3 px-6 w-36">Due Date</th>
                  <th className="py-3 px-6 w-16 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(proj => (
                  <tr
                    key={proj.id}
                    onClick={() => {
                      setActiveProjectId(proj.id);
                      setSelectedProjectTab('detail');
                    }}
                    className="border-b border-zinc-100/70 dark:border-zinc-800/60 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-6 font-medium text-blue-600 dark:text-blue-400 hover:underline">
                      {proj.name}
                    </td>
                    <td className="py-3.5 px-6">
                      <PrioritySignal priority={proj.priority || 'High'} />
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-1.5">
                        <Avatar name={proj.lead || 'Dexter'} size="sm" src={proj.leadAvatar} />
                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">{proj.lead || 'Dexter'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                      {proj.dueDate || '12 Sep 2026'}
                    </td>
                    <td className="py-3.5 px-6 text-right" onClick={e => e.stopPropagation()}>
                      <button className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={5} className="py-3 px-6">
                    <button className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-medium">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Projects</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Associated Tasks Section */}
        {activeProject && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {activeProject.name} — Tasks
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {activeProject.description || 'Manage tasks associated with this project'}
                </p>
              </div>
            </div>

            <TaskListView />
          </div>
        )}
      </div>
    </div>
  );
}
