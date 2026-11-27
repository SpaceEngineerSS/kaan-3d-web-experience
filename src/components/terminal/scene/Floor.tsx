"use client";
/* eslint-disable react-hooks/immutability -- material opacity is driven from the render loop by design. */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { Tier } from "@/hooks/useDeviceProfile";
import type { KaanFeatures } from "./shared";
import { rig } from "./rig";

/** Radial falloff baked into a tiny canvas texture: the stand-in for a contact shadow below tier 3. */
function blobTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(32, 32, 2, 32, 32, 32);
    grd.addColorStop(0, "rgba(0,0,0,0.85)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
}

// A pool of light on the hangar floor: lighter than the ink so the contact shadow has something to darken.
const FLOOR_VERT = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  #include <logdepthbuf_vertex>
}`;
const FLOOR_FRAG = /* glsl */ `
#include <logdepthbuf_pars_fragment>
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  #include <logdepthbuf_fragment>
  vec2 d = (vUv - 0.5) * vec2(1.0, 0.8);
  float pool = exp(-dot(d, d) * 22.0);
  gl_FragColor = vec4(uColor, pool * uOpacity);
  #include <colorspace_fragment>
}`;
const floorUniforms = { uColor: { value: new THREE.Color("#2a2d33") }, uOpacity: { value: 1 } };

/**
 * The hangar floor exists only for the opening hero: a soft contact shadow under the aircraft, baked
 * once (frames = 1, the aircraft never moves relative to it). It fades out as the camera goes under
 * the wing and in every mode but AIRFRAME / AERO.
 */
export function Floor({ features, tier }: { features: KaanFeatures; tier: Tier }) {
    const group = useRef<THREE.Group>(null);
    const mats = useRef<THREE.Material[]>([]);
    const y = features.box.min.y - 0.012;
    const L = features.L;
    const blob = useMemo(() => (tier <= 2 ? blobTexture() : null), [tier]);

    useEffect(() => {
        mats.current = [];
        group.current?.traverse((o) => {
            const m = (o as THREE.Mesh).material as THREE.Material | undefined;
            if ((o as THREE.Mesh).isMesh && m && !(m as THREE.ShaderMaterial).isShaderMaterial) {
                m.transparent = true;
                mats.current.push(m);
            }
        });
    }, [tier]);

    useEffect(() => () => blob?.dispose(), [blob]);

    useFrame(() => {
        const a = (rig.m[0] + rig.m[2]) * rig.w[0];
        if (group.current) group.current.visible = a > 0.01;
        for (const m of mats.current) m.opacity = a * (tier <= 2 ? 0.7 : 1);
        floorUniforms.uOpacity.value = a * 0.55;
    });

    return (
        <group ref={group} position={[0, y, 0]}>
            {/* just below the shadow camera, so the bake never sees it */}
            <mesh rotation-x={-Math.PI / 2} position-y={-0.004} scale={[4.5 * L, 4.5 * L, 1]} renderOrder={-2}>
                <planeGeometry />
                <shaderMaterial
                    transparent
                    depthWrite={false}
                    uniforms={floorUniforms}
                    vertexShader={FLOOR_VERT}
                    fragmentShader={FLOOR_FRAG}
                />
            </mesh>
            {blob ? (
                <mesh rotation-x={-Math.PI / 2} scale={[0.75 * L, 1.15 * L, 1]} renderOrder={-1}>
                    <planeGeometry />
                    <meshBasicMaterial map={blob} transparent depthWrite={false} />
                </mesh>
            ) : (
                <ContactShadows frames={1} scale={2.4 * L} far={0.45 * L} blur={2.6} resolution={512} opacity={1} color="#000000" />
            )}
        </group>
    );
}
