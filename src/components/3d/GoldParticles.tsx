"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface GoldParticlesProps {
  count?: number;
  spread?: number;
  speed?: number;
  size?: number;
  opacity?: number;
  position?: [number, number, number];
}

export default function GoldParticles({
  count = 300,
  spread = 5,
  speed = 0.3,
  size = 0.05,
  opacity = 0.7,
  position = [0, 0, 0],
}: GoldParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const [positions, initialPositions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initPos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.5) * spread;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      initPos[i * 3] = pos[i * 3];
      initPos[i * 3 + 1] = pos[i * 3 + 1];
      initPos[i * 3 + 2] = pos[i * 3 + 2];

      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    return [pos, initPos, vel];
  }, [count, spread]);

  const sparklePhases = useMemo(() => {
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      phases[i] = Math.random() * Math.PI * 2;
    }
    return phases;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;
    const mouse = state.mouse;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const sparkle = Math.sin(time * 3 + sparklePhases[i]) * 0.5 + 0.5;
      const mouseInfluence = 0.3;

      posAttr.array[i3] =
        initialPositions[i3] +
        Math.sin(time * speed + i * 0.1) * 0.3 +
        velocities[i3] * time * 10 +
        mouse.x * mouseInfluence * (1 + (i % 5) * 0.2);

      posAttr.array[i3 + 1] =
        initialPositions[i3 + 1] +
        Math.cos(time * speed * 0.7 + i * 0.15) * 0.3 +
        velocities[i3 + 1] * time * 10 +
        mouse.y * mouseInfluence * (1 + (i % 5) * 0.2);

      posAttr.array[i3 + 2] =
        initialPositions[i3 + 2] +
        Math.sin(time * speed * 0.5 + i * 0.2) * 0.2 +
        velocities[i3 + 2] * time * 10;
    }

    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y += 0.001;
  });

  return (
    <group position={position}>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffd700"
          size={size}
          sizeAttenuation
          depthWrite={false}
          opacity={opacity}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}
