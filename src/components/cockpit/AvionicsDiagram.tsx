"use client";

import { useState, type KeyboardEvent } from "react";
import type { CockpitCopy } from "@/content/cockpit";

interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
    /** Orthogonal route from this box to the IMA core. */
    route: [number, number][];
}

const BW = 150;
const BH = 56;

/** Layout in a 960 × 500 drawing. Sensors on top, comms left, flight control right, pilot interface below. */
const LAYOUT: Record<string, Box> = {
    ima: { x: 330, y: 210, w: 300, h: 90, route: [] },
    radar: { x: 45, y: 40, w: BW, h: BH, route: [[120, 96], [120, 150], [380, 150], [380, 210]] },
    ew: { x: 225, y: 40, w: BW, h: BH, route: [[300, 96], [300, 130], [430, 130], [430, 210]] },
    irst: { x: 405, y: 40, w: BW, h: BH, route: [[480, 96], [480, 210]] },
    das: { x: 585, y: 40, w: BW, h: BH, route: [[660, 96], [660, 130], [530, 130], [530, 210]] },
    eots: { x: 765, y: 40, w: BW, h: BH, route: [[840, 96], [840, 150], [580, 150], [580, 210]] },
    link: { x: 45, y: 176, w: BW, h: BH, route: [[195, 204], [262, 204], [262, 232], [330, 232]] },
    cni: { x: 45, y: 278, w: BW, h: BH, route: [[195, 306], [262, 306], [262, 278], [330, 278]] },
    fcs: { x: 765, y: 227, w: BW, h: BH, route: [[630, 255], [765, 255]] },
    wad: { x: 255, y: 420, w: BW, h: BH, route: [[330, 420], [330, 360], [430, 360], [430, 300]] },
    hmd: { x: 555, y: 420, w: BW, h: BH, route: [[630, 420], [630, 360], [530, 360], [530, 300]] },
};

export function AvionicsDiagram({ copy }: { copy: CockpitCopy }) {
    const [activeId, setActiveId] = useState("ima");
    const active = copy.nodes.find((n) => n.id === activeId) ?? copy.nodes[0];

    const onKey = (e: KeyboardEvent<SVGGElement>, id: string) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setActiveId(id);
        }
    };

    const words = copy.statusWords;
    const links = copy.nodes.filter((n) => n.id !== "ima" && n.id !== activeId);
    if (activeId !== "ima") links.push(active);

    return (
        <div>
            {/* Drawing: wide screens only, where its text stays at full size. */}
            <svg
                viewBox="0 0 960 500"
                className="hidden w-full border border-line bg-ground-2 lg:block"
                role="group"
                aria-label={copy.avionicsTitle}
                fontFamily="var(--font-mono)"
            >
                <defs>
                    <pattern id="av-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--color-line)" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="960" height="500" fill="url(#av-grid)" opacity="0.5" />

                {/* Links, active one drawn last so it sits on top. */}
                {links.map((n) => {
                        const on = n.id === activeId;
                        return (
                            <polyline
                                key={`l-${n.id}`}
                                points={LAYOUT[n.id].route.map((p) => p.join(",")).join(" ")}
                                fill="none"
                                stroke={on ? "var(--color-signal)" : "var(--color-line-strong)"}
                                strokeWidth={on ? 1.5 : 1}
                                className="transition-[stroke] duration-200"
                            />
                        );
                    })}

                {copy.nodes.map((n) => {
                    const b = LAYOUT[n.id];
                    const on = n.id === activeId;
                    const core = n.id === "ima";
                    // Announced systems are drawn solid; planned or reported ones dashed.
                    const firm = n.status === "confirmed";
                    return (
                        <g
                            key={n.id}
                            role="button"
                            tabIndex={0}
                            aria-pressed={on}
                            aria-label={`${n.name}, ${words[n.status]}`}
                            onMouseEnter={() => setActiveId(n.id)}
                            onFocus={() => setActiveId(n.id)}
                            onClick={() => setActiveId(n.id)}
                            onKeyDown={(e) => onKey(e, n.id)}
                            className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[var(--color-signal)]"
                        >
                            <rect
                                x={b.x + 0.5}
                                y={b.y + 0.5}
                                width={b.w}
                                height={b.h}
                                fill={on ? "var(--color-signal-soft)" : "var(--color-surface)"}
                                stroke={on ? "var(--color-signal)" : core ? "var(--color-fg-2)" : "var(--color-airframe)"}
                                strokeWidth={on || core ? 1.5 : 1}
                                strokeDasharray={firm || core ? undefined : "5 4"}
                                className="transition-[fill,stroke] duration-200"
                            />
                            <text x={b.x + 14} y={b.y + (core ? 36 : 25)} fill="var(--color-fg)" fontSize={core ? 18 : 14} fontWeight={500}>
                                {n.short}
                            </text>
                            <text x={b.x + 14} y={b.y + (core ? 62 : 44)} fill="var(--color-muted)" fontSize="12">
                                {core ? n.name : words[n.status]}
                            </text>
                        </g>
                    );
                })}

                {/* Legend */}
                <g fontSize="12" fill="var(--color-muted)">
                    <rect x="765" y="400" width="18" height="12" fill="none" stroke="var(--color-airframe)" />
                    <text x="792" y="410">{words.confirmed}</text>
                    <rect x="765" y="424" width="18" height="12" fill="none" stroke="var(--color-airframe)" strokeDasharray="5 4" />
                    <text x="792" y="434">
                        {words.reported} / {words.planned}
                    </text>
                </g>
            </svg>

            {/* Narrow screens: the same nodes as a list of toggles. */}
            <div className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:hidden" role="group" aria-label={copy.avionicsTitle}>
                {copy.nodes.map((n) => {
                    const on = n.id === activeId;
                    return (
                        <button
                            key={n.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setActiveId(n.id)}
                            className={`flex min-h-14 flex-col items-start justify-center gap-0.5 px-3 py-2 text-left transition-colors ${on ? "bg-surface-2 text-signal" : "bg-ground-2 text-fg hover:bg-surface"}`}
                        >
                            <span className="t-data text-sm">{n.short}</span>
                            <span className="t-label normal-case">{words[n.status]}</span>
                        </button>
                    );
                })}
            </div>

            {/* Description panel */}
            <div className="mt-6 grid gap-6 border-t border-line-strong pt-6 md:grid-cols-12 md:gap-8" aria-live="polite">
                <div className="md:col-span-4 lg:col-span-3">
                    <h4 className="t-h3 text-fg">{active.name}</h4>
                    <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                        <dt className="t-label">{copy.makerLabel}</dt>
                        <dd className="text-[0.8125rem] text-fg-2">{active.maker}</dd>
                        <dt className="t-label">{copy.statusLabel}</dt>
                        <dd className="text-[0.8125rem] text-fg-2">{words[active.status]}</dd>
                    </dl>
                </div>
                <p className="t-body max-w-[62ch] md:col-span-8 lg:col-span-6">{active.body}</p>
            </div>
        </div>
    );
}
