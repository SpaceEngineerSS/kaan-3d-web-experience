"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const CAMERA_PRESETS: Record<string, { rx: number; ry: number; rz: number }> = {
    front: { rx: 0.1, ry: 0, rz: 0 },
    side: { rx: 0, ry: Math.PI * 0.5, rz: 0 },
    top: { rx: -Math.PI / 2, ry: 0, rz: 0 },
    rear: { rx: 0.05, ry: Math.PI, rz: 0 },
    cockpit: { rx: -0.35, ry: Math.PI * 0.75 + Math.PI, rz: 0 },
};

const MODEL_PATH = "/models/KAAN.glb";

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
    const [hovered, setHovered] = useState(false);
    const prevPresetRef = useRef<string | null>(null);

    // Original materials backup for X-ray toggle
    const originalMaterials = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());

    // GLB loading
    const { scene } = useGLTF(MODEL_PATH);

    // X-Ray wireframe material
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



    // Clone the scene so we have full control and don't share the singleton
    const { clonedScene } = useMemo(() => {
        const clone = scene.clone(true);

        // Deep-clone materials for each mesh so they are independent
        clone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (Array.isArray(child.material)) {
                    child.material = child.material.map((m) => m.clone());
                } else if (child.material) {
                    child.material = child.material.clone();
                }
            }
        });

        // Compute bounding box and center
        const box = new THREE.Box3().setFromObject(clone);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const sf = maxDim > 0 ? 4 / maxDim : 1;

        // Re-root: move all children so model center is at (0,0,0)
        clone.position.set(-center.x, -center.y, -center.z);

        // Wrap in a parent group to apply uniform scale
        const wrapper = new THREE.Group();
        wrapper.add(clone);
        wrapper.scale.setScalar(sf);

        // Flip the model 180° around Y so the nose faces the camera
        wrapper.rotation.y = Math.PI;

        // Set frustumCulled = false on every object in the hierarchy
        wrapper.traverse((obj) => {
            obj.frustumCulled = false;
        });

        // Bounding sphere radius in scaled space
        const sphere = new THREE.Sphere();
        box.getBoundingSphere(sphere);

        return {
            clonedScene: wrapper,
        };
    }, [scene]);

    // Store original materials after clone
    useEffect(() => {
        clonedScene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                originalMaterials.current.set(child, child.material);

                const mat = child.material as THREE.MeshStandardMaterial;
                if (mat && mat.envMapIntensity !== undefined) {
                    mat.envMapIntensity = 1.8;
                }
            }
        });
    }, [clonedScene]);

    // X-Ray toggle — swap materials imperatively on the clone
    useEffect(() => {
        clonedScene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (xRayMode) {
                    child.material = xRayMaterial;
                } else {
                    const orig = originalMaterials.current.get(child);
                    if (orig) child.material = orig;
                }
            }
        });
    }, [xRayMode, clonedScene, xRayMaterial]);

    // Camera preset snap
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

    // Animation loop
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


    });

    return (
        <group ref={groupRef}>
            {/* GLB Model — cloned, centered, scaled, flipped */}
            <primitive
                object={clonedScene}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            />

            {children}
        </group>
    );
}

useGLTF.preload(MODEL_PATH);
