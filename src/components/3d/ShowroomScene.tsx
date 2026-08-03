"use client";

import React, { Suspense, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import Showroom from "./Showroom";

interface Product {
  id: string;
  name: string;
  price: number;
  color?: string;
  position?: [number, number, number];
}

interface ShowroomSceneProps {
  products?: Product[];
  onProductSelect?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  onLoaded?: () => void;
  className?: string;
}

export default function ShowroomScene({ products, onProductSelect, onProductClick, onLoaded, className }: ShowroomSceneProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollProgress(target.scrollTop / (target.scrollHeight - target.clientHeight));
  }, []);

  const handleProductClick = onProductSelect || onProductClick;

  return (
    <div className={className} style={{ width: "100%", height: "100vh" }} onScroll={handleScroll}>
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 2, 8], fov: 50 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }} onCreated={() => onLoaded?.()}>
        <color attach="background" args={["#050508"]} />
        <fog attach="fog" args={["#050508", 8, 20]} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.15} color="#ffd4a8" />
          <Showroom products={products} onProductClick={handleProductClick} scrollProgress={scrollProgress} />
          <OrbitControls enablePan={false} enableZoom={true} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.2} minDistance={5} maxDistance={12} target={[0, 1, 0]} autoRotate autoRotateSpeed={0.3} />
          <Environment preset="warehouse" environmentIntensity={0.3} />
          <EffectComposer multisampling={4}>
            <Bloom intensity={0.3} luminanceThreshold={0.7} luminanceSmoothing={0.9} mipmapBlur />
            <Vignette offset={0.3} darkness={0.6} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
