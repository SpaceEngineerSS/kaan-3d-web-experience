"use client";

import { useSyncExternalStore } from "react";
import { useT } from "@/context/LanguageContext";
import { monuments } from "@/content/terminal";
import { subscribeTerminal, terminal } from "@/lib/terminal/state";

/** Where each word sits, so it never fights the section's reading block. */
const PLACE = [
    "left-[var(--gutter)] top-[22%] md:top-1/2 md:-translate-y-[58%]",
    "right-[var(--gutter)] top-[24%] text-right md:top-1/2 md:-translate-y-1/2",
    "left-1/2 top-[18%] -translate-x-1/2",
    "right-[var(--gutter)] bottom-[12%] text-right",
];

/**
 * The section word, drawn under the transparent WebGL canvas: the aircraft passes in front of it.
 * Section 01's word is the page title in solid paper; the others are quiet, outlined.
 */
export function Monument() {
    const t = useT();
    const words = t(monuments);
    const section = useSyncExternalStore(subscribeTerminal, () => terminal.section, () => 0);

    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {words.map((w, i) => (
                <p
                    key={i}
                    className={`t-monument absolute transition-opacity duration-700 ease-[var(--ease-out-quart)] ${PLACE[i]} ${i === 0 ? "" : "t-monument--ghost"} ${section === i ? "opacity-100" : "opacity-0"}`}
                >
                    {w}
                </p>
            ))}
        </div>
    );
}
