"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { CameraPreset } from "./KaanModel";

const PRESETS: { id: CameraPreset; tr: string; en: string }[] = [
    { id: "front", tr: "Ön", en: "Front" },
    { id: "side", tr: "Yan", en: "Side" },
    { id: "top", tr: "Üst", en: "Top" },
    { id: "rear", tr: "Arka", en: "Rear" },
    { id: "cockpit", tr: "Kokpit", en: "Cockpit" },
];

interface SceneControlsProps {
    visible: boolean;
    xRay: boolean;
    onXRay: (v: boolean) => void;
    preset: CameraPreset | null;
    onPreset: (p: CameraPreset | null) => void;
}

export function SceneControls({ visible, xRay, onXRay, preset, onPreset }: SceneControlsProps) {
    const { locale } = useLanguage();
    const [open, setOpen] = useState(false);
    const tr = locale === "tr";

    return (
        <div
            className={`fixed bottom-4 right-4 z-40 transition-[opacity,transform] duration-500 md:bottom-6 md:right-6 ${
                visible ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
            }`}
            aria-hidden={!visible}
        >
            <div className="glass-panel">
                {open && (
                    <div id="scene-panel" className="border-b border-line p-3">
                        <p className="t-label mb-2">{tr ? "Bakış açısı" : "View"}</p>
                        <div className="grid grid-cols-3 gap-1">
                            {PRESETS.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    aria-pressed={preset === p.id}
                                    onClick={() => onPreset(preset === p.id ? null : p.id)}
                                    className="t-label min-h-9 border border-line px-2 py-1.5 text-fg-2 transition-colors hover:border-line-strong hover:text-fg aria-pressed:border-signal aria-pressed:text-signal"
                                >
                                    {tr ? p.tr : p.en}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => onPreset(null)}
                                disabled={!preset}
                                className="t-label min-h-9 border border-line px-2 py-1.5 text-muted transition-colors hover:text-fg disabled:opacity-40"
                            >
                                {tr ? "Serbest" : "Free"}
                            </button>
                        </div>
                        <label className="mt-3 flex cursor-pointer items-center justify-between gap-4">
                            <span className="t-label text-fg-2">{tr ? "Tel kafes görünüm" : "Wireframe view"}</span>
                            <input
                                type="checkbox"
                                checked={xRay}
                                onChange={(e) => onXRay(e.target.checked)}
                                className="h-4 w-4 accent-[var(--color-signal)]"
                            />
                        </label>
                    </div>
                )}
                <button
                    type="button"
                    aria-expanded={open}
                    aria-controls="scene-panel"
                    onClick={() => setOpen((o) => !o)}
                    className="t-label flex min-h-11 w-full items-center justify-between gap-4 px-3 text-fg-2 hover:text-fg"
                >
                    <span>{tr ? "Modeli incele" : "Inspect model"}</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}>
                        <path d="M1 7l4-4 4 4" stroke="currentColor" fill="none" strokeWidth="1.2" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
