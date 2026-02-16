"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const mobileSections = [
    { id: "hero", iconTR: "⌂", iconEN: "⌂", labelTR: "ANA", labelEN: "HOME" },
    { id: "specs", iconTR: "◎", iconEN: "◎", labelTR: "SPEC", labelEN: "SPEC" },
    { id: "technology", iconTR: "◈", iconEN: "◈", labelTR: "TEK", labelEN: "TECH" },
    { id: "weapons", iconTR: "⊕", iconEN: "⊕", labelTR: "SİLAH", labelEN: "WEAP" },
    { id: "timeline", iconTR: "◷", iconEN: "◷", labelTR: "ZAMAN", labelEN: "TIME" },
];

export function MobileBottomNav() {
    const { locale } = useLanguage();
    const [activeSection, setActiveSection] = useState("hero");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let lastScroll = 0;

        const handleScroll = () => {
            const currentScroll = window.scrollY;
            setVisible(currentScroll > 200);
            lastScroll = currentScroll;

            const sectionEls = mobileSections
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
        <nav
            className={`fixed bottom-0 left-0 right-0 z-50 border-t border-neon-blue/10 bg-cockpit-dark/90 backdrop-blur-lg transition-all duration-500 md:hidden ${
                visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
            <div className="flex items-center justify-around px-2 py-2">
                {mobileSections.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-all ${
                            activeSection === section.id
                                ? "text-neon-blue"
                                : "text-titanium-light/30"
                        }`}
                    >
                        <span className="text-base">
                            {locale === "tr" ? section.iconTR : section.iconEN}
                        </span>
                        <span
                            className="text-[7px] tracking-[0.15em]"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {locale === "tr" ? section.labelTR : section.labelEN}
                        </span>
                        {activeSection === section.id && (
                            <div className="h-0.5 w-4 rounded-full bg-neon-blue/60" />
                        )}
                    </a>
                ))}
            </div>
        </nav>
    );
}
