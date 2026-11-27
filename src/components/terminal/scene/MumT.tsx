"use client";
/* eslint-disable react-hooks/immutability -- three.js objects and the shared rig are mutated in the render loop by design. */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three-stdlib";
import { useModel } from "@/lib/three/useModel";
import type { Tier } from "@/hooks/useDeviceProfile";
import { ANKA_PATH, ANKA_SIZE, COLOR, createPointsMaterial, FRAG_END, FRAG_PARS, FRAG_START, makePointGeometry, mergeWorldGeometry, VERT_END, VERT_PARS, type KaanFeatures } from "./shared";
import { rig } from "./rig";

/**
 * Section 04 — manned-unmanned teaming. Two ANKA-3 (TUSAŞ's own teaming concept) in the same lidar
 * style off KAAN's wings, a KIZILELMA concept node (anchor only — no announced KAAN integration,
 * so no geometry), and data-link lines with a travelling phosphor pulse. Dashed link = concept.
 */

const ANKA_POINTS: Record<Tier, number> = { 0: 0, 1: 6_000, 2: 15_000, 3: 30_000 };
const HOME = {
    anka1: new THREE.Vector3(1.75, 0.02, -0.7),
    anka2: new THREE.Vector3(-1.75, 0.02, -0.7),
    kizilelma: new THREE.Vector3(2.8, 0.18, 2.4),
};

const linkVertex = /* glsl */ `
${VERT_PARS}
attribute float aT;
attribute float aKind;
attribute float aPhase;
varying float vT;
varying float vKind;
varying float vPhase;
void main() {
  vT = aT;
  vKind = aKind;
  vPhase = aPhase;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  ${VERT_END}
}`;

const linkFragment = /* glsl */ `
${FRAG_PARS}
uniform float uTime;
uniform float uOpacity;
uniform vec3 uHot;
varying float vT;
varying float vKind;
varying float vPhase;
void main() {
  ${FRAG_START}
  float x = fract(vT - uTime * 0.45 + vPhase);
  float pulse = pow(x, 14.0);
  float dash = mix(1.0, step(0.5, fract(vT * 28.0)), vKind);
  float a = (0.16 + 0.84 * pulse) * dash * uOpacity;
  if (a < 0.002) discard;
  gl_FragColor = vec4(uHot, a);
  ${FRAG_END}
}`;

export function MumT({ features, tier, reduced }: { features: KaanFeatures; tier: Tier; reduced: boolean }) {
    const { object } = useModel(ANKA_PATH, { size: ANKA_SIZE, lite: false });
    const n = ANKA_POINTS[tier];
    const points = useMemo(() => {
        const surface = mergeWorldGeometry(object);
        const sampler = new MeshSurfaceSampler(new THREE.Mesh(surface)).build();
        const g = makePointGeometry(sampler, n, 3);
        surface.dispose();
        return g;
    }, [object, n]);

    const own = useMemo(
        () => ({
            // The ANKA cloud does not take part in the KAAN scan: its band sits far away.
            scan: { uTime: { value: 0 }, uScanZ: { value: 1e4 }, uScanW: { value: 0.01 } },
        }),
        []
    );
    const pointsMat = useMemo(() => createPointsMaterial(own.scan, 0.16, 2.6), [own]);

    const link = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(18), 3).setUsage(THREE.DynamicDrawUsage));
        g.setAttribute("aT", new THREE.BufferAttribute(new Float32Array([0, 1, 0, 1, 0, 1]), 1));
        g.setAttribute("aKind", new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 1, 1]), 1));
        g.setAttribute("aPhase", new THREE.BufferAttribute(new Float32Array([0, 0, 0.33, 0.33, 0.66, 0.66]), 1));
        const m = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uHot: { value: new THREE.Color(COLOR.accent) } },
            vertexShader: linkVertex,
            fragmentShader: linkFragment,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        return { g, m };
    }, []);

    useEffect(
        () => () => {
            points.dispose();
            pointsMat.dispose();
            link.g.dispose();
            link.m.dispose();
        },
        [points, pointsMat, link]
    );

    const group = useRef<THREE.Group>(null);
    const a1 = useRef<THREE.Points>(null);
    const a2 = useRef<THREE.Points>(null);

    useFrame((state) => {
        const w = rig.w[3];
        const t = rig.time;
        const bob = reduced ? 0 : 1;
        rig.anka1.set(HOME.anka1.x, HOME.anka1.y + Math.sin(t * 0.6) * 0.03 * bob, HOME.anka1.z + Math.sin(t * 0.37) * 0.04 * bob);
        rig.anka2.set(HOME.anka2.x, HOME.anka2.y + Math.sin(t * 0.6 + 2.1) * 0.03 * bob, HOME.anka2.z + Math.sin(t * 0.37 + 1.3) * 0.04 * bob);
        rig.kizilelma.copy(HOME.kizilelma);

        if (group.current) group.current.visible = w > 0.005;
        if (w <= 0.005) return;
        if (a1.current) a1.current.position.copy(rig.anka1);
        if (a2.current) a2.current.position.copy(rig.anka2);

        own.scan.uTime.value = t;
        pointsMat.uniforms.uDpr.value = state.viewport.dpr;
        pointsMat.uniforms.uOpacity.value = w;

        const pos = link.g.getAttribute("position") as THREE.BufferAttribute;
        const k = features.kaanNode;
        pos.setXYZ(0, k.x, k.y, k.z);
        pos.setXYZ(1, rig.anka1.x, rig.anka1.y, rig.anka1.z);
        pos.setXYZ(2, k.x, k.y, k.z);
        pos.setXYZ(3, rig.anka2.x, rig.anka2.y, rig.anka2.z);
        pos.setXYZ(4, k.x, k.y, k.z);
        pos.setXYZ(5, rig.kizilelma.x, rig.kizilelma.y, rig.kizilelma.z);
        pos.needsUpdate = true;
        link.m.uniforms.uTime.value = t;
        link.m.uniforms.uOpacity.value = w;
    });

    return (
        <group ref={group} visible={false}>
            <points ref={a1} geometry={points} material={pointsMat} renderOrder={3} />
            <points ref={a2} geometry={points} material={pointsMat} renderOrder={3} />
            <lineSegments geometry={link.g} material={link.m} frustumCulled={false} renderOrder={7} />
        </group>
    );
}
