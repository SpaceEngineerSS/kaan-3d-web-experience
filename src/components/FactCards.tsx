"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useLanguage } from "@/context/LanguageContext";

interface Fact {
    textTR: string;
    textEN: string;
}

const facts: Fact[] = [
    { textTR: "KAAN, Türkiye'yi kendi 5. nesil savaş uçağını tasarlayıp üreten dünyadaki 4. ülke yapacak.", textEN: "KAAN will make Türkiye the 4th country in the world to design and produce its own 5th gen fighter jet." },
    { textTR: "TULGAR, dünyanın ilk renkli kaska entegre görüntüleme sistemidir (HMD).", textEN: "TULGAR is the world's first color helmet-mounted display system (HMD)." },
    { textTR: "Gökbora füzesi 100+ deniz mili menziliyle AWACS ve tanker uçaklarını tehdit edebilir.", textEN: "The Gokbora missile can threaten AWACS and tanker aircraft with its 100+ NM range." },
    { textTR: "KAAN'ın S-şekilli motor hava kanalları, türbin yüzeylerini radardan tamamen gizler.", textEN: "KAAN's S-shaped engine air ducts completely conceal turbine faces from radar." },
    { textTR: "İlk uçuş 21 Şubat 2024'te gerçekleşti — 13 dakikada 8,000 ft ve 230 knot'a ulaşıldı.", textEN: "The maiden flight took place on Feb 21, 2024 — reaching 8,000 ft and 230 knots in 13 minutes." },
    { textTR: "Endonezya ile 48 adet KAAN için 15 milyar dolarlık çerçeve anlaşma imzalandı.", textEN: "A $15 billion framework agreement was signed with Indonesia for 48 KAAN aircraft." },
    { textTR: "Yerli TF35000 motoru, Türkiye'nin şimdiye kadar ürettiği en yüksek itkili turbofan olacak.", textEN: "The indigenous TF35000 engine will be the highest-thrust turbofan Türkiye has ever produced." },
    { textTR: "TOLUN minyatür bombası, SADAK-4T salanıyla tek istasyonda 4 adet taşınabilir.", textEN: "The TOLUN miniature bomb can carry 4 units per station via the SADAK-4T rack." },
];

export function FactCards() {
    const { locale } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const cards = containerRef.current.querySelectorAll(".fact-card");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(entry.target,
                            { opacity: 0, scale: 0.95, y: 20 },
                            { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" }
                        );
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );
        cards.forEach((c) => observer.observe(c));
        return () => observer.disconnect();
    }, [locale]);

    return (
        <section className="relative z-10 px-6 py-16 md:px-12 lg:px-24">
            <div ref={containerRef} className="mx-auto max-w-6xl">
                <div className="mb-8 text-center">
                    <span className="text-[10px] tracking-[0.4em] text-neon-blue/50 uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                        {locale === "tr" ? "BİLİYOR MUYDUNUZ?" : "DID YOU KNOW?"}
                    </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {facts.map((fact, i) => (
                        <div
                            key={i}
                            className="fact-card glass-panel group relative overflow-hidden rounded-xl p-5 opacity-0 transition-all duration-300 hover:border-neon-blue/30 hover:shadow-[0_0_20px_rgba(0,212,255,0.08)]"
                        >
                            <div className="absolute -right-2 -top-2 text-5xl font-bold text-neon-blue/5">
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            <div className="mb-3 flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-neon-blue/60" />
                                <div className="h-px flex-1 bg-gradient-to-r from-neon-blue/20 to-transparent" />
                            </div>
                            <p className="text-xs leading-relaxed text-slate-300">
                                {locale === "tr" ? fact.textTR : fact.textEN}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
