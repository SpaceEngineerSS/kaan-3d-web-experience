"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const KONAMI_SEQUENCE = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a",
];

export function useKonamiCode() {
    const [activated, setActivated] = useState(false);
    const indexRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const reset = useCallback(() => {
        setActivated(false);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activated) return;

            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => { indexRef.current = 0; }, 3000);

            if (e.key === KONAMI_SEQUENCE[indexRef.current]) {
                indexRef.current++;
                if (indexRef.current === KONAMI_SEQUENCE.length) {
                    setActivated(true);
                    indexRef.current = 0;
                    setTimeout(() => setActivated(false), 4000);
                }
            } else {
                indexRef.current = 0;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activated]);

    return { activated, reset };
}
