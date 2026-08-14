import neo4j from 'neo4j-driver';
import { getSession, toNumber, extractNodeProperties } from '@/lib/db/cognodb';
import type { GraphData, GraphNode, GraphRelationship, GraphOverview, SearchResult, PathResult } from '@/lib/db/types';

export async function getGraphOverview(): Promise<GraphOverview> {
  const session = getSession();
  try {
    // Get total counts
    const countResult = await session.run(`
      MATCH (n)
      WITH count(n) AS nodeCount
      MATCH ()-[r]->()
      RETURN nodeCount, count(r) AS relCount
    `);
    
    const nodeCount = countResult.records.length > 0 ? toNumber(countResult.records[0].get('nodeCount')) : 0;
    const relationshipCount = countResult.records.length > 0 ? toNumber(countResult.records[0].get('relCount')) : 0;

    // Get counts by label
    const labelResult = await session.run(`
      MATCH (n)
      WITH labels(n) AS lbls
      UNWIND lbls AS label
      RETURN label, count(*) AS count
      ORDER BY count DESC
    `);
    const nodeCounts = labelResult.records.map(r => ({
      label: r.get('label') as string,
      count: toNumber(r.get('count'))
    }));

    // Get counts by relationship type
    const relResult = await session.run(`
      MATCH ()-[r]->()
      RETURN type(r) AS type, count(r) AS count
      ORDER BY count DESC
    `);
    const relationshipCounts = relResult.records.map(r => ({
      type: r.get('type') as string,
      count: toNumber(r.get('count'))
    }));

    return { nodeCount, relationshipCount, nodeCounts, relationshipCounts };
  } finally {
    await session.close();
  }
}

export async function getFullGraph(limit: number = 300): Promise<GraphData> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (n)
      OPTIONAL MATCH (n)-[r]->(m)
      RETURN n, r, m
      LIMIT $limit
    `, { limit: neo4j.int(limit) });

    const nodesMap = new Map<number, GraphNode>();
    const relationships: GraphRelationship[] = [];
    const relIds = new Set<number>();

    for (const record of result.records) {
      const n = record.get('n');
      if (n && !nodesMap.has(toNumber(n.identity))) {
        nodesMap.set(toNumber(n.identity), {
          ...extractNodeProperties(n),
          _id: toNumber(n.identity),
          _labels: n.labels,
          name: n.properties.name || 'Unknown',
        } as GraphNode);
      }

      const m = record.get('m');
      if (m && !nodesMap.has(toNumber(m.identity))) {
        nodesMap.set(toNumber(m.identity), {
          ...extractNodeProperties(m),
          _id: toNumber(m.identity),
          _labels: m.labels,
          name: m.properties.name || 'Unknown',
        } as GraphNode);
      }

      const r = record.get('r');
      if (r && !relIds.has(toNumber(r.identity))) {
        relIds.add(toNumber(r.identity));
        relationships.push({
          _id: toNumber(r.identity),
          _type: r.type,
          _startNodeId: toNumber(r.start),
          _endNodeId: toNumber(r.end),
        });
      }
    }

    return { nodes: Array.from(nodesMap.values()), relationships };
  } finally {
    await session.close();
  }
}

export async function getNodeNeighbors(nodeId: number, hops: number = 1): Promise<GraphData> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (start) WHERE id(start) = $nodeId
      CALL {
        WITH start
        MATCH path = (start)-[*1..${Math.min(hops, 3)}]-(connected)
        RETURN connected, relationships(path) AS rels
      }
      RETURN start, connected, rels
    `, { nodeId: neo4j.int(nodeId) });

    const nodesMap = new Map<number, GraphNode>();
    const relationships: GraphRelationship[] = [];
    const relIds = new Set<number>();

    for (const record of result.records) {
      const start = record.get('start');
      if (start && !nodesMap.has(toNumber(start.identity))) {
        nodesMap.set(toNumber(start.identity), {
          ...extractNodeProperties(start),
          _id: toNumber(start.identity),
          _labels: start.labels,
          name: start.properties.name || 'Unknown',
        } as GraphNode);
      }

      const connected = record.get('connected');
      if (connected && !nodesMap.has(toNumber(connected.identity))) {
        nodesMap.set(toNumber(connected.identity), {
          ...extractNodeProperties(connected),
          _id: toNumber(connected.identity),
          _labels: connected.labels,
          name: connected.properties.name || 'Unknown',
        } as GraphNode);
      }

      const rels = record.get('rels');
      if (rels) {
        for (const r of rels) {
          if (!relIds.has(toNumber(r.identity))) {
            relIds.add(toNumber(r.identity));
            relationships.push({
              _id: toNumber(r.identity),
              _type: r.type,
              _startNodeId: toNumber(r.start),
              _endNodeId: toNumber(r.end),
            });
          }
        }
      }
    }

    return { nodes: Array.from(nodesMap.values()), relationships };
  } finally {
    await session.close();
  }
}

export async function searchNodes(query: string, limit: number = 20): Promise<SearchResult[]> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (n)
      WHERE toLower(n.name) CONTAINS toLower($query)
         OR toLower(coalesce(n.description, '')) CONTAINS toLower($query)
      RETURN id(n) AS _id, n.name AS name, head(labels(n)) AS label,
             coalesce(n.description, '') AS description
      ORDER BY CASE WHEN toLower(n.name) STARTS WITH toLower($query) THEN 0 ELSE 1 END,
               n.name
      LIMIT $limit
    `, { query, limit: neo4j.int(limit) });

    return result.records.map(r => ({
      _id: toNumber(r.get('_id')),
      name: r.get('name') as string,
      label: r.get('label') as string,
      description: r.get('description') as string,
    }));
  } finally {
    await session.close();
  }
}

export async function findPathBetweenNodes(startId: number, endId: number): Promise<PathResult | null> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (start) WHERE id(start) = $startId
      MATCH (end) WHERE id(end) = $endId
      MATCH p = shortestPath((start)-[*..8]-(end))
      RETURN nodes(p) AS pathNodes,
             [r IN relationships(p) | {type: type(r), startName: startNode(r).name, endName: endNode(r).name}] AS pathRels,
             length(p) AS pathLength
    `, { startId: neo4j.int(startId), endId: neo4j.int(endId) });

    if (result.records.length === 0) return null;

    const record = result.records[0];
    const pathNodes = (record.get('pathNodes') as Array<{identity: unknown; labels: string[]; properties: Record<string, unknown>}>).map(n => ({
      ...extractNodeProperties(n),
      _id: toNumber(n.identity),
      _labels: n.labels,
      name: (n.properties.name as string) || 'Unknown',
    } as GraphNode));

    return {
      nodes: pathNodes,
      relationships: record.get('pathRels') as PathResult['relationships'],
      length: toNumber(record.get('pathLength')),
    };
  } finally {
    await session.close();
  }
}
