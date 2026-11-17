"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useLanguage, type Locale } from "@/context/LanguageContext";
import { SECTION_IDS, setTelemetry, subscribeTerminal, terminal } from "@/lib/terminal/state";

const SECTIONS: Record<Locale, string[]> = {
    tr: ["İlk uçuş", "Gövde", "Kokpit", "MUM-T", "Arşiv"],
    en: ["First flight", "Airframe", "Cockpit", "MUM-T", "Archive"],
};

/** Top status line of the terminal: system id, ceiling, live FPS, section index, toggles. */
export function StatusBar() {
    const { locale, setLocale } = useLanguage();
    const section = useSyncExternalStore(subscribeTerminal, () => terminal.section, () => 0);
    const telemetry = useSyncExternalStore(subscribeTerminal, () => terminal.telemetry, () => true);
    const fpsRef = useRef<HTMLSpanElement>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        let raf = 0;
        const tick = () => {
            raf = requestAnimationFrame(tick);
            if (fpsRef.current && !document.hidden) fpsRef.current.textContent = String(terminal.fps).padStart(3, "0");
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const names = SECTIONS[locale];

    return (
        <header className="fixed inset-x-0 top-0 z-50 sm:inset-x-4 sm:top-4">
            <nav aria-label={locale === "tr" ? "Bölümler" : "Sections"} className="flex h-11 items-stretch border-b border-edge bg-ink/85 sm:border sm:border-edge">
                <a href="#s01" className="t-tele flex items-center gap-2 border-r border-edge px-4 text-fg">
                    <span className="font-display text-[13px] font-bold tracking-[0.08em] text-fg">KAAN</span>
                    <span className="hidden lg:inline">SYS.MMU.KAAN // REV 2026.4</span>
                </a>
                <div className="t-tele hidden items-center gap-5 border-r border-edge px-4 xl:flex">
                    <span>
                        CEIL <span className="text-fg-2">55,000 FT</span>
                    </span>
                    <span>
                        FPS <span ref={fpsRef} className="text-fg-2">060</span>
                    </span>
                </div>

                <ol className="hidden flex-1 items-stretch md:flex">
                    {SECTION_IDS.map((id, i) => (
                        <li key={id} className="flex">
                            <a
                                href={`#${id}`}
                                aria-current={section === i ? "true" : undefined}
                                className={`t-tele flex items-center gap-2 border-r border-edge px-3 transition-colors hover:text-fg ${section === i ? "text-fg" : ""}`}
                            >
                                <span className={section === i ? "text-hmd" : ""}>{String(i + 1).padStart(2, "0")}</span>
                                <span className="hidden lg:inline">{names[i]}</span>
                            </a>
                        </li>
                    ))}
                    <li className="flex">
                        <Link href="/mum-t" className="t-tele flex items-center border-r border-edge px-3 hover:text-fg">
                            /MUM-T
                        </Link>
                    </li>
                </ol>

                <div className="ml-auto flex items-center gap-3 px-3">
                    <button
                        type="button"
                        className="toggle hidden sm:inline"
                        aria-pressed={telemetry}
                        data-live={telemetry}
                        onClick={() => setTelemetry(!telemetry)}
                    >
                        {telemetry ? "TELEMETRY: ACTIVE" : "TELEMETRY: OFF"}
                    </button>
                    <div role="group" aria-label={locale === "tr" ? "Dil" : "Language"} className="flex">
                        {(["tr", "en"] as Locale[]).map((l) => (
                            <button key={l} type="button" lang={l} aria-pressed={locale === l} onClick={() => setLocale(l)} className="toggle">
                                {l.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="toggle md:hidden"
                        aria-expanded={open}
                        aria-controls="term-menu"
                        onClick={() => setOpen((o) => !o)}
                    >
                        {open ? "CLOSE" : "INDEX"}
                    </button>
                </div>
            </nav>

            {open && (
                <div id="term-menu" className="border-b border-edge bg-ink md:hidden">
                    <ol>
                        {SECTION_IDS.map((id, i) => (
                            <li key={id} className="border-t border-edge">
                                <a href={`#${id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-4 px-4 py-3">
                                    <span className="t-tele text-hmd">{String(i + 1).padStart(2, "0")}</span>
                                    <span className="font-display text-2xl font-bold uppercase tracking-[-0.02em]">{names[i]}</span>
                                </a>
                            </li>
                        ))}
                        <li className="border-t border-edge">
                            <Link href="/mum-t" className="t-tele block px-4 py-3">
                                /MUM-T
                            </Link>
                        </li>
                    </ol>
                </div>
            )}
        </header>
    );
}
