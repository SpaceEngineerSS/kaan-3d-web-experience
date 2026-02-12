"use client";

export function RadarLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cockpit-dark">
            <div className="relative h-40 w-40">
                {/* Radar grid circles */}
                {[1, 2, 3].map((ring) => (
                    <div
                        key={ring}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon-blue/20"
                        style={{
                            width: `${ring * 33}%`,
                            height: `${ring * 33}%`,
                        }}
                    />
                ))}

                {/* Crosshair lines */}
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-neon-blue/10" />
                <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-neon-blue/10" />

                {/* Sweep line */}
                <div
                    className="absolute left-1/2 top-1/2 h-1/2 w-px origin-top -translate-x-1/2"
                    style={{
                        background: "linear-gradient(to bottom, rgba(0, 212, 255, 0.8), transparent)",
                        animation: "radar-sweep 2s linear infinite",
                        transformOrigin: "top center",
                    }}
                />

                {/* Center dot */}
                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-blue animate-pulse-glow" />
            </div>

            <p
                className="mt-8 text-xs tracking-[0.3em] text-neon-blue/70"
                style={{ fontFamily: "var(--font-mono)" }}
            >
                LOADING SYSTEMS...
            </p>
        </div>
    );
}
