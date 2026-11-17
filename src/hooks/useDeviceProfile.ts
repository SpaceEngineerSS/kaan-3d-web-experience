"use client";

import { useSyncExternalStore } from "react";

/**
 * Device tiers
 *  0 — no WebGL, data saver, or a very weak device: static poster, no 3D
 *  1 — phone / low memory: 3D at DPR 1, no antialias, fewest lights
 *  2 — mid: DPR up to 1.5
 *  3 — desktop-class: DPR up to 2, full lighting
 * Resolved once on the client before any Canvas mounts; never changes GL settings mid-life.
 */
export type Tier = 0 | 1 | 2 | 3;

export interface DeviceProfile {
    ready: boolean;
    tier: Tier;
    isMobile: boolean;
    reducedMotion: boolean;
    dpr: [number, number];
    antialias: boolean;
    shadows: boolean;
    starCount: number;
}

const SERVER: DeviceProfile = {
    ready: false,
    tier: 2,
    isMobile: false,
    reducedMotion: false,
    dpr: [1, 1.5],
    antialias: false,
    shadows: false,
    starCount: 0,
};

let cached: DeviceProfile | null = null;
let pending = false;
const listeners = new Set<() => void>();

function hasWebGL(): { ok: boolean; renderer: string } {
    try {
        const canvas = document.createElement("canvas");
        const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
        if (!gl) return { ok: false, renderer: "" };
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return { ok: true, renderer: renderer.toLowerCase() };
    } catch {
        return { ok: false, renderer: "" };
    }
}

function compute(): DeviceProfile {
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const mem = nav.deviceMemory ?? 4;
    const cores = nav.hardwareConcurrency ?? 4;
    const saveData = Boolean(nav.connection?.saveData);
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.innerWidth < 768;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = coarse || narrow;

    const { ok, renderer } = hasWebGL();
    const software = /swiftshader|llvmpipe|software|basic render/.test(renderer);
    const weakGpu = /mali-4|mali-t|adreno \(tm\) [2-5]\d\d|powervr sgx|intel\(r\) hd graphics [2-5]\d{2,3}\b/.test(renderer);

    let tier: Tier;
    if (!ok || software || saveData || mem <= 1) tier = 0;
    else if (isMobile && (mem <= 3 || cores <= 4 || weakGpu)) tier = 1;
    else if (isMobile || weakGpu || mem <= 4) tier = 2;
    else tier = 3;

    const dprCap = Math.min(window.devicePixelRatio || 1, tier === 3 ? 2 : tier === 2 ? 1.5 : 1);

    return {
        ready: true,
        tier,
        isMobile,
        reducedMotion,
        dpr: [1, dprCap],
        antialias: tier === 3,
        shadows: tier === 3,
        starCount: tier === 3 ? 1200 : tier === 2 ? 500 : 250,
    };
}

function subscribe(cb: () => void) {
    listeners.add(cb);
    if (!cached && !pending) {
        pending = true;
        // Defer the probe so it never blocks first paint.
        const run = () => {
            cached = compute();
            listeners.forEach((fn) => fn());
        };
        if ("requestIdleCallback" in window) (window as Window & { requestIdleCallback: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback(run, { timeout: 600 });
        else setTimeout(run, 0);
    }
    return () => {
        listeners.delete(cb);
    };
}

export function useDeviceProfile(): DeviceProfile {
    return useSyncExternalStore(
        subscribe,
        () => cached ?? SERVER,
        () => SERVER
    );
}

/** Narrow-viewport check for layout only (not for GL settings). */
export function useIsNarrow(breakpoint = 768): boolean {
    return useSyncExternalStore(
        (cb) => {
            const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
            mq.addEventListener("change", cb);
            return () => mq.removeEventListener("change", cb);
        },
        () => window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches,
        () => false
    );
}
