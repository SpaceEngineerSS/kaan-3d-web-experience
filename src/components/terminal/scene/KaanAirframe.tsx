"use client";
/* eslint-disable react-hooks/immutability -- three.js uniforms are mutated in the render loop by design. */

import { useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Tier } from "@/hooks/useDeviceProfile";
import { COLOR, MODE_GLSL, type KaanFeatures } from "./shared";
import { modeUniforms, rig } from "./rig";
import { hangarMatcap, useHangarEnvironment } from "./HangarIBL";

/**
 * KAAN as a physical object: a matte RAM coat lit by the procedural hangar, a gold/ITO film on the
 * canopy, and the same surface re-shaded as a long-wave IR (white-hot) image in EOIR mode.
 * Visibility follows the mode sweep through a screen-space dither, so the cut is crisp and the mesh
 * keeps writing depth (no transparent sorting against the point cloud).
 */

const VERT_HEAD = /* glsl */ `
attribute float aGlass;
varying vec3 vKPos;
varying float vGlass;
`;

const FRAG_HEAD = /* glsl */ `
${MODE_GLSL}
uniform vec3 uNozL;
uniform vec3 uNozR;
uniform vec3 uFanL;
uniform vec3 uFanR;
uniform float uL;
uniform float uNoseZ;
uniform float uSpeed;
uniform vec3 uAccent;
varying vec3 vKPos;
varying float vGlass;
float kHash(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.x + p.y) * p.x);
}
// Notional LWIR temperature 0..1: engine bays and nozzles, plus stagnation / skin-friction heating
// on forward-facing surfaces (scales with speed), minus sky-facing radiative cooling.
float kTemp(vec3 p, vec3 wN) {
  float s = 0.11 * uL;
  vec3 dl = p - uNozL; vec3 dr = p - uNozR;
  float noz = exp(-dot(dl, dl) / (s * s)) + exp(-dot(dr, dr) / (s * s));
  float bayZ = smoothstep(uFanL.z, uNozL.z, p.z);
  float bx = min(abs(p.x - uNozL.x), abs(p.x - uNozR.x));
  float bay = bayZ * exp(-(bx * bx) / pow(0.07 * uL, 2.0)) * 0.55;
  float fwd = pow(max(wN.z, 0.0), 3.0) * (0.18 + 0.3 * uSpeed);
  float nose = smoothstep(uNoseZ - 0.1 * uL, uNoseZ, p.z) * (0.2 + 0.25 * uSpeed);
  float sky = max(wN.y, 0.0) * 0.08;
  return clamp(0.16 + noz + bay + fwd + nose - sky, 0.0, 1.0);
}
`;

export function KaanAirframe({ surface, features, tier }: { surface: THREE.BufferGeometry; features: KaanFeatures; tier: Tier }) {
    const pbr = tier >= 3;
    const env = useHangarEnvironment(pbr);
    const matcap = useMemo(() => (pbr ? null : hangarMatcap()), [pbr]);
    const { gl, camera, scene } = useThree();
    const [ready, setReady] = useState(false);

    const material = useMemo(() => {
        const params = { color: new THREE.Color("#3a3f46"), roughness: 0.58, metalness: 0.12 };
        // Full PBR (and its long shader compile) is for desktop-class GPUs; everything else gets the
        // hangar pre-integrated into a matcap.
        const m = pbr
            ? new THREE.MeshPhysicalMaterial({ ...params, clearcoat: 0.18, clearcoatRoughness: 0.45 })
            : new THREE.MeshMatcapMaterial({ color: new THREE.Color("#a6adb5"), matcap: matcap ?? undefined });
        const f = features;
        const own = {
            uNozL: { value: f.nozzleL.clone() },
            uNozR: { value: f.nozzleR.clone() },
            uFanL: { value: f.fanL.clone() },
            uFanR: { value: f.fanR.clone() },
            uL: { value: f.L },
            uNoseZ: { value: f.nose.z },
            uSpeed: { value: 0 },
            uAccent: { value: new THREE.Color(COLOR.accent) },
        };
        m.userData.own = own;
        m.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, modeUniforms, own);
            shader.vertexShader = shader.vertexShader
                .replace("#include <common>", `#include <common>\n${VERT_HEAD}`)
                .replace("#include <begin_vertex>", "#include <begin_vertex>\nvKPos = position;\nvGlass = aGlass;");
            shader.fragmentShader = shader.fragmentShader
                .replace("#include <common>", `#include <common>\n${FRAG_HEAD}`)
                .replace(
                    "void main() {",
                    `void main() {
  vec4 kM = modeAt(vKPos.z);
  float kLine = sweepLine(vKPos.z);
  float kVis = kM.x + kM.z + kM.w;
  if (kHash(gl_FragCoord.xy) > kVis && kLine < 0.02) discard;`
                )
                .replace("#include <color_fragment>", "#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.012, 0.014, 0.018), vGlass);")
                .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.06, vGlass);")
                .replace(
                    "#include <opaque_fragment>",
                    `{
  float ndv = clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 3.0);
  // thin-film tint of a gold / indium-tin-oxide canopy coating: amber face-on, blue at grazing angles
  vec3 film = mix(vec3(0.95, 0.72, 0.35), vec3(0.55, 0.62, 0.9), fres);
  outgoingLight += vGlass * film * (0.05 + 0.55 * fres);
  outgoingLight *= mix(1.0, 0.42, kM.z);
  vec3 wN = normalize((vec4(normal, 0.0) * viewMatrix).xyz);
  float T = kTemp(vKPos, wN) * (1.0 - 0.55 * vGlass);
  vec3 hot = vec3(pow(T, 1.15));
  hot = mix(hot, uAccent * 1.4, smoothstep(0.9, 1.0, T));
  outgoingLight = mix(outgoingLight, hot, kM.w);
  outgoingLight += kLine * uAccent * 1.6;
}
#include <opaque_fragment>`
                );
        };
        m.customProgramCacheKey = () => `kaan-airframe-${pbr ? "phys" : "matcap"}`;
        return m;
    }, [features, pbr, matcap]);

    const mesh = useMemo(() => {
        const o = new THREE.Mesh(surface, material);
        o.renderOrder = 0;
        o.visible = false;
        return o;
    }, [surface, material]);

    // Compile off the main thread (KHR_parallel_shader_compile) once the hangar is baked, then
    // sweep the aircraft in. Until then nothing of it is drawn.
    useEffect(() => {
        if (pbr && !env) return;
        if (material instanceof THREE.MeshStandardMaterial) {
            material.envMap = env;
            material.envMapIntensity = 2.1;
            material.needsUpdate = true;
        }
        let live = true;
        mesh.visible = true;
        gl.compileAsync(mesh, camera, scene)
            .catch(() => undefined)
            .then(() => {
                if (!live) return;
                setReady(true);
                rig.intro = true;
            });
        mesh.visible = false;
        return () => {
            live = false;
        };
    }, [pbr, material, env, mesh, gl, camera, scene]);

    useEffect(() => {
        mesh.visible = ready;
    }, [mesh, ready]);

    useEffect(() => () => material.dispose(), [material]);
    useEffect(() => () => matcap?.dispose(), [matcap]);

    useFrame(() => {
        (material.userData.own as { uSpeed: { value: number } }).uSpeed.value = 0.4 + 0.6 * rig.vAbs;
    });

    return <primitive object={mesh} />;
}
