"use client";

import { useState } from "react";
import { useT } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { datalink, type LinkId } from "@/content/mumt";

type NodeId = "kaan" | "anka1" | "anka2" | "simsek" | "ground";

const NODES: Record<NodeId, { x: number; y: number }> = {
    kaan: { x: 320, y: 70 },
    anka1: { x: 150, y: 210 },
    anka2: { x: 490, y: 210 },
    simsek: { x: 560, y: 340 },
    ground: { x: 130, y: 345 },
};

/** Directed edges per message type. */
const FLOWS: Record<LinkId, [NodeId, NodeId][]> = {
    tasking: [["kaan", "anka1"], ["kaan", "anka2"], ["anka2", "simsek"]],
    sensor: [["anka1", "kaan"], ["anka2", "kaan"], ["simsek", "anka2"]],
    status: [["anka1", "kaan"], ["anka2", "kaan"], ["anka1", "ground"], ["kaan", "ground"]],
    warning: [["anka1", "kaan"], ["anka2", "kaan"], ["anka1", "anka2"], ["anka2", "anka1"]],
};

/** All physical links, drawn faint underneath. */
const LINKS: [NodeId, NodeId][] = [["kaan", "anka1"], ["kaan", "anka2"], ["anka2", "simsek"], ["anka1", "ground"], ["kaan", "ground"], ["anka1", "anka2"]];

/** Point on the segment, pulled back from both node centres so arrows do not hit the labels. */
function trimmed(a: NodeId, b: NodeId, offset: number, bend: number) {
    const p = NODES[a];
    const q = NODES[b];
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    // Perpendicular shift separates the two directions of a link.
    const nx = -uy * bend;
    const ny = ux * bend;
    return {
        x1: p.x + ux * offset + nx,
        y1: p.y + uy * offset + ny,
        x2: q.x - ux * offset + nx,
        y2: q.y - uy * offset + ny,
    };
}

/** Chapter 07: which information flows where between the team members. */
export function DataLinkDiagram() {
    const t = useT();
    const c = t(datalink);
    const [type, setType] = useState<LinkId>("tasking");
    const active = c.links.find((l) => l.id === type) ?? c.links[0];
    const labels: Record<NodeId, string> = c.nodes;

    return (
        <Chapter id="datalink" index={7} label={c.label} title={c.title} lede={c.lede} solid className="py-24 md:py-36">
            <div className="grid gap-10 lg:grid-cols-12">
                <figure className="lg:col-span-7">
                    <div className="seg flex-wrap" role="group" aria-label={c.figureLabel}>
                        {c.links.map((l) => (
                            <button key={l.id} type="button" aria-pressed={type === l.id} onClick={() => setType(l.id)} className="pointer-coarse:min-h-11!">
                                {l.label}
                            </button>
                        ))}
                    </div>

                    <svg viewBox="0 0 640 400" className="border border-edge-2 bg-black mt-6 w-full" role="img" aria-label={`${active.label}: ${active.body}`}>
                        <defs>
                            <pattern id="dl-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--color-edge)" strokeWidth="0.5" />
                            </pattern>
                            <marker id="dl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                                <path d="M0 0 L10 5 L0 10 Z" fill="var(--color-info)" />
                            </marker>
                        </defs>
                        <rect width="640" height="400" fill="#000" />
                        <rect width="640" height="400" fill="url(#dl-grid)" opacity="0.5" />

                        {LINKS.map(([a, b]) => {
                            const s = trimmed(a, b, 34, 0);
                            return <line key={`${a}-${b}`} {...s} stroke="var(--color-edge-2)" strokeDasharray="2 5" />;
                        })}

                        {FLOWS[type].map(([a, b]) => {
                            const s = trimmed(a, b, 38, 6);
                            return <line key={`${type}-${a}-${b}`} {...s} stroke="var(--color-info)" strokeWidth="1.3" markerEnd="url(#dl-arrow)" />;
                        })}

                        <g fontFamily="var(--font-mono)" fontSize="12">
                            {(Object.keys(NODES) as NodeId[]).map((id) => {
                                const n = NODES[id];
                                const isKaan = id === "kaan";
                                const isGround = id === "ground";
                                return (
                                    <g key={id}>
                                        {isGround ? (
                                            <rect x={n.x - 12} y={n.y - 12} width="24" height="24" fill="#000" stroke="var(--color-topcoat)" />
                                        ) : (
                                            <circle cx={n.x} cy={n.y} r={id === "simsek" ? 9 : 14} fill="#000" stroke={isKaan ? "var(--color-hmd)" : "var(--color-info)"} strokeWidth={isKaan ? 1.6 : 1} />
                                        )}
                                        <text x={n.x} y={n.y + (id === "simsek" ? 26 : 32)} textAnchor="middle" fill={isKaan ? "var(--color-hmd)" : "var(--color-fg-2)"}>
                                            {labels[id]}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>
                    </svg>
                    <div className="mt-6 border-t border-edge-2 pt-5" aria-live="polite">
                        <p className="font-medium text-fg">{active.label}</p>
                        <p className="t-body mt-2 max-w-[60ch]">{active.body}</p>
                    </div>
                </figure>

                <div className="lg:col-span-4 lg:col-start-9">
                    <h3 className="t-h3">{c.needsTitle}</h3>
                    <dl className="mt-6 border-t border-edge">
                        {c.needs.map((n) => (
                            <div key={n.term} className="border-b border-edge py-4" data-reveal>
                                <dt className="font-medium text-fg">{n.term}</dt>
                                <dd className="mt-1 text-[0.9375rem] leading-relaxed text-fg-2">{n.body}</dd>
                            </div>
                        ))}
                    </dl>
                    <SourceNote>{c.source}</SourceNote>
                </div>
            </div>
        </Chapter>
    );
}
