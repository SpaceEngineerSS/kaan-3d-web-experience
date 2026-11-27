"use client";

import { Suspense } from "react";
import type { Tier } from "@/hooks/useDeviceProfile";
import { KaanBlueprint, useKaanData } from "./KaanBlueprint";
import { CameraRig } from "./CameraRig";
import { Streamlines } from "./Streamlines";
import { ShockDiamonds } from "./ShockDiamonds";
import { MumT } from "./MumT";
import { Anchors } from "./Anchors";
import { Stats } from "./Stats";
import { KaanAirframe } from "./KaanAirframe";
import { Floor } from "./Floor";
import { Inspect } from "./Inspect";

const STATS = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("stats");

function Kaan({ tier, reduced }: { tier: Tier; reduced: boolean }) {
    const data = useKaanData(tier);
    const f = data.features;
    return (
        <>
            {/* CameraRig first: its frame callback computes the shared rig state everyone else reads. */}
            <CameraRig features={f} reduced={reduced} />
            <KaanAirframe surface={data.surface} features={f} tier={tier} />
            <Floor features={f} tier={tier} />
            <KaanBlueprint data={data} tier={tier} />
            <ShockDiamonds features={f} reduced={reduced} />
            <Streamlines features={f} tier={tier} reduced={reduced} />
            <Suspense fallback={null}>
                <MumT features={f} tier={tier} reduced={reduced} />
            </Suspense>
            <Anchors features={f} />
            <Inspect features={f} />
        </>
    );
}

/** Everything inside the Canvas. */
export function World({ tier, reduced }: { tier: Tier; reduced: boolean }) {
    return (
        <>
            {STATS && <Stats />}
            <Suspense fallback={null}>
                <Kaan tier={tier} reduced={reduced} />
            </Suspense>
        </>
    );
}

