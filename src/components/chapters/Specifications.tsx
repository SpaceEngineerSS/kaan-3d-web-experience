"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { peers, specs, specsCopy } from "@/content/aircraft";

export function Specifications() {
    const { locale } = useLanguage();
    const c = specsCopy[locale];
    const [peerId, setPeerId] = useState("f35");

    return (
        <Chapter id="specs" index={3} label={c.label} title={c.title} lede={c.lede}>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-7">
                    <table className="w-full border-collapse text-left">
                        <caption className="sr-only">{c.title}</caption>
                        <thead>
                            <tr className="t-label border-b border-line-strong">
                                <th scope="col" className="py-3 pr-4 font-normal">{c.colItem}</th>
                                <th scope="col" className="py-3 font-normal">{c.colValue}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {specs.map((s) => (
                                <tr key={s.key} className="border-b border-line align-baseline" data-reveal>
                                    <th scope="row" className="py-4 pr-4 font-normal text-fg-2">{s.label[locale]}</th>
                                    <td className="py-4">
                                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                            <span className="t-num text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] text-fg">{s.value}</span>
                                            {s.unit[locale] && <span className="t-data text-sm text-muted">{s.unit[locale]}</span>}
                                            {s.note && <span className="t-label ml-1 text-faint">{s.note[locale]}</span>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <SourceNote>{c.source}</SourceNote>
                </div>

                <figure className="lg:col-span-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <figcaption className="t-label">{c.sizeTitle}</figcaption>
                        <div className="seg" role="group" aria-label={c.sizeTitle}>
                            {peers.slice(1).map((p) => (
                                <button key={p.id} type="button" aria-pressed={peerId === p.id} onClick={() => setPeerId(p.id)}>
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <ScaleDrawing peerId={peerId} />
                    <SourceNote>{c.sizeNote}</SourceNote>
                </figure>
            </div>
        </Chapter>
    );
}

/** Two dimension frames (length × span) drawn to the same scale, technical-drawing style. */
function ScaleDrawing({ peerId }: { peerId: string }) {
    const kaan = peers[0];
    const peer = peers.find((p) => p.id === peerId) ?? peers[1];
    const W = 470;
    const H = 460;
    const s = 15; // px per metre
    const ox = 60;
    const oy = 40;

    const frame = (len: number, span: number, signal: boolean) => {
        const w = span * s;
        const h = len * s;
        const x = ox + (14.5 * s - w) / 2;
        return (
            <g className="transition-all duration-500">
                <rect
                    x={x}
                    y={oy}
                    width={w}
                    height={h}
                    fill={signal ? "var(--color-signal-soft)" : "none"}
                    stroke={signal ? "var(--color-signal)" : "var(--color-fg-2)"}
                    strokeWidth={1}
                    strokeDasharray={signal ? undefined : "4 4"}
                />
                {/* centreline */}
                <line x1={x + w / 2} y1={oy - 10} x2={x + w / 2} y2={oy + h + 10} stroke="var(--color-line-strong)" strokeDasharray="10 3 2 3" />
            </g>
        );
    };

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 w-full border border-line bg-ground-2" role="img" aria-label={`KAAN ${kaan.length} × ${kaan.span} m, ${peer.name} ${peer.length} × ${peer.span} m`}>
            <defs>
                <pattern id="grid" width={s} height={s} patternUnits="userSpaceOnUse" x={ox} y={oy}>
                    <path d={`M ${s} 0 L 0 0 0 ${s}`} fill="none" stroke="var(--color-line)" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect x="0" y="0" width={W} height={H} fill="url(#grid)" opacity="0.6" />
            {frame(peer.length, peer.span, false)}
            {frame(kaan.length, kaan.span, true)}

            {/* length dimension (KAAN) */}
            <g stroke="var(--color-muted)" fill="var(--color-muted)" fontFamily="var(--font-mono)" fontSize="11">
                <line x1={ox - 24} y1={oy} x2={ox - 24} y2={oy + kaan.length * s} />
                <line x1={ox - 30} y1={oy} x2={ox - 18} y2={oy} />
                <line x1={ox - 30} y1={oy + kaan.length * s} x2={ox - 18} y2={oy + kaan.length * s} />
                <text x={ox - 30} y={oy + (kaan.length * s) / 2} transform={`rotate(-90 ${ox - 30} ${oy + (kaan.length * s) / 2})`} textAnchor="middle" stroke="none">
                    {kaan.length} m
                </text>
                <line x1={ox + (14.5 * s - kaan.span * s) / 2} y1={oy + kaan.length * s + 22} x2={ox + (14.5 * s + kaan.span * s) / 2} y2={oy + kaan.length * s + 22} />
                <text x={ox + (14.5 * s) / 2} y={oy + kaan.length * s + 40} textAnchor="middle" stroke="none">
                    {kaan.span} m
                </text>
            </g>

            {/* legend */}
            <g fontFamily="var(--font-mono)" fontSize="11">
                <rect x={W - 140} y={18} width={10} height={10} fill="var(--color-signal-soft)" stroke="var(--color-signal)" />
                <text x={W - 124} y={27} fill="var(--color-fg)">KAAN</text>
                <rect x={W - 140} y={36} width={10} height={10} fill="none" stroke="var(--color-fg-2)" strokeDasharray="3 2" />
                <text x={W - 124} y={45} fill="var(--color-fg-2)">{peer.name}</text>
                <text x={W - 124} y={60} fill="var(--color-muted)">
                    {peer.length} × {peer.span} m
                </text>
            </g>
        </svg>
    );
}
