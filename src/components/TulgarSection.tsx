"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Eye } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const tulgarData = {
    tr: {
        sectionTag: "KASK SİSTEMİ",
        title: "TULGAR",
        titleAccent: "HMD",
        description: "ASELSAN tarafından KAAN'a özel geliştirilen TULGAR, dünyanın ilk renkli kaska entegre görüntüleme sistemidir. Pilot, uçağın gövdesi sanki yokmuş gibi 360° çevresini görebilir.",
        features: [
            { label: "Renkli Arayüz", value: "Dünya İlki", desc: "Tam renkli semboloji ve görüntüleme" },
            { label: "Görüş Alanı", value: "40° × 32°", desc: "Dikey × Yatay görüntüleme alanı" },
            { label: "Gece Görüşü", value: "Sayısal", desc: "Dijital gece görüş entegrasyonu" },
            { label: "3D Ses", value: "Uyumlu", desc: "Uzaysal ses sistemi desteği" },
            { label: "Kafa Takibi", value: "Hibrit", desc: "Optik + manyetik hassas izleme" },
            { label: "Kask Ağırlığı", value: "<2.1 kg", desc: "Kafa birimi toplam ağırlık" },
        ],
        hudTitle: "PILOT GÖRÜŞÜ SİMÜLASYONU",
        capabilities: [
            "Dost-düşman tanıma (IFF) sembolojisi",
            "Füze uyarı göstergeleri",
            "Hedef kilitleme ve takip",
            "Uçuş verileri (hız, irtifa, yönelim)",
            "Sensör füzyonu görüntüsü (DAS/AESA)",
            "Silah sistemi durumu",
        ],
    },
    en: {
        sectionTag: "HELMET SYSTEM",
        title: "TULGAR",
        titleAccent: "HMD",
        description: "Developed by ASELSAN exclusively for KAAN, TULGAR is the world's first color helmet-mounted display system. The pilot can see 360° around as if the fuselage were transparent.",
        features: [
            { label: "Color Display", value: "World First", desc: "Full color symbology and imagery" },
            { label: "Field of View", value: "40° × 32°", desc: "Vertical × Horizontal display area" },
            { label: "Night Vision", value: "Digital", desc: "Digital night vision integration" },
            { label: "3D Audio", value: "Compatible", desc: "Spatial audio system support" },
            { label: "Head Tracking", value: "Hybrid", desc: "Optical + magnetic precision tracking" },
            { label: "Helmet Weight", value: "<2.1 kg", desc: "Head unit total weight" },
        ],
        hudTitle: "PILOT VIEW SIMULATION",
        capabilities: [
            "Friend-or-foe (IFF) symbology",
            "Missile warning indicators",
            "Target lock and tracking",
            "Flight data (speed, altitude, heading)",
            "Sensor fusion imagery (DAS/AESA)",
            "Weapon system status",
        ],
    },
};

export function TulgarSection() {
    const { locale } = useLanguage();
    const t = tulgarData[locale];
    const containerRef = useRef<HTMLDivElement>(null);
    const [hudActive, setHudActive] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;
        const items = containerRef.current.querySelectorAll(".tulgar-animate");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(entry.target,
                            { opacity: 0, y: 30, filter: "blur(6px)" },
                            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }
                        );
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );
        items.forEach((item) => observer.observe(item));
        return () => observer.disconnect();
    }, [locale]);

    return (
        <section id="tulgar" className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
            <div ref={containerRef} className="mx-auto max-w-6xl">
                <div className="tulgar-animate mb-16 opacity-0">
                    <div className="mb-3 flex items-center gap-3">
                        <Eye className="h-4 w-4 text-neon-blue" />
                        <div className="h-px w-10 bg-neon-blue/40" />
                        <span className="text-[10px] tracking-[0.4em] text-neon-blue/70 uppercase animate-hud-blink" style={{ fontFamily: "var(--font-mono)" }}>
                            {t.sectionTag}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                        {t.title} <span className="text-gradient">{t.titleAccent}</span>
                    </h2>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <p className="tulgar-animate text-sm leading-relaxed text-slate-300 opacity-0 md:text-base">{t.description}</p>

                        <div className="tulgar-animate grid grid-cols-2 gap-3 opacity-0 sm:grid-cols-3">
                            {t.features.map((f, i) => (
                                <div key={i} className="glass-panel rounded-xl p-4 transition-all duration-300 hover:border-neon-blue/30">
                                    <span className="text-[9px] tracking-[0.3em] text-neon-blue/60 uppercase" style={{ fontFamily: "var(--font-mono)" }}>{f.label}</span>
                                    <div className="mt-1 text-lg font-bold text-white">{f.value}</div>
                                    <div className="mt-0.5 text-[8px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>{f.desc}</div>
                                </div>
                            ))}
                        </div>

                        <div className="tulgar-animate opacity-0">
                            <span className="rounded border border-neon-blue/20 bg-neon-blue/5 px-2.5 py-1 text-[8px] tracking-[0.2em] text-neon-blue/60" style={{ fontFamily: "var(--font-mono)" }}>
                                ASELSAN
                            </span>
                        </div>
                    </div>

                    {/* HUD Simulation */}
                    <div className="tulgar-animate opacity-0">
                        <div className="relative overflow-hidden rounded-2xl border border-neon-blue/15 bg-cockpit-dark">
                            <div className="flex items-center justify-between border-b border-neon-blue/10 px-4 py-2">
                                <span className="text-[9px] tracking-[0.3em] text-neon-blue/50" style={{ fontFamily: "var(--font-mono)" }}>{t.hudTitle}</span>
                                <button
                                    onClick={() => setHudActive(!hudActive)}
                                    className={`rounded border px-2 py-0.5 text-[8px] tracking-[0.2em] transition-all ${hudActive ? "border-hud-green/40 bg-hud-green/10 text-hud-green" : "border-neon-blue/20 bg-neon-blue/5 text-neon-blue/50"}`}
                                    style={{ fontFamily: "var(--font-mono)" }}
                                >
                                    {hudActive ? "● ACTIVE" : "○ STANDBY"}
                                </button>
                            </div>

                            <div className="relative aspect-video bg-gradient-to-b from-cockpit-dark to-stealth-black p-6">
                                {/* HUD crosshair */}
                                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${hudActive ? "opacity-100" : "opacity-20"}`}>
                                    <svg viewBox="0 0 200 200" className="h-48 w-48 text-hud-green/60">
                                        <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="4 4" />
                                        <line x1="100" y1="30" x2="100" y2="60" stroke="currentColor" strokeWidth="0.5" />
                                        <line x1="100" y1="140" x2="100" y2="170" stroke="currentColor" strokeWidth="0.5" />
                                        <line x1="30" y1="100" x2="60" y2="100" stroke="currentColor" strokeWidth="0.5" />
                                        <line x1="140" y1="100" x2="170" y2="100" stroke="currentColor" strokeWidth="0.5" />
                                        <text x="105" y="55" fill="currentColor" fontSize="5" fontFamily="monospace">ALT 35000</text>
                                        <text x="105" y="62" fill="currentColor" fontSize="5" fontFamily="monospace">SPD M1.4</text>
                                        <text x="30" y="95" fill="currentColor" fontSize="4" fontFamily="monospace">HDG 270</text>
                                        <text x="150" y="95" fill="currentColor" fontSize="4" fontFamily="monospace">G +2.1</text>
                                        {hudActive && <>
                                            <rect x="85" y="85" width="30" height="30" fill="none" stroke="#ff4444" strokeWidth="1" className="animate-pulse" />
                                            <text x="87" y="82" fill="#ff4444" fontSize="4" fontFamily="monospace">TGT LOCK</text>
                                        </>}
                                    </svg>
                                </div>

                                {/* Flight data bars */}
                                <div className={`absolute bottom-4 left-4 right-4 flex justify-between text-[7px] text-hud-green/50 transition-opacity duration-500 ${hudActive ? "opacity-100" : "opacity-30"}`} style={{ fontFamily: "var(--font-mono)" }}>
                                    <span>TULGAR v2.1 // ASELSAN</span>
                                    <span>FOV 40×32 // COLOR</span>
                                </div>

                                {/* Scan line */}
                                {hudActive && (
                                    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-hud-green/30 to-transparent animate-scan-slow" />
                                )}
                            </div>

                            {/* Capabilities list */}
                            <div className="border-t border-neon-blue/10 p-4">
                                <div className="grid grid-cols-2 gap-2">
                                    {t.capabilities.map((cap, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-hud-green/50" />
                                            <span className="text-[8px] leading-relaxed text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>{cap}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
