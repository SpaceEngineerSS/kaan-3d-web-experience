"use client";

import { useT } from "@/context/LanguageContext";
import { story } from "@/content/aircraft";

/**
 * The opening: the aircraft (3D, fixed behind the page) with the title over it,
 * then two short beats while the model turns from plan view to profile.
 */
export function Story() {
    const t = useT();
    const s = t(story);

    return (
        <div className="relative z-10">
            <section id="hero" aria-label="KAAN" className="relative flex min-h-[100svh] flex-col justify-end pb-[max(3rem,8vh)] pt-28">
                <div className="wrap">
                    <p className="t-label mb-5 text-fg-2">{s.hero.kicker}</p>
                    <h1 className="t-display text-fg" style={{ fontSize: "clamp(5rem, 3rem + 14vw, 15rem)" }}>
                        KAAN
                    </h1>
                    <div className="mt-8 grid gap-8 md:grid-cols-12">
                        <p className="t-lede max-w-[46ch] [text-shadow:0_1px_14px_var(--color-ground),0_0_2px_var(--color-ground)] md:col-span-6 lg:col-span-5">{s.hero.statement}</p>
                        <ul className="t-label flex flex-col gap-2 md:col-span-4 md:col-start-9 md:self-end">
                            {s.hero.meta.map((m) => (
                                <li key={m} className="border-t border-line pt-2 text-fg-2">
                                    {m}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <a href="#overview" className="t-label mt-12 inline-flex items-center gap-3 text-muted transition-colors hover:text-fg">
                        <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden>
                            <path d="M6 1v17M1 13l5 5 5-5" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                        {s.hero.scroll}
                    </a>
                </div>
            </section>

            {s.beats.map((b, i) => (
                <section
                    key={b.id}
                    id={b.id}
                    aria-labelledby={`${b.id}-title`}
                    className="relative flex min-h-[100svh] items-center py-24"
                >
                    <div className="wrap">
                        <div className={`max-w-xl ${i % 2 === 1 ? "md:ml-auto" : ""}`}>
                            <div className="flex items-baseline gap-3 border-t border-line pt-3">
                                <span className="t-data text-sm text-signal">{String(i + 1).padStart(2, "0")}</span>
                                <span className="t-label">{b.label}</span>
                            </div>
                            <h2 id={`${b.id}-title`} className="t-h2 mt-6" data-reveal="mask">
                                {b.title}
                            </h2>
                            <p className="t-body mt-6 max-w-[52ch] [text-shadow:0_1px_14px_var(--color-ground),0_0_2px_var(--color-ground)]" data-reveal>
                                {b.body}
                            </p>
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
}
