import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../server/auth';
import { UserModel } from '../../../../server/models';

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, avatar } = await req.json();

    const updated = await UserModel.findByIdAndUpdate(
      user._id,
      {
        ...(name ? { name } : {}),
        ...(avatar ? { avatar } : {}),
      },
      { new: true }
    );

    return NextResponse.json({
      id: updated!._id.toString(),
      name: updated!.name,
      email: updated!.email,
      avatar: updated!.avatar,
      theme: updated!.theme,
      colorMode: updated!.colorMode,
      role: updated!.role,
    });
  } catch (error: any) {
    console.error('PUT /users/profile error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
