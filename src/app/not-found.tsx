import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-stealth-black px-6 text-center">
            {/* Scanline overlay */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div
                    className="absolute left-0 h-px w-full animate-scan-slow bg-neon-blue/10"
                    style={{ top: "30%" }}
                />
            </div>

            {/* Grid background */}
            <div
                className="pointer-events-none fixed inset-0 z-0 opacity-30"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative z-10">
                {/* Status code */}
                <div className="mb-6 flex items-center justify-center gap-4">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-500/50" />
                    <span
                        className="text-xs tracking-[0.5em] text-red-400/70 uppercase"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        TARGET NOT FOUND
                    </span>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-500/50" />
                </div>

                {/* 404 */}
                <h1 className="mb-2 text-8xl font-bold tracking-wider text-white md:text-9xl">
                    <span className="text-gradient">4</span>
                    <span className="mx-2 inline-block animate-pulse text-red-500">0</span>
                    <span className="text-gradient">4</span>
                </h1>

                {/* Warning box */}
                <div className="mx-auto mb-8 max-w-md rounded-lg border border-red-500/20 bg-red-500/5 px-6 py-4">
                    <p
                        className="text-xs leading-relaxed tracking-[0.1em] text-red-400/80"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        RADAR CONTACT LOST — REQUESTED SECTOR DOES NOT EXIST IN MISSION DATABASE
                    </p>
                </div>

                {/* HUD-style data readout */}
                <div
                    className="mx-auto mb-10 max-w-sm space-y-1 text-left"
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    <div className="flex justify-between text-[10px] text-titanium-light/40">
                        <span>STATUS</span>
                        <span className="text-red-400">OFFLINE</span>
                    </div>
                    <div className="h-px w-full bg-titanium/20" />
                    <div className="flex justify-between text-[10px] text-titanium-light/40">
                        <span>VECTOR</span>
                        <span>---°</span>
                    </div>
                    <div className="h-px w-full bg-titanium/20" />
                    <div className="flex justify-between text-[10px] text-titanium-light/40">
                        <span>IFF</span>
                        <span className="text-neon-blue">FRIENDLY</span>
                    </div>
                </div>

                {/* Return button */}
                <Link
                    href="/"
                    className="group inline-flex items-center gap-3 rounded border border-neon-blue/30 bg-neon-blue/5 px-8 py-3 text-sm font-medium tracking-[0.2em] text-neon-blue uppercase transition-all hover:border-neon-blue/60 hover:bg-neon-blue/10 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)]"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="transition-transform group-hover:-translate-x-1"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    RETURN TO BASE
                </Link>

                {/* Bottom identifier */}
                <p
                    className="mt-12 text-[9px] tracking-[0.3em] text-titanium-light/20 uppercase"
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    KAAN TACTICAL DISPLAY SYSTEM v2.0
                </p>
            </div>
        </div>
    );
}
