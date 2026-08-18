import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: 'Design Homepage' })
  slug: string;

  @Prop({ default: 'High', enum: ['Urgent', 'High', 'Medium', 'Low', 'No Priority'] })
  priority: string;

  @Prop({ default: 'Dexter' })
  lead: string;

  @Prop({ default: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter' })
  leadAvatar: string;

  @Prop({ default: '12 Sep 2026' })
  dueDate: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  ownerId: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
