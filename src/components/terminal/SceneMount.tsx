"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-ink" aria-hidden />,
});

/** Client-only mount for the WebGL scene. */
export function SceneMount() {
    return <Scene />;
}
