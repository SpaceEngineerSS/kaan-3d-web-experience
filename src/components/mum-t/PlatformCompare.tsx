"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plane, Target } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

interface SpecRow {
    label: string;
    kaan: string;
    anka: string;
}

const SPECS: SpecRow[] = [
    { label: "ROL", kaan: "5. Nesil Muharip", anka: "Stealth İHA" },
    { label: "KANAT AÇIKLIĞI", kaan: "14 m", anka: "12.5 m" },
    { label: "MTOW", kaan: "27,000 kg", anka: "6,500 kg" },
    { label: "MAKSİMUM HIZ", kaan: "Mach 1.8+", anka: "Mach 0.7" },
    { label: "SERVİS TAVANI", kaan: "55,000 ft", anka: "40,000 ft" },
    { label: "DAYANIKLILIK", kaan: "—", anka: "10 saat" },
    { label: "MOTOR", kaan: "2× TEI TF-10000", anka: "1× AI-322" },
    { label: "FAYDALIYÜK", kaan: "Dahili + Harici", anka: "1,200 kg" },
];

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let frame = 0;
                    const totalFrames = 40;
                    const step = target / totalFrames;
                    const animate = () => {
                        frame++;
                        setCount(Math.min(Math.round(step * frame), target));
                        if (frame < totalFrames) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return (
        <span ref={ref}>
            {count.toLocaleString()}
            {suffix}
        </span>
    );
}

function PlatformCard({
    name,
    subtitle,
    icon: Icon,
    color,
    stats,
    delay,
}: {
    name: string;
    subtitle: string;
    icon: typeof Plane;
    color: string;
    stats: { label: string; value: number; suffix: string }[];
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay, duration: 0.5 }}
            className="rounded-xl border border-cyan-500/10 p-6"
            style={{
                background: "rgba(10, 10, 20, 0.6)",
                backdropFilter: "blur(12px)",
            }}
        >
            <div className="mb-5 flex items-center gap-3">
                <div
                    className="flex h-11 w-11 items-center justify-center rounded-lg border"
                    style={{
                        borderColor: `${color}25`,
                        background: `${color}08`,
                    }}
                >
                    <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">{name}</h3>
                    <p className="font-mono text-[9px] tracking-[0.2em]" style={{ color: `${color}99` }}>
                        {subtitle}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {stats.map((s) => (
                    <div
                        key={s.label}
                        className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"
                    >
                        <p className="font-mono text-[8px] tracking-[0.15em] text-slate-500">
                            {s.label}
                        </p>
                        <p className="mt-0.5 text-lg font-bold text-white">
                            <CountUp target={s.value} suffix={s.suffix} />
                        </p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

export function PlatformCompare() {
    const { locale } = useLanguage();
    const mt = useMumtT(locale);
    const SPECS: SpecRow[] = mt.specs.map((s: { label: string; kaan: string; anka: string }) => ({
        label: s.label,
        kaan: s.kaan,
        anka: s.anka,
    }));
    return (
        <section className="relative bg-cockpit-dark px-4 py-16 sm:px-6 md:px-12 md:py-24">
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center"
                >
                    <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-neon-blue/60">
                        {mt.platformCompare.tag}
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                        KAAN <span className="text-neon-blue">vs</span> ANKA-3
                    </h2>
                </motion.div>

                <div className="mb-12 grid gap-6 md:grid-cols-2">
                    <PlatformCard
                        name="KAAN"
                        subtitle="5th GEN MULTIROLE FIGHTER"
                        icon={Plane}
                        color="#00d4ff"
                        delay={0}
                        stats={[
                            { label: "MAX SPEED", value: 1.8, suffix: " Mach+" },
                            { label: "CEILING", value: 55000, suffix: " ft" },
                            { label: "MTOW", value: 27000, suffix: " kg" },
                            { label: "WINGSPAN", value: 14, suffix: " m" },
                        ]}
                    />
                    <PlatformCard
                        name="ANKA-3"
                        subtitle="STEALTH UCAV"
                        icon={Target}
                        color="#00ff88"
                        delay={0.12}
                        stats={[
                            { label: "MAX SPEED", value: 0.7, suffix: " Mach" },
                            { label: "CEILING", value: 40000, suffix: " ft" },
                            { label: "MTOW", value: 6500, suffix: " kg" },
                            { label: "ENDURANCE", value: 10, suffix: " saat" },
                        ]}
                    />
                </div>

                <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="min-w-[400px] overflow-hidden rounded-xl border border-cyan-500/10"
                        style={{
                            background: "rgba(10, 10, 20, 0.5)",
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        <div className="grid grid-cols-3 border-b border-cyan-500/10 px-3 py-2.5 sm:px-5 sm:py-3">
                            <span className="font-mono text-[8px] tracking-[0.15em] text-slate-500 sm:text-[9px] sm:tracking-[0.2em]">
                                SPEC
                            </span>
                            <span className="text-center font-mono text-[8px] tracking-[0.15em] text-neon-blue/70 sm:text-[9px] sm:tracking-[0.2em]">
                                KAAN
                            </span>
                            <span className="text-center font-mono text-[8px] tracking-[0.15em] text-hud-green/70 sm:text-[9px] sm:tracking-[0.2em]">
                                ANKA-3
                            </span>
                        </div>

                        {SPECS.map((row, i) => (
                            <motion.div
                                key={row.label}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.04, duration: 0.35 }}
                                className="grid grid-cols-3 border-b border-white/[0.03] px-3 py-2.5 transition-colors hover:bg-cyan-500/[0.03] sm:px-5 sm:py-3"
                            >
                                <span className="font-mono text-[9px] tracking-wide text-slate-400 sm:text-[10px]">
                                    {row.label}
                                </span>
                                <span className="text-center text-[11px] font-medium text-white sm:text-[13px]">
                                    {row.kaan}
                                </span>
                                <span className="text-center text-[11px] font-medium text-slate-300 sm:text-[13px]">
                                    {row.anka}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
