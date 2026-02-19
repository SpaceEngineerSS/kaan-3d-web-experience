"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFormationState } from "./useFormation";

const MODEL_PATH = "/models/KAAN.glb";

export function MumTKaan() {
    const groupRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF(MODEL_PATH);
    const formation = useFormationState();

    const wrappedScene = useMemo(() => {
        const clone = scene.clone(true);

        clone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (Array.isArray(child.material)) {
                    child.material = child.material.map((m) => m.clone());
                } else if (child.material) {
                    child.material = child.material.clone();
                }
            }
        });

        const box = new THREE.Box3().setFromObject(clone);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const sf = maxDim > 0 ? 8 / maxDim : 1;

        clone.position.set(-center.x, -center.y, -center.z);

        const wrapper = new THREE.Group();
        wrapper.add(clone);
        wrapper.scale.setScalar(sf);
        wrapper.rotation.y = Math.PI;

        wrapper.traverse((obj) => {
            obj.frustumCulled = false;
        });

        return wrapper;
    }, [scene]);

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;

        if (formation.mode === "FREE") {
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, Math.sin(t * 0.3) * 0.12, 0.02);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, Math.sin(t * 0.2 + 0.7) * 0.06, 0.02);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.cos(t * 0.25) * 0.03, 0.02);
        } else {
            const { bankAngle, yawOffset } = formation.kaan;
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, bankAngle, 0.03);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, yawOffset, 0.03);
        }
    });

    return (
        <group ref={groupRef}>
            <primitive object={wrappedScene} />
        </group>
    );
}

useGLTF.preload(MODEL_PATH);
