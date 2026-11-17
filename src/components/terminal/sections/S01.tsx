"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/context/LanguageContext";
import { s01Copy } from "@/content/terminal";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";
import { FlirFeed } from "@/components/terminal/FlirFeed";
import { useSectionFade } from "@/components/terminal/useSectionFade";


/** 01 // First flight & air superiority: full-bleed opening over the 3D scene. */
export function S01() {
    const t = useT();
    const c = t(s01Copy);
    const { reducedMotion } = useDeviceProfile();
    const section = useRef<HTMLElement>(null);
    const [open, setOpen] = useState(false);
    const autoDone = useRef(false);
    const block = useRef<HTMLDivElement>(null);
    useSectionFade(section, block);

    // Open the image telemetry once, when the reader has scrolled ~60% through the pinned part of S01.
    useEffect(() => {
        const el = section.current;
        if (!el) return;
        const onScroll = () => {
            if (autoDone.current) return;
            const r = el.getBoundingClientRect();
            const span = Math.max(1, r.height - window.innerHeight);
            if (-r.top / span > 0.6) {
                autoDone.current = true;
                setOpen(true);
                window.removeEventListener("scroll", onScroll);
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const toggle = () => {
        autoDone.current = true;
        setOpen((o) => !o);
    };

    return (
        <section ref={section} id="s01" aria-labelledby="s01-title" className="pointer-events-none relative min-h-[150svh]">
            <div ref={block} className="min-h-[100svh] md:sticky md:top-0 md:h-[100svh]">
                <div className="wrap grid min-h-[100svh] grid-cols-12 grid-rows-[auto_1fr_auto] gap-x-6 pb-14 pt-20 sm:pb-16 md:pt-28">
                    {/* Top-left: name on the grid edge */}
                    <header className="col-span-12 md:col-span-8">
                        <p className="t-tele mb-3 text-fg-2">{c.index}</p>
                        <h1 id="s01-title" className="t-display -ml-[0.04em] text-[clamp(5.5rem,20vw,17rem)] text-fg">
                            KAAN
                        </h1>
                        <p className="t-tele mt-3 border-t border-edge pt-2">{c.line}</p>
                    </header>

                    {/* Phones: leave the model visible between the title and the log. */}
                    <div aria-hidden className="col-span-12 h-[42svh] md:hidden" />

                    {/* Middle-left: FLIR feed when open */}
                    <div id="s01-feed" className="col-span-12 self-end md:row-start-2 sm:col-span-8 md:col-span-5 lg:col-span-4">
                        {open && (
                            <div className="pointer-events-auto pb-6">
                                <FlirFeed src="/media/clips/chase.mp4" still="/media/clips/chase.jpg" stillAlt={c.stillAlt} label={c.feedLabel} caption={c.caption} reducedMotion={reducedMotion} />
                            </div>
                        )}
                    </div>

                    {/* Bottom-right: first-flight log as hairline-ruled telemetry rows */}
                    <div className="col-span-12 border border-edge bg-ink/92 p-3 sm:col-span-8 sm:col-start-5 md:row-start-3 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
                        <p className="t-tele flex justify-between border-b border-edge-2 pb-1.5 text-fg">
                            <span>{c.logTitle}</span>
                            <span className="text-hmd">REC</span>
                        </p>
                        <dl className="m-0">
                            {c.log.map((row) => (
                                <div key={row.k} className="t-tele flex justify-between gap-4 border-b border-edge py-[5px]">
                                    <dt className="text-fg-2">{row.k}</dt>
                                    <dd className="m-0 text-right text-fg">{row.v}</dd>
                                </div>
                            ))}
                            <div className="t-tele flex justify-between gap-4 border-b border-edge-2 py-[5px]">
                                <dt className="text-fg-2">{c.thrust.k}</dt>
                                <dd className="m-0 text-right text-fg">{c.thrust.v}</dd>
                            </div>
                        </dl>
                        <button type="button" className="toggle pointer-events-auto mt-2" aria-pressed={open} aria-expanded={open} aria-controls="s01-feed" data-live={open} onClick={toggle}>
                            {open ? c.close : c.open}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
