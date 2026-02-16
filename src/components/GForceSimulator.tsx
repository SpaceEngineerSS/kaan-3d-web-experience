"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { Gauge } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function GForceSimulator() {
    const { locale } = useLanguage();
    const [gForce, setGForce] = useState(1);
    const [simulating, setSimulating] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const gaugeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const simulateG = useCallback((targetG: number) => {
        if (simulating) return;
        setSimulating(true);

        gsap.to({ value: 1 }, {
            value: targetG,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: function () { setGForce(parseFloat(this.targets()[0].value.toFixed(1))); },
            onComplete: () => {
                gsap.to({ value: targetG }, {
                    value: 1, duration: 2, ease: "power2.out", delay: 1,
                    onUpdate: function () { setGForce(parseFloat(this.targets()[0].value.toFixed(1))); },
                    onComplete: () => setSimulating(false),
                });
            },
        });
    }, [simulating]);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { gsap.fromTo(entry.target, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }); observer.unobserve(entry.target); } }); },
            { threshold: 0.2 }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const tunnelIntensity = Math.max(0, (gForce - 3) / 6);
    const redShift = Math.max(0, (gForce - 5) / 4);
    const shakeIntensity = Math.max(0, (gForce - 4) / 5) * 3;

    const presets = [
        { g: 3, labelTR: "3G Dönüş", labelEN: "3G Turn" },
        { g: 6, labelTR: "6G Manevra", labelEN: "6G Maneuver" },
        { g: 9, labelTR: "9G Limit", labelEN: "9G Limit" },
    ];

    return (
        <section id="gforce" className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
            <div ref={containerRef} className="mx-auto max-w-4xl opacity-0">
                <div className="mb-12">
                    <div className="mb-3 flex items-center gap-3">
                        <Gauge className="h-4 w-4 text-neon-blue" />
                        <div className="h-px w-10 bg-neon-blue/40" />
                        <span className="text-[10px] tracking-[0.4em] text-neon-blue/70 uppercase animate-hud-blink" style={{ fontFamily: "var(--font-mono)" }}>
                            {locale === "tr" ? "G-KUVVETİ SİMÜLASYONU" : "G-FORCE SIMULATION"}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                        {locale === "tr" ? "G-KUVVET" : "G-FORCE"}{" "}
                        <span className="text-gradient">{locale === "tr" ? "DENEYİMİ" : "EXPERIENCE"}</span>
                    </h2>
                </div>

                <div className="glass-panel relative overflow-hidden rounded-2xl">
                    {/* Simulation viewport */}
                    <div
                        ref={overlayRef}
                        className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-b from-cockpit-dark to-stealth-black"
                        style={{ transform: shakeIntensity > 0 ? `translate(${(Math.random() - 0.5) * shakeIntensity}px, ${(Math.random() - 0.5) * shakeIntensity}px)` : undefined }}
                    >
                        {/* Tunnel vision vignette */}
                        <div
                            className="pointer-events-none absolute inset-0 transition-all duration-300"
                            style={{
                                background: `radial-gradient(ellipse at center, transparent ${65 - tunnelIntensity * 45}%, rgba(0,0,0,${tunnelIntensity * 0.95}) 100%)`,
                            }}
                        />

                        {/* Red-out at extreme G */}
                        <div
                            className="pointer-events-none absolute inset-0 transition-all duration-300"
                            style={{ background: `rgba(180, 0, 0, ${redShift * 0.3})` }}
                        />

                        {/* HUD elements */}
                        <div className="relative z-10 text-center">
                            <div ref={gaugeRef} className="mb-2 text-8xl font-bold text-white md:text-9xl" style={{ fontFamily: "var(--font-mono)", textShadow: `0 0 40px rgba(${gForce > 6 ? "255,50,50" : "0,212,255"}, 0.5)` }}>
                                {gForce.toFixed(1)}
                            </div>
                            <div className="text-xl tracking-[0.5em] text-neon-blue/80" style={{ fontFamily: "var(--font-mono)" }}>G</div>

                            {/* Status bar */}
                            <div className="mx-auto mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-titanium/20">
                                <div
                                    className="h-full rounded-full transition-all duration-200"
                                    style={{
                                        width: `${(gForce / 9) * 100}%`,
                                        background: gForce > 7 ? "#ff3333" : gForce > 4 ? "#ffaa22" : "#00d4ff",
                                    }}
                                />
                            </div>

                            <div className="mt-2 text-[9px] tracking-[0.2em] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>
                                {gForce >= 9 ? (locale === "tr" ? "⚠ YAPISAL LİMİT" : "⚠ STRUCTURAL LIMIT") :
                                 gForce >= 7 ? (locale === "tr" ? "G-LOC RİSKİ" : "G-LOC RISK") :
                                 gForce >= 4 ? (locale === "tr" ? "YÜKSEK G" : "HIGH G") :
                                 (locale === "tr" ? "NORMAL UÇUŞ" : "NORMAL FLIGHT")}
                            </div>
                        </div>

                        {/* Scan line */}
                        <div className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent animate-scan-slow" />
                    </div>

                    {/* Controls */}
                    <div className="border-t border-neon-blue/10 p-5">
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {presets.map((p) => (
                                <button
                                    key={p.g}
                                    onClick={() => simulateG(p.g)}
                                    disabled={simulating}
                                    className={`rounded-lg border px-5 py-2.5 text-xs tracking-[0.2em] transition-all duration-300 ${
                                        simulating
                                            ? "cursor-not-allowed border-titanium/10 bg-titanium/5 text-slate-600"
                                            : "border-neon-blue/30 bg-neon-blue/5 text-neon-blue hover:bg-neon-blue/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.1)]"
                                    }`}
                                    style={{ fontFamily: "var(--font-mono)" }}
                                >
                                    {locale === "tr" ? p.labelTR : p.labelEN}
                                </button>
                            ))}
                        </div>
                        <p className="mt-3 text-center text-[8px] tracking-[0.15em] text-slate-600" style={{ fontFamily: "var(--font-mono)" }}>
                            {locale === "tr"
                                ? "KAAN 9G manevra yüküne dayanıklı yapısal bütünlüğe sahiptir"
                                : "KAAN maintains structural integrity under 9G maneuvering loads"}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
