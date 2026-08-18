'use client';

import React from 'react';
import { useTask } from '../../context/TaskContext';
import { GroupSection } from './GroupSection';
import { TaskListViewSkeleton } from './TaskListViewSkeleton';
import { STATUS_COLUMNS } from '../../lib/constants';

export const TaskListView: React.FC = () => {
  const { tasks, isLoading } = useTask();

  if (isLoading && tasks.length === 0) {
    return <TaskListViewSkeleton />;
  }

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto w-full">
      {STATUS_COLUMNS.map(status => {
        const columnTasks = tasks.filter(t => t.status === status);
        return (
          <GroupSection
            key={status}
            status={status}
            tasks={columnTasks}
          />
        );
      })}
    </div>
  );
};
