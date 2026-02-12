"use client";

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

export function SpecsGrid() {
    const { locale } = useLanguage();
    const specLabels = translations.specs.items[locale];
    const sectionTag = translations.specs.sectionTag[locale];
    const sectionTitle = translations.specs.sectionTitle[locale];
    const sectionTitleAccent = translations.specs.sectionTitleAccent[locale];

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
                        <div
                            key={index}
                            className={`glass-panel group rounded-xl p-6 transition-all duration-500 hover:border-neon-blue/40 hover:shadow-[0_0_30px_rgba(0,212,255,0.1)] ${spec.span}`}
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
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
