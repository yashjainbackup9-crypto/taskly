'use client';

import React from 'react';
import { useTask } from '../../context/TaskContext';
import { KanbanColumn } from './KanbanColumn';
import { KanbanBoardSkeleton } from './KanbanBoardSkeleton';
import { STATUS_COLUMNS } from '../../lib/constants';

export const KanbanBoard: React.FC = () => {
  const { tasks, isLoading } = useTask();

  if (isLoading && tasks.length === 0) {
    return <KanbanBoardSkeleton />;
  }

  return (
    <div data-tour="kanban-board" className="flex gap-4 p-4 lg:p-6 overflow-x-auto h-[calc(100vh-65px)]">
      {STATUS_COLUMNS.map(status => {
        const columnTasks = tasks.filter(t => t.status === status);
        return (
          <KanbanColumn
            key={status}
            status={status}
            tasks={columnTasks}
          />
        );
      })}
    </div>
  );
};
