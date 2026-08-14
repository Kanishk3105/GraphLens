import { NextResponse } from 'next/server';
import {
  getMostConnectedNodes,
  getDomainDistribution,
  getTechnologiesBridgingDomains,
  getSkillGaps,
  getMultiHopChains,
} from '@/lib/queries/insights';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [mostConnected, domainDistribution, bridgingTechnologies, skillGaps, multiHopChains] =
      await Promise.all([
        getMostConnectedNodes(12),
        getDomainDistribution(),
        getTechnologiesBridgingDomains(),
        getSkillGaps(),
        getMultiHopChains(8),
      ]);

    return NextResponse.json({
      mostConnected,
      domainDistribution,
      bridgingTechnologies,
      skillGaps,
      multiHopChains,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API /api/insights Error:', (error as Error).message);
    return NextResponse.json(
      { error: 'Failed to generate graph insights' },
      { status: 500 }
    );
  }
}
