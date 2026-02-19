"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    Bomb,
    Flame,
    ShieldAlert,
    Target,
    Weight,
    Factory,
    Plane,
    Layers,
    Crosshair,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

const GAZAP_ICON_MAP: LucideIcon[] = [Weight, Flame, Layers, Target, Factory, Plane];
const HAYALET_ICON_MAP: LucideIcon[] = [Weight, ShieldAlert, Crosshair, Layers, Factory, Plane];

function MunitionCard({
    name,
    type,
    description,
    specs,
    iconMap,
    accentFrom,
    accentTo,
    delay,
}: {
    name: string;
    type: string;
    description: string;
    specs: { label: string; value: string }[];
    iconMap: LucideIcon[];
    accentFrom: string;
    accentTo: string;
    delay: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-slate-900/80 to-slate-950/90 p-1"
        >
            {/* Gradient border glow */}
            <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background: `linear-gradient(135deg, ${accentFrom}15, transparent 50%, ${accentTo}10)`,
                }}
            />

            <div className="relative rounded-xl bg-slate-950/60 p-6 sm:p-8 backdrop-blur-sm">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                        style={{
                            background: `linear-gradient(135deg, ${accentFrom}20, ${accentTo}10)`,
                            border: `1px solid ${accentFrom}30`,
                        }}
                    >
                        <Bomb className="h-7 w-7" style={{ color: accentFrom }} />
                    </div>
                    <div>
                        <h3
                            className="text-2xl font-black tracking-wider sm:text-3xl"
                            style={{
                                background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {name}
                        </h3>
                        <p className="mt-0.5 font-mono text-[10px] tracking-[0.15em] text-slate-500 uppercase">
                            {type}
                        </p>
                    </div>
                </div>

                {/* Description */}
                <p className="mb-8 text-sm leading-relaxed text-slate-400 sm:text-[15px]">
                    {description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {specs.map((spec, i) => {
                        const Icon = iconMap[i] ?? Bomb;
                        return (
                            <motion.div
                                key={spec.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={inView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.4, delay: delay + 0.1 + i * 0.06 }}
                                className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-3 transition-colors duration-300 hover:border-white/[0.08] hover:bg-white/[0.04]"
                            >
                                <div className="mb-1.5 flex items-center gap-1.5">
                                    <Icon className="h-3.5 w-3.5 text-slate-600" />
                                    <span className="font-mono text-[9px] tracking-[0.15em] text-slate-600 uppercase">
                                        {spec.label}
                                    </span>
                                </div>
                                <p
                                    className="text-sm font-bold tracking-wide sm:text-base"
                                    style={{ color: accentFrom }}
                                >
                                    {spec.value}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom accent line */}
                <div
                    className="mt-6 h-[1px] w-full opacity-20"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${accentFrom}, transparent)`,
                    }}
                />
            </div>
        </motion.div>
    );
}

export function MunitionsShowcase() {
    const { locale } = useLanguage();
    const mt = useMumtT(locale);
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, { once: true, margin: "-80px" });

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[#020617] px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
        >
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-red-500/[0.02] blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/[0.02] blur-[120px]" />
            </div>

            <div className="relative mx-auto max-w-6xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <span className="mb-4 inline-block rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 font-mono text-[10px] tracking-[0.25em] text-red-400">
                        {mt.munitions.tag}
                    </span>
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                        {mt.munitions.title}{" "}
                        <span className="bg-gradient-to-r from-red-400 to-amber-500 bg-clip-text text-transparent">
                            {mt.munitions.titleHighlight}
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm text-slate-400 sm:text-base">
                        {mt.munitions.description}
                    </p>
                </motion.div>

                {/* Munition Cards */}
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                    <MunitionCard
                        name={mt.gazap.name}
                        type={mt.gazap.type}
                        description={mt.gazap.description}
                        specs={mt.gazap.specs}
                        iconMap={GAZAP_ICON_MAP}
                        accentFrom="#ef4444"
                        accentTo="#f97316"
                        delay={0.1}
                    />

                    <MunitionCard
                        name={mt.hayalet.name}
                        type={mt.hayalet.type}
                        description={mt.hayalet.description}
                        specs={mt.hayalet.specs}
                        iconMap={HAYALET_ICON_MAP}
                        accentFrom="#a855f7"
                        accentTo="#6366f1"
                        delay={0.25}
                    />
                </div>

                {/* IDEF 2025 badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-10 flex justify-center"
                >
                    <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-5 py-2 font-mono text-[10px] tracking-[0.2em] text-slate-500">
                        IDEF 2025 · MSB AR-GE · MİLLİ VE YERLİ
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
