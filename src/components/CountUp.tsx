"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface CountUpProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
}

export function CountUp({
    end,
    duration = 2000,
    suffix = "",
    prefix = "",
    decimals = 0,
}: CountUpProps) {
    const [value, setValue] = useState(0);
    const elementRef = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    const animate = useCallback(() => {
        const startTime = performance.now();

        const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

        const tick = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);

            setValue(easedProgress * end);

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    }, [end, duration]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    animate();
                }
            },
            { threshold: 0.3 }
        );

        const el = elementRef.current;
        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
        };
    }, [animate]);

    const formattedValue = decimals > 0
        ? value.toFixed(decimals)
        : Math.round(value).toLocaleString();

    return (
        <span
            ref={elementRef}
            className="tabular-nums"
            style={{ fontFamily: "var(--font-mono)" }}
        >
            {prefix}
            {formattedValue}
            {suffix}
        </span>
    );
}
