import neo4j from 'neo4j-driver';
import { getSession, toNumber } from '@/lib/db/cognodb';
import type { Technology, GraphNode } from '@/lib/db/types';

export async function getAllTechnologies(): Promise<Technology[]> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (t:Technology)
      RETURN t
      ORDER BY t.name
    `);

    return result.records.map(r => {
      const node = r.get('t');
      return {
        _id: toNumber(node.identity),
        name: node.properties.name,
        description: node.properties.description,
        category: node.properties.category,
        website: node.properties.website,
      } as Technology;
    });
  } finally {
    await session.close();
  }
}

export async function getTechnologyByName(name: string): Promise<{
  technology: Technology;
  relatedTechnologies: Technology[];
  projects: GraphNode[];
  skills: GraphNode[];
  domains: GraphNode[];
} | null> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (t:Technology)
      WHERE toLower(t.name) = toLower($name)
      OPTIONAL MATCH (t)-[:RELATED_TO]-(related:Technology)
      OPTIONAL MATCH (p:Project)-[:USES]->(t)
      OPTIONAL MATCH (t)-[:ENABLES]->(s:Skill)
      OPTIONAL MATCH (t)-[:PART_OF]->(d:Domain)
      RETURN t,
             collect(DISTINCT related) AS relatedTechnologies,
             collect(DISTINCT p) AS projects,
             collect(DISTINCT s) AS skills,
             collect(DISTINCT d) AS domains
    `, { name });

    if (result.records.length === 0) return null;

    const record = result.records[0];
    const tNode = record.get('t');
    if (!tNode) return null;

    const mapTech = (nodes: Array<{identity: unknown; properties: Record<string, unknown>}>) =>
      nodes.filter(n => n !== null).map(n => ({
        _id: toNumber(n.identity),
        name: n.properties.name,
        description: n.properties.description,
        category: n.properties.category,
        website: n.properties.website,
      } as Technology));

    const mapNodes = (nodes: Array<{identity: unknown; labels: string[]; properties: Record<string, unknown>}>) =>
      nodes.filter(n => n !== null).map(n => ({
        _id: toNumber(n.identity),
        _labels: n.labels,
        name: (n.properties.name as string) || 'Unknown',
        description: n.properties.description as string,
      } as GraphNode));

    return {
      technology: {
        _id: toNumber(tNode.identity),
        name: tNode.properties.name,
        description: tNode.properties.description,
        category: tNode.properties.category,
        website: tNode.properties.website,
      } as Technology,
      relatedTechnologies: mapTech(record.get('relatedTechnologies')),
      projects: mapNodes(record.get('projects')),
      skills: mapNodes(record.get('skills')),
      domains: mapNodes(record.get('domains')),
    };
  } finally {
    await session.close();
  }
}

export async function getRelatedTechnologies(name: string, hops: number = 2): Promise<GraphNode[]> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (t:Technology)
      WHERE toLower(t.name) = toLower($name)
      MATCH path = (t)-[:RELATED_TO|USES|ENABLES*1..${Math.min(hops, 3)}]-(connected)
      WHERE connected <> t
      RETURN DISTINCT id(connected) AS _id, connected.name AS name,
             head(labels(connected)) AS label,
             coalesce(connected.description, '') AS description,
             length(path) AS distance
      ORDER BY distance, name
      LIMIT 30
    `, { name });

    return result.records.map(r => ({
      _id: toNumber(r.get('_id')),
      _labels: [r.get('label') as string],
      name: r.get('name') as string,
      description: r.get('description') as string,
    } as GraphNode));
  } finally {
    await session.close();
  }
}

// Most connected technologies (centrality)
export async function getMostConnectedTechnologies(limit: number = 10): Promise<{ name: string; connections: number }[]> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (t:Technology)-[r]-()
      RETURN t.name AS name, count(r) AS connections
      ORDER BY connections DESC
      LIMIT $limit
    `, { limit: neo4j.int(limit) });

    return result.records.map(r => ({
      name: r.get('name') as string,
      connections: toNumber(r.get('connections')),
    }));
  } finally {
    await session.close();
  }
}
