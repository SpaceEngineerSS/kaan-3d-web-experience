"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Crosshair,
    ShieldCheck,
    Wifi,
    Radio,
    ChevronDown,
} from "lucide-react";
import { useFormationState } from "./useFormation";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

function MissionClock() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setTime(
                `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}Z`
            );
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return <span>{time || "00:00:00Z"}</span>;
}

interface UcavPanelProps {
    callsign: string;
    designation: string;
    role: string;
    linkQuality: number;
    index: number;
    deployed?: boolean;
}

function UcavPanel({
    callsign,
    designation,
    role,
    linkQuality,
    index,
    deployed = false,
}: UcavPanelProps) {
    const { locale } = useLanguage();
    const mt = useMumtT(locale);
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: 0.6 + index * 0.12,
                duration: 0.5,
                ease: "easeOut",
            }}
            className="rounded-lg border border-cyan-500/15 px-2 py-1.5 sm:px-5 sm:py-4"
            style={{
                background: "rgba(2, 6, 23, 0.75)",
                backdropFilter: "blur(16px) saturate(1.3)",
                WebkitBackdropFilter: "blur(16px) saturate(1.3)",
            }}
        >
            <div className="mb-1 flex items-center justify-between sm:mb-3">
                <div className="flex items-center gap-2">
                    <Radio className="h-3 w-3 text-cyan-400 sm:h-3.5 sm:w-3.5" />
                    <span className="text-[11px] font-bold tracking-[0.2em] text-cyan-400">
                        {callsign}
                    </span>
                </div>
                <span className={`rounded px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] ${deployed
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-emerald-500/15 text-emerald-400"
                    }`}>
                    {deployed ? mt.hero.deploying : mt.hero.synced}
                </span>
            </div>

            <div className="space-y-0.5 text-[8px] tracking-wide text-slate-400 sm:space-y-1.5 sm:text-[10px]">
                <div className="flex justify-between">
                    <span>{mt.hero.designation}</span>
                    <span className="text-slate-200">{designation}</span>
                </div>
                <div className="flex justify-between">
                    <span>{mt.hero.role}</span>
                    <span className="text-cyan-400">{role}</span>
                </div>
                <div className="flex justify-between">
                    <span>{mt.hero.datalink}</span>
                    <div className="flex items-center gap-1.5">
                        <div className="h-1 w-16 overflow-hidden rounded-full bg-slate-700">
                            <motion.div
                                className="h-full rounded-full bg-cyan-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${linkQuality}%` }}
                                transition={{
                                    delay: 1.2 + index * 0.3,
                                    duration: 0.8,
                                }}
                            />
                        </div>
                        <span className="text-cyan-300">{linkQuality}%</span>
                    </div>
                </div>
            </div>
        </motion.div >
    );
}

const TITLE_CHARS = "MANNED-UNMANNED TEAMING".split("");

function UcavPanelConnected({
    callsign,
    designation,
    role,
    index,
    unit,
}: Omit<UcavPanelProps, "linkQuality"> & { unit: "alpha" | "bravo" }) {
    const formation = useFormationState();
    const deployed = unit === "alpha" ? formation.alpha.deployed : formation.bravo.deployed;
    const linkQuality = deployed ? 31 : unit === "alpha" ? 94 : 87;

    return (
        <UcavPanel
            callsign={callsign}
            designation={designation}
            role={role}
            linkQuality={linkQuality}
            index={index}
            deployed={deployed}
        />
    );
}

export function MumTHud() {
    return (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 font-mono md:p-6">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-6">
                    <div className="hidden items-center gap-2 md:flex">
                        <ShieldCheck className="h-3.5 w-3.5 text-cyan-500/60" />
                        <span className="text-[10px] tracking-[0.15em] text-cyan-500/60">
                            SECURE COMM — AES-256
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.42,
                            duration: 0.5,
                            ease: "easeOut",
                        }}
                        className="flex items-center gap-2"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-[10px] tracking-[0.15em] text-emerald-400/80">
                            ENCRYPTED
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.54,
                            duration: 0.5,
                            ease: "easeOut",
                        }}
                        className="flex items-center gap-2"
                    >
                        <Wifi className="h-3.5 w-3.5 text-cyan-500/50" />
                        <span className="text-[10px] tracking-[0.15em] text-cyan-500/50">
                            <MissionClock />
                        </span>
                    </motion.div>
                </div>
            </motion.div>

            <div className="flex flex-col items-center justify-center gap-6">
                {/* Crosshair removed per user request for cleaner background */}

                <div className="relative z-10 flex flex-col items-center gap-2">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="text-[9px] tracking-[0.4em] text-neon-blue/50"
                    >
                        TAKTİK VERİ BAĞLANTISI
                    </motion.p>

                    <h1 className="flex select-none text-center text-xl font-bold tracking-[0.06em] text-white sm:text-3xl sm:tracking-[0.12em] md:text-5xl">
                        {TITLE_CHARS.map((char, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 1.0 + i * 0.03,
                                    duration: 0.4,
                                    ease: "easeOut",
                                }}
                                className={
                                    char === "-"
                                        ? "text-neon-blue/40"
                                        : char === " "
                                            ? "w-2 md:w-3"
                                            : ""
                                }
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8, duration: 0.5 }}
                        className="text-[10px] tracking-[0.3em] text-slate-500"
                    >
                        KAAN × ANKA-3 UCAV
                    </motion.p>
                </div>
            </div>

            <div className="flex flex-col gap-2 sm:gap-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    <UcavPanelConnected
                        callsign="UCAV-1"
                        designation="ANKA-3 ALPHA"
                        role="STRIKE"
                        index={0}
                        unit="alpha"
                    />
                    <UcavPanelConnected
                        callsign="UCAV-2"
                        designation="ANKA-3 BRAVO"
                        role="ELECTRONIC WARFARE"
                        index={1}
                        unit="bravo"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2, duration: 0.6 }}
                    className="flex flex-col items-center gap-1"
                >
                    <span className="text-[9px] tracking-[0.3em] text-slate-600">
                        SCROLL TO BRIEF
                    </span>
                    <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <ChevronDown className="h-4 w-4 text-neon-blue/40" />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
