import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ default: '' })
  username: string;

  @Prop({ default: 'Product Designer' })
  title: string;

  @Prop({ default: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter' })
  avatar: string;

  @Prop({ default: false })
  isGuest: boolean;

  @Prop({ default: '' })
  passwordHash: string;

  @Prop({ default: '' })
  googleId: string;

  @Prop({ default: 'light', enum: ['light', 'dark'] })
  theme: string;

  @Prop({ default: 'blue', enum: ['amber', 'blue', 'pink', 'rose', 'emerald', 'black'] })
  colorMode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
