"use client";

import { useT } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { mission, type PlatformKey } from "@/content/mumt";

const KEYS: PlatformKey[] = ["kaan", "anka", "simsek"];

function RoleMark({ role, platform, label }: { role?: "lead" | "support"; platform: PlatformKey; label: string }) {
    if (!role) return <span className="block h-px w-4 bg-edge-2" aria-hidden />;
    const colour = platform === "kaan" ? "var(--color-accent)" : "var(--color-fg-2)";
    return (
        <span className="inline-flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                <rect x="0.5" y="0.5" width="11" height="11" fill={role === "lead" ? colour : "none"} stroke={colour} />
            </svg>
            <span className="t-label">{label}</span>
        </span>
    );
}

/** Chapter 04: a five-phase example mission as a who-does-what matrix. */
export function MissionTimeline() {
    const t = useT();
    const c = t(mission);

    return (
        <Chapter id="mission" index={4} label={c.label} title={c.title} lede={c.lede} solid className="py-24 md:py-36">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[44rem] border-collapse text-left">
                    <caption className="sr-only">{c.title}</caption>
                    <thead>
                        <tr className="t-label border-b border-edge-2">
                            <th scope="col" className="w-12 py-3 pr-4 font-normal">#</th>
                            <th scope="col" className="py-3 pr-6 font-normal">{c.colPhase}</th>
                            {KEYS.map((k) => (
                                <th key={k} scope="col" className={`w-36 py-3 pr-4 font-normal ${k === "kaan" ? "text-accent" : ""}`}>
                                    {c.platforms[k]}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {c.phases.map((p, i) => (
                            <tr key={p.title} className="border-b border-edge align-top" data-reveal>
                                <td className="t-num py-5 pr-4 text-3xl text-faint">{String(i + 1).padStart(2, "0")}</td>
                                <th scope="row" className="py-5 pr-6 font-normal">
                                    <span className="block font-medium text-fg">{p.title}</span>
                                    <span className="mt-1 block max-w-[52ch] text-[0.9375rem] leading-relaxed text-fg-2">{p.body}</span>
                                </th>
                                {KEYS.map((k) => (
                                    <td key={k} className="py-6 pr-4">
                                        <RoleMark role={p.roles[k]} platform={k} label={p.roles[k] === "lead" ? c.lead : c.support} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <SourceNote>{c.note}</SourceNote>
        </Chapter>
    );
}
