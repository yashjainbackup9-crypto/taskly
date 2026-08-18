import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ type: Types.ObjectId, ref: 'Task', required: true, index: true })
  taskId: Types.ObjectId;

  @Prop({ default: 'You' })
  userName: string;

  @Prop({ default: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter' })
  userAvatar: string;

  @Prop({ required: true })
  action: string;

  @Prop({ default: '' })
  details: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
