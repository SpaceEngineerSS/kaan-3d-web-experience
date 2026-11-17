"use client";

import { useT } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { stealthCopy } from "@/content/stealth";

/* ── Notional plan-view geometry (metres; x to the right, y aft, nose at y = 0) ──
 * Right half only, mirrored for the left. Wing and tail leading edges share one sweep,
 * trailing edges share another, which is the point of the drawing. */
const SWEEP = 42; // degrees, notional
const k = Math.tan((SWEEP * Math.PI) / 180);

type Kind = "le" | "te" | "other";
interface Pt {
    x: number;
    y: number;
}

const HALF: Pt[] = [
    { x: 0, y: 0 },
    { x: 1.3, y: 4.6 },
    { x: 2.1, y: 8.6 },
    { x: 7.0, y: 8.6 + 4.9 * k },
    { x: 7.0, y: 9.6 + 4.9 * k },
    { x: 3.4, y: 9.6 + 4.9 * k + 3.6 * k },
    { x: 5.2, y: 9.6 + 4.9 * k + 5.4 * k },
    { x: 5.2, y: 19.0 },
    { x: 3.0, y: 19.0 + 2.2 * k },
    { x: 0, y: 19.0 + 2.2 * k },
];

/** Edge index → kind (index i is the edge from HALF[i] to HALF[i + 1]). */
const KIND: Kind[] = ["other", "other", "le", "other", "te", "le", "other", "te", "other"];

interface Edge {
    a: Pt;
    b: Pt;
    kind: Kind;
    len: number;
    /** Azimuth (deg, 0 = nose, clockwise) from which a radar sees this edge face-on. */
    az: number;
}

/** The right half runs nose to tail, so the outward normal of each edge is (dy, -dx); the left half mirrors it. */
function buildEdges(): Edge[] {
    const out: Edge[] = [];
    for (const m of [1, -1]) {
        for (let i = 0; i < HALF.length - 1; i++) {
            const a = { x: HALF[i].x * m, y: HALF[i].y };
            const b = { x: HALF[i + 1].x * m, y: HALF[i + 1].y };
            const dx = HALF[i + 1].x - HALF[i].x;
            const dy = HALF[i + 1].y - HALF[i].y;
            const len = Math.hypot(dx, dy);
            const nx = (dy / len) * m;
            const ny = -dx / len;
            const az = ((Math.atan2(nx, -ny) * 180) / Math.PI + 360) % 360;
            out.push({ a, b, kind: KIND[i], len, az });
        }
    }
    return out;
}

const EDGES = buildEdges();

/** Notional return vs azimuth: narrow lobes at each edge normal, weighted by edge length, on a low floor. */
function notionalReturn(az: number) {
    let r = 0.08;
    for (const e of EDGES) {
        let d = Math.abs(az - e.az);
        if (d > 180) d = 360 - d;
        r += (e.len / 8) * Math.exp(-((d / 2.2) ** 2));
    }
    return Math.min(r, 1);
}

const R0 = 150; // polar plot radius (px)
const POLAR_PATH = (() => {
    const pts: string[] = [];
    for (let a = 0; a <= 360; a += 0.5) {
        const r = Math.sqrt(notionalReturn(a)) * R0; // sqrt keeps the floor visible
        const t = (a * Math.PI) / 180;
        pts.push(`${(Math.sin(t) * r).toFixed(1)},${(-Math.cos(t) * r).toFixed(1)}`);
    }
    return `M ${pts.join(" L ")} Z`;
})();

const LOBES = EDGES.filter((e) => e.kind !== "other").map((e) => ({ az: e.az, kind: e.kind }));

const strokeFor = (kind: Kind) => (kind === "le" ? "var(--color-signal)" : kind === "te" ? "var(--color-fg)" : "var(--color-airframe)");

export function Stealth() {
    const t = useT();
    const c = t(stealthCopy);

    return (
        <Chapter id="stealth" index={4} label={c.label} title={c.title} lede={c.lede} solid>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                <figure className="lg:col-span-5" data-reveal>
                    <figcaption className="t-label">{c.planTitle}</figcaption>
                    <PlanView legend={{ le: c.legendLe, te: c.legendTe, other: c.legendOther }} />
                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{c.planCaption}</p>
                </figure>
                <figure className="lg:col-span-5 lg:col-start-7" data-reveal>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <figcaption className="t-label">{c.polarTitle}</figcaption>
                        <span className="t-label text-signal">{c.illustrative}</span>
                    </div>
                    <PolarPlot nose={c.nose} tail={c.tail} label={`${c.polarTitle}. ${c.illustrative}.`} />
                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{c.polarCaption}</p>
                </figure>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-12">
                <h3 className="t-h3 md:col-span-3 lg:col-span-2" data-reveal>
                    {c.featuresTitle}
                </h3>
                <ol className="md:col-span-9 lg:col-span-8">
                    {c.features.map((f) => (
                        <li key={f.id} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-line py-5 md:grid-cols-[2.5rem_14rem_1fr]" data-reveal>
                            <span className="t-data text-sm text-muted">{String(f.mark).padStart(2, "0")}</span>
                            <span className="font-medium text-fg">{f.title}</span>
                            <p className="t-body col-start-2 mt-2 md:col-start-3 md:mt-0">{f.body}</p>
                        </li>
                    ))}
                </ol>
            </div>
            <SourceNote>{c.source}</SourceNote>
        </Chapter>
    );
}

/** Plan-view outline on grid paper with each edge coloured by alignment group and feature numbers. */
function PlanView({ legend }: { legend: Record<Kind, string> }) {
    const s = 19; // px per metre
    const W = 400;
    const H = 470;
    const ox = W / 2;
    const oy = 24;
    const X = (x: number) => ox + x * s;
    const Y = (y: number) => oy + y * s;

    // Feature markers (numbers match the list): planform, bays, intakes, coatings, canopy.
    const marks = [
        { n: 1, x: 5.0, y: 10.4, lx: 8.6, ly: 9.2 },
        { n: 2, x: 0, y: 12.2, lx: -8.6, ly: 13.6 },
        { n: 3, x: 1.5, y: 6.6, lx: 6.4, ly: 4.8 },
        { n: 4, x: -4.5, y: 11.6, lx: -8.6, ly: 9.2 },
        { n: 5, x: 0, y: 3.4, lx: -6.4, ly: 2.6 },
    ];

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full border border-line bg-ground-2" role="img" aria-label={`${legend.le}, ${legend.te}`}>
            <defs>
                <pattern id="stealth-grid" width={s} height={s} patternUnits="userSpaceOnUse" x={ox} y={oy}>
                    <path d={`M ${s} 0 L 0 0 0 ${s}`} fill="none" stroke="var(--color-line)" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width={W} height={H} fill="url(#stealth-grid)" opacity="0.6" />
            {/* centreline */}
            <line x1={ox} y1={oy - 12} x2={ox} y2={Y(21) + 12} stroke="var(--color-line-strong)" strokeDasharray="10 3 2 3" />

            {/* fill */}
            <path
                d={`M ${[...HALF, ...HALF.slice(1, -1).reverse().map((p) => ({ x: -p.x, y: p.y }))].map((p) => `${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join(" L ")} Z`}
                fill="var(--color-surface)"
            />
            {/* canopy, bay, intakes as simple shapes */}
            <ellipse cx={ox} cy={Y(3.6)} rx={0.55 * s} ry={1.6 * s} fill="none" stroke="var(--color-airframe)" strokeWidth="0.75" />
            <path d={`M ${X(-0.9)},${Y(10.4)} L ${X(0.9)},${Y(10.4)} L ${X(0.9)},${Y(14.2)} L ${X(-0.9)},${Y(14.2)} Z`} fill="none" stroke="var(--color-airframe)" strokeWidth="0.75" strokeDasharray="3 2" />
            {[1, -1].map((m) => (
                <path
                    key={m}
                    d={`M ${X(1.55 * m)},${Y(6.4)} C ${X(1.6 * m)},${Y(8.6)} ${X(0.6 * m)},${Y(9.8)} ${X(0.5 * m)},${Y(12.6)}`}
                    fill="none"
                    stroke="var(--color-airframe)"
                    strokeWidth="0.75"
                    strokeDasharray="3 2"
                />
            ))}

            {/* edges by kind */}
            {EDGES.map((e, i) => (
                <line
                    key={i}
                    x1={X(e.a.x)}
                    y1={Y(e.a.y)}
                    x2={X(e.b.x)}
                    y2={Y(e.b.y)}
                    stroke={strokeFor(e.kind)}
                    strokeWidth={e.kind === "other" ? 1 : 1.6}
                    strokeLinecap="round"
                />
            ))}

            {/* sweep angle dimension on the right wing */}
            <g stroke="var(--color-muted)" fill="none" strokeWidth="0.75">
                <line x1={X(2.1)} y1={Y(8.6)} x2={X(5.4)} y2={Y(8.6)} strokeDasharray="2 2" />
                <path d={`M ${X(4.2)},${Y(8.6)} A ${2.1 * s} ${2.1 * s} 0 0 1 ${X(2.1 + 2.1 * Math.cos((SWEEP * Math.PI) / 180))},${Y(8.6 + 2.1 * Math.sin((SWEEP * Math.PI) / 180))}`} />
            </g>
            <text x={X(4.5)} y={Y(9.9)} fill="var(--color-muted)" fontFamily="var(--font-mono)" fontSize="11">
                {SWEEP}°
            </text>

            {/* feature markers */}
            <g fontFamily="var(--font-mono)" fontSize="11">
                {marks.map((m) => (
                    <g key={m.n}>
                        <line x1={X(m.x)} y1={Y(m.y)} x2={X(m.lx)} y2={Y(m.ly)} stroke="var(--color-muted)" strokeWidth="0.75" />
                        <circle cx={X(m.x)} cy={Y(m.y)} r="2" fill="var(--color-fg)" />
                        <circle cx={X(m.lx)} cy={Y(m.ly)} r="9" fill="var(--color-ground-2)" stroke="var(--color-line-strong)" />
                        <text x={X(m.lx)} y={Y(m.ly) + 4} textAnchor="middle" fill="var(--color-fg)">
                            {m.n}
                        </text>
                    </g>
                ))}
            </g>

            {/* legend */}
            <g fontFamily="var(--font-mono)" fontSize="11">
                {(["le", "te", "other"] as Kind[]).map((kind, i) => (
                    <g key={kind} transform={`translate(14 ${24 + i * 17})`}>
                        <line x1="0" y1="-4" x2="16" y2="-4" stroke={strokeFor(kind)} strokeWidth={kind === "other" ? 1 : 1.6} />
                        <text x="24" y="0" fill="var(--color-fg-2)">
                            {legend[kind]}
                        </text>
                    </g>
                ))}
            </g>
        </svg>
    );
}

/** Polar plot of the notional return pattern. */
function PolarPlot({ nose, tail, label }: { nose: string; tail: string; label: string }) {
    const W = 400;
    const H = 400;
    const c = W / 2;
    const rings = [0.25, 0.5, 0.75, 1];

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full border border-line bg-ground-2" role="img" aria-label={label}>
            <g transform={`translate(${c} ${c})`}>
                {rings.map((r) => (
                    <circle key={r} r={R0 * r} fill="none" stroke="var(--color-line)" strokeWidth="0.75" />
                ))}
                {Array.from({ length: 12 }, (_, i) => i * 30).map((a) => {
                    const t = (a * Math.PI) / 180;
                    return (
                        <line
                            key={a}
                            x1={0}
                            y1={0}
                            x2={(Math.sin(t) * R0).toFixed(1)}
                            y2={(-Math.cos(t) * R0).toFixed(1)}
                            stroke="var(--color-line)"
                            strokeWidth="0.5"
                        />
                    );
                })}
                {/* lobe direction ticks outside the ring */}
                {LOBES.map((l, i) => {
                    const t = (l.az * Math.PI) / 180;
                    return (
                        <line
                            key={i}
                            x1={(Math.sin(t) * (R0 + 6)).toFixed(1)}
                            y1={(-Math.cos(t) * (R0 + 6)).toFixed(1)}
                            x2={(Math.sin(t) * (R0 + 16)).toFixed(1)}
                            y2={(-Math.cos(t) * (R0 + 16)).toFixed(1)}
                            stroke={strokeFor(l.kind)}
                            strokeWidth="1.5"
                        />
                    );
                })}
                <path d={POLAR_PATH} fill="var(--color-signal-soft)" stroke="var(--color-fg-2)" strokeWidth="1" strokeLinejoin="round" />
                {/* nose-on sector */}
                <path d={`M 0 0 L ${(Math.sin(-0.26) * R0).toFixed(1)} ${(-Math.cos(-0.26) * R0).toFixed(1)} A ${R0} ${R0} 0 0 1 ${(Math.sin(0.26) * R0).toFixed(1)} ${(-Math.cos(0.26) * R0).toFixed(1)} Z`} fill="none" stroke="var(--color-muted)" strokeDasharray="2 3" strokeWidth="0.75" />
            </g>
            <g fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-muted)">
                <text x={c} y={c - R0 - 22} textAnchor="middle">{nose}</text>
                <text x={c} y={c + R0 + 32} textAnchor="middle">{tail}</text>
                <text x={c + R0 + 22} y={c + 4}>90°</text>
                <text x={c - R0 - 22} y={c + 4} textAnchor="end">270°</text>
            </g>
        </svg>
    );
}
