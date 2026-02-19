"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Radio } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const platforms = {
    tr: {
        sectionTag: "HAVA KUVVETİ EKOSİSTEMİ",
        title: "LOYAL",
        titleAccent: "WINGMAN",
        description: "KAAN, ANKA-3 ve KIZILELMA insansız savaş uçaklarına anlık iletişim ve veri paylaşımı ile komutanlık yapacak. İnsanlı-insansız takım (MUM-T) konseptiyle 6. nesil savaş doktrini.",
        kaan: { name: "KAAN", role: "Komutan", desc: "Görev planlama, hedef tahsisi ve taktik koordinasyon" },
        wingmen: [
            { name: "KIZILELMA", dev: "Baykar", role: "Savaşçı İHA", desc: "Yüksek hızlı muharebe, hava-hava angajman, tehlikeli görevler", speed: "Transonik", ceiling: "35,000+ ft", status: "İlk teslimat 2026" },
            { name: "ANKA-3", dev: "TUSAŞ", role: "Stealth İHA", desc: "Derin taarruz, ISR, SEAD görevleri, stealth penetrasyon", speed: "835 km/s", ceiling: "44,000 ft", status: "Operasyonel 2026" },
        ],
        dataLinks: ["Hedef Tahsisi", "Sensör Paylaşımı", "Görev Komutu", "Durum Raporu", "Sürü Koordinasyonu", "Tehdit Uyarısı"],
        conceptNote: "TUSAŞ, 2026 World Defense Show'da KAAN + ANKA-3 konseptini resmi olarak tanıttı.",
    },
    en: {
        sectionTag: "AIR FORCE ECOSYSTEM",
        title: "LOYAL",
        titleAccent: "WINGMAN",
        description: "KAAN will command ANKA-3 and KIZILELMA unmanned combat aircraft via real-time communication and data sharing. Manned-Unmanned Teaming (MUM-T) concept aligned with 6th gen warfare doctrine.",
        kaan: { name: "KAAN", role: "Commander", desc: "Mission planning, target allocation and tactical coordination" },
        wingmen: [
            { name: "KIZILELMA", dev: "Baykar", role: "Combat UAV", desc: "High-speed combat, air-to-air engagement, high-risk missions", speed: "Transonic", ceiling: "35,000+ ft", status: "First delivery 2026" },
            { name: "ANKA-3", dev: "TUSAŞ", role: "Stealth UAV", desc: "Deep strike, ISR, SEAD missions, stealth penetration", speed: "835 km/h", ceiling: "44,000 ft", status: "Operational 2026" },
        ],
        dataLinks: ["Target Allocation", "Sensor Sharing", "Mission Command", "Status Report", "Swarm Coordination", "Threat Warning"],
        conceptNote: "TUSAŞ officially unveiled the KAAN + ANKA-3 concept at World Defense Show 2026.",
    },
};

export function LoyalWingman() {
    const { locale } = useLanguage();
    const t = platforms[locale];
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeLink, setActiveLink] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setActiveLink((p) => (p + 1) % t.dataLinks.length), 2000);
        return () => clearInterval(interval);
    }, [t.dataLinks.length]);

    useEffect(() => {
        if (!containerRef.current) return;
        const items = containerRef.current.querySelectorAll(".lw-animate");
        const observer = new IntersectionObserver(
            (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { gsap.fromTo(entry.target, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }); observer.unobserve(entry.target); } }); },
            { threshold: 0.15 }
        );
        items.forEach((item) => observer.observe(item));
        return () => observer.disconnect();
    }, [locale]);

    return (
        <section id="ecosystem" className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
            <div ref={containerRef} className="mx-auto max-w-6xl">
                <div className="lw-animate mb-16 opacity-0">
                    <div className="mb-3 flex items-center gap-3">
                        <Radio className="h-4 w-4 text-neon-blue" />
                        <div className="h-px w-10 bg-neon-blue/40" />
                        <span className="text-[10px] tracking-[0.4em] text-neon-blue/70 uppercase animate-hud-blink" style={{ fontFamily: "var(--font-mono)" }}>{t.sectionTag}</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                        {t.title} <span className="text-gradient">{t.titleAccent}</span>
                    </h2>
                </div>

                <p className="lw-animate mb-12 max-w-3xl text-sm leading-relaxed text-slate-300 opacity-0 md:text-base">{t.description}</p>

                {/* Network diagram */}
                <div className="lw-animate mb-12 opacity-0">
                    <div className="glass-panel relative overflow-hidden rounded-2xl p-6 md:p-10">
                        {/* Commander node - KAAN */}
                        <div className="mb-10 flex flex-col items-center">
                            <div className="relative mb-3">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-neon-blue/50 bg-neon-blue/10">
                                    <span className="text-lg font-bold text-neon-blue">KAAN</span>
                                </div>
                                <div className="absolute -inset-2 rounded-full border border-neon-blue/20 animate-pulse-glow" />
                            </div>
                            <span className="rounded border border-neon-blue/30 bg-neon-blue/10 px-3 py-1 text-[9px] tracking-[0.3em] text-neon-blue" style={{ fontFamily: "var(--font-mono)" }}>
                                {t.kaan.role.toUpperCase()}
                            </span>
                            <p className="mt-2 text-center text-[10px] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>{t.kaan.desc}</p>
                        </div>

                        {/* Data link animation */}
                        <div className="mb-4 flex items-center justify-center gap-3">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-neon-blue/30" />
                            <span className="rounded border border-hud-green/30 bg-hud-green/10 px-3 py-1 text-[8px] tracking-[0.2em] text-hud-green transition-all duration-500" style={{ fontFamily: "var(--font-mono)" }}>
                                ▼ {t.dataLinks[activeLink]} ▼
                            </span>
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-neon-blue/30" />
                        </div>

                        {/* Connection lines */}
                        <div className="mb-6 flex justify-center">
                            <div className="flex items-end gap-24 md:gap-40">
                                <div className="h-8 w-px bg-gradient-to-b from-neon-blue/30 to-orange-500/30" />
                                <div className="h-8 w-px bg-gradient-to-b from-neon-blue/30 to-purple-500/30" />
                            </div>
                        </div>

                        {/* Wingman nodes */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {t.wingmen.map((wm, i) => (
                                <div key={i} className="rounded-xl border border-titanium/20 bg-titanium/5 p-5 transition-all hover:border-neon-blue/20">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${i === 0 ? "border-orange-500/40 bg-orange-500/10" : "border-purple-500/40 bg-purple-500/10"}`}>
                                                <span className={`text-xs font-bold ${i === 0 ? "text-orange-400" : "text-purple-400"}`}>{i === 0 ? "KE" : "A3"}</span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{wm.name}</div>
                                                <div className="text-[8px] tracking-[0.2em] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>{wm.dev}</div>
                                            </div>
                                        </div>
                                        <span className={`rounded border px-2 py-0.5 text-[7px] tracking-[0.15em] ${i === 0 ? "border-orange-500/20 bg-orange-500/5 text-orange-400/70" : "border-purple-500/20 bg-purple-500/5 text-purple-400/70"}`} style={{ fontFamily: "var(--font-mono)" }}>
                                            {wm.role.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="mb-3 text-xs text-slate-400">{wm.desc}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-[8px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>SPD: {wm.speed}</span>
                                        <span className="text-[8px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>ALT: {wm.ceiling}</span>
                                        <span className="text-[8px] text-hud-green/60" style={{ fontFamily: "var(--font-mono)" }}>● {wm.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="mt-6 text-center text-[8px] tracking-[0.15em] text-slate-600" style={{ fontFamily: "var(--font-mono)" }}>
                            {t.conceptNote}
                        </p>
                    </div>
                </div>

                {/* MUM-T CTA */}
                <div className="lw-animate mt-10 opacity-0">
                    <a
                        href="/mum-t"
                        className="group relative block overflow-hidden rounded-2xl border border-neon-blue/15 p-6 text-center transition-all duration-500 hover:border-neon-blue/30 hover:shadow-[0_0_40px_rgba(0,212,255,0.08)] md:p-8"
                        style={{
                            background: "linear-gradient(135deg, rgba(0,212,255,0.04) 0%, rgba(2,6,23,0.9) 50%, rgba(0,212,255,0.02) 100%)",
                        }}
                    >
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(circle at center, rgba(0,212,255,0.06) 0%, transparent 70%)" }} />

                        <span className="mb-3 inline-block rounded-full border border-neon-blue/20 bg-neon-blue/5 px-4 py-1 text-[9px] tracking-[0.3em] text-neon-blue/70" style={{ fontFamily: "var(--font-mono)" }}>
                            MUM-T EXPERIENCE
                        </span>
                        <h3 className="mb-2 text-xl font-bold text-white md:text-2xl">
                            {locale === "tr" ? "İnsanlı-İnsansız Takım" : "Manned-Unmanned Teaming"}
                            <span className="text-gradient ml-2">
                                {locale === "tr" ? "Deneyimi" : "Experience"}
                            </span>
                        </h3>
                        <p className="mx-auto mb-4 max-w-lg text-xs text-slate-400 md:text-sm">
                            {locale === "tr"
                                ? "KAAN × ANKA-3 konseptini 3D interaktif olarak keşfedin. Formasyon kontrolleri, aviyonik gösterimi ve taktik senaryolar."
                                : "Explore the KAAN × ANKA-3 concept in 3D interactive. Formation controls, avionics showcase and tactical scenarios."}
                        </p>
                        <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-neon-blue transition-all duration-300 group-hover:gap-3" style={{ fontFamily: "var(--font-mono)" }}>
                            {locale === "tr" ? "DENEYİME GİR" : "ENTER EXPERIENCE"}
                            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                    </a>
                </div>
            </div>
        </section>
    );
}
