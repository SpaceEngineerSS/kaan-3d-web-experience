"use client";
/* eslint-disable react-hooks/immutability -- three.js uniforms are mutated in the render loop by design. */

import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";
import type { Tier } from "@/hooks/useDeviceProfile";
import { COLOR, FRAG_END, FRAG_PARS, FRAG_START, mulberry32, VERT_END, VERT_PARS, type KaanFeatures } from "./shared";
import { rig } from "./rig";

/**
 * Vortex trails shed from the LERX/chine roots, the wing tips and the twin fin tips. Each trail is a
 * helix that grows aft, advected through a precomputed curl-noise field, baked once into line
 * segments; the shader animates flow pulses along it and clips its visible length by scroll speed.
 */

interface Seed {
    p: THREE.Vector3;
    /** Swirl sense (+1 / −1), mirrored left/right. */
    sense: number;
    /** Inboard drift per unit length (LERX vortices migrate over the wing). */
    drift: number;
    radius: number;
}

const LENGTH = 2.4;

function buildTrails(f: KaanFeatures, perSeed: number, steps: number) {
    const rand = mulberry32(35_000);
    const noise = [createNoise3D(mulberry32(1)), createNoise3D(mulberry32(2)), createNoise3D(mulberry32(3))];
    const e = 0.05;
    const curl = (p: THREE.Vector3, out: THREE.Vector3) => {
        // Curl of a 3-component potential (finite differences).
        const [a, b, c] = noise;
        const dady = (a(p.x, p.y + e, p.z) - a(p.x, p.y - e, p.z)) / (2 * e);
        const dadz = (a(p.x, p.y, p.z + e) - a(p.x, p.y, p.z - e)) / (2 * e);
        const dbdx = (b(p.x + e, p.y, p.z) - b(p.x - e, p.y, p.z)) / (2 * e);
        const dbdz = (b(p.x, p.y, p.z + e) - b(p.x, p.y, p.z - e)) / (2 * e);
        const dcdx = (c(p.x + e, p.y, p.z) - c(p.x - e, p.y, p.z)) / (2 * e);
        const dcdy = (c(p.x, p.y + e, p.z) - c(p.x, p.y - e, p.z)) / (2 * e);
        return out.set(dcdy - dbdz, dadz - dcdx, dbdx - dady);
    };

    const mirror = (v: THREE.Vector3) => new THREE.Vector3(-v.x, v.y, v.z);
    const seeds: Seed[] = [];
    for (const side of [1, -1]) {
        const pick = (v: THREE.Vector3) => (side === 1 ? v.clone() : mirror(v));
        seeds.push({ p: pick(f.lerx), sense: side, drift: -side * 0.04, radius: 0.006 });
        seeds.push({ p: pick(f.wingTip), sense: -side, drift: -side * 0.015, radius: 0.004 });
        seeds.push({ p: pick(f.finTip), sense: side, drift: 0, radius: 0.003 });
    }

    const segs = seeds.length * perSeed * (steps - 1);
    const pos = new Float32Array(segs * 6);
    const tAttr = new Float32Array(segs * 2);
    const rAttr = new Float32Array(segs * 2);
    const base = new THREE.Vector3();
    const disp = new THREE.Vector3();
    const c = new THREE.Vector3();
    const prev = new THREE.Vector3();
    const cur = new THREE.Vector3();
    let o = 0;
    for (const s of seeds) {
        for (let k = 0; k < perSeed; k++) {
            const r0 = s.radius + k * 0.003;
            const th0 = (k / perSeed) * Math.PI * 2 + rand() * 0.5;
            const jx = (rand() - 0.5) * 0.015;
            const jy = (rand() - 0.5) * 0.015;
            const rr = rand();
            disp.set(0, 0, 0);
            for (let i = 0; i < steps; i++) {
                const t = i / (steps - 1);
                const d = t * LENGTH;
                const r = r0 + 0.035 * t;
                const th = th0 + s.sense * 7 * d;
                base.set(s.p.x + jx + s.drift * d + Math.cos(th) * r, s.p.y + jy - 0.05 * t + Math.sin(th) * r, s.p.z - d);
                curl(c.copy(base).multiplyScalar(1.3), c);
                disp.addScaledVector(c, (0.02 * t * LENGTH) / steps);
                cur.copy(base).add(disp);
                if (i > 0) {
                    pos.set([prev.x, prev.y, prev.z, cur.x, cur.y, cur.z], o * 6);
                    tAttr[o * 2] = (i - 1) / (steps - 1);
                    tAttr[o * 2 + 1] = t;
                    rAttr[o * 2] = rr;
                    rAttr[o * 2 + 1] = rr;
                    o++;
                }
                prev.copy(cur);
            }
        }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aT", new THREE.BufferAttribute(tAttr, 1));
    g.setAttribute("aRand", new THREE.BufferAttribute(rAttr, 1));
    g.computeBoundingSphere();
    return g;
}

const vertex = /* glsl */ `
${VERT_PARS}
attribute float aT;
attribute float aRand;
varying float vT;
varying float vRand;
varying float vNear;
void main() {
  vT = aT;
  vRand = aRand;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  vNear = smoothstep(0.03, 0.25, -mv.z);
  ${VERT_END}
}`;

const fragment = /* glsl */ `
${FRAG_PARS}
uniform float uTime;
uniform float uLen;
uniform float uAlpha;
uniform float uFlow;
uniform vec3 uFg;
uniform vec3 uHot;
varying float vT;
varying float vRand;
varying float vNear;
void main() {
  ${FRAG_START}
  float vis = 1.0 - smoothstep(uLen - 0.15, uLen, vT);
  float head = smoothstep(0.0, 0.04, vT);
  float pulse = pow(fract(vT * 3.0 - uTime * 0.7 + vRand), 6.0) * uFlow;
  float a = uAlpha * (0.3 + 0.7 * pulse) * (1.0 - vT) * vis * head * vNear;
  if (a < 0.002) discard;
  float hl = pulse * step(0.62, vRand);
  gl_FragColor = vec4(mix(uFg, uHot, hl), a);
  ${FRAG_END}
}`;

export function Streamlines({ features, tier, reduced }: { features: KaanFeatures; tier: Tier; reduced: boolean }) {
    const lite = tier <= 1;
    const geometry = useMemo(() => buildTrails(features, lite ? 1 : tier === 2 ? 4 : 6, lite ? 24 : 56), [features, lite, tier]);
    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uLen: { value: 0.3 },
                    uAlpha: { value: 0.3 },
                    uFlow: { value: 1 },
                    uFg: { value: new THREE.Color(COLOR.fg) },
                    uHot: { value: new THREE.Color(COLOR.hmd) },
                },
                vertexShader: vertex,
                fragmentShader: fragment,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            }),
        []
    );

    useEffect(
        () => () => {
            geometry.dispose();
            material.dispose();
        },
        [geometry, material]
    );

    useFrame(() => {
        const u = material.uniforms;
        const still = lite || reduced;
        u.uTime.value = still ? 0 : rig.time;
        u.uFlow.value = still ? 0.35 : 1;
        u.uLen.value = still ? 0.6 : 0.3 + 0.7 * rig.vAbs;
        // Strongest in 01 (air superiority), faint from the cockpit and overhead.
        u.uAlpha.value = (0.16 + 0.34 * rig.vAbs) * (1 - 0.6 * rig.w[2]) * (1 - 0.4 * rig.w[3]) * (1 + 0.4 * rig.w[0]);
    });

    return <lineSegments geometry={geometry} material={material} frustumCulled={false} renderOrder={5} />;
}
