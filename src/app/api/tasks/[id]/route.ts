import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getAuthenticatedUser } from '../../../../server/auth';
import { TaskModel, SubtaskModel, CommentModel, AuditLogModel } from '../../../../server/models';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const task = await TaskModel.findOne({ _id: id, userId: user._id }).lean();
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const [subtasks, comments, auditLogs] = await Promise.all([
      SubtaskModel.find({ taskId: task._id }).sort({ createdAt: 1 }).lean(),
      CommentModel.find({ taskId: task._id }).sort({ createdAt: 1 }).lean(),
      AuditLogModel.find({ taskId: task._id }).sort({ createdAt: -1 }).lean(),
    ]);

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
      subtaskCount: subtasks.length,
      subtasksCompleted: subtasks.filter(s => s.completed).length,
      subtasks: subtasks.map(s => ({
        id: s._id.toString(),
        title: s.title,
        completed: s.completed,
        priority: s.priority,
        assignee: s.assignee,
        assigneeAvatar: s.assigneeAvatar,
        dueDate: s.dueDate,
      })),
      comments: comments.map(c => ({
        id: c._id.toString(),
        content: c.content,
        author: c.author,
        authorAvatar: c.authorAvatar,
        parentId: c.parentId?.toString(),
        attachments: c.attachments || [],
        reactions: c.reactions || {},
        createdAt: c.createdAt,
      })),
      auditLogs: auditLogs.map(a => ({
        id: a._id.toString(),
        action: a.action,
        actor: a.actor,
        actorAvatar: a.actorAvatar,
        details: a.details,
        createdAt: a.createdAt,
      })),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  } catch (error: any) {
    console.error('GET /tasks/:id error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existingTask = await TaskModel.findOne({ _id: id, userId: user._id });
    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (body.priority && body.priority !== existingTask.priority) {
      await AuditLogModel.create({
        action: `You changed priority from ${existingTask.priority} to ${body.priority}`,
        actor: user.name || 'You',
        actorAvatar: user.avatar,
        taskId: existingTask._id,
      });
    }

    if (body.status && body.status !== existingTask.status) {
      await AuditLogModel.create({
        action: `You moved task to ${body.status}`,
        actor: user.name || 'You',
        actorAvatar: user.avatar,
        taskId: existingTask._id,
      });
    }

    const updated = await TaskModel.findByIdAndUpdate(
      id,
      {
        ...body,
        ...(body.assignee
          ? {
              assigneeAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(body.assignee)}`,
            }
          : {}),
      },
      { new: true }
    ).lean();

    return NextResponse.json({
      id: updated!._id.toString(),
      ...updated,
    });
  } catch (error: any) {
    console.error('PUT /tasks/:id error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await Promise.all([
      TaskModel.deleteOne({ _id: id, userId: user._id }),
      SubtaskModel.deleteMany({ taskId: id }),
      CommentModel.deleteMany({ taskId: id }),
      AuditLogModel.deleteMany({ taskId: id }),
    ]);

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    console.error('DELETE /tasks/:id error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
