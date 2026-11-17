/**
 * Deterministic flight state for the simulated displays. Everything is a smooth function of time:
 * cruise at about FL240 in a gentle weave, a hostile pair on a racetrack ahead, a wingman, an unknown crossing.
 * Values are plausible for a twin-engine fighter in cruise; none of them are KAAN data.
 */

import type { Affiliation } from "./draw";

export interface Track {
    id: string;
    kind: Affiliation;
    /** Nautical miles east and north of ownship. */
    x: number;
    y: number;
    /** True heading, degrees. */
    hdg: number;
    /** Feet. */
    alt: number;
    mach: number;
}

export interface Engine {
    rpm: number;
    ftit: number;
    noz: number;
    oil: number;
    ff: number;
}

export interface Tank {
    id: string;
    kg: number;
    cap: number;
}

export interface Sim {
    t: number;
    hdg: number;
    roll: number;
    pitch: number;
    aoa: number;
    g: number;
    alt: number;
    vs: number;
    kcas: number;
    tas: number;
    mach: number;
    eng: [Engine, Engine];
    fuelKg: number;
    bingoKg: number;
    /** Total fuel flow, kg per second. */
    burnKgS: number;
    tanks: Tank[];
    tracks: Track[];
    /** Seconds of day, local. */
    clock: number;
    surfaces: {
        lefL: number;
        lefR: number;
        flapL: number;
        flapR: number;
        stabL: number;
        stabR: number;
        rudL: number;
        rudR: number;
    };
}

/** Ground features, nautical miles east/north of ownship. */
export const BULLSEYE = { x: 22, y: -14 };
export const ROUTE = [
    { n: 2, x: -12, y: -9 },
    { n: 3, x: 25.4, y: 11.8 },
    { n: 4, x: 52, y: 30 },
    { n: 5, x: 64, y: 62 },
];
export const ACTIVE_STPT = 3;
export const THREAT = { x: 46, y: -12, r: 14, label: "SAM" };

const D2R = Math.PI / 180;
const W = 0.05; // weave, rad/s

function engine(t: number, phase: number): Engine {
    const rpm = 88.4 + 0.6 * Math.sin(t * 0.11) + 0.25 * Math.sin(t * 0.07 + phase);
    const ftit = 470 + (rpm - 70) * 18 + 3 * Math.sin(t * 0.05 + phase);
    const noz = Math.max(0, (95 - rpm) * 1.4);
    const oil = 38 + (rpm - 70) * 0.35;
    const ff = 600 + (rpm - 70) ** 2 * 9.5;
    return { rpm, ftit, noz, oil, ff };
}

function headingOf(dx: number, dy: number) {
    return ((Math.atan2(dx, dy) / D2R) + 360) % 360;
}

export function simulate(t: number): Sim {
    const hdg = 65 + 6 * Math.sin(W * t);
    const roll = 7.6 * Math.cos(W * t);
    const alt = 24000 + 250 * Math.sin(t * 0.03);
    const vs = 250 * 0.03 * 60 * Math.cos(t * 0.03);
    const kcas = 330 + 4 * Math.sin(t * 0.045);

    const T = 288.15 - 0.0019812 * alt;
    const sigma = (T / 288.15) ** 4.2559;
    const tas = kcas / Math.sqrt(sigma);
    const mach = tas / (661.47 * Math.sqrt(T / 288.15));

    const aoa = 3.5 + 0.3 * Math.sin(t * 0.045 + 1);
    const gamma = Math.atan(vs / (tas * 101.27)) / D2R;
    const pitch = aoa * Math.cos(roll * D2R) + gamma;
    const g = 1 / Math.cos(roll * D2R);

    const eng: [Engine, Engine] = [engine(t, 0), engine(t, 2.1)];
    const ffPph = eng[0].ff + eng[1].ff;
    const burnKgS = ffPph / 2.20462 / 3600;

    // A 20-minute cycle so the totals keep moving without running dry.
    const fuelKg = 7600 - burnKgS * (t % 1200);
    const feed = 1100;
    const rest = fuelKg - feed;
    const tanks: Tank[] = [
        { id: "F1", kg: rest * 0.3, cap: 2200 },
        { id: "FEED", kg: feed, cap: 1100 },
        { id: "A1", kg: rest * 0.3, cap: 2200 },
        { id: "WL", kg: rest * 0.2, cap: 1500 },
        { id: "WR", kg: rest * 0.2, cap: 1500 },
    ];

    // Hostile pair on a racetrack about 46 nm out, bearing 075.
    const cx = 44.4;
    const cy = 11.9;
    const rot = 20 * D2R;
    const om = (2 * Math.PI) / 300;
    const orbit = (ph: number) => {
        const a = om * t + ph;
        const ex = 8 * Math.cos(a);
        const ey = 3 * Math.sin(a);
        const dx = -8 * Math.sin(a);
        const dy = 3 * Math.cos(a);
        return {
            x: cx + ex * Math.cos(rot) - ey * Math.sin(rot),
            y: cy + ex * Math.sin(rot) + ey * Math.cos(rot),
            hdg: headingOf(dx * Math.cos(rot) - dy * Math.sin(rot), dx * Math.sin(rot) + dy * Math.cos(rot)),
        };
    };
    const h1 = orbit(0);
    // Wingman of the pair: 5 nm in trail and 2 nm abeam of the lead, same heading.
    const lh = h1.hdg * D2R;
    const h2 = {
        x: h1.x - 5 * Math.sin(lh) + 2 * Math.cos(lh),
        y: h1.y - 5 * Math.cos(lh) - 2 * Math.sin(lh),
        hdg: h1.hdg,
    };

    // Wingman 1.5 nm left, 1 nm aft.
    const hr = hdg * D2R;
    const wl = -1.5 + 0.1 * Math.sin(t * 0.2);
    const wa = -1 + 0.15 * Math.sin(t * 0.13);
    const wing = { x: wl * Math.cos(hr) + wa * Math.sin(hr), y: -wl * Math.sin(hr) + wa * Math.cos(hr) };

    // Unknown crossing east to west at about 360 kt, wrapping far outside the display.
    const ux = 140 - ((t * 0.1) % 280);

    const tracks: Track[] = [
        { id: "W", kind: "friend", x: wing.x, y: wing.y, hdg, alt: alt + 500, mach },
        { id: "H1", kind: "hostile", ...h1, alt: 31000, mach: 0.85 },
        { id: "H2", kind: "hostile", ...h2, alt: 30000, mach: 0.85 },
        { id: "U", kind: "unknown", x: ux, y: 30, hdg: 270, alt: 35000, mach: 0.78 },
    ];

    const da = -3 * Math.sin(W * t);
    const surfaces = {
        lefL: 2 + aoa * 0.2,
        lefR: 2 + aoa * 0.2,
        flapL: da,
        flapR: -da,
        stabL: -1.8 + 0.4 * Math.sin(t * 0.07) + 0.5 * da,
        stabR: -1.8 + 0.4 * Math.sin(t * 0.07) - 0.5 * da,
        rudL: 0.3 * Math.sin(t * 0.09),
        rudR: 0.3 * Math.sin(t * 0.09),
    };

    return {
        t,
        hdg,
        roll,
        pitch,
        aoa,
        g,
        alt,
        vs,
        kcas,
        tas,
        mach,
        eng,
        fuelKg,
        bingoKg: 2400,
        burnKgS,
        tanks,
        tracks,
        clock: 10 * 3600 + 24 * 60 + t,
        surfaces,
    };
}

/** Relative position (nm east/north of ownship) to heading-up components: right of nose, ahead. */
export function toBody(x: number, y: number, hdg: number) {
    const h = hdg * D2R;
    return { right: x * Math.cos(h) - y * Math.sin(h), ahead: x * Math.sin(h) + y * Math.cos(h) };
}

/** Bearing (degrees true) and range (nm) from point a to point b. */
export function bearingRange(ax: number, ay: number, bx: number, by: number) {
    const dx = bx - ax;
    const dy = by - ay;
    return { brg: headingOf(dx, dy), rng: Math.hypot(dx, dy) };
}
