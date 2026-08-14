import neo4j from 'neo4j-driver';
import { getSession, toNumber } from '@/lib/db/cognodb';
import type { Skill, GraphNode } from '@/lib/db/types';

export async function getAllSkills(): Promise<Skill[]> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (s:Skill)
      RETURN s
      ORDER BY s.name
    `);

    return result.records.map(r => {
      const node = r.get('s');
      return {
        _id: toNumber(node.identity),
        name: node.properties.name,
        description: node.properties.description,
        category: node.properties.category,
        level: node.properties.level,
      } as Skill;
    });
  } finally {
    await session.close();
  }
}

export async function getSkillsByTechnology(technology: string): Promise<Skill[]> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (t:Technology)-[:ENABLES]->(s:Skill)
      WHERE toLower(t.name) = toLower($technology)
      RETURN s
      ORDER BY s.name
    `, { technology });

    return result.records.map(r => {
      const node = r.get('s');
      return {
        _id: toNumber(node.identity),
        name: node.properties.name,
        description: node.properties.description,
        category: node.properties.category,
        level: node.properties.level,
      } as Skill;
    });
  } finally {
    await session.close();
  }
}

/**
 * Skills indirectly connected to a project through its technologies.
 * This is a 2-hop traversal: Project -> Technology -> Skill
 * Demonstrates graph-specific relationship traversal.
 */
export async function getSkillsForProject(projectName: string): Promise<{
  directSkills: Skill[];
  indirectSkills: { skill: Skill; throughTechnology: string }[];
}> {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (p:Project)
      WHERE toLower(p.name) = toLower($projectName)
      
      // Direct skills required by the project
      OPTIONAL MATCH (p)-[:REQUIRES]->(ds:Skill)
      WITH p, collect(DISTINCT ds) AS directSkills
      
      // Indirect: Project -[:USES]-> Technology -[:ENABLES]-> Skill
      OPTIONAL MATCH (p)-[:USES]->(t:Technology)-[:ENABLES]->(is:Skill)
      WHERE NOT is IN directSkills
      
      RETURN directSkills,
             collect(DISTINCT {skill: is, technology: t.name}) AS indirectSkills
    `, { projectName });

    if (result.records.length === 0) {
      return { directSkills: [], indirectSkills: [] };
    }

    const record = result.records[0];
    const directNodes = record.get('directSkills') as Array<{identity: unknown; properties: Record<string, unknown>}>;
    const indirectData = record.get('indirectSkills') as Array<{skill: {identity: unknown; properties: Record<string, unknown>} | null; technology: string}>;

    return {
      directSkills: directNodes.filter(n => n !== null).map(n => ({
        _id: toNumber(n.identity),
        name: n.properties.name as string,
        description: n.properties.description as string,
        category: n.properties.category as string,
        level: n.properties.level as string,
      })),
      indirectSkills: indirectData
        .filter(d => d.skill !== null)
        .map(d => ({
          skill: {
            _id: toNumber(d.skill!.identity),
            name: d.skill!.properties.name as string,
            description: d.skill!.properties.description as string,
            category: d.skill!.properties.category as string,
            level: d.skill!.properties.level as string,
          },
          throughTechnology: d.technology,
        })),
    };
  } finally {
    await session.close();
  }
}
