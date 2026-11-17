"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { CockpitCopy, PageId } from "@/content/cockpit";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";
import { HALF_MODE_RATIO, paintDisplay } from "./display";
import { resolveMono } from "./draw";
import { useDisplayLoop, usePrefersReducedMotion } from "./useDisplayLoop";

const TICKS = 14;

/** Soft-key ticks along one bezel edge. */
function BezelTicks({ edge }: { edge: "top" | "bottom" }) {
    return (
        <div aria-hidden className={`pointer-events-none absolute inset-x-[6%] flex justify-between ${edge === "top" ? "top-[3px]" : "bottom-[3px]"}`}>
            {Array.from({ length: TICKS }, (_, i) => (
                <span key={i} className="block h-[5px] w-px bg-edge-2" />
            ))}
        </div>
    );
}

/**
 * Simulated KAAN Large Area Display: one 2.5:1 canvas made of two 5:4 portals with a strip of small windows.
 * Wide screens see both halves; phones see the selected portal's half. One loop, paused off-screen.
 */
export function LargeAreaDisplay({ copy }: { copy: CockpitCopy["display"] }) {
    const [pages, setPages] = useState<[PageId, PageId]>(["tsd", "rdr"]);
    const [active, setActive] = useState<0 | 1>(0);
    const [mono, setMono] = useState("ui-monospace, monospace");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const reduced = usePrefersReducedMotion();
    const { isMobile } = useDeviceProfile();

    useEffect(() => {
        // next/font's generated family name only exists in the browser.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMono(resolveMono());
    }, []);

    const tabs = useMemo(() => Object.fromEntries(copy.pages.map((p) => [p.id, p.tab])) as Record<PageId, string>, [copy.pages]);
    const labels = copy.canvas;

    const paint = useCallback(
        (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => paintDisplay(ctx, w, h, t, { pages, tabs, active, labels, mono }),
        [pages, tabs, active, labels, mono]
    );
    useDisplayLoop(canvasRef, paint, { visibilityTarget: frameRef, animate: !reduced, fps: isMobile ? 30 : 60 });

    const selectPage = (id: PageId) => {
        setPages((cur) => {
            const next: [PageId, PageId] = [cur[0], cur[1]];
            const other = active === 0 ? 1 : 0;
            if (next[other] === id) next[other] = next[active];
            next[active] = id;
            return next;
        });
    };

    const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
        const n = copy.pages.length;
        let k = -1;
        if (e.key === "ArrowRight") k = (i + 1) % n;
        else if (e.key === "ArrowLeft") k = (i - 1 + n) % n;
        else if (e.key === "Home") k = 0;
        else if (e.key === "End") k = n - 1;
        if (k < 0) return;
        e.preventDefault();
        selectPage(copy.pages[k].id);
        tabRefs.current[k]?.focus();
    };

    // Touching a portal on the wide view makes it the active one, as on a touchscreen.
    const onCanvasPointer = (e: PointerEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (rect.width / rect.height < HALF_MODE_RATIO) return;
        setActive(e.clientX - rect.left < rect.width / 2 ? 0 : 1);
    };

    const pageOf = (id: PageId) => copy.pages.find((p) => p.id === id) ?? copy.pages[0];
    const current = pageOf(pages[active]);
    const aria = `${copy.portals[0]}: ${pageOf(pages[0]).name}. ${copy.portals[1]}: ${pageOf(pages[1]).name}. ${copy.honest}`;

    return (
        <figure className="m-0">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
                <figcaption className="max-w-[44ch]">
                    <span className="t-h3 block text-fg">{copy.title}</span>
                    <span className="t-label mt-2 block">{copy.hint}</span>
                </figcaption>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="seg" role="group" aria-label={copy.portalLabel}>
                        {copy.portals.map((label, i) => (
                            <button key={label} type="button" aria-pressed={active === i} onClick={() => setActive(i as 0 | 1)}>
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="seg" role="tablist" aria-label={copy.pagesLabel}>
                        {copy.pages.map((p, i) => {
                            const on = pages[active] === p.id;
                            return (
                                <button
                                    key={p.id}
                                    ref={(el) => {
                                        tabRefs.current[i] = el;
                                    }}
                                    type="button"
                                    role="tab"
                                    id={`lad-tab-${p.id}`}
                                    aria-selected={on}
                                    aria-controls="lad-panel"
                                    title={p.name}
                                    tabIndex={on ? 0 : -1}
                                    onClick={() => selectPage(p.id)}
                                    onKeyDown={(e) => onTabKey(e, i)}
                                >
                                    {p.tab}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div
                ref={frameRef}
                id="lad-panel"
                role="tabpanel"
                aria-labelledby={`lad-tab-${pages[active]}`}
                className="relative mt-6 rounded-[3px] border border-edge-2 bg-[#0b0e12] p-[9px] sm:p-3"
            >
                <BezelTicks edge="top" />
                <BezelTicks edge="bottom" />
                <canvas
                    ref={canvasRef}
                    role="img"
                    aria-label={aria}
                    onPointerDown={onCanvasPointer}
                    className="block aspect-[5/4] w-full bg-black md:aspect-[5/2]"
                />
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-12 md:gap-8" aria-live="polite">
                <p className="t-label md:col-span-3 lg:col-span-2">
                    <span className="text-hmd">{current.tab}</span> · {current.name}
                </p>
                <p className="t-body max-w-[66ch] md:col-span-9 lg:col-span-8">{current.body}</p>
            </div>
        </figure>
    );
}
