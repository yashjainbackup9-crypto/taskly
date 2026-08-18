import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getAuthenticatedUser } from '../../../../server/auth';
import { TaskModel, SubtaskModel, CommentModel } from '../../../../server/models';

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId, status, targetIndex } = await req.json();
    const taskObjectId = new mongoose.Types.ObjectId(taskId);

    // 1. Get all tasks in target column
    const columnTasks = await TaskModel.find({
      userId: user._id,
      status,
      _id: { $ne: taskObjectId },
    }).sort({ order: 1 });

    const safeIndex = Math.max(0, Math.min(targetIndex, columnTasks.length));

    // Update target task
    await TaskModel.updateOne(
      { _id: taskObjectId, userId: user._id },
      { $set: { status, order: safeIndex } }
    );

    // Update orders for other tasks in column
    const bulkOps = [];
    let currentOrder = 0;
    for (let i = 0; i <= columnTasks.length; i++) {
      if (i === safeIndex) {
        currentOrder++;
      }
      if (i < columnTasks.length) {
        bulkOps.push({
          updateOne: {
            filter: { _id: columnTasks[i]._id },
            update: { $set: { order: currentOrder } },
          },
        });
        currentOrder++;
      }
    }

    if (bulkOps.length > 0) {
      await TaskModel.bulkWrite(bulkOps);
    }

    // Return updated tasks list
    const allTasks = await TaskModel.find({ userId: user._id }).sort({ order: 1, createdAt: -1 }).lean();
    const taskIds = allTasks.map(t => t._id);
    const [subtasks, comments] = await Promise.all([
      SubtaskModel.find({ taskId: { $in: taskIds } }).lean(),
      CommentModel.find({ taskId: { $in: taskIds } }).lean(),
    ]);

    const formatted = allTasks.map(t => ({
      id: t._id.toString(),
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      assignee: t.assignee,
      assigneeAvatar: t.assigneeAvatar,
      members: t.members || [],
      dueDate: t.dueDate,
      startDate: t.startDate,
      labels: t.labels || [],
      team: t.team,
      reporter: t.reporter,
      isLocked: t.isLocked,
      watchers: t.watchers,
      order: t.order,
      projectId: t.projectId?.toString(),
      subtaskCount: subtasks.filter(s => s.taskId.toString() === t._id.toString()).length,
      subtasksCompleted: subtasks.filter(s => s.taskId.toString() === t._id.toString() && s.completed).length,
      subtasks: subtasks
        .filter(s => s.taskId.toString() === t._id.toString())
        .map(s => ({
          id: s._id.toString(),
          title: s.title,
          completed: s.completed,
          priority: s.priority,
          assignee: s.assignee,
          assigneeAvatar: s.assigneeAvatar,
          dueDate: s.dueDate,
        })),
      commentCount: comments.filter(c => c.taskId.toString() === t._id.toString()).length,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error('PUT /tasks/reorder error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
