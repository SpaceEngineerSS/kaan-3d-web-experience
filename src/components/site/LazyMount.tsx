"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Mounts heavy client children only when they come near the viewport.
 * Reserves `minHeight` so the page does not jump; the placeholder keeps the
 * section's anchor id reachable through `id`.
 */
export function LazyMount({ children, minHeight = "60vh", rootMargin = "600px 0px", id }: { children: ReactNode; minHeight?: string; rootMargin?: string; id?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (!("IntersectionObserver" in window)) {
            queueMicrotask(() => setShow(true));
            return;
        }
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setShow(true);
                    io.disconnect();
                }
            },
            { rootMargin }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [rootMargin]);

    // Anchor links (#cockpit) should land on real content: mount if the hash targets us.
    useEffect(() => {
        const onHash = () => {
            if (id && window.location.hash === `#${id}`) setShow(true);
        };
        onHash();
        window.addEventListener("hashchange", onHash);
        return () => window.removeEventListener("hashchange", onHash);
    }, [id]);

    return (
        <div ref={ref} id={show ? undefined : id} style={show ? undefined : { minHeight }}>
            {show ? children : null}
        </div>
    );
}
