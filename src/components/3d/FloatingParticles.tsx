"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  size?: number;
  opacity?: number;
  spread?: number;
  speed?: number;
  position?: [number, number, number];
  variant?: "sparse" | "dense" | "sparkle";
}

export default function FloatingParticles({
  count = 150,
  color = "#ffd700",
  size = 0.04,
  opacity = 0.6,
  spread = 4,
  speed = 0.2,
  position = [0, 0, 0],
  variant = "sparse",
}: FloatingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);

    const actualSpread = variant === "dense" ? spread * 0.5 : spread;

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * actualSpread * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * actualSpread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * actualSpread;
      ph[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, phases: ph };
  }, [count, spread, variant]);

  const particleSize = useMemo(() => {
    switch (variant) {
      case "sparse":
        return size * 1.5;
      case "dense":
        return size * 0.8;
      case "sparkle":
        return size * 2;
      default:
        return size;
    }
  }, [variant, size]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const phase = phases[i];

      const drift = variant === "sparkle" ? 0.1 : 0.05;

      posAttr.array[i3] += Math.sin(time * speed + phase) * drift;
      posAttr.array[i3 + 1] += Math.cos(time * speed * 0.7 + phase * 1.3) * drift;
      posAttr.array[i3 + 2] += Math.sin(time * speed * 0.5 + phase * 0.7) * drift * 0.5;

      const boundary = spread * 1.5;
      if (Math.abs(posAttr.array[i3]) > boundary) {
        posAttr.array[i3] *= -0.9;
      }
      if (Math.abs(posAttr.array[i3 + 1]) > boundary) {
        posAttr.array[i3 + 1] *= -0.9;
      }
      if (Math.abs(posAttr.array[i3 + 2]) > boundary) {
        posAttr.array[i3 + 2] *= -0.9;
      }
    }

    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y += 0.0005;
  });

  const materialProps = useMemo(() => {
    switch (variant) {
      case "sparkle":
        return {
          size: particleSize,
          sizeAttenuation: true,
          transparent: true,
          opacity: opacity * 1.2,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          color: new THREE.Color(color).multiplyScalar(1.5),
        };
      case "dense":
        return {
          size: particleSize,
          sizeAttenuation: true,
          transparent: true,
          opacity: opacity * 0.8,
          depthWrite: false,
          blending: THREE.NormalBlending,
          color: new THREE.Color(color).multiplyScalar(0.8),
        };
      default:
        return {
          size: particleSize,
          sizeAttenuation: true,
          transparent: true,
          opacity,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          color: new THREE.Color(color),
        };
    }
  }, [variant, particleSize, opacity, color]);

  return (
    <group position={position}>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial {...materialProps} />
      </Points>
    </group>
  );
}

interface ParticleLayerProps {
  color?: string;
  opacity?: number;
}

export function ParticleLayer({
  color = "#ffd700",
  opacity = 0.3,
}: ParticleLayerProps) {
  return (
    <>
      <FloatingParticles
        count={100}
        color={color}
        size={0.02}
        opacity={opacity * 0.5}
        spread={8}
        speed={0.1}
        variant="sparse"
        position={[0, 2, -3]}
      />
      <FloatingParticles
        count={200}
        color={color}
        size={0.015}
        opacity={opacity * 0.3}
        spread={12}
        speed={0.05}
        variant="dense"
        position={[0, 0, -5]}
      />
      <FloatingParticles
        count={50}
        color={color}
        size={0.06}
        opacity={opacity}
        spread={3}
        speed={0.3}
        variant="sparkle"
        position={[0, 1, 0]}
      />
    </>
  );
}
