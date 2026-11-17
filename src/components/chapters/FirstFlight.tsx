"use client";

import { useT } from "@/context/LanguageContext";
import { firstFlightCopy } from "@/content/home";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { Film } from "@/components/site/Film";

/** Chapter 01: the first flight as a flight-test card, beside the real take-off footage. */
export function FirstFlight() {
    const t = useT();
    const c = t(firstFlightCopy);

    return (
        <Chapter id="first-flight" index={1} label={c.label} title={c.title} lede={c.lede} solid>
            <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <Film name="takeoff" caption={c.filmCaption} credit="TUSAŞ" />
                    <div className="mt-8 grid gap-6 sm:grid-cols-3">
                        {c.paragraphs.map((p) => (
                            <p key={p.slice(0, 16)} className="t-body text-[0.9375rem]" data-reveal>
                                {p}
                            </p>
                        ))}
                    </div>
                </div>

                <aside className="lg:col-span-5" aria-label={c.label}>
                    <div className="bezel p-5 sm:p-6">
                        <div className="flex items-end justify-between gap-4 border-b border-edge pb-4">
                            <div>
                                <p className="t-num text-[clamp(2.4rem,1.8rem+2.4vw,3.6rem)] text-fg">{c.stamp.date}</p>
                                <p className="t-label mt-2 text-hmd">{c.stamp.place}</p>
                            </div>
                            <p className="t-num text-[clamp(2rem,1.6rem+1.6vw,2.8rem)] text-hmd">{c.stamp.time}</p>
                        </div>
                        <dl className="mt-2 divide-y divide-edge">
                            {c.log.map((r) => (
                                <div key={r.k} className="flex items-baseline justify-between gap-4 py-2.5">
                                    <dt className="t-label">{r.k}</dt>
                                    <dd className="t-data text-right text-[0.9375rem] text-fg">{r.v}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                    <SourceNote>{c.source}</SourceNote>
                </aside>
            </div>
        </Chapter>
    );
}
