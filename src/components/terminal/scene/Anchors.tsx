"use client";
/* eslint-disable react-hooks/immutability -- the shared terminal store is mutated in the render loop by design. */

import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { terminal, type Anchor } from "@/lib/terminal/state";
import type { KaanFeatures } from "./shared";
import { rig } from "./rig";

export const ANCHOR_NAMES = ["radar", "irst", "eots", "canopy", "intake", "bay", "lerx", "finTip", "nozzles", "wingTip", "kaanNode", "anka1", "anka2", "kizilelma"] as const;

/** MUM-T anchors only exist while the section 04 formation is on screen. */
const MUMT = new Set(["kaanNode", "anka1", "anka2", "kizilelma"]);

/** Hide every anchor (used when the loop pauses). */
export function hideAnchors() {
    for (const k of Object.keys(terminal.anchors)) terminal.anchors[k].visible = false;
}

/** Projects the named anchor points to viewport CSS px every frame into `terminal.anchors`. */
export function Anchors({ features }: { features: KaanFeatures }) {
    const entries = useMemo(() => {
        const f = features;
        const src: Record<(typeof ANCHOR_NAMES)[number], THREE.Vector3> = {
            radar: f.radar,
            irst: f.irst,
            eots: f.eots,
            canopy: f.canopy,
            intake: f.intake,
            bay: f.bay,
            lerx: f.lerx,
            finTip: f.finTip,
            nozzles: f.nozzles,
            wingTip: f.wingTip,
            kaanNode: f.kaanNode,
            anka1: rig.anka1,
            anka2: rig.anka2,
            kizilelma: rig.kizilelma,
        };
        return ANCHOR_NAMES.map((name) => {
            let out: Anchor | undefined = terminal.anchors[name];
            if (!out) {
                out = { x: 0, y: 0, visible: false };
                terminal.anchors[name] = out;
            }
            return { name, world: src[name], out, mumt: MUMT.has(name) };
        });
    }, [features]);

    useEffect(() => () => hideAnchors(), []);

    const v = useMemo(() => new THREE.Vector3(), []);

    useFrame((state) => {
        const cam = state.camera;
        const rect = state.gl.domElement.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const mumtOn = rig.w[3] > 0.5;
        for (let i = 0; i < entries.length; i++) {
            const e = entries[i];
            v.copy(e.world).project(cam);
            const x = rect.left + (v.x * 0.5 + 0.5) * w;
            const y = rect.top + (-v.y * 0.5 + 0.5) * h;
            e.out.x = x;
            e.out.y = y;
            const inFront = v.z > -1 && v.z < 1;
            const onScreen = x >= rect.left && x <= rect.left + w && y >= rect.top && y <= rect.top + h;
            e.out.visible = inFront && onScreen && (!e.mumt || mumtOn);
        }
    });

    return null;
}
