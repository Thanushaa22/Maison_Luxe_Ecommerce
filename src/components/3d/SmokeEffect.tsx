"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SmokeEffectProps {
  count?: number;
  speed?: number;
  opacity?: number;
  color?: string;
  position?: [number, number, number];
  spread?: number;
}

export default function SmokeEffect({
  count = 20,
  speed = 0.2,
  opacity = 0.4,
  color = "#1a1a2e",
  position = [0, 0, 0],
  spread = 3,
}: SmokeEffectProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = Math.random() * spread * 0.5 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return pos;
  }, [count, spread]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posAttr.array[i3 + 1] += Math.sin(time * speed + i * 0.1) * 0.002;
      posAttr.array[i3] += Math.cos(time * speed * 0.5 + i * 0.05) * 0.001;
      if (posAttr.array[i3 + 1] > 2) posAttr.array[i3 + 1] = -1;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.3} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

interface WispySmokeProps {
  position?: [number, number, number];
  color?: string;
  opacity?: number;
}

export function WispySmoke({ position = [0, 0, 0], color = "#2a2a4a", opacity = 0.3 }: WispySmokeProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = Math.random() * 3 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      posAttr.array[i3 + 1] += Math.sin(time * 0.5 + i * 0.01) * 0.002;
      posAttr.array[i3] += Math.cos(time * 0.3 + i * 0.02) * 0.001;
      if (posAttr.array[i3 + 1] > 3) posAttr.array[i3 + 1] = -1;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.2} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}
