"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

interface StatItem {
    value: number;
    suffix: string;
    prefix: string;
    label: string;
    sublabel: string;
}

const STAT_VALUES = [
    { value: 5, suffix: ".", prefix: "" },
    { value: 2, suffix: "×", prefix: "" },
    { value: 11, suffix: "", prefix: "" },
    { value: 700, suffix: "+", prefix: "" },
    { value: 200, suffix: "+", prefix: "" },
    { value: 1200, suffix: "", prefix: "" },
];

function AnimatedCounter({
    target,
    suffix,
    prefix,
    active,
}: {
    target: number;
    suffix: string;
    prefix: string;
    active: boolean;
}) {
    const [count, setCount] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!active || hasAnimated.current) return;
        hasAnimated.current = true;

        const duration = 1800;
        const startTime = performance.now();

        function step(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }, [active, target]);

    return (
        <span className="tabular-nums">
            {prefix}
            {count.toLocaleString("tr-TR")}
            {suffix}
        </span>
    );
}

export function MumTStats() {
    const { locale } = useLanguage();
    const mt = useMumtT(locale);
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    const handleIntersection = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            if (entries[0]?.isIntersecting) setIsVisible(true);
        },
        []
    );

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.3,
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [handleIntersection]);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[#020617] py-20 md:py-28"
        >
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)",
                }}
            />

            <div className="pointer-events-none absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-14 text-center"
                >
                    <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-cyan-400/60">
                        {mt.stats.tag}
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                        {mt.stats.title}{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            {mt.stats.titleHighlight}
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
                    {STAT_VALUES.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{
                                delay: i * 0.08,
                                duration: 0.5,
                                ease: "easeOut" as const,
                            }}
                            className="group relative overflow-hidden rounded-xl border border-cyan-500/8 p-5 text-center transition-colors duration-300 hover:border-cyan-500/20"
                            style={{
                                background: "rgba(10, 10, 20, 0.5)",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            <div
                                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, transparent 60%)",
                                }}
                            />

                            <div className="relative">
                                <p className="mb-2 text-3xl font-bold text-white md:text-4xl">
                                    <AnimatedCounter
                                        target={stat.value}
                                        suffix={stat.suffix}
                                        prefix={stat.prefix}
                                        active={isVisible}
                                    />
                                </p>
                                <p className="mb-1 font-mono text-[10px] font-bold tracking-[0.25em] text-cyan-400/70">
                                    {mt.statItems[i]?.label ?? ""}
                                </p>
                                <p className="text-[11px] leading-snug text-slate-500">
                                    {mt.statItems[i]?.sublabel ?? ""}
                                </p>
                            </div>

                            <div
                                className="pointer-events-none absolute -bottom-px left-0 right-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                style={{
                                    background:
                                        "linear-gradient(90deg, transparent, #00d4ff40, transparent)",
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
