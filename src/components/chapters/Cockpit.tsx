"use client";

import { useT } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { AvionicsDiagram } from "@/components/cockpit/AvionicsDiagram";
import { PanoramicDisplay } from "@/components/cockpit/PanoramicDisplay";
import { cockpit } from "@/content/cockpit";

/**
 * Cockpit and avionics: a simulated wide display, the TULGAR helmet, and a block diagram
 * of the systems publicly attributed to KAAN. Mounted through LazyMount, so fully client-side.
 */
export function Cockpit() {
    const t = useT();
    const c = t(cockpit);

    return (
        <Chapter id="cockpit" index={5} label={c.label} title={c.title} lede={c.lede} solid>
            <div data-reveal>
                <PanoramicDisplay copy={c} />
                <SourceNote>{c.displaySource}</SourceNote>
            </div>

            <div className="mt-24 grid gap-12 lg:grid-cols-12 lg:gap-10">
                <section aria-labelledby="cockpit-layout-title" className="lg:col-span-4" data-reveal>
                    <h3 id="cockpit-layout-title" className="t-h3 text-fg">
                        {c.layoutTitle}
                    </h3>
                    <dl className="mt-6 border-t border-line-strong">
                        {c.layout.map((row) => (
                            <div key={row.term} className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-line py-4">
                                <dt className="t-label pt-0.5">{row.term}</dt>
                                <dd className="text-fg-2">
                                    {row.value}
                                    {row.note && <span className="t-label ml-2 inline-block text-faint">{row.note}</span>}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>

                <section aria-labelledby="cockpit-tulgar-title" className="lg:col-span-7 lg:col-start-6" data-reveal>
                    <h3 id="cockpit-tulgar-title" className="t-h3 text-fg">
                        {c.tulgar.title}
                    </h3>
                    <p className="t-body mt-6 max-w-[60ch]">{c.tulgar.body}</p>
                    <h4 className="t-label mt-8">{c.tulgar.showsTitle}</h4>
                    <ul className="mt-3 border-t border-line">
                        {c.tulgar.shows.map((s, i) => (
                            <li key={s} className="flex gap-4 border-b border-line py-3 text-fg-2">
                                <span className="t-data w-6 shrink-0 text-sm text-faint">{String(i + 1).padStart(2, "0")}</span>
                                {s}
                            </li>
                        ))}
                    </ul>
                    <SourceNote>{c.tulgar.source}</SourceNote>
                </section>
            </div>

            <section aria-labelledby="cockpit-avionics-title" className="mt-24" data-reveal>
                <div className="grid gap-6 md:grid-cols-12 md:gap-8">
                    <h3 id="cockpit-avionics-title" className="t-h3 text-fg md:col-span-4 lg:col-span-3">
                        {c.avionicsTitle}
                    </h3>
                    <div className="md:col-span-8 lg:col-span-7">
                        <p className="t-body max-w-[62ch]">{c.avionicsLede}</p>
                        <p className="t-label mt-3">{c.avionicsHint}</p>
                    </div>
                </div>
                <div className="mt-8">
                    <AvionicsDiagram copy={c} />
                </div>
                <SourceNote>{c.avionicsSource}</SourceNote>
            </section>
        </Chapter>
    );
}
