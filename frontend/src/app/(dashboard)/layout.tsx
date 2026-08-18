'use client';

import React from 'react';
import { Sidebar } from '../../components/navigation/Sidebar';
import { TaskDetailDrawer } from '../../components/task-details/TaskDetailDrawer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Universal Workspace Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </main>

      {/* Task Details Drawer Modal */}
      <TaskDetailDrawer />
    </div>
  );
}
