"use client";

import { Suspense, useRef, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { KaanModel } from "./KaanModel";
import { RadarLoader } from "./RadarLoader";
import { ErrorBoundary } from "./ErrorBoundary";
import { useMouseParallax } from "@/hooks/useMouseParallax";

export function HeroScene() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouse = useMouseParallax(1);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = useCallback(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
        setScrollProgress(progress);
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <div ref={containerRef} className="fixed inset-0 z-0">
            <ErrorBoundary>
                <Suspense fallback={<RadarLoader />}>
                    <Canvas
                        camera={{ position: [0, 1.5, 6], fov: 50, near: 0.1, far: 100 }}
                        gl={{
                            antialias: true,
                            alpha: false,
                            powerPreference: "high-performance",
                            toneMapping: THREE.ACESFilmicToneMapping,
                            toneMappingExposure: 1.2,
                        }}
                        dpr={[1, 2]}
                    >
                        <color attach="background" args={["#050508"]} />
                        <fog attach="fog" args={["#050508", 5, 25]} />

                        {/* Key light — dramatic white spot from upper right */}
                        <spotLight
                            position={[10, 10, 10]}
                            intensity={2}
                            color="#ffffff"
                            castShadow
                            angle={0.4}
                            penumbra={0.5}
                        />

                        {/* Strong blue rim light — back left for silhouette edge */}
                        <spotLight
                            position={[-5, 2, -5]}
                            intensity={8}
                            color="#00d4ff"
                            angle={0.6}
                            penumbra={0.8}
                        />

                        {/* Underside blue fill */}
                        <pointLight
                            position={[0, -5, 0]}
                            intensity={1.5}
                            color="#0088ff"
                            distance={15}
                            decay={2}
                        />

                        {/* Engine glow — warm orange accent */}
                        <pointLight
                            position={[3, 0, -3]}
                            intensity={3}
                            color="#ffaa00"
                            distance={12}
                            decay={2}
                        />

                        {/* Subtle back-fill for depth */}
                        <pointLight
                            position={[0, 1, -10]}
                            intensity={2}
                            color="#00d4ff"
                            distance={18}
                            decay={2}
                        />

                        <KaanModel
                            scrollProgress={scrollProgress}
                            mouseX={mouse.x}
                            mouseY={mouse.y}
                        />

                        <Environment preset="city" blur={0.8} />
                    </Canvas>
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}
