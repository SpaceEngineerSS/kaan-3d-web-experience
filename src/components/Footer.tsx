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
        <footer className="relative z-10 border-t border-edge bg-ink pb-24 pt-12 sm:pb-12">
            <div className="wrap">
                <div className="cross grid gap-px border border-edge bg-edge md:grid-cols-12">
                    <div className="bg-ink p-4 md:col-span-5 md:p-6">
                        <p className="t-tele mb-3">SYS // KAAN-TERMINAL</p>
                        <p className="font-display text-3xl font-bold uppercase tracking-[-0.03em] text-fg">KAAN</p>
                        <p className="t-body mt-3 max-w-[42ch] text-[0.875rem]">{c.about}</p>
                    </div>

                    <nav aria-label={c.pages} className="bg-ink p-4 md:col-span-3 md:p-6">
                        <p className="t-tele mb-3">{c.pages}</p>
                        <ul className="grid gap-px border border-edge bg-edge text-[0.875rem]">
                            <li className="bg-ink"><Link href="/" className="block px-3 py-2 text-fg-2 hover:text-fg">{c.home}</Link></li>
                            <li className="bg-ink"><Link href="/mum-t" className="block px-3 py-2 text-fg-2 hover:text-fg">{c.mumt}</Link></li>
                            <li className="bg-ink"><Link href="/kaynaklar" className="block px-3 py-2 text-fg-2 hover:text-fg">{c.credits}</Link></li>
                        </ul>
                    </nav>

                    <dl className="grid content-start gap-px bg-edge text-[0.875rem] md:col-span-4">
                        <div className="bg-ink px-4 py-3">
                            <dt className="t-tele">{c.made}</dt>
                            <dd className="mt-1"><a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer" className="link text-fg">Mehmet Gümüş</a></dd>
                        </div>
                        <div className="bg-ink px-4 py-3">
                            <dt className="t-tele">{c.model}</dt>
                            <dd className="mt-1"><a href="https://www.linkedin.com/in/kaan-azman-591776201/" target="_blank" rel="noopener noreferrer" className="link text-fg">Kaan Azman</a></dd>
                        </div>
                        <div className="bg-ink px-4 py-3">
                            <dt className="t-tele">{c.source}</dt>
                            <dd className="mt-1 break-all"><a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="link t-data text-[0.75rem] text-fg">github.com/SpaceEngineerSS/kaan-3d-web-experience</a></dd>
                        </div>
                        <div className="bg-ink px-4 py-3">
                            <dt className="t-tele">{c.dataAsOf}</dt>
                            <dd className="t-data mt-1 text-[0.75rem] text-fg-2">{DATA_AS_OF[locale]}</dd>
                        </div>
                    </dl>

                    <p className="bg-ink px-4 py-3 text-[0.75rem] leading-relaxed text-faint md:col-span-12">{c.legal}</p>
                </div>
            </div>
        </footer>
    );
}
