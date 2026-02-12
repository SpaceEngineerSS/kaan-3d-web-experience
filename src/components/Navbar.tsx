"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage, type Locale } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { SoundToggle, useSoundEngine } from "@/components/ui/SoundEngine";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import translations from "@/lib/translations";

export function Navbar() {
    const { locale, toggle: toggleLang } = useLanguage();
    const { mode, toggle: toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(false);

    const { playClick } = useSoundEngine(soundEnabled);

    const navLinks = translations.nav[locale];

    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 60);
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    useKeyboardShortcuts({
        onToggleTheme: () => { toggleTheme(); playClick(); },
        onToggleMute: () => { setSoundEnabled((p) => !p); playClick(); },
        onToggleLanguage: () => { toggleLang(); playClick(); },
    });

    const handleNavClick = useCallback(
        (e: React.MouseEvent) => {
            playClick();
            setMobileOpen(false);
        },
        [playClick]
    );

    return (
        <nav
            className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${scrolled
                ? "glass-panel border-b border-neon-blue/10"
                : "bg-transparent"
                }`}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12">
                <a href="#hero" className="flex items-center gap-3">
                    <div className="h-8 w-1 bg-neon-blue" />
                    <span className="text-xl font-bold tracking-[0.2em] text-white">
                        KAAN
                    </span>
                    <span
                        className="rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[8px] font-bold tracking-[0.15em] text-red-400"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        {translations.navBadge[locale]}
                    </span>
                </a>

                <div className="hidden items-center gap-6 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={handleNavClick}
                            className="text-xs tracking-[0.2em] text-slate-300 transition-colors duration-300 hover:text-neon-blue"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {link.label}
                        </a>
                    ))}

                    {/* Day/Night Toggle */}
                    <button
                        onClick={() => { toggleTheme(); playClick(); }}
                        className="group relative flex items-center justify-center rounded border border-neon-blue/20 bg-neon-blue/5 p-1.5 transition-all hover:border-neon-blue/40 hover:bg-neon-blue/10"
                        aria-label={mode === "day" ? "Night mode" : "Day mode"}
                        title={mode === "day" ? "Gece Modu (N)" : "Gündüz Modu (N)"}
                    >
                        {mode === "day" ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neon-blue">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                            </svg>
                        )}
                    </button>

                    {/* Sound Toggle */}
                    <SoundToggle
                        enabled={soundEnabled}
                        toggle={() => { setSoundEnabled((p) => !p); playClick(); }}
                    />

                    <LanguageToggle locale={locale} toggle={() => { toggleLang(); playClick(); }} />
                </div>

                <div className="flex items-center gap-3 md:hidden">
                    {/* Mobile toggles */}
                    <button
                        onClick={() => { toggleTheme(); playClick(); }}
                        className="rounded border border-neon-blue/20 bg-neon-blue/5 p-1.5"
                        aria-label="Toggle theme"
                    >
                        {mode === "day" ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neon-blue">
                                <circle cx="12" cy="12" r="5" />
                            </svg>
                        ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                            </svg>
                        )}
                    </button>

                    <SoundToggle
                        enabled={soundEnabled}
                        toggle={() => setSoundEnabled((p) => !p)}
                    />

                    <LanguageToggle locale={locale} toggle={toggleLang} />
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex flex-col gap-1.5"
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`block h-px w-6 bg-neon-blue transition-transform duration-300 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""
                                }`}
                        />
                        <span
                            className={`block h-px w-6 bg-neon-blue transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""
                                }`}
                        />
                        <span
                            className={`block h-px w-6 bg-neon-blue transition-transform duration-300 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
                                }`}
                        />
                    </button>
                </div>
            </div>

            <div
                className={`overflow-hidden transition-all duration-500 md:hidden ${mobileOpen ? "max-h-64" : "max-h-0"
                    }`}
            >
                <div className="glass-panel border-t border-neon-blue/10 px-6 py-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={handleNavClick}
                            className="block py-3 text-xs tracking-[0.2em] text-slate-300 transition-colors hover:text-neon-blue"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>

            {scrolled && (
                <div className="h-px w-full bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent" />
            )}
        </nav>
    );
}

function LanguageToggle({ locale, toggle }: { locale: Locale; toggle: () => void }) {
    return (
        <button
            onClick={toggle}
            className="group relative flex items-center gap-0.5 rounded border border-neon-blue/20 bg-neon-blue/5 px-1 py-0.5 transition-all hover:border-neon-blue/40 hover:bg-neon-blue/10"
            aria-label="Toggle language"
        >
            <span
                className={`relative z-10 px-2 py-0.5 text-[10px] font-bold tracking-wider transition-colors duration-300 ${locale === "tr" ? "text-stealth-black" : "text-titanium-light"
                    }`}
                style={{ fontFamily: "var(--font-mono)" }}
            >
                TR
            </span>
            <span
                className={`relative z-10 px-2 py-0.5 text-[10px] font-bold tracking-wider transition-colors duration-300 ${locale === "en" ? "text-stealth-black" : "text-titanium-light"
                    }`}
                style={{ fontFamily: "var(--font-mono)" }}
            >
                EN
            </span>

            <span
                className={`absolute top-0.5 h-[calc(100%-4px)] w-[calc(50%-2px)] rounded-sm bg-neon-blue transition-all duration-300 ease-out ${locale === "tr" ? "left-0.5" : "left-[calc(50%+1px)]"
                    }`}
            />
        </button>
    );
}
