"use client";

import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows, Float, MeshReflectorMaterial } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";

interface ProductSceneProps {
  productId?: string;
  name?: string;
  price?: number;
  color?: string;
  className?: string;
}

function RotatingBottle({ color = "#d4a574" }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const liquidColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
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
        envMapIntensity: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0,
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  const liquidMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: liquidColor,
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.6,
        thickness: 0.4,
        ior: 1.33,
        envMapIntensity: 1,
        transparent: true,
        opacity: 0.92,
      }),
    [liquidColor]
  );

  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#d4af37"),
        metalness: 0.95,
        roughness: 0.05,
        envMapIntensity: 2,
      }),
    []
  );

  const darkGoldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#b8941f"),
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.5,
      }),
    []
  );

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
      <group ref={groupRef} scale={1.4}>
        <group position={[0, -0.6, 0]}>
          {/* Base platform */}
          <mesh material={goldMaterial} position={[0, -1.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.9, 0.95, 0.12, 64]} />
          </mesh>
          <mesh material={darkGoldMaterial} position={[0, -1.25, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.0, 1.0, 0.08, 64]} />
          </mesh>

          {/* Main bottle body - hexagonal */}
          <mesh ref={useRef<THREE.Mesh>(null)} material={glassMaterial} castShadow receiveShadow>
            <cylinderGeometry args={[0.55, 0.65, 2.2, 6]} />
          </mesh>

          {/* Liquid inside */}
          <mesh material={liquidMaterial} position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.5, 0.6, 1.6, 6]} />
          </mesh>

          {/* Inner glow */}
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.35, 0.45, 1.2, 6]} />
            <meshBasicMaterial color={color} transparent opacity={0.15} />
          </mesh>

          {/* Neck ring */}
          <mesh material={goldMaterial} position={[0, 1.25, 0]} castShadow>
            <torusGeometry args={[0.28, 0.04, 16, 32]} />
          </mesh>

          {/* Neck */}
          <mesh material={glassMaterial} position={[0, 1.35, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.28, 0.4, 32]} />
          </mesh>

          {/* Cap base */}
          <mesh material={goldMaterial} position={[0, 1.65, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.15, 32]} />
          </mesh>

          {/* Cap body */}
          <mesh material={goldMaterial} position={[0, 1.9, 0]} castShadow>
            <boxGeometry args={[0.45, 0.35, 0.45]} />
          </mesh>

          {/* Cap top jewel */}
          <mesh material={goldMaterial} position={[0, 2.15, 0]} castShadow>
            <sphereGeometry args={[0.12, 32, 32]} />
          </mesh>

          {/* Gold accent lines on bottle */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh
              key={i}
              material={goldMaterial}
              position={[
                Math.cos((i * Math.PI * 2) / 6) * 0.58,
                0,
                Math.sin((i * Math.PI * 2) / 6) * 0.58,
              ]}
              castShadow
            >
              <boxGeometry args={[0.02, 2.2, 0.02]} />
            </mesh>
          ))}

          {/* Gold band around middle */}
          <mesh material={goldMaterial} position={[0, 0, 0]} castShadow>
            <torusGeometry args={[0.62, 0.025, 16, 64]} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

function GoldParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 150;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 1.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 0.5;
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.003;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        transparent
        color="#d4af37"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingRings() {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      ringsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={ringsRef} position={[0, 0.3, 0]}>
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.8, 0.008, 16, 100]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[2.0, 0.006, 16, 100]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.12} />
      </mesh>
      <mesh rotation={[Math.PI / 2.8, -Math.PI / 3, 0]}>
        <torusGeometry args={[2.2, 0.005, 16, 100]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function ProductLighting() {
  return (
    <>
      <ambientLight intensity={0.2} color="#ffd4a8" />

      {/* Key light - warm gold */}
      <spotLight
        position={[4, 6, 4]}
        angle={0.3}
        penumbra={0.8}
        intensity={4}
        color="#ffd700"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Fill light - soft amber */}
      <spotLight
        position={[-4, 5, 3]}
        angle={0.4}
        penumbra={0.7}
        intensity={2}
        color="#ff9966"
        castShadow
      />

      {/* Rim light - cool white */}
      <spotLight
        position={[0, 4, -4]}
        angle={0.5}
        penumbra={0.9}
        intensity={2.5}
        color="#ffffff"
      />

      {/* Bottom accent */}
      <pointLight position={[0, -2, 3]} intensity={1} color="#d4af37" />

      {/* Side accents */}
      <pointLight position={[3, 0, 0]} intensity={0.5} color="#ff6b6b" />
      <pointLight position={[-3, 0, 0]} intensity={0.5} color="#4ecdc4" />

      {/* Back glow */}
      <pointLight position={[0, 2, -3]} intensity={0.8} color="#ffd700" />
    </>
  );
}

export default function ProductScene({
  productId,
  name = "Luxury Perfume",
  price = 299,
  color = "#d4a574",
  className,
}: ProductSceneProps) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.5, 5], fov: 35 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
        }}
      >
        <color attach="background" args={["#050508"]} />
        <fog attach="fog" args={["#050508", 5, 15]} />

        <Suspense fallback={null}>
          <ProductLighting />

          {/* Main product bottle */}
          <RotatingBottle color={color} />

          {/* Floating orbital rings */}
          <FloatingRings />

          {/* Gold particles */}
          <GoldParticles />

          {/* Contact shadows */}
          <ContactShadows
            position={[0, -1.85, 0]}
            opacity={0.8}
            scale={10}
            blur={2.5}
            far={4}
            color="#000000"
          />

          {/* Reflective floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.85, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={1024}
              mixBlur={1}
              mixStrength={40}
              roughness={0.8}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#0a0a0f"
              metalness={0.5}
              mirror={0.3}
            />
          </mesh>

          {/* Camera controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.8}
            minDistance={3}
            maxDistance={8}
            target={[0, 0.3, 0]}
            autoRotate={false}
          />

          {/* Environment */}
          <Environment preset="night" environmentIntensity={0.8} />

          {/* Post processing */}
          <EffectComposer multisampling={4}>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.4}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <Vignette offset={0.15} darkness={0.8} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
