"use client";
/* eslint-disable react-hooks/immutability -- the camera and rig state are mutated in the render loop by design. */

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MODES, terminal } from "@/lib/terminal/state";
import type { KaanFeatures } from "./shared";
import { modeUniforms, rig, scanUniforms, sectionWeight } from "./rig";

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/**
 * Camera keyframes and the track progress at which each is reached. AIRFRAME (PBR) views stay at
 * ≥ 1.6 L because the model is low-poly; close-ups happen in X-RAY / EOIR where the point cloud reads.
 *  .00 01 hero 3/4 front, below eye level   .14 01 slow orbit to the chine, still ~1.7 L
 *  .27 02 under the wing (X-RAY)            .40 02 under the belly, looking up into the bay
 *  .52 03 settling into the seat (EOIR)     .60 03 first person over the nose   .70 03 (hold)
 *  .80 04 climbing out                      .92 04 overhead MUM-T at ~5 L      1.0 04 drifting
 */
const TIMES = [0, 0.14, 0.27, 0.4, 0.52, 0.6, 0.7, 0.8, 0.92, 1];
/** Reduced motion: one still frame per section. */
const STILLS = [0, 0.4, 0.66, 0.92];
/** Mode sweep duration, seconds. */
const SWEEP = 0.9;

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
        V(2.6, 0.42, 2.75),
        V(2.4, 0.62, 0.9),
        V(1.05, -0.42, -0.25),
        V(0.32, f.bellyY - 0.62, f.bay.z + 0.32),
        V(0, eye.y + 0.035, eye.z - 0.11),
        V(0, eye.y, eye.z),
        V(0, eye.y + 0.004, eye.z + 0.012),
        V(0.5, 2.4, -2.3),
        V(0.35, 5.6, -2.1),
        V(-0.35, 6.2, -1.1),
    ];
    const look = [
        V(0, -0.06, 0.1),
        V(0.1, 0, 0.2),
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

/**
 * Critically damped spring step (ζ = 1): no overshoot, settles in ~4/ω seconds.
 * x'' = ω²(target − x) − 2ω x'. Sub-stepped so a long frame cannot destabilise it.
 */
let springV = 0;
function spring(x: number, v: number, target: number, omega: number, dt: number) {
    const steps = Math.ceil(dt / (1 / 120));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
        v += (omega * omega * (target - x) - 2 * omega * v) * h;
        x += v * h;
    }
    springV = v;
    return x;
}

const easeSweep = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const ONE_HOT = [new THREE.Vector4(1, 0, 0, 0), new THREE.Vector4(0, 1, 0, 0), new THREE.Vector4(0, 0, 1, 0), new THREE.Vector4(0, 0, 0, 1)];

export function CameraRig({ features, reduced }: { features: KaanFeatures; reduced: boolean }) {
    const curves = useMemo(() => buildCurves(features), [features]);
    const s = useMemo(
        () => ({
            pos: new THREE.Vector3(),
            look: new THREE.Vector3(),
            lookS: new THREE.Vector3(0, -0.06, 0.1),
            lookV: new THREE.Vector3(),
            off: new THREE.Vector3(),
            fwd: new THREE.Vector3(),
            right: new THREE.Vector3(),
            up: new THREE.Vector3(),
            exitPos: new THREE.Vector3(),
            exitQuat: new THREE.Quaternion(),
            q: new THREE.Quaternion(),
            pv: 0,
            inspectV: 0,
            lift: -1,
            vw: 0,
            vh: 0,
            wasInspecting: false,
        }),
        []
    );

    useFrame((state, delta) => {
        const dt = Math.min(delta, 0.1);
        const cam = state.camera as THREE.PerspectiveCamera;
        const f = features;

        // Track progress through a critically damped spring; velocity for roll / FOV.
        const target = THREE.MathUtils.clamp(terminal.track, 0, 1);
        if (reduced) {
            rig.p = STILLS[Math.min(3, Math.floor(target * 4))];
            s.pv = 0;
        } else {
            rig.p = spring(rig.p, s.pv, target, 6, dt);
            s.pv = springV;
        }
        const vt = THREE.MathUtils.clamp(terminal.velocity / 2500, -1, 1);
        rig.v = reduced ? 0 : THREE.MathUtils.damp(rig.v, vt, 4, dt);
        rig.vAbs = Math.abs(rig.v);
        for (let i = 0; i < 4; i++) rig.w[i] = sectionWeight(i, rig.p);
        const [, w1, w2] = rig.w;

        // Mode sweep: a plane travels nose → tail; reduced motion switches at once.
        const zHi = f.box.max.z + 0.1;
        const zLo = f.box.min.z - 0.1;
        const want = MODES.indexOf(terminal.mode);
        if (want !== rig.modeTo) {
            rig.modeFrom = rig.modeTo;
            rig.modeTo = want;
            rig.sweep = reduced ? 1 : 0;
            modeUniforms.uFrom.value.copy(ONE_HOT[rig.modeFrom]);
            modeUniforms.uTo.value.copy(ONE_HOT[rig.modeTo]);
        }
        if (rig.sweep < 1) rig.sweep = Math.min(1, rig.sweep + dt / SWEEP);
        const e = easeSweep(rig.sweep);
        modeUniforms.uSweepZ.value = rig.sweep >= 1 ? zLo - 1 : THREE.MathUtils.lerp(zHi, zLo, e);
        modeUniforms.uSweepOn.value = rig.sweep >= 1 ? 0 : 1;
        modeUniforms.uSweepW.value = f.L * 0.035;
        if (rig.sweep >= 1) modeUniforms.uFrom.value.copy(ONE_HOT[rig.modeTo]);
        for (let k = 0; k < 4; k++) rig.m[k] = THREE.MathUtils.lerp(ONE_HOT[rig.modeFrom].getComponent(k), ONE_HOT[rig.modeTo].getComponent(k), e);

        // Clock and the X-RAY scan band.
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

        // Free orbit: OrbitControls owns the camera; on exit blend back to the spline.
        if (terminal.inspect) {
            s.wasInspecting = true;
            rig.inspect = 1;
            s.inspectV = 0;
            return;
        }
        if (s.wasInspecting) {
            s.wasInspecting = false;
            s.exitPos.copy(cam.position);
            s.exitQuat.copy(cam.quaternion);
        }
        if (rig.inspect > 0.0005) {
            rig.inspect = spring(rig.inspect, s.inspectV, 0, 5, dt);
            s.inspectV = springV;
        } else rig.inspect = 0;

        // Camera along the splines; the look target trails on a slower spring.
        const u = toCurveU(rig.p);
        curves.pos.getPoint(u, s.pos);
        curves.look.getPoint(u, s.look);
        if (reduced) s.lookS.copy(s.look);
        else {
            const w = 9;
            const k = dt;
            s.lookV.x += (w * w * (s.look.x - s.lookS.x) - 2 * w * s.lookV.x) * k;
            s.lookV.y += (w * w * (s.look.y - s.lookS.y) - 2 * w * s.lookV.y) * k;
            s.lookV.z += (w * w * (s.look.z - s.lookS.z) - 2 * w * s.lookV.z) * k;
            s.lookS.addScaledVector(s.lookV, k);
        }

        // Portrait screens: pull out (not in the cockpit).
        const aspect = state.size.width / Math.max(state.size.height, 1);
        const kz = 1 + (Math.pow(Math.max(1, 1 / aspect), 0.8) - 1) * (1 - w2);
        s.off.subVectors(s.pos, s.lookS).multiplyScalar(kz);
        s.pos.copy(s.lookS).add(s.off);

        // Damped pointer parallax in camera space.
        if (!reduced) {
            const dist = s.off.length();
            s.fwd.copy(s.off).negate().normalize();
            s.right.crossVectors(s.fwd, cam.up).normalize();
            s.up.crossVectors(s.right, s.fwd);
            rig.px = THREE.MathUtils.damp(rig.px, terminal.px, 2.5, dt);
            rig.py = THREE.MathUtils.damp(rig.py, terminal.py, 2.5, dt);
            const amp = dist * 0.02 * (1 - 0.7 * w2);
            s.pos.addScaledVector(s.right, rig.px * amp).addScaledVector(s.up, -rig.py * amp * 0.7);
        }

        cam.position.copy(s.pos);
        cam.up.set(0, 1, 0);
        cam.lookAt(s.lookS);
        rig.look.copy(s.lookS);
        if (!reduced) cam.rotateZ(THREE.MathUtils.degToRad(6) * rig.v);
        if (rig.inspect > 0) {
            s.q.copy(cam.quaternion);
            cam.position.lerpVectors(s.pos, s.exitPos, rig.inspect);
            cam.quaternion.slerpQuaternions(s.q, s.exitQuat, rig.inspect);
        }

        // Portrait: widen the lens too, so a side-on airframe still fits the narrow width.
        const portrait = Math.min(1.45, Math.pow(Math.max(1, 1 / aspect), 0.5));
        const fov = THREE.MathUtils.lerp(36 * portrait, 60, w2) + (reduced ? 0 : 4 * rig.v);
        // Portrait phones: lift the image so the aircraft sits in the upper part of the screen, clear
        // of the reading blocks that scroll through the lower half. Not in the cockpit view.
        const lift = aspect < 0.8 ? 0.18 * (1 - w2) : 0;
        const W = state.size.width;
        const H = state.size.height;
        if (Math.abs(lift - s.lift) > 0.002 || Math.abs(cam.fov - fov) > 0.01 || W !== s.vw || H !== s.vh) {
            s.lift = lift;
            s.vw = W;
            s.vh = H;
            cam.fov = fov;
            if (lift > 0) cam.setViewOffset(W, H, 0, lift * H, W, H);
            else cam.clearViewOffset();
            cam.updateProjectionMatrix();
        }
    });

    return null;
}
