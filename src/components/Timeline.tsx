"use client";

import { useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { gsap } from "gsap";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/lib/translations";

export function Timeline() {
    const { locale } = useLanguage();
    const t = translations.timeline[locale];
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const items = containerRef.current.querySelectorAll(".timeline-item");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(
                            entry.target,
                            { opacity: 0, x: -40, filter: "blur(6px)" },
                            {
                                opacity: 1,
                                x: 0,
                                filter: "blur(0px)",
                                duration: 0.8,
                                ease: "power3.out",
                            }
                        );
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        items.forEach((item) => observer.observe(item));

        return () => observer.disconnect();
    }, [locale]);

    return (
        <section id="timeline" className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
            <div className="mx-auto max-w-4xl">
                {/* Section header */}
                <div className="mb-16 text-center">
                    <div className="mb-3 flex items-center justify-center gap-3">
                        <Clock className="h-4 w-4 text-neon-blue" />
                        <div className="h-px w-10 bg-neon-blue/40" />
                        <span
                            className="text-[10px] tracking-[0.4em] text-neon-blue/70 uppercase animate-hud-blink"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {t.sectionTag}
                        </span>
                        <div className="h-px w-10 bg-neon-blue/40" />
                    </div>
                    <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                        {t.title}{" "}
                        <span className="text-gradient">{t.titleAccent}</span>
                    </h2>
                </div>

                {/* Timeline */}
                <div ref={containerRef} className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-neon-blue/30 via-neon-blue/10 to-transparent md:left-1/2 md:-translate-x-1/2" />

                    <div className="space-y-12">
                        {t.milestones.map((milestone, index) => (
                            <div
                                key={index}
                                className="timeline-item relative opacity-0"
                            >
                                <div className={`flex items-start gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                                    {/* Year node */}
                                    <div className="relative z-10 flex flex-shrink-0 items-center">
                                        <div className="absolute left-6 flex h-3 w-3 items-center justify-center md:left-auto md:relative">
                                            <div className="h-3 w-3 rounded-full border border-neon-blue/50 bg-cockpit-dark">
                                                <div className="h-full w-full rounded-full bg-neon-blue/30 animate-pulse-glow" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content card */}
                                    <div className={`ml-12 flex-1 md:ml-0 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                                        <span
                                            className="mb-1 inline-block text-2xl font-bold text-neon-blue text-glow md:text-3xl"
                                            style={{ fontFamily: "var(--font-mono)" }}
                                        >
                                            {milestone.year}
                                        </span>
                                        <h3 className="mb-2 text-lg font-bold text-white md:text-xl">
                                            {milestone.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-slate-300">
                                            {milestone.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
