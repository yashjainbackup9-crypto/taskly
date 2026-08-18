import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async updateProfile(userId: string, data: { name?: string; email?: string; title?: string; username?: string; avatar?: string }) {
    const user = await this.userModel.findByIdAndUpdate(
      new Types.ObjectId(userId),
      { ...data },
      { new: true }
    ).lean().exec();

    if (!user) throw new NotFoundException('User not found');

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      username: user.username,
      title: user.title,
      avatar: user.avatar,
      isGuest: user.isGuest,
      theme: user.theme,
      colorMode: user.colorMode,
    };
  }

  async updateTheme(userId: string, theme: string) {
    const user = await this.userModel.findByIdAndUpdate(
      new Types.ObjectId(userId),
      { theme },
      { new: true }
    ).lean().exec();

    if (!user) throw new NotFoundException('User not found');

    return { theme: user.theme };
  }

  async updateColorMode(userId: string, colorMode: string) {
    const user = await this.userModel.findByIdAndUpdate(
      new Types.ObjectId(userId),
      { colorMode },
      { new: true }
    ).lean().exec();

    if (!user) throw new NotFoundException('User not found');

    return { colorMode: user.colorMode };
  }
}
