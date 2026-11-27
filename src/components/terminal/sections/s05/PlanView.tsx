"use client";

import { useLanguage } from "@/context/LanguageContext";
import { s05Copy } from "@/content/s05";
import { fmt, PEERS } from "./shared";

/** Length × span frames of the three aircraft at one scale, nose lines aligned. */
export function PlanView() {
    const { locale } = useLanguage();
    const c = s05Copy[locale];
    const maxL = Math.max(...PEERS.map((f) => f.length));
    const maxS = Math.max(...PEERS.map((f) => f.span));
    const pad = 2.4;
    const W = maxS + pad * 2;
    const H = maxL + pad * 2;
    const cx = W / 2;
    // Nose at the top; frames share the nose line so length differences read at the tail.
    const top = pad;

    return (
        <figure className="flex flex-col lg:col-span-4">
            <figcaption className="t-tele mb-3">{c.planLabel}</figcaption>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[22rem]" role="img" aria-label={c.planNote}>
                {/* metre ticks along the left edge */}
                {Array.from({ length: Math.floor(maxL / 5) + 1 }, (_, i) => (
                    <g key={i}>
                        <line x1={0.4} x2={1.1} y1={top + i * 5} y2={top + i * 5} stroke="var(--color-edge-2)" strokeWidth={0.06} />
                        <text x={0.4} y={top + i * 5 - 0.3} fontSize={0.55} fill="var(--color-faint)" fontFamily="var(--font-mono)">
                            {i * 5}
                        </text>
                    </g>
                ))}
                <line x1={cx} x2={cx} y1={top - 1} y2={top + maxL + 1} stroke="var(--color-edge)" strokeWidth={0.05} strokeDasharray="0.4 0.3" />
                {PEERS.filter((f) => f.id !== "kaan").map((f) => (
                    <g key={f.id}>
                        <rect
                            x={cx - f.span / 2}
                            y={top}
                            width={f.span}
                            height={f.length}
                            fill="none"
                            stroke="var(--color-topcoat)"
                            strokeWidth={1}
                            strokeDasharray="4 3"
                            vectorEffect="non-scaling-stroke"
                        />
                        <text x={cx + f.span / 2 - 0.2} y={top + f.length - 0.3} fontSize={0.6} textAnchor="end" fill="var(--color-muted)" fontFamily="var(--font-mono)">
                            {f.name}
                        </text>
                    </g>
                ))}
                {PEERS.filter((f) => f.id === "kaan").map((f) => (
                    <g key={f.id}>
                        <rect x={cx - f.span / 2} y={top} width={f.span} height={f.length} fill="none" stroke="var(--color-accent)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                        <text x={cx - f.span / 2 + 0.2} y={top + f.length - 0.3} fontSize={0.6} fill="var(--color-accent)" fontFamily="var(--font-mono)">
                            {f.name}
                        </text>
                    </g>
                ))}
            </svg>
            <dl className="mt-4 grid gap-px border border-edge bg-edge">
                {PEERS.map((f) => (
                    <div key={f.id} className="grid grid-cols-[4rem_1fr] bg-ink px-3 py-1.5">
                        <dt className={`t-tele ${f.id === "kaan" ? "text-accent" : ""}`}>{f.name}</dt>
                        <dd className="t-data text-right text-[0.75rem] text-fg-2">
                            {fmt(f.length, locale)} × {fmt(f.span, locale)} m
                        </dd>
                    </div>
                ))}
            </dl>
            <p className="mt-3 text-[0.75rem] leading-relaxed text-faint">{c.planNote}</p>
        </figure>
    );
}
