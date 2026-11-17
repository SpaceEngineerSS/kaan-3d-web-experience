"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/context/LanguageContext";
import { LAD_PAGES, s03Copy, type LadPage } from "@/content/terminal";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";
import { terminal } from "@/lib/terminal/state";

/*
 * Representative wide-area display drawn in thin SVG (stroke 1). KAAN's real pages are unpublished.
 * Track frames follow MIL-STD-2525 air symbols: friend = semicircle, hostile = chevron (top half of a
 * diamond), unknown = quatrefoil (top half). Colours keep their cockpit meaning.
 */

const W = 800;
const H = 480;
const CX = 400;
const CY = 230;
const PX_PER_DEG = 9;
const LINE = "rgba(236,239,244,0.62)";
const DIM = "rgba(236,239,244,0.28)";
const HMD = "var(--color-hmd)";
const BURN = "var(--color-burn)";
const CAUTION = "var(--color-caution)";
const MONO = { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" } as const;

/* MIL-STD-2525 air frames, centred on 0,0. */
const FRIEND = "M-8 3A8 8 0 0 1 8 3";
const HOSTILE = "M-8 3L0-6L8 3";
const UNKNOWN = "M-9 3A4.5 4.5 0 0 1-4.5-2.5A4.5 4.5 0 0 1 4.5-2.5A4.5 4.5 0 0 1 9 3";

function Track({ x, y, kind, label }: { x: number; y: number; kind: "friend" | "hostile" | "unknown"; label?: string }) {
    const d = kind === "friend" ? FRIEND : kind === "hostile" ? HOSTILE : UNKNOWN;
    const stroke = kind === "friend" ? LINE : kind === "hostile" ? BURN : CAUTION;
    return (
        <g transform={`translate(${x} ${y})`}>
            <path d={d} stroke={stroke} />
            <path d="M0 3V9" stroke={stroke} />
            {label && (
                <text x={12} y={-2} fill={stroke} style={MONO}>
                    {label}
                </text>
            )}
        </g>
    );
}

/** Arc from −60° to +60° around (ox, oy) with radius r (0° = straight up). */
function arc(ox: number, oy: number, r: number, a0 = -60, a1 = 60) {
    const p = (a: number) => {
        const t = (a * Math.PI) / 180;
        return `${(ox + Math.sin(t) * r).toFixed(1)} ${(oy - Math.cos(t) * r).toFixed(1)}`;
    };
    return `M${p(a0)}A${r} ${r} 0 0 1 ${p(a1)}`;
}

function PageRdr({ ring, lock, warn }: { ring: string; lock: string; warn: string }) {
    const ox = CX;
    const oy = H - 26;
    return (
        <g>
            <path d={arc(ox, oy, 170)} stroke={DIM} />
            <path d={arc(ox, oy, 330)} stroke={LINE} strokeDasharray="4 5" />
            {[-60, -30, 0, 30, 60].map((a) => {
                const t = (a * Math.PI) / 180;
                return <path key={a} d={`M${ox} ${oy}L${ox + Math.sin(t) * 330} ${oy - Math.cos(t) * 330}`} stroke={DIM} strokeDasharray={a === 0 ? undefined : "2 6"} />;
            })}
            <text x={ox - Math.sin(0.56) * 334 - 6} y={oy - Math.cos(0.56) * 334} fill="var(--color-muted)" textAnchor="end" style={MONO}>
                {ring}
            </text>
            <path d={`M${ox - 7} ${oy + 6}L${ox} ${oy - 6}L${ox + 7} ${oy + 6}Z`} stroke={HMD} />
            <Track x={300} y={262} kind="friend" label="F-02" />
            <Track x={548} y={300} kind="unknown" label="U-07" />
            <Track x={612} y={214} kind="hostile" label="H-11" />
            {/* locked hostile */}
            <path d={`M${ox} ${oy - 8}L466 196`} stroke={HMD} strokeDasharray="3 4" />
            <Track x={470} y={190} kind="hostile" />
            <path d="M456 176h6M456 176v6M484 176h-6M484 176v6M456 204h6M456 204v-6M484 204h-6M484 204v-6" stroke={HMD} />
            <text x={490} y={180} fill={HMD} style={MONO}>
                {lock}
            </text>
            <text x={490} y={194} fill={HMD} style={MONO}>
                H-04 · ASP 160
            </text>
            <text x={W - 24} y={32} fill={BURN} textAnchor="end" style={MONO}>
                {warn}
            </text>
        </g>
    );
}

function PageTsd() {
    const ox = CX;
    const oy = 290;
    return (
        <g>
            <circle cx={ox} cy={oy} r={90} stroke={DIM} />
            <circle cx={ox} cy={oy} r={170} stroke={DIM} strokeDasharray="2 6" />
            <path d={`M${ox} ${oy - 182}V${oy - 170}`} stroke={LINE} />
            <text x={ox} y={oy - 188} fill="var(--color-muted)" textAnchor="middle" style={MONO}>
                N
            </text>
            <polyline points={`${ox},${oy} 470,200 560,170 640,230`} stroke={LINE} strokeDasharray="5 4" />
            {[
                [470, 200],
                [560, 170],
                [640, 230],
            ].map(([x, y], i) => (
                <g key={i}>
                    <rect x={x - 4} y={y - 4} width={8} height={8} stroke={LINE} />
                    <text x={x + 8} y={y - 6} fill="var(--color-muted)" style={MONO}>{`WP${i + 1}`}</text>
                </g>
            ))}
            <path d={`M${ox - 7} ${oy + 6}L${ox} ${oy - 8}L${ox + 7} ${oy + 6}Z`} stroke={HMD} />
            <Track x={330} y={250} kind="friend" label="F-02" />
            <Track x={520} y={330} kind="unknown" label="U-07" />
            <Track x={600} y={150} kind="hostile" label="H-04" />
        </g>
    );
}

function PageSms() {
    const st = [
        { x: 310, label: "BVR" },
        { x: 341, label: "SOM-J" },
        { x: 372, label: "BVR" },
        { x: 428, label: "BVR" },
        { x: 459, label: "SOM-J" },
        { x: 490, label: "BVR" },
    ];
    return (
        <g>
            <rect x={286} y={190} width={110} height={110} stroke={LINE} />
            <rect x={404} y={190} width={110} height={110} stroke={LINE} />
            <rect x={240} y={220} width={30} height={50} stroke={DIM} />
            <rect x={530} y={220} width={30} height={50} stroke={DIM} />
            {st.map((s, i) => (
                <g key={i}>
                    <path d={`M${s.x} 205V285`} stroke={i === 0 ? HMD : LINE} />
                    <text x={s.x} y={316} fill="var(--color-muted)" textAnchor="middle" style={{ ...MONO, fontSize: 8 }}>
                        {s.label}
                    </text>
                </g>
            ))}
            <text x={255} y={290} fill="var(--color-muted)" textAnchor="middle" style={{ ...MONO, fontSize: 9 }}>
                WVR
            </text>
            <text x={545} y={290} fill="var(--color-muted)" textAnchor="middle" style={{ ...MONO, fontSize: 9 }}>
                WVR
            </text>
            <text x={CX} y={176} fill="var(--color-muted)" textAnchor="middle" style={MONO}>
                BAY L · BAY R · NOTIONAL
            </text>
            <text x={CX} y={346} fill={HMD} textAnchor="middle" style={MONO}>
                MASTER ARM · SAFE
            </text>
        </g>
    );
}

function Gauge({ x, label, v }: { x: number; label: string; v: number }) {
    const h = 150;
    return (
        <g>
            <rect x={x} y={180} width={22} height={h} stroke={LINE} />
            <rect x={x + 4} y={180 + h * (1 - v)} width={14} height={h * v - 4} fill="rgba(236,239,244,0.16)" />
            <text x={x + 11} y={348} fill="var(--color-muted)" textAnchor="middle" style={{ ...MONO, fontSize: 9 }}>
                {label}
            </text>
        </g>
    );
}

function PageEng() {
    return (
        <g>
            <Gauge x={290} label="N2 L" v={0.86} />
            <Gauge x={330} label="N2 R" v={0.85} />
            <Gauge x={448} label="EGT L" v={0.72} />
            <Gauge x={488} label="EGT R" v={0.73} />
            <text x={CX} y={170} fill="var(--color-muted)" textAnchor="middle" style={MONO}>
                F110-GE-129 × 2
            </text>
            <text x={CX} y={368} fill="var(--color-muted)" textAnchor="middle" style={MONO}>
                NOZ · AB OFF
            </text>
        </g>
    );
}

function PageFuel() {
    return (
        <g>
            <rect x={340} y={170} width={120} height={50} stroke={LINE} />
            <rect x={340} y={226} width={120} height={60} stroke={LINE} />
            <path d="M336 240L240 290V306L336 296Z" stroke={DIM} />
            <path d="M464 240L560 290V306L464 296Z" stroke={DIM} />
            <rect x={344} y={196} width={112} height={20} fill="rgba(236,239,244,0.14)" />
            <rect x={344} y={244} width={112} height={38} fill="rgba(236,239,244,0.14)" />
            <text x={CX} y={330} fill="var(--color-muted)" textAnchor="middle" style={MONO}>
                TOTAL ··· · BINGO ···
            </text>
            <text x={CX} y={346} fill="var(--color-faint)" textAnchor="middle" style={{ ...MONO, fontSize: 9 }}>
                CAPACITY UNPUBLISHED
            </text>
        </g>
    );
}

function PageFcs() {
    return (
        <g>
            <path d="M400 150L420 230L540 290V306L420 300L410 340H390L380 300L260 306V290L380 230Z" stroke={DIM} />
            {[
                [300, 300, 340, 300],
                [460, 300, 500, 300],
                [378, 340, 392, 340],
                [408, 340, 422, 340],
            ].map(([x1, y1, x2, y2], i) => (
                <path key={i} d={`M${x1} ${y1 + 4}L${x2} ${y2 + 4}`} stroke={HMD} />
            ))}
            <text x={CX} y={370} fill="var(--color-muted)" textAnchor="middle" style={MONO}>
                FBW · CH A B C D · OK
            </text>
        </g>
    );
}

/** 03 // Cockpit & avionics: first-person canopy view with a representative wide-area display. */
export function S03() {
    const t = useT();
    const c = t(s03Copy);
    const { reducedMotion } = useDeviceProfile();
    const [page, setPage] = useState<LadPage>("RDR");
    const section = useRef<HTMLElement>(null);
    const ladder = useRef<SVGGElement>(null);
    const alt = useRef<SVGTSpanElement>(null);
    const mach = useRef<SVGTSpanElement>(null);
    const hdg = useRef<SVGTextElement>(null);
    const g = useRef<SVGTSpanElement>(null);

    useEffect(() => {
        const el = section.current;
        if (!el) return;
        let raf = 0;
        let visible = false;
        let pitch = 0;
        let roll = 0;
        const t0 = performance.now();

        const tick = (now: number) => {
            raf = 0;
            if (!visible || document.hidden) return;
            raf = requestAnimationFrame(tick);
            const s = reducedMotion ? 0 : (now - t0) / 1000;
            // Mouse parallax: the pointer pitches and rolls the ladder (smoothed).
            const tp = -terminal.py * 6 + Math.sin(s * 0.31) * 0.8;
            const tr = terminal.px * 10 + Math.sin(s * 0.23) * 1.6;
            pitch += (tp - pitch) * 0.08;
            roll += (tr - roll) * 0.08;
            ladder.current?.setAttribute("transform", `translate(${CX} ${CY}) rotate(${(-roll).toFixed(2)}) translate(0 ${(pitch * PX_PER_DEG).toFixed(1)})`);
            const a = 24.6 + pitch * 0.05 + Math.sin(s * 0.17) * 0.25;
            const m = 0.92 + Math.sin(s * 0.13) * 0.02 - pitch * 0.002;
            if (alt.current) alt.current.textContent = a.toFixed(1);
            if (mach.current) mach.current.textContent = m.toFixed(2);
            if (hdg.current) hdg.current.textContent = String(Math.round((87 + roll * 0.6 + 360) % 360)).padStart(3, "0");
            if (g.current) g.current.textContent = (1 + Math.abs(roll) * 0.03).toFixed(1);
        };
        const start = () => {
            if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick);
        };
        const io = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting;
            if (visible) start();
            else if (raf) {
                cancelAnimationFrame(raf);
                raf = 0;
            }
        });
        io.observe(el);
        document.addEventListener("visibilitychange", start);
        return () => {
            if (raf) cancelAnimationFrame(raf);
            io.disconnect();
            document.removeEventListener("visibilitychange", start);
        };
    }, [reducedMotion]);

    const rungs = [];
    for (let deg = -20; deg <= 20; deg += 5) {
        const y = -deg * PX_PER_DEG;
        if (deg === 0) {
            rungs.push(<path key={deg} d={`M-230 0H-40M40 0H230`} stroke={LINE} />);
            continue;
        }
        const tick = deg > 0 ? 6 : -6;
        rungs.push(
            <g key={deg}>
                <path d={`M-90 ${y}H-34V${y + tick}M90 ${y}H34V${y + tick}`} stroke={DIM} strokeDasharray={deg < 0 ? "6 4" : undefined} />
                <text x={-98} y={y + 3} fill="var(--color-faint)" textAnchor="end" style={{ ...MONO, fontSize: 9 }}>
                    {Math.abs(deg)}
                </text>
                <text x={98} y={y + 3} fill="var(--color-faint)" style={{ ...MONO, fontSize: 9 }}>
                    {Math.abs(deg)}
                </text>
            </g>,
        );
    }

    return (
        <section ref={section} id="s03" aria-labelledby="s03-title" className="pointer-events-none relative min-h-[150svh]">
            <div className="min-h-[100svh] md:sticky md:top-0 md:h-[100svh]">
                <div className="wrap grid min-h-[100svh] grid-cols-12 grid-rows-[auto_1fr_auto] gap-x-6 gap-y-4 pb-14 pt-20 sm:pb-16 sm:pt-24 md:h-full md:min-h-0">
                    <header className="col-span-12 md:col-span-6">
                        <p className="t-tele mb-3 text-fg-2">{c.index}</p>
                        <h2 id="s03-title" className="t-h2 text-fg">
                            {c.title}
                        </h2>
                    </header>

                    <div className="col-span-12 flex min-h-0 flex-col justify-center lg:col-span-10 lg:col-start-2">
                        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={c.svgLabel} className="mx-auto max-h-[52svh] w-full" fill="none" strokeWidth={1} data-overlay>
                            <defs>
                                <clipPath id="s03-ladder-clip">
                                    <rect x={CX - 260} y={40} width={520} height={H - 90} />
                                </clipPath>
                            </defs>
                            {/* display frame */}
                            <path d={`M0.5 12V0.5H12M${W - 12} 0.5H${W - 0.5}V12M${W - 0.5} ${H - 12}V${H - 0.5}H${W - 12}M12 ${H - 0.5}H0.5V${H - 12}`} stroke={LINE} />
                            <path d={`M0.5 0.5H${W - 0.5}V${H - 0.5}H0.5Z`} stroke="var(--color-edge)" />

                            <g clipPath="url(#s03-ladder-clip)">
                                <g ref={ladder} transform={`translate(${CX} ${CY})`}>
                                    {rungs}
                                </g>
                            </g>

                            {page === "RDR" && <PageRdr ring={c.ring} lock={c.lock} warn={c.warn} />}
                            {page === "TSD" && <PageTsd />}
                            {page === "SMS" && <PageSms />}
                            {page === "ENG" && <PageEng />}
                            {page === "FUEL" && <PageFuel />}
                            {page === "FCS" && <PageFcs />}

                            {/* waterline */}
                            <path d={`M${CX - 20} ${CY}H${CX - 9}L${CX - 4.5} ${CY + 6}L${CX} ${CY}L${CX + 4.5} ${CY + 6}L${CX + 9} ${CY}H${CX + 20}`} stroke={HMD} />

                            {/* data blocks */}
                            <text ref={hdg} x={CX} y={30} fill="var(--color-fg)" textAnchor="middle" style={{ ...MONO, fontSize: 12 }}>
                                087
                            </text>
                            <path d={`M${CX - 22} 36H${CX + 22}`} stroke={DIM} />
                            <g style={{ ...MONO, fontSize: 12 }}>
                                <text x={24} y={CY - 18} fill="var(--color-muted)" style={{ ...MONO, fontSize: 9 }}>
                                    MACH
                                </text>
                                <text x={24} y={CY} fill={HMD}>
                                    M <tspan ref={mach}>0.92</tspan>
                                </text>
                                <text x={24} y={CY + 20} fill="var(--color-fg-2)">
                                    G <tspan ref={g}>1.0</tspan>
                                </text>
                                <text x={W - 24} y={CY - 18} fill="var(--color-muted)" textAnchor="end" style={{ ...MONO, fontSize: 9 }}>
                                    ALT × 1000 FT
                                </text>
                                <text x={W - 24} y={CY} fill="var(--color-fg)" textAnchor="end">
                                    <tspan ref={alt}>24.6</tspan>
                                </text>
                                <text x={W - 24} y={CY + 20} fill="var(--color-fg-2)" textAnchor="end">
                                    BARO
                                </text>
                            </g>
                            <text x={24} y={H - 16} fill="var(--color-faint)" style={{ ...MONO, fontSize: 9 }}>
                                {`WAD // ${page} // REPRESENTATIVE`}
                            </text>
                        </svg>

                        <div role="group" aria-label={c.pagesLabel} className="pointer-events-auto mx-auto mt-2 flex flex-wrap justify-center gap-x-3">
                            {LAD_PAGES.map((p) => (
                                <button key={p} type="button" className="toggle" aria-pressed={page === p} data-live={page === p} title={c.pageNames[p]} onClick={() => setPage(p)}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-12 border-t border-edge pt-2 md:col-span-7 lg:col-span-5">
                        <p className="t-tele m-0 normal-case tracking-[0.04em] text-fg-2">{c.tulgar}</p>
                        <p className="t-tele m-0 mt-1 normal-case tracking-[0.04em] text-faint">{c.honest}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
