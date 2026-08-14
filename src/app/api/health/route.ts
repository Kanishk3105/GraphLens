import { NextResponse } from 'next/server';
import { verifyConnection } from '@/lib/db/cognodb';
import { getGraphOverview } from '@/lib/queries/graph';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const serverInfo = await verifyConnection();
    const overview = await getGraphOverview();

    return NextResponse.json({
      status: 'healthy',
      database: {
        agent: serverInfo.agent,
        address: serverInfo.address,
        protocolVersion: serverInfo.protocolVersion,
      },
      counts: {
        nodes: overview.nodeCount,
        relationships: overview.relationshipCount,
      },
      labels: overview.nodeCounts,
      relationshipTypes: overview.relationshipCounts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API Health Check Error:', (error as Error).message);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Unable to connect to CognoDB Cloud. Verify environment credentials.',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
