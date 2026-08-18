export type TaskStatus = 'To Do' | 'Doing' | 'Completed' | 'On Hold' | 'Backlog';

export type TaskPriority = 'No Priority' | 'Urgent' | 'High' | 'Medium' | 'Low';

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  assignee: string;
  assigneeAvatar: string;
  dueDate: string;
  order: number;
}

export interface Comment {
  id: string;
  taskId: string;
  authorName: string;
  authorAvatar: string;
  authorEmail?: string;
  content: string;
  reactions: string[];
  attachments?: string[];
  parentId?: string | null;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  taskId: string;
  userName: string;
  userAvatar: string;
  action: string;
  details?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeAvatar: string;
  members: string[];
  dueDate: string;
  startDate?: string;
  labels: string[];
  team: string;
  reporter: string;
  isLocked?: boolean;
  watchers?: number;
  order: number;
  projectId?: string;
  userId?: string;
  subtasks?: Subtask[];
  subtaskCount?: number;
  subtasksCompleted?: number;
  comments?: Comment[];
  commentCount?: number;
  auditLogs?: AuditLog[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  priority: TaskPriority;
  lead: string;
  leadAvatar: string;
  dueDate: string;
  taskCount?: number;
  completedTaskCount?: number;
}
