"use client";

import { Canvas } from "@react-three/fiber";
import type { DeviceProfile } from "@/hooks/useDeviceProfile";
import { World } from "./World";

/** The WebGL canvas. Loaded only for tiers 1–3. */
export function Stage({ profile, active }: { profile: DeviceProfile; active: boolean }) {
    return (
        <Canvas
            frameloop={active ? "always" : "never"}
            dpr={profile.dpr}
            flat
            camera={{ position: [2.35, 0.78, 2.55], fov: 38, near: 0.01, far: 200 }}
            gl={{
                antialias: profile.antialias,
                // Transparent: the section's monument word is drawn underneath the aircraft.
                alpha: true,
                logarithmicDepthBuffer: true,
                powerPreference: "high-performance",
                stencil: false,
            }}
            onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
            }}
            style={{ position: "absolute", inset: 0 }}
            aria-hidden
        >
            <World tier={profile.tier} reduced={profile.reducedMotion} />
        </Canvas>
    );
}
