import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getAuthenticatedUser } from '../../../../server/auth';
import { ProjectModel, TaskModel } from '../../../../server/models';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    const project = await ProjectModel.findOne({ _id: id, userId: user._id }).lean();
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

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
    });
  } catch (error: any) {
    console.error('GET /projects/:id error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await ProjectModel.findOneAndUpdate(
      { _id: id, userId: user._id },
      {
        ...body,
        ...(body.lead
          ? {
              leadAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(body.lead)}`,
            }
          : {}),
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: updated._id.toString(),
      ...updated,
    });
  } catch (error: any) {
    console.error('PUT /projects/:id error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await Promise.all([
      ProjectModel.deleteOne({ _id: id, userId: user._id }),
      TaskModel.updateMany({ projectId: id, userId: user._id }, { $unset: { projectId: 1 } }),
    ]);

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    console.error('DELETE /projects/:id error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
