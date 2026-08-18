import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ 
    default: 'To Do', 
    enum: ['To Do', 'Doing', 'Completed', 'On Hold', 'Backlog'] 
  })
  status: string;

  @Prop({ 
    default: 'High', 
    enum: ['No Priority', 'Urgent', 'High', 'Medium', 'Low'] 
  })
  priority: string;

  @Prop({ default: 'Admin' })
  assignee: string;

  @Prop({ default: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin' })
  assigneeAvatar: string;

  @Prop({ default: [] })
  members: string[];

  @Prop({ default: '29 Jul' })
  dueDate: string;

  @Prop({ default: '' })
  startDate: string;

  @Prop({ default: ['Deployment'] })
  labels: string[];

  @Prop({ default: 'Engineering' })
  team: string;

  @Prop({ default: 'Dexter' })
  reporter: string;

  @Prop({ default: false })
  isLocked: boolean;

  @Prop({ default: 1 })
  watchers: number;

  @Prop({ default: 0 })
  order: number;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
