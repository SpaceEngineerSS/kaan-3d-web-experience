"use client";

import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MumTKaan } from "./MumTKaan";
import { useFormationState } from "./useFormation";

const ANKA_MODEL_PATH = "/models/anka3.glb";
const LERP_SPEED = 0.025;

function lerp3(out: THREE.Vector3, target: [number, number, number], speed: number) {
    out.x = THREE.MathUtils.lerp(out.x, target[0], speed);
    out.y = THREE.MathUtils.lerp(out.y, target[1], speed);
    out.z = THREE.MathUtils.lerp(out.z, target[2], speed);
}

function lerpEuler(out: THREE.Euler, target: [number, number, number], speed: number) {
    out.x = THREE.MathUtils.lerp(out.x, target[0], speed);
    out.y = THREE.MathUtils.lerp(out.y, target[1], speed);
    out.z = THREE.MathUtils.lerp(out.z, target[2], speed);
}

function useAnkaModel(isMobile: boolean) {
    const { scene } = useGLTF(ANKA_MODEL_PATH);

    return useMemo(() => {
        const clone = scene.clone(true);

        clone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const convertMat = (m: THREE.Material): THREE.Material => {
                    if (m instanceof THREE.MeshStandardMaterial) {
                        if (isMobile) {
                            const lam = new THREE.MeshLambertMaterial({
                                map: m.map,
                                color: m.color,
                                transparent: m.transparent,
                                opacity: m.opacity,
                                side: m.side,
                                alphaTest: m.alphaTest,
                            });
                            lam.name = m.name;
                            return lam;
                        }
                        const mat = m.clone();
                        mat.envMap = null;
                        mat.envMapIntensity = 0;
                        return mat;
                    }
                    return m.clone();
                };
                if (Array.isArray(child.material)) {
                    child.material = child.material.map(convertMat);
                } else if (child.material) {
                    child.material = convertMat(child.material);
                }
            }
        });

        const box = new THREE.Box3().setFromObject(clone);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const sf = 3.5 / maxDim;

        clone.position.set(-center.x, -center.y, -center.z);

        const wrapper = new THREE.Group();
        wrapper.add(clone);
        wrapper.scale.setScalar(sf);
        wrapper.rotation.y = Math.PI;

        wrapper.traverse((obj) => {
            obj.frustumCulled = false;
        });

        return wrapper;
    }, [scene, isMobile]);
}

function DynamicDataLink({
    startRef,
    endRef,
    targetOpacity,
}: {
    startRef: React.RefObject<THREE.Group | null>;
    endRef: React.RefObject<THREE.Group | null>;
    targetOpacity: number;
}) {
    const tubeRef = useRef<THREE.Mesh>(null);
    const matRef = useRef<THREE.MeshBasicMaterial>(null);
    const currentOpacity = useRef(targetOpacity);
    const frameCounter = useRef(0);
    // Reuse vectors to avoid GC pressure
    const startPos = useMemo(() => new THREE.Vector3(), []);
    const endPos = useMemo(() => new THREE.Vector3(), []);
    const mid = useMemo(() => new THREE.Vector3(), []);

    useFrame((state) => {
        if (!startRef.current || !endRef.current || !tubeRef.current) return;

        // Throttle geometry rebuild to every 3rd frame
        frameCounter.current++;
        if (frameCounter.current % 3 !== 0) {
            // Still update opacity for smooth fading
            if (matRef.current) {
                currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, targetOpacity, 0.04);
                const pulse = 0.15 * Math.sin(state.clock.elapsedTime * 3);
                matRef.current.opacity = currentOpacity.current + pulse;
            }
            return;
        }

        startRef.current.getWorldPosition(startPos);
        endRef.current.getWorldPosition(endPos);

        mid.lerpVectors(startPos, endPos, 0.5);
        mid.y += 1.8;

        const curve = new THREE.QuadraticBezierCurve3(startPos.clone(), mid.clone(), endPos.clone());
        const newGeo = new THREE.TubeGeometry(curve, 24, 0.012, 4, false);

        if (tubeRef.current.geometry) tubeRef.current.geometry.dispose();
        tubeRef.current.geometry = newGeo;

        currentOpacity.current = THREE.MathUtils.lerp(
            currentOpacity.current,
            targetOpacity,
            0.04
        );

        if (matRef.current) {
            const pulse = 0.15 * Math.sin(state.clock.elapsedTime * 3);
            matRef.current.opacity = currentOpacity.current + pulse;
        }
    });

    return (
        <mesh ref={tubeRef}>
            <meshBasicMaterial
                ref={matRef}
                color="#00e5ff"
                transparent
                opacity={targetOpacity}
                depthWrite={false}
            />
        </mesh>
    );
}

function AnkaAlpha({ groupRef, isMobile }: { groupRef: React.RefObject<THREE.Group | null>; isMobile: boolean }) {
    const model = useAnkaModel(isMobile);
    const formation = useFormationState();

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;

        if (formation.mode === "FREE") {
            const baseX = -6.5;
            const baseY = -1;
            const baseZ = -3;
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, baseX + Math.sin(t * 0.4 + 1.0) * 1.2 + Math.sin(t * 0.15) * 0.5, 0.02);
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, baseY + Math.sin(t * 0.3 + 0.5) * 0.4 + Math.cos(t * 0.18) * 0.2, 0.02);
            groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, baseZ + Math.sin(t * 0.25 + 2.0) * 0.8, 0.02);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, Math.sin(t * 0.4 + 1.0) * 0.12, 0.025);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.sin(t * 0.3 + 0.5) * 0.04, 0.025);
        } else {
            lerp3(groupRef.current.position, formation.alpha.pos, LERP_SPEED);
            lerpEuler(groupRef.current.rotation, formation.alpha.rot, LERP_SPEED);
        }
    });

    return (
        <group ref={groupRef} position={formation.alpha.pos}>
            <primitive object={model} />
            <pointLight position={[0, -0.3, -0.8]} color="#ff3300" intensity={0.25} distance={2} />
        </group>
    );
}

function AnkaBravo({ groupRef, isMobile }: { groupRef: React.RefObject<THREE.Group | null>; isMobile: boolean }) {
    const model = useAnkaModel(isMobile);
    const formation = useFormationState();

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;

        if (formation.mode === "FREE") {
            const baseX = 6.5;
            const baseY = -1;
            const baseZ = -3;
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, baseX + Math.sin(t * 0.35 + 3.5) * 1.2 + Math.cos(t * 0.12) * 0.5, 0.02);
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, baseY + Math.cos(t * 0.28 + 1.2) * 0.4 + Math.sin(t * 0.2) * 0.2, 0.02);
            groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, baseZ + Math.cos(t * 0.22 + 4.0) * 0.8, 0.02);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, Math.sin(t * 0.35 + 3.5) * 0.12, 0.025);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.cos(t * 0.28 + 1.2) * 0.04, 0.025);
        } else {
            lerp3(groupRef.current.position, formation.bravo.pos, LERP_SPEED);
            lerpEuler(groupRef.current.rotation, formation.bravo.rot, LERP_SPEED);
        }
    });

    return (
        <group ref={groupRef} position={formation.bravo.pos}>
            <primitive object={model} />
            <pointLight position={[0, -0.3, -0.8]} color="#ff3300" intensity={0.25} distance={2} />
        </group>
    );
}

function SceneContent({ isMobile }: { isMobile: boolean }) {
    const kaanRef = useRef<THREE.Group>(null);
    const alphaRef = useRef<THREE.Group>(null);
    const bravoRef = useRef<THREE.Group>(null);
    const formation = useFormationState();

    const innerContent = (
        <>
            <group ref={kaanRef}>
                <MumTKaan />
            </group>
            <AnkaAlpha groupRef={alphaRef} isMobile={isMobile} />
            <AnkaBravo groupRef={bravoRef} isMobile={isMobile} />
            {/* Data links disabled on mobile — too heavy for mid-range GPUs */}
            {!isMobile && (
                <>
                    <DynamicDataLink startRef={kaanRef} endRef={alphaRef} targetOpacity={formation.linkAlpha.opacity} />
                    <DynamicDataLink startRef={kaanRef} endRef={bravoRef} targetOpacity={formation.linkBravo.opacity} />
                </>
            )}
        </>
    );

    return (
        <>
            <fog attach="fog" args={["#020617", 30, 80]} />
            {/* Environment removed — MeshLambertMaterial doesn't need IBL, eliminates feedback loop */}

            <ambientLight intensity={isMobile ? 0.8 : 0.5} />
            <directionalLight
                position={[8, 12, 5]}
                intensity={isMobile ? 1.5 : 1.2}
                color="#c8d6e5"
                castShadow={!isMobile}
                shadow-mapSize-width={isMobile ? 256 : 1024}
                shadow-mapSize-height={isMobile ? 256 : 1024}
            />
            {/* Reduce point lights on mobile: keep 1 instead of 3 */}
            {!isMobile && <pointLight position={[-5, 3, 2]} color="#00e5ff" intensity={0.8} distance={25} />}
            <pointLight position={[5, 2, -3]} color="#0ea5e9" intensity={isMobile ? 0.4 : 0.6} distance={22} />
            {!isMobile && <pointLight position={[0, 5, 8]} color="#ffffff" intensity={0.3} distance={20} />}

            <group scale={isMobile ? 0.35 : 1}>
                {/* Float animation disabled on mobile for perf */}
                {isMobile ? innerContent : (
                    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                        {innerContent}
                    </Float>
                )}
            </group>
        </>
    );
}

export function MumTScene() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.05 }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    return (
        <div ref={containerRef} className="h-full w-full">
            <Canvas
                shadows={!isMobile}
                dpr={isMobile ? 1 : [1, 2]}
                camera={{ position: [0, 3, 14], fov: 45 }}
                frameloop={isVisible ? "always" : "never"}
                gl={{
                    antialias: !isMobile,
                    alpha: false,
                    toneMapping: isMobile ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.1,
                    logarithmicDepthBuffer: !isMobile,
                    powerPreference: isMobile ? "low-power" : "high-performance",
                }}
                style={{ background: "#020617", touchAction: "pan-y" }}
            >
                <Suspense fallback={null}>
                    <SceneContent isMobile={isMobile} />
                </Suspense>
            </Canvas>
        </div>
    );
}

useGLTF.preload(ANKA_MODEL_PATH);
