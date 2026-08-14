'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { GraphNode, GraphRelationship } from '@/lib/db/types';

interface SimulatedNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface GraphCanvasProps {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
  selectedNodeId: number | null;
  highlightedNodeIds?: number[];
  onSelectNode: (node: GraphNode) => void;
}

const nodeColors: Record<string, string> = {
  Developer: '#818cf8',
  Project: '#38bdf8',
  Technology: '#06b6d4',
  Skill: '#34d399',
  Domain: '#c084fc',
  Concept: '#fbbf24',
  Language: '#f43f5e',
  Resource: '#2dd4bf',
  default: '#94a3b8',
};

export default function GraphCanvas({
  nodes,
  relationships,
  selectedNodeId,
  highlightedNodeIds = [],
  onSelectNode,
}: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [simNodes, setSimNodes] = useState<SimulatedNode[]>([]);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [draggedNode, setDraggedNode] = useState<SimulatedNode | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<SimulatedNode | null>(null);

  // Initialize node physics positions in circular clusters
  useEffect(() => {
    if (!nodes.length) return;

    const width = containerRef.current?.clientWidth || 900;
    const height = containerRef.current?.clientHeight || 600;
    const cx = width / 2;
    const cy = height / 2;

    const initialized: SimulatedNode[] = nodes.map((node, i) => {
      const angle = (i / nodes.length) * 2 * Math.PI;
      const radius = 120 + Math.random() * 260;
      const label = node._labels?.[0] || 'default';
      return {
        ...node,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: label === 'Project' ? 18 : label === 'Technology' ? 16 : 14,
        color: nodeColors[label] || nodeColors.default,
      };
    });

    setSimNodes(initialized);
    setTransform({ x: 0, y: 0, k: 1 });
  }, [nodes]);

  // Run force simulation step
  useEffect(() => {
    if (!simNodes.length) return;

    let animId: number;
    let iteration = 0;
    const maxIterations = 280;

    const nodesMap = new Map<number, SimulatedNode>();
    simNodes.forEach((n) => nodesMap.set(n._id, n));

    const step = () => {
      if (iteration > maxIterations && !draggedNode) {
        return;
      }

      iteration++;
      const alpha = Math.max(0.01, 1 - iteration / maxIterations);

      // Repulsion between nodes
      for (let i = 0; i < simNodes.length; i++) {
        for (let j = i + 1; j < simNodes.length; j++) {
          const n1 = simNodes[i];
          const n2 = simNodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (dist < 280) {
            const force = ((280 - dist) / dist) * 0.85 * alpha;
            n1.vx -= dx * force * 0.05;
            n1.vy -= dy * force * 0.05;
            n2.vx += dx * force * 0.05;
            n2.vy += dy * force * 0.05;
          }
        }
      }

      // Spring attraction along edges
      for (const rel of relationships) {
        const source = nodesMap.get(rel._startNodeId);
        const target = nodesMap.get(rel._endNodeId);
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 90;
          const force = (dist - targetDist) * 0.008 * alpha;

          source.vx += dx * force;
          source.vy += dy * force;
          target.vx -= dx * force;
          target.vy -= dy * force;
        }
      }

      // Apply velocity and damping
      for (const node of simNodes) {
        if (node === draggedNode) continue;
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.85;
        node.vy *= 0.85;
      }

      renderCanvas();
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [simNodes, relationships, draggedNode]);

  // Main Canvas Rendering Loop
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Apply pan & zoom
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    const nodesMap = new Map<number, SimulatedNode>();
    simNodes.forEach((n) => nodesMap.set(n._id, n));

    const highlightedSet = new Set(highlightedNodeIds);

    // 1. Draw Relationships (Edges)
    for (const rel of relationships) {
      const source = nodesMap.get(rel._startNodeId);
      const target = nodesMap.get(rel._endNodeId);
      if (!source || !target) continue;

      const isConnectedToSelected =
        selectedNodeId && (source._id === selectedNodeId || target._id === selectedNodeId);
      const isPathRel =
        highlightedSet.has(source._id) && highlightedSet.has(target._id);

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);

      if (isPathRel) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
      } else if (isConnectedToSelected) {
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#818cf8';
        ctx.shadowBlur = 8;
      } else {
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw subtle relationship type label on hover or connection
      if (isConnectedToSelected || isPathRel) {
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        ctx.font = '9px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText(rel._type, midX, midY - 3);
      }
    }

    // 2. Draw Nodes
    for (const node of simNodes) {
      const isSelected = selectedNodeId === node._id;
      const isHovered = hoveredNode?._id === node._id;
      const isHighlighted = highlightedSet.has(node._id);

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);

      if (isSelected || isHovered || isHighlighted) {
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 18;
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Node text label
      ctx.font = isSelected || isHovered ? 'bold 11px sans-serif' : '10px sans-serif';
      ctx.fillStyle = isSelected || isHovered ? '#ffffff' : '#cbd5e1';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y + node.radius + 13);
    }

    ctx.restore();
  }, [simNodes, relationships, selectedNodeId, highlightedNodeIds, transform, hoveredNode]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Coordinate helper: Canvas viewport to graph coordinates
  const getGraphCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - transform.x) / transform.k;
    const y = (clientY - rect.top - transform.y) / transform.k;
    return { x, y };
  };

  // Find node under mouse
  const getNodeAt = (x: number, y: number): SimulatedNode | null => {
    for (let i = simNodes.length - 1; i >= 0; i--) {
      const node = simNodes[i];
      const dx = x - node.x;
      const dy = y - node.y;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 6) {
        return node;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getGraphCoords(e.clientX, e.clientY);
    const clickedNode = getNodeAt(x, y);

    if (clickedNode) {
      setDraggedNode(clickedNode);
      onSelectNode(clickedNode);
    } else {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getGraphCoords(e.clientX, e.clientY);

    if (draggedNode) {
      draggedNode.x = x;
      draggedNode.y = y;
      draggedNode.vx = 0;
      draggedNode.vy = 0;
      renderCanvas();
    } else if (isDraggingCanvas) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    } else {
      const hovered = getNodeAt(x, y);
      setHoveredNode(hovered);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = hovered ? 'pointer' : 'grab';
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    setIsDraggingCanvas(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.max(0.2, Math.min(3.5, transform.k * zoomFactor));

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setTransform((prev) => ({
      x: mouseX - (mouseX - prev.x) * (newScale / prev.k),
      y: mouseY - (mouseY - prev.y) * (newScale / prev.k),
      k: newScale,
    }));
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[550px] overflow-hidden rounded-2xl bg-slate-950/70 border border-slate-800">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full block"
      />

      {/* Floating Canvas Controls (Zoom / Reset) */}
      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 glass-panel px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-400">
        <button
          onClick={() => setTransform((prev) => ({ ...prev, k: Math.min(3.5, prev.k * 1.2) }))}
          className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-200"
          title="Zoom In"
        >
          +
        </button>
        <span className="px-1 text-[11px]">{Math.round(transform.k * 100)}%</span>
        <button
          onClick={() => setTransform((prev) => ({ ...prev, k: Math.max(0.2, prev.k * 0.8) }))}
          className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-200"
          title="Zoom Out"
        >
          -
        </button>
        <div className="w-[1px] h-3 bg-slate-800 mx-1" />
        <button
          onClick={() => setTransform({ x: 0, y: 0, k: 1 })}
          className="px-2 py-0.5 rounded hover:bg-slate-800 text-cyan-400"
          title="Reset Zoom"
        >
          Reset
        </button>
      </div>

      {/* Drag & Pan helper note */}
      <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 glass-panel px-2 py-1 rounded-lg border border-slate-800/80 pointer-events-none">
        DRAG NODES • SCROLL TO ZOOM • DRAG BACKGROUND TO PAN
      </div>
    </div>
  );
}
