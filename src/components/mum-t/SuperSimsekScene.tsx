"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useDeviceProfile, type DeviceProfile } from "@/hooks/useDeviceProfile";
import { useModel } from "@/lib/three/useModel";

const MODEL_PATH = "/models/super-simsek.glb";
const POSTER = "/media/posters/super-simsek.jpg";

function Model({ lite }: { lite: boolean }) {
    const { object } = useModel(MODEL_PATH, { size: 4.5, lite, flip: false, envIntensity: 1 });
    return (
        <group rotation={[0.25, -0.75, 0]}>
            <primitive object={object} />
        </group>
    );
}

function Wake({ active }: { active: boolean }) {
    const invalidate = useThree((s) => s.invalidate);
    useEffect(() => {
        if (active) invalidate();
    }, [active, invalidate]);
    return null;
}

function Poster({ alt }: { alt: string }) {
    return (
        <div className="relative h-full w-full bg-ground-2">
            <Image src={POSTER} alt={alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
    );
}

/**
 * Inspectable Süper Şimşek model. Draws a frame only when dragged; stops entirely while
 * off-screen or while the tab is hidden.
 */
export function SuperSimsekScene({ label }: { label: string }) {
    const profile = useDeviceProfile();
    const ref = useRef<HTMLDivElement>(null);
    const [onScreen, setOnScreen] = useState(false);
    const [tabVisible, setTabVisible] = useState(true);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0 });
        io.observe(el);
        const onVis = () => setTabVisible(!document.hidden);
        onVis();
        document.addEventListener("visibilitychange", onVis);
        return () => {
            io.disconnect();
            document.removeEventListener("visibilitychange", onVis);
        };
    }, []);

    return (
        <div ref={ref} className="absolute inset-0">
            {!profile.ready ? null : profile.tier === 0 ? (
                <Poster alt={label} />
            ) : (
                <ErrorBoundary fallback={<Poster alt={label} />}>
                    <SimsekCanvas profile={profile} active={onScreen && tabVisible} label={label} />
                </ErrorBoundary>
            )}
        </div>
    );
}

function SimsekCanvas({ profile, active, label }: { profile: DeviceProfile; active: boolean; label: string }) {
    const lite = profile.tier === 1;
    return (
        <Canvas
            frameloop={active ? "demand" : "never"}
            dpr={profile.dpr}
            camera={{ position: [0, 1, 6], fov: 40 }}
            gl={{ antialias: profile.antialias, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
            aria-label={label}
            role="img"
            onCreated={({ gl }) => {
                gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
            }}
        >
            <color attach="background" args={["#12161a"]} />
            <ambientLight intensity={lite ? 0.8 : 0.45} color="#c9d1d8" />
            <directionalLight position={[5, 8, 4]} intensity={1.8} color="#f6f3ec" />
            <directionalLight position={[-4, 1, -3]} intensity={0.7} color="#bfcad4" />
            <Suspense fallback={null}>
                <Model lite={lite} />
            </Suspense>
            {/* Touch drags stay with the page scroll on phones. */}
            {!profile.isMobile && <OrbitControls enablePan={false} enableZoom={false} enableDamping={false} minPolarAngle={Math.PI * 0.2} maxPolarAngle={Math.PI * 0.75} />}
            <Wake active={active} />
        </Canvas>
    );
}

useGLTF.preload(MODEL_PATH);
