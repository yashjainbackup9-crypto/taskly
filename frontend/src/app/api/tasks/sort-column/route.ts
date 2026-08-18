import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../server/auth';
import { TaskModel, SubtaskModel, CommentModel } from '../../../../server/models';

const PRIORITY_MAP: Record<string, number> = {
  Urgent: 1,
  High: 2,
  Medium: 3,
  Low: 4,
  'No Priority': 5,
};

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, sortBy, direction = 'asc' } = await req.json();

    const columnTasks = await TaskModel.find({ userId: user._id, status }).lean();

    columnTasks.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'priority') {
        const pA = PRIORITY_MAP[a.priority] || 99;
        const pB = PRIORITY_MAP[b.priority] || 99;
        comparison = pA - pB;
      } else if (sortBy === 'dueDate') {
        comparison = (a.dueDate || '').localeCompare(b.dueDate || '');
      } else if (sortBy === 'title') {
        comparison = (a.title || '').localeCompare(b.title || '');
      }
      return direction === 'desc' ? -comparison : comparison;
    });

    const bulkOps = columnTasks.map((task, index) => ({
      updateOne: {
        filter: { _id: task._id },
        update: { $set: { order: index } },
      },
    }));

    if (bulkOps.length > 0) {
      await TaskModel.bulkWrite(bulkOps);
    }

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
    console.error('PUT /tasks/sort-column error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
