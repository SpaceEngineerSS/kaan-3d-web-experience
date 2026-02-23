"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface MousePosition {
    x: number;
    y: number;
}

const ZERO_POSITION: MousePosition = { x: 0, y: 0 };

export function useMouseParallax(sensitivity: number = 1, enabled: boolean = true): MousePosition {
    const [position, setPosition] = useState<MousePosition>(ZERO_POSITION);
    const target = useRef<MousePosition>({ x: 0, y: 0 });
    const rafId = useRef<number>(0);

    const lerp = useCallback((start: number, end: number, factor: number) => {
        return start + (end - start) * factor;
    }, []);

    useEffect(() => {
        if (!enabled) {
            target.current = ZERO_POSITION;
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            target.current = {
                x: ((e.clientX / window.innerWidth) * 2 - 1) * sensitivity,
                y: ((e.clientY / window.innerHeight) * 2 - 1) * sensitivity,
            };
        };

        const animate = () => {
            setPosition((prev) => ({
                x: lerp(prev.x, target.current.x, 0.05),
                y: lerp(prev.y, target.current.y, 0.05),
            }));
            rafId.current = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", handleMouseMove);
        rafId.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(rafId.current);
        };
    }, [sensitivity, lerp, enabled]);

    return enabled ? position : ZERO_POSITION;
}
