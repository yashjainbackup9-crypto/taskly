import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../server/auth';
import { UserModel } from '../../../../server/models';

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { colorMode } = await req.json();

    const updated = await UserModel.findByIdAndUpdate(
      user._id,
      { colorMode: colorMode || 'indigo' },
      { new: true }
    );

    return NextResponse.json({
      colorMode: updated!.colorMode,
    });
  } catch (error: any) {
    console.error('PUT /users/color-mode error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
