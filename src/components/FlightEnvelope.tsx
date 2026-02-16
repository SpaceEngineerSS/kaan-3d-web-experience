"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { gsap } from "gsap";
import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const ENVELOPE_POINTS = [
    { mach: 0, alt: 0 }, { mach: 0.3, alt: 0 }, { mach: 0.5, alt: 15000 },
    { mach: 0.7, alt: 30000 }, { mach: 0.85, alt: 40000 }, { mach: 1.0, alt: 45000 },
    { mach: 1.2, alt: 50000 }, { mach: 1.5, alt: 53000 }, { mach: 1.8, alt: 55000 },
    { mach: 1.8, alt: 45000 }, { mach: 1.7, alt: 30000 }, { mach: 1.5, alt: 15000 },
    { mach: 1.2, alt: 5000 }, { mach: 0.95, alt: 0 },
];

const SUPERCRUISE_ZONE = [
    { mach: 1.0, alt: 30000 }, { mach: 1.2, alt: 40000 },
    { mach: 1.6, alt: 50000 }, { mach: 1.8, alt: 55000 },
    { mach: 1.8, alt: 45000 }, { mach: 1.5, alt: 30000 },
];

const KEY_POINTS = [
    { mach: 1.8, alt: 55000, labelTR: "Servis Tavanı\nMach 1.8 / 55,000 ft", labelEN: "Service Ceiling\nMach 1.8 / 55,000 ft" },
    { mach: 1.0, alt: 36000, labelTR: "Süperseyir\nBaşlangıcı", labelEN: "Supercruise\nOnset" },
    { mach: 0.85, alt: 35000, labelTR: "Devriye\nİrtifası", labelEN: "Patrol\nAltitude" },
];

export function FlightEnvelope() {
    const { locale } = useLanguage();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);
    const [animated, setAnimated] = useState(false);

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

        const pad = { left: 55, right: 20, top: 20, bottom: 40 };
        const pw = w - pad.left - pad.right;
        const ph = h - pad.top - pad.bottom;

        const toX = (mach: number) => pad.left + (mach / 2.0) * pw;
        const toY = (alt: number) => pad.top + ph - (alt / 60000) * ph;

        /* Grid */
        ctx.strokeStyle = "rgba(0, 212, 255, 0.06)";
        ctx.lineWidth = 0.5;
        for (let m = 0; m <= 2.0; m += 0.5) { const x = toX(m); ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, h - pad.bottom); ctx.stroke(); }
        for (let a = 0; a <= 60000; a += 10000) { const y = toY(a); ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke(); }

        /* Axis labels */
        ctx.font = "9px monospace";
        ctx.fillStyle = "rgba(200,210,220,0.4)";
        ctx.textAlign = "center";
        for (let m = 0; m <= 2.0; m += 0.5) ctx.fillText(`M${m.toFixed(1)}`, toX(m), h - pad.bottom + 18);
        ctx.textAlign = "right";
        for (let a = 0; a <= 60000; a += 10000) ctx.fillText(`${(a / 1000).toFixed(0)}k`, pad.left - 8, toY(a) + 3);

        /* Supercruise zone */
        ctx.beginPath();
        SUPERCRUISE_ZONE.forEach((p, i) => { const x = toX(p.mach); const y = toY(p.alt); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.closePath();
        ctx.fillStyle = `rgba(0, 255, 136, ${0.06 * progress})`;
        ctx.fill();

        /* Flight envelope polygon */
        ctx.beginPath();
        const totalPoints = Math.floor(ENVELOPE_POINTS.length * progress);
        ENVELOPE_POINTS.slice(0, totalPoints + 1).forEach((p, i) => {
            const x = toX(p.mach);
            const y = toY(p.alt);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        if (progress >= 1) ctx.closePath();
        ctx.fillStyle = "rgba(0, 212, 255, 0.05)";
        if (progress >= 1) ctx.fill();
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.7 * progress})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        /* Key points */
        if (progress > 0.8) {
            KEY_POINTS.forEach((kp) => {
                const x = toX(kp.mach);
                const y = toY(kp.alt);
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = "#00d4ff";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x, y, 8, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(0, 212, 255, 0.3)";
                ctx.lineWidth = 1;
                ctx.stroke();

                const label = locale === "tr" ? kp.labelTR : kp.labelEN;
                ctx.font = "8px monospace";
                ctx.fillStyle = "rgba(200,210,220,0.6)";
                ctx.textAlign = "left";
                label.split("\n").forEach((line, li) => ctx.fillText(line, x + 12, y + li * 11 - 3));
            });
        }

        /* Axis titles */
        ctx.font = "10px monospace";
        ctx.fillStyle = "rgba(0, 212, 255, 0.4)";
        ctx.textAlign = "center";
        ctx.fillText(locale === "tr" ? "MACH SAYISI" : "MACH NUMBER", w / 2, h - 4);
        ctx.save();
        ctx.translate(12, h / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(locale === "tr" ? "İRTİFA (ft)" : "ALTITUDE (ft)", 0, 0);
        ctx.restore();
    }, [locale]);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !animated) {
                    setAnimated(true);
                    gsap.to(progressRef, { current: 1, duration: 2, ease: "power3.out", onUpdate: () => draw(progressRef.current) });
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [animated, draw]);

    return (
        <section id="envelope" className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
            <div ref={containerRef} className="mx-auto max-w-5xl">
                <div className="mb-12">
                    <div className="mb-3 flex items-center gap-3">
                        <TrendingUp className="h-4 w-4 text-neon-blue" />
                        <div className="h-px w-10 bg-neon-blue/40" />
                        <span className="text-[10px] tracking-[0.4em] text-neon-blue/70 uppercase animate-hud-blink" style={{ fontFamily: "var(--font-mono)" }}>
                            {locale === "tr" ? "UÇUŞ PERFORMANSI" : "FLIGHT PERFORMANCE"}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                        {locale === "tr" ? "UÇUŞ" : "FLIGHT"}{" "}
                        <span className="text-gradient">{locale === "tr" ? "ZARFI" : "ENVELOPE"}</span>
                    </h2>
                </div>

                <div className="glass-panel rounded-2xl p-4 md:p-6">
                    <canvas ref={canvasRef} className="h-[280px] w-full sm:h-[350px] md:h-[420px]" />
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-neon-blue/50" />
                            <span className="text-[9px] tracking-[0.15em] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>{locale === "tr" ? "Uçuş Zarfı" : "Flight Envelope"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-hud-green/30" />
                            <span className="text-[9px] tracking-[0.15em] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>{locale === "tr" ? "Süperseyir Bölgesi" : "Supercruise Zone"}</span>
                        </div>
                    </div>
                    <p className="mt-2 text-center text-[8px] tracking-[0.15em] text-slate-600" style={{ fontFamily: "var(--font-mono)" }}>
                        {locale === "tr" ? "* Değerler tahmini ve karşılaştırmalı analiz amaçlıdır." : "* Values are estimated for comparative purposes."}
                    </p>
                </div>
            </div>
        </section>
    );
}
