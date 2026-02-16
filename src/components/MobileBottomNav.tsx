/**
 * @author Mehmet Gümüş [github.com/SpaceEngineerSS](https://github.com/SpaceEngineerSS)
 * @project KAAN 3D Web Experience
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Home, Target, Cpu, Crosshair, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface NavItem {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    labelTR: string;
    labelEN: string;
}

const NAV_ITEMS: NavItem[] = [
    { id: "hero", icon: Home, labelTR: "ANA", labelEN: "HOME" },
    { id: "specs", icon: Target, labelTR: "SPEC", labelEN: "SPEC" },
    { id: "technology", icon: Cpu, labelTR: "TEK", labelEN: "TECH" },
    { id: "weapons", icon: Crosshair, labelTR: "SİLAH", labelEN: "WEAP" },
    { id: "timeline", icon: Clock, labelTR: "ZAMAN", labelEN: "TIME" },
];

const SPRING_CONFIG = { stiffness: 400, damping: 28, mass: 0.8 };

export function MobileBottomNav() {
    const { locale } = useLanguage();
    const [activeSection, setActiveSection] = useState("hero");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 200);

            const resolved = NAV_ITEMS.map((item) => ({
                id: item.id,
                el: document.getElementById(item.id),
            })).filter((s) => s.el !== null);

            for (let i = resolved.length - 1; i >= 0; i--) {
                const rect = resolved[i].el!.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2) {
                    setActiveSection(resolved[i].id);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleTap = useCallback((sectionId: string) => {
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
            navigator.vibrate(6);
        }

        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    return (
        <motion.nav
            initial={{ y: "100%" }}
            animate={{ y: visible ? 0 : "100%", opacity: visible ? 1 : 0 }}
            transition={{ type: "spring", ...SPRING_CONFIG }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
            style={{
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
                background: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(24px) saturate(1.4)",
                WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                boxShadow:
                    "inset 0 1px 0 rgba(0, 212, 255, 0.06), 0 -8px 32px rgba(0, 0, 0, 0.4)",
            }}
        >
            <div className="relative flex items-center justify-around px-2 py-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleTap(item.id)}
                            className="relative z-10 flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-colors"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-active-pill"
                                    className="absolute inset-0 rounded-xl"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, rgba(0, 212, 255, 0.12) 0%, rgba(0, 212, 255, 0.04) 100%)",
                                        boxShadow: "0 0 16px rgba(0, 212, 255, 0.08)",
                                    }}
                                    transition={{ type: "spring", ...SPRING_CONFIG }}
                                />
                            )}

                            <Icon
                                className={`relative z-10 h-[18px] w-[18px] transition-colors duration-200 ${isActive ? "text-[#00d4ff]" : "text-white/25"
                                    }`}
                            />

                            <span
                                className={`relative z-10 text-[9px] tracking-[0.18em] transition-colors duration-200 ${isActive ? "text-[#00d4ff]" : "text-white/20"
                                    }`}
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {locale === "tr" ? item.labelTR : item.labelEN}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="nav-active-dot"
                                    className="h-[2px] w-5 rounded-full bg-[#00d4ff]/50"
                                    transition={{ type: "spring", ...SPRING_CONFIG }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </motion.nav>
    );
}
