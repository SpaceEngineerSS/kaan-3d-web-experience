"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/context/LanguageContext";
import { LAD_PAGES, s03Copy, type LadPage } from "@/content/terminal";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";
import { terminal } from "@/lib/terminal/state";
import { useSectionFade } from "@/components/terminal/useSectionFade";
import { PageRdr, PageTsd, PageSms, PageEng, PageFuel, PageFcs, W, H, CX, CY, PX_PER_DEG, LINE, DIM, HMD, MONO } from "./s03/pages";

export function S03() {
    const t = useT();
    const c = t(s03Copy);
    const { reducedMotion } = useDeviceProfile();
    const [page, setPage] = useState<LadPage>("RDR");
    const section = useRef<HTMLElement>(null);
    const ladder = useRef<SVGGElement>(null);
    const block = useRef<HTMLDivElement>(null);
    useSectionFade(section, block);
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
            <div ref={block} className="min-h-[100svh] md:sticky md:top-0 md:h-[100svh]">
                <div className="wrap grid min-h-[100svh] grid-cols-12 grid-rows-[auto_1fr_auto] gap-x-6 gap-y-4 pb-14 pt-20 sm:pb-16 md:pt-28 md:h-full md:min-h-0">
                    <header data-read className="col-span-12 md:col-span-6">
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

                        <div role="group" aria-label={c.pagesLabel} className="pointer-events-auto mx-auto mt-2 flex flex-wrap justify-center gap-x-3 border-t border-edge bg-ink px-3 py-1">
                            {LAD_PAGES.map((p) => (
                                <button key={p} type="button" className="toggle" aria-pressed={page === p} data-live={page === p} title={c.pageNames[p]} onClick={() => setPage(p)}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-12 border-t border-edge bg-ink/92 px-3 pb-2 pt-2 md:col-span-7 lg:col-span-5">
                        <p className="t-tele m-0 normal-case tracking-[0.04em] text-fg-2">{c.tulgar}</p>
                        <p className="t-tele m-0 mt-1 normal-case tracking-[0.04em] text-faint">{c.honest}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
