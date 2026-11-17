"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SceneControls } from "./SceneControls";
import type { CameraPreset } from "./KaanModel";

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
    ssr: false,
    loading: () => <div className="fixed inset-0 z-0 bg-ground" aria-hidden />,
});

/** The fixed 3D layer behind the opening chapters, plus its inspection controls. */
export function HomeScene({ endMarkerId = "scene-end" }: { endMarkerId?: string }) {
    const [xRay, setXRay] = useState(false);
    const [preset, setPreset] = useState<CameraPreset | null>(null);
    const [inView, setInView] = useState(true);

    useEffect(() => {
        const m = document.getElementById(endMarkerId);
        if (!m) return;
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting || e.boundingClientRect.top > 0));
        io.observe(m);
        return () => io.disconnect();
    }, [endMarkerId]);

    return (
        <>
            <HeroScene xRay={xRay} preset={preset} endMarkerId={endMarkerId} />
            <SceneControls visible={inView} xRay={xRay} onXRay={setXRay} preset={preset} onPreset={setPreset} />
        </>
    );
}
