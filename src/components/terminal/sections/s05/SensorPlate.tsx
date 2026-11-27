"use client";

import { useLanguage } from "@/context/LanguageContext";
import { s02Copy } from "@/content/terminal";
import { s05Copy } from "@/content/s05";
import { Plate } from "./shared";

/** The airframe's sensors, weapons and analyst observations, each with how solid its source is. */
export function SensorPlate() {
    const { locale } = useLanguage();
    const c = s05Copy[locale];
    const p = s02Copy[locale];

    return (
        <div id="s05-plate-03" className="mb-24 scroll-mt-24 md:mb-32">
            <Plate n="03" label={p.pinsTitle} title={c.pinsTitle} />
            <ol className="mt-6 grid gap-x-10 md:grid-cols-2">
                {p.pins.map((pin, i) => (
                    <li key={pin.name} className="grid grid-cols-[2.5ch_minmax(0,1fr)_auto] items-baseline gap-x-4 border-b border-edge py-3">
                        <span className="t-tele text-faint">{String(i + 1).padStart(2, "0")}</span>
                        <span className="min-w-0">
                            <span className="block font-display text-[1.125rem] font-semibold uppercase tracking-[0.01em] text-fg">{pin.name}</span>
                            <span className="t-tele mt-1 block normal-case tracking-[0.02em]">{pin.sub}</span>
                        </span>
                        <span className="t-tele text-right text-fg-2">{pin.status}</span>
                    </li>
                ))}
            </ol>
            <p className="mt-3 max-w-[80ch] text-[0.8125rem] leading-relaxed text-muted">{p.note}</p>
        </div>
    );
}
