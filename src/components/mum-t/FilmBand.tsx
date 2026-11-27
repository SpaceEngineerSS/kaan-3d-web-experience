"use client";

import { useT } from "@/context/LanguageContext";
import { Film } from "@/components/site/Film";
import { filmBand } from "@/content/mumt";

/** Full-bleed real KAAN P0 footage between the hero and the first chapter. */
export function FilmBand() {
    const t = useT();
    const c = t(filmBand);

    return (
        <section aria-labelledby="mumt-film-title" className="relative isolate flex min-h-[78svh] items-end overflow-hidden border-y border-edge bg-ink">
            <Film name="wide" cover className="-z-10" />
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{ background: "linear-gradient(to top, var(--color-ink) 4%, color-mix(in srgb, var(--color-ink) 55%, transparent) 45%, transparent 75%)" }}
                aria-hidden
            />
            <div className="wrap pb-12 pt-40 md:pb-16">
                <p className="t-label text-accent">{c.label}</p>
                <h2 id="mumt-film-title" className="t-h2 mt-4 max-w-[20ch] text-fg" data-reveal>
                    {c.statement}
                </h2>
                <p className="mt-8 flex flex-wrap gap-x-6 gap-y-1 text-[0.8125rem] text-fg-2">
                    <span>{c.caption}</span>
                    <span className="t-label text-[0.6875rem]">{c.credit}</span>
                </p>
            </div>
        </section>
    );
}
