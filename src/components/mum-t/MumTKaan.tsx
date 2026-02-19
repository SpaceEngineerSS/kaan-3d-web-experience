"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFormationState } from "./useFormation";

const MODEL_PATH = "/models/KAAN.glb";

export function MumTKaan() {
    const groupRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF(MODEL_PATH);
    const formation = useFormationState();
    const frameCount = useRef(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const wrappedScene = useMemo(() => {
        const clone = scene.clone(true);

        clone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const convertMat = (m: THREE.Material): THREE.Material => {
                    if (m instanceof THREE.MeshStandardMaterial) {
                        if (isMobile) {
                            // Mobile: lightweight Lambert — no IBL, ~60% cheaper
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
                        // Desktop: keep PBR but disable IBL to prevent feedback loop
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
        const maxDim = Math.max(size.x, size.y, size.z);
        const sf = maxDim > 0 ? 8 / maxDim : 1;

        clone.position.set(-center.x, -center.y, -center.z);

        const wrapper = new THREE.Group();
        wrapper.add(clone);
        wrapper.scale.setScalar(sf);
        wrapper.rotation.y = Math.PI;

        // Re-enable frustum culling on mobile for GPU savings
        if (!isMobile) {
            wrapper.traverse((obj) => {
                obj.frustumCulled = false;
            });
        }

        return wrapper;
    }, [scene, isMobile]);

    useFrame((state) => {
        if (!groupRef.current) return;

        // Throttle to every 2nd frame on mobile
        frameCount.current++;
        if (isMobile && frameCount.current % 2 !== 0) return;

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
