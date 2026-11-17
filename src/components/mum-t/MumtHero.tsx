"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useT } from "@/context/LanguageContext";
import { hero } from "@/content/mumt";
import { FormationControls } from "./FormationControls";
import type { FormationMode } from "./useFormation";

const MumTScene = dynamic(() => import("./MumTScene").then((m) => m.MumTScene), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-ground" aria-hidden />,
});

/** Chapter 01: the formation scene with its controls and the page title. */
export function MumtHero() {
    const t = useT();
    const h = t(hero);
    const [mode, setMode] = useState<FormationMode>("FORMATION");
    const ref = useRef<HTMLElement>(null);
    const [onScreen, setOnScreen] = useState(true);
    const [tabVisible, setTabVisible] = useState(true);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0 });
        io.observe(el);
        const onVis = () => setTabVisible(!document.hidden);
        onVis();
        document.addEventListener("visibilitychange", onVis);
        return () => {
            io.disconnect();
            document.removeEventListener("visibilitychange", onVis);
        };
    }, []);

    return (
        <section ref={ref} id="top" aria-labelledby="mumt-title" className="relative flex min-h-[100svh] flex-col overflow-hidden pb-[max(2.5rem,6vh)] pt-14 lg:justify-end lg:pt-28">
            {/* Phones: the scene sits above the copy. Desktop: it fills the upper part of the screen behind it. */}
            <div className="relative h-[42svh] w-full lg:absolute lg:inset-x-0 lg:top-0 lg:h-[64%]" role="img" aria-label={h.sceneLabel}>
                <MumTScene mode={mode} active={onScreen && tabVisible} />
            </div>
            {/* Scrim so the copy stays readable over the scene. */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/2 lg:block"
                style={{ background: "linear-gradient(to top, var(--color-ground) 15%, transparent)" }}
                aria-hidden
            />

            <div className="wrap relative z-10">
                <p className="t-label mb-5 text-fg-2">{h.kicker}</p>
                <h1 id="mumt-title" className="t-display max-w-[14ch] text-fg">
                    {h.title}
                </h1>
                <div className="mt-8 grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-6">
                        <p className="t-lede max-w-[52ch]">{h.statement}</p>
                        <ul className="t-label mt-6 flex flex-wrap gap-x-6 gap-y-2">
                            {h.meta.map((m) => (
                                <li key={m} className="border-t border-line pt-2 text-fg-2">
                                    {m}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                        <FormationControls mode={mode} onChange={setMode} />
                    </div>
                </div>
                <a href="#concept" className="t-label mt-10 inline-flex min-h-11 items-center gap-3 text-muted transition-colors hover:text-fg">
                    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden>
                        <path d="M6 1v17M1 13l5 5 5-5" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                    {h.scroll}
                </a>
            </div>
        </section>
    );
}
