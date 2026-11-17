"use client";

import { Fragment, type ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { Film } from "@/components/site/Film";
import {
    engineClearance,
    events,
    orders,
    p1Changes,
    programmeCopy,
    prototypes,
    shares,
    type Prototype,
} from "@/content/programme";

/** Status lamp: filled hmd green for flown, hollow info cyan for ground/taxi only. */
function Lamp({ status }: { status: Prototype["status"] }) {
    return status === "flown" ? (
        <span aria-hidden className="inline-block h-2.5 w-2.5 bg-hmd" />
    ) : (
        <span aria-hidden className="inline-block h-2.5 w-2.5 border border-info" />
    );
}

function ProtoPlate({ p, className = "", children }: { p: Prototype; className?: string; children?: ReactNode }) {
    const { locale } = useLanguage();
    const c = programmeCopy[locale];
    return (
        <article className={`plate flex flex-col p-5 sm:p-6 ${className}`} aria-labelledby={`proto-${p.id}`} data-reveal>
            <header className="flex items-start justify-between gap-4 border-b border-edge pb-4">
                <h4 id={`proto-${p.id}`} className="t-num text-[clamp(3rem,2.4rem+2.4vw,4.75rem)] text-fg">
                    {p.id}
                </h4>
                <p className={`t-label flex items-center gap-2 pt-2 text-right ${p.status === "flown" ? "text-hmd" : "text-info"}`}>
                    <Lamp status={p.status} />
                    {p.statusText[locale]}
                </p>
            </header>
            <p className="t-body mt-4 text-[0.9375rem]">{p.body[locale]}</p>
            <dl className="mt-5 grid gap-x-6 gap-y-3 text-[0.875rem] sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <dt className="t-label">{c.finish}</dt>
                    <dd className="t-data mt-1 text-fg-2">{p.finish[locale]}</dd>
                </div>
                {p.facts.map((f) => (
                    <div key={f.term.en}>
                        <dt className="t-label">{f.term[locale]}</dt>
                        <dd className="t-data mt-1 text-fg-2">{f.value[locale]}</dd>
                    </div>
                ))}
            </dl>
            {children}
        </article>
    );
}

export function Programme() {
    const { locale } = useLanguage();
    const c = programmeCopy[locale];
    const [p0, p1, p2] = prototypes;
    const firstPlanned = events.findIndex((e) => !e.done);

    // Group events by year, keeping order.
    const years: { year: string; items: { e: (typeof events)[number]; i: number }[] }[] = [];
    events.forEach((e, i) => {
        const last = years[years.length - 1];
        if (last && last.year === e.year) last.items.push({ e, i });
        else years.push({ year: e.year, items: [{ e, i }] });
    });

    const legend = (
        <dl className="t-label flex gap-5 lg:flex-col lg:gap-2">
            <dt className="sr-only">{c.timelineTitle}</dt>
            <dd className="flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-2.5 bg-fg" />
                {c.done}
            </dd>
            <dd className="flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-2.5 border border-dashed border-fg-2" />
                {c.planned}
            </dd>
        </dl>
    );

    return (
        <Chapter id="programme" index={9} label={c.label} title={c.title} lede={c.lede} solid aside={legend}>
            {/* Prototypes */}
            <section aria-labelledby="programme-protos">
                <h3 id="programme-protos" className="t-label mb-5">
                    {c.protoTitle}
                </h3>
                <div className="grid gap-3 lg:grid-cols-12">
                    <Film name="landing" caption={c.filmCaption} credit={c.filmCredit} className="lg:col-span-7" />
                    <ProtoPlate p={p0} className="lg:col-span-5" />
                    <ProtoPlate p={p1} className="lg:col-span-7">
                        <div className="mt-6 border-t border-edge pt-5">
                            <h5 className="t-label text-fg-2">{c.changesTitle}</h5>
                            <ol className="mt-3 grid gap-x-6 sm:grid-cols-2">
                                {p1Changes[locale].map((ch, i) => (
                                    <li key={ch} className="flex gap-3 border-b border-edge py-2 text-[0.875rem] text-fg-2">
                                        <span className="t-data w-5 shrink-0 text-faint">{String(i + 1).padStart(2, "0")}</span>
                                        {ch}
                                    </li>
                                ))}
                            </ol>
                            <p className="mt-3 text-[0.8125rem] text-caution">{c.changesNote}</p>
                        </div>
                    </ProtoPlate>
                    <ProtoPlate p={p2} className="lg:col-span-5" />
                </div>
            </section>

            {/* Timeline, grouped by year */}
            <section aria-labelledby="programme-timeline" className="mt-24 md:mt-32">
                <h3 id="programme-timeline" className="t-label mb-8">
                    {c.timelineTitle}
                </h3>
                <ol className="border-t border-edge-2">
                    {years.map((y) => {
                        const planned = y.items.every(({ e }) => !e.done);
                        return (
                            <li key={y.year} className="grid gap-x-8 border-b border-edge py-6 md:grid-cols-12 md:py-8">
                                <p className={`t-num text-[clamp(2.25rem,1.8rem+2vw,3.75rem)] md:col-span-3 lg:col-span-2 ${planned ? "text-faint" : "text-fg"}`}>
                                    {y.year}
                                </p>
                                <ol className="mt-4 space-y-6 md:col-span-9 md:mt-0 lg:col-span-10">
                                    {y.items.map(({ e, i }) => (
                                        <Fragment key={e.id}>
                                            {i === firstPlanned && (
                                                <li aria-hidden className="flex items-center gap-3 text-hmd">
                                                    <span className="h-px flex-1 bg-hmd" />
                                                    <span className="t-label text-hmd">{c.now}</span>
                                                    <span className="h-px w-8 bg-hmd" />
                                                </li>
                                            )}
                                            <li
                                                className={`grid gap-x-6 gap-y-1 border-l pl-4 sm:grid-cols-[minmax(0,13rem)_1fr] ${
                                                    e.done ? (e.key ? "border-flag" : "border-fg-2") : "border-dashed border-edge-2"
                                                }`}
                                                data-reveal
                                            >
                                                <p className={`t-data text-[0.8125rem] ${e.done ? "text-fg-2" : "text-muted"}`}>
                                                    {e.date[locale]}
                                                    {!e.done && <span className="t-label mt-1 block text-caution">{c.planned}</span>}
                                                </p>
                                                <div>
                                                    <h4 className={`t-h3 text-[var(--step-1)] ${e.done ? "text-fg" : "text-fg-2"}`}>{e.title[locale]}</h4>
                                                    <p className="t-body mt-1 max-w-[62ch] text-[0.9375rem]">{e.body[locale]}</p>
                                                </div>
                                            </li>
                                        </Fragment>
                                    ))}
                                </ol>
                            </li>
                        );
                    })}
                </ol>
            </section>

            {/* Orders and industry */}
            <div className="mt-24 grid gap-16 md:mt-32 lg:grid-cols-12 lg:gap-10">
                <section aria-labelledby="programme-orders" className="lg:col-span-5">
                    <h3 id="programme-orders" className="t-label mb-5">
                        {c.ordersTitle}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        {orders.map((o) => (
                            <article key={o.id} className="plate p-5 sm:p-6" data-reveal>
                                <p className="t-label">{o.customer[locale]}</p>
                                <p className="mt-3 flex items-baseline gap-3">
                                    <span className="t-num inline-block text-[clamp(3.5rem,2.8rem+3vw,5.5rem)] text-fg">{o.figure}</span>
                                    <span className="t-label text-fg-2">{o.unit[locale]}</span>
                                </p>
                                <dl className="mt-4 divide-y divide-edge border-t border-edge text-[0.875rem]">
                                    {o.rows.map((r) => (
                                        <div key={r.term.en} className="grid grid-cols-[6rem_1fr] gap-3 py-2">
                                            <dt className="t-label pt-0.5">{r.term[locale]}</dt>
                                            <dd className="t-data text-fg-2">{r.value[locale]}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </article>
                        ))}
                        <article className="border border-edge p-5 sm:col-span-2 sm:p-6 lg:col-span-1" data-reveal>
                            <p className="t-label">{engineClearance.title[locale]}</p>
                            <p className="t-num mt-3 text-[clamp(2.25rem,1.9rem+1.6vw,3.25rem)] text-fg">{engineClearance.figure}</p>
                            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[0.875rem]">
                                {engineClearance.rows.map((r) => (
                                    <div key={r.term.en} className="flex gap-2">
                                        <dt className="t-label pt-0.5">{r.term[locale]}</dt>
                                        <dd className="t-data text-fg-2">{r.value[locale]}</dd>
                                    </div>
                                ))}
                            </dl>
                        </article>
                    </div>
                </section>

                <section aria-labelledby="programme-industry" className="lg:col-span-7">
                    <h3 id="programme-industry" className="t-label mb-5">
                        {c.industryTitle}
                    </h3>
                    <dl className="border-t border-edge-2">
                        {shares.map((s) => (
                            <div key={s.company} className="grid gap-x-6 gap-y-1 border-b border-edge py-4 sm:grid-cols-[11rem_1fr_auto]" data-reveal>
                                <dt className="font-display text-[1.125rem] font-semibold uppercase leading-tight text-fg">{s.company}</dt>
                                <dd className="t-body text-[0.9375rem]">{s.work[locale]}</dd>
                                <dd className={`t-label whitespace-nowrap sm:pt-1 ${s.basis === "confirmed" ? "text-fg-2" : "text-faint"}`}>{c.basis[s.basis]}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            </div>

            <SourceNote>{c.source}</SourceNote>
        </Chapter>
    );
}
