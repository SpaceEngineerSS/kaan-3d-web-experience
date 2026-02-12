"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

/**
 * Crosshair reticle that only appears when hovering over the Radar MFD panel.
 */
export function HUDOverlay() {
    const { mode } = useTheme();
    const reticleRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const targetRef = useRef({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);

    const accent = mode === "night" ? "#22ff44" : "#00d4ff";

    useEffect(() => {
        let raf: number;

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            const target = document.elementFromPoint(e.clientX, e.clientY);
            const isOverRadar = target?.closest("#radar-mfd") !== null;
            setVisible(isOverRadar);
        };

        const animate = () => {
            targetRef.current.x += (mousePos.current.x - targetRef.current.x) * 0.12;
            targetRef.current.y += (mousePos.current.y - targetRef.current.y) * 0.12;

            if (reticleRef.current) {
                reticleRef.current.style.transform = `translate(${targetRef.current.x}px, ${targetRef.current.y}px) translate(-50%, -50%)`;
            }
            raf = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", handleMouseMove);
        raf = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-[60] overflow-hidden transition-opacity duration-200"
            style={{ opacity: visible ? 1 : 0 }}
        >
            <div ref={reticleRef} className="absolute left-0 top-0 will-change-transform">
                <svg width="40" height="40" viewBox="-20 -20 40 40" fill="none">
                    <circle cx="0" cy="0" r="14" stroke={accent} strokeWidth="0.8" strokeDasharray="6 3" opacity="0.5" />
                    <line x1="-18" y1="0" x2="-6" y2="0" stroke={accent} strokeWidth="0.8" opacity="0.6" />
                    <line x1="6" y1="0" x2="18" y2="0" stroke={accent} strokeWidth="0.8" opacity="0.6" />
                    <line x1="0" y1="-18" x2="0" y2="-6" stroke={accent} strokeWidth="0.8" opacity="0.6" />
                    <line x1="0" y1="6" x2="0" y2="18" stroke={accent} strokeWidth="0.8" opacity="0.6" />
                    <circle cx="0" cy="0" r="1.5" fill={accent} opacity="0.8" />
                </svg>
            </div>
        </div>
    );
}
