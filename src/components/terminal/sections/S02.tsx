"use client";

import { useRef } from "react";
import { useT } from "@/context/LanguageContext";
import { useSectionFade } from "@/components/terminal/useSectionFade";

import { s02Copy } from "@/content/terminal";

/** 02 // Airframe & low observability: the camera sits at the belly/chine while the scan reveals bays and S-ducts. */
export function S02() {
    const section = useRef<HTMLElement>(null);
    const block = useRef<HTMLDivElement>(null);
    useSectionFade(section, block);
    const t = useT();
    const c = t(s02Copy);

    return (
        <section ref={section} id="s02" aria-labelledby="s02-title" className="pointer-events-none relative min-h-[150svh]">
            <div ref={block} className="relative min-h-[100svh] md:sticky md:top-0 md:h-[100svh]">
                {/* Shade behind the text column so it reads over the point cloud. */}
                <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-[46%] bg-gradient-to-r from-ink via-ink/85 to-transparent md:block" />
                <div className="wrap relative grid min-h-[100svh] grid-cols-12 content-center md:h-full md:min-h-0 gap-x-6 pb-14 pt-20 sm:pb-16 md:pt-28">
                    <div data-keepout className="col-span-12 max-w-[42ch] bg-ink/92 md:col-span-6 md:p-4 lg:col-span-5 lg:bg-transparent lg:p-0">
                        <p className="t-tele mb-3 text-fg-2">{c.index}</p>
                        <h2 id="s02-title" className="t-h2 text-fg">
                            {c.title}
                        </h2>
                        <div className="mt-5 space-y-2 border-t border-edge pt-4">
                            {c.paragraphs.map((p) => (
                                <p key={p} className="t-body m-0 text-[var(--step--1)]">
                                    {p}
                                </p>
                            ))}
                        </div>

                        <p className="t-tele mt-6 border-b border-edge-2 pb-1.5 text-fg">{c.pinsTitle}</p>
                        <ul className="m-0 list-none p-0">
                            {c.pins.map((pin, i) => (
                                <li key={pin.name} className="grid grid-cols-[2ch_minmax(0,1fr)_minmax(0,15ch)] items-baseline gap-x-3 border-b border-edge py-1.5">
                                    <span className="t-tele text-faint">{String(i + 1).padStart(2, "0")}</span>
                                    <span className="min-w-0">
                                        <span className="t-data block text-[12px] tracking-[0.08em] text-fg">{pin.name}</span>
                                        <span className="t-tele block text-[10px]">{pin.sub}</span>
                                    </span>
                                    <span className="t-tele text-right text-fg-2">{pin.status}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="t-tele mt-3 normal-case tracking-[0.04em] text-faint">{c.note}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
