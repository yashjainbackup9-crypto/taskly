import mongoose from 'mongoose';
import { ProjectModel, TaskModel, SubtaskModel, CommentModel, AuditLogModel } from './models';

export async function seedUserData(userId: string | mongoose.Types.ObjectId, userName = 'Dexter', forceReseed = false) {
  const uId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

  if (forceReseed) {
    const existingTasks = await TaskModel.find({ userId: uId });
    const taskIds = existingTasks.map(t => t._id);
    await SubtaskModel.deleteMany({ taskId: { $in: taskIds } });
    await CommentModel.deleteMany({ taskId: { $in: taskIds } });
    await AuditLogModel.deleteMany({ taskId: { $in: taskIds } });
    await TaskModel.deleteMany({ userId: uId });
    await ProjectModel.deleteMany({ userId: uId });
  } else {
    const count = await TaskModel.countDocuments({ userId: uId });
    if (count > 0) return;
  }

  // 1. Create Default Project matching Figma
  const defaultProject = await ProjectModel.create({
    name: 'Design System Update',
    key: 'DES',
    description: 'Centralized UI design tokens and component library refresh.',
    priority: 'High',
    lead: userName || 'Dexter',
    leadAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName || 'Dexter')}`,
    dueDate: '12 Sep 2026',
    userId: uId,
  });

  // 2. Create the exact 12 Figma tasks
  const sampleTasks = [
    // Column: To Do (3 tasks)
    {
      title: 'Write API Documentation',
      description: 'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.',
      status: 'To Do',
      priority: 'High',
      assignee: 'Admin',
      assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
      dueDate: '29 Jul',
      startDate: 'Jan 10',
      labels: ['Deployment', 'Deployment'],
      team: 'Engineering',
      reporter: 'Dexter',
      watchers: 2,
      order: 0,
      projectId: defaultProject._id,
      userId: uId,
    },
    {
      title: 'Implement Search Function',
      description: 'Add fuzzy multi-field search for tasks and projects.',
      status: 'To Do',
      priority: 'High',
      assignee: 'Admin',
      assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
      dueDate: '29 Jul',
      labels: ['Deployment', 'Deployment'],
      team: 'Engineering',
      reporter: 'Dexter',
      order: 1,
      projectId: defaultProject._id,
      userId: uId,
    },
    {
      title: 'Deploy to Production',
      description: 'Set up automated CI/CD deployment pipelines on Vercel.',
      status: 'To Do',
      priority: 'High',
      assignee: 'Admin',
      assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
      dueDate: '29 Jul',
      labels: ['Deployment', 'Deployment'],
      team: 'Engineering',
      reporter: 'Dexter',
      order: 2,
      projectId: defaultProject._id,
      userId: uId,
    },

    // Column: Doing (2 tasks)
    {
      title: 'Code Review Completed',
      description: 'Perform peer review on pull requests and verify clean code formatting.',
      status: 'Doing',
      priority: 'High',
      assignee: 'Admin',
      assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
      dueDate: '29 Jul',
      labels: ['Deployment', 'Deployment'],
      team: 'Engineering',
      reporter: 'Dexter',
      order: 0,
      projectId: defaultProject._id,
      userId: uId,
    },
    {
      title: 'Design Mockups Finalized',
      description: 'Ensure color tokens and typography match the Figma design specification.',
      status: 'Doing',
      priority: 'High',
      assignee: 'Admin',
      assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
      dueDate: '29 Jul',
      labels: ['Deployment', 'Deployment'],
      team: 'Engineering',
      reporter: 'Dexter',
      order: 1,
      projectId: defaultProject._id,
      userId: uId,
    },

    // Column: Completed (3 tasks)
    {
      title: 'Feature Testing Passed',
      description: 'Comprehensive test coverage achieved across auth, boards, and subtasks.',
      status: 'Completed',
      priority: 'Low',
      assignee: 'QA Team',
      assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=QA%20Team',
      dueDate: '30 Jul',
      labels: ['Testing', 'Passed'],
      team: 'Quality Assurance',
      reporter: 'Dexter',
      order: 0,
      projectId: defaultProject._id,
      userId: uId,
    },
    {
      title: 'UI Design Updated',
      description: 'Updated light/dark palette and responsive grid padding.',
      status: 'Completed',
      priority: 'Low',
      assignee: 'Designer',
      assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Designer',
      dueDate: '31 Jul',
      labels: ['Design', 'Updated'],
      team: 'Product Design',
      reporter: 'Dexter',
      order: 1,
      projectId: defaultProject._id,
      userId: uId,
    },
    {
      title: 'Security Audit Scheduled',
      description: 'Verified JWT signing algorithms, password hashing, and role checks.',
      status: 'Completed',
      priority: 'High',
      assignee: 'Security',
      assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Security',
      dueDate: '01 Aug',
      labels: ['Audit', 'Scheduled'],
      team: 'SecOps',
      reporter: 'Dexter',
      order: 2,
      projectId: defaultProject._id,
      userId: uId,
    },

    // Column: On Hold (4 tasks)
    {
      title: 'UI Review Pending',
      description: 'Awaiting stakeholder approval on the interactive Kanban animations.',
      status: 'On Hold',
      priority: 'Medium',
      assignee: 'Designer',
      assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Designer',
      dueDate: '02 Aug',
      labels: ['Review', 'Design'],
      team: 'Product Design',
      reporter: 'Dexter',
      order: 0,
      projectId: defaultProject._id,
      userId: uId,
    },
    {
      title: 'Backend Refactoring',
      description: 'Optimized Mongoose indexes and query aggregation pipelines.',
      status: 'On Hold',
      priority: 'Medium',
      assignee: 'Dev Team',
      assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dev%20Team',
      dueDate: '03 Aug',
      labels: ['Development'],
      team: 'Engineering',
      reporter: 'Dexter',
      order: 1,
      projectId: defaultProject._id,
      userId: uId,
    },
    {
      title: 'User Feedback Collection',
      description: 'Synthesized user survey data into actionable product tickets.',
      status: 'On Hold',
      priority: 'Low',
      assignee: 'Product Lead',
      assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Product%20Lead',
      dueDate: '05 Aug',
      labels: ['Research'],
      team: 'Product',
      reporter: 'Dexter',
      order: 2,
      projectId: defaultProject._id,
      userId: uId,
    },
    {
      title: 'Performance Tuning',
      description: 'Benchmarked sub-100ms API response latency across all endpoints.',
      status: 'On Hold',
      priority: 'High',
      assignee: 'Engineering',
      assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Engineering',
      dueDate: '08 Aug',
      labels: ['Optimization'],
      team: 'Infrastructure',
      reporter: 'Dexter',
      order: 3,
      projectId: defaultProject._id,
      userId: uId,
    },
  ];

  const createdTasks = await TaskModel.insertMany(sampleTasks);
  const docTask = createdTasks.find(t => t.title === 'Write API Documentation');

  if (docTask) {
    // Seed Subtasks matching Figma Screen 06
    await SubtaskModel.insertMany([
      {
        title: 'Subtask 1',
        completed: false,
        priority: 'High',
        assignee: 'Designer',
        assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Designer',
        dueDate: '12 Sep 2026',
        taskId: docTask._id,
      },
      {
        title: 'Subtask 2',
        completed: false,
        priority: 'Low',
        assignee: 'CN',
        assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CN',
        dueDate: '15 Sep 2026',
        taskId: docTask._id,
      },
      {
        title: 'Subtask 3',
        completed: false,
        priority: 'Medium',
        assignee: 'Unassigned',
        assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Unassigned',
        dueDate: '18 Sep 2026',
        taskId: docTask._id,
      },
    ]);

    // Seed Comment matching Figma Screen 06
    await CommentModel.create({
      content: 'dsds',
      author: 'Ankit Dutta',
      authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ankit%20Dutta',
      taskId: docTask._id,
      reactions: { '👍': ['Dexter'] },
    });

    // Seed Audit Log matching Figma Screen 06
    await AuditLogModel.insertMany([
      {
        action: 'You changed priority from No priority to Urgent',
        actor: 'You',
        actorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter',
        taskId: docTask._id,
      },
      {
        action: 'You posted an update - Aug 2026',
        actor: 'You',
        actorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter',
        taskId: docTask._id,
      },
    ]);
  }
}
