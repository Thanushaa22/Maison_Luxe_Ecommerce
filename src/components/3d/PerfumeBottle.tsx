"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Environment, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface PerfumeBottleProps {
  color?: string;
  scale?: number;
  position?: [number, number, number];
  onClick?: () => void;
  onHover?: () => void;
  isActive?: boolean;
  rotationSpeed?: number;
  name?: string;
  price?: number;
}

function BottleParticles({ isActive }: { isActive: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.2 + Math.random() * 0.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  const sizes = useMemo(() => {
    const s = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      s[i] = Math.random() * 0.03 + 0.01;
    }
    return s;
  }, []);

  useFrame((state) => {
    if (pointsRef.current && isActive) {
      pointsRef.current.rotation.y += 0.02;
      pointsRef.current.rotation.x += 0.005;
      pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffd700"
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        opacity={isActive ? 0.8 : 0}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function PerfumeBottle({
  color = "#d4a574",
  scale = 1,
  position = [0, 0, 0],
  onClick,
  onHover,
  isActive = false,
  rotationSpeed = 0.5,
  name,
  price,
}: PerfumeBottleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bottleRef = useRef<THREE.Mesh>(null);
  const capRef = useRef<THREE.Mesh>(null);
  const liquidRef = useRef<THREE.Mesh>(null);

  const liquidColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed * 0.01;

      const hoverScale = isActive ? 1.1 : 1;
      groupRef.current.scale.lerp(
        new THREE.Vector3(hoverScale, hoverScale, hoverScale),
        0.1
      );
    }
  });

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#ffffff"),
        metalness: 0,
        roughness: 0,
        transmission: 0.95,
        thickness: 0.5,
        ior: 1.5,
        envMapIntensity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0,
        transparent: true,
        opacity: 0.8,
      }),
    []
  );

  const liquidMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: liquidColor,
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.6,
        thickness: 0.3,
        ior: 1.33,
        envMapIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
      }),
    [liquidColor]
  );

  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#d4af37"),
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.5,
      }),
    []
  );

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group
        ref={groupRef}
        scale={scale}
        position={position}
        onClick={onClick}
        onPointerOver={onHover}
      >
        <group position={[0, -0.5, 0]}>
          {/* Main bottle body */}
          <mesh ref={bottleRef} material={glassMaterial} castShadow receiveShadow>
            <cylinderGeometry args={[0.6, 0.7, 2, 32]} />
          </mesh>

          {/* Liquid inside */}
          <mesh ref={liquidRef} material={liquidMaterial} position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.55, 0.65, 1.4, 32]} />
          </mesh>

          {/* Neck */}
          <mesh material={glassMaterial} position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.4, 0.6, 32]} />
          </mesh>

          {/* Cap */}
          <group ref={capRef} position={[0, 1.7, 0]}>
            <mesh material={goldMaterial} castShadow>
              <boxGeometry args={[0.5, 0.4, 0.5]} />
            </mesh>
            <mesh material={goldMaterial} position={[0, 0.25, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.25, 0.15, 32]} />
            </mesh>
          </group>

          {/* Base */}
          <mesh material={goldMaterial} position={[0, -1.1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.75, 0.75, 0.1, 32]} />
          </mesh>
        </group>

        {/* Particles around bottle */}
        <BottleParticles isActive={isActive} />
      </group>
    </Float>
  );
}
