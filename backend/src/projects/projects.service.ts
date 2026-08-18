import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from '../schemas/project.schema';
import { Task, TaskDocument } from '../schemas/task.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async findAll(userId: string): Promise<any[]> {
    const projects = await this.projectModel.find({ ownerId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).lean().exec();
    
    // Fetch task counts per project
    const projectIds = projects.map(p => p._id);
    const tasks = await this.taskModel.find({ projectId: { $in: projectIds } }).lean().exec();

    return projects.map(p => {
      const projectTasks = tasks.filter(t => t.projectId && t.projectId.toString() === p._id.toString());
      return {
        ...p,
        id: p._id.toString(),
        taskCount: projectTasks.length,
        completedTaskCount: projectTasks.filter(t => t.status === 'Completed').length,
      };
    });
  }

  async findOne(id: string, userId: string): Promise<any> {
    const project = await this.projectModel.findOne({ _id: new Types.ObjectId(id), ownerId: new Types.ObjectId(userId) }).lean().exec();
    if (!project) throw new NotFoundException('Project not found');

    const tasks = await this.taskModel.find({ projectId: project._id }).lean().exec();

    return {
      ...project,
      id: project._id.toString(),
      tasks: tasks.map(t => ({ ...t, id: t._id.toString() })),
    };
  }

  async create(data: Partial<Project>, userId: string, userName: string): Promise<any> {
    const project = await this.projectModel.create({
      ...data,
      lead: data.lead || userName || 'Dexter',
      leadAvatar: data.leadAvatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter',
      ownerId: new Types.ObjectId(userId),
    });

    return {
      ...project.toObject(),
      id: project._id.toString(),
      taskCount: 0,
      completedTaskCount: 0,
    };
  }

  async update(id: string, data: Partial<Project>, userId: string): Promise<any> {
    const project = await this.projectModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ownerId: new Types.ObjectId(userId) },
      data,
      { new: true }
    ).lean().exec();

    if (!project) throw new NotFoundException('Project not found');

    return {
      ...project,
      id: project._id.toString(),
    };
  }

  async delete(id: string, userId: string): Promise<any> {
    const project = await this.projectModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      ownerId: new Types.ObjectId(userId),
    });

    if (!project) throw new NotFoundException('Project not found');
    return { success: true };
  }
}
