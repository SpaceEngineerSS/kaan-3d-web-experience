"use client";

import { useState } from "react";
import { CountUp } from "./CountUp";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/lib/translations";

const specValues = [
    { value: 1.8, suffix: "+", decimals: 1, icon: "▷", span: "col-span-1 row-span-1" },
    { value: 55000, suffix: "", decimals: 0, icon: "△", span: "col-span-1 row-span-2" },
    { value: 600, suffix: "+", decimals: 0, icon: "◎", span: "col-span-1 row-span-1" },
    { value: 27000, suffix: "", decimals: 0, icon: "⬡", span: "col-span-2 row-span-1 md:col-span-1" },
    { value: 29000, suffix: "", decimals: 0, icon: "▲", span: "col-span-1 row-span-1" },
    { value: 14, suffix: "", decimals: 0, icon: "◇", span: "col-span-1 row-span-1" },
];

const specDetails = {
    tr: [
        "Afterburner olmadan süpersonik seyir (süperseyir) yeteneği. Mach 1.8+ hız, çoğu 4. nesil uçağın yakalayamayacağı bir avantaj sağlar.",
        "55,000 ft servis tavanı, çoğu hava savunma sisteminin etkili menzilinin üzerinde operasyon imkanı tanır.",
        "600+ deniz mili muharebe menzili, hava yakıt ikmali ile artırılabilir. Geniş operasyon alanı sağlar.",
        "27,000 kg maksimum kalkış ağırlığı. Dahili ve harici silah yükü kapasitesi ile yüksek görev esnekliği.",
        "Motor başına 29,000+ lbf itki. Çift motor konfigürasyonu ile toplam 58,000+ lbf, üstün tırmanma ve manevra performansı.",
        "14 metre kanat açıklığı. Delta kanat geometrisi yüksek hız ve manevra kabiliyetini dengeler.",
    ],
    en: [
        "Supersonic cruise without afterburner (supercruise) capability. Mach 1.8+ speed provides an advantage most 4th gen aircraft cannot match.",
        "55,000 ft service ceiling allows operations above the effective range of most air defense systems.",
        "600+ NM combat range, extendable with aerial refueling. Provides wide operational coverage.",
        "27,000 kg maximum takeoff weight. High mission flexibility with internal and external weapon load capacity.",
        "29,000+ lbf thrust per engine. Twin engine configuration provides 58,000+ lbf total for superior climb and maneuver performance.",
        "14 meter wingspan. Delta wing geometry balances high speed and maneuverability.",
    ],
};

export function SpecsGrid() {
    const { locale } = useLanguage();
    const specLabels = translations.specs.items[locale];
    const sectionTag = translations.specs.sectionTag[locale];
    const sectionTitle = translations.specs.sectionTitle[locale];
    const sectionTitleAccent = translations.specs.sectionTitleAccent[locale];
    const details = specDetails[locale];
    const [expanded, setExpanded] = useState<number | null>(null);

    return (
        <section
            id="specs"
            className="relative z-10 min-h-screen px-6 py-24 md:px-12 lg:px-24"
        >
            <div className="mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                    <p
                        className="mb-3 text-xs tracking-[0.4em] text-neon-blue/70 uppercase"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        {sectionTag}
                    </p>
                    <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                        {sectionTitle}{" "}
                        <span className="text-gradient">{sectionTitleAccent}</span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
                    {specValues.map((spec, index) => (
                        <button
                            key={index}
                            onClick={() => setExpanded(expanded === index ? null : index)}
                            className={`glass-panel group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-500 hover:border-neon-blue/40 hover:shadow-[0_0_30px_rgba(0,212,255,0.1)] ${spec.span} ${expanded === index ? "border-neon-blue/30 shadow-[0_0_40px_rgba(0,212,255,0.1)]" : ""}`}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-2xl opacity-50 transition-opacity group-hover:opacity-100">
                                    {spec.icon}
                                </span>
                                <span
                                    className="text-[10px] tracking-[0.3em] text-slate-300 uppercase"
                                    style={{ fontFamily: "var(--font-mono)" }}
                                >
                                    {specLabels[index].label}
                                </span>
                            </div>

                            <div className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                                <CountUp
                                    end={spec.value}
                                    suffix={spec.suffix}
                                    decimals={spec.decimals}
                                    duration={2500}
                                />
                            </div>

                            <div
                                className="mt-2 text-xs tracking-[0.3em] text-neon-blue/80"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {specLabels[index].unit}
                            </div>

                            <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent" />

                            {/* Expandable detail */}
                            <div className={`overflow-hidden transition-all duration-500 ${expanded === index ? "mt-4 max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                                <p className="text-[11px] leading-relaxed text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
                                    {details[index]}
                                </p>
                            </div>

                            {/* Expand indicator */}
                            <div className={`absolute bottom-2 right-3 text-[8px] transition-all duration-300 ${expanded === index ? "text-neon-blue" : "text-titanium-light/20"}`} style={{ fontFamily: "var(--font-mono)" }}>
                                {expanded === index ? "−" : "+"}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
