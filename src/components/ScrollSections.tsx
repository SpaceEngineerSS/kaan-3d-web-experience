"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Target, Crosshair, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/lib/translations";

export function ScrollSections() {
    const { locale } = useLanguage();
    const phases = translations.phases[locale];
    const scrollHint = translations.scrollHint[locale];

    const [activePhase, setActivePhase] = useState(0);
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observers = phases.map((_, index) => {
            return new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActivePhase(index);

                        const content = contentRefs.current[index];
                        if (content) {
                            const elements = content.querySelectorAll(".hud-animate");
                            gsap.fromTo(
                                elements,
                                { opacity: 0, y: 30, filter: "blur(8px)" },
                                {
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)",
                                    duration: 0.8,
                                    stagger: 0.15,
                                    ease: "power3.out",
                                }
                            );
                        }
                    }
                },
                { threshold: 0.4 }
            );
        });

        sectionRefs.current.forEach((ref, index) => {
            if (ref) observers[index].observe(ref);
        });

        return () => {
            observers.forEach((obs) => obs.disconnect());
        };
    }, [phases]);

    const renderIcon = (icon: string) => {
        switch (icon) {
            case "crosshair":
                return <Crosshair className="h-4 w-4 text-neon-blue" />;
            default:
                return <Target className="h-4 w-4 text-neon-blue" />;
        }
    };

    return (
        <div className="relative z-10">
            {phases.map((phase, index) => (
                <section
                    key={phase.id}
                    id={phase.id}
                    ref={(el) => { sectionRefs.current[index] = el; }}
                    className="relative flex min-h-screen items-center justify-start px-6 md:px-12 lg:px-24"
                >
                    <div
                        ref={(el) => { contentRefs.current[index] = el; }}
                        className={`max-w-2xl transition-opacity duration-700 ${activePhase === index ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <div className="hud-animate mb-2 flex items-center gap-3">
                            {renderIcon(phase.icon)}
                            <div className="h-px w-12 bg-neon-blue/40" />
                            <span
                                className="text-[10px] tracking-[0.4em] text-neon-blue animate-hud-blink"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {phase.tag}
                            </span>
                        </div>

                        <div className="hud-animate mb-6 flex items-center gap-4">
                            <span
                                className="text-[9px] tracking-[0.2em] text-titanium-light"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {phase.coordinates}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-neon-blue/20 to-transparent" />
                            <span
                                className="text-[9px] tracking-[0.3em] text-hud-green/70"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                ● {phase.status}
                            </span>
                        </div>

                        <h1 className="hud-animate mb-1 text-6xl font-bold leading-none text-white md:text-8xl lg:text-9xl text-glow-strong">
                            {phase.title}
                        </h1>
                        <h2 className="hud-animate mb-8 text-3xl font-semibold text-neon-blue md:text-5xl lg:text-6xl text-glow">
                            {phase.subtitle}
                        </h2>

                        <p className="hud-animate max-w-lg text-sm leading-relaxed text-slate-300 md:text-base">
                            {phase.description}
                        </p>

                        <div className="hud-animate mt-10 flex items-center gap-4">
                            <div className="h-px w-16 bg-neon-blue/30" />
                            <div className="flex items-center gap-2">
                                {phases.map((_, pIndex) => (
                                    <div
                                        key={pIndex}
                                        className={`transition-all duration-500 ${pIndex === activePhase
                                            ? "h-1 w-8 rounded-full bg-neon-blue"
                                            : "h-1 w-2 rounded-full bg-titanium/50"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span
                                className="text-[10px] tracking-[0.2em] text-titanium-light"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {String(activePhase + 1).padStart(2, "0")}/{String(phases.length).padStart(2, "0")}
                            </span>
                        </div>

                        {index === 0 && (
                            <div className="hud-animate mt-16 flex items-center gap-2 text-titanium-light/70">
                                <ChevronDown className="h-4 w-4 animate-bounce" />
                                <span
                                    className="text-[10px] tracking-[0.3em] uppercase"
                                    style={{ fontFamily: "var(--font-mono)" }}
                                >
                                    {scrollHint}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-2 md:flex">
                        <div
                            className={`h-16 w-px transition-all duration-700 ${activePhase === index ? "bg-neon-blue/30" : "bg-transparent"
                                }`}
                        />
                        <span
                            className={`text-[9px] tracking-[0.3em] transition-all duration-700 ${activePhase === index ? "text-neon-blue/40" : "text-transparent"
                                }`}
                            style={{ fontFamily: "var(--font-mono)", writingMode: "vertical-lr" }}
                        >
                            KAAN // TF-X // MMU
                        </span>
                        <div
                            className={`h-16 w-px transition-all duration-700 ${activePhase === index ? "bg-neon-blue/30" : "bg-transparent"
                                }`}
                        />
                    </div>
                </section>
            ))}
        </div>
    );
}
