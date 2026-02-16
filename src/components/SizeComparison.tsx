"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Ruler } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AircraftData {
    id: string;
    name: string;
    country: string;
    length: number;
    wingspan: number;
    height: number;
    mtow: number;
    color: string;
}

const aircraft: AircraftData[] = [
    { id: "kaan", name: "KAAN", country: "TR", length: 21, wingspan: 14, height: 6, mtow: 27000, color: "#00d4ff" },
    { id: "f16", name: "F-16C", country: "US", length: 15.06, wingspan: 9.96, height: 4.88, mtow: 19200, color: "#888899" },
    { id: "f35", name: "F-35A", country: "US", length: 15.7, wingspan: 10.7, height: 4.33, mtow: 31800, color: "#aa66ff" },
    { id: "su57", name: "Su-57", country: "RU", length: 20.1, wingspan: 14.1, height: 4.74, mtow: 35000, color: "#ff6644" },
    { id: "ef2000", name: "Eurofighter", country: "EU", length: 15.96, wingspan: 10.95, height: 5.28, mtow: 23500, color: "#ffaa22" },
];

export function SizeComparison() {
    const { locale } = useLanguage();
    const [selected, setSelected] = useState<string>("f35");
    const containerRef = useRef<HTMLDivElement>(null);
    const kaan = aircraft[0];
    const compare = aircraft.find((a) => a.id === selected) || aircraft[1];

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(entry.target, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const maxLen = Math.max(kaan.length, compare.length);

    const Bar = ({ value, max, color }: { value: number; max: number; color: string }) => (
        <div className="h-2 w-full rounded-full bg-titanium/20 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
        </div>
    );

    const specs = [
        { labelTR: "Uzunluk", labelEN: "Length", unit: "m", kaanVal: kaan.length, compVal: compare.length, max: 22 },
        { labelTR: "Kanat Açıklığı", labelEN: "Wingspan", unit: "m", kaanVal: kaan.wingspan, compVal: compare.wingspan, max: 16 },
        { labelTR: "Yükseklik", labelEN: "Height", unit: "m", kaanVal: kaan.height, compVal: compare.height, max: 7 },
        { labelTR: "MTOW", labelEN: "MTOW", unit: "kg", kaanVal: kaan.mtow, compVal: compare.mtow, max: 36000 },
    ];

    return (
        <section id="size-compare" className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
            <div ref={containerRef} className="mx-auto max-w-5xl opacity-0">
                <div className="mb-12">
                    <div className="mb-3 flex items-center gap-3">
                        <Ruler className="h-4 w-4 text-neon-blue" />
                        <div className="h-px w-10 bg-neon-blue/40" />
                        <span className="text-[10px] tracking-[0.4em] text-neon-blue/70 uppercase animate-hud-blink" style={{ fontFamily: "var(--font-mono)" }}>
                            {locale === "tr" ? "BOYUT KARŞILAŞTIRMA" : "SIZE COMPARISON"}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                        KAAN vs. <span className="text-gradient">{locale === "tr" ? "Rakipler" : "Rivals"}</span>
                    </h2>
                </div>

                {/* Aircraft selector */}
                <div className="mb-8 flex flex-wrap gap-2">
                    {aircraft.slice(1).map((a) => (
                        <button
                            key={a.id}
                            onClick={() => setSelected(a.id)}
                            className={`rounded-lg border px-4 py-2 text-xs tracking-[0.15em] transition-all duration-300 ${selected === a.id
                                ? "border-neon-blue/40 bg-neon-blue/10 text-neon-blue"
                                : "border-titanium/20 bg-titanium/5 text-slate-400 hover:border-titanium/40"
                            }`}
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {a.name} <span className="text-[8px] opacity-50">({a.country})</span>
                        </button>
                    ))}
                </div>

                <div className="glass-panel rounded-2xl p-6 md:p-8">
                    {/* Visual silhouette comparison */}
                    <div className="mb-8 flex items-end justify-center gap-8 md:gap-16">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-end justify-center" style={{ height: "80px" }}>
                                <div className="rounded bg-neon-blue/20 transition-all duration-700" style={{ width: `${(kaan.length / maxLen) * 140}px`, height: `${(kaan.height / 7) * 50}px`, borderLeft: `3px solid ${kaan.color}` }} />
                            </div>
                            <span className="text-sm font-bold" style={{ color: kaan.color }}>KAAN</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-end justify-center" style={{ height: "80px" }}>
                                <div className="rounded bg-titanium/20 transition-all duration-700" style={{ width: `${(compare.length / maxLen) * 140}px`, height: `${(compare.height / 7) * 50}px`, borderLeft: `3px solid ${compare.color}` }} />
                            </div>
                            <span className="text-sm font-bold" style={{ color: compare.color }}>{compare.name}</span>
                        </div>
                    </div>

                    {/* Spec bars */}
                    <div className="space-y-5">
                        {specs.map((s, i) => (
                            <div key={i}>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-[10px] tracking-[0.2em] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
                                        {locale === "tr" ? s.labelTR : s.labelEN}
                                    </span>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-3">
                                        <span className="w-16 text-right text-xs font-bold" style={{ color: kaan.color, fontFamily: "var(--font-mono)" }}>
                                            {s.kaanVal.toLocaleString()} {s.unit}
                                        </span>
                                        <div className="flex-1"><Bar value={s.kaanVal} max={s.max} color={kaan.color} /></div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-16 text-right text-xs font-bold" style={{ color: compare.color, fontFamily: "var(--font-mono)" }}>
                                            {s.compVal.toLocaleString()} {s.unit}
                                        </span>
                                        <div className="flex-1"><Bar value={s.compVal} max={s.max} color={compare.color} /></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
