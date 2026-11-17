"use client";

import { useEffect } from "react";
import { SECTION_IDS, notifyTerminal, terminal } from "@/lib/terminal/state";

/**
 * Feeds the shared terminal store: progress through the pinned 3D track (#track), smoothed scroll
 * velocity, the active section and the pointer. Mounted once on the home page.
 */
export function TerminalDriver() {
    useEffect(() => {
        let lastY = window.scrollY;
        let lastT = performance.now();
        let raf = 0;
        let frames = 0;
        let fpsT = performance.now();

        const onPointer = (e: PointerEvent) => {
            terminal.px = (e.clientX / window.innerWidth) * 2 - 1;
            terminal.py = (e.clientY / window.innerHeight) * 2 - 1;
        };

        const tick = (now: number) => {
            raf = requestAnimationFrame(tick);
            if (document.hidden) return;

            frames++;
            if (now - fpsT >= 500) {
                terminal.fps = Math.round((frames * 1000) / (now - fpsT));
                frames = 0;
                fpsT = now;
            }

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
