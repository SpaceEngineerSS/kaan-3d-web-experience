"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Plane, Crosshair, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

const ZONE_META = [
    { id: "long", range: "200+ km", color: "#ef4444", radius: 92 },
    { id: "medium", range: "50–150 km", color: "#f97316", radius: 68 },
    { id: "short", range: "<30 km", color: "#fbbf24", radius: 42 },
    { id: "target", range: "0 km", color: "#00d4ff", radius: 14 },
];

const PLATFORM_META = [
    { id: "kaan", label: "KAAN", x: 50, y: 8, color: "#00d4ff" },
    { id: "anka-l", label: "ANKA-3 α", x: 32, y: 42, color: "#a78bfa" },
    { id: "anka-r", label: "ANKA-3 β", x: 68, y: 42, color: "#a78bfa" },
    { id: "simsek-1", label: "S.ŞİMŞEK", x: 42, y: 62, color: "#fbbf24" },
    { id: "simsek-2", label: "S.ŞİMŞEK", x: 58, y: 68, color: "#fbbf24" },
];

export function ThreatLandscape() {
    const { locale } = useLanguage();
    const mt = useMumtT(locale);
    const [activeZone, setActiveZone] = useState<string | null>(null);

    const ZONES = ZONE_META.map((z, i) => ({ ...z, label: mt.zones[i]?.label ?? z.id, description: mt.zones[i]?.description ?? "" }));
    const PLATFORM_POSITIONS = PLATFORM_META.map((p, i) => ({ ...p, role: mt.platforms[i]?.role ?? "" }));

    const active = ZONES.find((z) => z.id === activeZone);

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
                        {mt.threat.tag}
                    </p>
                    <h2 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                        {mt.threat.title}{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            {mt.threat.titleHighlight}
                        </span>
                    </h2>
                    <p className="mx-auto max-w-xl text-sm text-slate-400">
                        {mt.threat.description}
                    </p>
                </motion.div>

                <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative mx-auto aspect-square w-full max-w-lg"
                    >
                        <svg
                            viewBox="0 0 100 100"
                            className="h-full w-full"
                        >
                            {ZONES.map((zone) => (
                                <g key={zone.id}>
                                    <circle
                                        cx="50"
                                        cy="55"
                                        r={zone.radius}
                                        fill="none"
                                        stroke={zone.color}
                                        strokeWidth={
                                            activeZone === zone.id ? 0.8 : 0.3
                                        }
                                        strokeDasharray={
                                            zone.id === "target"
                                                ? "none"
                                                : "2 2"
                                        }
                                        opacity={
                                            activeZone === zone.id ? 1 : 0.4
                                        }
                                        className="transition-all duration-300"
                                    />
                                    <circle
                                        cx="50"
                                        cy="55"
                                        r={zone.radius}
                                        fill={zone.color}
                                        opacity={
                                            activeZone === zone.id
                                                ? 0.06
                                                : 0.02
                                        }
                                        className="cursor-pointer transition-all duration-300"
                                        onMouseEnter={() =>
                                            setActiveZone(zone.id)
                                        }
                                        onMouseLeave={() =>
                                            setActiveZone(null)
                                        }
                                        onClick={() =>
                                            setActiveZone((prev) =>
                                                prev === zone.id ? null : zone.id
                                            )
                                        }
                                    />
                                </g>
                            ))}

                            {PLATFORM_POSITIONS.map((p) => (
                                <g key={p.id}>
                                    <circle
                                        cx={p.x}
                                        cy={p.y}
                                        r={1.6}
                                        fill={p.color}
                                        opacity={0.9}
                                    />
                                    <circle
                                        cx={p.x}
                                        cy={p.y}
                                        r={3}
                                        fill="none"
                                        stroke={p.color}
                                        strokeWidth={0.3}
                                        opacity={0.4}
                                    >
                                        <animate
                                            attributeName="r"
                                            values="2.5;4;2.5"
                                            dur="2.5s"
                                            repeatCount="indefinite"
                                        />
                                        <animate
                                            attributeName="opacity"
                                            values="0.4;0.1;0.4"
                                            dur="2.5s"
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                    <text
                                        x={p.x}
                                        y={p.y - 3.5}
                                        textAnchor="middle"
                                        fill={p.color}
                                        fontSize="2"
                                        fontFamily="monospace"
                                        opacity={0.8}
                                    >
                                        {p.label}
                                    </text>
                                </g>
                            ))}

                            <line
                                x1="50"
                                y1="8"
                                x2="32"
                                y2="42"
                                stroke="#00d4ff"
                                strokeWidth={0.2}
                                strokeDasharray="1.5 1.5"
                                opacity={0.3}
                            />
                            <line
                                x1="50"
                                y1="8"
                                x2="68"
                                y2="42"
                                stroke="#00d4ff"
                                strokeWidth={0.2}
                                strokeDasharray="1.5 1.5"
                                opacity={0.3}
                            />
                            <line
                                x1="32"
                                y1="42"
                                x2="42"
                                y2="62"
                                stroke="#a78bfa"
                                strokeWidth={0.2}
                                strokeDasharray="1 1"
                                opacity={0.3}
                            />
                            <line
                                x1="68"
                                y1="42"
                                x2="58"
                                y2="68"
                                stroke="#a78bfa"
                                strokeWidth={0.2}
                                strokeDasharray="1 1"
                                opacity={0.3}
                            />
                        </svg>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col gap-3"
                    >
                        {ZONES.map((zone, i) => {
                            const icons = [
                                AlertTriangle,
                                Shield,
                                Crosshair,
                                Plane,
                            ];
                            const Icon = icons[i];
                            const isActive = activeZone === zone.id;
                            return (
                                <button
                                    key={zone.id}
                                    onMouseEnter={() =>
                                        setActiveZone(zone.id)
                                    }
                                    onMouseLeave={() => setActiveZone(null)}
                                    onClick={() =>
                                        setActiveZone((prev) =>
                                            prev === zone.id ? null : zone.id
                                        )
                                    }
                                    className={`group relative min-h-[44px] overflow-hidden rounded-lg border p-4 text-left transition-all duration-300 ${isActive
                                        ? "border-cyan-500/20 bg-cyan-500/5"
                                        : "border-white/5 bg-white/[0.01]"
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border"
                                            style={{
                                                borderColor: `${zone.color}25`,
                                                backgroundColor: `${zone.color}10`,
                                            }}
                                        >
                                            <Icon
                                                className="h-3.5 w-3.5"
                                                style={{ color: zone.color }}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="mb-1 flex items-center gap-2">
                                                <span className="text-xs font-bold text-white">
                                                    {zone.label}
                                                </span>
                                                <span
                                                    className="font-mono text-[9px]"
                                                    style={{
                                                        color: zone.color,
                                                    }}
                                                >
                                                    {zone.range}
                                                </span>
                                            </div>
                                            <p
                                                className={`text-[11px] leading-relaxed transition-colors ${isActive ? "text-slate-300" : "text-slate-500"}`}
                                            >
                                                {zone.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}

                        {active && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-lg border border-cyan-500/10 bg-cyan-500/5 p-3"
                            >
                                <p className="text-center font-mono text-[9px] tracking-[0.2em] text-cyan-400/60">
                                    AKTİF KATMAN ·{" "}
                                    {active.label.toUpperCase()}
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
