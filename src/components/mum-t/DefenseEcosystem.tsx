"use client";

import { useT } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { ecosystem } from "@/content/mumt";

/** Chapter 09: programme status and the organisations behind the systems on this page. */
export function DefenseEcosystem() {
    const t = useT();
    const c = t(ecosystem);

    return (
        <Chapter id="ecosystem" index={9} label={c.label} title={c.title} lede={c.lede} solid className="py-24 md:py-36">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-5">
                    <h3 className="t-h3">{c.statusTitle}</h3>
                    <ol className="relative mt-6 border-l border-edge-2 pl-6">
                        {c.status.map((s) => (
                            <li key={s.date} className="relative pb-6 last:pb-0" data-reveal>
                                <span className="absolute -left-[1.6rem] top-2 block h-2 w-2 border border-topcoat bg-ink" aria-hidden />
                                <p className="t-data text-sm text-muted">{s.date}</p>
                                <p className="mt-1 text-[0.9375rem] leading-relaxed text-fg-2">
                                    {s.text}
                                    {s.note && <span className="t-label ml-2 inline-block text-caution">{s.note}</span>}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="lg:col-span-7">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[36rem] border-collapse text-left">
                            <caption className="sr-only">{c.title}</caption>
                            <thead>
                                <tr className="t-label border-b border-edge-2">
                                    <th scope="col" className="py-3 pr-4 font-normal">{c.colCompany}</th>
                                    <th scope="col" className="py-3 pr-4 font-normal">{c.colRole}</th>
                                    <th scope="col" className="py-3 font-normal">{c.colItems}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {c.companies.map((co) => (
                                    <tr key={co.name} className="border-b border-edge align-baseline" data-reveal>
                                        <th scope="row" className="py-4 pr-4 font-display text-lg font-semibold uppercase text-fg">{co.name}</th>
                                        <td className="py-4 pr-4 text-[0.9375rem] text-muted">{co.role}</td>
                                        <td className="py-4 text-[0.9375rem] text-fg-2">{co.items}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <SourceNote>{c.source}</SourceNote>
                </div>
            </div>
        </Chapter>
    );
}
