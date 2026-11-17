"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useDeviceProfile, type DeviceProfile } from "@/hooks/useDeviceProfile";
import { useModel } from "@/lib/three/useModel";
import { formationPose, type FormationMode, type FormationPose } from "./useFormation";

const KAAN_PATH = "/models/KAAN.glb";
const ANKA_PATH = "/models/anka3.glb";
const POSTER = "/media/posters/anka3.jpg";

/** Model sizes keep the real ratio of largest dimensions: KAAN 20.3 m long (TUSAŞ), ANKA-3 13.1 m span. */
const KAAN_SIZE = 8;
const ANKA_SIZE = (KAAN_SIZE * 13.1) / 20.3;

type V3 = [number, number, number];

interface Motion {
    /** Jump straight to the target (reduced motion). */
    snap: boolean;
}

/** Frame-rate independent easing factor; clamps the long first delta after an idle period. */
function ease(dt: number, speed: number, motion: Motion) {
    if (motion.snap) return 1;
    return 1 - Math.exp(-Math.min(dt, 1 / 30) * speed * 60);
}

function approach(obj: THREE.Object3D, pos: V3 | null, rot: V3, k: number): number {
    let err = 0;
    if (pos) {
        obj.position.x += (pos[0] - obj.position.x) * k;
        obj.position.y += (pos[1] - obj.position.y) * k;
        obj.position.z += (pos[2] - obj.position.z) * k;
        err += Math.abs(pos[0] - obj.position.x) + Math.abs(pos[1] - obj.position.y) + Math.abs(pos[2] - obj.position.z);
    }
    obj.rotation.x += (rot[0] - obj.rotation.x) * k;
    obj.rotation.y += (rot[1] - obj.rotation.y) * k;
    obj.rotation.z += (rot[2] - obj.rotation.z) * k;
    err += Math.abs(rot[0] - obj.rotation.x) + Math.abs(rot[1] - obj.rotation.y) + Math.abs(rot[2] - obj.rotation.z);
    return err;
}

function Kaan({ pose, lite, motion, groupRef }: { pose: FormationPose; lite: boolean; motion: Motion; groupRef: React.RefObject<THREE.Group | null> }) {
    const { object } = useModel(KAAN_PATH, { size: KAAN_SIZE, lite, envIntensity: 1.2 });
    const invalidate = useThree((s) => s.invalidate);

    useFrame((_, dt) => {
        const g = groupRef.current;
        if (!g) return;
        const err = approach(g, null, [0, pose.kaan.yaw, pose.kaan.bank], ease(dt, 0.05, motion));
        if (err > 0.0005) invalidate();
    });

    return (
        <group ref={groupRef}>
            <primitive object={object} />
        </group>
    );
}

function Wingman({ target, lite, motion, groupRef }: { target: { pos: V3; rot: V3 }; lite: boolean; motion: Motion; groupRef: React.RefObject<THREE.Group | null> }) {
    const { object } = useModel(ANKA_PATH, { size: ANKA_SIZE, lite, envIntensity: 1.2 });
    const invalidate = useThree((s) => s.invalidate);
    // Start at the first target; later changes are eased in useFrame, not applied as props.
    const [initial] = useState(target.pos);

    useFrame((_, dt) => {
        const g = groupRef.current;
        if (!g) return;
        const err = approach(g, target.pos, target.rot, ease(dt, 0.04, motion));
        if (err > 0.001) invalidate();
    });

    return (
        <group ref={groupRef} position={initial}>
            <primitive object={object} />
        </group>
    );
}

const SEGMENTS = 32;

type LinkBuffers = {
    line: THREE.Line;
    material: THREE.LineDashedMaterial;
    positions: Float32Array;
    attr: THREE.BufferAttribute;
    distances: Float32Array;
    distAttr: THREE.BufferAttribute;
    a: THREE.Vector3;
    b: THREE.Vector3;
    m: THREE.Vector3;
};

/** Rewrites the curve in place. Returns true while the opacity is still easing. */
function updateLink(link: LinkBuffers, from: THREE.Object3D, to: THREE.Object3D, opacity: number, k: number): boolean {
    const { a, b, m, positions, attr, distances, distAttr, material, line } = link;
    from.getWorldPosition(a);
    to.getWorldPosition(b);
    line.parent?.worldToLocal(a);
    line.parent?.worldToLocal(b);
    a.y += 0.4;
    m.lerpVectors(a, b, 0.5);
    m.y += 1.6;
    for (let i = 0; i <= SEGMENTS; i++) {
        const t = i / SEGMENTS;
        const u = 1 - t;
        const j = i * 3;
        positions[j] = u * u * a.x + 2 * u * t * m.x + t * t * b.x;
        positions[j + 1] = u * u * a.y + 2 * u * t * m.y + t * t * b.y;
        positions[j + 2] = u * u * a.z + 2 * u * t * m.z + t * t * b.z;
        // Cumulative length for the dash pattern, written into the preallocated attribute.
        distances[i] = i === 0 ? 0 : distances[i - 1] + Math.hypot(positions[j] - positions[j - 3], positions[j + 1] - positions[j - 2], positions[j + 2] - positions[j - 1]);
    }
    attr.needsUpdate = true;
    distAttr.needsUpdate = true;
    material.opacity += (opacity - material.opacity) * k;
    return Math.abs(opacity - material.opacity) > 0.005;
}

/**
 * A curved line from one aircraft to another. The buffer is allocated once and its
 * vertices are rewritten in place on rendered frames only.
 */
function DataLink({ from, to, opacity, motion }: { from: React.RefObject<THREE.Group | null>; to: React.RefObject<THREE.Group | null>; opacity: number; motion: Motion }) {
    const invalidate = useThree((s) => s.invalidate);
    const link = useMemo(() => {
        const positions = new Float32Array((SEGMENTS + 1) * 3);
        const geometry = new THREE.BufferGeometry();
        const attr = new THREE.BufferAttribute(positions, 3);
        attr.setUsage(THREE.DynamicDrawUsage);
        geometry.setAttribute("position", attr);
        const distances = new Float32Array(SEGMENTS + 1);
        const distAttr = new THREE.BufferAttribute(distances, 1);
        distAttr.setUsage(THREE.DynamicDrawUsage);
        geometry.setAttribute("lineDistance", distAttr);
        const material = new THREE.LineDashedMaterial({ color: "#7fd4ff", transparent: true, opacity: 0, depthWrite: false, dashSize: 0.35, gapSize: 0.2 });
        const line = new THREE.Line(geometry, material);
        line.frustumCulled = false;
        return { line, geometry, material, positions, attr, distances, distAttr, a: new THREE.Vector3(), b: new THREE.Vector3(), m: new THREE.Vector3() };
    }, []);

    useEffect(
        () => () => {
            link.geometry.dispose();
            link.material.dispose();
        },
        [link]
    );

    useFrame((_, dt) => {
        if (!from.current || !to.current) return;
        if (updateLink(link, from.current, to.current, opacity, ease(dt, 0.06, motion))) invalidate();
    });

    return <primitive object={link.line} />;
}

function Formation({ mode, lite, reducedMotion, isMobile }: { mode: FormationMode; lite: boolean; reducedMotion: boolean; isMobile: boolean }) {
    const pose = useMemo(() => formationPose(mode), [mode]);
    const m = useMemo<Motion>(() => ({ snap: reducedMotion }), [reducedMotion]);
    const kaan = useRef<THREE.Group>(null);
    const alpha = useRef<THREE.Group>(null);
    const bravo = useRef<THREE.Group>(null);
    const invalidate = useThree((s) => s.invalidate);

    useEffect(() => {
        invalidate();
    }, [pose, invalidate]);

    return (
        <group scale={isMobile ? 0.55 : 1} position={isMobile ? [0, 1.6, 0] : [0, 2.4, 0]}>
            <Kaan pose={pose} lite={lite} motion={m} groupRef={kaan} />
            <Wingman target={pose.alpha} lite={lite} motion={m} groupRef={alpha} />
            <Wingman target={pose.bravo} lite={lite} motion={m} groupRef={bravo} />
            <DataLink from={kaan} to={alpha} opacity={pose.linkAlpha} motion={m} />
            <DataLink from={kaan} to={bravo} opacity={pose.linkBravo} motion={m} />
        </group>
    );
}

function StudioEnvironment() {
    return (
        <Environment resolution={128} frames={1}>
            <Lightformer form="rect" intensity={2.2} color="#f4f1ea" position={[0, 5, -2]} scale={[10, 2, 1]} rotation-x={Math.PI / 2} />
            <Lightformer form="rect" intensity={1.2} color="#dfe6ec" position={[-6, 1, 1]} scale={[3, 6, 1]} rotation-y={Math.PI / 2} />
            <Lightformer form="ring" intensity={0.6} color="#ffffff" position={[0, -4, 4]} scale={4} />
        </Environment>
    );
}

/** Asks for one frame whenever the loop is switched back on (e.g. scrolled back into view). */
function Wake({ active }: { active: boolean }) {
    const invalidate = useThree((s) => s.invalidate);
    useEffect(() => {
        if (active) invalidate();
    }, [active, invalidate]);
    return null;
}

function Poster() {
    return (
        <div className="absolute inset-0 bg-ink" aria-hidden>
            <Image src={POSTER} alt="" fill sizes="100vw" className="object-cover opacity-60" priority />
        </div>
    );
}

/**
 * Hero formation scene: KAAN with two ANKA-3s and the data links between them.
 * Renders on demand only: a frame is drawn while something is still easing toward its
 * target, and nothing at all while `active` is false (off-screen or tab hidden).
 */
export function MumTScene({ mode, active }: { mode: FormationMode; active: boolean }) {
    const profile = useDeviceProfile();
    if (!profile.ready) return <div className="absolute inset-0 bg-ink" aria-hidden />;
    if (profile.tier === 0) return <Poster />;
    return (
        <ErrorBoundary fallback={<Poster />}>
            <SceneCanvas profile={profile} mode={mode} active={active} />
        </ErrorBoundary>
    );
}

function SceneCanvas({ profile, mode, active }: { profile: DeviceProfile; mode: FormationMode; active: boolean }) {
    const lite = profile.tier === 1;
    return (
        <Canvas
            frameloop={active ? "demand" : "never"}
            dpr={profile.dpr}
            camera={{ position: [0, 3, profile.isMobile ? 26 : 15], fov: 45, near: 2, far: 80 }}
            gl={{
                antialias: profile.antialias,
                alpha: false,
                // ANKA-3 and the KAAN canopy have near-coplanar shells; a log depth buffer stops them flickering.
                logarithmicDepthBuffer: true,
                powerPreference: profile.tier === 3 ? "high-performance" : "default",
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 0.95,
            }}
            onCreated={({ gl, camera }) => {
                camera.lookAt(0, 0, 0);
                gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
            }}
        >
            <color attach="background" args={["#05070a"]} />
            {/* Distance haze: far aircraft fade into the ground colour instead of a hard edge. */}
            <fog attach="fog" args={["#05070a", 24, 70]} />
            <directionalLight position={[8, 12, 5]} intensity={lite ? 2.2 : 1.5} color="#f6f3ec" />
            <directionalLight position={[-6, 2, -4]} intensity={0.6} color="#9fb4c6" />
            {lite && <ambientLight intensity={0.6} color="#c9d1d8" />}
            <Suspense fallback={null}>
                <Formation mode={mode} lite={lite} reducedMotion={profile.reducedMotion} isMobile={profile.isMobile} />
                {!lite && <StudioEnvironment />}
            </Suspense>
            <Wake active={active} />
        </Canvas>
    );
}

useGLTF.preload(KAAN_PATH);
useGLTF.preload(ANKA_PATH);
