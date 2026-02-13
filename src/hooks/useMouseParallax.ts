"use client";

import { useEffect, useRef, useCallback } from "react";

interface MousePosition {
    x: number;
    y: number;
}

export function useMouseParallax(sensitivity: number = 1, enabled: boolean = true): MousePosition {
    const position = useRef<MousePosition>({ x: 0, y: 0 });
    const target = useRef<MousePosition>({ x: 0, y: 0 });
    const rafId = useRef<number>(0);

    const lerp = useCallback((start: number, end: number, factor: number) => {
        return start + (end - start) * factor;
    }, []);

    useEffect(() => {
        if (!enabled) {
            position.current = { x: 0, y: 0 };
            target.current = { x: 0, y: 0 };
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            target.current = {
                x: ((e.clientX / window.innerWidth) * 2 - 1) * sensitivity,
                y: ((e.clientY / window.innerHeight) * 2 - 1) * sensitivity,
            };
        };

        const animate = () => {
            position.current.x = lerp(position.current.x, target.current.x, 0.05);
            position.current.y = lerp(position.current.y, target.current.y, 0.05);
            rafId.current = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", handleMouseMove);
        rafId.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(rafId.current);
        };
    }, [sensitivity, lerp, enabled]);

    return position.current;
}
