"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { STLLoader } from "three-stdlib";
import * as THREE from "three";

/*
 * Camera-preset target rotations.
 *
 * Verified from the original scroll code:
 *   ry = 0      → rear view  (tail toward camera)
 *   ry = PI/2   → side view  (profile)
 *   rx = -PI/2  → top view
 *
 * Therefore  ry = PI → front (nose toward camera)
 *            cockpit → slightly above + front-ish angle
 */
const CAMERA_PRESETS: Record<string, { rx: number; ry: number; rz: number }> = {
    front:   { rx: 0.1,           ry: 0,                    rz: 0 },
    side:    { rx: 0,             ry: Math.PI * 0.5,        rz: 0 },
    top:     { rx: -Math.PI / 2,  ry: 0,                    rz: 0 },
    rear:    { rx: 0.05,          ry: Math.PI,              rz: 0 },
    cockpit: { rx: -0.35,         ry: Math.PI * 0.75 + Math.PI, rz: 0 },
};

interface KaanModelProps {
    scrollProgress?: number;
    mouseX?: number;
    mouseY?: number;
    xRayMode?: boolean;
    cameraPreset?: string | null;
    children?: React.ReactNode;
}

export function KaanModel({
    scrollProgress = 0,
    mouseX = 0,
    mouseY = 0,
    xRayMode = false,
    cameraPreset = null,
    children,
}: KaanModelProps) {
    const groupRef = useRef<THREE.Group>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const geometry = useLoader(STLLoader, "/models/KAAN.stl");
    const [hovered, setHovered] = useState(false);
    const prevPresetRef = useRef<string | null>(null);

    const centeredGeometry = useMemo(() => {
        const geo = geometry.clone();
        geo.center();
        geo.computeVertexNormals();

        const box = new THREE.Box3().setFromBufferAttribute(
            geo.getAttribute("position") as THREE.BufferAttribute
        );
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim;
        geo.scale(scale, scale, scale);

        return geo;
    }, [geometry]);

    const material = useMemo(
        () =>
            new THREE.MeshPhysicalMaterial({
                color: new THREE.Color("#1a1a2e"),
                metalness: 0.95,
                roughness: 0.18,
                envMapIntensity: 1.8,
                clearcoat: 0.3,
                clearcoatRoughness: 0.2,
                reflectivity: 0.9,
                ior: 2.0,
            }),
        []
    );

    const xRayMaterial = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                color: new THREE.Color("#00d4ff"),
                wireframe: true,
                transparent: true,
                opacity: 0.3,
            }),
        []
    );

    const glowMaterial = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                color: new THREE.Color("#00d4ff"),
                transparent: true,
                opacity: 0.02,
                side: THREE.BackSide,
            }),
        []
    );

    /*
     * When a preset is selected (or changed), snap the rotation
     * instantly so the user never sees a long spin through
     * intermediate angles.
     */
    useEffect(() => {
        if (!groupRef.current) return;

        if (cameraPreset && CAMERA_PRESETS[cameraPreset]) {
            const p = CAMERA_PRESETS[cameraPreset];
            groupRef.current.rotation.x = p.rx;
            groupRef.current.rotation.y = p.ry;
            groupRef.current.rotation.z = p.rz;
        }

        prevPresetRef.current = cameraPreset;
    }, [cameraPreset]);

    useFrame((state) => {
        if (!groupRef.current) return;

        const time = state.clock.elapsedTime;
        const idleFloat = Math.sin(time * 0.8) * 0.05;

        let targetRotationX: number;
        let targetRotationY: number;
        let targetRotationZ: number;

        if (cameraPreset && CAMERA_PRESETS[cameraPreset]) {
            const p = CAMERA_PRESETS[cameraPreset];
            targetRotationX = p.rx;
            targetRotationY = p.ry;
            targetRotationZ = p.rz;
        } else {
            const topViewX = -Math.PI / 2;
            const sideViewX = 0;
            const frontViewX = Math.PI * 0.1;

            if (scrollProgress < 0.33) {
                const t = scrollProgress / 0.33;
                targetRotationX = topViewX + (sideViewX - topViewX) * t;
                targetRotationY = 2 * Math.PI + t * 0.5;
                targetRotationZ = 0;
            } else if (scrollProgress < 0.66) {
                const t = (scrollProgress - 0.33) / 0.33;
                targetRotationX = sideViewX + (frontViewX - sideViewX) * t;
                targetRotationY = 2 * Math.PI + 0.5 + t * 0.8;
                targetRotationZ = t * 0.1;
            } else {
                const t = (scrollProgress - 0.66) / 0.34;
                targetRotationX = frontViewX + t * 0.2;
                targetRotationY = 2 * Math.PI + 1.3 + t * 0.5;
                targetRotationZ = 0.1 - t * 0.1;
            }
        }

        const mouseFactor = cameraPreset ? 0.05 : 0.15;
        const mouseInfluenceX = mouseY * mouseFactor;
        const mouseInfluenceY = mouseX * mouseFactor;

        const lerpSpeed = cameraPreset ? 0.1 : 0.04;

        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            targetRotationX + mouseInfluenceX + idleFloat,
            lerpSpeed
        );
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            targetRotationY + mouseInfluenceY,
            lerpSpeed
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
            groupRef.current.rotation.z,
            targetRotationZ,
            lerpSpeed
        );

        if (glowRef.current) {
            const pulseScale = 1.03 + Math.sin(time * 2) * 0.005;
            glowRef.current.scale.setScalar(pulseScale);
        }
    });

    return (
        <group ref={groupRef}>
            <mesh
                geometry={centeredGeometry}
                material={xRayMode ? xRayMaterial : material}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            />
            {!xRayMode && (
                <mesh
                    ref={glowRef}
                    geometry={centeredGeometry}
                    material={glowMaterial}
                    scale={1.03}
                />
            )}
            {xRayMode && <XRayOverlay geometry={centeredGeometry} />}
            {children}
        </group>
    );
}

function XRayOverlay({ geometry }: { geometry: THREE.BufferGeometry }) {
    const solidMaterial = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                color: new THREE.Color("#001a2e"),
                transparent: true,
                opacity: 0.08,
            }),
        []
    );

    return <mesh geometry={geometry} material={solidMaterial} />;
}
