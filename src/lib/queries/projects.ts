import neo4j from 'neo4j-driver';
import { getSession, toNumber, extractNodeProperties } from '@/lib/db/cognodb';
import type { Project, GraphNode } from '@/lib/db/types';

export async function getAllProjects(): Promise<Project[]> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (p:Project)
      RETURN p
      ORDER BY p.stars DESC
    `);

    return result.records.map(r => {
      const node = r.get('p');
      return {
        _id: toNumber(node.identity),
        name: node.properties.name,
        description: node.properties.description,
        category: node.properties.category,
        stars: toNumber(node.properties.stars),
        githubUrl: node.properties.githubUrl,
      } as Project;
    });
  } finally {
    await session.close();
  }
}

export async function getProjectById(id: number): Promise<{
  project: Project;
  technologies: GraphNode[];
  skills: GraphNode[];
  domains: GraphNode[];
  developers: GraphNode[];
  concepts: GraphNode[];
  languages: GraphNode[];
} | null> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (p:Project) WHERE id(p) = $id
      OPTIONAL MATCH (p)-[:USES]->(t:Technology)
      OPTIONAL MATCH (p)-[:REQUIRES]->(s:Skill)
      OPTIONAL MATCH (p)-[:BELONGS_TO]->(d:Domain)
      OPTIONAL MATCH (dev:Developer)-[:BUILT|CONTRIBUTED_TO]->(p)
      OPTIONAL MATCH (p)-[:IMPLEMENTS]->(c:Concept)
      OPTIONAL MATCH (p)-[:WRITTEN_IN]->(l:Language)
      RETURN p,
             collect(DISTINCT t) AS technologies,
             collect(DISTINCT s) AS skills,
             collect(DISTINCT d) AS domains,
             collect(DISTINCT dev) AS developers,
             collect(DISTINCT c) AS concepts,
             collect(DISTINCT l) AS languages
    `, { id: neo4j.int(id) });

    if (result.records.length === 0) return null;

    const record = result.records[0];
    const pNode = record.get('p');

    const mapNodes = (nodes: Array<{identity: unknown; labels: string[]; properties: Record<string, unknown>}>) =>
      nodes.filter(n => n !== null).map(n => ({
        ...extractNodeProperties(n),
        _id: toNumber(n.identity),
        _labels: n.labels,
        name: (n.properties.name as string) || 'Unknown',
      } as GraphNode));

    return {
      project: {
        _id: toNumber(pNode.identity),
        name: pNode.properties.name,
        description: pNode.properties.description,
        category: pNode.properties.category,
        stars: toNumber(pNode.properties.stars),
      } as Project,
      technologies: mapNodes(record.get('technologies')),
      skills: mapNodes(record.get('skills')),
      domains: mapNodes(record.get('domains')),
      developers: mapNodes(record.get('developers')),
      concepts: mapNodes(record.get('concepts')),
      languages: mapNodes(record.get('languages')),
    };
  } finally {
    await session.close();
  }
}

export async function getProjectsUsingTechnology(technology: string): Promise<Project[]> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (p:Project)-[:USES]->(t:Technology)
      WHERE toLower(t.name) = toLower($technology)
      RETURN p
      ORDER BY p.stars DESC
    `, { technology });

    return result.records.map(r => {
      const node = r.get('p');
      return {
        _id: toNumber(node.identity),
        name: node.properties.name,
        description: node.properties.description,
        category: node.properties.category,
        stars: toNumber(node.properties.stars),
      } as Project;
    });
  } finally {
    await session.close();
  }
}
