"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One place for page-level motion:
 *  - Lenis smooth scrolling (desktop pointer only, off for reduced motion), driven by GSAP's ticker
 *  - [data-reveal] elements fade/mask in once when they enter the viewport
 * Content stays visible if this never runs.
 */
export function MotionRuntime() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const finePointer = window.matchMedia("(pointer: fine)").matches;

        let lenis: Lenis | null = null;
        let tick: ((time: number) => void) | null = null;

        if (!reduce && finePointer) {
            lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: { offset: -72 } });
            lenis.on("scroll", ScrollTrigger.update);
            tick = (time: number) => lenis?.raf(time * 1000);
            gsap.ticker.add(tick);
            gsap.ticker.lagSmoothing(0);
            (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
        }

        // Reveals
        const root = document.documentElement;
        let io: IntersectionObserver | null = null;
        let mo: MutationObserver | null = null;

        if (!reduce && "IntersectionObserver" in window) {
            // Anything already on screen at load stays put; only content below the fold animates.
            document.querySelectorAll("[data-reveal]").forEach((el) => {
                if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
            });
            root.classList.add("js-reveal");
            // A masked element has no visible area, so IntersectionObserver never reports it.
            // Watch a proxy instead: the element's parent for masks, the element itself otherwise.
            const waiting = new Map<Element, Element[]>();
            io = new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        if (!entry.isIntersecting) continue;
                        waiting.get(entry.target)?.forEach((el) => el.classList.add("is-in"));
                        waiting.delete(entry.target);
                        io?.unobserve(entry.target);
                    }
                },
                { rootMargin: "0px 0px -8% 0px", threshold: 0 }
            );

            const watch = (el: Element) => {
                if (el.classList.contains("is-in")) return;
                const proxy = el.getAttribute("data-reveal") === "mask" && el.parentElement ? el.parentElement : el;
                const list = waiting.get(proxy);
                if (list) {
                    if (!list.includes(el)) list.push(el);
                } else {
                    waiting.set(proxy, [el]);
                    io?.observe(proxy);
                }
            };
            const scan = (scope: ParentNode) => {
                scope.querySelectorAll("[data-reveal]:not(.is-in)").forEach(watch);
            };
            scan(document);

            mo = new MutationObserver((records) => {
                for (const r of records) {
                    r.addedNodes.forEach((n) => {
                        if (n instanceof HTMLElement) {
                            if (n.hasAttribute("data-reveal")) watch(n);
                            scan(n);
                        }
                    });
                }
            });
            mo.observe(document.body, { childList: true, subtree: true });
        }

        return () => {
            io?.disconnect();
            mo?.disconnect();
            root.classList.remove("js-reveal");
            if (tick) gsap.ticker.remove(tick);
            lenis?.destroy();
            delete (window as unknown as { __lenis?: Lenis }).__lenis;
        };
    }, []);

    return null;
}
