"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import PerfumeBottle from "./PerfumeBottle";
import GoldParticles from "./GoldParticles";
import SmokeEffect, { WispySmoke } from "./SmokeEffect";

interface SceneProps {
  onProductClick?: () => void;
  className?: string;
}

function MouseReactiveCamera() {
  const { camera } = useThree();
  useFrame((state) => {
    const targetX = state.mouse.x * 0.5;
    const targetY = state.mouse.y * 0.3;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY + 1, 0.02);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.3} color="#ffd4a8" />
      <spotLight position={[5, 8, 5]} angle={0.4} penumbra={0.8} intensity={2} color="#ffd700" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <spotLight position={[-5, 6, 3]} angle={0.5} penumbra={0.7} intensity={1.5} color="#ff9966" castShadow />
      <pointLight position={[0, 3, -3]} intensity={0.8} color="#ffffff" />
      <pointLight position={[3, 1, 2]} intensity={0.5} color="#d4af37" />
      <pointLight position={[-3, 1, 2]} intensity={0.5} color="#d4af37" />
    </>
  );
}

export default function Scene({ onProductClick, className }: SceneProps) {
  return (
    <div className={className} style={{ width: "100%", height: "100vh" }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1, 5], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <color attach="background" args={["#0a0a0f"]} />
        <fog attach="fog" args={["#0a0a0f", 5, 15]} />
        <Suspense fallback={null}>
          <Lighting />
          <MouseReactiveCamera />
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
            <PerfumeBottle color="#d4a574" scale={1.2} position={[0, 0, 0]} onClick={onProductClick} isActive={true} rotationSpeed={0.5} />
          </Float>
          <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
            <PerfumeBottle color="#c41e3a" scale={0.5} position={[-3, -0.5, -2]} rotationSpeed={0.3} />
          </Float>
          <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
            <PerfumeBottle color="#4b0082" scale={0.5} position={[3, -0.5, -2]} rotationSpeed={0.3} />
          </Float>
          <GoldParticles count={400} spread={6} size={0.04} opacity={0.6} />
          <SmokeEffect position={[0, -1, 0]} opacity={0.2} count={15} />
          <WispySmoke position={[0, 0, -2]} opacity={0.15} />
          <Environment preset="night" environmentIntensity={0.4} />
          <EffectComposer multisampling={4}>
            <Bloom intensity={0.5} luminanceThreshold={0.6} luminanceSmoothing={0.9} mipmapBlur />
            <Vignette offset={0.3} darkness={0.7} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
