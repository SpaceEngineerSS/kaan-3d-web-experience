"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const copy = {
    tr: {
        label: "Sonraki sayfa",
        body: "KAAN'ın ANKA-3 ve KIZILELMA gibi insansız savaş uçaklarıyla birlikte, onları kanat uçağı olarak yönlendirerek uçması planlanıyor. İnsanlı–insansız ekip kavramını ayrı bir sayfada anlatıyoruz.",
        link: "İnsanlı–insansız ekip (MUM-T)",
    },
    en: {
        label: "Next page",
        body: "KAAN is planned to fly alongside unmanned combat aircraft such as ANKA-3 and KIZILELMA, directing them as wingmen. The manned–unmanned teaming concept has its own page.",
        link: "Manned–unmanned teaming (MUM-T)",
    },
};

/** Closing link from the home page to /mum-t. Compact on purpose. */
export function MumtTeaser() {
    const { locale } = useLanguage();
    const c = copy[locale];

    return (
        <section aria-labelledby="mumt-teaser-title" className="chapter chapter--tight chapter--solid">
            <div className="wrap">
                <div className="grid gap-6 border-t border-line-strong pt-8 md:grid-cols-12 md:gap-8">
                    <p id="mumt-teaser-title" className="t-label md:col-span-3 lg:col-span-2">
                        {c.label}
                    </p>
                    <p className="t-lede max-w-[52ch] md:col-span-6" data-reveal>
                        {c.body}
                    </p>
                    <div className="md:col-span-3 md:self-end md:justify-self-end lg:col-span-4">
                        <Link href="/mum-t" className="btn">
                            {c.link}
                            <span aria-hidden>→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
