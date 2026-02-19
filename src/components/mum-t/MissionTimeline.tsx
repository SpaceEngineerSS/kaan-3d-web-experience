"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Radar, Shield, Crosshair, Radio, ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

gsap.registerPlugin(ScrollTrigger);

interface MissionPhase {
    id: string;
    number: string;
    icon: LucideIcon;
    codename: string;
    title: string;
    platformFocus: string;
    description: string;
    color: string;
}

const PHASE_META = [
    { id: "isr", number: "01", icon: Radar, color: "#00d4ff" },
    { id: "sead", number: "02", icon: Shield, color: "#fbbf24" },
    { id: "strike", number: "03", icon: Crosshair, color: "#ff4444" },
    { id: "ew", number: "04", icon: Radio, color: "#a78bfa" },
    { id: "extract", number: "05", icon: ArrowLeft, color: "#00ff88" },
];

export function MissionTimeline() {
    const { locale } = useLanguage();
    const mt = useMumtT(locale);
    const PHASES: MissionPhase[] = PHASE_META.map((m, i) => ({
        ...m,
        codename: mt.phases[i]?.codename ?? "",
        title: mt.phases[i]?.title ?? "",
        platformFocus: mt.phases[i]?.platformFocus ?? "",
        description: mt.phases[i]?.description ?? "",
    }));
    const sectionRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 767px)");
        setIsMobile(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        if (!sectionRef.current || !timelineRef.current || !progressRef.current)
            return;

        const pinMultiplier = isMobile ? 2.5 : 3.5;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: `+=${window.innerHeight * pinMultiplier}`,
                    pin: true,
                    scrub: 0.8,
                    anticipatePin: 1,
                },
            });

            tl.to(progressRef.current, {
                height: "100%",
                ease: "none",
            });

            cardsRef.current.forEach((card, i) => {
                if (!card) return;
                const fromX = isMobile ? 0 : i % 2 === 0 ? -60 : 60;
                const fromY = isMobile ? 30 : 0;
                tl.fromTo(
                    card,
                    { opacity: 0, x: fromX, y: fromY, scale: 0.95 },
                    {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: 1,
                        duration: 0.15,
                        ease: "power2.out",
                    },
                    i * 0.17
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [isMobile]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen bg-stealth-black px-4 py-16 sm:px-6 md:px-12 md:py-24"
        >
            <div className="mx-auto max-w-5xl">
                <div className="mb-12 text-center md:mb-16">
                    <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-neon-blue/60">
                        {mt.timeline.tag}
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                        {mt.timeline.title}{" "}
                        <span className="text-neon-blue">{mt.timeline.titleHighlight}</span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-lg font-mono text-[11px] text-slate-500">
                        {mt.timeline.scrollHint ?? ""}
                    </p>
                </div>

                <div ref={timelineRef} className="relative">
                    {/* Timeline line: left edge on mobile, center on desktop */}
                    <div className="absolute left-4 top-0 h-full w-px bg-slate-800 md:left-1/2 md:-translate-x-1/2">
                        <div
                            ref={progressRef}
                            className="w-full bg-gradient-to-b from-neon-blue to-hud-green"
                            style={{ height: "0%" }}
                        />
                    </div>

                    <div className="space-y-8 md:space-y-16">
                        {PHASES.map((phase, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <div
                                    key={phase.id}
                                    ref={(el) => {
                                        cardsRef.current[i] = el;
                                    }}
                                    className={`relative flex opacity-0 ${
                                        /* Mobile: always left-aligned after the dot */
                                        "pl-12 md:pl-0"
                                        } ${
                                        /* Desktop: alternate sides */
                                        isLeft
                                            ? "md:flex-row md:pr-[52%]"
                                            : "md:flex-row-reverse md:pl-[52%]"
                                        }`}
                                >
                                    {/* Phase icon dot: left edge on mobile, center on desktop */}
                                    <div
                                        className="absolute left-0 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border md:left-1/2 md:top-5 md:h-10 md:w-10 md:-translate-x-1/2"
                                        style={{
                                            borderColor: `${phase.color}30`,
                                            background: `${phase.color}10`,
                                        }}
                                    >
                                        <phase.icon
                                            className="h-3.5 w-3.5 md:h-4 md:w-4"
                                            style={{ color: phase.color }}
                                        />
                                    </div>

                                    <div
                                        className="w-full rounded-xl border p-4 transition-colors hover:border-opacity-30 md:p-6"
                                        style={{
                                            borderColor: `${phase.color}12`,
                                            background: "rgba(10, 10, 20, 0.6)",
                                            backdropFilter: "blur(12px)",
                                        }}
                                    >
                                        <div className="mb-3 flex items-center gap-3">
                                            <span
                                                className="font-mono text-xl font-bold md:text-2xl"
                                                style={{ color: `${phase.color}50` }}
                                            >
                                                {phase.number}
                                            </span>
                                            <div>
                                                <p
                                                    className="font-mono text-[8px] tracking-[0.3em]"
                                                    style={{ color: `${phase.color}80` }}
                                                >
                                                    {phase.codename}
                                                </p>
                                                <h3 className="text-sm font-bold text-white md:text-base">
                                                    {phase.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <span
                                                className="inline-block rounded px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.15em]"
                                                style={{
                                                    background: `${phase.color}12`,
                                                    color: phase.color,
                                                }}
                                            >
                                                {phase.platformFocus}
                                            </span>
                                        </div>

                                        <p className="text-[12px] leading-relaxed text-slate-400 md:text-[13px]">
                                            {phase.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
