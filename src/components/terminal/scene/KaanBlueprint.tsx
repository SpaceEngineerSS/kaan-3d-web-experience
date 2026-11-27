"use client";
/* eslint-disable react-hooks/immutability -- three.js uniforms are mutated in the render loop by design. */

import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three-stdlib";
import { useModel } from "@/lib/three/useModel";
import type { Tier } from "@/hooks/useDeviceProfile";
import { analyzeKaan, COLOR, createPointsMaterial, FRAG_END, FRAG_PARS, FRAG_START, KAAN_PATH, KAAN_SIZE, makePointGeometry, mergeWorldGeometry, MODE_GLSL, SCAN_GLSL, VERT_END, VERT_PARS, type KaanFeatures } from "./shared";
import { buildInternals } from "./internals";
import { modeUniforms, rig, scanUniforms } from "./rig";

export interface KaanData {
    features: KaanFeatures;
    surface: THREE.BufferGeometry;
    points: THREE.BufferGeometry;
    edges: THREE.BufferGeometry;
    internals: THREE.BufferGeometry;
}

const POINTS_BY_TIER: Record<Tier, number> = { 0: 0, 1: 25_000, 2: 60_000, 3: 120_000 };

/** Load KAAN once, bake its surface, sample the lidar cloud, measure features, build internals. */
export function useKaanData(tier: Tier): KaanData {
    const { object } = useModel(KAAN_PATH, { size: KAAN_SIZE, lite: false });
    const data = useMemo(() => {
        const surface = mergeWorldGeometry(object);
        const sampler = new MeshSurfaceSampler(new THREE.Mesh(surface)).build();
        const points = makePointGeometry(sampler, POINTS_BY_TIER[tier], 2024);
        const pts = points.getAttribute("position").array as Float32Array;
        const features = analyzeKaan(pts, surface.boundingBox!.clone());
        const edges = new THREE.EdgesGeometry(surface, 20);
        const internals = buildInternals(features);
        return { features, surface, points, edges, internals };
    }, [object, tier]);

    useEffect(
        () => () => {
            data.surface.dispose();
            data.points.dispose();
            data.edges.dispose();
            data.internals.dispose();
        },
        [data]
    );
    return data;
}

/* ---------- Edge blueprint ---------- */

const edgeVertex = /* glsl */ `
${VERT_PARS}
${SCAN_GLSL}
${MODE_GLSL}
varying float vBand;
varying float vNear;
varying float vX;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  vBand = scanBand(position.z);
  vNear = smoothstep(0.03, 0.2, -mv.z);
  vX = modeAt(position.z).y + sweepLine(position.z);
  ${VERT_END}
}`;

const edgeFragment = /* glsl */ `
${FRAG_PARS}
uniform vec3 uFg;
uniform vec3 uHot;
uniform float uAlpha;
varying float vBand;
varying float vNear;
varying float vX;
void main() {
  ${FRAG_START}
  float a = (uAlpha + vBand * 0.75) * vNear * vX;
  gl_FragColor = vec4(mix(uFg, uHot, vBand), a);
  ${FRAG_END}
}`;

/* ---------- Fresnel X-ray shell ---------- */

const shellVertex = /* glsl */ `
${VERT_PARS}
${SCAN_GLSL}
${MODE_GLSL}
varying float vX;
varying vec3 vN;
varying vec3 vV;
varying float vBand;
varying float vDepth;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  vBand = scanBand(position.z);
  vDepth = -mv.z;
  vX = modeAt(position.z).y;
  ${VERT_END}
}`;

const shellFragment = /* glsl */ `
${FRAG_PARS}
uniform vec3 uFg;
uniform float uAlpha;
uniform float uReveal;
varying vec3 vN;
varying vec3 vV;
varying float vBand;
varying float vDepth;
varying float vX;
void main() {
  ${FRAG_START}
  float rim = pow(max(1.0 - abs(dot(normalize(vN), normalize(vV))), 0.0), 3.0);
  float a = rim * uAlpha * (1.0 - vBand) * (1.0 - 0.75 * uReveal) * smoothstep(0.05, 0.35, vDepth) * vX;
  gl_FragColor = vec4(uFg, a);
  ${FRAG_END}
}`;

/* ---------- Internals ---------- */

const internalsVertex = /* glsl */ `
${VERT_PARS}
${SCAN_GLSL}
${MODE_GLSL}
varying float vX;
attribute float aSpin;
attribute vec2 aCenter;
uniform float uTime;
varying float vBand;
varying float vNear;
void main() {
  vec3 p = position;
  if (aSpin > 0.5) {
    float ang = uTime * 2.4;
    vec2 d = p.xy - aCenter;
    float c = cos(ang), s = sin(ang);
    p.xy = aCenter + vec2(c * d.x - s * d.y, s * d.x + c * d.y);
  }
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  vBand = scanBand(position.z);
  vNear = smoothstep(0.03, 0.2, -mv.z);
  vX = modeAt(position.z).y;
  ${VERT_END}
}`;

const internalsFragment = /* glsl */ `
${FRAG_PARS}
uniform vec3 uHot;
uniform vec3 uFg;
uniform float uReveal;
varying float vBand;
varying float vNear;
varying float vX;
void main() {
  ${FRAG_START}
  float v = max(vBand, uReveal * 0.55);
  float a = v * 0.85 * vNear * vX;
  if (a < 0.003) discard;
  gl_FragColor = vec4(mix(uFg, uHot, 0.35 + 0.65 * vBand), a);
  ${FRAG_END}
}`;

export function KaanBlueprint({ data, tier }: { data: KaanData; tier: Tier }) {
    const n = POINTS_BY_TIER[tier];
    const mats = useMemo(() => {
        const alpha = THREE.MathUtils.clamp(0.1 * Math.sqrt(120_000 / Math.max(n, 1)), 0.1, 0.24);
        const points = createPointsMaterial(scanUniforms, alpha, 3.0, modeUniforms);
        const common = {
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        };
        const edges = new THREE.ShaderMaterial({
            ...common,
            uniforms: {
                ...modeUniforms,
                uScanZ: scanUniforms.uScanZ,
                uScanW: scanUniforms.uScanW,
                uFg: { value: new THREE.Color(COLOR.fg) },
                uHot: { value: new THREE.Color(COLOR.accent) },
                uAlpha: { value: 0.11 },
            },
            vertexShader: edgeVertex,
            fragmentShader: edgeFragment,
        });
        const shell = new THREE.ShaderMaterial({
            ...common,
            side: THREE.DoubleSide,
            uniforms: {
                ...modeUniforms,
                uScanZ: scanUniforms.uScanZ,
                uScanW: scanUniforms.uScanW,
                uReveal: scanUniforms.uReveal,
                uFg: { value: new THREE.Color(COLOR.fg) },
                uAlpha: { value: 0.07 },
            },
            vertexShader: shellVertex,
            fragmentShader: shellFragment,
        });
        const internals = new THREE.ShaderMaterial({
            ...common,
            uniforms: {
                ...modeUniforms,
                uTime: scanUniforms.uTime,
                uScanZ: scanUniforms.uScanZ,
                uScanW: scanUniforms.uScanW,
                uReveal: scanUniforms.uReveal,
                uFg: { value: new THREE.Color(COLOR.fg) },
                uHot: { value: new THREE.Color(COLOR.accent) },
            },
            vertexShader: internalsVertex,
            fragmentShader: internalsFragment,
        });
        return { points, edges, shell, internals };
    }, [n]);

    useEffect(
        () => () => {
            mats.points.dispose();
            mats.edges.dispose();
            mats.shell.dispose();
            mats.internals.dispose();
        },
        [mats]
    );

    useFrame((state) => {
        mats.points.uniforms.uDpr.value = state.viewport.dpr;
        // The cloud thins a little in the overhead MUM-T view so the formation reads.
        mats.points.uniforms.uOpacity.value = 1 - 0.35 * rig.w[3];
    });

    return (
        <group>
            <mesh geometry={data.surface} material={mats.shell} renderOrder={1} />
            <lineSegments geometry={data.edges} material={mats.edges} renderOrder={2} />
            <points geometry={data.points} material={mats.points} renderOrder={3} />
            <lineSegments geometry={data.internals} material={mats.internals} renderOrder={4} frustumCulled={false} />
        </group>
    );
}
