"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cockpit } from "@/content/cockpit";
import { s05Copy } from "@/content/s05";
import { Plate } from "./shared";

export function VisorPlate() {
    const { locale } = useLanguage();
    const c = s05Copy[locale];
    const t = cockpit[locale].tulgar;
    return (
        <div className="mb-24 md:mb-32">
            <Plate n="01" label={c.hmdsLabel} title={c.hmdsTitle} />
            <div className="grid gap-px border-b border-edge bg-edge md:grid-cols-12">
                <div className="bg-ink p-4 md:col-span-7 md:p-6">
                    <p className="t-label mb-3">{t.title}</p>
                    <p className="t-body max-w-[42ch]">{t.body}</p>
                </div>
                <div className="grid content-start gap-px bg-edge md:col-span-5">
                    <dl className="grid grid-cols-[9rem_1fr] gap-px bg-edge">
                        {t.specs.slice(0, 4).map((s) => (
                            <div key={s.term} className="contents">
                                <dt className="t-tele bg-ink px-4 py-3">{s.term}</dt>
                                <dd className="t-data bg-ink px-4 py-3 text-[0.8125rem] text-fg-2">{s.value}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="bg-ink p-4 text-[0.8125rem] leading-relaxed text-muted">
                        <span className="t-tele mr-2 text-caution">NOTE</span>
                        {c.visorNote}
                    </p>
                </div>
            </div>
            <p className="mt-2 text-[0.75rem] leading-relaxed text-faint">{t.source}</p>
        </div>
    );
}
