import { NextRequest, NextResponse } from 'next/server';
import { findPathBetweenNodes } from '@/lib/queries/graph';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startStr = searchParams.get('start');
    const endStr = searchParams.get('end');

    if (!startStr || !endStr) {
      return NextResponse.json(
        { error: 'Both start and end node IDs are required' },
        { status: 400 }
      );
    }

    const startId = parseInt(startStr, 10);
    const endId = parseInt(endStr, 10);

    if (isNaN(startId) || isNaN(endId)) {
      return NextResponse.json({ error: 'Invalid start or end node ID' }, { status: 400 });
    }

    const path = await findPathBetweenNodes(startId, endId);
    if (!path) {
      return NextResponse.json({ message: 'No path found between the specified nodes', path: null }, { status: 200 });
    }

    return NextResponse.json(path);
  } catch (error) {
    console.error('API /api/path Error:', (error as Error).message);
    return NextResponse.json(
      { error: 'Path traversal query failed' },
      { status: 500 }
    );
  }
}
