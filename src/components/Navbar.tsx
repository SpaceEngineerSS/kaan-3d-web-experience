"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage, type Locale } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { SoundToggle, useSoundEngine } from "@/components/ui/SoundEngine";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import translations from "@/lib/translations";

interface NavbarProps {
    onToggleXRay?: () => void;
    onCameraPreset?: (preset: string | null) => void;
    onToggleFullscreen?: () => void;
    onShowHelp?: () => void;
}

export function Navbar({
    onToggleXRay,
    onCameraPreset,
    onToggleFullscreen,
    onShowHelp,
}: NavbarProps) {
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

    /* Lock body scroll when mobile menu is open */
    useEffect(() => {
        if (mobileOpen) {
            document.body.classList.add("overflow-locked");
        } else {
            document.body.classList.remove("overflow-locked");
        }
        return () => document.body.classList.remove("overflow-locked");
    }, [mobileOpen]);

    useKeyboardShortcuts({
        onToggleTheme: () => { toggleTheme(); playClick(); },
        onToggleMute: () => { setSoundEnabled((p) => !p); playClick(); },
        onToggleLanguage: () => { toggleLang(); playClick(); },
        onToggleXRay: () => { onToggleXRay?.(); playClick(); },
        onCameraPreset: (preset) => { onCameraPreset?.(preset); playClick(); },
        onToggleFullscreen: () => { onToggleFullscreen?.(); playClick(); },
        onShowHelp: () => { onShowHelp?.(); playClick(); },
    });

    const handleNavClick = useCallback(
        () => {
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
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:px-12">
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

                {/* Desktop nav links */}
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

                    {/* Shortcuts Help */}
                    <button
                        onClick={() => { onShowHelp?.(); playClick(); }}
                        className="group relative flex items-center justify-center rounded border border-neon-blue/20 bg-neon-blue/5 p-1.5 transition-all hover:border-neon-blue/40 hover:bg-neon-blue/10"
                        aria-label="Keyboard shortcuts"
                        title={locale === "tr" ? "Kısayollar (?)" : "Shortcuts (?)"}
                    >
                        <span className="text-xs font-bold text-neon-blue/60" style={{ fontFamily: "var(--font-mono)" }}>?</span>
                    </button>

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

                {/* Mobile controls */}
                <div className="flex items-center gap-3 md:hidden">
                    <button
                        onClick={() => { toggleTheme(); playClick(); }}
                        className="rounded border border-neon-blue/20 bg-neon-blue/5 p-2"
                        aria-label="Toggle theme"
                    >
                        {mode === "day" ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neon-blue">
                                <circle cx="12" cy="12" r="5" />
                            </svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                            </svg>
                        )}
                    </button>

                    <SoundToggle
                        enabled={soundEnabled}
                        toggle={() => setSoundEnabled((p) => !p)}
                    />

                    <LanguageToggle locale={locale} toggle={toggleLang} />

                    {/* Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded border border-neon-blue/20 bg-neon-blue/5"
                        aria-label="Toggle menu"
                        aria-expanded={mobileOpen}
                    >
                        <span
                            className={`block h-px w-5 bg-neon-blue transition-transform duration-300 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""
                                }`}
                        />
                        <span
                            className={`block h-px w-5 bg-neon-blue transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""
                                }`}
                        />
                        <span
                            className={`block h-px w-5 bg-neon-blue transition-transform duration-300 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Full-screen Glassmorphism Mobile Drawer */}
            <div
                className={`fixed inset-0 top-16 z-40 transition-all duration-500 md:hidden ${mobileOpen
                    ? "visible opacity-100"
                    : "invisible opacity-0"
                    }`}
            >
                {/* Backdrop blur overlay */}
                <div
                    className="absolute inset-0 bg-stealth-black/85 backdrop-blur-xl"
                    onClick={() => setMobileOpen(false)}
                />

                {/* Nav links */}
                <div className="relative flex h-full flex-col items-center justify-center gap-2 px-8">
                    {navLinks.map((link, i) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={handleNavClick}
                            className="group flex w-full max-w-sm items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-6 py-4 text-sm tracking-[0.2em] text-slate-200 transition-all duration-300 active:scale-95 active:border-neon-blue/30"
                            style={{
                                fontFamily: "var(--font-mono)",
                                transitionDelay: mobileOpen ? `${i * 60}ms` : "0ms",
                                transform: mobileOpen ? "translateY(0)" : "translateY(20px)",
                                opacity: mobileOpen ? 1 : 0,
                            }}
                        >
                            <span>{link.label}</span>
                            <span className="text-neon-blue/40 transition-colors group-active:text-neon-blue">&#9656;</span>
                        </a>
                    ))}

                    {/* Bottom decorative line */}
                    <div
                        className="mt-8 h-px w-32 bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent transition-all duration-700"
                        style={{ opacity: mobileOpen ? 1 : 0 }}
                    />
                    <span
                        className="mt-2 text-[8px] tracking-[0.4em] text-titanium-light/30 transition-all duration-700"
                        style={{ fontFamily: "var(--font-mono)", opacity: mobileOpen ? 1 : 0 }}
                    >
                        KAAN // TF-X // MMU
                    </span>
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
