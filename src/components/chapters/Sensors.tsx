"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { sensors, sensorsCopy, type Sensor } from "@/content/sensors";

export function Sensors() {
    const { locale } = useLanguage();
    const c = sensorsCopy[locale];
    const [id, setId] = useState(sensors[0].id);
    const active = sensors.find((s) => s.id === id) ?? sensors[0];

    return (
        <Chapter id="sensors" index={5} label={c.label} title={c.title} lede={c.lede} solid>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-4" data-reveal>
                    <p className="t-label" id="sensors-list-label">
                        {c.listLabel}
                    </p>
                    <div role="group" aria-labelledby="sensors-list-label">
                    <ul className="mt-3 border-t border-edge">
                        {sensors.map((s, i) => {
                            const on = s.id === active.id;
                            return (
                                <li key={s.id} className="border-b border-edge">
                                    <button
                                        type="button"
                                        aria-pressed={on}
                                        onClick={() => setId(s.id)}
                                        className={`grid min-h-[44px] w-full grid-cols-[2.25rem_1fr] items-baseline gap-x-2 py-3 text-left transition-colors ${on ? "text-hmd" : "text-fg-2 hover:text-fg"}`}
                                    >
                                        <span className="t-data text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                                        <span>
                                            <span className="block font-display text-xl font-semibold uppercase leading-tight tracking-wide">{s.name}</span>
                                            <span className={`t-label block ${on ? "text-hmd/80" : ""}`}>{s.kind[locale]}</span>
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <figure data-reveal>
                        <SensorDrawing active={active} where={active.where[locale]} plan={c.plan} side={c.side} notional={c.notional} />
                        <figcaption className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{c.coverageNote}</figcaption>
                    </figure>

                    <div className="mt-8 grid gap-6 border-t border-edge pt-6 md:grid-cols-12" aria-live="polite">
                        <div className="md:col-span-5">
                            <p className="t-num text-[clamp(2.25rem,1.6rem+2.4vw,3.75rem)] text-fg">{active.name}</p>
                            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.9375rem]">
                                <dt className="t-label self-center">{c.maker}</dt>
                                <dd className="text-fg-2">ASELSAN</dd>
                                <dt className="t-label self-center">{c.position}</dt>
                                <dd className="text-fg-2">{active.where[locale]}</dd>
                            </dl>
                        </div>
                        <div className="md:col-span-7">
                            <p className="t-label text-hmd">{active.kind[locale]}</p>
                            <p className="t-body mt-3 max-w-[56ch]">{active.body[locale]}</p>
                            {active.mount === "distributed" && <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{c.distributedNote}</p>}
                        </div>
                    </div>
                </div>
            </div>
            <SourceNote>{c.source}</SourceNote>
        </Chapter>
    );
}

/* ── Drawing ─────────────────────────────────────────────────────────────── */

const W = 760;
const H = 400;
/** Plan view: nose up, 14 px per metre (20.3 m × 13.4 m). */
const PX = 185;
const P_NOSE = 60;
/** Right half of the plan outline as [x offset, y]; mirrored for the left half. Simplified, not traced. */
const PLAN_HALF: [number, number][] = [
    [0, P_NOSE],
    [6, 84],
    [12, 112],
    [18, 140],
    [24, 168],
    [26, 196],
    [94, 280],
    [94, 294],
    [36, 290],
    [38, 306],
    [78, 336],
    [78, 346],
    [30, 342],
    [18, 350],
    [0, 350],
];
const planPath = (() => {
    const right = PLAN_HALF.map(([x, y]) => `${PX + x},${y}`);
    const left = [...PLAN_HALF].reverse().map(([x, y]) => `${PX - x},${y}`);
    return `M ${[...right, ...left].join(" L ")} Z`;
})();

/** Side view: nose right, same scale. */
const SIDE_OUTLINE =
    "M 714,232 L 690,226 L 664,220 L 650,218 L 600,215 L 560,216 L 500,218 L 492,218 L 462,180 L 446,180 L 452,219 L 432,222 L 430,236 L 452,244 L 560,250 L 620,248 L 660,242 L 700,236 Z";

/** Marker positions per mount: [plan x, plan y], [side x, side y]. */
const MOUNTS: Record<Exclude<Sensor["mount"], "distributed">, { plan: [number, number]; side: [number, number] }> = {
    nose: { plan: [PX, 72], side: [706, 231] },
    aheadCanopy: { plan: [PX, 102], side: [657, 216] },
    underNose: { plan: [PX, 94], side: [676, 243] },
};

/** Sphere centres for distributed systems. */
const PLAN_C: [number, number] = [PX, 210];
const SIDE_C: [number, number] = [572, 224];
const R_SPHERE = 160;
const R_SECTOR = 320;

/** SVG angles: 0° = +x, positive clockwise (y down). */
function sector(cx: number, cy: number, r: number, a0: number, a1: number) {
    const p = (a: number) => {
        const t = (a * Math.PI) / 180;
        return `${(cx + r * Math.cos(t)).toFixed(1)},${(cy + r * Math.sin(t)).toFixed(1)}`;
    };
    const large = a1 - a0 > 180 ? 1 : 0;
    return `M ${cx},${cy} L ${p(a0)} A ${r} ${r} 0 ${large} 1 ${p(a1)} Z`;
}

interface Shape {
    plan: string;
    side: string;
}

/** Notional coverage per shape type. Plan forward = −90°, side forward = 0°. */
function coverageFor(s: Sensor): Shape {
    if (s.coverage === "sphere") {
        const circle = (c: [number, number]) => `M ${c[0] - R_SPHERE},${c[1]} a ${R_SPHERE},${R_SPHERE} 0 1 0 ${2 * R_SPHERE},0 a ${R_SPHERE},${R_SPHERE} 0 1 0 ${-2 * R_SPHERE},0 Z`;
        return { plan: circle(PLAN_C), side: circle(SIDE_C) };
    }
    const m = MOUNTS[s.mount as keyof typeof MOUNTS];
    const [px, py] = m.plan;
    const [sx, sy] = m.side;
    if (s.coverage === "radar") return { plan: sector(px, py, R_SECTOR, -150, -30), side: sector(sx, sy, R_SECTOR, -60, 60) };
    if (s.coverage === "irst") return { plan: sector(px, py, R_SECTOR, -180, 0), side: sector(sx, sy, R_SECTOR, -80, 15) };
    return { plan: sector(px, py, R_SECTOR, -180, 0), side: sector(sx, sy, R_SECTOR, -15, 100) };
}

function SensorDrawing({ active, where, plan, side, notional }: { active: Sensor; where: string; plan: string; side: string; notional: string }) {
    const line = "var(--color-topcoat)";
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full border border-edge bg-ink-2" role="img" aria-label={`${active.name}: ${where}. ${notional}`}>
            <defs>
                <clipPath id="sensors-clip-plan">
                    <rect x="0" y="0" width="372" height={H} />
                </clipPath>
                <clipPath id="sensors-clip-side">
                    <rect x="388" y="0" width={W - 388} height={H} />
                </clipPath>
            </defs>

            {/* panel divider */}
            <line x1="380" y1="16" x2="380" y2={H - 16} stroke="var(--color-edge)" />

            {/* coverage: every shape is drawn, only the active one is visible */}
            {sensors.map((s) => {
                const shape = coverageFor(s);
                const on = s.id === active.id;
                return (
                    <g key={s.id} className="transition-opacity duration-500 motion-reduce:transition-none" opacity={on ? 1 : 0} aria-hidden>
                        <path d={shape.plan} clipPath="url(#sensors-clip-plan)" fill="var(--color-hmd)" fillOpacity="0.1" stroke="var(--color-hmd)" strokeWidth="1" strokeDasharray="6 4" />
                        <path d={shape.side} clipPath="url(#sensors-clip-side)" fill="var(--color-hmd)" fillOpacity="0.1" stroke="var(--color-hmd)" strokeWidth="1" strokeDasharray="6 4" />
                    </g>
                );
            })}

            {/* centrelines */}
            <line x1={PX} y1="24" x2={PX} y2={H - 24} stroke="var(--color-edge-2)" strokeDasharray="10 3 2 3" />
            <line x1="400" y1={SIDE_C[1] + 8} x2={W - 12} y2={SIDE_C[1] + 8} stroke="var(--color-edge-2)" strokeDasharray="10 3 2 3" />

            {/* plan view airframe */}
            <path d={planPath} fill="var(--color-plate)" stroke={line} strokeWidth="1.25" strokeLinejoin="round" />
            <ellipse cx={PX} cy={130} rx={7} ry={22} fill="none" stroke={line} />
            {/* intakes */}
            <path d={`M ${PX + 18},140 L ${PX + 28},146 M ${PX - 18},140 L ${PX - 28},146`} stroke={line} />

            {/* side view airframe */}
            <path d={SIDE_OUTLINE} fill="var(--color-plate)" stroke={line} strokeWidth="1.25" strokeLinejoin="round" />
            <path d="M 650,218 Q 628,198 596,215" fill="none" stroke={line} />
            <path d="M 600,246 L 640,240" stroke={line} />

            {/* sensor markers */}
            {sensors
                .filter((s) => s.mount !== "distributed")
                .map((s) => {
                    const m = MOUNTS[s.mount as keyof typeof MOUNTS];
                    const on = s.id === active.id;
                    const col = on ? "var(--color-hmd)" : "var(--color-faint)";
                    const under = s.mount === "underNose";
                    return (
                        <g key={s.id} aria-hidden>
                            <circle cx={m.plan[0]} cy={m.plan[1]} r={on ? 5 : 3.5} fill={under ? "var(--color-ink-2)" : col} stroke={col} strokeDasharray={under ? "2 1.5" : undefined} />
                            <circle cx={m.side[0]} cy={m.side[1]} r={on ? 5 : 3.5} fill={col} stroke={col} />
                        </g>
                    );
                })}

            {/* panel labels */}
            <g fontFamily="var(--font-mono)" fontSize="11" letterSpacing="0.06em">
                <text x="16" y="26" fill="var(--color-muted)">{plan.toUpperCase()}</text>
                <text x="404" y="26" fill="var(--color-muted)">{side.toUpperCase()}</text>
                <text x="364" y={H - 14} textAnchor="end" fill="var(--color-faint)">{notional.toUpperCase()}</text>
                <text x={W - 14} y={H - 14} textAnchor="end" fill="var(--color-faint)">{notional.toUpperCase()}</text>
                <text x={W - 14} y="26" textAnchor="end" fill="var(--color-hmd)">{active.name}</text>
            </g>
        </svg>
    );
}
