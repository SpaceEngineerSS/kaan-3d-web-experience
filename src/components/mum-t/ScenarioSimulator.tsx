"use client";

import { useState } from "react";
import { useT } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { scenario, scenarioGeometry, type Pos } from "@/content/mumt";
import { SegTabs } from "./SegTabs";

type ScenarioId = keyof typeof scenarioGeometry;

const S = 6; // map units → px
const TARGET: Pos = [86, 30];
const RINGS = [30, 20, 10];

function Craft({ pos, size, signal = false, label }: { pos: Pos; size: number; signal?: boolean; label?: string }) {
    return (
        <g style={{ transform: `translate(${pos[0] * S}px, ${pos[1] * S}px)`, transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)" }}>
            <path d={`M ${size} 0 L ${-size} ${-size * 0.75} L ${-size * 0.45} 0 L ${-size} ${size * 0.75} Z`} fill={signal ? "var(--color-signal)" : "var(--color-fg-2)"} />
            {label && (
                <text x={-size} y={size + 14} fontFamily="var(--font-mono)" fontSize="11" fill={signal ? "var(--color-signal)" : "var(--color-muted)"}>
                    {label}
                </text>
            )}
        </g>
    );
}

/** Chapter 05: three step-through scenarios on a schematic map. */
export function ScenarioSimulator() {
    const t = useT();
    const c = t(scenario);
    const [id, setId] = useState<ScenarioId>("sead");
    const [step, setStep] = useState(0);

    const sc = c.scenarios.find((s) => s.id === id) ?? c.scenarios[0];
    const geo = scenarioGeometry[id][step];
    const last = sc.steps.length - 1;

    const choose = (next: ScenarioId) => {
        setId(next);
        setStep(0);
    };

    return (
        <Chapter id="scenario" index={5} label={c.label} title={c.title} lede={c.lede} solid>
            <SegTabs idPrefix="scenario" label={c.label} items={c.scenarios.map((s) => ({ id: s.id, label: s.name }))} value={id} onChange={choose} />

            <div id="scenario-panel" role="tabpanel" aria-labelledby={`scenario-tab-${id}`} className="mt-8 grid gap-10 lg:grid-cols-12">
                <figure className="lg:col-span-7">
                    <svg viewBox={`0 0 ${100 * S} ${60 * S}`} className="w-full border border-line bg-ground-2" role="img" aria-label={`${c.mapLabel}: ${sc.steps[step].title}`}>
                        <defs>
                            <pattern id="scn-grid" width={S * 5} height={S * 5} patternUnits="userSpaceOnUse">
                                <path d={`M ${S * 5} 0 L 0 0 0 ${S * 5}`} fill="none" stroke="var(--color-line)" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width={100 * S} height={60 * S} fill="url(#scn-grid)" opacity="0.6" />

                        {RINGS.map((r, i) => {
                            const on = geo.rings[i];
                            return (
                                <circle
                                    key={r}
                                    cx={TARGET[0] * S}
                                    cy={TARGET[1] * S}
                                    r={r * S}
                                    fill="none"
                                    stroke={on ? "var(--color-airframe)" : "var(--color-line-strong)"}
                                    strokeDasharray={on ? "6 5" : "1 6"}
                                    strokeWidth={on ? 1.2 : 1}
                                    className="transition-[stroke] duration-500"
                                />
                            );
                        })}
                        <rect x={TARGET[0] * S - 6} y={TARGET[1] * S - 6} width="12" height="12" fill="none" stroke="var(--color-fg)" />

                        <Craft pos={geo.kaan} size={10} signal label="KAAN" />
                        <Craft pos={geo.anka1} size={8} label="ANKA-3" />
                        <Craft pos={geo.anka2} size={8} label="ANKA-3" />
                        {geo.simsek && <Craft pos={geo.simsek} size={5} />}
                    </svg>

                    <ul className="t-label mt-4 flex flex-wrap gap-x-6 gap-y-2">
                        <li className="flex items-center gap-2 text-signal">
                            <svg width="12" height="10" viewBox="-6 -5 12 10" aria-hidden><path d="M6 0 L-6 -4.5 L-2.7 0 L-6 4.5 Z" fill="currentColor" /></svg>
                            {c.legend.kaan}
                        </li>
                        <li className="flex items-center gap-2">
                            <svg width="12" height="10" viewBox="-6 -5 12 10" aria-hidden><path d="M6 0 L-6 -4.5 L-2.7 0 L-6 4.5 Z" fill="var(--color-fg-2)" /></svg>
                            {c.legend.anka}
                        </li>
                        <li className="flex items-center gap-2">
                            <svg width="8" height="8" viewBox="-4 -4 8 8" aria-hidden><path d="M4 0 L-4 -3 L-1.8 0 L-4 3 Z" fill="var(--color-fg-2)" /></svg>
                            {c.legend.simsek}
                        </li>
                        <li className="flex items-center gap-2">
                            <svg width="20" height="2" aria-hidden><line x1="0" y1="1" x2="20" y2="1" stroke="var(--color-airframe)" strokeDasharray="6 5" /></svg>
                            {c.legend.ring}
                        </li>
                        <li className="flex items-center gap-2">
                            <svg width="20" height="2" aria-hidden><line x1="0" y1="1" x2="20" y2="1" stroke="var(--color-line-strong)" strokeDasharray="1 4" /></svg>
                            {c.legend.ringOff}
                        </li>
                    </ul>
                </figure>

                <div className="lg:col-span-5">
                    <p className="t-body">{sc.summary}</p>
                    <ol className="mt-6 border-t border-line-strong">
                        {sc.steps.map((s, i) => {
                            const current = i === step;
                            return (
                                <li key={s.title} className="border-b border-line">
                                    <button
                                        type="button"
                                        onClick={() => setStep(i)}
                                        aria-current={current ? "step" : undefined}
                                        className={`grid min-h-11 w-full grid-cols-[2.5rem_1fr] gap-3 py-3 text-left transition-colors ${current ? "text-fg" : "text-muted hover:text-fg-2"}`}
                                    >
                                        <span className={`t-data text-sm ${current ? "text-signal" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
                                        <span>
                                            <span className="block font-medium">{s.title}</span>
                                            {current && <span className="mt-1 block text-[0.9375rem] leading-relaxed text-fg-2">{s.body}</span>}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button type="button" className="btn" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                            {c.prev}
                        </button>
                        {step < last ? (
                            <button type="button" className="btn" onClick={() => setStep((s) => Math.min(last, s + 1))}>
                                {c.next}
                            </button>
                        ) : (
                            <button type="button" className="btn" onClick={() => setStep(0)}>
                                {c.reset}
                            </button>
                        )}
                        <span className="t-data ml-auto text-sm text-muted" aria-live="polite">
                            {c.step} {step + 1} {c.of} {sc.steps.length}
                        </span>
                    </div>
                </div>
            </div>
            <SourceNote>{c.note}</SourceNote>
        </Chapter>
    );
}
