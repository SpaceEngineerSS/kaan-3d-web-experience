"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore, type RefObject } from "react";

/** Time used for the single static frame drawn under reduced motion. */
const STATIC_T = 12;

function subscribeReduced(cb: () => void) {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
}

export function usePrefersReducedMotion(): boolean {
    return useSyncExternalStore(
        subscribeReduced,
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        () => true
    );
}

export type PaintFn = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

interface Options {
    /** Element whose visibility gates the loop (defaults to the canvas). */
    visibilityTarget?: RefObject<Element | null>;
    /** Run the animation; false draws one static frame on resize or redraw. */
    animate: boolean;
    /** Frame cap; lower on phones. */
    fps?: number;
}

/**
 * One requestAnimationFrame loop for a canvas.
 * - runs only while the target is on screen and the tab is visible
 * - sizes the backing store from a ResizeObserver, never per frame
 * - with `animate: false` it paints a single static frame
 * Returns `redraw()` for state changes (e.g. switching page) while paused.
 */
export function useDisplayLoop(canvasRef: RefObject<HTMLCanvasElement | null>, paint: PaintFn, { visibilityTarget, animate, fps = 60 }: Options) {
    const paintRef = useRef(paint);
    const redrawRef = useRef<() => void>(() => {});

    useEffect(() => {
        paintRef.current = paint;
        redrawRef.current();
    }, [paint]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = 0;
        let h = 0;
        let dpr = 1;
        let raf = 0;
        let last = 0;
        let visible = false;
        let alive = true;
        const start = performance.now();
        const minDt = 1000 / fps - 2;

        const draw = (now: number) => {
            if (!w || !h) return;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);
            paintRef.current(ctx, w, h, animate ? (now - start) / 1000 : STATIC_T);
        };

        const tick = (now: number) => {
            raf = 0;
            if (now - last >= minDt) {
                last = now;
                draw(now);
            }
            schedule();
        };

        function schedule() {
            if (animate && visible && !document.hidden && !raf) raf = requestAnimationFrame(tick);
        }

        const stop = () => {
            if (raf) cancelAnimationFrame(raf);
            raf = 0;
        };

        const ro = new ResizeObserver((entries) => {
            const r = entries[0].contentRect;
            w = r.width;
            h = r.height;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.max(1, Math.round(w * dpr));
            canvas.height = Math.max(1, Math.round(h * dpr));
            draw(performance.now());
        });
        ro.observe(canvas);

        const io = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting;
            if (visible) schedule();
            else stop();
        });
        io.observe(visibilityTarget?.current ?? canvas);

        const onVisibility = () => {
            if (document.hidden) stop();
            else schedule();
        };
        document.addEventListener("visibilitychange", onVisibility);

        redrawRef.current = () => draw(performance.now());
        // Repaint once the web font is in, so canvas text does not stay in the fallback face.
        document.fonts?.ready.then(() => {
            if (alive) draw(performance.now());
        });

        return () => {
            alive = false;
            stop();
            ro.disconnect();
            io.disconnect();
            document.removeEventListener("visibilitychange", onVisibility);
            redrawRef.current = () => {};
        };
    }, [canvasRef, visibilityTarget, animate, fps]);

    return useCallback(() => redrawRef.current(), []);
}
