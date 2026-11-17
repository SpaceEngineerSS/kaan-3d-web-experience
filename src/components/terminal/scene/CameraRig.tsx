"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { terminal } from "@/lib/terminal/state";
import type { KaanFeatures } from "./shared";
import { rig, scanUniforms, sectionWeight } from "./rig";

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/**
 * Camera keyframes and the track progress at which each is reached:
 *  .00 01 hero 3/4 front            .14 01 chine / LERX close-up
 *  .27 02 under the wing            .40 02 under the belly, looking up into the bay
 *  .52 03 settling into the seat    .60 03 first person over the nose   .70 03 (hold)
 *  .80 04 climbing out              .92 04 overhead MUM-T               1.0 04 overhead, drifting
 */
const TIMES = [0, 0.14, 0.27, 0.4, 0.52, 0.6, 0.7, 0.8, 0.92, 1];
/** Reduced motion: one still frame per section. */
const STILLS = [0, 0.4, 0.66, 0.92];

/** Track progress → uniform curve parameter (keyframe k sits at k / (n − 1)). */
function toCurveU(p: number) {
    const n = TIMES.length - 1;
    for (let i = 0; i < n; i++) {
        if (p <= TIMES[i + 1]) return (i + (p - TIMES[i]) / (TIMES[i + 1] - TIMES[i])) / n;
    }
    return 1;
}

function buildCurves(f: KaanFeatures) {
    const eye = f.eye;
    const ahead = (d: number) => V(0, eye.y - 0.06 * d, eye.z + d);
    const pos = [
        V(2.35, 0.78, 2.55),
        V(0.78, 0.2, f.lerx.z + 0.62),
        V(1.05, -0.42, -0.25),
        V(0.32, f.bellyY - 0.62, f.bay.z + 0.32),
        V(0, eye.y + 0.035, eye.z - 0.11),
        V(0, eye.y, eye.z),
        V(0, eye.y + 0.004, eye.z + 0.012),
        V(0.5, 2.4, -2.3),
        V(0.35, 4.5, -1.75),
        V(-0.35, 5.1, -0.85),
    ];
    const look = [
        V(0, -0.02, 0.05),
        V(f.lerx.x * 0.55, f.lerx.y, f.lerx.z + 0.05),
        V(0.35, -0.05, 0.05),
        V(0, f.bellyY, f.bay.z),
        ahead(3),
        ahead(3),
        ahead(3.1),
        V(0.2, 0, 0.4),
        V(0.5, 0, 0.6),
        V(0.6, 0, 0.75),
    ];
    return {
        pos: new THREE.CatmullRomCurve3(pos, false, "centripetal"),
        look: new THREE.CatmullRomCurve3(look, false, "centripetal"),
    };
}

export function CameraRig({ features, reduced }: { features: KaanFeatures; reduced: boolean }) {
    const curves = useMemo(() => buildCurves(features), [features]);
    const tmp = useMemo(() => ({ pos: new THREE.Vector3(), look: new THREE.Vector3(), off: new THREE.Vector3(), fwd: new THREE.Vector3(), right: new THREE.Vector3(), up: new THREE.Vector3() }), []);

    useFrame((state, delta) => {
        const dt = Math.min(delta, 0.1);
        const cam = state.camera as THREE.PerspectiveCamera;
        const f = features;

        // Progress, velocity, section weights.
        const target = THREE.MathUtils.clamp(terminal.track, 0, 1);
        rig.p = reduced ? STILLS[Math.min(3, Math.floor(target * 4))] : THREE.MathUtils.damp(rig.p, target, 3.2, dt);
        const vt = THREE.MathUtils.clamp(terminal.velocity / 2500, -1, 1);
        rig.v = reduced ? 0 : THREE.MathUtils.damp(rig.v, vt, 4, dt);
        rig.vAbs = Math.abs(rig.v);
        for (let i = 0; i < 4; i++) rig.w[i] = sectionWeight(i, rig.p);
        const [, w1, w2] = rig.w;

        // Clock and scan sweep (nose → tail). Reduced motion: no clock; the scan follows the track.
        const zHi = f.box.max.z + 0.08;
        const zLo = f.box.min.z - 0.08;
        if (!reduced) {
            rig.time += dt;
            rig.scanPhase += dt * (0.17 + 0.12 * rig.vAbs) * (1 - 0.45 * w1);
            scanUniforms.uScanZ.value = THREE.MathUtils.lerp(zHi, zLo, rig.scanPhase % 1);
        } else {
            scanUniforms.uScanZ.value = THREE.MathUtils.lerp(zHi, zLo, 0.35 + 0.3 * w1);
        }
        scanUniforms.uTime.value = rig.time;
        scanUniforms.uScanW.value = f.L * (0.03 + 0.025 * w1);
        scanUniforms.uReveal.value = w1;

        // Camera along the splines.
        const u = toCurveU(rig.p);
        curves.pos.getPoint(u, tmp.pos);
        curves.look.getPoint(u, tmp.look);

        // Portrait screens: pull out (not in the cockpit).
        const aspect = state.size.width / Math.max(state.size.height, 1);
        const k = 1 + (Math.pow(Math.max(1, 1 / aspect), 0.8) - 1) * (1 - w2);
        tmp.off.subVectors(tmp.pos, tmp.look).multiplyScalar(k);
        tmp.pos.copy(tmp.look).add(tmp.off);

        // Tiny pointer parallax in camera space.
        if (!reduced) {
            const dist = tmp.off.length();
            tmp.fwd.copy(tmp.off).negate().normalize();
            tmp.right.crossVectors(tmp.fwd, cam.up).normalize();
            tmp.up.crossVectors(tmp.right, tmp.fwd);
            const amp = dist * 0.018 * (1 - 0.7 * w2);
            tmp.pos.addScaledVector(tmp.right, terminal.px * amp).addScaledVector(tmp.up, -terminal.py * amp * 0.7);
        }

        cam.position.copy(tmp.pos);
        cam.up.set(0, 1, 0);
        cam.lookAt(tmp.look);
        if (!reduced) cam.rotateZ(THREE.MathUtils.degToRad(6) * rig.v);

        const fov = THREE.MathUtils.lerp(38, 60, w2) + (reduced ? 0 : 4 * rig.v);
        if (Math.abs(cam.fov - fov) > 0.01) {
            cam.fov = fov;
            cam.updateProjectionMatrix();
        }
    });

    return null;
}
