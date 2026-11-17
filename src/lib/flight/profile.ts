import * as THREE from "three";

/**
 * The home page re-enacts KAAN's first flight: 21 February 2024, 08:50, from Mürted (Akıncı).
 * Published figures for that sortie: about 13 minutes, up to 8,000 ft and 230 kt, landing gear
 * kept down, an F-16D chase aircraft. Everything in between is an illustrative profile.
 * 1 scene unit = 10 m. The runway runs along -Z from the origin, the climb turns right,
 * the cruise sits above the cloud layer.
 *
 * Speeds and altitudes follow a plausible fighter take-off and climb; they are illustrative,
 * not KAAN test data, and the page says so.
 */

export const UNIT_M = 10;
/** Mürted (Akıncı) field elevation, approximately. */
export const FIELD_FT = 2770;

/** Flight path control points (x, y, z) in scene units. */
const PATH = new THREE.CatmullRomCurve3(
    [
        new THREE.Vector3(0, 0.32, 40),
        new THREE.Vector3(0, 0.32, -40),
        new THREE.Vector3(0, 0.32, -120),
        new THREE.Vector3(0, 1.2, -200),
        new THREE.Vector3(4, 10.56, -300),
        new THREE.Vector3(30, 38.4, -430),
        new THREE.Vector3(110, 81.6, -560),
        new THREE.Vector3(240, 120.0, -640),
        new THREE.Vector3(400, 144.0, -660),
        new THREE.Vector3(560, 153.6, -610),
        new THREE.Vector3(700, 158.4, -520),
        new THREE.Vector3(820, 160.8, -400),
    ],
    false,
    "centripetal",
    0.5
);

/** Scroll progress (0..1) → arc length (0..1). The runway roll takes longer than its distance. */
const P_KEYS = [0, 0.07, 0.2, 0.28, 0.42, 0.62, 0.85, 1];
const U_KEYS = [0, 0.0, 0.1, 0.2, 0.42, 0.66, 0.86, 1];

/** Speed in knots against scroll progress. */
const KT_KEYS: [number, number][] = [
    [0, 0],
    [0.07, 0],
    [0.17, 145],
    [0.22, 170],
    [0.4, 215],
    [0.6, 230],
    [1, 228],
];

/** Afterburner: on for the take-off roll and initial climb, then military power. */
const AB_KEYS: [number, number][] = [
    [0, 0],
    [0.06, 0],
    [0.09, 1],
    [0.32, 1],
    [0.4, 0.15],
    [1, 0.15],
];

function interp(keys: [number, number][], p: number) {
    if (p <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
        if (p <= keys[i][0]) {
            const [p0, v0] = keys[i - 1];
            const [p1, v1] = keys[i];
            const t = (p - p0) / (p1 - p0 || 1);
            const s = t * t * (3 - 2 * t);
            return v0 + (v1 - v0) * s;
        }
    }
    return keys[keys.length - 1][1];
}

function arcU(p: number) {
    return interp(
        P_KEYS.map((k, i) => [k, U_KEYS[i]] as [number, number]),
        p
    );
}

export interface FlightState {
    p: number;
    position: THREE.Vector3;
    quaternion: THREE.Quaternion;
    /** Degrees. */
    pitch: number;
    roll: number;
    heading: number;
    knots: number;
    mach: number;
    altFt: number;
    g: number;
    afterburner: number;
    gearDown: boolean;
    onGround: boolean;
}

const _t = new THREE.Vector3();
const _t2 = new THREE.Vector3();
const _m = new THREE.Matrix4();
const _up = new THREE.Vector3(0, 0.48, 0);
const _q = new THREE.Quaternion();
const _fwd = new THREE.Vector3();

export function createFlightState(): FlightState {
    return {
        p: 0,
        position: new THREE.Vector3(),
        quaternion: new THREE.Quaternion(),
        pitch: 0,
        roll: 0,
        heading: 0,
        knots: 0,
        mach: 0,
        altFt: 0,
        g: 1,
        afterburner: 0,
        gearDown: true,
        onGround: true,
    };
}

/** Fill `out` with the aircraft state at scroll progress p. Allocation-free. */
export function sampleFlight(p: number, out: FlightState): FlightState {
    const u = THREE.MathUtils.clamp(arcU(p), 0, 1);
    PATH.getPointAt(u, out.position);
    PATH.getTangentAt(u, _t).normalize();

    // Bank from horizontal curvature: compare tangent a little ahead.
    PATH.getTangentAt(Math.min(1, u + 0.02), _t2).normalize();
    const turn = _t.x * _t2.z - _t.z * _t2.x; // >0 turning right (heading increasing)
    // Positive rotation about the nose axis drops the right wing (right wing is -X once the nose is +Z).
    const bankRad = THREE.MathUtils.clamp(turn * 14, -0.5, 0.5);

    const pitchRad = Math.asin(THREE.MathUtils.clamp(_t.y, -1, 1));
    const onGround = out.position.y < 0.6 && p < 0.2;
    // Rotation: nose comes up before the wheels leave the runway.
    const rotate = THREE.MathUtils.smoothstep(p, 0.15, 0.2) * (onGround ? 0.16 : 0);

    // Orient +Z along the tangent (model nose is +Z after useModel's flip).
    _fwd.copy(out.position).add(_t);
    _m.lookAt(_fwd, out.position, _up);
    out.quaternion.setFromRotationMatrix(_m);
    _q.setFromAxisAngle(new THREE.Vector3(1, 0.0, 0), -rotate);
    out.quaternion.multiply(_q);
    _q.setFromAxisAngle(new THREE.Vector3(0, 0.0, 1), bankRad);
    out.quaternion.multiply(_q);

    out.p = p;
    out.pitch = THREE.MathUtils.radToDeg(pitchRad + rotate);
    out.roll = THREE.MathUtils.radToDeg(bankRad);
    // Runway heading 033 at the start (an Ankara-area runway direction, illustrative).
    out.heading = (33 + THREE.MathUtils.radToDeg(Math.atan2(_t.x, -_t.z)) + 360) % 360;
    out.knots = interp(KT_KEYS, p);
    out.altFt = Math.min(8000, Math.max(0, (out.position.y - 0.32) * UNIT_M * 3.2808) + FIELD_FT);
    const tasAtAlt = out.knots * (1 + (out.altFt / 1000) * 0.02);
    out.mach = tasAtAlt / 661;
    out.g = 1 / Math.max(0.35, Math.cos(bankRad)) + Math.abs(rotate) * 2;
    out.afterburner = interp(AB_KEYS, p);
    out.gearDown = true; // the first flight was flown gear-down
    out.onGround = onGround;
    return out;
}

/** The shared state the scene writes every frame and the helmet display reads. */
export const flight: FlightState = createFlightState();
sampleFlight(0, flight);
