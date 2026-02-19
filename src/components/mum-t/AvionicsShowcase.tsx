"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Radar,
    ScanEye,
    Wifi,
    ShieldCheck,
    Radio,
    Cpu,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

interface AvionicSystem {
    id: string;
    icon: LucideIcon;
    tag: string;
    name: string;
    developer: string;
    description: string;
    specs: { label: string; value: string }[];
    color: string;
}

const SYSTEM_META = [
    { id: "aesa", icon: Radar, tag: "MURAD AESA", developer: "ASELSAN", color: "#00d4ff" },
    { id: "irst", icon: ScanEye, tag: "IRST / DAS / EOTS", developer: "ASELSAN", color: "#f97316" },
    { id: "datalink", icon: Wifi, tag: "IVDL + T-LINK", developer: "ASELSAN", color: "#a78bfa" },
    { id: "ew", icon: ShieldCheck, tag: "EW PAKETİ", developer: "ASELSAN", color: "#ef4444" },
    { id: "mission", icon: Cpu, tag: "MİSYON BİLGİSAYARI", developer: "TÜBİTAK BİLGEM", color: "#10b981" },
    { id: "weapons", icon: Radio, tag: "SİLAH SİSTEMLERİ", developer: "ROKETSAN + TUSAŞ", color: "#fbbf24" },
];

export function AvionicsShowcase() {
    const { locale } = useLanguage();
    const mt = useMumtT(locale);
    const SYSTEMS: AvionicSystem[] = SYSTEM_META.map((m, i) => ({
        ...m,
        name: mt.avionicSystems[i]?.name ?? m.tag,
        description: mt.avionicSystems[i]?.description ?? "",
        specs: mt.avionicSystems[i]?.specs ?? [],
    }));
    const [activeId, setActiveId] = useState("aesa");
    const active = SYSTEMS.find((s) => s.id === activeId) ?? SYSTEMS[0];

    return (
        <section className="relative bg-cockpit-dark px-4 py-16 sm:px-6 md:px-12 md:py-24">
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center"
                >
                    <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-cyan-400/60">
                        {mt.avionics.tag}
                    </p>
                    <h2 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                        KAAN{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            {mt.avionics.titleHighlight}
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm text-slate-400">
                        {mt.avionics.description}
                    </p>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0"
                    >
                        {SYSTEMS.map((sys) => {
                            const isActive = sys.id === activeId;
                            return (
                                <button
                                    key={sys.id}
                                    onClick={() => setActiveId(sys.id)}
                                    className={`group relative flex min-w-[140px] shrink-0 items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-300 lg:min-w-0 ${isActive
                                        ? "border-cyan-500/25 bg-cyan-500/5"
                                        : "border-transparent hover:border-cyan-500/10 hover:bg-white/[0.02]"
                                        }`}
                                >
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors ${isActive
                                            ? "border-cyan-500/30 bg-cyan-500/10"
                                            : "border-white/5 bg-white/[0.02]"
                                            }`}
                                    >
                                        <sys.icon
                                            className="h-4 w-4"
                                            style={{
                                                color: isActive
                                                    ? sys.color
                                                    : "rgb(100,116,139)",
                                            }}
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p
                                            className={`truncate text-xs font-bold ${isActive
                                                ? "text-white"
                                                : "text-slate-400"
                                                }`}
                                        >
                                            {sys.tag}
                                        </p>
                                    </div>

                                    {isActive && (
                                        <motion.div
                                            layoutId="avionics-indicator"
                                            className="absolute -left-px top-2 bottom-2 hidden w-[2px] rounded-full lg:block"
                                            style={{
                                                background: sys.color,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 30,
                                            }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.3 }}
                            className="relative overflow-hidden rounded-2xl border border-cyan-500/10 p-6 md:p-8"
                            style={{
                                background: "rgba(10, 10, 20, 0.6)",
                                backdropFilter: "blur(16px)",
                            }}
                        >
                            <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    background: `radial-gradient(ellipse at 0% 0%, ${active.color}08 0%, transparent 50%)`,
                                }}
                            />

                            <div className="relative">
                                <div className="mb-6 flex flex-wrap items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border"
                                        style={{
                                            borderColor: `${active.color}30`,
                                            backgroundColor: `${active.color}10`,
                                        }}
                                    >
                                        <active.icon
                                            className="h-5 w-5"
                                            style={{ color: active.color }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">
                                            {active.name}
                                        </h3>
                                        <p className="font-mono text-[10px] tracking-[0.2em] text-slate-500">
                                            {active.developer}
                                        </p>
                                    </div>
                                </div>

                                <p className="mb-8 max-w-2xl text-[13px] leading-relaxed text-slate-400">
                                    {active.description}
                                </p>

                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {active.specs.map((spec, i) => (
                                        <motion.div
                                            key={spec.label}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                delay: i * 0.06,
                                                duration: 0.3,
                                            }}
                                            className="rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
                                        >
                                            <p className="mb-0.5 font-mono text-[9px] tracking-[0.2em] text-slate-500">
                                                {spec.label}
                                            </p>
                                            <p className="text-sm font-semibold text-white">
                                                {spec.value}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div
                                className="pointer-events-none absolute -bottom-px left-0 right-0 h-px"
                                style={{
                                    background: `linear-gradient(90deg, transparent, ${active.color}40, transparent)`,
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
