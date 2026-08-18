import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../server/auth';
import { ProjectModel } from '../../../server/models';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await ProjectModel.find({ userId: user._id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      projects.map(p => ({
        id: p._id.toString(),
        name: p.name,
        key: p.key,
        description: p.description,
        priority: p.priority,
        lead: p.lead,
        leadAvatar: p.leadAvatar,
        dueDate: p.dueDate,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }))
    );
  } catch (error: any) {
    console.error('GET /projects error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const leadName = body.lead || user.name || 'Dexter';
    const project = await ProjectModel.create({
      ...body,
      userId: user._id,
      lead: leadName,
      leadAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(leadName)}`,
    });

    return NextResponse.json({
      id: project._id.toString(),
      name: project.name,
      key: project.key,
      description: project.description,
      priority: project.priority,
      lead: project.lead,
      leadAvatar: project.leadAvatar,
      dueDate: project.dueDate,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }, { status: 201 });
  } catch (error: any) {
    console.error('POST /projects error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
