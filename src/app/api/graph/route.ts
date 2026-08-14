import { NextRequest, NextResponse } from 'next/server';
import { getFullGraph, getNodeNeighbors } from '@/lib/queries/graph';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nodeIdStr = searchParams.get('nodeId');
    const hopsStr = searchParams.get('hops');
    const limitStr = searchParams.get('limit');

    if (nodeIdStr) {
      const nodeId = parseInt(nodeIdStr, 10);
      if (isNaN(nodeId)) {
        return NextResponse.json({ error: 'Invalid nodeId parameter' }, { status: 400 });
      }
      const hops = hopsStr ? parseInt(hopsStr, 10) : 1;
      const data = await getNodeNeighbors(nodeId, hops);
      return NextResponse.json(data);
    }

    const limit = limitStr ? parseInt(limitStr, 10) : 350;
    const data = await getFullGraph(limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API /api/graph Error:', (error as Error).message);
    return NextResponse.json(
      { error: 'Failed to retrieve graph data from CognoDB' },
      { status: 500 }
    );
  }
}
