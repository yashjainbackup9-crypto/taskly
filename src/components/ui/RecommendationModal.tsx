'use client';

import React, { useMemo } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Zap,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { PrioritySignal } from './PrioritySignal';
import { StatusBadge } from './StatusBadge';
import { Avatar } from './Avatar';
import { Task } from '../../types/task';
import { cn } from '../../lib/utils';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { tasks, setSelectedTaskId, updateTask } = useTask();
  const { user } = useAuth();

  // Role-Based Smart Recommendation Scorer
  const recommendations = useMemo(() => {
    const role = (user?.title || 'Product Designer').toLowerCase();

    return tasks
      .map(task => {
        let score = 0;
        const reasons: string[] = [];

        // 1. Role Keyword Matching
        const taskText = `${task.title} ${task.description} ${(task.labels || []).join(' ')} ${task.team}`.toLowerCase();

        if (role.includes('design') && (taskText.includes('design') || taskText.includes('ui') || taskText.includes('figma') || taskText.includes('mockup'))) {
          score += 50;
          reasons.push('Matches your Product Design skillset');
        } else if (role.includes('engineer') || role.includes('dev')) {
          if (taskText.includes('api') || taskText.includes('backend') || taskText.includes('search') || taskText.includes('refactor')) {
            score += 50;
            reasons.push('High engineering priority');
          }
        } else if (role.includes('qa') || role.includes('test')) {
          if (taskText.includes('test') || taskText.includes('qa') || taskText.includes('audit')) {
            score += 50;
            reasons.push('Requires QA validation');
          }
        }

        // 2. Urgent / High Priority Boost
        if (task.priority === 'Urgent') {
          score += 40;
          reasons.push('Urgent priority blocking release');
        } else if (task.priority === 'High') {
          score += 25;
          reasons.push('High priority target');
        }

        // 3. Stalled / Review Bottleneck
        if (task.status === 'Doing' || task.status === 'On Hold') {
          score += 20;
          reasons.push(`In ${task.status} pipeline — needs attention`);
        }

        // 4. Assigned to Current User
        if (task.assignee === user?.name) {
          score += 15;
          reasons.push('Directly assigned to you');
        }

        return {
          task,
          score,
          reasons,
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [tasks, user]);

  if (!isOpen) return null;

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    onClose();
  };

  const handleClaimTask = async (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.name) {
      await updateTask(task.id, { assignee: user.name, status: 'Doing' });
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh] sm:max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Smart Task Recommendations</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                  AI Scored for {user?.title || 'Product Designer'}
                </span>
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Personalized task priorities tailored to your role and project momentum.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {recommendations.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              All recommended tasks for your role are up to date! 🎉
            </div>
          ) : (
            recommendations.map(({ task, score, reasons }) => (
              <div
                key={task.id}
                onClick={() => handleSelectTask(task.id)}
                className="group p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 hover:border-purple-300 dark:hover:border-purple-800/80 bg-zinc-50/50 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-800/60 transition-all cursor-pointer shadow-2xs hover:shadow-md space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {task.title}
                      </h3>
                      <StatusBadge status={task.status} />
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {task.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* AI Match Score Badge */}
                  <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/50 text-[11px] font-bold text-purple-700 dark:text-purple-300">
                    <Zap className="w-3 h-3 text-purple-500 fill-purple-500" />
                    <span>{score}% Match</span>
                  </div>
                </div>

                {/* Reason Pills & Metadata */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-xs gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {reasons.slice(0, 2).map((r, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-600 dark:text-zinc-300 text-[10px] font-medium"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                        <span>{r}</span>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                      <Avatar name={task.assignee || 'Admin'} size="sm" src={task.assigneeAvatar} />
                      <span>{task.assignee || 'Admin'}</span>
                    </div>

                    {task.assignee !== user?.name && (
                      <button
                        onClick={e => handleClaimTask(task, e)}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-semibold transition-colors shadow-2xs"
                      >
                        Claim Task
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 text-center">
          <p className="text-[11px] text-zinc-400">
            Recommendations refresh dynamically as tasks progress across pipelines.
          </p>
        </div>
      </div>
    </div>
  );
};
