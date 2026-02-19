"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

interface LinkType {
    id: string;
    label: string;
    color: string;
}

const LINK_META = [
    { id: "target", color: "#ff4444" },
    { id: "sensor", color: "#00d4ff" },
    { id: "mission", color: "#fbbf24" },
    { id: "status", color: "#00ff88" },
    { id: "swarm", color: "#a78bfa" },
    { id: "threat", color: "#f97316" },
];

function PulsingNode({
    cx,
    cy,
    label,
    isMain,
    active,
}: {
    cx: number;
    cy: number;
    label: string;
    isMain?: boolean;
    active: boolean;
}) {
    const radius = isMain ? 28 : 20;
    const color = isMain ? "#00d4ff" : "#00ff88";
    return (
        <g>
            <circle
                cx={cx}
                cy={cy}
                r={radius + 12}
                fill="none"
                stroke={color}
                strokeWidth={0.5}
                opacity={active ? 0.3 : 0.1}
            >
                <animate
                    attributeName="r"
                    values={`${radius + 8};${radius + 18};${radius + 8}`}
                    dur="3s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="opacity"
                    values={active ? "0.3;0.1;0.3" : "0.1;0.04;0.1"}
                    dur="3s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill={`${color}10`}
                stroke={color}
                strokeWidth={active ? 1.5 : 0.8}
                opacity={active ? 0.9 : 0.4}
            />
            <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fill={active ? "#ffffff" : "#94a3b8"}
                fontSize={isMain ? 10 : 8}
                fontFamily="var(--font-mono)"
                fontWeight="bold"
                letterSpacing="0.1em"
            >
                {label}
            </text>
        </g>
    );
}

function DataStream({
    x1,
    y1,
    x2,
    y2,
    color,
    active,
    curveDir,
}: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    active: boolean;
    curveDir: number;
}) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 + curveDir * 30;
    const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;

    return (
        <g>
            <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={active ? 1.5 : 0.6}
                strokeDasharray={active ? "6 4" : "3 6"}
                opacity={active ? 0.7 : 0.15}
            >
                {active && (
                    <animate
                        attributeName="stroke-dashoffset"
                        values="0;-20"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                )}
            </path>
            {active && (
                <circle r="3" fill={color} opacity="0.9">
                    <animateMotion dur="2s" repeatCount="indefinite" path={d} />
                </circle>
            )}
        </g>
    );
}

export function DataLinkDiagram() {
    const { locale } = useLanguage();
    const mt = useMumtT(locale);
    const DATA_LINKS = LINK_META.map((l, i) => ({ ...l, label: mt.dataLinks[i]?.label ?? l.id }));
    const [activeLink, setActiveLink] = useState<string | null>(null);

    const handleLinkHover = useCallback((id: string | null) => {
        setActiveLink(id);
    }, []);

    const kaanPos = { x: 300, y: 150 };
    const alphaPos = { x: 100, y: 280 };
    const bravoPos = { x: 500, y: 280 };

    return (
        <section className="relative bg-stealth-black px-4 py-16 sm:px-6 md:px-12 md:py-24">
            <div className="mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center"
                >
                    <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-neon-blue/60">
                        {mt.datalink.tag}
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                        {mt.datalink.title}{" "}
                        <span className="text-neon-blue">{mt.datalink.titleHighlight}</span>
                    </h2>
                </motion.div>

                <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-lg shrink-0"
                    >
                        <svg viewBox="0 0 600 380" className="w-full">
                            <defs>
                                <radialGradient id="bg-glow" cx="50%" cy="40%" r="50%">
                                    <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.04" />
                                    <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
                                </radialGradient>
                            </defs>
                            <rect width="600" height="380" fill="url(#bg-glow)" rx="12" />

                            {DATA_LINKS.map((link, i) => {
                                const isActive = activeLink === link.id || activeLink === null;
                                const toAlpha = i % 2 === 0;
                                return (
                                    <DataStream
                                        key={link.id}
                                        x1={kaanPos.x}
                                        y1={kaanPos.y}
                                        x2={toAlpha ? alphaPos.x : bravoPos.x}
                                        y2={toAlpha ? alphaPos.y : bravoPos.y}
                                        color={link.color}
                                        active={isActive && activeLink !== null}
                                        curveDir={i % 3 === 0 ? -1 : 1}
                                    />
                                );
                            })}

                            <DataStream
                                x1={alphaPos.x}
                                y1={alphaPos.y}
                                x2={bravoPos.x}
                                y2={bravoPos.y}
                                color="#00d4ff"
                                active={activeLink === "swarm"}
                                curveDir={1}
                            />

                            <PulsingNode
                                cx={kaanPos.x}
                                cy={kaanPos.y}
                                label="KAAN"
                                isMain
                                active={activeLink !== null}
                            />
                            <PulsingNode
                                cx={alphaPos.x}
                                cy={alphaPos.y}
                                label="ALPHA"
                                active={activeLink !== null}
                            />
                            <PulsingNode
                                cx={bravoPos.x}
                                cy={bravoPos.y}
                                label="BRAVO"
                                active={activeLink !== null}
                            />

                            <text
                                x={kaanPos.x}
                                y={kaanPos.y - 42}
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="8"
                                fontFamily="var(--font-mono)"
                                letterSpacing="0.15em"
                            >
                                COMBAT MANAGER
                            </text>
                            <text
                                x={alphaPos.x}
                                y={alphaPos.y + 36}
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="8"
                                fontFamily="var(--font-mono)"
                                letterSpacing="0.12em"
                            >
                                ANKA-3 ALPHA
                            </text>
                            <text
                                x={bravoPos.x}
                                y={bravoPos.y + 36}
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="8"
                                fontFamily="var(--font-mono)"
                                letterSpacing="0.12em"
                            >
                                ANKA-3 BRAVO
                            </text>
                        </svg>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-2 lg:flex-col lg:gap-2.5">
                        {DATA_LINKS.map((link, i) => (
                            <motion.button
                                key={link.id}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06, duration: 0.35 }}
                                onMouseEnter={() => handleLinkHover(link.id)}
                                onMouseLeave={() => handleLinkHover(null)}
                                onClick={() =>
                                    setActiveLink((prev) =>
                                        prev === link.id ? null : link.id
                                    )
                                }
                                className="flex min-h-[44px] items-center gap-2.5 rounded-lg border px-4 py-2.5 font-mono text-[11px] tracking-wide transition-all"
                                style={{
                                    borderColor:
                                        activeLink === link.id
                                            ? `${link.color}40`
                                            : "rgba(255,255,255,0.06)",
                                    background:
                                        activeLink === link.id
                                            ? `${link.color}08`
                                            : "rgba(10,10,20,0.5)",
                                    color:
                                        activeLink === link.id
                                            ? link.color
                                            : "#94a3b8",
                                }}
                            >
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ background: link.color }}
                                />
                                {link.label}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
