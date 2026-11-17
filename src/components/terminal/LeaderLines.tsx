"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { leaderLabels } from "@/content/terminal";
import { terminal } from "@/lib/terminal/state";

const SLOTS = 6;
const RUN = 22; // diagonal run of the elbow, px
const SHELF = 56; // horizontal shelf before the label, px

/**
 * Full-stage SVG overlay: 1px elbow leader lines from the scene's projected anchors to short mono labels.
 * One rAF writes SVG attributes and textContent directly; React only renders the fixed pool of slots.
 */
export function LeaderLines() {
    const { locale } = useLanguage();
    const svg = useRef<SVGSVGElement>(null);
    const specsRef = useRef(leaderLabels[locale]);

    useEffect(() => {
        specsRef.current = leaderLabels[locale];
    }, [locale]);

    useEffect(() => {
        const root = svg.current;
        if (!root) return;
        const groups = Array.from(root.querySelectorAll<SVGGElement>("g[data-slot]"));
        const lines = groups.map((g) => g.querySelector("polyline") as SVGPolylineElement);
        const marks = groups.map((g) => g.querySelector("path") as SVGPathElement);
        const texts = groups.map((g) => g.querySelector("text") as SVGTextElement);
        const alpha = new Float32Array(SLOTS);
        const shownLabel: string[] = new Array(SLOTS).fill("");
        let raf = 0;

        const tick = () => {
            raf = requestAnimationFrame(tick);
            if (document.hidden) return;
            const specs = specsRef.current[terminal.section] ?? [];
            const rect = root.getBoundingClientRect();
            // Text the labels must never cross: the active section's marked text column.
            const sec = document.getElementById(`s0${terminal.section + 1}`);
            const ko = sec?.querySelector("[data-keepout]")?.getBoundingClientRect();
            const hit = (x0: number, y0: number, x1: number, y1: number) =>
                Boolean(ko && ko.width > 0 && x1 > ko.left - 8 && x0 < ko.right + 8 && y1 > ko.top - 8 && y0 < ko.bottom + 8);
            const w = rect.width;
            const h = rect.height;
            for (let i = 0; i < SLOTS; i++) {
                const spec = specs[i];
                const a = spec ? terminal.anchors[spec.anchor] : undefined;
                const on = Boolean(a && a.visible && terminal.telemetry);
                alpha[i] += ((on ? 1 : 0) - alpha[i]) * 0.18;
                const g = groups[i];
                if (alpha[i] < 0.02 || !spec || !a) {
                    if (g.style.display !== "none") g.style.display = "none";
                    continue;
                }
                if (g.style.display === "none") g.style.display = "";
                g.style.opacity = alpha[i].toFixed(3);

                const x = a.x - rect.left;
                const y = a.y - rect.top;
                const side = spec.side ?? (x > w / 2 ? 1 : -1);
                // Keep the label on screen: flip the side or clamp the elbow height near the edges.
                let sd = x + side * (RUN + SHELF + 140) > w || x + side * (RUN + SHELF + 140) < 0 ? -side : side;
                const ey = Math.min(h - 24, Math.max(72, y + spec.dy));
                const labelW = spec.label.length * 7.4 + 12;
                const box = (dir: number) => {
                    const lx0 = x + dir * (RUN + SHELF);
                    const a0 = Math.min(x, lx0 + dir * labelW);
                    const a1 = Math.max(x, lx0 + dir * labelW);
                    return hit(a0 + rect.left, Math.min(y, ey) - 8 + rect.top, a1 + rect.left, Math.max(y, ey) + 8 + rect.top);
                };
                // Never over the text column: try the other side, otherwise hide this label.
                if (box(sd)) sd = -sd;
                if (box(sd) || hit(x - 6 + rect.left, y - 6 + rect.top, x + 6 + rect.left, y + 6 + rect.top)) {
                    g.style.display = "none";
                    continue;
                }
                const s = sd;
                const ex = x + s * RUN;
                const lx = ex + s * SHELF;
                lines[i].setAttribute("points", `${x},${y} ${ex},${ey} ${lx},${ey}`);
                marks[i].setAttribute("d", `M${x - 5} ${y}H${x - 1.5}M${x + 1.5} ${y}H${x + 5}M${x} ${y - 5}V${y - 1.5}M${x} ${y + 1.5}V${y + 5}`);
                texts[i].setAttribute("x", String(lx + s * 6));
                texts[i].setAttribute("y", String(ey + 3.5));
                texts[i].setAttribute("text-anchor", s > 0 ? "start" : "end");
                if (shownLabel[i] !== spec.label) {
                    texts[i].textContent = spec.label;
                    shownLabel[i] = spec.label;
                }
            }
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <svg ref={svg} aria-hidden data-overlay className="pointer-events-none absolute inset-0 z-10 h-full w-full" fill="none">
            {Array.from({ length: SLOTS }).map((_, i) => (
                <g key={i} data-slot={i} style={{ display: "none" }}>
                    <polyline stroke="rgba(236,239,244,0.55)" strokeWidth={1} shapeRendering="crispEdges" />
                    <path stroke="var(--color-fg)" strokeWidth={1} shapeRendering="crispEdges" />
                    <text className="t-tele" fill="var(--color-fg-2)" />
                </g>
            ))}
        </svg>
    );
}
