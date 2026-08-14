import neo4j from 'neo4j-driver';
import { getSession, toNumber } from '@/lib/db/cognodb';

export async function getMostConnectedNodes(limit: number = 15): Promise<{ name: string; label: string; connections: number }[]> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (n)-[r]-()
      WITH n, count(r) AS connections
      RETURN n.name AS name, head(labels(n)) AS label, connections
      ORDER BY connections DESC
      LIMIT $limit
    `, { limit: neo4j.int(limit) });

    return result.records.map(r => ({
      name: r.get('name') as string,
      label: r.get('label') as string,
      connections: toNumber(r.get('connections')),
    }));
  } finally {
    await session.close();
  }
}

export async function getDomainDistribution(): Promise<{ domain: string; count: number }[]> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (d:Domain)<-[:BELONGS_TO|PART_OF|FOLLOWS]-(n)
      RETURN d.name AS domain, count(DISTINCT n) AS count
      ORDER BY count DESC
    `);

    return result.records.map(r => ({
      domain: r.get('domain') as string,
      count: toNumber(r.get('count')),
    }));
  } finally {
    await session.close();
  }
}

/**
 * GRAPH-SPECIFIC QUERY: Finding technologies that bridge two different domains.
 * In a relational database, this would require multiple self-joins across
 * technology-domain junction tables and technology-relationship tables,
 * resulting in complex and hard-to-read SQL. In Cypher, it's a natural
 * pattern match.
 */
export async function getTechnologiesBridgingDomains(): Promise<{
  technology: string;
  domain1: string;
  domain2: string;
}[]> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (t:Technology)-[:PART_OF]->(d1:Domain)
      MATCH (t)-[:RELATED_TO]-(t2:Technology)-[:PART_OF]->(d2:Domain)
      WHERE d1 <> d2 AND id(d1) < id(d2)
      RETURN DISTINCT t.name AS technology, d1.name AS domain1, d2.name AS domain2
      ORDER BY technology
      LIMIT 20
    `);

    return result.records.map(r => ({
      technology: r.get('technology') as string,
      domain1: r.get('domain1') as string,
      domain2: r.get('domain2') as string,
    }));
  } finally {
    await session.close();
  }
}

export async function getSkillGaps(): Promise<{ skill: string; projectsRequiring: number; developersKnowing: number; gap: number }[]> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (s:Skill)
      OPTIONAL MATCH (p:Project)-[:REQUIRES]->(s)
      WITH s, count(DISTINCT p) AS projectsRequiring
      OPTIONAL MATCH (d:Developer)-[:KNOWS]->(s)
      WITH s.name AS skill, projectsRequiring, count(DISTINCT d) AS developersKnowing
      WHERE projectsRequiring > 0
      RETURN skill, projectsRequiring, developersKnowing,
             projectsRequiring - developersKnowing AS gap
      ORDER BY gap DESC
      LIMIT 15
    `);

    return result.records.map(r => ({
      skill: r.get('skill') as string,
      projectsRequiring: toNumber(r.get('projectsRequiring')),
      developersKnowing: toNumber(r.get('developersKnowing')),
      gap: toNumber(r.get('gap')),
    }));
  } finally {
    await session.close();
  }
}

/**
 * Multi-hop chain: Show complete Developer → Skill → Technology → Project chains.
 * This query traverses 3 relationship hops and returns the full path,
 * demonstrating graph traversal that would require 3+ JOINs in SQL.
 */
export async function getMultiHopChains(limit: number = 10): Promise<{
  developer: string;
  skill: string;
  technology: string;
  project: string;
}[]> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (d:Developer)-[:KNOWS]->(s:Skill)<-[:ENABLES]-(t:Technology)<-[:USES]-(p:Project)
      RETURN d.name AS developer, s.name AS skill, t.name AS technology, p.name AS project
      LIMIT $limit
    `, { limit: neo4j.int(limit) });

    return result.records.map(r => ({
      developer: r.get('developer') as string,
      skill: r.get('skill') as string,
      technology: r.get('technology') as string,
      project: r.get('project') as string,
    }));
  } finally {
    await session.close();
  }
}
