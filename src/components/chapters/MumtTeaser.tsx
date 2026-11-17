"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Film } from "@/components/site/Film";

const copy = {
    tr: {
        label: "Sonraki sayfa",
        title: "KAAN ve ANKA-3",
        body: "KAAN'ın ANKA-3 insansız savaş uçağıyla birlikte, onu kanat uçağı olarak yönlendirerek uçması planlanıyor. İnsanlı–insansız ekip kavramı ayrı bir sayfada.",
        link: "İnsanlı–insansız ekip (MUM-T)",
        credit: "KAAN P0, 2024 · TUSAŞ görüntüleri",
    },
    en: {
        label: "Next page",
        title: "KAAN and ANKA-3",
        body: "KAAN is planned to fly alongside the ANKA-3 unmanned combat aircraft, directing it as a wingman. The manned–unmanned teaming concept has its own page.",
        link: "Manned–unmanned teaming (MUM-T)",
        credit: "KAAN P0, 2024 · Turkish Aerospace footage",
    },
};

/** Closing link from the home page to /mum-t, over a muted loop of real footage. Compact on purpose. */
export function MumtTeaser() {
    const { locale } = useLanguage();
    const c = copy[locale];

    return (
        <section aria-labelledby="mumt-teaser-title" className="relative isolate overflow-hidden bg-ink">
            <Film name="wide" cover className="-z-10" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-ink/70" />
            <div className="wrap flex min-h-[26rem] flex-col justify-end py-14 md:min-h-[32rem] md:py-20">
                <div className="plate grid gap-6 p-6 md:grid-cols-12 md:gap-8 md:p-8">
                    <div className="md:col-span-4">
                        <p className="t-label">{c.label}</p>
                        <h2 id="mumt-teaser-title" className="t-h2 mt-3 text-[var(--step-3)]">
                            {c.title}
                        </h2>
                    </div>
                    <p className="t-lede max-w-[52ch] md:col-span-5 md:self-end" data-reveal>
                        {c.body}
                    </p>
                    <div className="md:col-span-3 md:self-end md:justify-self-end">
                        <Link href="/mum-t" className="btn">
                            {c.link}
                            <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden>
                                <path d="M1 5h14M11 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" fill="none" />
                            </svg>
                        </Link>
                    </div>
                </div>
                <p className="t-label mt-3 text-[0.6875rem] text-faint">{c.credit}</p>
            </div>
        </section>
    );
}
