'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Task, TaskStatus, TaskPriority, Project, Subtask, Comment } from '../types/task';
import { fetchApi } from '../lib/api';
import { useAuth } from './AuthContext';

interface VisibleFields {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  isLoading: boolean;
  activeView: 'board' | 'list';
  setActiveView: (view: 'board' | 'list') => void;
  visibleFields: VisibleFields;
  toggleFieldVisibility: (field: keyof VisibleFields) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  priorityFilter: string | null;
  setPriorityFilter: (priority: string | null) => void;
  selectedMembers: string[];
  setSelectedMembers: (members: string[] | ((prev: string[]) => string[])) => void;
  toggleMemberFilter: (member: string) => void;
  clearMemberFilters: () => void;
  selectedTaskId: string | null;
  selectedTask: Task | null;
  setSelectedTaskId: (id: string | null) => void;
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  
  // Modals
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRecommendationsOpen: boolean;
  setIsRecommendationsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTutorialOpen: boolean;
  setIsTutorialOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Actions
  fetchTasks: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<Task>;
  updateTask: (id: string, data: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  moveTaskStatus: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  reorderTask: (taskId: string, status: TaskStatus, targetIndex: number) => Promise<void>;
  sortColumn: (status: TaskStatus, sortBy: 'priority' | 'dueDate' | 'title', direction?: 'asc' | 'desc') => Promise<void>;
  moveTaskSequence: (taskId: string, direction: 'up' | 'down') => Promise<void>;
  
  // Subtasks
  addSubtask: (taskId: string, title: string, priority?: TaskPriority, dueDate?: string) => Promise<Subtask>;
  updateSubtask: (taskId: string, subtaskId: string, data: Partial<Subtask>) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  
  // Comments
  addComment: (taskId: string, content: string, parentId?: string) => Promise<Comment>;
  toggleCommentReaction: (taskId: string, commentId: string, emoji: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleMemberFilter = (memberName: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberName) ? prev.filter(m => m !== memberName) : [...prev, memberName]
    );
  };

  const clearMemberFilters = () => {
    setSelectedMembers([]);
  };

  // Global Modals State
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [visibleFields, setVisibleFields] = useState<VisibleFields>({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: false,
    reporter: false,
  });

  const toggleFieldVisibility = (field: keyof VisibleFields) => {
    setVisibleFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      let url = '/tasks';
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (selectedMembers.length > 0) params.append('members', selectedMembers.join(','));
      if (searchQuery) params.append('search', searchQuery);
      if (activeProjectId) params.append('projectId', activeProjectId);

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const data = await fetchApi<Task[]>(url);
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, statusFilter, priorityFilter, selectedMembers, searchQuery, activeProjectId]);

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchApi<Project[]>('/projects');
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchProjects();
    }
  }, [user, fetchTasks, fetchProjects]);

  // Load single task details when selected
  useEffect(() => {
    if (!selectedTaskId) {
      setSelectedTask(null);
      return;
    }

    const loadTaskDetail = async () => {
      try {
        const detail = await fetchApi<Task>(`/tasks/${selectedTaskId}`);
        setSelectedTask(detail);
      } catch (err) {
        console.error('Failed to load task details', err);
      }
    };

    loadTaskDetail();
  }, [selectedTaskId]);

  const createTask = async (data: Partial<Task>): Promise<Task> => {
    const newTask = await fetchApi<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        projectId: activeProjectId || undefined,
      }),
    });
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask(prev => (prev ? { ...prev, ...data } : null));
    }

    const updated = await fetchApi<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
    return updated;
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
    await fetchApi(`/tasks/${id}`, { method: 'DELETE' });
  };

  const moveTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => (prev ? { ...prev, status: newStatus } : null));
    }
    await fetchApi(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus }),
    });
  };

  const reorderTask = async (taskId: string, status: TaskStatus, targetIndex: number) => {
    // 1. Optimistically reorder local state
    setTasks(prev => {
      const movingTask = prev.find(t => t.id === taskId);
      if (!movingTask) return prev;

      const otherTasks = prev.filter(t => t.id !== taskId);
      const targetColumnTasks = otherTasks.filter(t => t.status === status);
      const restOfTasks = otherTasks.filter(t => t.status !== status);

      const safeIndex = Math.max(0, Math.min(targetIndex, targetColumnTasks.length));
      targetColumnTasks.splice(safeIndex, 0, { ...movingTask, status });

      return [...restOfTasks, ...targetColumnTasks];
    });

    // 2. Persist to MongoDB
    try {
      const updatedTasks = await fetchApi<Task[]>('/tasks/reorder', {
        method: 'PUT',
        body: JSON.stringify({ taskId, status, targetIndex }),
      });
      if (Array.isArray(updatedTasks)) {
        setTasks(updatedTasks);
      }
    } catch (err) {
      console.error('Failed to persist task reorder', err);
      fetchTasks();
    }
  };

  const sortColumn = async (status: TaskStatus, sortBy: 'priority' | 'dueDate' | 'title', direction: 'asc' | 'desc' = 'asc') => {
    try {
      const updatedTasks = await fetchApi<Task[]>('/tasks/sort-column', {
        method: 'PUT',
        body: JSON.stringify({ status, sortBy, direction }),
      });
      if (Array.isArray(updatedTasks)) {
        setTasks(updatedTasks);
      }
    } catch (err) {
      console.error('Failed to sort column', err);
      fetchTasks();
    }
  };

  const moveTaskSequence = async (taskId: string, direction: 'up' | 'down') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const columnTasks = tasks.filter(t => t.status === task.status);
    const currentIndex = columnTasks.findIndex(t => t.id === taskId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= columnTasks.length) return;

    await reorderTask(taskId, task.status as TaskStatus, targetIndex);
  };

  // Subtask handlers
  const addSubtask = async (taskId: string, title: string, priority: TaskPriority = 'High', dueDate: string = '12 Sep 2026') => {
    const newSubtask = await fetchApi<Subtask>(`/tasks/${taskId}/subtasks`, {
      method: 'POST',
      body: JSON.stringify({ title, priority, dueDate }),
    });

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? {
        ...prev,
        subtasks: [...(prev.subtasks || []), newSubtask],
        subtaskCount: (prev.subtaskCount || 0) + 1,
      } : null);
    }
    return newSubtask;
  };

  const updateSubtask = async (taskId: string, subtaskId: string, data: Partial<Subtask>) => {
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? {
        ...prev,
        subtasks: prev.subtasks?.map(s => s.id === subtaskId ? { ...s, ...data } : s),
      } : null);
    }

    await fetchApi(`/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? {
        ...prev,
        subtasks: prev.subtasks?.filter(s => s.id !== subtaskId),
        subtaskCount: Math.max(0, (prev.subtaskCount || 1) - 1),
      } : null);
    }

    await fetchApi(`/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'DELETE',
    });
  };

  // Comments handlers
  const addComment = async (taskId: string, content: string, parentId?: string) => {
    const newComment = await fetchApi<Comment>(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentId }),
    });

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? {
        ...prev,
        comments: [...(prev.comments || []), newComment],
        commentCount: (prev.commentCount || 0) + 1,
      } : null);
    }
    return newComment;
  };

  const toggleCommentReaction = async (taskId: string, commentId: string, emoji: string) => {
    const updated = await fetchApi<Comment>(`/tasks/${taskId}/comments/${commentId}/reaction`, {
      method: 'POST',
      body: JSON.stringify({ emoji }),
    });

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? {
        ...prev,
        comments: prev.comments?.map(c => c.id === commentId ? updated : c),
      } : null);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        isLoading,
        activeView,
        setActiveView,
        visibleFields,
        toggleFieldVisibility,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        selectedMembers,
        setSelectedMembers,
        toggleMemberFilter,
        clearMemberFilters,
        selectedTaskId,
        selectedTask,
        setSelectedTaskId,
        activeProjectId,
        setActiveProjectId,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        isShortcutsOpen,
        setIsShortcutsOpen,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        isRecommendationsOpen,
        setIsRecommendationsOpen,
        isTutorialOpen,
        setIsTutorialOpen,
        isTaskModalOpen,
        setIsTaskModalOpen,
        isProjectModalOpen,
        setIsProjectModalOpen,
        fetchTasks,
        fetchProjects,
        createTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        reorderTask,
        sortColumn,
        moveTaskSequence,
        addSubtask,
        updateSubtask,
        deleteSubtask,
        addComment,
        toggleCommentReaction,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}
