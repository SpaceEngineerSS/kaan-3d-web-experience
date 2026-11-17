"use client";

import { useEffect, useRef } from "react";
import { terminal } from "@/lib/terminal/state";

/**
 * The terminal frame: a fixed 1px border inset 16px with live corner readouts.
 * Values are written straight into the DOM from one rAF (no React re-renders).
 */
export function Frame() {
    const clock = useRef<HTMLSpanElement>(null);
    const fps = useRef<HTMLSpanElement>(null);
    const depth = useRef<HTMLSpanElement>(null);
    const ruler = useRef<HTMLDivElement>(null);
    const vel = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        let raf = 0;
        const t0 = performance.now();
        const tick = (now: number) => {
            raf = requestAnimationFrame(tick);
            if (document.hidden) return;
            const ms = now - t0;
            const h = Math.floor(ms / 3600000);
            const m = Math.floor(ms / 60000) % 60;
            const s = Math.floor(ms / 1000) % 60;
            const msr = Math.floor(ms % 1000);
            if (clock.current) clock.current.textContent = `T+${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(msr).padStart(3, "0")}`;
            if (fps.current) fps.current.textContent = String(terminal.fps).padStart(3, "0");
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const z = max > 0 ? window.scrollY / max : 0;
            if (depth.current) depth.current.textContent = (z * 100).toFixed(1).padStart(5, "0");
            if (ruler.current) ruler.current.style.transform = `translateY(${z * 100}%)`;
            if (vel.current) vel.current.textContent = `${terminal.velocity >= 0 ? "+" : "−"}${Math.min(9999, Math.abs(Math.round(terminal.velocity))).toString().padStart(4, "0")}`;
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <div aria-hidden className="pointer-events-none fixed inset-4 z-40 hidden border border-edge sm:block" data-overlay>
            {/* corner crosshairs */}
            {["-left-[5px] -top-[5px]", "-right-[5px] -top-[5px]", "-bottom-[5px] -left-[5px]", "-bottom-[5px] -right-[5px]"].map((pos) => (
                <span key={pos} className={`absolute ${pos} h-[9px] w-[9px]`}>
                    <span className="absolute left-1/2 top-0 h-full w-px bg-fg-2/60" />
                    <span className="absolute left-0 top-1/2 h-px w-full bg-fg-2/60" />
                </span>
            ))}

            {/* bottom-left: mission clock + reference */}
            <div className="t-tele absolute bottom-3 left-4 flex gap-5 bg-ink px-1.5 text-fg-2">
                <span ref={clock}>T+00:00:00.000</span>
                <span className="hidden md:inline">REF 40°04′K 32°34′D · MÜRTED</span>
            </div>

            {/* bottom-right: fps + scroll velocity */}
            <div className="t-tele absolute bottom-3 right-4 flex gap-5 bg-ink px-1.5 text-fg-2">
                <span>
                    V/S <span ref={vel}>+0000</span>
                </span>
                <span>
                    FPS <span ref={fps} className="text-fg-2">060</span>
                </span>
            </div>

            {/* right edge: scroll-Z depth ruler */}
            <div className="absolute bottom-16 right-2 top-24 w-3">
                <div className="absolute inset-y-0 right-0 w-px bg-edge" />
                {Array.from({ length: 21 }).map((_, i) => (
                    <div key={i} className="absolute right-0 h-px bg-edge-2" style={{ top: `${i * 5}%`, width: i % 5 === 0 ? 10 : 5 }} />
                ))}
                <div ref={ruler} className="absolute -right-px top-0 h-full w-[3px]">
                    <div className="h-4 w-full bg-hmd" />
                </div>
            </div>
            <div className="t-tele absolute right-6 top-20 bg-ink px-1.5 text-fg-2">
                Z <span ref={depth}>000.0</span>
            </div>
        </div>
    );
}
