"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, Shield, Eye, ChevronRight, RotateCcw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

interface ScenarioMeta {
    id: string;
    icon: LucideIcon;
    codename: string;
    color: string;
    stepActors: { actor: string; actorColor: string }[];
}

const SCENARIO_META: ScenarioMeta[] = [
    {
        id: "sead",
        icon: Shield,
        codename: "OPERATION YILDIRIM",
        color: "#ef4444",
        stepActors: [
            { actor: "KAAN", actorColor: "#00d4ff" },
            { actor: "ANKA-3", actorColor: "#a78bfa" },
            { actor: "S.ŞİMŞEK", actorColor: "#fbbf24" },
            { actor: "ANKA-3", actorColor: "#a78bfa" },
            { actor: "KAAN", actorColor: "#00d4ff" },
        ],
    },
    {
        id: "strike",
        icon: Radar,
        codename: "OPERATION ÇELİK FIRTINA",
        color: "#00d4ff",
        stepActors: [
            { actor: "KAAN", actorColor: "#00d4ff" },
            { actor: "ANKA-3", actorColor: "#a78bfa" },
            { actor: "KAAN", actorColor: "#00d4ff" },
            { actor: "ANKA-3", actorColor: "#a78bfa" },
            { actor: "S.ŞİMŞEK", actorColor: "#fbbf24" },
        ],
    },
    {
        id: "isr",
        icon: Eye,
        codename: "OPERATION BAYKUŞ",
        color: "#10b981",
        stepActors: [
            { actor: "KAAN", actorColor: "#00d4ff" },
            { actor: "ANKA-3", actorColor: "#a78bfa" },
            { actor: "S.ŞİMŞEK", actorColor: "#fbbf24" },
            { actor: "ANKA-3", actorColor: "#a78bfa" },
            { actor: "KAAN", actorColor: "#00d4ff" },
        ],
    },
];

export function ScenarioSimulator() {
    const { locale } = useLanguage();
    const mt = useMumtT(locale);
    const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const meta = SCENARIO_META[activeScenarioIdx];
    const translated = mt.scenarios[activeScenarioIdx];
    const stepMeta = meta.stepActors[activeStep];
    function handleNext() {
        if (activeStep < meta.stepActors.length - 1) {
            setActiveStep((s) => s + 1);
        }
    }
    function handleReset() {
        setActiveStep(0);
    }
    function handleScenario(idx: number) {
        setActiveScenarioIdx(idx);
        setActiveStep(0);
    }

    const translatedStep = translated.steps[activeStep];

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
                        {mt.scenario.tag}
                    </p>
                    <h2 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                        {mt.scenario.title}{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            {mt.scenario.titleHighlight}
                        </span>
                    </h2>
                    <p className="mx-auto max-w-xl text-sm text-slate-400">
                        {mt.scenario.description}
                    </p>
                </motion.div>

                <div className="mb-8 flex flex-wrap justify-center gap-3">
                    {SCENARIO_META.map((s, i) => (
                        <button
                            key={s.id}
                            onClick={() => handleScenario(i)}
                            className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 font-mono text-[11px] transition-all duration-300 ${activeScenarioIdx === i
                                ? "border-cyan-500/25 bg-cyan-500/5 text-white"
                                : "border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300"
                                }`}
                        >
                            <s.icon className="h-3.5 w-3.5" />
                            {mt.scenarios[i].name}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={meta.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="mb-6 rounded-xl border border-cyan-500/10 bg-cyan-500/[0.02] p-4 text-center">
                            <p className="font-mono text-[9px] tracking-[0.3em] text-cyan-400/50">
                                {meta.codename}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                {translated.description}
                            </p>
                        </div>

                        <div className="mb-6 flex items-center justify-center gap-0">
                            {meta.stepActors.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveStep(i)}
                                    className="flex min-h-[44px] min-w-[44px] items-center justify-center"
                                >
                                    <span
                                        className={`block h-1.5 rounded-full transition-all duration-300 ${i === activeStep
                                            ? "w-8 bg-cyan-400"
                                            : i < activeStep
                                                ? "w-3 bg-cyan-400/40"
                                                : "w-3 bg-white/10"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.25 }}
                                className="rounded-xl border border-white/5 p-6 md:p-8"
                                style={{
                                    background: "rgba(10, 10, 20, 0.5)",
                                    backdropFilter: "blur(12px)",
                                }}
                            >
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/5 font-mono text-sm font-bold text-cyan-400">
                                        {activeStep + 1}
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="inline-block rounded-md border px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider"
                                                style={{
                                                    borderColor: `${stepMeta.actorColor}30`,
                                                    color: stepMeta.actorColor,
                                                }}
                                            >
                                                {stepMeta.actor}
                                            </span>
                                            <span className="text-sm font-bold text-white">
                                                {translatedStep.action}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[13px] leading-relaxed text-slate-400">
                                    {translatedStep.detail}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-6 flex items-center justify-center gap-3">
                            <button
                                onClick={handleReset}
                                className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-white/5 px-4 py-2 font-mono text-[10px] text-slate-500 transition-colors hover:border-white/10 hover:text-slate-300"
                            >
                                <RotateCcw className="h-3 w-3" />
                                {mt.scenario.reset}
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={
                                    activeStep >= meta.stepActors.length - 1
                                }
                                className={`flex min-h-[44px] items-center gap-1.5 rounded-lg border px-5 py-2 font-mono text-[10px] transition-all ${activeStep >= meta.stepActors.length - 1
                                    ? "cursor-not-allowed border-white/5 text-slate-600"
                                    : "border-cyan-500/25 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10"
                                    }`}
                            >
                                {mt.scenario.nextStep}
                                <ChevronRight className="h-3 w-3" />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
