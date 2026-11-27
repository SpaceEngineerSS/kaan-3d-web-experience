"use client";

import { useEffect } from "react";
import { MODES, SECTION_IDS, SECTION_MODE, notifyTerminal, setMode, terminal, type Mode } from "@/lib/terminal/state";

/**
 * Feeds the shared terminal store: progress through the pinned 3D track (#track), smoothed scroll
 * velocity, the active section and the pointer. Mounted once on the home page.
 */
export function TerminalDriver() {
    useEffect(() => {
        // ?mode=xray pins a mode (used by scripts/capture.mjs); otherwise each section brings its own.
        const forced = new URLSearchParams(window.location.search).get("mode") as Mode | null;
        const pinned = forced && (MODES as readonly string[]).includes(forced) ? forced : null;
        if (pinned) setMode(pinned);
        let lastY = window.scrollY;
        let lastT = performance.now();
        let raf = 0;

        const onPointer = (e: PointerEvent) => {
            terminal.px = (e.clientX / window.innerWidth) * 2 - 1;
            terminal.py = (e.clientY / window.innerHeight) * 2 - 1;
        };

        const tick = (now: number) => {
            raf = requestAnimationFrame(tick);
            if (document.hidden) return;

            const y = window.scrollY;
            const dt = Math.max(1, now - lastT);
            const v = ((y - lastY) / dt) * 1000;
            terminal.velocity += (v - terminal.velocity) * 0.12;
            lastY = y;
            lastT = now;

            const track = document.getElementById("track");
            if (track) {
                const r = track.getBoundingClientRect();
                const span = r.height - window.innerHeight;
                terminal.track = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
            }

            const mid = window.innerHeight / 2;
            let active = terminal.section;
            for (let i = 0; i < SECTION_IDS.length; i++) {
                const el = document.getElementById(SECTION_IDS[i]);
                if (!el) continue;
                const r = el.getBoundingClientRect();
                if (r.top <= mid && r.bottom > mid) active = i;
            }
            if (active !== terminal.section) {
                terminal.section = active;
                if (!pinned) terminal.mode = SECTION_MODE[active];
                notifyTerminal();
            }
        };

        raf = requestAnimationFrame(tick);
        window.addEventListener("pointermove", onPointer, { passive: true });
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("pointermove", onPointer);
        };
    }, []);

    return null;
}
