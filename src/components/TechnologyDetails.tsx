"use client";

import { useState } from "react";
import { Cpu } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/lib/translations";

export function TechnologyDetails() {
    const { locale } = useLanguage();
    const s = translations.techSection[locale];
    const cards = translations.techCards[locale];
    const [expandedCard, setExpandedCard] = useState<number | null>(null);

    return (
        <section id="technology" className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
            <div className="mx-auto max-w-6xl">
                {/* Section header */}
                <div className="mb-16">
                    <div className="mb-3 flex items-center gap-3">
                        <Cpu className="h-4 w-4 text-neon-blue" />
                        <div className="h-px w-10 bg-neon-blue/40" />
                        <span
                            className="text-[10px] tracking-[0.4em] text-neon-blue/70 uppercase animate-hud-blink"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {s.sectionTag}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                        {s.title}{" "}
                        <span className="text-gradient">{s.titleAccent}</span>
                    </h2>
                </div>

                {/* Cards grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {cards.map((card, index) => {
                        const isExpanded = expandedCard === index;

                        return (
                            <button
                                key={index}
                                onClick={() => setExpandedCard(isExpanded ? null : index)}
                                className={`group glass-panel relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-500 md:p-8 ${isExpanded
                                    ? "border-neon-blue/30 shadow-[0_0_40px_rgba(0,212,255,0.1)]"
                                    : "hover:border-neon-blue/20"
                                    }`}
                            >
                                {/* Top row */}
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{card.icon}</span>
                                        <span
                                            className="text-[10px] tracking-[0.3em] text-neon-blue/60 uppercase"
                                            style={{ fontFamily: "var(--font-mono)" }}
                                        >
                                            {card.tag}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300 ${isExpanded
                                            ? "rotate-45 border-neon-blue/50 text-neon-blue"
                                            : "border-white/10 text-titanium-light/40"
                                            }`}
                                    >
                                        <span className="text-sm">+</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="mb-2 text-xl font-bold text-white md:text-2xl">
                                    {card.title}
                                </h3>

                                {/* Description */}
                                <p className="mb-4 text-sm leading-relaxed text-slate-300">
                                    {card.description}
                                </p>

                                {/* Expandable details */}
                                <div
                                    className={`overflow-hidden transition-all duration-500 ${isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <div className="mb-2 h-px w-full bg-gradient-to-r from-neon-blue/20 via-neon-blue/10 to-transparent" />
                                    <ul className="space-y-3 pt-2">
                                        {card.details.map((detail, dIndex) => (
                                            <li key={dIndex} className="flex items-start gap-3">
                                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neon-blue/50" />
                                                <span
                                                    className="text-xs leading-relaxed text-slate-400"
                                                    style={{ fontFamily: "var(--font-mono)" }}
                                                >
                                                    {detail}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Bottom accent line */}
                                <div
                                    className={`absolute bottom-0 left-0 h-px transition-all duration-700 ${isExpanded
                                        ? "w-full bg-gradient-to-r from-neon-blue/40 to-transparent"
                                        : "w-0 bg-transparent"
                                        }`}
                                />
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
