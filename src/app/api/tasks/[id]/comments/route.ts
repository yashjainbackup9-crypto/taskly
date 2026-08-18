import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../server/auth';
import { TaskModel, CommentModel, AuditLogModel } from '../../../../../server/models';

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
    const { content, parentId, attachments = [] } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    const task = await TaskModel.findOne({ _id: id, userId: user._id });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const comment = await CommentModel.create({
      content,
      author: user.name || 'Dexter',
      authorAvatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || 'Dexter')}`,
      taskId: task._id,
      parentId: parentId || undefined,
      attachments,
      reactions: {},
    });

    await AuditLogModel.create({
      action: 'You posted an update',
      actor: user.name || 'You',
      actorAvatar: user.avatar,
      taskId: task._id,
    });

    return NextResponse.json({
      id: comment._id.toString(),
      content: comment.content,
      author: comment.author,
      authorAvatar: comment.authorAvatar,
      parentId: comment.parentId?.toString(),
      attachments: comment.attachments,
      reactions: {},
      createdAt: comment.createdAt,
    }, { status: 201 });
  } catch (error: any) {
    console.error('POST /tasks/:id/comments error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
