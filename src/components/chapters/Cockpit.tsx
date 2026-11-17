"use client";

import { useT } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { LargeAreaDisplay } from "@/components/cockpit/LargeAreaDisplay";
import { StandbyDisplay } from "@/components/cockpit/StandbyDisplay";
import { TulgarFrame } from "@/components/cockpit/TulgarFrame";
import { cockpit } from "@/content/cockpit";

/**
 * Cockpit: a simulated Large Area Display in the reported LAD-208 format, the ASELSAN standby display,
 * the TULGAR visor frame and the other cockpit hardware attributed to KAAN, each with its source.
 */
export function Cockpit() {
    const t = useT();
    const c = t(cockpit);

    return (
        <Chapter id="cockpit" index={4} label={c.label} title={c.title} lede={c.lede} solid>
            <div data-reveal>
                <LargeAreaDisplay copy={c.display} />
                <div className="mt-8 flex max-w-[72ch] gap-4 border-l-2 border-caution py-1 pl-4">
                    <p className="text-fg">
                        <span className="t-label mr-2 text-caution">{c.display.honestTag}</span>
                        {c.display.honest}
                    </p>
                </div>
                <SourceNote>{c.display.source}</SourceNote>
            </div>

            <div className="mt-20 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-10">
                <section aria-labelledby="cockpit-standby-title" className="lg:col-span-4" data-reveal>
                    <h3 id="cockpit-standby-title" className="t-h3 text-fg">
                        {c.standby.title}
                    </h3>
                    <div role="img" aria-label={c.standby.aria} className="mt-6 w-full max-w-[17rem] rounded-[3px] border border-edge-2 bg-[#0b0e12] p-2.5">
                        <StandbyDisplay label="STBY" />
                    </div>
                    <p className="t-body mt-6 max-w-[48ch]">{c.standby.body}</p>
                    <SourceNote>{c.standby.source}</SourceNote>
                </section>

                <section aria-labelledby="cockpit-tulgar-title" className="lg:col-span-7 lg:col-start-6" data-reveal>
                    <h3 id="cockpit-tulgar-title" className="t-h3 text-fg">
                        {c.tulgar.title}
                    </h3>
                    <p className="t-body mt-6 max-w-[60ch]">{c.tulgar.body}</p>
                    <figure className="m-0 mt-8">
                        <div className="border border-edge bg-black">
                            <TulgarFrame title={c.tulgar.frameTitle} />
                        </div>
                        <figcaption className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{c.tulgar.frameCaption}</figcaption>
                    </figure>
                    <dl className="mt-8 grid border-t border-edge sm:grid-cols-2 sm:gap-x-8">
                        {c.tulgar.specs.map((s) => (
                            <div key={s.term} className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-edge py-3">
                                <dt className="t-label pt-0.5">{s.term}</dt>
                                <dd className="t-data text-[0.9375rem] text-fg-2">{s.value}</dd>
                            </div>
                        ))}
                    </dl>
                    <SourceNote>{c.tulgar.source}</SourceNote>
                </section>
            </div>

            <section aria-labelledby="cockpit-hardware-title" className="mt-20 lg:mt-24" data-reveal>
                <h3 id="cockpit-hardware-title" className="t-h3 text-fg">
                    {c.hardwareTitle}
                </h3>
                <ul className="mt-6 grid border-t border-edge md:grid-cols-2 md:gap-x-10">
                    {c.hardware.map((h) => (
                        <li key={h.term} className="border-b border-edge py-5">
                            <p className="t-label text-hmd">{h.term}</p>
                            <p className="mt-2 max-w-[56ch] text-fg-2">{h.value}</p>
                            <SourceNote>{h.source}</SourceNote>
                        </li>
                    ))}
                </ul>
            </section>
        </Chapter>
    );
}
