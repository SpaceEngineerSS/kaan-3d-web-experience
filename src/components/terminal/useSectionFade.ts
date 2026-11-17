"use client";

import { useEffect, type RefObject } from "react";

/**
 * Sections 01–04 are 150svh tall with a 100svh sticky block, so two blocks share the screen for
 * half a viewport while one leaves and the next arrives. This fades each block in as its section
 * reaches the screen and out before the next one covers it. Writes style directly from one rAF;
 * no React state. Below md the blocks are not sticky, so nothing is faded there.
 */
export function useSectionFade(section: RefObject<HTMLElement | null>, block: RefObject<HTMLElement | null>) {
    useEffect(() => {
        const sec = section.current;
        const el = block.current;
        if (!sec || !el) return;
        const md = window.matchMedia("(min-width: 768px)");
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
        let raf = 0;
        let last = -1;

        const tick = () => {
            raf = requestAnimationFrame(tick);
            if (document.hidden) return;
            let o = 1;
            if (md.matches) {
                const vh = window.innerHeight;
                const r = sec.getBoundingClientRect();
                // in: as the section's top rises from 60% to 15% of the screen
                const fin = (0.6 * vh - r.top) / (0.45 * vh);
                // out: as the section's bottom falls from 115% to 70% of the screen (next block arriving)
                const fout = (r.bottom - 0.7 * vh) / (0.45 * vh);
                o = Math.max(0, Math.min(1, fin, fout));
                if (reduce.matches) o = o > 0.5 ? 1 : 0;
            }
            if (Math.abs(o - last) < 0.005) return;
            last = o;
            el.style.opacity = String(o);
            el.style.visibility = o < 0.02 ? "hidden" : "visible";
        };
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            el.style.opacity = "";
            el.style.visibility = "";
        };
    }, [section, block]);
}
