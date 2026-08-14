'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import Instanced3DGraph, { Graph3DNode } from './Instanced3DGraph';
import GraphParticles from './GraphParticles';

interface HeroGraphCanvasProps {
  scrollProgress?: number;
  onNodeSelect?: (node: Graph3DNode) => void;
}

function DynamicCameraController({ scrollProgress = 0 }: { scrollProgress: number }) {
  useFrame(({ camera, pointer }) => {
    // Camera moves closer and orbits slightly as scroll progress increases (0 -> 1)
    const targetZ = THREE.MathUtils.lerp(11, 4.8, scrollProgress);
    const targetX = THREE.MathUtils.lerp(0, -1.8, scrollProgress) + pointer.x * 0.8;
    const targetY = THREE.MathUtils.lerp(0, 0.9, scrollProgress) + pointer.y * 0.8;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function HeroGraphCanvas({
  scrollProgress = 0,
  onNodeSelect,
}: HeroGraphCanvasProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 11], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#030712']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#38bdf8" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#818cf8" />
        <directionalLight position={[0, 5, 5]} intensity={0.8} />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <Instanced3DGraph
              scrollProgress={scrollProgress}
              onNodeClick={onNodeSelect}
            />
          </Float>
          <GraphParticles count={250} />
        </Suspense>

        <DynamicCameraController scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
