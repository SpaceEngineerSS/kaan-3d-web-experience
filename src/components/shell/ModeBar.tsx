"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useLanguage, type Locale } from "@/context/LanguageContext";
import { MODES, setInspect, setMode, subscribeTerminal, terminal, type Mode } from "@/lib/terminal/state";

const LABEL: Record<Mode, Record<Locale, string>> = {
    airframe: { tr: "GÖVDE", en: "AIRFRAME" },
    xray: { tr: "X-RAY", en: "X-RAY" },
    aero: { tr: "AERO", en: "AERO" },
    eoir: { tr: "EO/IR", en: "EO/IR" },
};

const HINT: Record<Mode, Record<Locale, string>> = {
    airframe: { tr: "RAM kaplamalı gövde, hangar ışığında", en: "RAM-coated airframe under hangar light" },
    xray: { tr: "Yüzey saydam: iç yerleşim (temsili)", en: "Surface cleared: internal layout (notional)" },
    aero: { tr: "Girdap izleri ve şok elmasları (temsili)", en: "Vortex trails and shock diamonds (representative)" },
    eoir: { tr: "Uzun dalga kızılötesi, beyaz-sıcak (temsili)", en: "Long-wave infrared, white-hot (representative)" },
};

async function clickSound() {
    if (!terminal.sound) return;
    const { click } = await import("@/lib/audio/hangar");
    click();
}

function lockScroll(on: boolean) {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    document.documentElement.dataset.inspect = on ? "on" : "off";
    document.documentElement.style.overflow = on ? "hidden" : "";
    if (on) lenis?.stop();
    else lenis?.start();
}

/** Inspection modes for the pinned scene (keys 1–4) and free orbit (I). Shown while the 3D track is on screen. */
export function ModeBar() {
    const { locale } = useLanguage();
    const mode = useSyncExternalStore(subscribeTerminal, () => terminal.mode, () => "airframe" as Mode);
    const section = useSyncExternalStore(subscribeTerminal, () => terminal.section, () => 0);
    const inspect = useSyncExternalStore(subscribeTerminal, () => terminal.inspect, () => false);
    const inTrack = section < 4;

    const choose = (m: Mode) => {
        setMode(m);
        void clickSound();
    };
    const toggleInspect = () => {
        const next = !terminal.inspect;
        setInspect(next);
        lockScroll(next);
        void clickSound();
    };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const t = e.target as HTMLElement | null;
            if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
            if (terminal.section >= 4) return;
            const i = ["1", "2", "3", "4"].indexOf(e.key);
            if (i >= 0) {
                setMode(MODES[i]);
                void clickSound();
            } else if (e.key === "i" || e.key === "I") {
                const next = !terminal.inspect;
                setInspect(next);
                lockScroll(next);
            } else if (e.key === "Escape" && terminal.inspect) {
                setInspect(false);
                lockScroll(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        if (!inTrack && terminal.inspect) {
            setInspect(false);
            lockScroll(false);
        }
    }, [inTrack]);

    return (
        <div
            className={`fixed inset-x-0 bottom-0 z-[45] flex justify-center transition-opacity duration-300 sm:bottom-8 ${inTrack ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={!inTrack}
        >
            <div data-keepout-bar className="flex w-full flex-col items-stretch border-t border-edge-2 bg-ink-2 sm:w-auto sm:border">
                <div role="group" aria-label={locale === "tr" ? "İnceleme modu" : "Inspection mode"} className="flex overflow-x-auto">
                    {MODES.map((m, i) => (
                        <button
                            key={m}
                            type="button"
                            aria-pressed={mode === m}
                            onClick={() => choose(m)}
                            tabIndex={inTrack ? 0 : -1}
                            className={`t-tele relative flex min-h-11 flex-1 items-center gap-2 whitespace-nowrap border-r border-edge px-4 transition-colors hover:text-fg sm:flex-none ${mode === m ? "text-fg" : ""}`}
                        >
                            <span className={mode === m ? "text-accent" : "text-faint"}>{i + 1}</span>
                            {LABEL[m][locale]}
                            {mode === m && <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-accent" />}
                        </button>
                    ))}
                    <button
                        type="button"
                        aria-pressed={inspect}
                        onClick={toggleInspect}
                        tabIndex={inTrack ? 0 : -1}
                        className={`t-tele flex min-h-11 items-center gap-2 whitespace-nowrap px-4 transition-colors hover:text-fg ${inspect ? "text-accent" : ""}`}
                    >
                        <span className="text-faint">I</span>
                        {inspect ? (locale === "tr" ? "ÇIK" : "EXIT") : locale === "tr" ? "İNCELE" : "INSPECT"}
                    </button>
                </div>
                <p className="t-tele hidden border-t border-edge px-4 py-1.5 text-faint sm:block" aria-live="polite">
                    {inspect ? (locale === "tr" ? "Sürükleyerek döndürün · Esc ile çıkın" : "Drag to orbit · Esc to exit") : HINT[mode][locale]}
                </p>
            </div>
        </div>
    );
}
