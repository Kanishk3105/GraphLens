import { NextRequest, NextResponse } from 'next/server';
import { getAllSkills, getSkillsByTechnology, getSkillsForProject } from '@/lib/queries/skills';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tech = searchParams.get('tech');
    const project = searchParams.get('project');

    if (project) {
      const skills = await getSkillsForProject(project);
      return NextResponse.json(skills);
    }

    if (tech) {
      const skills = await getSkillsByTechnology(tech);
      return NextResponse.json(skills);
    }

    const skills = await getAllSkills();
    return NextResponse.json(skills);
  } catch (error) {
    console.error('API /api/skills Error:', (error as Error).message);
    return NextResponse.json(
      { error: 'Failed to retrieve skills data' },
      { status: 500 }
    );
  }
}
