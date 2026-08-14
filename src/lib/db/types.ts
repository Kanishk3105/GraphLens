export interface GraphNode {
  _id: number;
  _labels: string[];
  name: string;
  description?: string;
  [key: string]: unknown;
}

export interface GraphRelationship {
  _id: number;
  _type: string;
  _startNodeId: number;
  _endNodeId: number;
  [key: string]: unknown;
}

export interface GraphData {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
}

export interface Developer {
  _id: number;
  name: string;
  title: string;
  bio: string;
  githubUrl: string;
  avatarSeed: string;
}

export interface Project {
  _id: number;
  name: string;
  description: string;
  category: string;
  stars: number;
  githubUrl?: string;
}

export interface Technology {
  _id: number;
  name: string;
  description: string;
  category: string;
  website?: string;
}

export interface Skill {
  _id: number;
  name: string;
  description: string;
  category: string;
  level: string;
}

export interface Domain {
  _id: number;
  name: string;
  description: string;
  icon: string;
}

export interface Concept {
  _id: number;
  name: string;
  description: string;
  category: string;
}

export interface Language {
  _id: number;
  name: string;
  description: string;
  paradigm: string;
  typedSystem: string;
  year: number;
}

export interface Resource {
  _id: number;
  name: string;
  description: string;
  type: string;
  url: string;
  difficulty: string;
}

export interface PathResult {
  nodes: GraphNode[];
  relationships: { type: string; startName: string; endName: string }[];
  length: number;
}

export interface InsightData {
  mostConnected: { name: string; label: string; connections: number }[];
  domainDistribution: { domain: string; count: number }[];
  skillGaps: { skill: string; projectsRequiring: number; developersKnowing: number }[];
  technologyPaths: PathResult[];
}

export interface GraphOverview {
  nodeCount: number;
  relationshipCount: number;
  nodeCounts: { label: string; count: number }[];
  relationshipCounts: { type: string; count: number }[];
}

export interface SearchResult {
  _id: number;
  name: string;
  label: string;
  description: string;
  score?: number;
}

export type NodeType = 'Developer' | 'Project' | 'Technology' | 'Skill' | 'Domain' | 'Concept' | 'Language' | 'Resource';
