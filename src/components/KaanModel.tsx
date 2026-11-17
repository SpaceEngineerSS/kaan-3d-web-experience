"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { applyMaterialOverride, useModel } from "@/lib/three/useModel";

export type CameraPreset = "front" | "side" | "top" | "rear" | "cockpit";

const PRESETS: Record<CameraPreset, [number, number, number]> = {
    front: [0.1, 0, 0],
    side: [0, Math.PI * 0.5, 0],
    top: [-Math.PI / 2, 0, 0],
    rear: [0.05, Math.PI, 0],
    cockpit: [-0.35, Math.PI * 1.75, 0],
};

export const MODEL_PATH = "/models/KAAN.glb";

/** Mutable input shared between the DOM listeners and the render loop (no React state, no re-renders). */
export class SceneInput {
    /** 0..1 progress through the part of the page the scene belongs to. */
    progress = 0;
    /** Pointer, -1..1 on each axis. */
    px = 0;
    py = 0;
    setProgress(p: number) {
        this.progress = p;
    }
    setPointer(x: number, y: number) {
        this.px = x;
        this.py = y;
    }
}

interface KaanModelProps {
    input: SceneInput;
    xRay: boolean;
    preset: CameraPreset | null;
    lite: boolean;
}

/** Scroll path: plan view → side profile → three-quarter front. */
function scrollPose(p: number): [number, number, number] {
    const top = -Math.PI / 2;
    const side = 0;
    const front = Math.PI * 0.1;
    if (p < 0.33) {
        const t = p / 0.33;
        return [top + (side - top) * t, 2 * Math.PI + t * 0.5, 0];
    }
    if (p < 0.66) {
        const t = (p - 0.33) / 0.33;
        return [side + (front - side) * t, 2 * Math.PI + 0.5 + t * 0.8, t * 0.1];
    }
    const t = (p - 0.66) / 0.34;
    return [front + t * 0.2, 2 * Math.PI + 1.3 + t * 0.5, 0.1 - t * 0.1];
}

export function KaanModel({ input, xRay, preset, lite }: KaanModelProps) {
    const group = useRef<THREE.Group>(null);
    const invalidate = useThree((s) => s.invalidate);
    const { object } = useModel(MODEL_PATH, { size: 4, lite, envIntensity: 1.4 });

    const xRayMaterial = useMemo(
        () => new THREE.MeshBasicMaterial({ color: "#d7dde2", wireframe: true, transparent: true, opacity: 0.22 }),
        []
    );
    const originals = useMemo(() => new WeakMap<THREE.Mesh, THREE.Material | THREE.Material[]>(), []);

    useEffect(() => () => xRayMaterial.dispose(), [xRayMaterial]);

    useEffect(() => {
        applyMaterialOverride(object, xRay ? xRayMaterial : null, originals);
        invalidate();
    }, [xRay, object, xRayMaterial, originals, invalidate]);

    useEffect(() => {
        invalidate();
    }, [preset, invalidate]);

    useFrame(() => {
        const g = group.current;
        if (!g) return;
        const { progress, px, py } = input;
        const target = preset ? PRESETS[preset] : scrollPose(progress);
        const k = preset ? 0.05 : 0.15;
        const speed = preset ? 0.1 : 0.06;

        const tx = target[0] + py * k;
        const ty = target[1] + px * k;
        const tz = target[2];

        g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, tx, speed);
        g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, ty, speed);
        g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, tz, speed);

        // Keep drawing only while the aircraft is still settling.
        const err = Math.abs(g.rotation.x - tx) + Math.abs(g.rotation.y - ty) + Math.abs(g.rotation.z - tz);
        if (err > 0.0005) invalidate();
    });

    return (
        <group ref={group} rotation={[-Math.PI / 2, 2 * Math.PI, 0]}>
            <primitive object={object} />
        </group>
    );
}

useGLTF.preload(MODEL_PATH);
