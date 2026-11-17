"use client";

import { useId, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { INTERNAL_STATIONS, missions, munitions, stationCapacity, weaponsCopy, type MissionProfile, type StationId } from "@/content/weapons";

const STATION_ORDER: StationId[] = ["wingL", "sideL", "bayL", "bayR", "sideR", "wingR"];
const INTERNAL = new Set<StationId>(INTERNAL_STATIONS);
const byId = Object.fromEntries(munitions.map((m) => [m.id, m]));

export function Weapons() {
    const { locale } = useLanguage();
    const c = weaponsCopy[locale];
    const [missionId, setMissionId] = useState(missions[0].id);
    const mission = missions.find((m) => m.id === missionId) ?? missions[0];
    const uid = useId();

    const rows = STATION_ORDER.filter((s) => mission.load[s]).map((s) => ({ station: s, ...mission.load[s]! }));
    const internalCount = rows.filter((r) => INTERNAL.has(r.station)).reduce((n, r) => n + r.qty, 0);
    const externalCount = rows.filter((r) => !INTERNAL.has(r.station)).reduce((n, r) => n + r.qty, 0);

    return (
        <Chapter id="weapons" index={7} label={c.label} title={c.title} lede={c.lede} solid>
            {/* Reported headline figures */}
            <dl className="grid grid-cols-3 border-t border-edge">
                {c.figures.map((f, i) => (
                    <div key={f.label} className={`pt-5 pr-4 ${i > 0 ? "border-l border-edge pl-4 md:pl-8" : ""}`} data-reveal>
                        <dt className="t-label">{f.label}</dt>
                        <dd className="mt-3">
                            <span className="t-num inline-block text-[clamp(3rem,2rem+5vw,7rem)] text-fg">{f.value}</span>
                            {f.unit && <span className="t-data ml-2 text-lg text-muted">{f.unit}</span>}
                            <span className="t-label mt-2 block text-caution">{c.reported}</span>
                        </dd>
                    </div>
                ))}
            </dl>

            <div className="mt-16 flex flex-wrap items-center gap-4" data-reveal>
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
                                const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
                                if (!keys.includes(e.key)) return;
                                e.preventDefault();
                                const i = missions.findIndex((x) => x.id === mission.id);
                                const n = missions.length;
                                const j = e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (i + (e.key === "ArrowRight" ? 1 : n - 1)) % n;
                                setMissionId(missions[j].id);
                                document.getElementById(`${uid}-tab-${missions[j].id}`)?.focus();
                            }}
                            className="min-h-[44px]"
                        >
                            {m.name[locale]}
                        </button>
                    ))}
                </div>
            </div>

            <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${mission.id}`} className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-10">
                <figure className="lg:col-span-7">
                    <StationDiagram mission={mission} locale={locale} />
                    <figcaption className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{c.diagramNote}</figcaption>
                </figure>

                <div className="lg:col-span-5">
                    <p className="t-label">{c.diagramTitle}</p>
                    <div className="mt-4 flex gap-10">
                        <p>
                            <span className="t-num block text-[clamp(2.5rem,2rem+2vw,4rem)] text-fg">{internalCount}</span>
                            <span className="t-label">{c.internal}</span>
                        </p>
                        <p>
                            <span className={`t-num block text-[clamp(2.5rem,2rem+2vw,4rem)] ${externalCount ? "text-caution" : "text-faint"}`}>{externalCount}</span>
                            <span className="t-label">{c.external}</span>
                        </p>
                    </div>
                    <p className="t-body mt-6 max-w-[52ch]">{mission.summary[locale]}</p>
                    <ul className="mt-6 border-t border-edge">
                        {rows.map((r) => (
                            <li key={r.station} className="flex items-baseline justify-between gap-4 border-b border-edge py-2.5 text-[0.9375rem]">
                                <span className="text-fg-2">{c.stations[r.station]}</span>
                                <span className="t-data text-fg">
                                    {r.qty} × {byId[r.munition].name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* All stores linked to KAAN */}
            <h3 className="t-h3 mt-20" data-reveal>
                {c.storesTitle}
            </h3>
            <ul className="mt-6 grid gap-x-10 border-t border-edge sm:grid-cols-2 lg:grid-cols-3">
                {munitions.map((m) => (
                    <li key={m.id} className="border-b border-edge py-5" data-reveal>
                        <div className="flex items-baseline justify-between gap-3">
                            <span className="font-display text-3xl font-semibold uppercase leading-none tracking-wide text-fg">{m.name}</span>
                            <span className="t-label">{m.developer}</span>
                        </div>
                        <p className="mt-3 text-[0.9375rem] leading-relaxed text-fg-2">{m.role[locale]}</p>
                        <p className="t-label mt-2 text-faint">{m.status[locale]}</p>
                    </li>
                ))}
            </ul>
            <SourceNote>{c.source}</SourceNote>
        </Chapter>
    );
}

/**
 * Front-view station diagram: chined fuselage cross-section with the main bay (two halves of three slots)
 * and two side bays, three pylons per wing. Loaded slots are solid, free slots dashed.
 */
function StationDiagram({ mission, locale }: { mission: MissionProfile; locale: "tr" | "en" }) {
    const c = weaponsCopy[locale];
    const W = 560;
    const H = 300;
    const cx = W / 2;
    const airframe = "var(--color-topcoat)";

    /** Slot centres per station group. */
    const slots: Record<StationId, { x: number; y: number }[]> = {
        bayL: [-36, -22, -8].map((d) => ({ x: cx + d, y: 170 })),
        bayR: [8, 22, 36].map((d) => ({ x: cx + d, y: 170 })),
        sideL: [{ x: cx - 60, y: 149 }],
        sideR: [{ x: cx + 60, y: 149 }],
        wingL: [-210, -165, -120].map((d) => ({ x: cx + d, y: 152 })),
        wingR: [120, 165, 210].map((d) => ({ x: cx + d, y: 152 })),
    };
    const wingY = (x: number) => 120 + (Math.abs(x - cx) - 70) * (8 / (cx - 100));

    /** Label anchor per group. */
    const label: Record<StationId, { x: number; y: number; anchor: "start" | "middle" | "end" }> = {
        wingL: { x: cx - 165, y: 214, anchor: "middle" },
        wingR: { x: cx + 165, y: 214, anchor: "middle" },
        sideL: { x: cx - 120, y: 248, anchor: "end" },
        sideR: { x: cx + 120, y: 248, anchor: "start" },
        bayL: { x: cx - 120, y: 276, anchor: "end" },
        bayR: { x: cx + 120, y: 276, anchor: "start" },
    };

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full border border-edge bg-ink-2" role="img" aria-label={`${c.diagramTitle}: ${mission.name[locale]}`}>
            <line x1={cx} y1={24} x2={cx} y2={H - 16} stroke="var(--color-edge-2)" strokeDasharray="10 3 2 3" />
            {/* wings */}
            <path d={`M 40 128 L ${cx - 70} 120 M ${cx + 70} 120 L ${W - 40} 128`} stroke={airframe} strokeWidth="1.5" fill="none" />
            {/* fuselage cross-section */}
            <path
                d={`M ${cx - 32} 70 L ${cx + 32} 70 L ${cx + 70} 118 L ${cx + 76} 132 L ${cx + 50} 196 L ${cx - 50} 196 L ${cx - 76} 132 L ${cx - 70} 118 Z`}
                fill="var(--color-plate)"
                stroke={airframe}
                strokeWidth="1.25"
            />
            <path d={`M ${cx - 20} 70 Q ${cx} 36 ${cx + 20} 70`} fill="none" stroke={airframe} />
            <path d={`M ${cx - 50} 92 L ${cx - 82} 40 M ${cx + 50} 92 L ${cx + 82} 40`} stroke={airframe} />
            {/* bay outlines */}
            <rect x={cx - 46} y={157} width={92} height={27} fill="none" stroke="var(--color-edge-2)" strokeDasharray="3 2" />
            <rect x={cx - 73} y={136} width={26} height={27} fill="none" stroke="var(--color-edge-2)" strokeDasharray="3 2" />
            <rect x={cx + 47} y={136} width={26} height={27} fill="none" stroke="var(--color-edge-2)" strokeDasharray="3 2" />
            {/* pylons */}
            {[...slots.wingL, ...slots.wingR].map((p) => (
                <line key={p.x} x1={p.x} y1={wingY(p.x)} x2={p.x} y2={p.y - 8} stroke={airframe} />
            ))}

            {/* slots */}
            {(Object.keys(slots) as StationId[]).map((s) => {
                const load = mission.load[s];
                const internal = INTERNAL.has(s);
                const r = internal ? 6 : 7.5;
                return slots[s].slice(0, stationCapacity[s]).map((p, i) => {
                    const filled = !!load && i < load.qty;
                    return (
                        <circle
                            key={`${s}-${i}`}
                            cx={p.x}
                            cy={p.y}
                            r={r}
                            fill={filled ? (internal ? "var(--color-hmd)" : "var(--color-caution)") : "none"}
                            stroke={filled ? (internal ? "var(--color-hmd)" : "var(--color-caution)") : "var(--color-faint)"}
                            strokeDasharray={filled ? undefined : "2 2"}
                            className="transition-[fill,stroke] duration-300 motion-reduce:transition-none"
                        />
                    );
                });
            })}

            {/* group labels */}
            <g fontFamily="var(--font-mono)" fontSize="11">
                {(Object.keys(label) as StationId[]).map((s) => {
                    const load = mission.load[s];
                    const l = label[s];
                    const ps = slots[s];
                    const gx = (ps[0].x + ps[ps.length - 1].x) / 2;
                    const gy = ps[0].y;
                    const wing = s.startsWith("wing");
                    const pts = wing ? `${gx},${gy + 12} ${gx},${l.y - 13}` : `${gx},${gy + 10} ${gx},${l.y - 4} ${l.x},${l.y - 4}`;
                    return (
                        <g key={s}>
                            <polyline points={pts} fill="none" stroke="var(--color-edge-2)" strokeWidth="0.75" />
                            <text x={wing ? l.x : l.x + (l.anchor === "end" ? -6 : 6)} y={l.y} textAnchor={l.anchor} fill={load ? "var(--color-fg)" : "var(--color-faint)"}>
                                {load ? `${load.qty} × ${byId[load.munition].name}` : c.empty}
                            </text>
                        </g>
                    );
                })}
            </g>

            {/* legend */}
            <g fontFamily="var(--font-mono)" fontSize="11">
                <circle cx={22} cy={24} r={5} fill="var(--color-hmd)" />
                <text x={34} y={28} fill="var(--color-fg-2)">{c.internal}</text>
                <circle cx={22} cy={44} r={5} fill="var(--color-caution)" />
                <text x={34} y={48} fill="var(--color-fg-2)">{c.external}</text>
            </g>
        </svg>
    );
}
