"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage, type Locale } from "@/context/LanguageContext";

/* ─── Language Toggle (reused pattern from main Navbar) ─── */
function LanguageToggle({ locale, toggle }: { locale: Locale; toggle: () => void }) {
    return (
        <button
            onClick={toggle}
            className="group relative flex items-center gap-0.5 rounded border border-cyan-500/20 bg-cyan-500/5 px-1 py-0.5 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10"
            aria-label="Toggle language"
        >
            <span
                className={`relative z-10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider transition-colors duration-300 ${locale === "tr" ? "text-[#020617]" : "text-slate-400"}`}
            >
                TR
            </span>
            <span
                className={`relative z-10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider transition-colors duration-300 ${locale === "en" ? "text-[#020617]" : "text-slate-400"}`}
            >
                EN
            </span>
            <span
                className={`absolute top-0.5 h-[calc(100%-4px)] w-[calc(50%-2px)] rounded-sm bg-cyan-400 transition-all duration-300 ease-out ${locale === "tr" ? "left-0.5" : "left-[calc(50%+1px)]"}`}
            />
        </button>
    );
}

/* ─── Top Bar ─── */
export function MumTTopBar() {
    const { locale, toggle } = useLanguage();
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = useCallback(() => {
        const y = window.scrollY;
        /* Show when near top or scrolling up, hide when scrolling down past hero */
        if (y < 100) {
            setVisible(true);
        } else if (y < lastScrollY) {
            setVisible(true);
        } else {
            setVisible(false);
        }
        setLastScrollY(y);
    }, [lastScrollY]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -60, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between px-4 py-2.5 sm:px-6"
                    style={{
                        background: "rgba(2, 6, 23, 0.6)",
                        backdropFilter: "blur(12px) saturate(1.3)",
                        WebkitBackdropFilter: "blur(12px) saturate(1.3)",
                        borderBottom: "1px solid rgba(0, 212, 255, 0.08)",
                    }}
                >
                    {/* Home Button */}
                    <Link
                        href="/"
                        className="group flex items-center gap-2 rounded-md border border-white/5 px-2.5 py-1.5 font-mono text-[10px] tracking-wider text-slate-400 transition-all hover:border-cyan-500/20 hover:bg-cyan-500/5 hover:text-cyan-400 sm:px-3"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                        <span className="hidden sm:inline">
                            {locale === "tr" ? "ANA SAYFA" : "HOME"}
                        </span>
                    </Link>

                    {/* Center: Page Title (visible on wider screens) */}
                    <span className="hidden font-mono text-[9px] tracking-[0.3em] text-cyan-500/40 sm:block">
                        MUM-T TACTICAL
                    </span>

                    {/* Language Toggle */}
                    <LanguageToggle locale={locale} toggle={toggle} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ─── Scroll to Top (KAAN jet image) ─── */
export function ScrollToTop() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        function handleScroll() {
            setShow(window.scrollY > 600);
        }
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    function scrollUp() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.7, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 20 }}
                    whileHover={{ scale: 1.15, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={scrollUp}
                    className="group fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full border border-cyan-500/20 sm:h-16 sm:w-16"
                    style={{
                        background: "rgba(2, 6, 23, 0.7)",
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 0 20px rgba(0, 212, 255, 0.15), 0 4px 16px rgba(0, 0, 0, 0.4)",
                    }}
                    aria-label="Scroll to top"
                >
                    {/* Rotating glow ring */}
                    <div
                        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                            background: "conic-gradient(from 0deg, transparent, rgba(0,212,255,0.3), transparent)",
                            animation: "spin 3s linear infinite",
                        }}
                    />
                    <div
                        className="absolute inset-[2px] rounded-full"
                        style={{ background: "rgba(2, 6, 23, 0.9)" }}
                    />

                    {/* KAAN jet image */}
                    <Image
                        src="/imlec.png"
                        alt="KAAN"
                        width={36}
                        height={36}
                        className="relative z-10 h-8 w-8 object-contain drop-shadow-[0_0_6px_rgba(0,212,255,0.4)] transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(0,212,255,0.6)] sm:h-9 sm:w-9"
                        style={{ filter: "brightness(1.6) contrast(1.1)" }}
                    />

                    {/* Pulse ring */}
                    <span className="pointer-events-none absolute inset-0 rounded-full border border-cyan-400/20 opacity-0 transition-opacity group-hover:animate-ping group-hover:opacity-100" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
