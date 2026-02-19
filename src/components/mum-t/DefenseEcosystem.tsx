"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

interface Company {
    id: string;
    name: string;
    role: string;
    products: string[];
    color: string;
    angle: number;
}

const COMPANY_META = [
    { id: "tusas", name: "TUSAŞ / TAI", color: "#00d4ff", angle: 0 },
    { id: "aselsan", name: "ASELSAN", color: "#a78bfa", angle: 60 },
    { id: "roketsan", name: "ROKETSAN", color: "#ef4444", angle: 120 },
    { id: "tei", name: "TEI", color: "#f97316", angle: 180 },
    { id: "tubitak", name: "TÜBİTAK", color: "#10b981", angle: 240 },
    { id: "havelsan", name: "HAVELSAN", color: "#fbbf24", angle: 300 },
];

export function DefenseEcosystem() {
    const { locale } = useLanguage();
    const mt = useMumtT(locale);
    const COMPANIES: Company[] = COMPANY_META.map((m, i) => ({
        ...m,
        role: mt.companies[i]?.role ?? "",
        products: mt.companyProducts[i] ?? [],
    }));
    const [activeId, setActiveId] = useState<string | null>(null);
    const active = COMPANIES.find((c) => c.id === activeId);

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
                        {mt.ecosystem.tag}
                    </p>
                    <h2 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                        {mt.ecosystem.title}{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            {mt.ecosystem.titleHighlight}
                        </span>
                    </h2>
                    <p className="mx-auto max-w-xl text-sm text-slate-400">
                        {mt.ecosystem.description}
                    </p>
                </motion.div>

                <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative mx-auto aspect-square w-full max-w-md"
                    >
                        <svg viewBox="0 0 200 200" className="h-full w-full">
                            {COMPANIES.map((company) => {
                                const rad =
                                    (company.angle - 90) * (Math.PI / 180);
                                const r = 70;
                                const cx = 100 + r * Math.cos(rad);
                                const cy = 100 + r * Math.sin(rad);
                                const isActive = activeId === company.id;

                                return (
                                    <g key={company.id}>
                                        <line
                                            x1="100"
                                            y1="100"
                                            x2={cx}
                                            y2={cy}
                                            stroke={company.color}
                                            strokeWidth={isActive ? 0.8 : 0.3}
                                            strokeDasharray="3 3"
                                            opacity={isActive ? 0.8 : 0.2}
                                            className="transition-all duration-300"
                                        />

                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={isActive ? 16 : 14}
                                            fill={company.color}
                                            opacity={isActive ? 0.12 : 0.05}
                                            className="cursor-pointer transition-all duration-300"
                                            onMouseEnter={() =>
                                                setActiveId(company.id)
                                            }
                                            onMouseLeave={() =>
                                                setActiveId(null)
                                            }
                                        />
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={isActive ? 16 : 14}
                                            fill="none"
                                            stroke={company.color}
                                            strokeWidth={
                                                isActive ? 0.8 : 0.3
                                            }
                                            opacity={isActive ? 0.6 : 0.25}
                                            className="cursor-pointer transition-all duration-300"
                                            onMouseEnter={() =>
                                                setActiveId(company.id)
                                            }
                                            onMouseLeave={() =>
                                                setActiveId(null)
                                            }
                                        />
                                        <text
                                            x={cx}
                                            y={cy + 0.8}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill="white"
                                            fontSize="5"
                                            fontWeight="bold"
                                            className="pointer-events-none select-none"
                                        >
                                            {company.name.split(" ")[0]}
                                        </text>
                                        {/* Invisible larger touch target */}
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={24}
                                            fill="transparent"
                                            className="cursor-pointer"
                                            onMouseEnter={() =>
                                                setActiveId(company.id)
                                            }
                                            onMouseLeave={() =>
                                                setActiveId(null)
                                            }
                                            onClick={() =>
                                                setActiveId((prev) =>
                                                    prev === company.id ? null : company.id
                                                )
                                            }
                                        />
                                    </g>
                                );
                            })}

                            <circle
                                cx="100"
                                cy="100"
                                r="22"
                                fill="#00d4ff"
                                opacity={0.06}
                            />
                            <circle
                                cx="100"
                                cy="100"
                                r="22"
                                fill="none"
                                stroke="#00d4ff"
                                strokeWidth="0.5"
                                opacity={0.3}
                            />
                            <text
                                x="100"
                                y="97"
                                textAnchor="middle"
                                fill="white"
                                fontSize="8"
                                fontWeight="bold"
                                className="select-none"
                            >
                                KAAN
                            </text>
                            <text
                                x="100"
                                y="106"
                                textAnchor="middle"
                                fill="#00d4ff"
                                fontSize="4"
                                fontFamily="monospace"
                                opacity={0.6}
                                className="select-none"
                            >
                                MUM-T HUB
                            </text>
                        </svg>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col gap-2"
                    >
                        {COMPANIES.map((company) => {
                            const isActive = activeId === company.id;
                            return (
                                <button
                                    key={company.id}
                                    onMouseEnter={() =>
                                        setActiveId(company.id)
                                    }
                                    onMouseLeave={() => setActiveId(null)}
                                    onClick={() =>
                                        setActiveId((prev) =>
                                            prev === company.id ? null : company.id
                                        )
                                    }
                                    className={`group relative min-h-[44px] overflow-hidden rounded-lg border p-4 text-left transition-all duration-300 ${isActive
                                        ? "border-cyan-500/20 bg-cyan-500/5"
                                        : "border-white/5 bg-white/[0.01]"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-2 w-2 shrink-0 rounded-full"
                                            style={{
                                                backgroundColor: company.color,
                                            }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-white">
                                                    {company.name}
                                                </span>
                                                <span className="shrink-0 font-mono text-[8px] text-slate-500">
                                                    {company.role}
                                                </span>
                                            </div>
                                            {isActive && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        height: "auto",
                                                    }}
                                                    className="mt-2 flex flex-wrap gap-1.5"
                                                >
                                                    {company.products.map(
                                                        (p) => (
                                                            <span
                                                                key={p}
                                                                className="rounded-md border px-2 py-0.5 font-mono text-[9px]"
                                                                style={{
                                                                    borderColor: `${company.color}20`,
                                                                    color: company.color,
                                                                }}
                                                            >
                                                                {p}
                                                            </span>
                                                        )
                                                    )}
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
