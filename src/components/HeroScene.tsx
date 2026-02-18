/**
 * @author Mehmet Gümüş [github.com/SpaceEngineerSS](https://github.com/SpaceEngineerSS)
 * @project KAAN 3D Web Experience
 */
"use client";

import { Suspense, useRef, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Stars, useGLTF } from "@react-three/drei";
import {
    EffectComposer,
    Bloom,
    Vignette,
    ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { KaanModel } from "./KaanModel";
import { RadarLoader } from "./RadarLoader";
import { ErrorBoundary } from "./ErrorBoundary";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";

interface HeroSceneProps {
    xRayMode?: boolean;
    cameraPreset?: string | null;
}

export function HeroScene({
    xRayMode = false,
    cameraPreset = null,
}: HeroSceneProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { isMobile, dpr, shadowsEnabled, postProcessing, particleDensity } =
        useDeviceProfile();

    const [scrollProgress, setScrollProgress] = useState(0);
    const mouse = useMouseParallax(1, !isMobile);

    // Scroll progress — clamped to [0, 1]
    const handleScroll = useCallback(() => {
        const scrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight <= 0) return;
        setScrollProgress(
            Math.min(Math.max(window.scrollY / scrollHeight, 0), 1)
        );
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    // WebGL context loss recovery
    useEffect(() => {
        const canvas = containerRef.current?.querySelector("canvas");
        if (!canvas) return;

        const handleContextLost = (e: Event) => {
            e.preventDefault();
            console.warn("[KAAN] WebGL context lost — will attempt restore");
        };
        const handleContextRestored = () => {
            console.info("[KAAN] WebGL context restored");
        };

        canvas.addEventListener("webglcontextlost", handleContextLost);
        canvas.addEventListener("webglcontextrestored", handleContextRestored);

        return () => {
            canvas.removeEventListener("webglcontextlost", handleContextLost);
            canvas.removeEventListener("webglcontextrestored", handleContextRestored);
        };
    }, []);

    const cameraZ = isMobile ? 9 : 6;
    const starCount = isMobile ? 500 : 1500;

    return (
        <div ref={containerRef} className="fixed inset-0 z-0">
            <ErrorBoundary>
                <Suspense fallback={<RadarLoader />}>
                    <Canvas
                        frameloop="always"
                        camera={{
                            position: [0, 1.5, cameraZ],
                            fov: 50,
                            near: 0.1,
                            far: 100,
                        }}
                        gl={{
                            antialias: !isMobile,
                            alpha: false,
                            powerPreference: isMobile ? "default" : "high-performance",
                            toneMapping: THREE.ACESFilmicToneMapping,
                            toneMappingExposure: 1.2,
                        }}
                        dpr={dpr}
                    >
                        <color attach="background" args={["#050508"]} />
                        {/* Fog disabled to prevent model blackout issue */}
                        {/* <fog attach="fog" args={["#050508", 10, 100]} /> */}

                        <spotLight
                            position={[10, 10, 10]}
                            intensity={isMobile ? 1.5 : 2}
                            color="#ffffff"
                            castShadow={shadowsEnabled}
                            angle={0.4}
                            penumbra={0.5}
                        />

                        <spotLight
                            position={[-5, 2, -5]}
                            intensity={isMobile ? 4 : 8}
                            color="#00d4ff"
                            angle={0.6}
                            penumbra={0.8}
                        />

                        {!isMobile && (
                            <>
                                <pointLight
                                    position={[0, -5, 0]}
                                    intensity={1.5}
                                    color="#0088ff"
                                    distance={15}
                                    decay={2}
                                />
                                <pointLight
                                    position={[0, 1, -10]}
                                    intensity={2}
                                    color="#00d4ff"
                                    distance={18}
                                    decay={2}
                                />
                                <spotLight
                                    position={[0, 12, 2]}
                                    intensity={1.5}
                                    color="#ffffff"
                                    angle={0.3}
                                    penumbra={0.9}
                                />
                            </>
                        )}

                        <pointLight
                            position={[3, 0, -3]}
                            intensity={isMobile ? 2 : 3}
                            color="#ffaa00"
                            distance={12}
                            decay={2}
                        />

                        <KaanModel
                            scrollProgress={scrollProgress}
                            mouseX={mouse.x}
                            mouseY={mouse.y}
                            xRayMode={xRayMode}
                            cameraPreset={cameraPreset}
                        />



                        <Stars
                            radius={80}
                            depth={60}
                            count={starCount}
                            factor={3}
                            saturation={0}
                            fade
                            speed={0.5}
                        />

                        <Environment preset="city" blur={0.8} />

                        {/* Post-processing disabled to prevent bloom artifacting */}
                        {false && postProcessing === "full" && (
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

// Eagerly preload GLB model
useGLTF.preload("/models/KAAN.glb");
