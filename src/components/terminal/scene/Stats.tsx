"use client";
/* eslint-disable react-hooks/immutability -- the renderer's info counters are mutated by design. */

import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export interface KaanStats {
    calls: number;
    triangles: number;
    points: number;
    lines: number;
    geometries: number;
    textures: number;
    programs: number;
}

declare global {
    interface Window {
        __kaanStats?: KaanStats;
    }
}

/**
 * Exposes renderer counters on window.__kaanStats for scripts/capture.mjs. Mounted only when the
 * page URL carries ?stats, so production visitors never pay for it. Counters are read after the
 * last render of the previous frame (priority -1000 runs first), before three resets them.
 */
export function Stats() {
    const gl = useThree((s) => s.gl);

    useEffect(() => {
        const prev = gl.info.autoReset;
        gl.info.autoReset = false;
        window.__kaanStats = { calls: 0, triangles: 0, points: 0, lines: 0, geometries: 0, textures: 0, programs: 0 };
        return () => {
            gl.info.autoReset = prev;
            delete window.__kaanStats;
        };
    }, [gl]);

    useFrame(() => {
        const s = window.__kaanStats;
        if (!s) return;
        const i = gl.info;
        s.calls = i.render.calls;
        s.triangles = i.render.triangles;
        s.points = i.render.points;
        s.lines = i.render.lines;
        s.geometries = i.memory.geometries;
        s.textures = i.memory.textures;
        s.programs = i.programs?.length ?? 0;
        i.reset();
    }, -1000);

    return null;
}
