"use client";

import { Suspense } from "react";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { Tier } from "@/hooks/useDeviceProfile";
import { COLOR } from "./shared";
import { KaanBlueprint, useKaanData } from "./KaanBlueprint";
import { CameraRig } from "./CameraRig";
import { Streamlines } from "./Streamlines";
import { ShockDiamonds } from "./ShockDiamonds";
import { MumT } from "./MumT";
import { Anchors } from "./Anchors";
import { Stats } from "./Stats";

const STATS = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("stats");

function Kaan({ tier, reduced }: { tier: Tier; reduced: boolean }) {
    const data = useKaanData(tier);
    const f = data.features;
    return (
        <>
            {/* CameraRig first: its frame callback computes the shared rig state everyone else reads. */}
            <CameraRig features={f} reduced={reduced} />
            <KaanBlueprint data={data} tier={tier} />
            <ShockDiamonds features={f} reduced={reduced} />
            <Streamlines features={f} tier={tier} reduced={reduced} />
            <Suspense fallback={null}>
                <MumT features={f} tier={tier} reduced={reduced} />
            </Suspense>
            <Anchors features={f} />
        </>
    );
}

/** Everything inside the Canvas. */
export function World({ tier, reduced }: { tier: Tier; reduced: boolean }) {
    return (
        <>
            <color attach="background" args={[COLOR.ink]} />
            {STATS && <Stats />}
            <Suspense fallback={null}>
                <Kaan tier={tier} reduced={reduced} />
            </Suspense>
            {tier === 3 && (
                <EffectComposer multisampling={0}>
                    <Bloom luminanceThreshold={0.55} luminanceSmoothing={0.2} intensity={0.55} mipmapBlur />
                    <Noise opacity={reduced ? 0 : 0.035} premultiply blendFunction={BlendFunction.SCREEN} />
                    <Vignette offset={0.3} darkness={0.65} />
                </EffectComposer>
            )}
        </>
    );
}

