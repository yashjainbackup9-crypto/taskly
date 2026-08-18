import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubtaskDocument = Subtask & Document;

@Schema({ timestamps: true })
export class Subtask {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Task', required: true, index: true })
  taskId: Types.ObjectId;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ default: 'High', enum: ['No Priority', 'Urgent', 'High', 'Medium', 'Low'] })
  priority: string;

  @Prop({ default: 'Dexter' })
  assignee: string;

  @Prop({ default: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter' })
  assigneeAvatar: string;

  @Prop({ default: '12 Sep 2026' })
  dueDate: string;

  @Prop({ default: 0 })
  order: number;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);
