"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import PerfumeBottle from "./PerfumeBottle";

interface Product {
  id: string;
  name: string;
  price: number;
  color?: string;
  position?: [number, number, number];
}

interface ShowroomProps {
  products?: Product[];
  onProductClick?: (product: Product) => void;
  scrollProgress?: number;
}

function Shelf({ position, width = 4, height = 0.05, depth = 0.8 }: {
  position: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
}) {
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
    <group position={position}>
      {/* Main shelf */}
      <mesh material={goldMaterial} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
      </mesh>
      {/* Front trim */}
      <mesh material={goldMaterial} position={[0, height / 2, depth / 2]} castShadow>
        <boxGeometry args={[width, height * 2, 0.02]} />
      </mesh>
    </group>
  );
}

function Wall({ position, rotation, width = 10, height = 6 }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
}) {
  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0d0d1a"),
        metalness: 0.1,
        roughness: 0.8,
      }),
    []
  );

  const goldTrimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#d4af37"),
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 2,
      }),
    []
  );

  return (
    <group position={position} rotation={rotation}>
      <mesh material={wallMaterial} receiveShadow>
        <boxGeometry args={[width, height, 0.1]} />
      </mesh>
      {/* Gold trim at bottom */}
      <mesh material={goldTrimMaterial} position={[0, -height / 2 + 0.05, 0.06]} castShadow>
        <boxGeometry args={[width, 0.1, 0.02]} />
      </mesh>
      {/* Gold trim at top */}
      <mesh material={goldTrimMaterial} position={[0, height / 2 - 0.05, 0.06]} castShadow>
        <boxGeometry args={[width, 0.1, 0.02]} />
      </mesh>
    </group>
  );
}

function SpotLightRig() {
  return (
    <>
      {/* Main spotlight on center display */}
      <spotLight
        position={[0, 5, 2]}
        angle={0.4}
        penumbra={0.8}
        intensity={2}
        color="#ffd700"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/* Side spotlights */}
      <spotLight
        position={[-4, 4, 0]}
        angle={0.5}
        penumbra={0.7}
        intensity={1.5}
        color="#ff9966"
        castShadow
      />
      <spotLight
        position={[4, 4, 0]}
        angle={0.5}
        penumbra={0.7}
        intensity={1.5}
        color="#ff9966"
        castShadow
      />
      {/* Back light */}
      <spotLight
        position={[0, 3, -3]}
        angle={0.6}
        penumbra={0.9}
        intensity={1}
        color="#ffffff"
      />
    </>
  );
}

export default function Showroom({
  products = [],
  onProductClick,
  scrollProgress = 0,
}: ShowroomProps) {
  const groupRef = useRef<THREE.Group>(null);

  const defaultProducts: Product[] = useMemo(
    () => [
      { id: "1", name: "Noir Essence", price: 299, color: "#8b4513", position: [-2, 0.5, 0] },
      { id: "2", name: "Golden Night", price: 399, color: "#d4a574", position: [0, 0.5, 0] },
      { id: "3", name: "Velvet Rose", price: 349, color: "#c41e3a", position: [2, 0.5, 0] },
      { id: "4", name: "Midnight Orchid", price: 449, color: "#4b0082", position: [-1.5, 2, -1] },
      { id: "5", name: "Amber Luxe", price: 529, color: "#ffbf00", position: [1.5, 2, -1] },
    ],
    []
  );

  const displayProducts = products.length > 0 ? products : defaultProducts;

  useFrame((state) => {
    if (groupRef.current) {
      const targetRotation = scrollProgress * Math.PI * 0.5;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#1a1a2e"
          metalness={0.5}
          mirror={0.5}
        />
      </mesh>

      {/* Walls */}
      <Wall position={[0, 2.5, -5]} width={12} height={6} />
      <Wall position={[-6, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} width={10} height={6} />
      <Wall position={[6, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} width={10} height={6} />

      {/* Shelves */}
      <Shelf position={[-3, 1, -4.5]} width={3} />
      <Shelf position={[3, 1, -4.5]} width={3} />
      <Shelf position={[-3, 2.5, -4.5]} width={3} />
      <Shelf position={[3, 2.5, -4.5]} width={3} />

      {/* Center display pedestal */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.3, 32]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Perfume bottles */}
      {displayProducts.map((product, index) => (
        <PerfumeBottle
          key={product.id}
          name={product.name}
          price={product.price}
          color={product.color}
          position={product.position || [0, 0.7, 0]}
          scale={0.6}
          onClick={() => onProductClick?.(product)}
          rotationSpeed={0.3 + index * 0.1}
        />
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.2} color="#ffffff" />
      <SpotLightRig />

      {/* Contact shadows */}
      <ContactShadows
        position={[0, -0.49, 0]}
        opacity={0.6}
        scale={10}
        blur={2}
        far={4}
        color="#000000"
      />

      {/* Environment */}
      <Environment preset="warehouse" environmentIntensity={0.5} />
    </group>
  );
}
