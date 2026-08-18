import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../server/db';
import { UserModel } from '../../../../server/models';
import { signToken } from '../../../../server/auth';
import { seedUserData } from '../../../../server/seed';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const guestId = body.guestId || Math.random().toString(36).substring(2, 9);
    const guestEmail = `guest_${guestId}@taskly.local`;

    let user = await UserModel.findOne({ email: guestEmail });

    if (!user) {
      user = await UserModel.create({
        name: body.name || 'Dexter',
        email: guestEmail,
        isGuest: true,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(body.name || 'Dexter')}`,
        role: 'Admin',
      });
      await seedUserData(user._id, user.name, false);
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
    console.error('Guest auth error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
