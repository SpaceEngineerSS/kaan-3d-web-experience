"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AfterburnerProps {
    scrollProgress: number;
}

export function AfterburnerEffect({ scrollProgress }: AfterburnerProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const trailRef = useRef<THREE.Points>(null);

    const particleCount = 200;
    const trailCount = 80;

    const { positions, velocities } = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const vel = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 0.15;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
            pos[i * 3 + 2] = -Math.random() * 2;
            vel[i * 3] = (Math.random() - 0.5) * 0.01;
            vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
            vel[i * 3 + 2] = -(0.02 + Math.random() * 0.04);
        }
        return { positions: pos, velocities: vel };
    }, []);

    const trailPositions = useMemo(() => {
        const pos = new Float32Array(trailCount * 3);
        for (let i = 0; i < trailCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.08;
            pos[i * 3] = Math.cos(angle) * radius;
            pos[i * 3 + 1] = Math.sin(angle) * radius;
            pos[i * 3 + 2] = -Math.random() * 3.5;
        }
        return pos;
    }, []);

    const particleMaterial = useMemo(
        () =>
            new THREE.PointsMaterial({
                color: new THREE.Color("#ffaa33"),
                size: 0.04,
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true,
            }),
        []
    );

    const trailMaterial = useMemo(
        () =>
            new THREE.PointsMaterial({
                color: new THREE.Color("#0088ff"),
                size: 0.02,
                transparent: true,
                opacity: 0.3,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true,
            }),
        []
    );

    useFrame((state) => {
        if (!pointsRef.current) return;
        const posAttr = pointsRef.current.geometry.attributes.position;
        const posArray = posAttr.array as Float32Array;
        const time = state.clock.elapsedTime;

        for (let i = 0; i < particleCount; i++) {
            posArray[i * 3] += velocities[i * 3] + Math.sin(time * 3 + i) * 0.001;
            posArray[i * 3 + 1] += velocities[i * 3 + 1] + Math.cos(time * 2 + i) * 0.001;
            posArray[i * 3 + 2] += velocities[i * 3 + 2];

            if (posArray[i * 3 + 2] < -2.5) {
                posArray[i * 3] = (Math.random() - 0.5) * 0.15;
                posArray[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
                posArray[i * 3 + 2] = 0;
            }
        }
        posAttr.needsUpdate = true;

        const intensity = 0.4 + scrollProgress * 0.6;
        particleMaterial.opacity = intensity * 0.7;

        if (trailRef.current) {
            const trailAttr = trailRef.current.geometry.attributes.position;
            const trailArray = trailAttr.array as Float32Array;
            for (let i = 0; i < trailCount; i++) {
                trailArray[i * 3 + 2] -= 0.01;
                if (trailArray[i * 3 + 2] < -4) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 0.08;
                    trailArray[i * 3] = Math.cos(angle) * radius;
                    trailArray[i * 3 + 1] = Math.sin(angle) * radius;
                    trailArray[i * 3 + 2] = 0;
                }
            }
            trailAttr.needsUpdate = true;
            trailMaterial.opacity = intensity * 0.3;
        }
    });

    const posGeometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        return geo;
    }, [positions]);

    const trailGeometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(trailPositions, 3));
        return geo;
    }, [trailPositions]);

    return (
        <group position={[0, -0.2, -1.5]}>
            <points ref={pointsRef} geometry={posGeometry} material={particleMaterial} />
            <points ref={trailRef} geometry={trailGeometry} material={trailMaterial} />

            <pointLight position={[0, 0, -0.5]} intensity={2} color="#ffaa33" distance={4} decay={2} />
            <pointLight position={[0, 0, -1.5]} intensity={1} color="#ff6600" distance={3} decay={2} />
        </group>
    );
}
