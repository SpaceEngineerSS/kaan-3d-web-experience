"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { galleryCredits, modelCredits, videoCredits, type MediaCredit } from "@/content/media-credits";
import { dataSources, ISSUES_URL, sourcesCopy } from "@/content/sources";
import { REPO_URL } from "@/lib/site";

function CreditRows({ items, thumbs = false }: { items: MediaCredit[]; thumbs?: boolean }) {
    const { locale } = useLanguage();
    const c = sourcesCopy[locale];
    return (
        <tbody>
            {items.map((m) => (
                <tr key={m.src} className="border-b border-line align-top">
                    <th scope="row" className="py-4 pr-4 font-normal">
                        <div className="flex gap-4">
                            {thumbs && m.width && m.height && (
                                <Image
                                    src={m.src}
                                    alt=""
                                    width={96}
                                    height={Math.round((96 * m.height) / m.width)}
                                    sizes="96px"
                                    className="hidden h-14 w-24 shrink-0 border border-line object-cover sm:block"
                                />
                            )}
                            <div>
                                <span className="block text-[0.9375rem] text-fg">{m.alt[locale]}</span>
                                <span className="t-data mt-1 block break-all text-[0.8125rem] text-faint">{m.src}</span>
                            </div>
                        </div>
                    </th>
                    <td className="py-4 text-[0.9375rem] text-fg-2">
                        {m.credit[locale]}
                        {m.licence && <span className="block text-[0.8125rem] text-muted">{m.licence}</span>}
                        {m.note && <span className="mt-1 block text-[0.8125rem] leading-relaxed text-faint">{m.note[locale]}</span>}
                        {m.sourceUrl && (
                            <a href={m.sourceUrl} target="_blank" rel="noopener noreferrer" className="link t-label mt-2 inline-block text-fg-2">
                                {c.link} <span aria-hidden>↗</span>
                            </a>
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export function SourcesContent() {
    const { locale } = useLanguage();
    const c = sourcesCopy[locale];

    const tables: { id: string; title: string; items: MediaCredit[]; thumbs?: boolean }[] = [
        { id: "gallery", title: c.gallery, items: galleryCredits, thumbs: true },
        { id: "videos", title: c.videos, items: videoCredits },
        { id: "models", title: c.models, items: modelCredits },
    ];

    return (
        <div className="wrap pb-[var(--space-section)] pt-32 md:pt-40">
            <header className="grid gap-6 md:grid-cols-12 md:gap-8">
                <p className="t-label border-t border-line pt-3 md:col-span-3 lg:col-span-2">{c.kicker}</p>
                <div className="md:col-span-9 lg:col-span-8">
                    <h1 className="t-h2 max-w-[18ch]">{c.title}</h1>
                    <p className="t-lede mt-6 max-w-[58ch]">{c.lede}</p>
                </div>
            </header>

            {/* Media credits */}
            <section aria-labelledby="credits-media" className="mt-20 grid gap-8 md:grid-cols-12 md:gap-8">
                <h2 id="credits-media" className="t-h3 md:col-span-3 lg:col-span-2">
                    {c.mediaTitle}
                </h2>
                <div className="space-y-14 md:col-span-9 lg:col-span-10">
                    {tables.map((t) => (
                        <table key={t.id} className="w-full border-collapse text-left">
                            <caption className="t-label mb-3 text-left">{t.title}</caption>
                            <thead>
                                <tr className="t-label border-b border-line-strong">
                                    <th scope="col" className="w-[55%] py-3 pr-4 font-normal">{c.colItem}</th>
                                    <th scope="col" className="py-3 font-normal">{c.colCredit}</th>
                                </tr>
                            </thead>
                            <CreditRows items={t.items} thumbs={t.thumbs} />
                        </table>
                    ))}
                </div>
            </section>

            {/* Data sources */}
            <section aria-labelledby="credits-data" className="mt-24 grid gap-8 md:grid-cols-12 md:gap-8">
                <h2 id="credits-data" className="t-h3 md:col-span-3 lg:col-span-2">
                    {c.dataTitle}
                </h2>
                <div className="md:col-span-9 lg:col-span-10">
                    <p className="t-body max-w-[62ch]">{c.dataLede}</p>
                    <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-8">
                        {dataSources.map((g) => (
                            <div key={g.id}>
                                <h3 className="t-label border-b border-line-strong pb-3">{g.title[locale]}</h3>
                                <dl>
                                    {g.items.map((s) => (
                                        <div key={s.url} className="border-b border-line py-4">
                                            <dt>
                                                <a href={s.url} target="_blank" rel="noopener noreferrer" className="link text-fg">
                                                    {s.name}
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

            {/* Licence */}
            <section aria-labelledby="credits-licence" className="mt-24 grid gap-8 md:grid-cols-12 md:gap-8">
                <h2 id="credits-licence" className="t-h3 md:col-span-3 lg:col-span-2">
                    {c.licenceTitle}
                </h2>
                <div className="md:col-span-9 lg:col-span-7">
                    <ul className="t-body space-y-3">
                        {c.licence.map((l) => (
                            <li key={l}>{l}</li>
                        ))}
                    </ul>
                    <div className="panel ticks mt-10 p-5 sm:p-6">
                        <p className="text-[0.9375rem] leading-relaxed text-fg-2">{c.takedown}</p>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer" className="btn btn--signal">
                                {c.takedownLink}
                                <span aria-hidden>↗</span>
                            </a>
                            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="btn">
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
