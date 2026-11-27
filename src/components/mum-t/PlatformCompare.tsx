"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { planDims, platformRows, platforms } from "@/content/mumt";

/** Chapter 06: KAAN and ANKA-3 compared, with a same-scale plan-view drawing. */
export function PlatformCompare() {
    const { locale } = useLanguage();
    const c = platforms[locale];

    return (
        <Chapter id="platforms" index={6} label={c.label} title={c.title} lede={c.lede} solid className="py-24 md:py-36">
            <figure className="mb-14" data-reveal>
                <div className="relative aspect-[16/9] overflow-hidden bg-ink-2 sm:aspect-[21/8]">
                    {/* The source frame is letterboxed; the crop keeps only the picture. */}
                    <Image src="/media/posters/anka3.jpg" alt={c.photoAlt} width={1280} height={720} sizes="100vw" className="absolute inset-0 h-full w-full scale-[1.25] object-cover sm:scale-100" />
                </div>
                <figcaption className="t-label mt-2 text-[0.6875rem]">{c.photoCredit}</figcaption>
            </figure>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[34rem] border-collapse text-left">
                            <caption className="sr-only">{c.title}</caption>
                            <thead>
                                <tr className="t-label border-b border-edge-2">
                                    <th scope="col" className="py-3 pr-4 font-normal">{c.colItem}</th>
                                    <th scope="col" className="py-3 pr-4 font-normal text-accent">KAAN</th>
                                    <th scope="col" className="py-3 font-normal text-fg">ANKA-3</th>
                                </tr>
                            </thead>
                            <tbody>
                                {platformRows.map((r) => (
                                    <tr key={r.key} className="border-b border-edge align-baseline">
                                        <th scope="row" className="py-3 pr-4 font-normal text-muted">{r.label[locale]}</th>
                                        <td className="t-data py-3 pr-4 text-[0.9375rem] text-fg">{r.kaan[locale]}</td>
                                        <td className="t-data py-3 text-[0.9375rem] text-fg">{r.anka[locale]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <SourceNote>{c.source}</SourceNote>
                </div>

                <div className="space-y-12 lg:col-span-5">
                    <figure data-reveal>
                        <figcaption className="t-label">{c.scaleTitle}</figcaption>
                        <PlanDrawing />
                        <SourceNote>{c.scaleNote}</SourceNote>
                    </figure>

                    <div data-reveal>
                        <p className="t-h3">{c.rolesTitle}</p>
                        <ul className="mt-4 border-t border-edge">
                            {c.roles.map((r) => (
                                <li key={r} className="border-b border-edge py-3 text-fg-2">
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Chapter>
    );
}

/** Three length × span frames on one grid: KAAN, ANKA-3 and, for scale, Süper Şimşek. */
function PlanDrawing() {
    const s = 13; // px per metre
    const W = 500;
    const H = 360;
    const oy = 30;
    const items = [
        { name: "KAAN", d: planDims.kaan, x: 30, own: true, end: false },
        { name: "ANKA-3", d: planDims.anka, x: 250, own: false, end: false },
        { name: "Süper Şimşek", d: planDims.simsek, x: 450, own: false, end: true },
    ];

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="border border-edge-2 bg-black mt-4 w-full" role="img" aria-label={items.map((i) => `${i.name} ${i.d.length} × ${i.d.span} m`).join(", ")}>
            <defs>
                <pattern id="plan-grid" width={s} height={s} patternUnits="userSpaceOnUse">
                    <path d={`M ${s} 0 L 0 0 0 ${s}`} fill="none" stroke="var(--color-edge)" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width={W} height={H} fill="#000" />
            <rect width={W} height={H} fill="url(#plan-grid)" opacity="0.5" />
            {items.map((it) => {
                const w = it.d.span * s;
                const h = it.d.length * s;
                const stroke = it.own ? "var(--color-accent)" : "var(--color-fg-2)";
                return (
                    <g key={it.name} fontFamily="var(--font-mono)" fontSize="11">
                        <rect x={it.x} y={oy} width={w} height={h} fill={it.own ? "rgba(224,108,43,0.08)" : "none"} stroke={stroke} strokeDasharray={it.own ? undefined : "4 4"} />
                        <line x1={it.x + w / 2} y1={oy - 10} x2={it.x + w / 2} y2={oy + h + 10} stroke="var(--color-edge-2)" strokeDasharray="10 3 2 3" />
                        <text x={it.end ? it.x + w : it.x} y={oy + h + 26} textAnchor={it.end ? "end" : "start"} fill={it.own ? "var(--color-accent)" : "var(--color-fg)"}>
                            {it.name}
                        </text>
                        <text x={it.end ? it.x + w : it.x} y={oy + h + 42} textAnchor={it.end ? "end" : "start"} fill="var(--color-muted)">
                            {it.d.length} × {it.d.span} m
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
