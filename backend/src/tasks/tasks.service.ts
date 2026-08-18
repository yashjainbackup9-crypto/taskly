import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { Subtask, SubtaskDocument } from '../schemas/subtask.schema';
import { Comment, CommentDocument } from '../schemas/comment.schema';
import { AuditLog, AuditLogDocument } from '../schemas/audit-log.schema';
import { CreateTaskDto, UpdateTaskDto, CreateSubtaskDto, UpdateSubtaskDto, CreateCommentDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Subtask.name) private subtaskModel: Model<SubtaskDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async findAll(userId: string, query: { status?: string; priority?: string; search?: string; projectId?: string }): Promise<any[]> {
    const filter: any = { userId: new Types.ObjectId(userId) };

    if (query.status) {
      filter.status = query.status;
    }
    if (query.priority) {
      filter.priority = query.priority;
    }
    if (query.projectId) {
      filter.projectId = new Types.ObjectId(query.projectId);
    }
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { labels: { $regex: query.search, $options: 'i' } },
        { assignee: { $regex: query.search, $options: 'i' } },
      ];
    }

    const tasks = await this.taskModel.find(filter).sort({ order: 1, createdAt: -1 }).lean().exec();

    // Fetch subtask counts & previews for all tasks
    const taskIds = tasks.map(t => t._id);
    const subtasks = await this.subtaskModel.find({ taskId: { $in: taskIds } }).lean().exec();
    const comments = await this.commentModel.find({ taskId: { $in: taskIds } }).lean().exec();

    return tasks.map(t => {
      const taskSubtasks = subtasks.filter(s => s.taskId.toString() === t._id.toString());
      const taskComments = comments.filter(c => c.taskId.toString() === t._id.toString());
      return {
        ...t,
        id: t._id.toString(),
        subtaskCount: taskSubtasks.length,
        subtasksCompleted: taskSubtasks.filter(s => s.completed).length,
        commentCount: taskComments.length,
      };
    });
  }

  async findOne(id: string, userId: string): Promise<any> {
    const task = await this.taskModel.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).lean().exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const subtasks = await this.subtaskModel.find({ taskId: task._id }).sort({ order: 1, createdAt: 1 }).lean().exec();
    const comments = await this.commentModel.find({ taskId: task._id }).sort({ createdAt: 1 }).lean().exec();
    const auditLogs = await this.auditLogModel.find({ taskId: task._id }).sort({ createdAt: -1 }).lean().exec();

    return {
      ...task,
      id: task._id.toString(),
      subtasks: subtasks.map(s => ({ ...s, id: s._id.toString() })),
      comments: comments.map(c => ({ ...c, id: c._id.toString() })),
      auditLogs: auditLogs.map(a => ({ ...a, id: a._id.toString() })),
    };
  }

  async create(dto: CreateTaskDto, userId: string, userName: string): Promise<any> {
    const count = await this.taskModel.countDocuments({ userId: new Types.ObjectId(userId), status: dto.status || 'To Do' });

    const task = await this.taskModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
      projectId: dto.projectId ? new Types.ObjectId(dto.projectId) : undefined,
      reporter: userName,
      order: count,
    });

    // Create Audit Log
    await this.auditLogModel.create({
      taskId: task._id,
      userName: userName || 'You',
      userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter',
      action: 'created this task',
    });

    return {
      ...task.toObject(),
      id: task._id.toString(),
      subtasks: [],
      comments: [],
      auditLogs: [],
    };
  }

  async update(id: string, dto: UpdateTaskDto, userId: string, userName: string): Promise<any> {
    const existing = await this.taskModel.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) });
    if (!existing) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Track meaningful changes for audit log
    if (dto.priority && dto.priority !== existing.priority) {
      await this.auditLogModel.create({
        taskId: existing._id,
        userName: userName || 'You',
        action: `changed priority from ${existing.priority} to ${dto.priority}`,
      });
    }

    if (dto.status && dto.status !== existing.status) {
      await this.auditLogModel.create({
        taskId: existing._id,
        userName: userName || 'You',
        action: `moved task from ${existing.status} to ${dto.status}`,
      });
    }

    if (dto.members && JSON.stringify(dto.members) !== JSON.stringify(existing.members)) {
      await this.auditLogModel.create({
        taskId: existing._id,
        userName: userName || 'You',
        action: `updated members to ${dto.members.length > 0 ? dto.members.join(', ') : 'none'}`,
      });
    }

    const updated = await this.taskModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        projectId: dto.projectId ? new Types.ObjectId(dto.projectId) : existing.projectId,
      },
      { new: true }
    ).lean().exec();

    const subtasks = await this.subtaskModel.find({ taskId: existing._id }).sort({ order: 1, createdAt: 1 }).lean().exec();
    const comments = await this.commentModel.find({ taskId: existing._id }).sort({ createdAt: 1 }).lean().exec();
    const auditLogs = await this.auditLogModel.find({ taskId: existing._id }).sort({ createdAt: -1 }).lean().exec();

    return {
      ...updated,
      id: updated._id.toString(),
      subtasks: subtasks.map(s => ({ ...s, id: s._id.toString() })),
      comments: comments.map(c => ({ ...c, id: c._id.toString() })),
      auditLogs: auditLogs.map(a => ({ ...a, id: a._id.toString() })),
    };
  }

  async delete(id: string, userId: string): Promise<any> {
    const task = await this.taskModel.findOneAndDelete({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.subtaskModel.deleteMany({ taskId: task._id });
    await this.commentModel.deleteMany({ taskId: task._id });
    await this.auditLogModel.deleteMany({ taskId: task._id });

    return { success: true, message: 'Task deleted successfully' };
  }

  // --- Subtask Methods ---

  async addSubtask(taskId: string, dto: CreateSubtaskDto, userId: string, userName: string): Promise<any> {
    const task = await this.taskModel.findOne({ _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(userId) });
    if (!task) throw new NotFoundException('Task not found');

    const count = await this.subtaskModel.countDocuments({ taskId: task._id });
    const subtask = await this.subtaskModel.create({
      ...dto,
      taskId: task._id,
      order: count,
    });

    await this.auditLogModel.create({
      taskId: task._id,
      userName: userName || 'You',
      action: `added subtask "${dto.title}"`,
    });

    return {
      ...subtask.toObject(),
      id: subtask._id.toString(),
    };
  }

  async updateSubtask(taskId: string, subtaskId: string, dto: UpdateSubtaskDto): Promise<any> {
    const subtask = await this.subtaskModel.findOneAndUpdate(
      { _id: new Types.ObjectId(subtaskId), taskId: new Types.ObjectId(taskId) },
      dto,
      { new: true }
    ).lean().exec();

    if (!subtask) throw new NotFoundException('Subtask not found');

    return {
      ...subtask,
      id: subtask._id.toString(),
    };
  }

  async deleteSubtask(taskId: string, subtaskId: string): Promise<any> {
    const res = await this.subtaskModel.findOneAndDelete({
      _id: new Types.ObjectId(subtaskId),
      taskId: new Types.ObjectId(taskId),
    });

    if (!res) throw new NotFoundException('Subtask not found');
    return { success: true };
  }

  // --- Comments Methods ---

  async addComment(taskId: string, dto: CreateCommentDto, user: any): Promise<any> {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    const comment = await this.commentModel.create({
      taskId: task._id,
      authorName: user.name || dto.authorName || 'Ankit Dutta',
      authorAvatar: user.avatar || dto.authorAvatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Ankit',
      authorEmail: user.email || '',
      content: dto.content,
      reactions: dto.reactions || [],
      parentId: dto.parentId ? new Types.ObjectId(dto.parentId) : null,
    });

    await this.auditLogModel.create({
      taskId: task._id,
      userName: user.name || 'You',
      action: 'posted a comment',
      details: dto.content.substring(0, 40),
    });

    return {
      ...comment.toObject(),
      id: comment._id.toString(),
    };
  }

  async toggleReaction(taskId: string, commentId: string, emoji: string): Promise<any> {
    const comment = await this.commentModel.findOne({
      _id: new Types.ObjectId(commentId),
      taskId: new Types.ObjectId(taskId),
    });
    if (!comment) throw new NotFoundException('Comment not found');

    let reactions = [...(comment.reactions || [])];
    if (reactions.includes(emoji)) {
      reactions = reactions.filter(r => r !== emoji);
    } else {
      reactions.push(emoji);
    }

    comment.reactions = reactions;
    await comment.save();

    return {
      ...comment.toObject(),
      id: comment._id.toString(),
    };
  }
}
