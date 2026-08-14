'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

export interface Graph3DNode {
  id: number | string;
  name: string;
  type: string;
  position: [number, number, number];
  color: string;
  size: number;
}

export interface Graph3DEdge {
  start: [number, number, number];
  end: [number, number, number];
  type: string;
  isMultiHop?: boolean;
}

interface Instanced3DGraphProps {
  scrollProgress: number; // 0 to 1
  onNodeClick?: (node: Graph3DNode) => void;
}

const nodeColorByType: Record<string, string> = {
  Developer: '#818cf8', // Indigo
  Project: '#38bdf8',   // Cyan
  Technology: '#06b6d4',// Teal-cyan
  Skill: '#34d399',     // Emerald
  Domain: '#c084fc',    // Purple
  Concept: '#fbbf24',   // Amber
};

export default function Instanced3DGraph({
  scrollProgress,
  onNodeClick,
}: Instanced3DGraphProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<Graph3DNode | null>(null);

  // Generate representative 3D graph nodes positioned in a sphere with clustered topology
  const { nodes, edges, multiHopNodes } = useMemo(() => {
    const rawNodes: Graph3DNode[] = [
      // Central multi-hop chain (Developer -> Skill -> Technology -> Project -> Domain)
      { id: 1, name: 'Elena Rostova', type: 'Developer', position: [-3.2, 1.8, 1.2], color: nodeColorByType.Developer, size: 0.42 },
      { id: 2, name: 'Graph Modeling', type: 'Skill', position: [-1.2, 0.9, 0.4], color: nodeColorByType.Skill, size: 0.38 },
      { id: 3, name: 'CognoDB', type: 'Technology', position: [0.8, -0.4, -0.2], color: nodeColorByType.Technology, size: 0.48 },
      { id: 4, name: 'GraphLens', type: 'Project', position: [2.6, -1.2, -0.8], color: nodeColorByType.Project, size: 0.44 },
      { id: 5, name: 'Graph Systems & Analytics', type: 'Domain', position: [4.2, -0.2, 1.0], color: nodeColorByType.Domain, size: 0.42 },

      // Second multi-hop chain (Developer -> 3D Web -> Three.js -> Canvas3D Studio)
      { id: 6, name: 'Marcus Vance', type: 'Developer', position: [-2.8, -2.2, 0.8], color: nodeColorByType.Developer, size: 0.38 },
      { id: 7, name: '3D Web Development', type: 'Skill', position: [-1.0, -1.5, -0.6], color: nodeColorByType.Skill, size: 0.35 },
      { id: 8, name: 'Three.js', type: 'Technology', position: [1.2, -1.8, 1.4], color: nodeColorByType.Technology, size: 0.40 },
      { id: 9, name: 'Canvas3D Studio', type: 'Project', position: [3.4, -2.4, 0.2], color: nodeColorByType.Project, size: 0.38 },

      // ML cluster (Aria Takahashi -> Deep Learning -> PyTorch -> OmniVision-Core)
      { id: 10, name: 'Aria Takahashi', type: 'Developer', position: [-1.8, 3.2, -1.0], color: nodeColorByType.Developer, size: 0.38 },
      { id: 11, name: 'Deep Learning', type: 'Skill', position: [0.2, 2.4, -1.4], color: nodeColorByType.Skill, size: 0.35 },
      { id: 12, name: 'PyTorch', type: 'Technology', position: [2.0, 1.8, -1.8], color: nodeColorByType.Technology, size: 0.42 },
      { id: 13, name: 'OmniVision-Core', type: 'Project', position: [3.6, 2.6, -0.4], color: nodeColorByType.Project, size: 0.40 },
      { id: 14, name: 'Computer Vision', type: 'Domain', position: [4.8, 1.6, 0.6], color: nodeColorByType.Domain, size: 0.38 },

      // Additional interconnected nodes
      { id: 15, name: 'Next.js', type: 'Technology', position: [1.5, 0.2, 2.2], color: nodeColorByType.Technology, size: 0.42 },
      { id: 16, name: 'Fullstack React Architecture', type: 'Skill', position: [-0.5, 0.2, 2.4], color: nodeColorByType.Skill, size: 0.35 },
      { id: 17, name: 'Sofia Rodriguez', type: 'Developer', position: [-2.4, 0.4, 2.8], color: nodeColorByType.Developer, size: 0.38 },
      { id: 18, name: 'Kubernetes', type: 'Technology', position: [-0.8, -3.2, -1.8], color: nodeColorByType.Technology, size: 0.40 },
      { id: 19, name: 'Kafka', type: 'Technology', position: [0.5, 3.5, 1.6], color: nodeColorByType.Technology, size: 0.38 },
      { id: 20, name: 'Multi-Hop Traversal', type: 'Concept', position: [0.0, -0.2, 0.0], color: nodeColorByType.Concept, size: 0.36 },
      { id: 21, name: 'Property Graphs', type: 'Concept', position: [-1.6, -0.8, 1.4], color: nodeColorByType.Concept, size: 0.34 },
      { id: 22, name: 'GraphRAG', type: 'Concept', position: [1.8, 0.8, -0.6], color: nodeColorByType.Concept, size: 0.36 },
    ];

    const rawEdges: Graph3DEdge[] = [
      // Multi-hop primary chain (highlighted)
      { start: rawNodes[0].position, end: rawNodes[1].position, type: 'KNOWS', isMultiHop: true },
      { start: rawNodes[2].position, end: rawNodes[1].position, type: 'ENABLES', isMultiHop: true },
      { start: rawNodes[3].position, end: rawNodes[2].position, type: 'USES', isMultiHop: true },
      { start: rawNodes[3].position, end: rawNodes[4].position, type: 'BELONGS_TO', isMultiHop: true },

      // Marcus branch
      { start: rawNodes[5].position, end: rawNodes[6].position, type: 'KNOWS' },
      { start: rawNodes[7].position, end: rawNodes[6].position, type: 'ENABLES' },
      { start: rawNodes[8].position, end: rawNodes[7].position, type: 'USES' },
      { start: rawNodes[0].position, end: rawNodes[3].position, type: 'BUILT' },

      // ML branch
      { start: rawNodes[9].position, end: rawNodes[10].position, type: 'KNOWS' },
      { start: rawNodes[11].position, end: rawNodes[10].position, type: 'ENABLES' },
      { start: rawNodes[12].position, end: rawNodes[11].position, type: 'USES' },
      { start: rawNodes[12].position, end: rawNodes[13].position, type: 'BELONGS_TO' },

      // Cross connections
      { start: rawNodes[16].position, end: rawNodes[15].position, type: 'KNOWS' },
      { start: rawNodes[14].position, end: rawNodes[15].position, type: 'ENABLES' },
      { start: rawNodes[3].position, end: rawNodes[14].position, type: 'USES' },
      { start: rawNodes[3].position, end: rawNodes[7].position, type: 'USES' },
      { start: rawNodes[2].position, end: rawNodes[19].position, type: 'IMPLEMENTS' },
      { start: rawNodes[2].position, end: rawNodes[20].position, type: 'IMPLEMENTS' },
      { start: rawNodes[2].position, end: rawNodes[21].position, type: 'IMPLEMENTS' },
      { start: rawNodes[2].position, end: rawNodes[11].position, type: 'RELATED_TO' },
    ];

    const multiHopSet = new Set([1, 2, 3, 4, 5]);

    return { nodes: rawNodes, edges: rawEdges, multiHopNodes: multiHopSet };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Rotation responds to base time + scroll progress
    const baseRotationSpeed = 0.08;
    groupRef.current.rotation.y += delta * baseRotationSpeed;

    // Subtle pitch tilt based on scroll
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      Math.sin(scrollProgress * Math.PI) * 0.35,
      0.05
    );

    // Subtle scale breathing
    const scale = THREE.MathUtils.lerp(0.85, 1.2, scrollProgress);
    groupRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef}>
      {/* Node Spheres */}
      {nodes.map((node) => {
        const isHovered = hoveredNode?.id === node.id;
        const isMultiHopTarget = multiHopNodes.has(Number(node.id)) && scrollProgress > 0.4;

        return (
          <group key={node.id} position={node.position}>
            {/* Core Node Sphere */}
            <mesh
              onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                onNodeClick?.(node);
              }}
              onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                setHoveredNode(node);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setHoveredNode(null);
                document.body.style.cursor = 'default';
              }}
            >
              <sphereGeometry args={[node.size * (isHovered ? 1.3 : 1), 24, 24]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={isHovered ? 0.9 : isMultiHopTarget ? 0.7 : 0.35}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>

            {/* Glowing outer halo for active/hovered nodes */}
            {(isHovered || isMultiHopTarget) && (
              <mesh>
                <sphereGeometry args={[node.size * 1.55, 16, 16]} />
                <meshBasicMaterial
                  color={node.color}
                  transparent
                  opacity={isHovered ? 0.35 : 0.2}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            )}

            {/* HTML label tooltip on hover or for key anchor nodes */}
            {(isHovered || (scrollProgress > 0.2 && isMultiHopTarget)) && (
              <Html distanceFactor={14} position={[0, node.size + 0.3, 0]} center pointerEvents="none">
                <div className="px-2 py-1 rounded-md bg-slate-950/90 border border-slate-700/80 shadow-xl backdrop-blur-md whitespace-nowrap animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[11px] font-bold text-slate-100 font-sans">{node.name}</div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-cyan-400">
                    {node.type}
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Relationship Lines using Drei Line */}
      {edges.map((edge, index) => {
        const isHighlighted = Boolean(edge.isMultiHop && scrollProgress > 0.45);
        return (
          <Line
            key={index}
            points={[edge.start, edge.end]}
            color={isHighlighted ? '#38bdf8' : '#334155'}
            lineWidth={isHighlighted ? 2.5 : 1}
            transparent
            opacity={isHighlighted ? 0.85 : 0.25}
          />
        );
      })}
    </group>
  );
}
