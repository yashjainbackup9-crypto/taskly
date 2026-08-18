'use client';

import React from 'react';
import { useTask } from '../../context/TaskContext';
import { GroupSection } from './GroupSection';
import { STATUS_COLUMNS } from '../../lib/constants';

export const TaskListView: React.FC = () => {
  const { tasks } = useTask();

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-4">
      {STATUS_COLUMNS.map(status => {
        const groupTasks = tasks.filter(t => t.status === status);
        return (
          <GroupSection
            key={status}
            status={status}
            tasks={groupTasks}
          />
        );
      })}
    </div>
  );
};
