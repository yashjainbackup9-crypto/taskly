'use client';

import React, { useState } from 'react';
import { TopHeader } from '../../../components/navigation/TopHeader';
import { KanbanBoard } from '../../../components/board/KanbanBoard';
import { TaskListView } from '../../../components/list/TaskListView';
import { CreateTaskModal } from '../../../components/ui/CreateTaskModal';
import { useTask } from '../../../context/TaskContext';

export default function TasksPage() {
  const { activeView } = useTask();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <TopHeader
        title="Tasks"
        onAddTask={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1">
        {activeView === 'board' ? <KanbanBoard /> : <TaskListView />}
      </div>

      {/* Interactive Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
