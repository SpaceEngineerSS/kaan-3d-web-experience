"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { peers, specs, specsCopy, type SpecRow } from "@/content/aircraft";

const byKey = Object.fromEntries(specs.map((s) => [s.key, s])) as Record<string, SpecRow>;

/** Scale under a readout: [min, max], the marked value or band, and labelled ticks. */
interface Scale {
    min: number;
    max: number;
    from?: number;
    to: number;
    ticks: number[];
    fmt?: (n: number) => string;
}

const PERFORMANCE: { key: string; scale?: Scale }[] = [
    { key: "speed", scale: { min: 0, max: 2, to: 1.8, ticks: [0, 0.5, 1, 1.5, 2], fmt: (n) => n.toFixed(1) } },
    { key: "ceiling", scale: { min: 0, max: 60000, to: 55000, ticks: [0, 20000, 40000, 60000], fmt: (n) => `${n / 1000}k` } },
    { key: "g", scale: { min: -4, max: 10, from: -3.5, to: 9, ticks: [-4, 0, 5, 10], fmt: (n) => (n > 0 ? `+${n}` : String(n)) } },
    { key: "thrust" },
];

const DIMENSIONS = ["length", "span", "height", "wing", "mtow", "crew", "engine"];

export function Specifications() {
    const { locale } = useLanguage();
    const c = specsCopy[locale];
    const [peerId, setPeerId] = useState("su57");

    return (
        <Chapter id="specs" index={6} label={c.label} title={c.title} lede={c.lede} solid>
            {/* Performance readouts */}
            <div className="grid border-t border-l border-edge sm:grid-cols-2 xl:grid-cols-4">
                {PERFORMANCE.map(({ key, scale }) => {
                    const s = byKey[key];
                    return (
                        <div key={key} className="flex flex-col border-r border-b border-edge p-5 md:p-6" data-reveal>
                            <div className="flex items-baseline justify-between gap-3">
                                <span className="t-label">{s.label[locale]}</span>
                                {s.note && <span className="t-label text-caution">{s.note[locale]}</span>}
                            </div>
                            <p className="t-num mt-5 text-[clamp(3rem,2rem+4vw,5.5rem)] text-fg">
                                {key === "thrust" ? (
                                    <>
                                        <span className="text-muted">2×</span>
                                        {s.value}
                                    </>
                                ) : (
                                    s.value
                                )}
                            </p>
                            <p className="t-data mt-2 text-sm text-muted">{s.unit[locale]}</p>
                            <div className="mt-auto pt-6">{scale ? <ScaleBar scale={scale} /> : <p className="t-label text-faint">2 × F110-GE-129</p>}</div>
                        </div>
                    );
                })}
            </div>

            {/* Dimensions + same-scale comparison */}
            <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-10">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-8 self-start lg:col-span-5">
                    {DIMENSIONS.map((k) => {
                        const s = byKey[k];
                        const wide = k === "crew" || k === "engine";
                        return (
                            <div key={k} className={`border-t border-edge pt-3 ${wide ? "col-span-2" : ""}`} data-reveal>
                                <dt className="t-label">{s.label[locale]}</dt>
                                <dd className="mt-2">
                                    <span className={`t-num text-fg ${wide ? "text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)]" : "text-[clamp(2.25rem,1.6rem+2.2vw,3.5rem)]"}`}>{s.value}</span>
                                    {s.unit[locale] && <span className="t-data ml-2 text-sm text-muted">{s.unit[locale]}</span>}
                                    {s.note && <span className="mt-1 block text-[0.8125rem] text-faint">{s.note[locale]}</span>}
                                </dd>
                            </div>
                        );
                    })}
                </dl>

                <figure className="lg:col-span-7" data-reveal>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <figcaption className="t-label" id="specs-scale-label">
                            {c.sizeTitle}
                        </figcaption>
                        <div className="seg flex-wrap" role="group" aria-labelledby="specs-scale-label">
                            {peers.slice(1).map((p) => (
                                <button key={p.id} type="button" className="min-h-[44px]" aria-pressed={peerId === p.id} onClick={() => setPeerId(p.id)}>
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <ScaleDrawing peerId={peerId} locale={locale} />
                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{c.sizeNote}</p>
                </figure>
            </div>
            <SourceNote>{c.source}</SourceNote>
        </Chapter>
    );
}

/** A thin instrument scale with the value (or band) marked in HMD green. */
function ScaleBar({ scale }: { scale: Scale }) {
    const { min, max, from, to, ticks, fmt = String } = scale;
    const pct = (n: number) => ((n - min) / (max - min)) * 100;
    const start = pct(from ?? min);
    const end = pct(to);
    return (
        <div aria-hidden>
            <div className="relative h-3 border-b border-edge-2">
                {ticks.map((t) => (
                    <span key={t} className="absolute bottom-0 h-2 w-px bg-edge-2" style={{ left: `${pct(t)}%` }} />
                ))}
                <span className="absolute bottom-0 h-[3px] bg-hmd" style={{ left: `${start}%`, width: `${end - start}%` }} />
                <span className="absolute -bottom-1 h-4 w-[2px] bg-hmd" style={{ left: `calc(${end}% - 1px)` }} />
            </div>
            <div className="relative mt-1 h-4">
                {ticks.map((t, i) => (
                    <span
                        key={t}
                        className="t-data absolute text-[0.6875rem] text-faint"
                        style={{ left: `${pct(t)}%`, transform: i === 0 ? "none" : i === ticks.length - 1 ? "translateX(-100%)" : "translateX(-50%)" }}
                    >
                        {fmt(t)}
                    </span>
                ))}
            </div>
        </div>
    );
}

/** Two dimension frames (length × span) drawn to the same scale, technical-drawing style. */
function ScaleDrawing({ peerId, locale }: { peerId: string; locale: "tr" | "en" }) {
    const m = (n: number) => (locale === "tr" ? String(n).replace(".", ",") : String(n));
    const kaan = peers[0];
    const peer = peers.find((p) => p.id === peerId) ?? peers[1];
    const W = 560;
    const H = 420;
    const s = 16; // px per metre
    const box = 15; // metres reserved for the widest span
    const ox = 70;
    const oy = 36;
    const cx = ox + (box * s) / 2;

    const frame = (len: number, span: number, own: boolean) => {
        const w = span * s;
        const h = len * s;
        const x = cx - w / 2;
        return (
            <rect
                x={x}
                y={oy}
                width={w}
                height={h}
                fill={own ? "var(--color-hmd)" : "none"}
                fillOpacity={own ? 0.08 : undefined}
                stroke={own ? "var(--color-hmd)" : "var(--color-fg-2)"}
                strokeWidth={own ? 1.5 : 1}
                strokeDasharray={own ? undefined : "5 4"}
                className="transition-all duration-500 motion-reduce:transition-none"
            />
        );
    };

    const kh = kaan.length * s;
    const kw = kaan.span * s;

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mt-4 w-full border border-edge bg-ink-2"
            role="img"
            aria-label={`KAAN ${m(kaan.length)} × ${m(kaan.span)} m; ${peer.name} ${m(peer.length)} × ${m(peer.span)} m`}
        >
            <defs>
                <pattern id="specs-grid" width={s} height={s} patternUnits="userSpaceOnUse" x={ox} y={oy}>
                    <path d={`M ${s} 0 L 0 0 0 ${s}`} fill="none" stroke="var(--color-edge)" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect x="0" y="0" width={W} height={H} fill="url(#specs-grid)" opacity="0.7" />
            <line x1={cx} y1={oy - 14} x2={cx} y2={oy + kh + 14} stroke="var(--color-edge-2)" strokeDasharray="10 3 2 3" />
            {frame(peer.length, peer.span, false)}
            {frame(kaan.length, kaan.span, true)}

            <g stroke="var(--color-muted)" fill="var(--color-fg)" fontFamily="var(--font-mono)" fontSize="12">
                {/* length */}
                <line x1={ox - 28} y1={oy} x2={ox - 28} y2={oy + kh} />
                <line x1={ox - 34} y1={oy} x2={ox - 22} y2={oy} />
                <line x1={ox - 34} y1={oy + kh} x2={ox - 22} y2={oy + kh} />
                <text x={ox - 36} y={oy + kh / 2} transform={`rotate(-90 ${ox - 36} ${oy + kh / 2})`} textAnchor="middle" stroke="none">
                    {m(kaan.length)} m
                </text>
                {/* span */}
                <line x1={cx - kw / 2} y1={oy + kh + 24} x2={cx + kw / 2} y2={oy + kh + 24} />
                <line x1={cx - kw / 2} y1={oy + kh + 18} x2={cx - kw / 2} y2={oy + kh + 30} />
                <line x1={cx + kw / 2} y1={oy + kh + 18} x2={cx + kw / 2} y2={oy + kh + 30} />
                <text x={cx} y={oy + kh + 46} textAnchor="middle" stroke="none">
                    {m(kaan.span)} m
                </text>
            </g>

            {/* legend */}
            <g fontFamily="var(--font-mono)" fontSize="12">
                <rect x={W - 168} y={40} width={12} height={12} fill="var(--color-hmd)" fillOpacity="0.15" stroke="var(--color-hmd)" />
                <text x={W - 148} y={50} fill="var(--color-fg)">KAAN</text>
                <text x={W - 148} y={66} fill="var(--color-muted)">
                    {m(kaan.length)} × {m(kaan.span)} m
                </text>
                <rect x={W - 168} y={86} width={12} height={12} fill="none" stroke="var(--color-fg-2)" strokeDasharray="3 2" />
                <text x={W - 148} y={96} fill="var(--color-fg-2)">{peer.name}</text>
                <text x={W - 148} y={112} fill="var(--color-muted)">
                    {m(peer.length)} × {m(peer.span)} m
                </text>
            </g>
        </svg>
    );
}
