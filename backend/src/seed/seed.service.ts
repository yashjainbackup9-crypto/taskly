import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Task, TaskDocument } from '../schemas/task.schema';
import { Subtask, SubtaskDocument } from '../schemas/subtask.schema';
import { Comment, CommentDocument } from '../schemas/comment.schema';
import { Project, ProjectDocument } from '../schemas/project.schema';
import { AuditLog, AuditLogDocument } from '../schemas/audit-log.schema';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Subtask.name) private subtaskModel: Model<SubtaskDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async seedUserData(userId: Types.ObjectId, userName: string = 'Dexter') {
    // Check if user already has tasks
    const existingTasksCount = await this.taskModel.countDocuments({ userId }).exec();
    if (existingTasksCount > 0) {
      return;
    }

    this.logger.log(`Seeding initial Figma sample tasks for user ${userId} (${userName})`);

    // 1. Create Default Projects
    const homepageProject = await this.projectModel.create({
      name: 'Design Homepage',
      description: 'Core product homepage wireframing, UX redesign, and production handoff',
      slug: 'design-homepage',
      priority: 'High',
      lead: userName,
      leadAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter',
      dueDate: '12 Sep 2026',
      ownerId: userId,
    });

    await this.projectModel.create({
      name: 'Develop Login Feature',
      description: 'OAuth 2.0 Google login, Guest sessions, and secure JWT token refresh',
      slug: 'develop-login-feature',
      priority: 'Low',
      lead: 'CN',
      leadAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CN',
      dueDate: '15 Sep 2026',
      ownerId: userId,
    });

    await this.projectModel.create({
      name: 'Test Payment Gateway',
      description: 'Stripe & PayPal webhook idempotency, retry mechanisms, and sandbox test runs',
      slug: 'test-payment-gateway',
      priority: 'Medium',
      lead: 'Alex',
      leadAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
      dueDate: '18 Sep 2026',
      ownerId: userId,
    });

    // 2. Create Figma Sample Tasks
    const tasksData = [
      // To Do
      {
        title: 'Write API Documentation',
        description: 'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.',
        status: 'To Do',
        priority: 'High',
        assignee: 'Admin',
        assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
        members: ['Dexter', 'Admin', 'Ankit'],
        dueDate: '29 Jul',
        startDate: 'Jan 10',
        labels: ['Deployment', 'Research', 'Design', 'Development', 'Testing'],
        team: 'Engineering',
        reporter: userName,
        isLocked: false,
        watchers: 1,
        order: 0,
        projectId: homepageProject._id,
        userId,
      },
      {
        title: 'Implement Search Function',
        description: 'Build fast client-side and server-side filtering with Cmd+F shortcut support.',
        status: 'To Do',
        priority: 'High',
        assignee: 'Admin',
        assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
        members: ['Admin'],
        dueDate: '29 Jul',
        labels: ['Deployment', 'Feature'],
        team: 'Engineering',
        reporter: userName,
        order: 1,
        projectId: homepageProject._id,
        userId,
      },
      {
        title: 'Deploy to Production',
        description: 'Execute zero-downtime deployment script, verify environment variables, and run smoke tests.',
        status: 'To Do',
        priority: 'High',
        assignee: 'Admin',
        assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
        members: ['Admin', 'Security'],
        dueDate: '29 Jul',
        labels: ['Deployment', 'DevOps'],
        team: 'DevOps',
        reporter: userName,
        order: 2,
        projectId: homepageProject._id,
        userId,
      },
      // Doing
      {
        title: 'Code Review Completed',
        description: 'Review pull requests for subtask table and real-time comment threads.',
        status: 'Doing',
        priority: 'High',
        assignee: 'Admin',
        assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
        members: ['Admin', 'Lead'],
        dueDate: '29 Jul',
        labels: ['Deployment', 'Review'],
        team: 'Engineering',
        reporter: userName,
        order: 0,
        projectId: homepageProject._id,
        userId,
      },
      {
        title: 'Design Mockups Finalized',
        description: 'Finalize Figma design tokens, color modes (Amber, Blue, Pink, Rose, Emerald, Black), and dark mode contrast.',
        status: 'Doing',
        priority: 'High',
        assignee: 'Admin',
        assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
        members: ['Designer', 'Admin'],
        dueDate: '29 Jul',
        labels: ['Deployment', 'Design'],
        team: 'Design',
        reporter: userName,
        order: 1,
        projectId: homepageProject._id,
        userId,
      },
      // Completed
      {
        title: 'Feature Testing Passed',
        description: 'End-to-end Cypress and manual QA pass for guest authentication and theme toggle persistence.',
        status: 'Completed',
        priority: 'Low',
        assignee: 'QA Team',
        assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=QATeam',
        members: ['QA Team'],
        dueDate: '30 Jul',
        labels: ['Testing', 'Passed'],
        team: 'QA',
        reporter: userName,
        order: 0,
        projectId: homepageProject._id,
        userId,
      },
      {
        title: 'UI Design Updated',
        description: 'Align button border radii, field dropdown spacing, and priority signal bar icons.',
        status: 'Completed',
        priority: 'Low',
        assignee: 'Designer',
        assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Designer',
        members: ['Designer'],
        dueDate: '31 Jul',
        labels: ['Design', 'Updated'],
        team: 'Design',
        reporter: userName,
        order: 1,
        projectId: homepageProject._id,
        userId,
      },
      {
        title: 'Security Audit Scheduled',
        description: 'Conduct OWASP top 10 checklist, sanitize query parameters, and audit JWT signature expiration.',
        status: 'Completed',
        priority: 'High',
        assignee: 'Security',
        assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Security',
        members: ['Security'],
        dueDate: '01 Aug',
        labels: ['Audit', 'Scheduled'],
        team: 'Security',
        reporter: userName,
        order: 2,
        projectId: homepageProject._id,
        userId,
      },
      // On Hold
      {
        title: 'UI Review Pending',
        description: 'Waiting for stakeholder approval on the multi-theme palette switcher.',
        status: 'On Hold',
        priority: 'Medium',
        assignee: 'Designer',
        assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Designer',
        members: ['Designer'],
        dueDate: '02 Aug',
        labels: ['Review', 'Design'],
        team: 'Design',
        reporter: userName,
        order: 0,
        projectId: homepageProject._id,
        userId,
      },
      {
        title: 'Backend Refactoring',
        description: 'Extract Mongoose schema logic into shared module DTOs with Class-Validator.',
        status: 'On Hold',
        priority: 'Medium',
        assignee: 'Dev Team',
        assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DevTeam',
        members: ['Dev Team'],
        dueDate: '03 Aug',
        labels: ['Development'],
        team: 'Engineering',
        reporter: userName,
        order: 1,
        projectId: homepageProject._id,
        userId,
      },
      {
        title: 'User Feedback Collection',
        description: 'Collect telemetry and usability feedback from AbleSpace caseload screen survey.',
        status: 'On Hold',
        priority: 'Low',
        assignee: 'Product Lead',
        assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ProductLead',
        members: ['Product Lead'],
        dueDate: '05 Aug',
        labels: ['Research'],
        team: 'Product',
        reporter: userName,
        order: 2,
        projectId: homepageProject._id,
        userId,
      },
      {
        title: 'Performance Tuning',
        description: 'Optimize Next.js 15 bundle size and implement virtualization for high-volume task lists.',
        status: 'On Hold',
        priority: 'High',
        assignee: 'Engineering',
        assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Engineering',
        members: ['Engineering'],
        dueDate: '08 Aug',
        labels: ['Optimization'],
        team: 'Engineering',
        reporter: userName,
        order: 3,
        projectId: homepageProject._id,
        userId,
      },
    ];

    const createdTasks = await this.taskModel.insertMany(tasksData);

    // 3. Add Subtasks to "Write API Documentation" Task
    const docTask = createdTasks[0];
    if (docTask) {
      await this.subtaskModel.insertMany([
        {
          title: 'Subtask 1: Define Swagger OpenAPI spec',
          taskId: docTask._id,
          completed: false,
          priority: 'High',
          assignee: 'Dexter',
          assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter',
          dueDate: '12 Sep 2026',
          order: 0,
        },
        {
          title: 'Subtask 2: Write Authentication endpoint docs',
          taskId: docTask._id,
          completed: false,
          priority: 'Low',
          assignee: 'CN',
          assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CN',
          dueDate: '15 Sep 2026',
          order: 1,
        },
        {
          title: 'Subtask 3: Add code snippets for curl & TypeScript',
          taskId: docTask._id,
          completed: false,
          priority: 'Medium',
          assignee: 'Alex',
          assigneeAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
          dueDate: '18 Sep 2026',
          order: 2,
        },
      ]);

      // 4. Add Initial Comments & Activity
      await this.commentModel.create({
        taskId: docTask._id,
        authorName: 'Ankit Dutta',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ankit',
        authorEmail: 'ankit@example.com',
        content: 'Please ensure all DTO validation constraints are documented in the OpenAPI schemas.',
        reactions: ['👍', '🎉'],
      });

      // 5. Add Audit Logs (Right Sidebar Feed)
      await this.auditLogModel.insertMany([
        {
          taskId: docTask._id,
          userName: 'You',
          userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter',
          action: 'changed priority from No priority to Urgent',
        },
        {
          taskId: docTask._id,
          userName: 'You',
          userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter',
          action: 'posted an update - Aug 2026',
        },
      ]);
    }
  }
}
