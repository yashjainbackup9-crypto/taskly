import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../../server/auth';
import { CommentModel } from '../../../../../../../server/models';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commentId } = await params;
    const { emoji } = await req.json();

    if (!emoji) {
      return NextResponse.json({ error: 'Emoji is required' }, { status: 400 });
    }

    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const reactions = (comment.reactions as any) || new Map();
    const currentList: string[] = reactions.get ? (reactions.get(emoji) || []) : (reactions[emoji] || []);

    const userIdentifier = user.name || 'Dexter';
    let updatedList: string[];
    if (currentList.includes(userIdentifier)) {
      updatedList = currentList.filter(u => u !== userIdentifier);
    } else {
      updatedList = [...currentList, userIdentifier];
    }

    if (reactions.set) {
      reactions.set(emoji, updatedList);
    } else {
      reactions[emoji] = updatedList;
    }

    comment.markModified('reactions');
    await comment.save();

    return NextResponse.json({
      reactions: reactions instanceof Map ? Object.fromEntries(reactions) : reactions,
    });
  } catch (error: any) {
    console.error('POST reaction error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
