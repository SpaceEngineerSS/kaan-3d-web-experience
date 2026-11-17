"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";
import { useLanguage } from "@/context/LanguageContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { terminal } from "@/lib/terminal/state";

function hideAnchors() {
    for (const k of Object.keys(terminal.anchors)) terminal.anchors[k].visible = false;
}

const Stage = dynamic(() => import("./scene/Stage").then((m) => m.Stage), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-ink" aria-hidden />,
});

const POSTER_ALT = {
    tr: "KAAN, 2024 P0 uçuş testinde takip uçağından görünüm (görüntü: TUSAŞ)",
    en: "KAAN seen from the chase aircraft during 2024 P0 flight testing (footage: TUSAŞ)",
};

function Poster() {
    const { locale } = useLanguage();
    return (
        <div className="absolute inset-0 bg-ink">
            {/* eslint-disable-next-line @next/next/no-img-element -- static poster for devices without WebGL */}
            <img
                src="/media/clips/chase.jpg"
                alt={POSTER_ALT[locale]}
                className="absolute inset-0 h-full w-full object-cover opacity-50"
                style={{ filter: "grayscale(1) contrast(1.35) brightness(0.8)" }}
                decoding="async"
            />
        </div>
    );
}

/** True while #track intersects the viewport and the tab is visible. */
function useActive() {
    const [inView, setInView] = useState(true);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const onVis = () => setVisible(!document.hidden);
        onVis();
        document.addEventListener("visibilitychange", onVis);
        const track = document.getElementById("track");
        let io: IntersectionObserver | null = null;
        if (track) {
            io = new IntersectionObserver((entries) => setInView(entries[0]?.isIntersecting ?? true), { threshold: 0 });
            io.observe(track);
        }
        return () => {
            document.removeEventListener("visibilitychange", onVis);
            io?.disconnect();
        };
    }, []);

    const active = inView && visible;
    useEffect(() => {
        if (!active) hideAnchors();
    }, [active]);
    return active;
}

/**
 * The pinned 3D terminal scene: KAAN as a lidar point cloud, edge blueprint and X-ray shell with a
 * scan sweep revealing notional internals; vortex streamlines; shock diamonds; MUM-T formation.
 */
export function Scene() {
    const profile = useDeviceProfile();
    const active = useActive();

    if (!profile.ready) return <div className="absolute inset-0 bg-ink" aria-hidden />;
    if (profile.tier === 0) return <Poster />;

    return (
        <div className="absolute inset-0 bg-ink">
            <ErrorBoundary fallback={<Poster />}>
                <Stage profile={profile} active={active} />
            </ErrorBoundary>
        </div>
    );
}
