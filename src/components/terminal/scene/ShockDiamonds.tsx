"use client";
/* eslint-disable react-hooks/immutability -- three.js uniforms are mutated in the render loop by design. */

import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLOR, FRAG_END, FRAG_PARS, FRAG_START, VERT_END, VERT_PARS, type KaanFeatures } from "./shared";
import { rig } from "./rig";

/**
 * Afterburner plumes with standing shock diamonds (Mach discs) at both nozzles: a banded, additive
 * open cone, amber core turning white at each disc and at the exit. Cell spacing follows the
 * Prandtl–Meyer estimate for an under-expanded jet, λ ≈ 1.22 · D · √(M² − 1), with a representative
 * exit Mach of 1.4 (not a published KAAN figure). Shown in AERO, and white-hot in EOIR.
 */
const EXIT_MACH = 1.4;

const vertex = /* glsl */ `
${VERT_PARS}
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main() {
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  ${VERT_END}
}`;

const fragment = /* glsl */ `
${FRAG_PARS}
uniform float uTime;
uniform float uPower;
uniform float uFlicker;
uniform float uCells;
uniform float uMono;
uniform vec3 uBurn;
uniform vec3 uWhite;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main() {
  ${FRAG_START}
  float l = 1.0 - vUv.y;                       // 0 at the nozzle exit, 1 at the plume tail
  float facing = abs(dot(normalize(vN), normalize(vV)));
  float core = pow(facing, 1.6);
  // Mach discs: spacing stretches slightly downstream, discs fade with distance.
  float lp = pow(l, 0.85);
  float discs = pow(abs(cos(lp * 3.14159 * uCells)), 14.0) * smoothstep(0.8, 0.05, l);
  float exitGlow = smoothstep(0.14, 0.0, l);
  float flick = mix(1.0, 0.86 + 0.14 * sin(uTime * 57.0 + l * 23.0), uFlicker);
  vec3 col = mix(mix(uBurn, uWhite, clamp(discs * 1.1 + exitGlow, 0.0, 1.0)), vec3(0.92), uMono);
  float a = uPower * core * ((1.0 - l) * (1.0 - l) * 0.45 + discs * 0.85 * (1.0 - l) + exitGlow * 0.5) * flick;
  gl_FragColor = vec4(col, a);
  ${FRAG_END}
}`;

export function ShockDiamonds({ features, reduced }: { features: KaanFeatures; reduced: boolean }) {
    const L = features.L;
    const length = 0.42 * L;
    const geometry = useMemo(() => {
        const g = new THREE.CylinderGeometry(0.024 * L, 0.007 * L, length, 28, 1, true);
        g.rotateX(Math.PI / 2); // wide end (uv.y = 1) → +Z
        g.translate(0, 0, -length / 2); // wide end at the nozzle exit, plume trails aft
        return g;
    }, [L, length]);
    const exitD = 2 * 0.024 * L;
    const cells = length / (1.22 * exitD * Math.sqrt(EXIT_MACH * EXIT_MACH - 1));
    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uPower: { value: 0.1 },
                    uFlicker: { value: 1 },
                    uCells: { value: cells },
                    uMono: { value: 0 },
                    uBurn: { value: new THREE.Color(COLOR.burn) },
                    uWhite: { value: new THREE.Color(1, 0.96, 0.9) },
                },
                vertexShader: vertex,
                fragmentShader: fragment,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide,
            }),
        [cells]
    );

    useEffect(
        () => () => {
            geometry.dispose();
            material.dispose();
        },
        [geometry, material]
    );

    useFrame(() => {
        material.uniforms.uTime.value = rig.time;
        material.uniforms.uFlicker.value = reduced ? 0 : 1;
        const [, , aero, eoir] = rig.m;
        material.uniforms.uPower.value = (aero + 0.8 * eoir) * (1 - 0.7 * rig.w[2]);
        material.uniforms.uMono.value = eoir;
    });

    const { nozzleR: r, nozzleL: l } = features;
    return (
        <group>
            <mesh geometry={geometry} material={material} position={[r.x, r.y, r.z]} frustumCulled={false} renderOrder={6} />
            <mesh geometry={geometry} material={material} position={[l.x, l.y, l.z]} frustumCulled={false} renderOrder={6} />
        </group>
    );
}
