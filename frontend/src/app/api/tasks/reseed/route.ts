import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../server/auth';
import { seedUserData } from '../../../../server/seed';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await seedUserData(user._id, user.name, true);

    return NextResponse.json({ message: 'Sample Figma data reseeded successfully' });
  } catch (error: any) {
    console.error('POST /tasks/reseed error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
