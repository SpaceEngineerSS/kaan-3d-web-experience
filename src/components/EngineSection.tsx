"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Zap, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const engineTimeline = {
    tr: [
        { year: "2024", label: "TF35000 geliştirme süreci hızlandı" },
        { year: "2026", label: "İlk motor testleri başlıyor" },
        { year: "2029", label: "Yer testleri ve kalifikasyon" },
        { year: "2032", label: "KAAN'a entegrasyon ve uçuş testleri" },
    ],
    en: [
        { year: "2024", label: "TF35000 development accelerated" },
        { year: "2026", label: "Initial engine tests begin" },
        { year: "2029", label: "Ground tests and qualification" },
        { year: "2032", label: "KAAN integration and flight tests" },
    ],
};

const engineSpecs = {
    tr: {
        sectionTag: "YERLİ GÜÇ ÜNİTESİ",
        title: "TF35000",
        titleAccent: "MOTORU",
        description:
            "TEI (TUSAŞ Motor Sanayii) ve TRMotor işbirliğiyle geliştirilen TF35000, Türkiye'nin şimdiye kadar ürettiği en yüksek itki gücüne sahip yerli turbofan motor olacaktır. KAAN'ın nihai seri üretim versiyonlarında kullanılacak bu motor, tam bağımsız savunma sanayiinin temel taşıdır.",
        currentEngine: "Mevcut Motor: GE F110-GE-129",
        targetEngine: "Hedef Motor: TEI TF35000",
        specs: [
            { label: "İTKİ SINIFI", value: "29,000+ lbf" },
            { label: "TİP", value: "Turbofan" },
            { label: "GELİŞTİREN", value: "TEI / TRMotor" },
            { label: "ENTEGRASYON", value: "2032" },
        ],
        transitionTitle: "Motor Geçiş Süreci",
        blocks: [
            { name: "BLOK 10", engine: "GE F110", period: "2028-2030" },
            { name: "BLOK 20", engine: "GE F110", period: "2030-2032" },
            { name: "BLOK 30", engine: "TF35000", period: "2032+" },
        ],
    },
    en: {
        sectionTag: "INDIGENOUS POWERPLANT",
        title: "TF35000",
        titleAccent: "ENGINE",
        description:
            "Developed in cooperation between TEI (TUSAŞ Engine Industries) and TRMotor, the TF35000 will be Turkey's highest-thrust indigenous turbofan engine. Destined for the final production variants of KAAN, this engine is the cornerstone of fully independent defense capability.",
        currentEngine: "Current Engine: GE F110-GE-129",
        targetEngine: "Target Engine: TEI TF35000",
        specs: [
            { label: "THRUST CLASS", value: "29,000+ lbf" },
            { label: "TYPE", value: "Turbofan" },
            { label: "DEVELOPER", value: "TEI / TRMotor" },
            { label: "INTEGRATION", value: "2032" },
        ],
        transitionTitle: "Engine Transition Process",
        blocks: [
            { name: "BLOCK 10", engine: "GE F110", period: "2028-2030" },
            { name: "BLOCK 20", engine: "GE F110", period: "2030-2032" },
            { name: "BLOCK 30", engine: "TF35000", period: "2032+" },
        ],
    },
};

export function EngineSection() {
    const { locale } = useLanguage();
    const t = engineSpecs[locale];
    const timeline = engineTimeline[locale];
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const items = containerRef.current.querySelectorAll(".engine-animate");

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
            { threshold: 0.2 }
        );

        items.forEach((item) => observer.observe(item));
        return () => observer.disconnect();
    }, [locale]);

    return (
        <section id="engine" className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
            <div ref={containerRef} className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="engine-animate mb-16 opacity-0">
                    <div className="mb-3 flex items-center gap-3">
                        <Zap className="h-4 w-4 text-neon-blue" />
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

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Left: Description + Specs */}
                    <div className="space-y-6">
                        <p className="engine-animate text-sm leading-relaxed text-slate-300 opacity-0 md:text-base">
                            {t.description}
                        </p>

                        {/* Transition arrow */}
                        <div className="engine-animate flex items-center gap-4 opacity-0">
                            <div className="rounded-lg border border-titanium/30 bg-titanium/10 px-4 py-2">
                                <span className="text-[10px] tracking-[0.2em] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
                                    {t.currentEngine}
                                </span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-neon-blue animate-pulse" />
                            <div className="rounded-lg border border-neon-blue/30 bg-neon-blue/10 px-4 py-2">
                                <span className="text-[10px] tracking-[0.2em] text-neon-blue" style={{ fontFamily: "var(--font-mono)" }}>
                                    {t.targetEngine}
                                </span>
                            </div>
                        </div>

                        {/* Spec cards */}
                        <div className="engine-animate grid grid-cols-2 gap-3 opacity-0">
                            {t.specs.map((spec, i) => (
                                <div
                                    key={i}
                                    className="glass-panel rounded-xl p-4 transition-all duration-300 hover:border-neon-blue/30"
                                >
                                    <span
                                        className="text-[9px] tracking-[0.3em] text-neon-blue/60 uppercase"
                                        style={{ fontFamily: "var(--font-mono)" }}
                                    >
                                        {spec.label}
                                    </span>
                                    <div className="mt-1 text-lg font-bold text-white">{spec.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Timeline + Blocks */}
                    <div className="space-y-8">
                        {/* Engine Development Timeline */}
                        <div className="engine-animate opacity-0">
                            <div className="relative space-y-4 pl-6">
                                <div className="absolute left-2 top-0 h-full w-px bg-gradient-to-b from-neon-blue/30 via-neon-blue/10 to-transparent" />
                                {timeline.map((item, i) => (
                                    <div key={i} className="relative flex items-start gap-4">
                                        <div className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full border border-neon-blue/50 bg-cockpit-dark">
                                            <div className="h-full w-full rounded-full bg-neon-blue/30 animate-pulse-glow" />
                                        </div>
                                        <div>
                                            <span
                                                className="text-sm font-bold text-neon-blue"
                                                style={{ fontFamily: "var(--font-mono)" }}
                                            >
                                                {item.year}
                                            </span>
                                            <p className="text-xs text-slate-400">{item.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Production Blocks */}
                        <div className="engine-animate opacity-0">
                            <h3
                                className="mb-4 text-xs tracking-[0.3em] text-neon-blue/60 uppercase"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {t.transitionTitle}
                            </h3>
                            <div className="space-y-3">
                                {t.blocks.map((block, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center justify-between rounded-lg border p-3 transition-all ${
                                            block.engine === "TF35000"
                                                ? "border-neon-blue/30 bg-neon-blue/5"
                                                : "border-titanium/20 bg-titanium/5"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-white">{block.name}</span>
                                            <span className="text-[10px] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
                                                {block.engine}
                                            </span>
                                        </div>
                                        <span
                                            className={`text-[10px] tracking-[0.2em] ${
                                                block.engine === "TF35000" ? "text-neon-blue" : "text-slate-500"
                                            }`}
                                            style={{ fontFamily: "var(--font-mono)" }}
                                        >
                                            {block.period}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
