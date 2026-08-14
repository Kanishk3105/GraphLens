import { NextRequest, NextResponse } from 'next/server';
import { searchNodes } from '@/lib/queries/graph';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const limitStr = searchParams.get('limit');

    if (!q || q.trim().length === 0) {
      return NextResponse.json([]);
    }

    const limit = limitStr ? parseInt(limitStr, 10) : 20;
    const results = await searchNodes(q.trim(), limit);
    return NextResponse.json(results);
  } catch (error) {
    console.error('API /api/search Error:', (error as Error).message);
    return NextResponse.json(
      { error: 'Search query execution failed' },
      { status: 500 }
    );
  }
}
