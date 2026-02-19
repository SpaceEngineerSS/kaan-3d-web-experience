"use client";

import { motion } from "framer-motion";
import {
    ShieldAlert,
    Eye,
    DollarSign,
    Radio,
    Timer,
    HeartPulse,
    ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

interface CompareRow {
    icon: LucideIcon;
    label: string;
    traditional: string;
    mumt: string;
    tradLevel: "critical" | "warning" | "neutral";
    mumtLevel: "excellent" | "good" | "neutral";
}

const ROW_META = [
    { icon: HeartPulse, tradLevel: "critical" as const, mumtLevel: "excellent" as const },
    { icon: Eye, tradLevel: "warning" as const, mumtLevel: "excellent" as const },
    { icon: DollarSign, tradLevel: "critical" as const, mumtLevel: "good" as const },
    { icon: Radio, tradLevel: "warning" as const, mumtLevel: "excellent" as const },
    { icon: Timer, tradLevel: "warning" as const, mumtLevel: "excellent" as const },
    { icon: ShieldAlert, tradLevel: "critical" as const, mumtLevel: "good" as const },
];

const tradColor: Record<string, string> = {
    critical: "text-red-400",
    warning: "text-amber-400",
    neutral: "text-slate-400",
};

const tradBorder: Record<string, string> = {
    critical: "border-red-500/15",
    warning: "border-amber-500/15",
    neutral: "border-slate-500/15",
};

const mumtColor: Record<string, string> = {
    excellent: "text-emerald-400",
    good: "text-cyan-400",
    neutral: "text-slate-400",
};

const mumtBorder: Record<string, string> = {
    excellent: "border-emerald-500/15",
    good: "border-cyan-500/15",
    neutral: "border-slate-500/15",
};

export function GenerationCompare() {
    const { locale } = useLanguage();
    const mt = useMumtT(locale);
    const ROWS: CompareRow[] = ROW_META.map((m, i) => ({
        ...m,
        label: mt.compareRows[i]?.label ?? "",
        traditional: mt.compareRows[i]?.traditional ?? "",
        mumt: mt.compareRows[i]?.mumt ?? "",
    }));
    return (
        <section className="relative bg-[#020617] px-4 py-16 sm:px-6 md:px-12 md:py-24">
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center"
                >
                    <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-cyan-400/60">
                        {mt.genCompare.tag}
                    </p>
                    <h2 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                        {mt.genCompare.title}{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            {mt.genCompare.titleHighlight}
                        </span>
                    </h2>
                    <p className="mx-auto max-w-xl text-sm text-slate-400">
                        {mt.genCompare.description ?? ""}
                    </p>
                </motion.div>

                <div className="mb-6 hidden grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:grid">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500/60" />
                        <span className="font-mono text-[10px] tracking-[0.2em] text-red-400/60">
                            {mt.genCompare.traditional ?? "GELENEKSEL HAVA OPS"}
                        </span>
                    </div>
                    <div className="w-8" />
                    <div className="flex items-center justify-end gap-2">
                        <span className="font-mono text-[10px] tracking-[0.2em] text-emerald-400/60">
                            MUM-T DOKTRİNİ
                        </span>
                        <div className="h-2 w-2 rounded-full bg-emerald-500/60" />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {ROWS.map((row, i) => (
                        <motion.div
                            key={row.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{
                                delay: i * 0.07,
                                duration: 0.45,
                                ease: "easeOut" as const,
                            }}
                            className="group grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto_1fr] md:items-stretch md:gap-3"
                        >
                            {/* Mobile: icon + label header */}
                            <div className="flex items-center gap-2 md:hidden">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/15 bg-cyan-500/5">
                                    <row.icon className="h-3.5 w-3.5 text-cyan-400" />
                                </div>
                                <span className="font-mono text-[9px] tracking-[0.2em] text-slate-400">
                                    {row.label.toUpperCase()}
                                </span>
                            </div>

                            {/* Traditional card */}
                            <div
                                className={`relative overflow-hidden rounded-lg border ${tradBorder[row.tradLevel]} p-3 transition-colors duration-300 md:p-4`}
                                style={{
                                    background: "rgba(10, 10, 20, 0.5)",
                                    backdropFilter: "blur(8px)",
                                }}
                            >
                                <p className="mb-1 font-mono text-[8px] tracking-[0.15em] text-red-400/50 md:hidden">GELENEKSEL</p>
                                <p
                                    className={`text-[12px] leading-relaxed md:text-[13px] ${tradColor[row.tradLevel]}`}
                                >
                                    {row.traditional}
                                </p>
                            </div>

                            {/* Desktop: center icon column */}
                            <div className="hidden flex-col items-center justify-center gap-1.5 px-2 md:flex">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/15 bg-cyan-500/5">
                                    <row.icon className="h-4 w-4 text-cyan-400" />
                                </div>
                                <span className="font-mono text-[8px] tracking-[0.2em] text-slate-500">
                                    {row.label.toUpperCase()}
                                </span>
                                <ChevronRight className="hidden h-3 w-3 text-cyan-500/30 md:block" />
                            </div>

                            {/* MUM-T card */}
                            <div
                                className={`relative overflow-hidden rounded-lg border ${mumtBorder[row.mumtLevel]} p-3 transition-colors duration-300 md:p-4`}
                                style={{
                                    background: "rgba(10, 10, 20, 0.5)",
                                    backdropFilter: "blur(8px)",
                                }}
                            >
                                <p className="mb-1 font-mono text-[8px] tracking-[0.15em] text-emerald-400/50 md:hidden">MUM-T</p>
                                <p
                                    className={`text-[12px] leading-relaxed md:text-[13px] ${mumtColor[row.mumtLevel]}`}
                                >
                                    {row.mumt}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
