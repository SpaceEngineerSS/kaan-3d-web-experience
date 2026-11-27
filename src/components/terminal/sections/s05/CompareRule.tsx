"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { comparisonCopy, type Fighter } from "@/content/comparison";
import { s05Copy } from "@/content/s05";
import { fmt, PEERS, Plate, yearsSince } from "./shared";
import { PlanView } from "./PlanView";

type Metric = {
    key: string;
    label: string;
    unit: string;
    value: (f: Fighter) => number;
    show: (f: Fighter) => string;
    est: (f: Fighter) => boolean;
};

export function CompareRule() {
    const { locale } = useLanguage();
    const c = s05Copy[locale];
    const cc = comparisonCopy[locale];
    const estOf = (f: Fighter, k: "length" | "span" | "mtow") => !!f.estimated?.includes(k);

    // Thrust is omitted: no sourced per-engine figures for F-35A / Su-57 in src/content.
    const metrics: Metric[] = [
        {
            key: "length",
            label: cc.cols.length,
            unit: "m",
            value: (f) => f.length,
            show: (f) => fmt(f.length, locale),
            est: (f) => estOf(f, "length"),
        },
        {
            key: "span",
            label: cc.cols.span,
            unit: "m",
            value: (f) => f.span,
            show: (f) => fmt(f.span, locale),
            est: (f) => estOf(f, "span"),
        },
        {
            key: "mtow",
            label: cc.cols.mtow,
            unit: "kg",
            value: (f) => f.mtow,
            show: (f) => fmt(f.mtow, locale, 0),
            est: (f) => estOf(f, "mtow"),
        },
        {
            key: "ff",
            label: `${cc.cols.firstFlight} · ${c.sinceFirst}`,
            unit: c.years,
            value: (f) => yearsSince(f.firstFlight),
            show: (f) => `${f.firstFlight.split("-").reverse().join(".")} · ${fmt(yearsSince(f.firstFlight), locale)}`,
            est: () => false,
        },
    ];

    const [key, setKey] = useState(metrics[0].key);
    const m = metrics.find((x) => x.key === key) ?? metrics[0];
    const max = Math.max(...PEERS.map(m.value));
    // A ruler scale with round ticks: 4–6 major divisions up to just past the largest value.
    const stepRaw = (max * 1.08) / 5;
    const mag = Math.pow(10, Math.floor(Math.log10(stepRaw)));
    const step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((v) => v >= stepRaw) ?? stepRaw;
    const end = Math.ceil((max * 1.04) / step) * step;
    const ticks = Array.from({ length: Math.round(end / step) + 1 }, (_, i) => i * step);

    return (
        <div className="mb-24 md:mb-32">
            <Plate n="02" label={c.matrixLabel} title={c.matrixTitle} />
            <div className="mt-6 grid gap-x-10 gap-y-10 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <div role="tablist" aria-label={c.matrixLabel} className="seg flex-wrap">
                        {metrics.map((x) => (
                            <button key={x.key} type="button" role="tab" aria-selected={x.key === key} onClick={() => setKey(x.key)}>
                                {x.label}
                            </button>
                        ))}
                    </div>

                    <figure className="mt-8" aria-live="polite">
                        <figcaption className="t-tele mb-4 flex justify-between">
                            <span>{m.label}</span>
                            <span className="text-faint">{m.unit}</span>
                        </figcaption>
                        <div className="relative">
                            <ul className="grid gap-5">
                                {PEERS.map((f) => {
                                    const kaan = f.id === "kaan";
                                    return (
                                        <li key={f.id} className="grid grid-cols-[4.5rem_1fr] items-center gap-4">
                                            <span className={`t-tele ${kaan ? "text-fg" : ""}`}>{f.name}</span>
                                            <span className="relative block h-7">
                                                <span
                                                    className={`absolute inset-y-[11px] left-0 transition-[width] duration-700 ease-[var(--ease-out-quart)] ${kaan ? "bg-accent" : "bg-fg-2/35"} ${m.est(f) ? "opacity-60" : ""}`}
                                                    style={{ width: `${(m.value(f) / end) * 100}%` }}
                                                />
                                                <span
                                                    className="absolute top-0 h-full w-px bg-fg transition-[left] duration-700 ease-[var(--ease-out-quart)]"
                                                    style={{ left: `${(m.value(f) / end) * 100}%` }}
                                                />
                                                <span
                                                    className={`t-data absolute -top-0.5 whitespace-nowrap pl-2 text-[0.8125rem] tabular-nums transition-[left] duration-700 ease-[var(--ease-out-quart)] ${kaan ? "text-fg" : "text-fg-2"}`}
                                                    style={{
                                                        left: `min(${(m.value(f) / end) * 100}%, calc(100% - 9rem))`,
                                                    }}
                                                >
                                                    {m.show(f)}
                                                    {m.est(f) && <span className="ml-1 text-muted">*{cc.estimate}</span>}
                                                </span>
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div aria-hidden className="ml-[5.5rem] mt-4 border-t border-edge-2">
                                <div className="relative h-6">
                                    {ticks.map((t) => (
                                        <span key={t} className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${(t / end) * 100}%` }}>
                                            <span className="h-2 w-px bg-edge-2" />
                                            <span className="t-tele mt-0.5 text-[10px] text-faint">{fmt(t, locale, 0)}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </figure>

                    <div className="mt-10 grid gap-px border-y border-edge bg-edge">
                        <div className="grid gap-px bg-edge sm:grid-cols-[11rem_1fr]">
                            <div className="bg-ink px-4 py-3">
                                <p className="t-tele">{c.genStatus}</p>
                            </div>
                            <ul className="grid gap-px bg-edge">
                                {PEERS.map((f) => (
                                    <li key={f.id} className="grid grid-cols-[3.75rem_2rem_1fr] gap-3 bg-ink px-4 py-2.5">
                                        <span className={`t-tele ${f.id === "kaan" ? "text-fg" : ""}`}>{f.name}</span>
                                        <span className="t-data text-[0.75rem] text-fg-2">{f.generation[locale]}</span>
                                        <span className="text-[0.8125rem] leading-snug text-fg-2">
                                            {f.status[locale]}
                                            <span className="t-tele mt-0.5 block text-faint normal-case tracking-normal">{f.engines[locale]}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <PlanView />
            </div>
            <p className="mt-2 text-[0.75rem] leading-relaxed text-faint">{cc.source}</p>
        </div>
    );
}
