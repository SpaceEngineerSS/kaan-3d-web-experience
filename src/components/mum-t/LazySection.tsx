"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

let scrollTriggerRefreshTimer: ReturnType<typeof setTimeout> | null = null;

/** Debounced ScrollTrigger.refresh — batches multiple LazySection mounts */
function scheduleScrollRefresh() {
    if (scrollTriggerRefreshTimer) clearTimeout(scrollTriggerRefreshTimer);
    scrollTriggerRefreshTimer = setTimeout(() => {
        try {
            // Dynamic import to avoid circular dependency
            import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
                ScrollTrigger.refresh();
            });
        } catch {
            // gsap not available, skip
        }
    }, 150);
}

interface LazySectionProps {
    children: ReactNode;
    /** Extra margin around viewport to preload (default: 300px) */
    rootMargin?: string;
    /** Minimum height placeholder before mount (default: 200px) */
    minHeight?: string;
    /** CSS class on wrapper */
    className?: string;
}

/**
 * Viewport-gated lazy section.
 * Components inside are only mounted when within `rootMargin` of the viewport.
 * Calls ScrollTrigger.refresh() after mount to fix GSAP pin calculations.
 */
export function LazySection({
    children,
    rootMargin = "300px",
    minHeight = "200px",
    className = "",
}: LazySectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [rootMargin]);

    // When content mounts, schedule a ScrollTrigger refresh
    useEffect(() => {
        if (isVisible) {
            scheduleScrollRefresh();
        }
    }, [isVisible]);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                minHeight: isVisible ? undefined : minHeight,
            }}
        >
            {isVisible ? children : null}
        </div>
    );
}

