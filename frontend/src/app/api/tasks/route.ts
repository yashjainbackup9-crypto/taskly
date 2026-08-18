import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getAuthenticatedUser } from '../../../server/auth';
import { TaskModel, SubtaskModel, CommentModel, AuditLogModel } from '../../../server/models';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const members = searchParams.get('members');
    const assignee = searchParams.get('assignee');
    const projectId = searchParams.get('projectId');

    const filter: any = { userId: user._id };

    if (projectId) {
      filter.projectId = new mongoose.Types.ObjectId(projectId);
    }
    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }

    const andConditions: any[] = [];

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      andConditions.push({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { labels: searchRegex },
          { assignee: searchRegex },
        ],
      });
    }

    if (members) {
      const membersArr = members.split(',').map(m => m.trim()).filter(Boolean);
      if (membersArr.length > 0) {
        andConditions.push({
          $or: [
            { assignee: { $in: membersArr } },
            { members: { $in: membersArr } },
          ],
        });
      }
    } else if (assignee) {
      andConditions.push({ assignee });
    }

    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }

    const tasks = await TaskModel.find(filter).sort({ order: 1, createdAt: -1 }).lean();

    // Aggregate subtasks and comments counts
    const taskIds = tasks.map(t => t._id);
    const [subtasks, comments] = await Promise.all([
      SubtaskModel.find({ taskId: { $in: taskIds } }).lean(),
      CommentModel.find({ taskId: { $in: taskIds } }).lean(),
    ]);

    const formattedTasks = tasks.map(task => {
      const taskSubtasks = subtasks.filter(s => s.taskId.toString() === task._id.toString());
      const taskComments = comments.filter(c => c.taskId.toString() === task._id.toString());

      return {
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        assigneeAvatar: task.assigneeAvatar,
        members: task.members || [],
        dueDate: task.dueDate,
        startDate: task.startDate,
        labels: task.labels || [],
        team: task.team,
        reporter: task.reporter,
        isLocked: task.isLocked,
        watchers: task.watchers,
        order: task.order,
        projectId: task.projectId?.toString(),
        subtaskCount: taskSubtasks.length,
        subtasksCompleted: taskSubtasks.filter(s => s.completed).length,
        subtasks: taskSubtasks.map(s => ({
          id: s._id.toString(),
          title: s.title,
          completed: s.completed,
          priority: s.priority,
          assignee: s.assignee,
          assigneeAvatar: s.assigneeAvatar,
          dueDate: s.dueDate,
        })),
        commentCount: taskComments.length,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      };
    });

    return NextResponse.json(formattedTasks);
  } catch (error: any) {
    console.error('GET /tasks error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }

    const count = await TaskModel.countDocuments({
      userId: user._id,
      status: body.status || 'To Do',
    });

    const task = await TaskModel.create({
      ...body,
      userId: user._id,
      order: count,
      assigneeAvatar: body.assignee
        ? `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(body.assignee)}`
        : 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
    });

    await AuditLogModel.create({
      action: `Created task "${task.title}"`,
      actor: user.name || 'You',
      actorAvatar: user.avatar,
      taskId: task._id,
    });

    return NextResponse.json({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee,
      assigneeAvatar: task.assigneeAvatar,
      members: task.members || [],
      dueDate: task.dueDate,
      startDate: task.startDate,
      labels: task.labels || [],
      team: task.team,
      reporter: task.reporter,
      isLocked: task.isLocked,
      watchers: task.watchers,
      order: task.order,
      projectId: task.projectId?.toString(),
      subtaskCount: 0,
      subtasksCompleted: 0,
      subtasks: [],
      commentCount: 0,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }, { status: 201 });
  } catch (error: any) {
    console.error('POST /tasks error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
