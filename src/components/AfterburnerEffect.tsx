"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AfterburnerProps {
    scrollProgress: number;
}

const PARTICLE_COUNT = 200;
const TRAIL_COUNT = 80;

const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
};

const createParticleData = () => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const xRand = pseudoRandom(i * 3 + 1);
        const yRand = pseudoRandom(i * 3 + 2);
        const zRand = pseudoRandom(i * 3 + 3);
        const vxRand = pseudoRandom(i * 3 + 4);
        const vyRand = pseudoRandom(i * 3 + 5);
        const vzRand = pseudoRandom(i * 3 + 6);

        positions[i * 3] = (xRand - 0.5) * 0.15;
        positions[i * 3 + 1] = (yRand - 0.5) * 0.15;
        positions[i * 3 + 2] = -zRand * 2;

        velocities[i * 3] = (vxRand - 0.5) * 0.01;
        velocities[i * 3 + 1] = (vyRand - 0.5) * 0.01;
        velocities[i * 3 + 2] = -(0.02 + vzRand * 0.04);
    }

    return { positions, velocities };
};

const createTrailData = () => {
    const positions = new Float32Array(TRAIL_COUNT * 3);

    for (let i = 0; i < TRAIL_COUNT; i++) {
        const angle = pseudoRandom(i * 2 + 10) * Math.PI * 2;
        const radius = pseudoRandom(i * 2 + 11) * 0.08;
        const depth = pseudoRandom(i * 2 + 12) * 3.5;

        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = -depth;
    }

    return positions;
};

export function AfterburnerEffect({ scrollProgress }: AfterburnerProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const trailRef = useRef<THREE.Points>(null);
    const particleMaterialRef = useRef<THREE.PointsMaterial>(null);
    const trailMaterialRef = useRef<THREE.PointsMaterial>(null);

    const { positions, velocities } = useMemo(() => createParticleData(), []);
    const trailPositions = useMemo(() => createTrailData(), []);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const posAttr = pointsRef.current.geometry.attributes.position;
        const posArray = posAttr.array as Float32Array;
        const time = state.clock.elapsedTime;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            posArray[i * 3] += velocities[i * 3] + Math.sin(time * 3 + i) * 0.001;
            posArray[i * 3 + 1] += velocities[i * 3 + 1] + Math.cos(time * 2 + i) * 0.001;
            posArray[i * 3 + 2] += velocities[i * 3 + 2];

            if (posArray[i * 3 + 2] < -2.5) {
                posArray[i * 3] = Math.sin(time * 1.7 + i * 12.3) * 0.075;
                posArray[i * 3 + 1] = Math.cos(time * 1.3 + i * 8.7) * 0.075;
                posArray[i * 3 + 2] = 0;
            }
        }
        posAttr.needsUpdate = true;

        const intensity = 0.4 + scrollProgress * 0.6;
        if (particleMaterialRef.current) {
            particleMaterialRef.current.opacity = intensity * 0.7;
        }

        if (trailRef.current) {
            const trailAttr = trailRef.current.geometry.attributes.position;
            const trailArray = trailAttr.array as Float32Array;
            for (let i = 0; i < TRAIL_COUNT; i++) {
                trailArray[i * 3 + 2] -= 0.01;
                if (trailArray[i * 3 + 2] < -4) {
                    const angle = (time * 2 + i * 1.618) % (Math.PI * 2);
                    const radius = ((Math.sin(time + i * 0.7) + 1) / 2) * 0.08;
                    trailArray[i * 3] = Math.cos(angle) * radius;
                    trailArray[i * 3 + 1] = Math.sin(angle) * radius;
                    trailArray[i * 3 + 2] = 0;
                }
            }
            trailAttr.needsUpdate = true;
            if (trailMaterialRef.current) {
                trailMaterialRef.current.opacity = intensity * 0.3;
            }
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
            <points ref={pointsRef} geometry={posGeometry}>
                <pointsMaterial
                    ref={particleMaterialRef}
                    color="#ffaa33"
                    size={0.04}
                    transparent
                    opacity={0.7}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    sizeAttenuation
                />
            </points>
            <points ref={trailRef} geometry={trailGeometry}>
                <pointsMaterial
                    ref={trailMaterialRef}
                    color="#0088ff"
                    size={0.02}
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    sizeAttenuation
                />
            </points>

            <pointLight position={[0, 0, -0.5]} intensity={2} color="#ffaa33" distance={4} decay={2} />
            <pointLight position={[0, 0, -1.5]} intensity={1} color="#ff6600" distance={3} decay={2} />
        </group>
    );
}
