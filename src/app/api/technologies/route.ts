import { NextRequest, NextResponse } from 'next/server';
import { getAllTechnologies, getTechnologyByName, getRelatedTechnologies, getMostConnectedTechnologies } from '@/lib/queries/technologies';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const relatedTo = searchParams.get('relatedTo');
    const hopsStr = searchParams.get('hops');
    const popular = searchParams.get('popular');

    if (popular === 'true') {
      const topTechs = await getMostConnectedTechnologies(10);
      return NextResponse.json(topTechs);
    }

    if (relatedTo) {
      const hops = hopsStr ? parseInt(hopsStr, 10) : 2;
      const related = await getRelatedTechnologies(relatedTo, hops);
      return NextResponse.json(related);
    }

    if (name) {
      const techDetails = await getTechnologyByName(name);
      if (!techDetails) {
        return NextResponse.json({ error: 'Technology not found' }, { status: 404 });
      }
      return NextResponse.json(techDetails);
    }

    const technologies = await getAllTechnologies();
    return NextResponse.json(technologies);
  } catch (error) {
    console.error('API /api/technologies Error:', (error as Error).message);
    return NextResponse.json(
      { error: 'Failed to retrieve technology data' },
      { status: 500 }
    );
  }
}
