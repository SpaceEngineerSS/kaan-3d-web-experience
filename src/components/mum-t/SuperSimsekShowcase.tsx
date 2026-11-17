"use client";

import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { LazyMount } from "@/components/site/LazyMount";
import { simsek, simsekSpecs } from "@/content/mumt";

const SuperSimsekScene = dynamic(() => import("./SuperSimsekScene").then((m) => m.SuperSimsekScene), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-ground-2" aria-hidden />,
});

/** Chapter 08: what Süper Şimşek is, what has been reported about it, and an inspectable model. */
export function SuperSimsekShowcase() {
    const { locale } = useLanguage();
    const c = simsek[locale];
    const { isMobile } = useDeviceProfile();

    return (
        <Chapter id="super-simsek" index={8} label={c.label} title={c.title} lede={c.lede} solid>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-6">
                    <figure className="ticks relative aspect-[4/3] border border-line bg-ground-2">
                        <LazyMount minHeight="100%" rootMargin="300px 0px">
                            <SuperSimsekScene label={c.canvasLabel} />
                        </LazyMount>
                        {!isMobile && <figcaption className="t-label pointer-events-none absolute bottom-3 left-3">{c.dragHint}</figcaption>}
                    </figure>

                    <div className="mt-10 space-y-5">
                        {c.body.map((p) => (
                            <p key={p.slice(0, 24)} className="t-body max-w-[60ch]" data-reveal>
                                {p}
                            </p>
                        ))}
                    </div>

                    <h3 className="t-h3 mt-12">{c.timelineTitle}</h3>
                    <ol className="mt-4 border-t border-line">
                        {c.timeline.map((e) => (
                            <li key={e.date} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-line py-3" data-reveal>
                                <span className="t-data text-sm text-muted">{e.date}</span>
                                <span className="text-[0.9375rem] text-fg-2">{e.text}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="lg:col-span-5 lg:col-start-8">
                    <table className="w-full border-collapse text-left">
                        <caption className="t-h3 mb-4 text-left">{c.specsTitle}</caption>
                        <tbody>
                            {simsekSpecs.map((s) => (
                                <tr key={s.label.en} className="border-b border-line align-baseline">
                                    <th scope="row" className="py-3 pr-4 font-normal text-muted">{s.label[locale]}</th>
                                    <td className="py-3 text-right">
                                        <span className="t-num text-2xl text-fg">{s.value}</span>
                                        <span className="t-data ml-2 text-sm text-muted">{s.unit[locale]}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="mt-4 border-l-2 border-signal pl-4 text-[0.9375rem] leading-relaxed text-fg-2">{c.uncertain}</p>

                    <h3 className="t-h3 mt-12">{c.rolesTitle}</h3>
                    <dl className="mt-4 border-t border-line">
                        {c.roles.map((r) => (
                            <div key={r.term} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
                                <dt className="font-medium text-fg">{r.term}</dt>
                                <dd className="text-[0.9375rem] leading-relaxed text-fg-2">{r.body}</dd>
                            </div>
                        ))}
                    </dl>
                    <SourceNote>{c.source}</SourceNote>
                </div>
            </div>
        </Chapter>
    );
}
