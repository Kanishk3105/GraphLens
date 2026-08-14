import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, getProjectById, getProjectsUsingTechnology } from '@/lib/queries/projects';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    const tech = searchParams.get('tech');

    if (idStr) {
      const id = parseInt(idStr, 10);
      if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
      }
      const project = await getProjectById(id);
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json(project);
    }

    if (tech) {
      const projects = await getProjectsUsingTechnology(tech);
      return NextResponse.json(projects);
    }

    const projects = await getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('API /api/projects Error:', (error as Error).message);
    return NextResponse.json(
      { error: 'Failed to retrieve project data' },
      { status: 500 }
    );
  }
}
