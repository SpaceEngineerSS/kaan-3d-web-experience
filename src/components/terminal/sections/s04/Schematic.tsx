"use client";

import type { ProfileId } from "@/content/terminal";

const LINE = "rgba(236,239,244,0.85)";
const DIM = "rgba(236,239,244,0.22)";
const MONO = { fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.12em" } as const;

/** Schematic altitude-over-mission-phase lines (x = phase, y = height above the ground line). */
const PROFILES: Record<ProfileId, string> = {
    kaan: "20,120 55,56 90,42 165,42 236,42 300,70 340,120",
    anka: "20,120 55,72 90,62 165,62 232,94 276,86 340,120",
    kizilelma: "20,120 55,82 90,74 165,74 244,100 290,96 340,120",
};
const PHASE_X = [20, 90, 165, 250, 340];

export function Schematic({ active, phases, ring }: { active: ProfileId; phases: string[]; ring: string }) {
    return (
        <svg viewBox="0 0 360 150" className="w-full" fill="none" strokeWidth={1} aria-hidden>
            <path d="M8 120.5H352" stroke={DIM} />
            {PHASE_X.map((x, i) => (
                <g key={x}>
                    <path d={`M${x} 120V125`} stroke={DIM} />
                    <text x={x} y={137} fill="var(--color-muted)" textAnchor={i === 0 ? "start" : i === PHASE_X.length - 1 ? "end" : "middle"} style={MONO}>
                        {phases[i]}
                    </text>
                </g>
            ))}
            {/* notional defence ring */}
            <path d="M184 120A56 56 0 0 1 296 120" stroke="var(--color-burn)" strokeOpacity={0.55} strokeDasharray="3 4" />
            <text x={240} y={58} fill="var(--color-muted)" textAnchor="middle" style={MONO}>
                {ring}
            </text>
            {/* data link at the push phase */}
            <path d="M165 42V62M165 62V74" stroke={DIM} strokeDasharray="1 3" />
            {(Object.keys(PROFILES) as ProfileId[]).map((id) => (
                <polyline
                    key={id}
                    points={PROFILES[id]}
                    stroke={id === active ? LINE : DIM}
                    strokeDasharray={id === "kizilelma" ? "5 4" : undefined}
                />
            ))}
            {(Object.keys(PROFILES) as ProfileId[]).map((id) => {
                const [x, y] = PROFILES[id].split(" ")[3].split(",").map(Number);
                return (
                    <text key={id} x={x + 4} y={y - 4} fill={id === active ? "var(--color-fg)" : "var(--color-faint)"} style={MONO}>
                        {id === "kaan" ? "KAAN" : id === "anka" ? "ANKA-3" : "KIZILELMA"}
                    </text>
                );
            })}
        </svg>
    );
}

/** 04 // MUM-T & UAV network: overhead view; nodes open a mission-profile schematic. */
