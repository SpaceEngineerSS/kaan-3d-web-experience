"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Globe, Factory, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const productionData = {
    tr: {
        sectionTag: "ÜRETİM & İHRACAT",
        title: "KÜRESEL",
        titleAccent: "YAYILIM",
        stats: [
            { value: "250+", label: "Planlanan Üretim Adedi" },
            { value: "2028", label: "İlk Teslimat Yılı" },
            { value: "15B$", label: "Endonezya Anlaşması" },
            { value: "48", label: "Endonezya İçin Adet" },
        ],
        productionPlan: "Üretim Planı",
        phases: [
            { phase: "Faz 1", period: "2028-2030", desc: "Blok 10 — İlk seri üretim. GE F110 motorlu konfigürasyon. Türk Hava Kuvvetleri'ne ilk teslimatlar.", count: "~30 adet" },
            { phase: "Faz 2", period: "2030-2032", desc: "Blok 20 — Geliştirilmiş aviyonik ve silah sistemleri entegrasyonu. İhracat teslimatları başlangıcı.", count: "~80 adet" },
            { phase: "Faz 3", period: "2032+", desc: "Blok 30 — Yerli TF35000 motorlu nihai versiyon. Tam operasyonel kabiliyet (FOC).", count: "140+ adet" },
        ],
        exportTitle: "İhracat Pazarları",
        exports: [
            { country: "Endonezya", flag: "🇮🇩", status: "Anlaşma İmzalandı", detail: "48 adet, 15 milyar $ çerçeve anlaşma" },
            { country: "Pakistan", flag: "🇵🇰", status: "İlgi Beyanı", detail: "Ortak üretim müzakereleri devam ediyor" },
            { country: "Azerbaycan", flag: "🇦🇿", status: "İlgi Beyanı", detail: "Savunma işbirliği kapsamında değerlendirme" },
        ],
        partnersTitle: "PROGRAM ORTAKLARI",
        partners: [
            { name: "TUSAŞ", role: "Platform Entegrasyon", desc: "Ana yüklenici — uçak tasarım, üretim ve sistem entegrasyonu" },
            { name: "ASELSAN", role: "Radar & Aviyonik", desc: "AESA radar, elektronik harp süiti, kokpit aviyoniği" },
            { name: "HAVELSAN", role: "Yazılım & Simülasyon", desc: "Görev bilgisayarı yazılımı, simülatör sistemleri, yapay zeka" },
            { name: "TEI", role: "Motor & İtki", desc: "TF35000 yerli motor geliştirme ve motor entegrasyonu" },
            { name: "Roketsan", role: "Mühimmat", desc: "Gökdoğan, Bozdoğan hava-hava füzeleri ve SOM-J seyir füzesi" },
        ],
    },
    en: {
        sectionTag: "PRODUCTION & EXPORT",
        title: "GLOBAL",
        titleAccent: "EXPANSION",
        stats: [
            { value: "250+", label: "Planned Production Units" },
            { value: "2028", label: "First Delivery Year" },
            { value: "$15B", label: "Indonesia Agreement" },
            { value: "48", label: "Units for Indonesia" },
        ],
        productionPlan: "Production Plan",
        phases: [
            { phase: "Phase 1", period: "2028-2030", desc: "Block 10 — Initial serial production. GE F110 engine configuration. First deliveries to Turkish Air Force.", count: "~30 units" },
            { phase: "Phase 2", period: "2030-2032", desc: "Block 20 — Enhanced avionics and weapons systems integration. Export deliveries commence.", count: "~80 units" },
            { phase: "Phase 3", period: "2032+", desc: "Block 30 — Final version with indigenous TF35000 engine. Full Operational Capability (FOC).", count: "140+ units" },
        ],
        exportTitle: "Export Markets",
        exports: [
            { country: "Indonesia", flag: "🇮🇩", status: "Agreement Signed", detail: "48 units, $15B framework agreement" },
            { country: "Pakistan", flag: "🇵🇰", status: "Letter of Intent", detail: "Joint production negotiations ongoing" },
            { country: "Azerbaijan", flag: "🇦🇿", status: "Letter of Intent", detail: "Under evaluation within defense cooperation" },
        ],
        partnersTitle: "PROGRAM PARTNERS",
        partners: [
            { name: "TUSAŞ", role: "Platform Integration", desc: "Prime contractor — aircraft design, manufacturing and systems integration" },
            { name: "ASELSAN", role: "Radar & Avionics", desc: "AESA radar, electronic warfare suite, cockpit avionics" },
            { name: "HAVELSAN", role: "Software & Simulation", desc: "Mission computer software, simulator systems, artificial intelligence" },
            { name: "TEI", role: "Engine & Propulsion", desc: "TF35000 indigenous engine development and engine integration" },
            { name: "Roketsan", role: "Munitions", desc: "Gokdogan, Bozdogan AAMs and SOM-J cruise missile" },
        ],
    },
};

export function ProductionSection() {
    const { locale } = useLanguage();
    const t = productionData[locale];
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const items = containerRef.current.querySelectorAll(".prod-animate");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(
                            entry.target,
                            { opacity: 0, y: 30, filter: "blur(6px)" },
                            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }
                        );
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        items.forEach((item) => observer.observe(item));
        return () => observer.disconnect();
    }, [locale]);

    return (
        <section id="production" className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
            <div ref={containerRef} className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="prod-animate mb-16 opacity-0">
                    <div className="mb-3 flex items-center gap-3">
                        <Globe className="h-4 w-4 text-neon-blue" />
                        <div className="h-px w-10 bg-neon-blue/40" />
                        <span
                            className="text-[10px] tracking-[0.4em] text-neon-blue/70 uppercase animate-hud-blink"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {t.sectionTag}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                        {t.title}{" "}
                        <span className="text-gradient">{t.titleAccent}</span>
                    </h2>
                </div>

                {/* Stats bar */}
                <div className="prod-animate mb-12 grid grid-cols-2 gap-4 opacity-0 md:grid-cols-4">
                    {t.stats.map((stat, i) => (
                        <div key={i} className="glass-panel rounded-xl p-5 text-center transition-all duration-300 hover:border-neon-blue/30">
                            <div className="text-3xl font-bold text-white md:text-4xl">{stat.value}</div>
                            <div className="mt-1 text-[10px] tracking-[0.2em] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Production phases */}
                <div className="prod-animate mb-16 opacity-0">
                    <h3
                        className="mb-6 flex items-center gap-3 text-xs tracking-[0.3em] text-neon-blue/60 uppercase"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        <Factory className="h-4 w-4" />
                        {t.productionPlan}
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        {t.phases.map((phase, i) => (
                            <div
                                key={i}
                                className="glass-panel rounded-xl p-5 transition-all duration-300 hover:border-neon-blue/30 hover:shadow-[0_0_20px_rgba(0,212,255,0.05)]"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-sm font-bold text-neon-blue">{phase.phase}</span>
                                    <span className="text-[9px] tracking-[0.2em] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>
                                        {phase.period}
                                    </span>
                                </div>
                                <p className="mb-3 text-xs leading-relaxed text-slate-300">{phase.desc}</p>
                                <div className="flex items-center justify-between border-t border-titanium/20 pt-3">
                                    <span className="text-lg font-bold text-white">{phase.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Export markets */}
                <div className="prod-animate mb-16 opacity-0">
                    <h3
                        className="mb-6 flex items-center gap-3 text-xs tracking-[0.3em] text-neon-blue/60 uppercase"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        <Globe className="h-4 w-4" />
                        {t.exportTitle}
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        {t.exports.map((exp, i) => (
                            <div
                                key={i}
                                className="glass-panel flex items-start gap-4 rounded-xl p-5 transition-all duration-300 hover:border-neon-blue/30"
                            >
                                <span className="text-3xl">{exp.flag}</span>
                                <div>
                                    <div className="text-sm font-bold text-white">{exp.country}</div>
                                    <div
                                        className="mt-0.5 text-[9px] tracking-[0.2em] text-neon-blue/70"
                                        style={{ fontFamily: "var(--font-mono)" }}
                                    >
                                        {exp.status}
                                    </div>
                                    <p className="mt-2 text-xs text-slate-400">{exp.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Partners */}
                <div className="prod-animate opacity-0">
                    <h3
                        className="mb-6 flex items-center gap-3 text-xs tracking-[0.3em] text-neon-blue/60 uppercase"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        <Users className="h-4 w-4" />
                        {t.partnersTitle}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {t.partners.map((partner, i) => (
                            <div
                                key={i}
                                className="glass-panel group rounded-xl p-5 transition-all duration-300 hover:border-neon-blue/30 hover:shadow-[0_0_20px_rgba(0,212,255,0.05)]"
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-lg font-bold text-white group-hover:text-neon-blue transition-colors">
                                        {partner.name}
                                    </span>
                                    <span
                                        className="rounded border border-neon-blue/20 bg-neon-blue/5 px-2 py-0.5 text-[8px] tracking-[0.15em] text-neon-blue/70"
                                        style={{ fontFamily: "var(--font-mono)" }}
                                    >
                                        {partner.role}
                                    </span>
                                </div>
                                <p className="text-xs leading-relaxed text-slate-400">{partner.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
