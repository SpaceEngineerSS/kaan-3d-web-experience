"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { CockpitCopy, DisplayPageId } from "@/content/cockpit";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";
import { resolveMono, type DrawPage } from "./draw";
import { drawFlight } from "./pageFlight";
import { drawSystems } from "./pageSystems";
import { drawTactical } from "./pageTactical";
import { useDisplayLoop, usePrefersReducedMotion } from "./useDisplayLoop";

const PAGES: Record<DisplayPageId, DrawPage> = {
    tsd: drawTactical,
    flight: drawFlight,
    systems: drawSystems,
};

/**
 * A simulated wide cockpit display: one canvas, one page at a time, real tabs above it.
 * The draw loop pauses off-screen and in background tabs, and stays static under reduced motion.
 */
export function PanoramicDisplay({ copy }: { copy: CockpitCopy }) {
    const [pageId, setPageId] = useState<DisplayPageId>("tsd");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const reduced = usePrefersReducedMotion();
    const { isMobile } = useDeviceProfile();
    const [mono, setMono] = useState("ui-monospace, monospace");

    useEffect(() => {
        // Resolved after mount: next/font's family name only exists in the browser.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMono(resolveMono());
    }, []);

    const labels = copy.labels;
    const paint = useCallback(
        (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
            PAGES[pageId]({ ctx, w, h, t, labels, mono });
        },
        [pageId, labels, mono]
    );

    useDisplayLoop(canvasRef, paint, { visibilityTarget: frameRef, animate: !reduced, fps: isMobile ? 30 : 60 });

    const page = copy.pages.find((p) => p.id === pageId) ?? copy.pages[0];

    const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
        const n = copy.pages.length;
        let next = -1;
        if (e.key === "ArrowRight") next = (i + 1) % n;
        else if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = n - 1;
        if (next < 0) return;
        e.preventDefault();
        setPageId(copy.pages[next].id);
        tabRefs.current[next]?.focus();
    };

    return (
        <figure className="m-0">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <figcaption>
                    <span className="t-h3 block text-fg">{copy.displayTitle}</span>
                    <span className="t-label mt-2 block">{copy.displayHint}</span>
                </figcaption>
                <div className="seg" role="tablist" aria-label={copy.displayTitle}>
                    {copy.pages.map((p, i) => (
                        <button
                            key={p.id}
                            ref={(el) => {
                                tabRefs.current[i] = el;
                            }}
                            type="button"
                            role="tab"
                            id={`cockpit-tab-${p.id}`}
                            aria-selected={pageId === p.id}
                            aria-controls="cockpit-display-panel"
                            tabIndex={pageId === p.id ? 0 : -1}
                            onClick={() => setPageId(p.id)}
                            onKeyDown={(e) => onTabKey(e, i)}
                            className="min-h-11 sm:min-h-9"
                        >
                            {p.tab}
                        </button>
                    ))}
                </div>
            </div>

            <div
                ref={frameRef}
                id="cockpit-display-panel"
                role="tabpanel"
                aria-labelledby={`cockpit-tab-${pageId}`}
                className="ticks mt-6 border border-line-strong bg-ground p-2 sm:p-3"
            >
                <canvas
                    ref={canvasRef}
                    role="img"
                    aria-label={`${page.title}. ${page.body}`}
                    className="aspect-[2/3] w-full bg-ground-2 sm:aspect-[16/10] lg:aspect-[21/8]"
                />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-12 md:gap-8">
                <p className="t-label md:col-span-3 lg:col-span-2" aria-live="polite">
                    {page.title}
                </p>
                <p className="t-body max-w-[62ch] md:col-span-9 lg:col-span-7">{page.body}</p>
            </div>
        </figure>
    );
}
