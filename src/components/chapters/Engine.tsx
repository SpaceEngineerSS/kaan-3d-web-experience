"use client";

import { useT } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { Film } from "@/components/site/Film";
import { engineCopy, engineMilestones } from "@/content/engine";

export function Engine() {
    const t = useT();
    const c = t(engineCopy);

    return (
        <Chapter id="engine" index={8} label={c.label} title={c.title} lede={c.lede} solid>
            {/* Now / next: two big readouts */}
            <div className="grid gap-10 md:grid-cols-2 md:gap-0">
                <div className="border-t border-edge-2 pt-5 md:pr-10" data-reveal>
                    <h3 className="t-label text-fg-2">{c.nowTitle}</h3>
                    <p className="mt-5 flex flex-wrap items-baseline gap-x-3">
                        <span className="t-num inline-block text-[clamp(3.5rem,2rem+6vw,8rem)] text-fg">
                            <span className="text-muted">2×</span>
                            {c.nowValue}
                        </span>
                    </p>
                    <p className="t-data mt-2 text-sm text-muted">{c.nowUnit}</p>
                    <p className="t-body mt-6 max-w-[52ch]">{c.nowBody}</p>
                </div>
                <div className="border-t border-hmd pt-5 md:border-l md:border-l-edge md:pl-10" data-reveal>
                    <div className="flex items-baseline justify-between gap-3">
                        <h3 className="t-label text-hmd">{c.nextTitle}</h3>
                        <span className="t-label text-caution">{c.targetNote}</span>
                    </div>
                    <p className="mt-5">
                        <span className="t-num inline-block text-[clamp(3.5rem,2rem+6vw,8rem)] text-fg-2">
                            <span className="text-faint">~</span>
                            {c.nextValue}
                        </span>
                    </p>
                    <p className="t-data mt-2 text-sm text-muted">{c.nextUnit}</p>
                    <p className="t-body mt-6 max-w-[52ch]">{c.nextBody}</p>
                </div>
            </div>

            {/* Timeline strip */}
            <div className="mt-16" data-reveal>
                <h3 className="t-label">{c.timelineTitle}</h3>
                <ol className="mt-4 grid border-t border-edge sm:grid-cols-2 lg:grid-cols-6">
                    {engineMilestones.map((m) => (
                        <li key={m.id} className="relative border-b border-edge py-4 pr-4 lg:border-b-0">
                            <span
                                aria-hidden
                                className={`absolute -top-[5px] left-0 h-[9px] w-[9px] ${m.target ? "border border-caution bg-ink" : m.engine === "tf35" ? "bg-hmd" : "bg-fg-2"}`}
                            />
                            <p className={`t-data mt-2 text-base ${m.target ? "text-caution" : "text-fg"}`}>{t(m.date)}</p>
                            <p className="t-label mt-1">{m.engine === "f110" ? "F110" : "TF35000"}</p>
                            <p className="mt-2 text-[0.9375rem] leading-snug text-fg-2">{t(m.text)}</p>
                            {m.target && <p className="t-label mt-1 text-caution">{c.targetNote}</p>}
                        </li>
                    ))}
                </ol>
            </div>

            {/* Real footage beside the drawing */}
            <div className="mt-16 grid items-start gap-10 lg:grid-cols-12">
                <div className="lg:col-span-6" data-reveal>
                    <Film name="takeoff" caption={c.filmCaption} credit="TUSAŞ görüntüleri" />
                </div>
                <figure className="lg:col-span-6" data-reveal>
                    <TurbofanDrawing labels={c.stations} />
                    <figcaption className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
                        <span className="t-label mr-2 text-fg-2">{c.drawingTitle}</span>
                        {c.drawingNote}
                    </figcaption>
                </figure>
            </div>
            <SourceNote>{c.source}</SourceNote>
        </Chapter>
    );
}

type StationLabels = (typeof engineCopy)["en"]["stations"];

/**
 * Schematic side section of a low-bypass afterburning turbofan, upper half mirrored about the centreline.
 * Original drawing; proportions are generic.
 */
function TurbofanDrawing({ labels }: { labels: StationLabels }) {
    const W = 560;
    const H = 280;
    const cy = 150; // engine axis
    const line = "var(--color-topcoat)";
    const strong = "var(--color-fg-2)";

    // x positions of station boundaries
    const S = { intake: 30, fan: 78, comp: 140, comb: 248, turb: 312, ab: 372, noz: 478, exit: 530 };

    // Mirrors a path drawn for the upper half (y measured as offset above the axis).
    const half = (pts: [number, number][]) => pts.map(([x, r]) => `${x},${cy - r}`).join(" L ");
    const halfLow = (pts: [number, number][]) => pts.map(([x, r]) => `${x},${cy + r}`).join(" L ");

    const casing: [number, number][] = [
        [S.intake, 74],
        [S.fan + 8, 76],
        [S.comb, 76],
        [S.ab, 72],
        [S.noz, 70],
        [S.exit - 12, 60],
        [S.exit, 64],
    ];
    const core: [number, number][] = [
        [S.fan + 22, 52],
        [S.comp, 46],
        [S.comb - 10, 34],
        [S.comb + 40, 34],
        [S.turb, 40],
        [S.turb + 30, 44],
    ];

    const blades = (x0: number, x1: number, n: number, rIn: (x: number) => number, rOut: (x: number) => number, w = 1) =>
        Array.from({ length: n }, (_, i) => {
            const x = x0 + ((x1 - x0) * i) / Math.max(1, n - 1);
            return (
                <g key={`${x0}-${i}`} stroke={line} strokeWidth={w}>
                    <line x1={x} y1={cy - rIn(x)} x2={x} y2={cy - rOut(x)} />
                    <line x1={x} y1={cy + rIn(x)} x2={x} y2={cy + rOut(x)} />
                </g>
            );
        });

    const lerp = (a: number, b: number, x0: number, x1: number) => (x: number) => a + ((b - a) * (x - x0)) / (x1 - x0);

    const callouts: { x: number; key: keyof StationLabels; up: boolean }[] = [
        { x: (S.intake + S.fan) / 2, key: "intake", up: true },
        { x: S.fan + 8, key: "fan", up: false },
        { x: (S.fan + 22 + S.comb - 10) / 2, key: "compressor", up: true },
        { x: (S.comb + S.turb) / 2 - 10, key: "combustor", up: false },
        { x: S.turb + 12, key: "turbine", up: true },
        { x: (S.ab + S.noz) / 2, key: "afterburner", up: false },
        { x: S.exit - 14, key: "nozzle", up: true },
    ];

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full border border-edge bg-ink-2" role="img" aria-label={Object.values(labels).join(", ")}>
            {/* axis */}
            <line x1={14} y1={cy} x2={W - 14} y2={cy} stroke="var(--color-edge-2)" strokeDasharray="10 3 2 3" />

            {/* casing */}
            <path d={`M ${half(casing)}`} fill="none" stroke={strong} strokeWidth="1.4" />
            <path d={`M ${halfLow(casing)}`} fill="none" stroke={strong} strokeWidth="1.4" />
            {/* core splitter (bypass duct inner wall) */}
            <path d={`M ${half(core)}`} fill="none" stroke={line} strokeWidth="1" />
            <path d={`M ${halfLow(core)}`} fill="none" stroke={line} strokeWidth="1" />

            {/* spinner and shaft */}
            <path d={`M ${S.fan - 18},${cy} Q ${S.fan - 10},${cy - 16} ${S.fan + 6},${cy - 16} L ${S.fan + 6},${cy + 16} Q ${S.fan - 10},${cy + 16} ${S.fan - 18},${cy} Z`} fill="var(--color-plate)" stroke={line} />
            <rect x={S.fan + 6} y={cy - 6} width={S.turb + 34 - S.fan - 6} height={12} fill="none" stroke={line} strokeWidth="0.75" />

            {/* fan: three stages */}
            {blades(S.fan, S.fan + 18, 3, () => 16, () => 72, 1.4)}
            {/* compressor: tapering stages */}
            {blades(S.fan + 32, S.comb - 18, 9, lerp(14, 22, S.fan + 32, S.comb - 18), lerp(48, 34, S.fan + 32, S.comb - 18))}
            {/* combustor liner */}
            <g fill="none" stroke={line}>
                <rect x={S.comb - 4} y={cy - 32} width={52} height={14} rx={6} />
                <rect x={S.comb - 4} y={cy + 18} width={52} height={14} rx={6} />
            </g>
            {/* turbine: HP + LP */}
            {blades(S.turb - 10, S.turb + 26, 4, lerp(14, 16, S.turb - 10, S.turb + 26), lerp(38, 44, S.turb - 10, S.turb + 26), 1.4)}
            {/* tail cone */}
            <path d={`M ${S.turb + 34},${cy - 16} L ${S.ab + 10},${cy} L ${S.turb + 34},${cy + 16}`} fill="none" stroke={line} />
            {/* afterburner flameholders and spray bars */}
            <g stroke={line} fill="none">
                {[30, 50].map((r) => (
                    <g key={r}>
                        <path d={`M ${S.ab + 18},${cy - r - 4} L ${S.ab + 10},${cy - r} L ${S.ab + 18},${cy - r + 4}`} />
                        <path d={`M ${S.ab + 18},${cy + r - 4} L ${S.ab + 10},${cy + r} L ${S.ab + 18},${cy + r + 4}`} />
                    </g>
                ))}
                <line x1={S.ab - 4} y1={cy - 62} x2={S.ab - 4} y2={cy - 20} strokeDasharray="2 3" />
                <line x1={S.ab - 4} y1={cy + 20} x2={S.ab - 4} y2={cy + 62} strokeDasharray="2 3" />
            </g>
            {/* convergent–divergent nozzle flaps */}
            <g stroke={strong} strokeWidth="1.2" fill="none">
                <path d={`M ${S.noz},${cy - 66} L ${S.exit - 12},${cy - 52} L ${S.exit},${cy - 58}`} />
                <path d={`M ${S.noz},${cy + 66} L ${S.exit - 12},${cy + 52} L ${S.exit},${cy + 58}`} />
            </g>

            {/* bypass flow arrow */}
            <g stroke="var(--color-info)" fill="none" strokeWidth="1">
                <path d={`M ${S.fan + 30},${cy - 62} L ${S.ab - 20},${cy - 62}`} />
                <path d={`M ${S.ab - 26},${cy - 65} L ${S.ab - 20},${cy - 62} L ${S.ab - 26},${cy - 59}`} />
            </g>
            <text x={(S.fan + S.ab) / 2} y={cy - 66} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-info)">
                {labels.bypass}
            </text>

            {/* station boundary ticks along the axis */}
            <g stroke="var(--color-muted)" strokeWidth="0.75">
                {Object.values(S).map((x) => (
                    <line key={x} x1={x} y1={cy - 4} x2={x} y2={cy + 4} />
                ))}
            </g>

            {/* callouts */}
            <g fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-fg)">
                {callouts.map((co) => {
                    const yText = co.up ? 30 : H - 18;
                    return (
                        <g key={co.key}>
                            <line x1={co.x} y1={co.up ? cy - 24 : cy + 24} x2={co.x} y2={co.up ? yText + 6 : yText - 14} stroke="var(--color-muted)" strokeWidth="0.75" />
                            <circle cx={co.x} cy={co.up ? cy - 24 : cy + 24} r="1.8" fill="var(--color-fg)" />
                            <text x={co.x} y={yText} textAnchor="middle">
                                {labels[co.key]}
                            </text>
                        </g>
                    );
                })}
            </g>
        </svg>
    );
}
