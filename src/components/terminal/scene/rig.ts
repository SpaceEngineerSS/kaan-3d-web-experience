import * as THREE from "three";

/**
 * Per-frame scene state computed once by CameraRig (mounted first, so its useFrame runs first) and
 * read by every other scene module. Mutable on purpose: nothing here goes through React.
 */
export const rig = {
    /** Damped track progress 0..1. */
    p: 0,
    /** Signed, damped, normalised scroll velocity −1..1. */
    v: 0,
    vAbs: 0,
    /** Section weights for 01..04 (0..1, overlapping at the seams). */
    w: [1, 0, 0, 0] as [number, number, number, number],
    /** Scene clock; frozen under reduced motion. */
    time: 0,
    scanPhase: 0,
    /** Mode sweep: index swept from / to, progress 0..1 of the plane travelling nose to tail. */
    modeFrom: 0,
    modeTo: 0,
    sweep: 1,
    /** Set when the airframe has compiled: CameraRig sweeps it in from nothing. */
    intro: false,
    /** Mode weights after the sweep has fully passed: [airframe, xray, aero, eoir], blended over time. */
    m: [1, 0, 0, 0] as [number, number, number, number],
    /** Free-orbit inspection blend 0..1 (1 = camera still at the pose orbit left it in). */
    inspect: 0,
    /** Damped pointer, −1..1. */
    px: 0,
    py: 0,
    /** Where the camera looks this frame (read by the inspect controls on entry). */
    look: new THREE.Vector3(),
    /** Live MUM-T node positions (written by MumT, read by Anchors). */
    anka1: new THREE.Vector3(1.75, 0.02, -0.7),
    anka2: new THREE.Vector3(-1.75, 0.02, -0.7),
    kizilelma: new THREE.Vector3(2.8, 0.18, 2.4),
};

/** Uniform objects shared by reference across KAAN materials, so one write updates all of them. */
export const scanUniforms = {
    uTime: { value: 0 },
    uScanZ: { value: 0 },
    uScanW: { value: 0.08 },
    /** 0..1 — internals fully visible (section 02). */
    uReveal: { value: 0 },
};

/** Smooth weight of section i (0..3) at progress p. */
export function sectionWeight(i: number, p: number) {
    const lo = i === 0 ? 1 : THREE.MathUtils.smoothstep(p, 0.25 * i - 0.05, 0.25 * i + 0.05);
    const hi = i === 3 ? 1 : 1 - THREE.MathUtils.smoothstep(p, 0.25 * (i + 1) - 0.05, 0.25 * (i + 1) + 0.05);
    return lo * hi;
}

/**
 * Mode sweep uniforms. A plane at uSweepZ travels nose (+Z) to tail; fragments on the nose side of it
 * are already in uTo, the rest still in uFrom. Weights are one-hot vec4s [airframe, xray, aero, eoir].
 */
export const modeUniforms = {
    // Start from nothing: the airframe is swept in once its shader has compiled.
    uFrom: { value: new THREE.Vector4(0, 0, 0, 0) },
    uTo: { value: new THREE.Vector4(0, 0, 0, 0) },
    uSweepZ: { value: -10 },
    uSweepW: { value: 0.06 },
    /** 1 while a sweep is travelling: draws the bright cut line. */
    uSweepOn: { value: 0 },
};
