import neo4j from 'neo4j-driver';
import { getSession, toNumber, extractNodeProperties } from '@/lib/db/cognodb';
import type { Developer, Project, GraphNode } from '@/lib/db/types';

export async function getAllDevelopers(): Promise<Developer[]> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (d:Developer)
      RETURN d
      ORDER BY d.name
    `);

    return result.records.map(r => {
      const node = r.get('d');
      return {
        _id: toNumber(node.identity),
        name: node.properties.name,
        title: node.properties.title,
        bio: node.properties.bio,
        githubUrl: node.properties.githubUrl,
        avatarSeed: node.properties.avatarSeed || node.properties.name,
      } as Developer;
    });
  } finally {
    await session.close();
  }
}

export async function getDeveloperById(id: number): Promise<{
  developer: Developer;
  skills: GraphNode[];
  projects: GraphNode[];
  domains: GraphNode[];
} | null> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (d:Developer) WHERE id(d) = $id
      OPTIONAL MATCH (d)-[:KNOWS]->(s:Skill)
      OPTIONAL MATCH (d)-[:BUILT|CONTRIBUTED_TO]->(p:Project)
      OPTIONAL MATCH (d)-[:FOLLOWS]->(dom:Domain)
      RETURN d,
             collect(DISTINCT s) AS skills,
             collect(DISTINCT p) AS projects,
             collect(DISTINCT dom) AS domains
    `, { id: neo4j.int(id) });

    if (result.records.length === 0) return null;

    const record = result.records[0];
    const dNode = record.get('d');

    const mapNodes = (nodes: Array<{identity: unknown; labels: string[]; properties: Record<string, unknown>}>) =>
      nodes.filter(n => n !== null).map(n => ({
        ...extractNodeProperties(n),
        _id: toNumber(n.identity),
        _labels: n.labels,
        name: (n.properties.name as string) || 'Unknown',
      } as GraphNode));

    return {
      developer: {
        _id: toNumber(dNode.identity),
        name: dNode.properties.name,
        title: dNode.properties.title,
        bio: dNode.properties.bio,
        githubUrl: dNode.properties.githubUrl,
        avatarSeed: dNode.properties.avatarSeed || dNode.properties.name,
      } as Developer,
      skills: mapNodes(record.get('skills')),
      projects: mapNodes(record.get('projects')),
      domains: mapNodes(record.get('domains')),
    };
  } finally {
    await session.close();
  }
}

/**
 * MULTI-HOP TRAVERSAL: Developer → Skill → Technology → Project
 * This is a genuine 3-hop traversal that demonstrates graph database value.
 * In a relational database, this would require 3 separate JOIN operations
 * across at least 4 tables with bridging tables for many-to-many relationships.
 */
export async function getDeveloperRecommendations(developerId: number): Promise<{
  recommendedProjects: (Project & { matchingSkills: string[]; matchingTechnologies: string[]; path: string })[];
  skillToTechPaths: { skill: string; technology: string; project: string }[];
}> {
  const session = getSession();
  try {
    // Multi-hop: Developer -[:KNOWS]-> Skill <-[:REQUIRES]- Project
    // AND: Developer -[:KNOWS]-> Skill <-[:ENABLES]- Technology <-[:USES]- Project
    const result = await session.run(`
      MATCH (d:Developer) WHERE id(d) = $developerId
      
      // Direct skill match: Developer -> Skill <- Project
      OPTIONAL MATCH (d)-[:KNOWS]->(s:Skill)<-[:REQUIRES]-(p:Project)
      WHERE NOT (d)-[:BUILT|CONTRIBUTED_TO]->(p)
      WITH d, collect(DISTINCT {project: p, skill: s.name}) AS directMatches
      
      // 3-hop: Developer -> Skill <- Technology <- Project
      OPTIONAL MATCH (d)-[:KNOWS]->(s2:Skill)<-[:ENABLES]-(t:Technology)<-[:USES]-(p2:Project)
      WHERE NOT (d)-[:BUILT|CONTRIBUTED_TO]->(p2)
      WITH d, directMatches,
           collect(DISTINCT {project: p2, skill: s2.name, technology: t.name}) AS techMatches
      
      RETURN directMatches, techMatches
    `, { developerId: neo4j.int(developerId) });

    if (result.records.length === 0) {
      return { recommendedProjects: [], skillToTechPaths: [] };
    }

    const record = result.records[0];
    const directMatches = record.get('directMatches') as Array<{project: {identity: unknown; properties: Record<string, unknown>} | null; skill: string}>;
    const techMatches = record.get('techMatches') as Array<{project: {identity: unknown; properties: Record<string, unknown>} | null; skill: string; technology: string}>;

    // Aggregate recommendations
    const projectMap = new Map<number, Project & { matchingSkills: string[]; matchingTechnologies: string[]; path: string }>();

    for (const match of directMatches) {
      if (!match.project) continue;
      const pid = toNumber(match.project.identity);
      if (!projectMap.has(pid)) {
        projectMap.set(pid, {
          _id: pid,
          name: match.project.properties.name as string,
          description: match.project.properties.description as string,
          category: match.project.properties.category as string,
          stars: toNumber(match.project.properties.stars),
          matchingSkills: [],
          matchingTechnologies: [],
          path: 'skill-match',
        });
      }
      const entry = projectMap.get(pid)!;
      if (match.skill && !entry.matchingSkills.includes(match.skill)) {
        entry.matchingSkills.push(match.skill);
      }
    }

    for (const match of techMatches) {
      if (!match.project) continue;
      const pid = toNumber(match.project.identity);
      if (!projectMap.has(pid)) {
        projectMap.set(pid, {
          _id: pid,
          name: match.project.properties.name as string,
          description: match.project.properties.description as string,
          category: match.project.properties.category as string,
          stars: toNumber(match.project.properties.stars),
          matchingSkills: [],
          matchingTechnologies: [],
          path: 'tech-match',
        });
      }
      const entry = projectMap.get(pid)!;
      if (match.skill && !entry.matchingSkills.includes(match.skill)) {
        entry.matchingSkills.push(match.skill);
      }
      if (match.technology && !entry.matchingTechnologies.includes(match.technology)) {
        entry.matchingTechnologies.push(match.technology);
      }
    }

    const skillToTechPaths = techMatches
      .filter(m => m.project !== null)
      .map(m => ({
        skill: m.skill,
        technology: m.technology,
        project: m.project!.properties.name as string,
      }));

    return {
      recommendedProjects: Array.from(projectMap.values()),
      skillToTechPaths,
    };
  } finally {
    await session.close();
  }
}
