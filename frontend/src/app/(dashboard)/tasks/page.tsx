'use client';

import React from 'react';
import { TopHeader } from '../../../components/navigation/TopHeader';
import { KanbanBoard } from '../../../components/board/KanbanBoard';
import { TaskListView } from '../../../components/list/TaskListView';
import { useTask } from '../../../context/TaskContext';

export default function TasksPage() {
  const { activeView, createTask } = useTask();

  const handleQuickAddTask = async () => {
    await createTask({
      title: 'New Task',
      status: 'To Do',
      priority: 'High',
      assignee: 'Dexter',
      dueDate: '29 Jul',
      labels: ['Deployment'],
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopHeader
        title="Tasks"
        onAddTask={handleQuickAddTask}
      />

      <div className="flex-1">
        {activeView === 'board' ? <KanbanBoard /> : <TaskListView />}
      </div>
    </div>
  );
}
