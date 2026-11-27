"use client";

import { useSyncExternalStore } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { subscribeTerminal, terminal } from "@/lib/terminal/state";

export function SoundToggle({ className = "" }: { className?: string }) {
    const { locale } = useLanguage();
    const on = useSyncExternalStore(subscribeTerminal, () => terminal.sound, () => false);

    const toggle = async () => {
        // The audio graph is only downloaded and built after the first click.
        const { setSound } = await import("@/lib/audio/hangar");
        setSound(!terminal.sound);
    };

    return (
        <button type="button" className={`toggle ${className}`} aria-pressed={on} data-live={on} onClick={toggle} title={locale === "tr" ? "Sentezlenmiş hangar sesi" : "Synthesised hangar sound"}>
            {locale === "tr" ? "SES" : "SOUND"}
        </button>
    );
}
