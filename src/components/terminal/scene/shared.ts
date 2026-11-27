import * as THREE from "three";

/** Design-system colours (globals.css). */
export const COLOR = {
    ink: "#08090B",
    ram: "#1A1D21",
    fg: "#EAEAE6",
    steel: "#8C9199",
    faint: "#6B7078",
    ti: "#C9B79C",
    accent: "#E06C2B",
    burn: "#E06C2B",
} as const;

export const KAAN_PATH = "/models/KAAN.glb";
export const ANKA_PATH = "/models/anka3.glb";
/** KAAN is 20.3 m long (TUSAŞ): 1 scene unit = 10 m. */
export const KAAN_SIZE = 2.03;
/** ANKA-3 span 13.1 m on the same scale. */
export const ANKA_SIZE = 1.31;

/* GLSL chunks shared by every custom material. The canvas uses a logarithmic depth buffer, so each
   shader carries the log-depth includes; colorspace_fragment converts to the output colour space. */
export const VERT_PARS = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
`;
export const VERT_END = /* glsl */ `#include <logdepthbuf_vertex>`;
export const FRAG_PARS = /* glsl */ `#include <logdepthbuf_pars_fragment>`;
export const FRAG_START = /* glsl */ `#include <logdepthbuf_fragment>`;
export const FRAG_END = /* glsl */ `#include <colorspace_fragment>`;

/** Narrow band around the scan plane: 1 inside, 0 outside. */
export const SCAN_GLSL = /* glsl */ `
uniform float uScanZ;
uniform float uScanW;
float scanBand(float z) {
  return 1.0 - smoothstep(0.0, uScanW, abs(z - uScanZ));
}
`;

/** Mode weight at an airframe z: which side of the sweep plane it is on, plus the cut line. */
export const MODE_GLSL = /* glsl */ `
uniform vec4 uFrom;
uniform vec4 uTo;
uniform float uSweepZ;
uniform float uSweepW;
uniform float uSweepOn;
vec4 modeAt(float z) {
  return mix(uFrom, uTo, smoothstep(uSweepZ - uSweepW, uSweepZ + uSweepW, z));
}
float sweepLine(float z) {
  return uSweepOn * (1.0 - smoothstep(0.0, uSweepW * 0.35, abs(z - uSweepZ)));
}
`;

/** Small deterministic PRNG so precomputed geometry is the same on every load. */
export function mulberry32(seed: number) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Bake every mesh under `root` into one non-indexed Float32 geometry in root space (root's own
 * transform included, so the result has the normalised size and the nose-forward flip of useModel).
 * Handles quantised / normalised attributes through fromBufferAttribute.
 */
export function mergeWorldGeometry(root: THREE.Object3D): THREE.BufferGeometry {
    root.updateMatrixWorld(true);
    const meshes: THREE.Mesh[] = [];
    root.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
    });
    let count = 0;
    for (const m of meshes) {
        const g = m.geometry;
        count += g.index ? g.index.count : g.getAttribute("position").count;
    }
    const pos = new Float32Array(count * 3);
    const nor = new Float32Array(count * 3);
    const glass = new Float32Array(count);
    const v = new THREE.Vector3();
    const n = new THREE.Vector3();
    const nm = new THREE.Matrix3();
    let missingNormals = false;
    let o = 0;
    for (const m of meshes) {
        const g = m.geometry;
        const pa = g.getAttribute("position");
        const na = g.getAttribute("normal");
        const idx = g.index;
        if (!na) missingNormals = true;
        nm.getNormalMatrix(m.matrixWorld);
        // useModel marks the exported transmissive canopy as a transparent, non-depth-writing surface.
        const mat = Array.isArray(m.material) ? m.material[0] : m.material;
        const isGlass = mat.transparent && mat.opacity < 1 ? 1 : 0;
        const c = idx ? idx.count : pa.count;
        for (let i = 0; i < c; i++) {
            const k = idx ? idx.getX(i) : i;
            v.fromBufferAttribute(pa, k).applyMatrix4(m.matrixWorld);
            pos[o * 3] = v.x;
            pos[o * 3 + 1] = v.y;
            pos[o * 3 + 2] = v.z;
            if (na) {
                n.fromBufferAttribute(na, k).applyMatrix3(nm).normalize();
                nor[o * 3] = n.x;
                nor[o * 3 + 1] = n.y;
                nor[o * 3 + 2] = n.z;
            }
            glass[o] = isGlass;
            o++;
        }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    geo.setAttribute("aGlass", new THREE.BufferAttribute(glass, 1));
    if (missingNormals) geo.computeVertexNormals();
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
    return geo;
}

/** Named points on the airframe, all derived from the sampled surface and its bounding box. */
export interface KaanFeatures {
    box: THREE.Box3;
    /** Length along Z. Nose is +Z. */
    L: number;
    nose: THREE.Vector3;
    radar: THREE.Vector3;
    irst: THREE.Vector3;
    eots: THREE.Vector3;
    canopy: THREE.Vector3;
    eye: THREE.Vector3;
    intake: THREE.Vector3;
    bay: THREE.Vector3;
    bellyY: number;
    lerx: THREE.Vector3;
    finTip: THREE.Vector3;
    wingTip: THREE.Vector3;
    nozzleR: THREE.Vector3;
    nozzleL: THREE.Vector3;
    nozzles: THREE.Vector3;
    fanR: THREE.Vector3;
    fanL: THREE.Vector3;
    kaanNode: THREE.Vector3;
}

/**
 * Find features on a surface point cloud. f = 0 at the tail, 1 at the nose.
 * Each search falls back to a proportion of the published dimensions if no point qualifies.
 */
export function analyzeKaan(pos: Float32Array, box: THREE.Box3): KaanFeatures {
    const L = box.max.z - box.min.z;
    const zT = box.min.z;
    const Z = (f: number) => zT + f * L;
    const cy = (box.min.y + box.max.y) / 2;
    const n = pos.length / 3;

    /** Extreme point along `axis` (sign +1 max, −1 min) among points in z-range [f0,f1] and x-range. */
    const extreme = (f0: number, f1: number, xMin: number, xMax: number, axis: 0 | 1 | 2, sign: 1 | -1, fallback: THREE.Vector3) => {
        const z0 = Z(f0);
        const z1 = Z(f1);
        let best = -Infinity;
        let bi = -1;
        for (let i = 0; i < n; i++) {
            const x = pos[i * 3];
            const z = pos[i * 3 + 2];
            if (z < z0 || z > z1 || x < xMin || x > xMax) continue;
            const val = sign * pos[i * 3 + axis];
            if (val > best) {
                best = val;
                bi = i;
            }
        }
        if (bi < 0) return fallback;
        return new THREE.Vector3(pos[bi * 3], pos[bi * 3 + 1], pos[bi * 3 + 2]);
    };

    const nose = extreme(0.9, 1.01, -L, L, 2, 1, new THREE.Vector3(0, cy, box.max.z));
    const radar = new THREE.Vector3(0, nose.y, nose.z - 0.05 * L);
    const canopy = extreme(0.64, 0.78, -0.02 * L, 0.02 * L, 1, 1, new THREE.Vector3(0, cy + 0.05 * L, Z(0.71)));
    canopy.x = 0;
    const eye = new THREE.Vector3(0, canopy.y - 0.022 * L, canopy.z - 0.008 * L);
    const irst = extreme(0.8, 0.85, -0.012 * L, 0.012 * L, 1, 1, new THREE.Vector3(0, cy + 0.03 * L, Z(0.82)));
    irst.x = 0;
    const eots = extreme(0.84, 0.9, -0.012 * L, 0.012 * L, 1, -1, new THREE.Vector3(0, cy - 0.03 * L, Z(0.87)));
    eots.x = 0;
    const bellyY = extreme(0.4, 0.6, -0.02 * L, 0.02 * L, 1, -1, new THREE.Vector3(0, cy - 0.04 * L, Z(0.5))).y;
    const bay = new THREE.Vector3(0, bellyY, Z(0.5));
    const lerx = extreme(0.6, 0.66, 0, 0.12 * L, 0, 1, new THREE.Vector3(0.09 * L, cy, Z(0.63)));
    const intake = new THREE.Vector3(Math.min(0.065 * L, lerx.x * 0.9), (bellyY + lerx.y) / 2, Z(0.63));
    const wingTip = extreme(-0.01, 1.01, 0, L, 0, 1, new THREE.Vector3(0.33 * L, cy, Z(0.25)));
    const finTip = extreme(-0.01, 1.01, 0, L, 1, 1, new THREE.Vector3(0.1 * L, cy + 0.12 * L, Z(0.1)));

    // Nozzles: the aft-most points near the centreline.
    const nozzleZ = extreme(-0.01, 0.3, -0.08 * L, 0.08 * L, 2, -1, new THREE.Vector3(0, cy, zT)).z;
    let sx = 0;
    let sy = 0;
    let c = 0;
    for (let i = 0; i < n; i++) {
        const x = pos[i * 3];
        const z = pos[i * 3 + 2];
        if (z > nozzleZ + 0.03 * L || Math.abs(x) > 0.08 * L) continue;
        sx += Math.abs(x);
        sy += pos[i * 3 + 1];
        c++;
    }
    const nozX = c > 20 ? THREE.MathUtils.clamp(sx / c, 0.025 * L, 0.06 * L) : 0.037 * L;
    const nozY = c > 20 ? sy / c : cy - 0.017 * L;
    const nozzleR = new THREE.Vector3(nozX, nozY, nozzleZ + 0.01 * L);
    const nozzleL = new THREE.Vector3(-nozX, nozY, nozzleZ + 0.01 * L);
    const nozzles = new THREE.Vector3(0, nozY, nozzleZ);
    const fanR = new THREE.Vector3(nozX * 1.05, nozY + 0.004 * L, Z(0.27));
    const fanL = new THREE.Vector3(-nozX * 1.05, nozY + 0.004 * L, Z(0.27));
    const kaanNode = new THREE.Vector3(0, canopy.y + 0.04 * L, Z(0.5));

    return { box, L, nose, radar, irst, eots, canopy, eye, intake, bay, bellyY, lerx, finTip, wingTip, nozzleR, nozzleL, nozzles, fanR, fanL, kaanNode };
}

/** Sample `count` points on a merged geometry's surface. Returns positions and a per-point random. */
export function makePointGeometry(sampler: { sample: (p: THREE.Vector3, n?: THREE.Vector3) => unknown }, count: number, seed: number) {
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    const rand = mulberry32(seed);
    const v = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
        sampler.sample(v);
        pos[i * 3] = v.x;
        pos[i * 3 + 1] = v.y;
        pos[i * 3 + 2] = v.z;
        rnd[i] = rand();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));
    geo.computeBoundingSphere();
    return geo;
}

/* ---------- Lidar point material (KAAN and ANKA-3) ---------- */

const pointsVertex = /* glsl */ `
${VERT_PARS}
${SCAN_GLSL}
#ifdef USE_MODE
${MODE_GLSL}
#endif
attribute float aRand;
uniform float uTime;
uniform float uSize;
uniform float uDpr;
uniform float uJitter;
uniform float uAlpha;
varying float vAlpha;
varying float vBand;
float h1(float n) { return fract(sin(n) * 43758.5453123); }
void main() {
  float tq = floor(uTime * 12.0);
  vec3 j = vec3(h1(aRand * 13.1 + tq), h1(aRand * 27.7 + tq), h1(aRand * 31.3 + tq)) - 0.5;
  vec3 p = position + j * uJitter;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = max(-mv.z, 0.001);
  gl_PointSize = clamp(uSize * uDpr / depth, 1.0, 4.0 * uDpr);
  float band = scanBand(position.z);
  float flicker = 0.72 + 0.28 * sin(uTime * (2.0 + aRand * 9.0) + aRand * 61.0);
  float fade = mix(0.35, 1.0, exp(-max(depth - 1.2, 0.0) * 0.28));
  float near = smoothstep(0.03, 0.16, depth);
  vBand = band;
  vAlpha = (uAlpha * flicker * fade + band * 0.85) * near;
#ifdef USE_MODE
  vAlpha *= modeAt(position.z).y;
#endif
  ${VERT_END}
}`;

const pointsFragment = /* glsl */ `
${FRAG_PARS}
uniform vec3 uFg;
uniform vec3 uHot;
uniform float uOpacity;
varying float vAlpha;
varying float vBand;
void main() {
  ${FRAG_START}
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = vAlpha * (1.0 - smoothstep(0.2, 0.5, d)) * uOpacity;
  gl_FragColor = vec4(mix(uFg, uHot, vBand), a);
  ${FRAG_END}
}`;

export interface ScanUniforms {
    uTime: { value: number };
    uScanZ: { value: number };
    uScanW: { value: number };
}

/** `mode`: follow the KAAN mode sweep (visible only in X-RAY). The ANKA-3 clouds pass false. */
export function createPointsMaterial(shared: ScanUniforms, alpha: number, size: number, mode?: Record<string, { value: unknown }>) {
    return new THREE.ShaderMaterial({
        defines: mode ? { USE_MODE: "" } : {},
        uniforms: {
            ...(mode ?? {}),
            uTime: shared.uTime,
            uScanZ: shared.uScanZ,
            uScanW: shared.uScanW,
            uSize: { value: size },
            uDpr: { value: 1 },
            uJitter: { value: 0.0016 },
            uAlpha: { value: alpha },
            uOpacity: { value: 1 },
            uFg: { value: new THREE.Color(COLOR.fg) },
            uHot: { value: new THREE.Color(COLOR.accent) },
        },
        vertexShader: pointsVertex,
        fragmentShader: pointsFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
}
