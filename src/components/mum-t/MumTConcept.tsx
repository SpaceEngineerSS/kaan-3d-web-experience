"use client";

import { motion } from "framer-motion";
import { Activity, Zap, Link2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

interface LOILevel {
    level: number;
    title: string;
    description: string;
}

const BENEFIT_ICONS = [Activity, Zap, Link2];

export function MumTConcept() {
    const { locale } = useLanguage();
    const mt = useMumtT(locale);
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
                    <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-neon-blue/60">
                        {mt.concept.tag}
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                        {mt.concept.title}{" "}
                        <span className="text-neon-blue">{mt.concept.titleHighlight}</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
                        {mt.concept.description}
                    </p>
                </motion.div>

                <div className="mb-20 flex flex-col items-start gap-12 lg:flex-row lg:gap-16">
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3 className="mb-6 font-mono text-xs tracking-[0.2em] text-neon-blue/70">
                                {mt.concept.loiTitle}
                            </h3>

                            <div className="space-y-1">
                                {mt.loiLevels.map((level, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -15 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.08, duration: 0.4 }}
                                        className="group flex items-start gap-4 rounded-lg border border-transparent p-3 transition-colors hover:border-cyan-500/10 hover:bg-cyan-500/[0.03]"
                                    >
                                        <div className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center" aria-label={`LOI ${i + 1}`}>
                                            <svg viewBox="0 0 36 36" className="h-full w-full">
                                                <circle
                                                    cx="18"
                                                    cy="18"
                                                    r="15"
                                                    fill="none"
                                                    stroke="#1e293b"
                                                    strokeWidth="3"
                                                />
                                                <circle
                                                    cx="18"
                                                    cy="18"
                                                    r="15"
                                                    fill="none"
                                                    stroke="#00d4ff"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${((i + 1) / 5) * 94} 94`}
                                                    transform="rotate(-90 18 18)"
                                                    opacity="0.7"
                                                />
                                            </svg>
                                            <span className="absolute font-mono text-[10px] font-bold text-neon-blue">
                                                {i + 1}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-white">
                                                {level.title}
                                            </p>
                                            <p className="mt-0.5 text-[12px] text-slate-500">
                                                {level.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="flex-1"
                    >
                        <div className="relative overflow-hidden rounded-xl border border-cyan-500/10 p-6"
                            style={{
                                background: "rgba(10, 10, 20, 0.5)",
                                backdropFilter: "blur(12px)",
                            }}
                        >
                            <div className="mb-5 flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-neon-blue" />
                                <span className="font-mono text-[9px] tracking-[0.25em] text-neon-blue/60">
                                    {mt.concept.conceptSummaryTag}
                                </span>
                            </div>

                            <svg viewBox="0 0 400 200" className="mb-5 w-full">
                                <defs>
                                    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto" fill="#00d4ff">
                                        <polygon points="0 0, 8 3, 0 6" />
                                    </marker>
                                </defs>

                                <rect x="140" y="20" width="120" height="40" rx="6" fill="#00d4ff10" stroke="#00d4ff" strokeWidth="0.8" opacity="0.6" />
                                <text x="200" y="44" textAnchor="middle" fill="#00d4ff" fontSize="10" fontFamily="var(--font-mono)" fontWeight="bold" letterSpacing="0.15em">KAAN</text>

                                <rect x="20" y="130" width="100" height="36" rx="5" fill="#00ff8810" stroke="#00ff88" strokeWidth="0.6" opacity="0.5" />
                                <text x="70" y="152" textAnchor="middle" fill="#00ff88" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.1em">ALPHA</text>

                                <rect x="280" y="130" width="100" height="36" rx="5" fill="#00ff8810" stroke="#00ff88" strokeWidth="0.6" opacity="0.5" />
                                <text x="330" y="152" textAnchor="middle" fill="#00ff88" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.1em">BRAVO</text>

                                <line x1="170" y1="60" x2="80" y2="130" stroke="#00d4ff" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.4" markerEnd="url(#arrowhead)">
                                    <animate attributeName="stroke-dashoffset" values="0;-14" dur="2s" repeatCount="indefinite" />
                                </line>
                                <line x1="230" y1="60" x2="320" y2="130" stroke="#00d4ff" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.4" markerEnd="url(#arrowhead)">
                                    <animate attributeName="stroke-dashoffset" values="0;-14" dur="2s" repeatCount="indefinite" />
                                </line>
                                <line x1="120" y1="148" x2="280" y2="148" stroke="#00ff88" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.25">
                                    <animate attributeName="stroke-dashoffset" values="0;-14" dur="3s" repeatCount="indefinite" />
                                </line>

                                <text x="110" y="92" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="var(--font-mono)">{mt.concept.svgMissionCmd}</text>
                                <text x="290" y="92" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="var(--font-mono)">{mt.concept.svgSensorData}</text>
                                <text x="200" y="178" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="var(--font-mono)">{mt.concept.svgSwarmCoord}</text>
                            </svg>

                            <p className="text-[12px] leading-relaxed text-slate-500">
                                {mt.concept.conceptSummary}
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    {mt.benefits.map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ delay: i * 0.1, duration: 0.45 }}
                            className="rounded-xl border border-cyan-500/8 p-5 transition-colors hover:border-cyan-500/15"
                            style={{
                                background: "rgba(10, 10, 20, 0.4)",
                            }}
                        >
                            {(() => { const Icon = BENEFIT_ICONS[i]; return <Icon className="mb-3 h-5 w-5 text-neon-blue/70" />; })()}
                            <h4 className="mb-1.5 text-sm font-bold text-white">
                                {benefit.title}
                            </h4>
                            <p className="text-[12px] leading-relaxed text-slate-500">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
