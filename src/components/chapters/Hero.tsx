"use client";

import { useT } from "@/context/LanguageContext";
import { heroCopy } from "@/content/home";
import { Film } from "@/components/site/Film";

const DOT: Record<"done" | "active" | "planned", string> = {
    done: "bg-hmd",
    active: "bg-caution",
    planned: "border border-muted",
};

/** The first screen: real KAAN flight footage, the name, and where the programme stands today. */
export function Hero() {
    const t = useT();
    const c = t(heroCopy);

    return (
        <section id="hero" aria-label="KAAN" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink">
            <Film name="chase" cover priority />
            {/* Shade only where the type sits. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink from-10% via-ink/70 via-45% to-transparent to-75%" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />

            <div className="wrap relative z-10 pb-[max(2rem,6vh)] pt-32">
                <p className="t-label inline-block bg-ink/80 px-2 py-1 text-fg">{c.kicker}</p>
                <h1 className="t-display mt-2 text-fg" style={{ fontSize: "clamp(6rem, 3rem + 17vw, 19rem)" }}>
                    KAAN
                </h1>
                <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
                    <p className="t-lede max-w-[44ch] text-fg lg:col-span-5">{c.statement}</p>
                    <div className="lg:col-span-6 lg:col-start-7">
                        <p className="t-label mb-2 text-fg-2">{c.statusTitle}</p>
                        <ul className="plate divide-y divide-edge">
                            {c.status.map((s) => (
                                <li key={s.k} className="flex items-baseline gap-4 px-4 py-2.5">
                                    <span className={`inline-block h-2 w-2 shrink-0 translate-y-[-1px] ${DOT[s.state]}`} aria-hidden />
                                    <span className="t-data w-24 shrink-0 text-sm text-fg">{s.k}</span>
                                    <span className="text-[0.875rem] text-fg-2">{s.v}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    <a href="#first-flight" className="t-label inline-flex min-h-11 items-center gap-3 text-fg hover:text-hmd">
                        <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden>
                            <path d="M6 1v17M1 13l5 5 5-5" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                        {c.scroll}
                    </a>
                    <p className="t-label text-[0.6875rem] text-fg-2/80">{c.footage}</p>
                </div>
            </div>
        </section>
    );
}
