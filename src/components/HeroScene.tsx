"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, Stars } from "@react-three/drei";
import * as THREE from "three";
import { KaanModel, SceneInput, type CameraPreset } from "./KaanModel";
import { ErrorBoundary } from "./ErrorBoundary";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";

interface HeroSceneProps {
    xRay?: boolean;
    preset?: CameraPreset | null;
    /** Id of the element whose top edge marks where the scene stops rendering. */
    endMarkerId?: string;
}

/** Feeds scroll and pointer into a ref and asks for a frame only when something changed. */
function InputDriver({ input, endMarkerId, active }: { input: SceneInput; endMarkerId: string; active: React.RefObject<boolean> }) {
    const invalidate = useThree((s) => s.invalidate);

    useEffect(() => {
        const marker = () => document.getElementById(endMarkerId);
        const onScroll = () => {
            const m = marker();
            const span = m ? m.offsetTop - window.innerHeight * 0.5 : document.documentElement.scrollHeight - window.innerHeight;
            input.setProgress(span > 0 ? Math.min(Math.max(window.scrollY / span, 0), 1) : 0);
            if (active.current) invalidate();
        };
        const fine = window.matchMedia("(pointer: fine)").matches;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const onPointer = (e: PointerEvent) => {
            input.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
            if (active.current) invalidate();
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        if (fine && !reduce) window.addEventListener("pointermove", onPointer, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            window.removeEventListener("pointermove", onPointer);
        };
    }, [input, endMarkerId, active, invalidate]);

    return null;
}

/** Local studio lighting baked into a small cube map: no HDR download. */
function StudioEnvironment() {
    return (
        <Environment resolution={128} frames={1}>
            <Lightformer form="rect" intensity={2.2} color="#f4f1ea" position={[0, 5, -2]} scale={[10, 2, 1]} rotation-x={Math.PI / 2} />
            <Lightformer form="rect" intensity={1.2} color="#dfe6ec" position={[-6, 1, 1]} scale={[3, 6, 1]} rotation-y={Math.PI / 2} />
            <Lightformer form="rect" intensity={0.9} color="#f2a07a" position={[6, 0, -2]} scale={[2, 5, 1]} rotation-y={-Math.PI / 2} />
            <Lightformer form="ring" intensity={0.6} color="#ffffff" position={[0, -4, 4]} scale={4} />
        </Environment>
    );
}

export function HeroScene({ xRay = false, preset = null, endMarkerId = "scene-end" }: HeroSceneProps) {
    const profile = useDeviceProfile();
    const [input] = useState(() => new SceneInput());
    const active = useRef(true);
    const [visible, setVisible] = useState(true);
    // Stop drawing (and hide) once the page has scrolled past the scene's chapters.
    useEffect(() => {
        const m = document.getElementById(endMarkerId);
        if (!m) return;
        const io = new IntersectionObserver(
            ([e]) => {
                const past = !e.isIntersecting && e.boundingClientRect.top < 0;
                active.current = !past;
                setVisible(!past);
            },
            { threshold: 0 }
        );
        io.observe(m);
        return () => io.disconnect();
    }, [endMarkerId]);

    if (!profile.ready) return <div className="fixed inset-0 z-0 bg-ground" aria-hidden />;

    if (profile.tier === 0) {
        return (
            <div className="fixed inset-0 z-0 bg-ground" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/kaan-poster.webp" alt="" className="h-full w-full object-cover opacity-70" />
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-0 transition-opacity duration-700"
            style={{ opacity: visible ? 1 : 0, visibility: visible ? "visible" : "hidden" }}
            aria-hidden
        >
            <SceneCanvas profile={profile} input={input} active={active} xRay={xRay} preset={preset} endMarkerId={endMarkerId} />
        </div>
    );
}

function SceneCanvas({
    profile,
    input,
    active,
    xRay,
    preset,
    endMarkerId,
}: {
    profile: ReturnType<typeof useDeviceProfile>;
    input: SceneInput;
    active: React.RefObject<boolean>;
    xRay: boolean;
    preset: CameraPreset | null;
    endMarkerId: string;
}) {
    const [dpr, setDpr] = useState<number>(profile.dpr[1]);
    const lite = profile.tier === 1;

    return (
        <>
            <ErrorBoundary fallback={<div className="h-full w-full bg-ground" />}>
                <Canvas
                    frameloop="demand"
                    dpr={dpr}
                    camera={{ position: [0, 1.5, profile.isMobile ? 9 : 6], fov: 50, near: 0.1, far: 100 }}
                    gl={{
                        antialias: profile.antialias,
                        alpha: false,
                        powerPreference: profile.tier === 3 ? "high-performance" : "default",
                        toneMapping: THREE.ACESFilmicToneMapping,
                        toneMappingExposure: 1.05,
                    }}
                    onCreated={({ gl }) => {
                        gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
                    }}
                >
                    <PerformanceMonitor
                        bounds={() => [40, 58]}
                        onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
                        onIncline={() => setDpr((d) => Math.min(profile.dpr[1], d + 0.25))}
                    />
                    <color attach="background" args={["#0d1013"]} />

                    <directionalLight position={[6, 8, 6]} intensity={lite ? 2.2 : 1.6} color="#f6f3ec" />
                    <directionalLight position={[-6, 2, -4]} intensity={0.9} color="#bfcad4" />
                    {!lite && <pointLight position={[3, -1, -3]} intensity={6} distance={10} decay={2} color="#f2662b" />}
                    {lite && <ambientLight intensity={0.6} color="#c9d1d8" />}

                    <Suspense fallback={null}>
                        <KaanModel input={input} xRay={xRay} preset={preset} lite={lite} />
                        {!lite && <StudioEnvironment />}
                    </Suspense>

                    <Stars radius={80} depth={60} count={profile.starCount} factor={2.4} saturation={0} fade speed={0} />
                    <InputDriver input={input} endMarkerId={endMarkerId} active={active} />
                </Canvas>
            </ErrorBoundary>
        </>
    );
}
