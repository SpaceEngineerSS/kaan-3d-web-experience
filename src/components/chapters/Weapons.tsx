"use client";

import { useId, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { missions, munitions, weaponsCopy, type MissionProfile, type StationId } from "@/content/weapons";

const STATION_ORDER: StationId[] = ["wingL", "sideL", "bayL", "bayR", "sideR", "wingR"];
const INTERNAL = new Set<StationId>(["bayL", "bayR", "sideL", "sideR"]);
const byId = Object.fromEntries(munitions.map((m) => [m.id, m]));

export function Weapons() {
    const { locale } = useLanguage();
    const c = weaponsCopy[locale];
    const [missionId, setMissionId] = useState(missions[0].id);
    const mission = missions.find((m) => m.id === missionId) ?? missions[0];
    const uid = useId();

    const rows = STATION_ORDER.filter((s) => mission.load[s]).map((s) => ({ station: s, ...mission.load[s]! }));

    return (
        <Chapter id="weapons" index={6} label={c.label} title={c.title} lede={c.lede} solid>
            <div className="flex flex-wrap items-center gap-4" data-reveal>
                <span className="t-label" id={`${uid}-label`}>
                    {c.profile}
                </span>
                <div className="seg flex-wrap" role="tablist" aria-labelledby={`${uid}-label`}>
                    {missions.map((m) => (
                        <button
                            key={m.id}
                            type="button"
                            role="tab"
                            id={`${uid}-tab-${m.id}`}
                            aria-selected={m.id === mission.id}
                            aria-controls={`${uid}-panel`}
                            tabIndex={m.id === mission.id ? 0 : -1}
                            onClick={() => setMissionId(m.id)}
                            onKeyDown={(e) => {
                                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                                const i = missions.findIndex((x) => x.id === mission.id);
                                const next = missions[(i + (e.key === "ArrowRight" ? 1 : missions.length - 1)) % missions.length];
                                setMissionId(next.id);
                                document.getElementById(`${uid}-tab-${next.id}`)?.focus();
                            }}
                            className="min-h-[44px]"
                        >
                            {m.name[locale]}
                        </button>
                    ))}
                </div>
            </div>

            <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${mission.id}`} className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
                <figure className="lg:col-span-6">
                    <figcaption className="t-label">{c.diagramTitle}</figcaption>
                    <StationDiagram mission={mission} locale={locale} />
                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{c.diagramNote}</p>
                </figure>

                <div className="lg:col-span-6">
                    <p className="t-body max-w-[54ch]">{mission.summary[locale]}</p>
                    <div className="mt-8 overflow-x-auto">
                        <table className="w-full min-w-[34rem] border-collapse text-left">
                            <caption className="sr-only">
                                {c.diagramTitle}: {mission.name[locale]}
                            </caption>
                            <thead>
                                <tr className="t-label border-b border-line-strong">
                                    <th scope="col" className="py-3 pr-4 font-normal">{c.colStation}</th>
                                    <th scope="col" className="py-3 pr-4 font-normal">{c.colStore}</th>
                                    <th scope="col" className="py-3 pr-4 text-right font-normal">{c.colQty}</th>
                                    <th scope="col" className="py-3 font-normal">{c.colRole}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => {
                                    const m = byId[r.munition];
                                    return (
                                        <tr key={r.station} className="border-b border-line align-baseline">
                                            <th scope="row" className="py-3 pr-4 font-normal text-fg-2">
                                                <span className="block">{c.stations[r.station]}</span>
                                                <span className="t-label">{INTERNAL.has(r.station) ? c.internal : c.external}</span>
                                            </th>
                                            <td className="py-3 pr-4 font-medium text-fg">{m.name}</td>
                                            <td className="t-data py-3 pr-4 text-right text-fg">{r.qty}</td>
                                            <td className="py-3 text-[0.9375rem] text-fg-2">{m.role[locale]}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Reference list: all stores, with developer and status. */}
            <div className="mt-16 overflow-x-auto" data-reveal>
                <table className="w-full min-w-[40rem] border-collapse text-left">
                    <caption className="sr-only">{c.label}</caption>
                    <thead>
                        <tr className="t-label border-b border-line-strong">
                            <th scope="col" className="py-3 pr-4 font-normal">{c.colStore}</th>
                            <th scope="col" className="py-3 pr-4 font-normal">{c.colRole}</th>
                            <th scope="col" className="py-3 pr-4 font-normal">{c.colDeveloper}</th>
                            <th scope="col" className="py-3 font-normal">{c.colStatus}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {munitions.map((m) => (
                            <tr key={m.id} className="border-b border-line align-baseline text-[0.9375rem]">
                                <th scope="row" className="py-3 pr-4 font-medium text-fg">{m.name}</th>
                                <td className="py-3 pr-4 text-fg-2">
                                    {m.role[locale]}
                                    <span className="block text-[0.8125rem] text-muted">{m.guidance[locale]}</span>
                                </td>
                                <td className="t-data py-3 pr-4 text-sm text-fg-2">{m.developer}</td>
                                <td className="py-3 text-[0.8125rem] text-muted">{m.status[locale]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <SourceNote>{c.source}</SourceNote>
        </Chapter>
    );
}

/**
 * Front-view station diagram: fuselage cross-section with the main bay (two halves) and side bays,
 * wings with one pylon each. Loaded stations are drawn solid, empty ones dashed.
 */
function StationDiagram({ mission, locale }: { mission: MissionProfile; locale: "tr" | "en" }) {
    const c = weaponsCopy[locale];
    const W = 520;
    const H = 300;
    const cx = W / 2;

    // Station anchor points (where stores are drawn) in the front view.
    const pos: Record<StationId, { x: number; y: number }> = {
        wingL: { x: cx - 175, y: 178 },
        sideL: { x: cx - 58, y: 150 },
        bayL: { x: cx - 22, y: 170 },
        bayR: { x: cx + 22, y: 170 },
        sideR: { x: cx + 58, y: 150 },
        wingR: { x: cx + 175, y: 178 },
    };

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full border border-line bg-ground-2" role="img" aria-label={`${c.diagramTitle}: ${mission.name[locale]}`}>
            {/* centreline */}
            <line x1={cx} y1={30} x2={cx} y2={H - 30} stroke="var(--color-line-strong)" strokeDasharray="10 3 2 3" />
            {/* wing line */}
            <path d={`M 30 128 L ${cx - 70} 120 M ${cx + 70} 120 L ${W - 30} 128`} stroke="var(--color-airframe)" strokeWidth="1.5" fill="none" />
            {/* fuselage cross-section: chined, flat-bottomed */}
            <path
                d={`M ${cx - 32} 70 L ${cx + 32} 70 L ${cx + 70} 118 L ${cx + 76} 132 L ${cx + 48} 196 L ${cx - 48} 196 L ${cx - 76} 132 L ${cx - 70} 118 Z`}
                fill="var(--color-surface)"
                stroke="var(--color-airframe)"
                strokeWidth="1.25"
            />
            {/* canopy */}
            <path d={`M ${cx - 20} 70 Q ${cx} 36 ${cx + 20} 70`} fill="none" stroke="var(--color-airframe)" strokeWidth="1" />
            {/* vertical tails (canted) */}
            <path d={`M ${cx - 50} 92 L ${cx - 82} 40 M ${cx + 50} 92 L ${cx + 82} 40`} stroke="var(--color-airframe)" strokeWidth="1" />
            {/* bay outlines */}
            <rect x={cx - 42} y={150} width={84} height={42} fill="none" stroke="var(--color-line-strong)" strokeDasharray="3 2" />
            <rect x={cx - 72} y={134} width={26} height={30} fill="none" stroke="var(--color-line-strong)" strokeDasharray="3 2" />
            <rect x={cx + 46} y={134} width={26} height={30} fill="none" stroke="var(--color-line-strong)" strokeDasharray="3 2" />
            {/* pylons */}
            <line x1={cx - 175} y1={124} x2={cx - 175} y2={150} stroke="var(--color-airframe)" />
            <line x1={cx + 175} y1={124} x2={cx + 175} y2={150} stroke="var(--color-airframe)" />

            {(Object.keys(pos) as StationId[]).map((s) => {
                const load = mission.load[s];
                const p = pos[s];
                const internal = INTERNAL.has(s);
                const n = load?.qty ?? 0;
                const r = internal ? 7 : 9;
                const spread = 2 * r + 3;
                const startX = p.x - ((n - 1) * spread) / 2;
                return (
                    <g key={s}>
                        {load ? (
                            Array.from({ length: n }, (_, i) => (
                                <circle
                                    key={i}
                                    cx={startX + i * spread}
                                    cy={p.y}
                                    r={r}
                                    fill={internal ? "var(--color-fg)" : "var(--color-signal-soft)"}
                                    stroke={internal ? "var(--color-fg)" : "var(--color-signal)"}
                                    strokeWidth="1"
                                />
                            ))
                        ) : (
                            <circle cx={p.x} cy={p.y} r={r} fill="none" stroke="var(--color-faint)" strokeDasharray="2 2" />
                        )}
                    </g>
                );
            })}

            {/* labels with leader lines */}
            <g fontFamily="var(--font-mono)" fontSize="11">
                {(Object.keys(pos) as StationId[]).map((s) => {
                    const load = mission.load[s];
                    const p = pos[s];
                    const left = p.x < cx;
                    const ly = s.startsWith("wing") ? 232 : s.startsWith("side") ? 246 : 270;
                    const lx = s.startsWith("wing") ? p.x : left ? cx - 130 : cx + 130;
                    return (
                        <g key={s}>
                            <polyline points={`${p.x},${p.y + 10} ${p.x},${ly - 14} ${lx},${ly - 14}`} fill="none" stroke="var(--color-line-strong)" strokeWidth="0.75" />
                            <text x={lx} y={ly} textAnchor={s.startsWith("wing") ? "middle" : left ? "end" : "start"} fill={load ? "var(--color-fg)" : "var(--color-faint)"}>
                                {load ? `${load.qty} × ${byId[load.munition].name}` : c.empty}
                            </text>
                        </g>
                    );
                })}
            </g>

            {/* legend */}
            <g fontFamily="var(--font-mono)" fontSize="11">
                <circle cx={22} cy={24} r={5} fill="var(--color-fg)" />
                <text x={34} y={28} fill="var(--color-fg-2)">{c.internal}</text>
                <circle cx={22} cy={44} r={5} fill="var(--color-signal-soft)" stroke="var(--color-signal)" />
                <text x={34} y={48} fill="var(--color-fg-2)">{c.external}</text>
            </g>
        </svg>
    );
}
