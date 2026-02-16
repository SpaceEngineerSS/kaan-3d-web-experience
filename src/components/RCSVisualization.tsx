"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/*
 * RCS values below are NOT real data. They are generic illustrative
 * values representing a typical stealth-aircraft signature pattern
 * (low front/rear, higher sides). No classified information is used.
 */
const RCS_DATA = [
    { angle: 0, label: "0° (Ön)", labelEN: "0° (Front)", level: "minimal" },
    { angle: 30, label: "30°", labelEN: "30°", level: "minimal" },
    { angle: 60, label: "60°", labelEN: "60°", level: "low" },
    { angle: 90, label: "90° (Yan)", labelEN: "90° (Side)", level: "medium" },
    { angle: 120, label: "120°", labelEN: "120°", level: "low" },
    { angle: 150, label: "150°", labelEN: "150°", level: "minimal" },
    { angle: 180, label: "180° (Arka)", labelEN: "180° (Rear)", level: "medium" },
    { angle: 210, label: "210°", labelEN: "210°", level: "minimal" },
    { angle: 240, label: "240°", labelEN: "240°", level: "low" },
    { angle: 270, label: "270° (Yan)", labelEN: "270° (Side)", level: "medium" },
    { angle: 300, label: "300°", labelEN: "300°", level: "low" },
    { angle: 330, label: "330°", labelEN: "330°", level: "minimal" },
];

const LEVEL_RADIUS: Record<string, number> = { minimal: 0.2, low: 0.5, medium: 0.8 };

const levelColors: Record<string, string> = {
    minimal: "#00ff88",
    low: "#00d4ff",
    medium: "#ffaa22",
};

export function RCSVisualization() {
    const { locale } = useLanguage();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedAngle, setSelectedAngle] = useState<number | null>(null);
    const [animated, setAnimated] = useState(false);
    const progressRef = useRef(0);

    const draw = useCallback((progress: number) => {
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
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;
        const maxR = Math.min(cx, cy) - 50;

        /* Grid rings */
        for (let ring = 1; ring <= 4; ring++) {
            const r = (maxR / 4) * ring;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(0, 212, 255, 0.08)";
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        /* Axis lines */
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
            ctx.strokeStyle = "rgba(0, 212, 255, 0.05)";
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        /* RCS polygon */
        ctx.beginPath();
        RCS_DATA.forEach((d, i) => {
            const angle = (d.angle / 360) * Math.PI * 2 - Math.PI / 2;
            const r = LEVEL_RADIUS[d.level] * maxR * progress;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = "rgba(0, 212, 255, 0.08)";
        ctx.fill();
        ctx.strokeStyle = "rgba(0, 212, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();

        /* Data points with heat colors */
        RCS_DATA.forEach((d, i) => {
            const angle = (d.angle / 360) * Math.PI * 2 - Math.PI / 2;
            const r = LEVEL_RADIUS[d.level] * maxR * progress;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            const color = levelColors[d.level];
            const isSelected = selectedAngle === i;
            const dotR = isSelected ? 6 : 4;

            ctx.beginPath();
            ctx.arc(x, y, dotR, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            if (isSelected) {
                ctx.beginPath();
                ctx.arc(x, y, 10, 0, Math.PI * 2);
                ctx.strokeStyle = color + "60";
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            /* Labels */
            const lx = cx + Math.cos(angle) * (maxR + 25);
            const ly = cy + Math.sin(angle) * (maxR + 25);
            ctx.font = "9px monospace";
            ctx.fillStyle = "rgba(200,210,220,0.5)";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(locale === "tr" ? d.label : d.labelEN, lx, ly);
        });

        /* Center aircraft icon */
        ctx.font = "11px monospace";
        ctx.fillStyle = "rgba(0, 212, 255, 0.4)";
        ctx.textAlign = "center";
        ctx.fillText("▲", cx, cy - 2);
        ctx.font = "7px monospace";
        ctx.fillText("KAAN", cx, cy + 10);

    }, [selectedAngle, locale]);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !animated) {
                    setAnimated(true);
                    gsap.to(progressRef, {
                        current: 1, duration: 1.5, ease: "power3.out",
                        onUpdate: () => draw(progressRef.current),
                    });
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [animated, draw]);

    useEffect(() => { draw(progressRef.current); }, [selectedAngle, draw]);

    const selected = selectedAngle !== null ? RCS_DATA[selectedAngle] : null;

    return (
        <section id="rcs" className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
            <div ref={containerRef} className="mx-auto max-w-5xl">
                <div className="mb-12">
                    <div className="mb-3 flex items-center gap-3">
                        <Shield className="h-4 w-4 text-neon-blue" />
                        <div className="h-px w-10 bg-neon-blue/40" />
                        <span className="text-[10px] tracking-[0.4em] text-neon-blue/70 uppercase animate-hud-blink" style={{ fontFamily: "var(--font-mono)" }}>
                            {locale === "tr" ? "RADAR KESİT ALANI" : "RADAR CROSS SECTION"}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                        RCS <span className="text-gradient">{locale === "tr" ? "ANALİZİ" : "ANALYSIS"}</span>
                    </h2>
                </div>

                <div className="glass-panel rounded-2xl p-6 md:p-8">
                    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
                        <canvas
                            ref={canvasRef}
                            className="mx-auto h-[280px] w-full max-w-lg cursor-crosshair sm:h-[350px] md:h-[400px]"
                            onClick={(e) => {
                                const rect = canvasRef.current?.getBoundingClientRect();
                                if (!rect) return;
                                const cx = rect.width / 2;
                                const cy = rect.height / 2;
                                const dx = e.clientX - rect.left - cx;
                                const dy = e.clientY - rect.top - cy;
                                let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
                                if (angle < 0) angle += 360;
                                const closest = RCS_DATA.reduce((prev, curr, i) => Math.abs(curr.angle - angle) < Math.abs(RCS_DATA[prev].angle - angle) ? i : prev, 0);
                                setSelectedAngle(selectedAngle === closest ? null : closest);
                            }}
                        />

                        {/* Legend + detail panel */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                {(["minimal", "low", "medium"] as const).map((level) => (
                                    <div key={level} className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: levelColors[level] }} />
                                        <span className="text-[9px] tracking-[0.15em] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
                                            {level === "minimal" ? (locale === "tr" ? "Minimum RKA" : "Minimal RCS") :
                                             level === "low" ? (locale === "tr" ? "Düşük RKA" : "Low RCS") :
                                             (locale === "tr" ? "Orta RKA" : "Medium RCS")}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {selected && (
                                <div className="rounded-lg border border-neon-blue/20 bg-neon-blue/5 p-4">
                                    <div className="text-sm font-bold text-white">{locale === "tr" ? selected.label : selected.labelEN}</div>
                                    <div className="mt-1 text-lg font-bold" style={{ color: levelColors[selected.level], fontFamily: "var(--font-mono)" }}>
                                        {selected.level === "minimal" ? (locale === "tr" ? "Çok Düşük" : "Very Low") :
                                         selected.level === "low" ? (locale === "tr" ? "Düşük" : "Low") :
                                         (locale === "tr" ? "Orta" : "Medium")}
                                    </div>
                                    <div className="mt-1 text-[8px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>
                                        {locale === "tr" ? "Göreli seviye — gerçek RKA değerleri gizlidir" : "Relative level — actual RCS values are classified"}
                                    </div>
                                </div>
                            )}

                            <p className="text-[8px] tracking-[0.1em] text-slate-600" style={{ fontFamily: "var(--font-mono)" }}>
                                {locale === "tr"
                                    ? "* Tüm RKA değerleri karşılaştırmalı analiz amaçlı tahminidir."
                                    : "* All RCS values are estimated for comparative purposes."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
