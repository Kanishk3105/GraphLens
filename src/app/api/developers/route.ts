import { NextRequest, NextResponse } from 'next/server';
import { getAllDevelopers, getDeveloperById, getDeveloperRecommendations } from '@/lib/queries/developers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    const recommendations = searchParams.get('recommendations');

    if (idStr) {
      const id = parseInt(idStr, 10);
      if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
      }

      if (recommendations === 'true') {
        const recs = await getDeveloperRecommendations(id);
        return NextResponse.json(recs);
      }

      const dev = await getDeveloperById(id);
      if (!dev) {
        return NextResponse.json({ error: 'Developer not found' }, { status: 404 });
      }
      return NextResponse.json(dev);
    }

    const developers = await getAllDevelopers();
    return NextResponse.json(developers);
  } catch (error) {
    console.error('API /api/developers Error:', (error as Error).message);
    return NextResponse.json(
      { error: 'Failed to retrieve developer data' },
      { status: 500 }
    );
  }
}
