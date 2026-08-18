import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../server/auth';
import { TaskModel, SubtaskModel, AuditLogModel } from '../../../../../server/models';

export async function POST(
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

    const task = await TaskModel.findOne({ _id: id, userId: user._id });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const subtask = await SubtaskModel.create({
      title: body.title,
      priority: body.priority || 'Medium',
      assignee: body.assignee || 'Unassigned',
      assigneeAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(body.assignee || 'Unassigned')}`,
      dueDate: body.dueDate || '',
      taskId: task._id,
    });

    await AuditLogModel.create({
      action: `Added subtask "${subtask.title}"`,
      actor: user.name || 'You',
      actorAvatar: user.avatar,
      taskId: task._id,
    });

    return NextResponse.json({
      id: subtask._id.toString(),
      title: subtask.title,
      completed: subtask.completed,
      priority: subtask.priority,
      assignee: subtask.assignee,
      assigneeAvatar: subtask.assigneeAvatar,
      dueDate: subtask.dueDate,
    }, { status: 201 });
  } catch (error: any) {
    console.error('POST /tasks/:id/subtasks error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
