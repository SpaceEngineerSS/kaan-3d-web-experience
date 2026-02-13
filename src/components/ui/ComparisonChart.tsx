"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

/* ── Data: normalised 0–100 ── */
const fighters = [
    {
        name: "KAAN",
        color: "#00d4ff",
        nightColor: "#22ff44",
        values: [92, 88, 95, 80, 90], // stealth, speed, avionics, range, maneuverability
    },
    {
        name: "F-22",
        color: "#ff6644",
        nightColor: "#ff6644",
        values: [95, 92, 88, 75, 95],
    },
    {
        name: "F-35",
        color: "#aa66ff",
        nightColor: "#ffaa22",
        values: [90, 78, 97, 85, 72],
    },
];

const metricLabels = {
    tr: ["Gizlilik", "Hız", "Aviyonik", "Menzil", "Manevra"],
    en: ["Stealth", "Speed", "Avionics", "Range", "Maneuver"],
};

export function ComparisonChart() {
    const { locale } = useLanguage();
    const { mode } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const progressRef = useRef(0);
    const hasAnimated = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const labels = metricLabels[locale];

    const draw = useCallback(
        (progress: number) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const dpr = window.devicePixelRatio || 1;
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.scale(dpr, dpr);

            const cx = w / 2;
            const cy = h / 2;
            const maxR = Math.min(cx, cy) - 50;
            const n = 5;
            const angleStep = (Math.PI * 2) / n;
            const startAngle = -Math.PI / 2;

            ctx.clearRect(0, 0, w, h);

            const gridColor = mode === "night" ? "#22ff4420" : "#00d4ff20";
            const textColor = mode === "night" ? "#22ff44cc" : "#c8d6e5";

            /* Grid rings */
            for (let ring = 1; ring <= 5; ring++) {
                const r = (maxR / 5) * ring;
                ctx.beginPath();
                for (let i = 0; i <= n; i++) {
                    const angle = startAngle + i * angleStep;
                    const x = cx + Math.cos(angle) * r;
                    const y = cy + Math.sin(angle) * r;
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            /* Axis lines */
            for (let i = 0; i < n; i++) {
                const angle = startAngle + i * angleStep;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
                ctx.strokeStyle = gridColor;
                ctx.stroke();
            }

            /* Labels */
            ctx.font = "11px monospace";
            ctx.fillStyle = textColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            for (let i = 0; i < n; i++) {
                const angle = startAngle + i * angleStep;
                const lx = cx + Math.cos(angle) * (maxR + 30);
                const ly = cy + Math.sin(angle) * (maxR + 30);
                ctx.fillText(labels[i], lx, ly);
            }

            /* Fighter polygons */
            fighters.forEach((fighter) => {
                const col = mode === "night" ? fighter.nightColor : fighter.color;
                ctx.beginPath();
                for (let i = 0; i <= n; i++) {
                    const idx = i % n;
                    const angle = startAngle + idx * angleStep;
                    const r = (fighter.values[idx] / 100) * maxR * progress;
                    const x = cx + Math.cos(angle) * r;
                    const y = cy + Math.sin(angle) * r;
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fillStyle = col + "18";
                ctx.fill();
                ctx.strokeStyle = col + "cc";
                ctx.lineWidth = 2;
                ctx.stroke();

                /* dots */
                for (let i = 0; i < n; i++) {
                    const angle = startAngle + i * angleStep;
                    const r = (fighter.values[i] / 100) * maxR * progress;
                    const x = cx + Math.cos(angle) * r;
                    const y = cy + Math.sin(angle) * r;
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = col;
                    ctx.fill();
                }
            });
        },
        [mode, labels]
    );

    /* Scroll-triggered animation */
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    gsap.to(progressRef, {
                        current: 1,
                        duration: 1.8,
                        ease: "power3.out",
                        onUpdate: () => draw(progressRef.current),
                    });
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, [draw]);

    /* Re-draw on theme change */
    useEffect(() => {
        draw(progressRef.current);
    }, [mode, draw]);

    return (
        <section
            ref={containerRef}
            id="comparison"
            className="relative z-10 px-6 py-24 md:px-12 lg:px-24"
        >
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-10 text-center">
                    <p
                        className="mb-2 text-[10px] tracking-[0.5em] uppercase"
                        style={{
                            color: mode === "night" ? "#22ff44" : "#00d4ff",
                            fontFamily: "var(--font-mono)",
                        }}
                    >
                        {locale === "tr" ? "KARŞILAŞTIRMALİ ANALİZ" : "COMPARATIVE ANALYSIS"}
                    </p>
                    <h2 className="text-3xl font-bold text-white md:text-5xl">
                        KAAN vs.{" "}
                        <span className="text-gradient">
                            {locale === "tr" ? "Dünya Standartları" : "Global Standards"}
                        </span>
                    </h2>
                </div>

                {/* Chart */}
                <div className="glass-panel rounded-2xl p-6">
                    <canvas
                        ref={canvasRef}
                        className="mx-auto h-[280px] w-full max-w-lg sm:h-[350px] md:h-[420px]"
                    />

                    {/* Legend */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
                        {fighters.map((f) => (
                            <div key={f.name} className="flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ background: mode === "night" ? f.nightColor : f.color }}
                                />
                                <span
                                    className="text-xs font-bold tracking-wider text-slate-300"
                                    style={{ fontFamily: "var(--font-mono)" }}
                                >
                                    {f.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Disclaimer */}
                    <p
                        className="mt-4 text-center text-[9px] tracking-wide text-slate-500"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        {locale === "tr"
                            ? "* Değerler tahmini ve karşılaştırmalı analiz amaçlıdır. Gizli bilgi içermez."
                            : "* Values are estimated for comparative purposes only. No classified data."}
                    </p>
                </div>
            </div>
        </section>
    );
}
