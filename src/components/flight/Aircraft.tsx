"use client";
/* eslint-disable react-hooks/immutability -- three.js objects and the shared scroll source are mutated imperatively by design (render loop, not React state). */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useModel } from "@/lib/three/useModel";
import { flight } from "@/lib/flight/profile";

export const KAAN_PATH = "/models/KAAN.glb";

/** KAAN is 21 m long; 1 unit = 10 m. */
const LENGTH = 2.1;

const plumeVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

/* Afterburner plume: a hot white-blue core near the nozzle cooling to orange, with standing shock
   diamonds that read at full reheat. Additive, no depth write. */
const plumeFragment = /* glsl */ `
uniform float uTime;
uniform float uPower;
varying vec2 vUv;
float hash(float n) { return fract(sin(n) * 43758.5453); }
void main() {
  float l = 1.0 - vUv.y;               // 0 at the nozzle, 1 at the tail of the plume
  float edge = sin(vUv.x * 3.14159);     // soft sides on the cylinder strip
  float flicker = 0.85 + 0.15 * hash(floor(uTime * 30.0) + vUv.x * 7.0);
  float diamonds = 0.55 + 0.45 * pow(abs(sin(l * 26.0)), 6.0) * smoothstep(0.75, 0.0, l);
  vec3 core = vec3(0.86, 0.92, 1.0);
  vec3 hot = vec3(1.0, 0.72, 0.38);
  vec3 cool = vec3(0.95, 0.38, 0.12);
  vec3 col = mix(core, hot, smoothstep(0.0, 0.35, l));
  col = mix(col, cool, smoothstep(0.35, 1.0, l));
  float a = (1.0 - l) * (1.0 - l) * edge * diamonds * flicker;
  float reheat = smoothstep(0.2, 1.0, uPower);
  a *= mix(0.12, 1.0, reheat) * smoothstep(0.0, 0.08, uPower);
  // At military power only the first metre glows.
  a *= mix(smoothstep(0.35, 0.0, l), 1.0, reheat);
  gl_FragColor = vec4(col * a * 1.6, a);
}`;

function Plume({ x }: { x: number }) {
    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                uniforms: { uTime: { value: 0 }, uPower: { value: 0 } },
                vertexShader: plumeVertex,
                fragmentShader: plumeFragment,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide,
            }),
        []
    );
    const geometry = useMemo(() => {
        // Open cylinder pointing down -Z from the nozzle exit; top of the strip (v = 1) is the nozzle.
        const g = new THREE.CylinderGeometry(0.052, 0.018, 0.95, 20, 1, true);
        g.rotateX(Math.PI / 2); // cylinder top (+Y, wide end) → +Z
        g.translate(0, 0, -0.475); // wide end at the nozzle (z = 0), plume trails to -Z
        return g;
    }, []);

    useEffect(
        () => () => {
            material.dispose();
            geometry.dispose();
        },
        [material, geometry]
    );

    useFrame((s) => {
        material.uniforms.uTime.value = s.clock.elapsedTime;
        material.uniforms.uPower.value = flight.afterburner;
    });

    return <mesh geometry={geometry} material={material} position={[x, -0.035, -LENGTH / 2 + 0.06]} frustumCulled={false} />;
}

/** The aircraft placed on the scripted flight path. Lite materials on tier 1. */
export function Aircraft({ lite }: { lite: boolean }) {
    const group = useRef<THREE.Group>(null);
    const { object } = useModel(KAAN_PATH, { size: LENGTH, lite, envIntensity: 1.1 });

    useEffect(() => {
        object.traverse((o) => {
            if (o instanceof THREE.Mesh) {
                o.castShadow = !lite;
                o.receiveShadow = false;
            }
        });
    }, [object, lite]);

    useFrame(() => {
        const g = group.current;
        if (!g) return;
        g.position.copy(flight.position);
        g.quaternion.copy(flight.quaternion);
    });

    return (
        <group ref={group}>
            <primitive object={object} />
            <Plume x={0.075} />
            <Plume x={-0.075} />
        </group>
    );
}

useGLTF.preload(KAAN_PATH);
