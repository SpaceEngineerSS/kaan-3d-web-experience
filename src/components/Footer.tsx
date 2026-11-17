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

    return (
        <footer className="relative z-10 border-t border-edge bg-ink-2 pb-24 pt-16 sm:pb-16">
            <div className="wrap grid gap-12 md:grid-cols-12">
                <div className="md:col-span-5">
                    <p className="font-display text-4xl font-semibold uppercase">KAAN</p>
                    <p className="t-body mt-4 max-w-[46ch] text-[0.9375rem]">{c.about}</p>
                    <p className="t-label mt-6">
                        {c.dataAsOf}: <span className="text-fg-2">{DATA_AS_OF[locale]}</span>
                    </p>
                </div>

                <nav aria-label={c.pages} className="md:col-span-3">
                    <p className="t-label mb-4">{c.pages}</p>
                    <ul className="space-y-2 text-[0.9375rem]">
                        <li><Link href="/" className="link text-fg-2 hover:text-fg">{c.home}</Link></li>
                        <li><Link href="/mum-t" className="link text-fg-2 hover:text-fg">{c.mumt}</Link></li>
                        <li><Link href="/kaynaklar" className="link text-fg-2 hover:text-fg">{c.credits}</Link></li>
                    </ul>
                </nav>

                <div className="md:col-span-4">
                    <dl className="space-y-4 text-[0.9375rem]">
                        <div>
                            <dt className="t-label">{c.made}</dt>
                            <dd className="mt-1"><a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer" className="link text-fg">Mehmet Gümüş</a></dd>
                        </div>
                        <div>
                            <dt className="t-label">{c.model}</dt>
                            <dd className="mt-1"><a href="https://www.linkedin.com/in/kaan-azman-591776201/" target="_blank" rel="noopener noreferrer" className="link text-fg">Kaan Azman</a></dd>
                        </div>
                        <div>
                            <dt className="t-label">{c.source}</dt>
                            <dd className="mt-1"><a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="link t-data text-sm text-fg">github.com/SpaceEngineerSS/kaan-3d-web-experience</a></dd>
                        </div>
                    </dl>
                </div>

                <p className="border-t border-edge pt-6 text-[0.8125rem] leading-relaxed text-faint md:col-span-12">{c.legal}</p>
            </div>
        </footer>
    );
}
