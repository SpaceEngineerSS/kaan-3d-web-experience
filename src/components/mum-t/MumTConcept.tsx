"use client";

import { useT } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { concept } from "@/content/mumt";

/** Chapter 02: what MUM-T is, the STANAG 4586 levels, and single aircraft vs team. */
export function MumTConcept() {
    const t = useT();
    const c = t(concept);

    return (
        <Chapter id="concept" index={2} label={c.label} title={c.title} lede={c.lede} solid className="py-24 md:py-36">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                <div className="space-y-5 lg:col-span-6">
                    {c.body.map((p) => (
                        <p key={p.slice(0, 24)} className="t-body max-w-[60ch]" data-reveal>
                            {p}
                        </p>
                    ))}
                </div>

                <figure className="lg:col-span-5 lg:col-start-8" data-reveal>
                    <figcaption>
                        <p className="t-h3">{c.loiTitle}</p>
                        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{c.loiIntro}</p>
                    </figcaption>
                    <ol className="mt-6 border-t border-edge-2">
                        {c.loi.map((l, i) => (
                            <li key={l.level} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-edge py-4">
                                <span className="t-num text-3xl text-fg">{l.level}</span>
                                <div>
                                    <p className="font-medium text-fg">{l.title}</p>
                                    <p className="mt-1 text-[0.9375rem] leading-snug text-fg-2">{l.body}</p>
                                    {/* Authority grows with each level. */}
                                    <div className="mt-3 h-1 bg-edge" aria-hidden>
                                        <div className="h-full bg-topcoat" style={{ width: `${((i + 1) / c.loi.length) * 100}%` }} />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ol>
                </figure>
            </div>

            <div className="mt-20">
                <h3 className="t-h3" data-reveal>
                    {c.compareTitle}
                </h3>
                <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[40rem] border-collapse text-left">
                        <caption className="sr-only">{c.compareTitle}</caption>
                        <thead>
                            <tr className="t-label border-b border-edge-2">
                                <th scope="col" className="w-1/5 py-3 pr-4 font-normal">{c.colTopic}</th>
                                <th scope="col" className="py-3 pr-4 font-normal">{c.colSingle}</th>
                                <th scope="col" className="py-3 font-normal text-fg">{c.colTeam}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {c.compare.map((r) => (
                                <tr key={r.topic} className="border-b border-edge align-baseline" data-reveal>
                                    <th scope="row" className="py-4 pr-4 font-normal text-fg">{r.topic}</th>
                                    <td className="py-4 pr-4 text-[0.9375rem] text-muted">{r.single}</td>
                                    <td className="py-4 text-[0.9375rem] text-fg-2">{r.team}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <SourceNote>{c.source}</SourceNote>
            </div>
        </Chapter>
    );
}
