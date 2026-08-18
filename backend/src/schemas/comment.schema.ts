import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'Task', required: true, index: true })
  taskId: Types.ObjectId;

  @Prop({ required: true, default: 'Ankit Dutta' })
  authorName: string;

  @Prop({ default: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ankit' })
  authorAvatar: string;

  @Prop({ default: '' })
  authorEmail: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: [] })
  reactions: string[];

  @Prop({ default: [] })
  attachments: string[];

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  parentId: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
