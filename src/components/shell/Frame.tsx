"use client";

import { useEffect, useRef } from "react";

/** Fixed 1px frame inset 16px: corner marks, mission clock and the scroll-depth ruler. */
export function Frame() {
    const clock = useRef<HTMLSpanElement>(null);
    const depth = useRef<HTMLSpanElement>(null);
    const ruler = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let raf = 0;
        const t0 = performance.now();
        const tick = (now: number) => {
            raf = requestAnimationFrame(tick);
            if (document.hidden) return;
            const ms = now - t0;
            const m = Math.floor(ms / 60000) % 60;
            const s = Math.floor(ms / 1000) % 60;
            const ds = Math.floor((ms % 1000) / 100);
            if (clock.current) clock.current.textContent = `T+${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${ds}`;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const z = max > 0 ? window.scrollY / max : 0;
            if (depth.current) depth.current.textContent = (z * 100).toFixed(1).padStart(5, "0");
            if (ruler.current) ruler.current.style.transform = `translateY(${z * 100}%)`;
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <div aria-hidden className="pointer-events-none fixed inset-4 z-40 hidden border border-edge sm:block" data-overlay>
            {["-left-[5px] -top-[5px]", "-right-[5px] -top-[5px]", "-bottom-[5px] -left-[5px]", "-bottom-[5px] -right-[5px]"].map((pos) => (
                <span key={pos} className={`absolute ${pos} h-[9px] w-[9px]`}>
                    <span className="absolute left-1/2 top-0 h-full w-px bg-fg-2/50" />
                    <span className="absolute left-0 top-1/2 h-px w-full bg-fg-2/50" />
                </span>
            ))}

            <span ref={clock} className="t-tele absolute bottom-3 left-4 bg-ink px-1.5 text-muted">
                T+00:00.0
            </span>

            <div className="absolute bottom-16 right-2 top-24 w-3">
                <div className="absolute inset-y-0 right-0 w-px bg-edge" />
                {Array.from({ length: 21 }).map((_, i) => (
                    <div key={i} className="absolute right-0 h-px bg-edge-2" style={{ top: `${i * 5}%`, width: i % 5 === 0 ? 10 : 5 }} />
                ))}
                <div ref={ruler} className="absolute -right-px top-0 h-full w-[3px]">
                    <div className="h-4 w-full bg-accent" />
                </div>
            </div>
            <span className="t-tele absolute right-6 top-20 bg-ink px-1.5 text-muted">
                Z <span ref={depth}>000.0</span>
            </span>
        </div>
    );
}
