import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../server/db';
import { UserModel } from '../../../../server/models';
import { signToken } from '../../../../server/auth';
import { seedUserData } from '../../../../server/seed';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, name, avatar, googleId } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Google email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      user = await UserModel.create({
        name: name || 'User',
        email: normalizedEmail,
        googleId,
        avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || 'User')}`,
        role: 'Admin',
      });
      await seedUserData(user._id, user.name, false);
    } else if (googleId && !user.googleId) {
      user.googleId = googleId;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
    }

    const token = signToken({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({
      accessToken: token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        theme: user.theme,
        colorMode: user.colorMode,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Google auth error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
