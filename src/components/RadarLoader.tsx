"use client";

import { useEffect, useState } from "react";

const bootSequence = [
    { text: "AVIYONIK SISTEMI BASLATILIYOR...", delay: 0 },
    { text: "IMA PLATFORM v4.2.1 YUKLENIYOR...", delay: 400 },
    { text: "AESA RADAR KALIBRASYONU.............. OK", delay: 900 },
    { text: "DAS SENSOR FUZYONU.................. OK", delay: 1400 },
    { text: "ELEKTRONIK HARP SUITI............... OK", delay: 1800 },
    { text: "NAVIGASYON SISTEMI.................. OK", delay: 2200 },
    { text: "SILAH SISTEMI KONTROLU.............. OK", delay: 2500 },
    { text: "HUD DISPLAY AKTIF................... OK", delay: 2800 },
    { text: "MOTOR TELEMETRISI BAGLI............. OK", delay: 3100 },
    { text: "SISTEM HAZIR — GOREV BASLATILIYOR", delay: 3500 },
];

export function RadarLoader() {
    const [visibleLines, setVisibleLines] = useState<number>(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = [];

        bootSequence.forEach((item, index) => {
            const timer = setTimeout(() => {
                setVisibleLines(index + 1);
                setProgress(((index + 1) / bootSequence.length) * 100);
            }, item.delay);
            timers.push(timer);
        });

        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cockpit-dark">
            <div className="relative h-40 w-40 mb-8">
                {/* Radar grid circles */}
                {[1, 2, 3].map((ring) => (
                    <div
                        key={ring}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon-blue/20"
                        style={{
                            width: `${ring * 33}%`,
                            height: `${ring * 33}%`,
                        }}
                    />
                ))}

                {/* Crosshair lines */}
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-neon-blue/10" />
                <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-neon-blue/10" />

                {/* Sweep line */}
                <div
                    className="absolute left-1/2 top-1/2 h-1/2 w-px origin-top -translate-x-1/2"
                    style={{
                        background: "linear-gradient(to bottom, rgba(0, 212, 255, 0.8), transparent)",
                        animation: "radar-sweep 2s linear infinite",
                        transformOrigin: "top center",
                    }}
                />

                {/* Center dot */}
                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-blue animate-pulse-glow" />
            </div>

            {/* Boot sequence terminal */}
            <div className="w-full max-w-md px-6">
                <div className="rounded-lg border border-neon-blue/10 bg-stealth-black/80 p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-neon-blue animate-pulse" />
                        <span
                            className="text-[9px] tracking-[0.3em] text-neon-blue/50"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            KAAN MMU // SISTEM BASLATMA
                        </span>
                    </div>

                    <div className="space-y-1 overflow-hidden" style={{ minHeight: "160px" }}>
                        {bootSequence.slice(0, visibleLines).map((line, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2"
                                style={{
                                    animation: "fadeSlideIn 0.3s ease-out forwards",
                                }}
                            >
                                <span
                                    className={`text-[9px] leading-relaxed ${
                                        line.text.includes("OK")
                                            ? "text-hud-green/70"
                                            : line.text.includes("HAZIR")
                                            ? "text-neon-blue"
                                            : "text-titanium-light/50"
                                    }`}
                                    style={{ fontFamily: "var(--font-mono)" }}
                                >
                                    {">"} {line.text}
                                </span>
                            </div>
                        ))}
                        {visibleLines < bootSequence.length && (
                            <span
                                className="inline-block h-3 w-1.5 bg-neon-blue/60 animate-hud-blink"
                                style={{ verticalAlign: "middle" }}
                            />
                        )}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className="h-1 flex-1 rounded-full bg-titanium/20 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-neon-blue/60 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span
                            className="text-[9px] text-neon-blue/50"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
