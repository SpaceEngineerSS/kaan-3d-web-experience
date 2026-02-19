"use client";

import { motion } from "framer-motion";
import {
    Grid3x3,
    ChevronLeft,
    ChevronRight,
    Zap,
    Target,
    Orbit,
} from "lucide-react";
import { useFormationState, useFormationDispatch, type FormationMode } from "./useFormation";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

const COMMANDS: {
    mode: FormationMode;
    label: string;
    icon: typeof Grid3x3;
    shortLabel: string;
}[] = [
        { mode: "FREE", label: "FREE FLIGHT", icon: Orbit, shortLabel: "FREE" },
        { mode: "FORMATION", label: "FORMATION", icon: Grid3x3, shortLabel: "FMN" },
        { mode: "BANK_LEFT", label: "BANK LEFT", icon: ChevronLeft, shortLabel: "BNK-L" },
        { mode: "BANK_RIGHT", label: "BANK RIGHT", icon: ChevronRight, shortLabel: "BNK-R" },
        { mode: "SEAD_DEPLOY", label: "SEAD DEPLOY", icon: Zap, shortLabel: "SEAD" },
        { mode: "STRIKE_RELEASE", label: "STRIKE", icon: Target, shortLabel: "STK" },
    ];

export function FormationControls() {
    const state = useFormationState();
    const dispatch = useFormationDispatch();
    const { locale } = useLanguage();
    const mt = useMumtT(locale);

    return (
        <div className="absolute bottom-48 left-1/2 z-30 w-[calc(100%-1.5rem)] -translate-x-1/2 sm:bottom-44 sm:w-auto md:bottom-52">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-1 rounded-lg px-2.5 py-2 sm:flex-nowrap sm:gap-1.5 sm:px-3"
                style={{
                    background: "rgba(2, 6, 23, 0.7)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(0, 229, 255, 0.12)",
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
                }}
            >
                <span
                    className="text-[9px] tracking-[0.2em] uppercase mr-2 hidden sm:block"
                    style={{ color: "rgba(148, 163, 184, 0.6)", fontFamily: "var(--font-mono, monospace)" }}
                >
                    {mt.formation.title}
                </span>

                {COMMANDS.map((cmd) => {
                    const active = state.mode === cmd.mode;
                    const Icon = cmd.icon;

                    return (
                        <motion.button
                            key={cmd.mode}
                            onClick={() => dispatch({ type: "SET_MODE", mode: cmd.mode })}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative flex min-h-[36px] items-center gap-1 px-2 py-1.5 rounded-md transition-colors duration-200 sm:min-h-[40px] sm:gap-1.5 sm:px-3 sm:py-2"
                            style={{
                                background: active
                                    ? "rgba(0, 229, 255, 0.12)"
                                    : "rgba(255, 255, 255, 0.03)",
                                border: active
                                    ? "1px solid rgba(0, 229, 255, 0.4)"
                                    : "1px solid rgba(255, 255, 255, 0.06)",
                                color: active ? "#00e5ff" : "rgba(148, 163, 184, 0.8)",
                                fontFamily: "var(--font-mono, monospace)",
                                cursor: "pointer",
                            }}
                        >
                            {active && (
                                <motion.div
                                    layoutId="cmd-glow"
                                    className="absolute inset-0 rounded-md"
                                    style={{
                                        background: "rgba(0, 229, 255, 0.06)",
                                        boxShadow: "0 0 12px rgba(0, 229, 255, 0.15)",
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <Icon size={13} className="relative z-10" />
                            <span className="relative z-10 text-[10px] tracking-wider uppercase hidden md:inline">
                                {cmd.label}
                            </span>
                            <span className="relative z-10 text-[9px] tracking-wider uppercase md:hidden">
                                {cmd.shortLabel}
                            </span>
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
}
