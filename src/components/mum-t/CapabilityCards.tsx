"use client";

import { motion } from "framer-motion";
import { Eye, Shield, Crosshair, Radio } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

interface RoleCard {
    icon: LucideIcon;
    tag: string;
    title: string;
    description: string;
}

const ROLE_META = [
    { icon: Eye, tag: "ISR" },
    { icon: Shield, tag: "SEAD" },
    { icon: Crosshair, tag: "STRIKE" },
    { icon: Radio, tag: "EW" },
];

export function CapabilityCards() {
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
                        {mt.capability.tag}
                    </p>
                    <h2 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                        {mt.capability.title}{" "}
                        <span className="text-neon-blue">{mt.capability.titleHighlight}</span>
                    </h2>
                </motion.div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {ROLE_META.map((role, i) => (
                        <motion.article
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{
                                delay: i * 0.1,
                                duration: 0.5,
                                ease: "easeOut",
                            }}
                            className="group relative overflow-hidden rounded-xl border border-cyan-500/10 p-6 transition-colors hover:border-cyan-500/25"
                            style={{
                                background: "rgba(10, 10, 20, 0.6)",
                                backdropFilter: "blur(12px)",
                            }}
                        >
                            <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                style={{
                                    background: "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, transparent 60%)",
                                }}
                            />

                            <div className="relative">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/15 bg-cyan-500/5">
                                        <role.icon className="h-5 w-5 text-neon-blue" />
                                    </div>
                                    <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-neon-blue/70">
                                        {role.tag}
                                    </span>
                                </div>

                                <h3 className="mb-2 text-base font-bold tracking-wide text-white">
                                    {mt.roles[i]?.title}
                                </h3>
                                <p className="text-[13px] leading-relaxed text-slate-400">
                                    {mt.roles[i]?.description}
                                </p>
                            </div>

                            <div
                                className="pointer-events-none absolute -bottom-px left-0 right-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                style={{
                                    background: "linear-gradient(90deg, transparent, #00d4ff, transparent)",
                                }}
                            />
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
