"use client";

import { useRef, useMemo } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { STLLoader } from "three-stdlib";
import * as THREE from "three";

interface KaanModelProps {
    scrollProgress?: number;
    mouseX?: number;
    mouseY?: number;
}

export function KaanModel({
    scrollProgress = 0,
    mouseX = 0,
    mouseY = 0,
}: KaanModelProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const geometry = useLoader(STLLoader, "/models/KAAN.stl");

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
            new THREE.MeshStandardMaterial({
                color: new THREE.Color("#1a1a2e"),
                metalness: 0.92,
                roughness: 0.28,
                envMapIntensity: 1.2,
            }),
        []
    );

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.elapsedTime;
        const idleFloat = Math.sin(time * 0.8) * 0.05;

        const topViewX = -Math.PI / 2;
        const sideViewX = 0;
        const frontViewX = Math.PI * 0.1;

        let targetRotationX: number;
        let targetRotationY: number;
        let targetRotationZ: number;

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

        const mouseInfluenceX = mouseY * 0.15;
        const mouseInfluenceY = mouseX * 0.15;

        meshRef.current.rotation.x = THREE.MathUtils.lerp(
            meshRef.current.rotation.x,
            targetRotationX + mouseInfluenceX + idleFloat,
            0.04
        );
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
            meshRef.current.rotation.y,
            targetRotationY + mouseInfluenceY,
            0.04
        );
        meshRef.current.rotation.z = THREE.MathUtils.lerp(
            meshRef.current.rotation.z,
            targetRotationZ,
            0.04
        );
    });

    return (
        <mesh ref={meshRef} geometry={centeredGeometry} material={material} />
    );
}
