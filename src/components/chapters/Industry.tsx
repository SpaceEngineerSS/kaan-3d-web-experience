"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { exportDeal, industryCopy, production, workShare } from "@/content/industry";

export function Industry() {
    const { locale } = useLanguage();
    const c = industryCopy[locale];

    return (
        <Chapter id="industry" index={9} label={c.label} title={c.title} lede={c.lede} solid>
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
                {/* Work shares */}
                <div className="lg:col-span-8">
                    <h3 className="t-label mb-4">{c.workTitle}</h3>
                    <table className="w-full border-collapse text-left">
                        <caption className="sr-only">{c.workTitle}</caption>
                        <thead>
                            <tr className="t-label border-b border-line-strong">
                                <th scope="col" className="py-3 pr-4 font-normal">{c.colCompany}</th>
                                <th scope="col" className="py-3 pr-4 font-normal">{c.colWork}</th>
                                <th scope="col" className="hidden py-3 font-normal sm:table-cell">{c.colStatus}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workShare.map((w, i) => (
                                <tr key={`${w.company}-${i}`} className="border-b border-line align-baseline" data-reveal>
                                    <th scope="row" className="py-4 pr-4 font-normal">
                                        <span className="t-h3 block whitespace-nowrap text-[clamp(1rem,0.9rem+0.5vw,1.25rem)] text-fg">{w.company}</span>
                                    </th>
                                    <td className="t-body py-4 pr-4 text-[0.9375rem]">
                                        {w.work[locale]}
                                        <span className={`t-label mt-1 block sm:hidden ${w.status === "reported" ? "text-faint" : "text-fg-2"}`}>{c.status[w.status]}</span>
                                    </td>
                                    <td className="hidden py-4 sm:table-cell">
                                        <span className={`t-label whitespace-nowrap ${w.status === "reported" ? "text-faint" : "text-fg-2"}`}>{c.status[w.status]}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <SourceNote>{c.source}</SourceNote>
                </div>

                {/* Production and export */}
                <div className="space-y-14 lg:col-span-4">
                    <section aria-labelledby="industry-plan">
                        <h3 id="industry-plan" className="t-label mb-4">{c.planTitle}</h3>
                        <dl className="border-t border-line-strong">
                            {production.map((p) => (
                                <div key={p.term.en} className="border-b border-line py-5" data-reveal>
                                    <dt className="flex items-baseline justify-between gap-4">
                                        <span className="t-h3 text-fg">{p.term[locale]}</span>
                                        <span className="t-data text-sm text-fg-2">{p.when[locale]}</span>
                                    </dt>
                                    <dd className="t-body mt-2 text-[0.9375rem]">
                                        {p.detail[locale]}
                                        {p.planned && <span className="t-label ml-2 text-faint">{c.plannedLabel}</span>}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    <section aria-labelledby="industry-export" className="panel ticks p-5 sm:p-6" data-reveal>
                        <h3 id="industry-export" className="t-label mb-2">{c.exportTitle}</h3>
                        <p className="t-num text-[clamp(3rem,2.4rem+2.6vw,4.5rem)] text-signal">48</p>
                        <dl className="mt-5 divide-y divide-line border-t border-line">
                            {exportDeal.rows.map((r) => (
                                <div key={r.term.en} className="grid grid-cols-[6.5rem_1fr] gap-3 py-2.5 text-[0.9375rem]">
                                    <dt className="t-label pt-0.5">{r.term[locale]}</dt>
                                    <dd className="text-fg-2">{r.value[locale]}</dd>
                                </div>
                            ))}
                        </dl>
                        <p className="mt-4 text-[0.8125rem] leading-relaxed text-faint">{exportDeal.note[locale]}</p>
                    </section>
                </div>
            </div>
        </Chapter>
    );
}
