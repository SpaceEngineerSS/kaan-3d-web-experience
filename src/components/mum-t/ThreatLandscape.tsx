"use client";

import { useState } from "react";
import { useT } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { threats, type LayerId } from "@/content/mumt";
import { SegTabs } from "./SegTabs";

const CX = 440;
const CY = 200;
const RADII: Record<LayerId, number> = { long: 175, medium: 120, short: 68, target: 14 };
const ORDER: LayerId[] = ["long", "medium", "short", "target"];

/** A small arrowhead marker pointing right (direction of travel). */
function Marker({ x, y, size = 9, signal = false }: { x: number; y: number; size?: number; signal?: boolean }) {
    return (
        <path
            d={`M ${x + size} ${y} L ${x - size} ${y - size * 0.75} L ${x - size * 0.45} ${y} L ${x - size} ${y + size * 0.75} Z`}
            fill={signal ? "var(--color-signal)" : "var(--color-fg-2)"}
        />
    );
}

/** Chapter 03: layered air defence and where each platform sits in it. */
export function ThreatLandscape() {
    const t = useT();
    const c = t(threats);
    const [layer, setLayer] = useState<LayerId>("long");
    const active = c.layers.find((l) => l.id === layer) ?? c.layers[0];

    return (
        <Chapter id="threats" index={3} label={c.label} title={c.title} lede={c.lede} solid>
            <div className="grid gap-10 lg:grid-cols-12">
                <figure className="lg:col-span-8">
                    <svg viewBox="0 0 640 400" className="w-full border border-line bg-ground-2" role="img" aria-label={c.layers.map((l) => l.label).join(", ")}>
                        <defs>
                            <pattern id="threat-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--color-line)" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="640" height="400" fill="url(#threat-grid)" opacity="0.6" />

                        {ORDER.map((id) => {
                            const on = id === layer;
                            return (
                                <circle
                                    key={id}
                                    cx={CX}
                                    cy={CY}
                                    r={RADII[id]}
                                    fill={on ? "var(--color-surface-2)" : "none"}
                                    fillOpacity={on ? 0.7 : 0}
                                    stroke={on ? "var(--color-fg)" : "var(--color-airframe)"}
                                    strokeWidth={on ? 1.5 : 1}
                                    strokeDasharray={id === "target" ? undefined : "6 5"}
                                    className="cursor-pointer transition-[stroke,fill-opacity] duration-300"
                                    onClick={() => setLayer(id)}
                                />
                            );
                        })}
                        {/* centrelines */}
                        <line x1={CX} y1={CY - 190} x2={CX} y2={CY + 190} stroke="var(--color-line-strong)" strokeDasharray="10 3 2 3" />
                        <line x1={CX - 190} y1={CY} x2={CX + 190} y2={CY} stroke="var(--color-line-strong)" strokeDasharray="10 3 2 3" />

                        <g fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-muted)">
                            {ORDER.slice(0, 3).map((id, i) => (
                                <text key={id} x={CX + 6} y={CY - RADII[id] + 14} fill={id === layer ? "var(--color-fg)" : "var(--color-muted)"}>
                                    {c.layers[i].label}
                                </text>
                            ))}
                        </g>

                        {/* platforms */}
                        <g fontFamily="var(--font-mono)" fontSize="11">
                            <Marker x={70} y={CY} size={11} signal />
                            <text x={52} y={CY + 26} fill="var(--color-signal)">{c.platforms.kaan}</text>

                            <Marker x={292} y={CY - 58} />
                            <Marker x={300} y={CY + 54} />
                            <text x={252} y={CY + 82} fill="var(--color-fg-2)">{c.platforms.anka}</text>

                            <Marker x={380} y={CY - 18} size={6} />
                            <text x={322} y={CY - 32} fill="var(--color-fg-2)">{c.platforms.simsek}</text>

                            {/* stand-off arrow from KAAN */}
                            <line x1={90} y1={CY} x2={250} y2={CY} stroke="var(--color-line-strong)" strokeDasharray="3 4" />
                        </g>
                    </svg>
                    <SourceNote>{c.note}</SourceNote>
                </figure>

                <div className="lg:col-span-4">
                    <p className="t-label mb-3">{c.figureLabel}</p>
                    <SegTabs idPrefix="threat" label={c.figureLabel} items={c.layers.map((l) => ({ id: l.id, label: l.label }))} value={layer} onChange={setLayer} />
                    <div id="threat-panel" role="tabpanel" aria-labelledby={`threat-tab-${layer}`} className="mt-8 border-t border-line-strong pt-6">
                        <p className="t-h3">{active.label}</p>
                        <p className="t-label mt-2">{active.example}</p>
                        <p className="t-body mt-4">{active.body}</p>
                    </div>
                    <SourceNote>{c.source}</SourceNote>
                </div>
            </div>
        </Chapter>
    );
}
