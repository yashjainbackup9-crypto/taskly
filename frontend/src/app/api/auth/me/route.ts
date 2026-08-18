import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../server/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      theme: user.theme,
      colorMode: user.colorMode,
      role: user.role,
    });
  } catch (error: any) {
    console.error('/auth/me error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
