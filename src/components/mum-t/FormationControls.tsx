"use client";

import { useT } from "@/context/LanguageContext";
import { hero } from "@/content/mumt";
import { FORMATION_MODES, type FormationMode } from "./useFormation";

/** Segmented control for the hero formation, with a live caption describing the current command. */
export function FormationControls({ mode, onChange }: { mode: FormationMode; onChange: (m: FormationMode) => void }) {
    const t = useT();
    const h = t(hero);

    return (
        <div className="border border-edge bg-ink">
            <div className="flex items-center justify-between border-b border-edge px-4 py-2">
                <p id="formation-label" className="t-label">
                    {h.controls}
                </p>
                <span className="t-label text-accent">{h.modes[mode].label}</span>
            </div>
            <div className="p-4">
            <div className="seg flex-wrap" role="group" aria-labelledby="formation-label">
                {FORMATION_MODES.map((m) => (
                    <button key={m} type="button" aria-pressed={mode === m} onClick={() => onChange(m)} className="pointer-coarse:min-h-11!">
                        {h.modes[m].label}
                    </button>
                ))}
            </div>
            <p className="mt-3 max-w-[48ch] text-[0.9375rem] leading-snug text-fg-2" aria-live="polite">
                {h.modes[mode].caption}
            </p>
            <p className="mt-2 text-[0.8125rem] text-faint">{h.note}</p>
            </div>
        </div>
    );
}
