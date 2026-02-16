"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const sections = [
    { id: "hero", labelTR: "ANA", labelEN: "HOME" },
    { id: "overview", labelTR: "BAKIŞ", labelEN: "OVERVIEW" },
    { id: "systems", labelTR: "SİSTEM", labelEN: "SYSTEMS" },
    { id: "specs", labelTR: "SPEC", labelEN: "SPECS" },
    { id: "cockpit", labelTR: "KOKPİT", labelEN: "COCKPIT" },
    { id: "technology", labelTR: "TEK", labelEN: "TECH" },
    { id: "comparison", labelTR: "KARS", labelEN: "COMPARE" },
    { id: "timeline", labelTR: "ZAMAN", labelEN: "TIME" },
];

export function ScrollProgress() {
    const { locale } = useLanguage();
    const [progress, setProgress] = useState(0);
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const p = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
            setProgress(p);

            const sectionEls = sections
                .map((s) => ({ id: s.id, el: document.getElementById(s.id) }))
                .filter((s) => s.el !== null);

            for (let i = sectionEls.length - 1; i >= 0; i--) {
                const rect = sectionEls[i].el!.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2) {
                    setActiveSection(sectionEls[i].id);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
            {/* Progress bar */}
            <div className="relative h-48 w-px bg-titanium/20">
                <div
                    className="absolute left-0 top-0 w-full bg-neon-blue/60 transition-all duration-300"
                    style={{ height: `${progress * 100}%` }}
                />
                <div
                    className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-neon-blue shadow-[0_0_8px_rgba(0,212,255,0.5)] transition-all duration-300"
                    style={{ top: `${progress * 100}%` }}
                />
            </div>

            {/* Section indicators */}
            <div className="flex flex-col items-center gap-1">
                {sections.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        className={`text-center transition-all duration-300 ${
                            activeSection === section.id
                                ? "text-neon-blue"
                                : "text-titanium-light/20 hover:text-titanium-light/40"
                        }`}
                    >
                        <span
                            className="text-[6px] tracking-[0.2em]"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {locale === "tr" ? section.labelTR : section.labelEN}
                        </span>
                    </a>
                ))}
            </div>

            {/* Percentage */}
            <span
                className="text-[8px] tracking-[0.2em] text-neon-blue/40"
                style={{ fontFamily: "var(--font-mono)" }}
            >
                {Math.round(progress * 100)}%
            </span>
        </div>
    );
}
