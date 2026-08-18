import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../server/auth';
import { TaskModel, SubtaskModel, AuditLogModel } from '../../../../../../server/models';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, subtaskId } = await params;
    const body = await req.json();

    const task = await TaskModel.findOne({ _id: id, userId: user._id });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updatedSubtask = await SubtaskModel.findOneAndUpdate(
      { _id: subtaskId, taskId: task._id },
      {
        ...body,
        ...(body.assignee
          ? {
              assigneeAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(body.assignee)}`,
            }
          : {}),
      },
      { new: true }
    );

    if (body.completed !== undefined) {
      await AuditLogModel.create({
        action: body.completed
          ? `Completed subtask "${updatedSubtask?.title}"`
          : `Reopened subtask "${updatedSubtask?.title}"`,
        actor: user.name || 'You',
        actorAvatar: user.avatar,
        taskId: task._id,
      });
    }

    return NextResponse.json({
      id: updatedSubtask!._id.toString(),
      title: updatedSubtask!.title,
      completed: updatedSubtask!.completed,
      priority: updatedSubtask!.priority,
      assignee: updatedSubtask!.assignee,
      assigneeAvatar: updatedSubtask!.assigneeAvatar,
      dueDate: updatedSubtask!.dueDate,
    });
  } catch (error: any) {
    console.error('PUT /tasks/:id/subtasks/:subtaskId error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, subtaskId } = await params;
    const task = await TaskModel.findOne({ _id: id, userId: user._id });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    await SubtaskModel.deleteOne({ _id: subtaskId, taskId: task._id });

    return NextResponse.json({ message: 'Subtask deleted successfully' });
  } catch (error: any) {
    console.error('DELETE /tasks/:id/subtasks/:subtaskId error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
