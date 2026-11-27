/**
 * One mutable store shared by the DOM layer and the 3D scene. Nothing here is React state:
 * writers mutate, readers poll inside their own rAF / useFrame. That keeps scroll and pointer
 * updates out of React's render path.
 */

export const SECTION_IDS = ["s01", "s02", "s03", "s04", "s05"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const MODES = ["airframe", "xray", "aero", "eoir"] as const;
export type Mode = (typeof MODES)[number];

/** The inspection mode each section opens in; the mode bar can override it until the section changes. */
export const SECTION_MODE: Mode[] = ["airframe", "xray", "eoir", "airframe", "airframe"];

export interface Anchor {
    /** Screen position in CSS px, relative to the viewport. */
    x: number;
    y: number;
    /** False when behind the camera or outside the viewport. */
    visible: boolean;
}

export interface TerminalState {
    /** 0..1 progress through the pinned 3D track (sections 01–04). */
    track: number;
    /** Smoothed scroll velocity, px per second (signed). */
    velocity: number;
    /** Index 0..4 of the section closest to the viewport centre. */
    section: number;
    /** Normalised pointer, −1..1. */
    px: number;
    py: number;
    /** Overlays visible ([ HUD ]). */
    telemetry: boolean;
    /** Inspection mode the scene sweeps to. */
    mode: Mode;
    /** Free orbit inspection: scroll is locked and the camera leaves the spline. */
    inspect: boolean;
    /** Procedural sound on. */
    sound: boolean;
    /** Measured frames per second of the main loop. */
    fps: number;
    /** Projected 3D anchors keyed by name, written by the scene each frame. */
    anchors: Record<string, Anchor>;
}

export const terminal: TerminalState = {
    track: 0,
    velocity: 0,
    section: 0,
    px: 0,
    py: 0,
    telemetry: true,
    mode: "airframe",
    inspect: false,
    sound: false,
    fps: 60,
    anchors: {},
};

type Listener = () => void;
const listeners = new Set<Listener>();

/** For the rare React consumer that must re-render (telemetry toggle, active section). */
export function subscribeTerminal(fn: Listener) {
    listeners.add(fn);
    return () => {
        listeners.delete(fn);
    };
}

export function notifyTerminal() {
    listeners.forEach((fn) => fn());
}

export function setTelemetry(on: boolean) {
    terminal.telemetry = on;
    document.documentElement.dataset.telemetry = on ? "on" : "off";
    notifyTerminal();
}

export function setMode(mode: Mode) {
    if (terminal.mode === mode) return;
    terminal.mode = mode;
    notifyTerminal();
}

export function setInspect(on: boolean) {
    if (terminal.inspect === on) return;
    terminal.inspect = on;
    notifyTerminal();
}
