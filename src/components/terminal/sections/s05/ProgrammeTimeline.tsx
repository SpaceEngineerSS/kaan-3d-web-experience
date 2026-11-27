"use client";

import { useLanguage } from "@/context/LanguageContext";
import { events, orders, programmeCopy } from "@/content/programme";
import { s05Copy } from "@/content/s05";
import { Plate } from "./shared";

export function ProgrammeTimeline() {
    const { locale } = useLanguage();
    const c = s05Copy[locale];
    const p = programmeCopy[locale];

    return (
        <div className="mb-24 md:mb-32">
            <Plate n="04" label={c.progLabel} title={c.progTitle} />
            <div className="border-b border-edge">
                <div className="hidden grid-cols-[12rem_1fr_9rem] gap-px border-b border-edge bg-edge md:grid">
                    <p className="t-tele bg-ink px-4 py-2">{c.colDate}</p>
                    <p className="t-tele bg-ink px-4 py-2">{c.colEvent}</p>
                    <p className="t-tele bg-ink px-4 py-2">{c.colStatus}</p>
                </div>
                <ol className="grid gap-px bg-edge">
                    {events.map((e) => (
                        <li key={e.id} className={`grid gap-px bg-edge md:grid-cols-[12rem_1fr_9rem] ${e.done ? "" : "opacity-60"}`}>
                            <p className={`t-data bg-ink px-4 pt-3 text-[0.75rem] md:py-3 ${e.key ? "text-accent" : "text-fg-2"}`}>{e.date[locale]}</p>
                            <div className="bg-ink px-4 py-1 md:py-3">
                                <p className={`text-[0.9375rem] ${e.done ? "text-fg" : "text-muted"}`}>{e.title[locale]}</p>
                                <p className="mt-1 max-w-[70ch] text-[0.8125rem] leading-relaxed text-muted">{e.body[locale]}</p>
                            </div>
                            <p className="t-tele bg-ink px-4 pb-3 md:py-3">
                                <span className={e.done ? "text-fg-2" : "text-faint"}>{e.done ? `■ ${p.done}` : `□ ${p.planned}`}</span>
                            </p>
                        </li>
                    ))}
                </ol>
            </div>

            <div className="mt-8 grid gap-px border border-edge bg-edge md:grid-cols-2">
                <p className="t-tele bg-ink px-4 py-2 md:col-span-2">{c.ordersLabel}</p>
                {orders.map((o) => (
                    <div key={o.id} className="grid grid-cols-[6rem_1fr] gap-px bg-edge">
                        <div className="bg-ink px-4 py-3">
                            <p className="t-num text-[2.5rem] text-fg">{o.figure}</p>
                            <p className="t-tele mt-1">{o.unit[locale]}</p>
                        </div>
                        <div className="bg-ink px-4 py-3">
                            <p className="text-[0.9375rem] text-fg">{o.customer[locale]}</p>
                            <dl className="mt-2 grid grid-cols-[6rem_1fr] gap-x-3 gap-y-1">
                                {o.rows.map((r) => (
                                    <div key={r.term.en} className="contents">
                                        <dt className="t-tele">{r.term[locale]}</dt>
                                        <dd className="t-data text-[0.75rem] text-fg-2">{r.value[locale]}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-2 text-[0.75rem] leading-relaxed text-faint">{p.source}</p>
        </div>
    );
}
