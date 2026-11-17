"use client";

import { Fragment } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { milestones, timelineCopy } from "@/content/timeline";
import { DATA_AS_OF } from "@/content/aircraft";

function Marker({ done, accent = false }: { done: boolean; accent?: boolean }) {
    if (!done) return <span aria-hidden className="block h-[11px] w-[11px] rounded-full border border-fg-2 bg-ground" />;
    return <span aria-hidden className={`block h-[11px] w-[11px] rounded-full ${accent ? "bg-signal" : "bg-fg"}`} />;
}

export function Timeline() {
    const { locale } = useLanguage();
    const c = timelineCopy[locale];
    const firstPlanned = milestones.findIndex((m) => !m.done);

    const legend = (
        <dl className="t-label flex gap-5 lg:flex-col lg:gap-2">
            <dt className="sr-only">{c.legend}</dt>
            <dd className="flex items-center gap-2">
                <Marker done />
                {c.done}
            </dd>
            <dd className="flex items-center gap-2">
                <Marker done={false} />
                {c.planned}
            </dd>
        </dl>
    );

    return (
        <Chapter id="timeline" index={10} label={c.label} title={c.title} lede={c.lede} solid aside={legend}>
            <ol className="max-w-5xl">
                {milestones.map((m, i) => {
                    const last = i === milestones.length - 1;
                    return (
                        <Fragment key={m.id}>
                            {i === firstPlanned && (
                                <li aria-hidden className="grid grid-cols-[1.25rem_1fr] gap-x-4 md:grid-cols-[minmax(0,3fr)_1.25rem_minmax(0,7fr)] md:gap-x-8">
                                    <span className="hidden md:block" />
                                    <span className="relative flex justify-center">
                                        <span className="absolute inset-y-0 border-l border-dashed border-line-strong" />
                                    </span>
                                    <p className="t-label flex items-center gap-3 pb-10 text-signal">
                                        <span className="h-px w-8 bg-signal" />
                                        {DATA_AS_OF[locale]}
                                    </p>
                                </li>
                            )}
                            <li
                                className="grid grid-cols-[1.25rem_1fr] gap-x-4 md:grid-cols-[minmax(0,3fr)_1.25rem_minmax(0,7fr)] md:gap-x-8"
                                data-reveal
                            >
                                <p className={`hidden pt-0.5 text-right md:block ${m.done ? "text-fg" : "text-muted"}`}>
                                    <span className="t-num text-[clamp(1.5rem,1.2rem+1vw,2.25rem)]">{m.when[locale]}</span>
                                </p>
                                <div className="relative flex justify-center">
                                    <span
                                        aria-hidden
                                        className={`absolute border-l border-line-strong ${m.done ? "" : "border-dashed"} ${
                                            i === 0 ? "bottom-0 top-3" : last ? "top-0 h-3" : "inset-y-0"
                                        }`}
                                    />
                                    <span className="relative mt-2 md:mt-3">
                                        <Marker done={m.done} accent={m.id === "first-flight"} />
                                    </span>
                                </div>
                                <div className={last ? "pb-2" : "pb-12 md:pb-14"}>
                                    <p className={`t-data text-sm md:hidden ${m.done ? "text-fg-2" : "text-muted"}`}>{m.when[locale]}</p>
                                    <h3 className={`t-h3 mt-1 md:mt-0 ${m.done ? "text-fg" : "text-fg-2"}`}>
                                        {m.title[locale]}
                                        {!m.done && <span className="t-label ml-3 align-middle text-muted">{c.planned}</span>}
                                    </h3>
                                    <p className="t-body mt-2 max-w-[54ch] text-[0.9375rem]">{m.body[locale]}</p>
                                </div>
                            </li>
                        </Fragment>
                    );
                })}
            </ol>
            <SourceNote>{c.source}</SourceNote>
        </Chapter>
    );
}
