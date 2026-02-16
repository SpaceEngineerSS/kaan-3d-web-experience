"use client";

import { Suspense, useRef, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { KaanModel } from "./KaanModel";
import { AfterburnerEffect } from "./AfterburnerEffect";
import { RadarLoader } from "./RadarLoader";
import { ErrorBoundary } from "./ErrorBoundary";
import { useMouseParallax } from "@/hooks/useMouseParallax";

interface HeroSceneProps {
    xRayMode?: boolean;
    cameraPreset?: string | null;
}

export function HeroScene({ xRayMode = false, cameraPreset = null }: HeroSceneProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const mouse = useMouseParallax(1, !isMobile);
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

    const cameraZ = isMobile ? 9 : 6;

    return (
        <div ref={containerRef} className="fixed inset-0 z-0">
            <ErrorBoundary>
                <Suspense fallback={<RadarLoader />}>
                    <Canvas
                        camera={{ position: [0, 1.5, cameraZ], fov: 50, near: 0.1, far: 100 }}
                        gl={{
                            antialias: !isMobile,
                            alpha: false,
                            powerPreference: isMobile ? "default" : "high-performance",
                            toneMapping: THREE.ACESFilmicToneMapping,
                            toneMappingExposure: 1.2,
                        }}
                        dpr={isMobile ? [1, 1.5] : [1, 2]}
                    >
                        <color attach="background" args={["#050508"]} />
                        <fog attach="fog" args={["#050508", 5, 25]} />

                        {/* Key light */}
                        <spotLight
                            position={[10, 10, 10]}
                            intensity={2}
                            color="#ffffff"
                            castShadow={!isMobile}
                            angle={0.4}
                            penumbra={0.5}
                        />

                        {/* Strong blue rim light */}
                        <spotLight
                            position={[-5, 2, -5]}
                            intensity={8}
                            color="#00d4ff"
                            angle={0.6}
                            penumbra={0.8}
                        />

                        {/* Underside blue fill */}
                        <pointLight position={[0, -5, 0]} intensity={1.5} color="#0088ff" distance={15} decay={2} />

                        {/* Engine glow */}
                        <pointLight position={[3, 0, -3]} intensity={3} color="#ffaa00" distance={12} decay={2} />

                        {/* Subtle back-fill for depth */}
                        <pointLight position={[0, 1, -10]} intensity={2} color="#00d4ff" distance={18} decay={2} />

                        {/* Top accent light */}
                        <spotLight position={[0, 12, 2]} intensity={1.5} color="#ffffff" angle={0.3} penumbra={0.9} />

                        <KaanModel
                            scrollProgress={scrollProgress}
                            mouseX={mouse.x}
                            mouseY={mouse.y}
                            xRayMode={xRayMode}
                            cameraPreset={cameraPreset}
                        />

                        {!xRayMode && <AfterburnerEffect scrollProgress={scrollProgress} />}

                        <Stars radius={80} depth={60} count={1500} factor={3} saturation={0} fade speed={0.5} />

                        <Environment preset="city" blur={0.8} />

                        {!isMobile && (
                            <EffectComposer>
                                <Bloom
                                    intensity={0.5}
                                    luminanceThreshold={0.6}
                                    luminanceSmoothing={0.9}
                                    mipmapBlur
                                />
                                <Vignette
                                    eskil={false}
                                    offset={0.3}
                                    darkness={0.7}
                                    blendFunction={BlendFunction.NORMAL}
                                />
                                <ChromaticAberration
                                    offset={new THREE.Vector2(0.0005, 0.0005)}
                                    blendFunction={BlendFunction.NORMAL}
                                    radialModulation={false}
                                    modulationOffset={0}
                                />
                            </EffectComposer>
                        )}
                    </Canvas>
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}
