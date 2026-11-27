"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { AUTHOR_URL, REPO_URL } from "@/lib/site";
import { DATA_AS_OF } from "@/content/aircraft";

const copy = {
    tr: {
        about: "KAAN programını açık kaynaklardan derleyip üç boyutlu model üzerinden anlatan, kâr amacı gütmeyen bağımsız bir çalışma. TUSAŞ ile resmi bir bağı yoktur.",
        legal: "KAAN adı ve tasarımı TUSAŞ'a aittir. Fotoğraf ve videoların hakları, Kaynaklar sayfasında adı geçen sahiplerindedir. Kaynak kodu MIT lisanslıdır.",
        dataAsOf: "Veriler son kontrol",
        made: "Tasarım ve geliştirme",
        model: "3D model",
        source: "Kaynak kodu",
        credits: "Kaynaklar ve görsel hakları",
        pages: "Sayfalar",
        home: "KAAN",
        mumt: "İnsanlı–insansız ekip (MUM-T)",
    },
    en: {
        about: "An independent, non-commercial study of the KAAN programme, compiled from public sources and told through a 3D model. Not affiliated with Turkish Aerospace.",
        legal: "The KAAN name and design belong to Turkish Aerospace. Photo and video rights belong to the owners named on the Sources page. Source code is MIT licensed.",
        dataAsOf: "Data last checked",
        made: "Design and development",
        model: "3D model",
        source: "Source code",
        credits: "Sources and image credits",
        pages: "Pages",
        home: "KAAN",
        mumt: "Manned–unmanned teaming (MUM-T)",
    },
};

export function Footer() {
    const { locale } = useLanguage();
    const c = copy[locale];
    const people = [
        { k: c.made, v: "Mehmet Gümüş", href: AUTHOR_URL },
        { k: c.model, v: "Kaan Azman", href: "https://www.linkedin.com/in/kaan-azman-591776201/" },
    ];

    return (
        <footer className="relative z-10 border-t border-edge-2 bg-ink pb-24 pt-16 sm:pb-14">
            <div className="wrap">
                <p aria-hidden className="t-monument t-monument--ghost select-none overflow-hidden">KAAN</p>

                <div className="mt-10 grid gap-x-6 gap-y-10 border-t border-edge pt-6 md:grid-cols-12">
                    <p className="t-body max-w-[46ch] text-[0.9375rem] md:col-span-5">{c.about}</p>

                    <nav aria-label={c.pages} className="md:col-span-3">
                        <p className="t-tele mb-3">{c.pages}</p>
                        <ul className="grid gap-2 text-[0.9375rem]">
                            <li><Link href="/" className="link text-fg-2 hover:text-fg">{c.home}</Link></li>
                            <li><Link href="/mum-t" className="link text-fg-2 hover:text-fg">{c.mumt}</Link></li>
                            <li><Link href="/kaynaklar" className="link text-fg-2 hover:text-fg">{c.credits}</Link></li>
                        </ul>
                    </nav>

                    <dl className="grid content-start gap-4 text-[0.9375rem] md:col-span-4">
                        {people.map((p) => (
                            <div key={p.k} className="flex items-baseline justify-between gap-4 border-b border-edge pb-2">
                                <dt className="t-tele">{p.k}</dt>
                                <dd><a href={p.href} target="_blank" rel="noopener noreferrer" className="link text-fg">{p.v}</a></dd>
                            </div>
                        ))}
                        <div className="flex items-baseline justify-between gap-4 border-b border-edge pb-2">
                            <dt className="t-tele">{c.source}</dt>
                            <dd><a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="link t-data text-[0.8125rem] text-fg">GitHub</a></dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 border-b border-edge pb-2">
                            <dt className="t-tele">{c.dataAsOf}</dt>
                            <dd className="t-data text-[0.8125rem] text-fg-2">{DATA_AS_OF[locale]}</dd>
                        </div>
                    </dl>
                </div>

                <p className="mt-10 max-w-[90ch] text-[0.8125rem] leading-relaxed text-muted">{c.legal}</p>
            </div>
        </footer>
    );
}
