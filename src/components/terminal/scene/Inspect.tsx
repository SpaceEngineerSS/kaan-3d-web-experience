"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { subscribeTerminal, terminal } from "@/lib/terminal/state";
import type { KaanFeatures } from "./shared";
import { rig } from "./rig";

/**
 * Free orbit around KAAN. On entry the orbit pivot starts where the spline camera was looking and
 * glides to the airframe's centre, so there is no jump; CameraRig blends back to the spline on exit.
 */
export function Inspect({ features }: { features: KaanFeatures }) {
    const on = useSyncExternalStore(subscribeTerminal, () => terminal.inspect, () => false);
    const controls = useRef<OrbitControlsImpl>(null);
    const centre = useRef(new THREE.Vector3());

    useEffect(() => {
        features.box.getCenter(centre.current);
    }, [features]);

    useEffect(() => {
        const c = controls.current;
        if (on && c) {
            c.target.copy(rig.look);
            c.update();
        }
    }, [on]);

    useFrame((_, delta) => {
        const c = controls.current;
        if (!on || !c) return;
        const k = 1 - Math.exp(-3 * Math.min(delta, 0.1));
        c.target.lerp(centre.current, k);
    });

    const L = features.L;
    return (
        <OrbitControls
            ref={controls}
            enabled={on}
            enableDamping
            dampingFactor={0.08}
            enablePan={false}
            minDistance={0.9 * L}
            maxDistance={3.2 * L}
            rotateSpeed={0.6}
            zoomSpeed={0.6}
        />
    );
}
