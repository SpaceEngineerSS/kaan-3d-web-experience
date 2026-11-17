"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { galleryCredits, modelCredits, videoCredits, type MediaCredit } from "@/content/media-credits";
import { dataSources, ISSUES_URL, sourcesCopy } from "@/content/sources";
import { REPO_URL } from "@/lib/site";

function OutArrow() {
    return (
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="shrink-0">
            <path d="M2 8L8 2M3.5 2H8v4.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
    );
}

function CreditList({ items, thumbs = false }: { items: MediaCredit[]; thumbs?: boolean }) {
    const { locale } = useLanguage();
    const c = sourcesCopy[locale];
    return (
        <ul className="border-t border-edge-2">
            {items.map((m, i) => (
                <li key={m.src} className="grid gap-x-6 gap-y-2 border-b border-edge py-4 md:grid-cols-[2.5rem_minmax(0,1.1fr)_minmax(0,1fr)]">
                    <span className="t-data hidden pt-0.5 text-[0.8125rem] text-faint md:block">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex gap-4">
                        {thumbs && m.width && m.height && (
                            <Image
                                src={m.src}
                                alt=""
                                width={96}
                                height={Math.round((96 * m.height) / m.width)}
                                sizes="96px"
                                className="hidden h-14 w-24 shrink-0 border border-edge object-cover sm:block"
                            />
                        )}
                        <div>
                            <span className="block text-[0.9375rem] text-fg">{m.alt[locale]}</span>
                            <span className="t-data mt-1 block break-all text-[0.75rem] text-faint">{m.src}</span>
                        </div>
                    </div>
                    <div className="text-[0.9375rem] text-fg-2">
                        <span className="t-label mb-1 block md:hidden">{c.colCredit}</span>
                        {m.credit[locale]}
                        {m.licence && <span className="block text-[0.8125rem] text-muted">{m.licence}</span>}
                        {m.note && <span className="mt-1 block text-[0.8125rem] leading-relaxed text-faint">{m.note[locale]}</span>}
                        {m.sourceUrl && (
                            <a href={m.sourceUrl} target="_blank" rel="noopener noreferrer" className="link t-label mt-2 inline-flex items-center gap-1.5 text-fg-2">
                                {c.link} <OutArrow />
                            </a>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}

export function SourcesContent() {
    const { locale } = useLanguage();
    const c = sourcesCopy[locale];

    const lists: { id: string; title: string; items: MediaCredit[]; thumbs?: boolean }[] = [
        { id: "gallery", title: c.gallery, items: galleryCredits, thumbs: true },
        { id: "videos", title: c.videos, items: videoCredits },
        { id: "models", title: c.models, items: modelCredits },
    ];

    return (
        <div className="wrap pb-28 pt-32 md:pb-40 md:pt-40">
            <header className="grid gap-6 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-3 lg:col-span-2">
                    <p className="t-label border-t border-edge pt-3 text-hmd">{c.kicker}</p>
                </div>
                <div className="md:col-span-9 lg:col-span-8">
                    <h1 className="t-h2 max-w-[18ch]">{c.title}</h1>
                    <p className="t-lede mt-6 max-w-[58ch]">{c.lede}</p>
                </div>
            </header>

            {/* Data sources first: that is what most visitors come to check. */}
            <section aria-labelledby="credits-data" className="mt-20 grid gap-8 md:mt-28 md:grid-cols-12">
                <div className="md:col-span-3 lg:col-span-2">
                    <h2 id="credits-data" className="t-h3">
                        {c.dataTitle}
                    </h2>
                </div>
                <div className="md:col-span-9 lg:col-span-10">
                    <p className="t-body max-w-[62ch]">{c.dataLede}</p>
                    <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-6">
                        {dataSources.map((g) => (
                            <div key={g.id} className="plate p-5">
                                <h3 className="t-label border-b border-edge-2 pb-3 text-fg-2">{g.title[locale]}</h3>
                                <dl>
                                    {g.items.map((s) => (
                                        <div key={s.url} className="border-b border-edge py-4 last:border-b-0 last:pb-0">
                                            <dt>
                                                <a href={s.url} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-2 text-fg hover:text-hmd">
                                                    {s.name}
                                                    <OutArrow />
                                                </a>
                                            </dt>
                                            <dd className="mt-1 text-[0.875rem] leading-relaxed text-muted">{s.use[locale]}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Media credits */}
            <section aria-labelledby="credits-media" className="mt-24 grid gap-8 md:mt-32 md:grid-cols-12">
                <div className="md:col-span-3 lg:col-span-2">
                    <h2 id="credits-media" className="t-h3">
                        {c.mediaTitle}
                    </h2>
                </div>
                <div className="space-y-14 md:col-span-9 lg:col-span-10">
                    {lists.map((t) => (
                        <section key={t.id} aria-labelledby={`credits-${t.id}`}>
                            <div className="mb-3 hidden gap-x-6 md:grid md:grid-cols-[2.5rem_minmax(0,1.1fr)_minmax(0,1fr)]">
                                <span />
                                <h3 id={`credits-${t.id}`} className="t-label text-fg-2">
                                    {t.title}
                                </h3>
                                <span className="t-label">{c.colCredit}</span>
                            </div>
                            <h3 className="t-label mb-3 text-fg-2 md:hidden" aria-hidden>
                                {t.title}
                            </h3>
                            <CreditList items={t.items} thumbs={t.thumbs} />
                        </section>
                    ))}
                </div>
            </section>

            {/* Licence */}
            <section aria-labelledby="credits-licence" className="mt-24 grid gap-8 md:mt-32 md:grid-cols-12">
                <div className="md:col-span-3 lg:col-span-2">
                    <h2 id="credits-licence" className="t-h3">
                        {c.licenceTitle}
                    </h2>
                </div>
                <div className="md:col-span-9 lg:col-span-7">
                    <ul className="t-body space-y-3">
                        {c.licence.map((l) => (
                            <li key={l} className="border-l border-edge-2 pl-4">
                                {l}
                            </li>
                        ))}
                    </ul>
                    <div className="plate mt-10 border-l-2 border-l-caution p-5 sm:p-6">
                        <p className="text-[0.9375rem] leading-relaxed text-fg-2">{c.takedown}</p>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer" className="btn">
                                {c.takedownLink}
                                <OutArrow />
                            </a>
                            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="btn">
                                GitHub
                                <OutArrow />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
