"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

interface GlitchTextProps {
    children: ReactNode;
    className?: string;
}

export function GlitchText({ children, className = "" }: GlitchTextProps) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!isHovered || !containerRef.current) return;

        const el = containerRef.current;
        const originalText = el.textContent || "";
        const glitchChars = "!@#$%^&*()_-+=<>?/\\|{}[]~`";
        let iteration = 0;
        let intervalId: NodeJS.Timeout;

        intervalId = setInterval(() => {
            el.textContent = originalText
                .split("")
                .map((char, index) => {
                    if (char === " ") return " ";
                    if (index < iteration) return originalText[index];
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join("");

            if (iteration >= originalText.length) {
                clearInterval(intervalId);
            }

            iteration += 1 / 2;
        }, 40);

        return () => clearInterval(intervalId);
    }, [isHovered]);

    return (
        <span
            ref={containerRef}
            className={`inline-block cursor-pointer ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </span>
    );
}
