"use client";

/*
 * Representative wide-area display drawn in thin SVG (stroke 1). KAAN's real pages are unpublished.
 * Track frames follow MIL-STD-2525 air symbols: friend = semicircle, hostile = chevron (top half of a
 * diamond), unknown = quatrefoil (top half). Colours keep their cockpit meaning.
 */

export const W = 800;
export const H = 480;
export const CX = 400;
export const CY = 230;
export const PX_PER_DEG = 9;
export const LINE = "rgba(236,239,244,0.62)";
export const DIM = "rgba(236,239,244,0.28)";
export const HMD = "var(--color-hmd)";
export const BURN = "var(--color-burn)";
export const CAUTION = "var(--color-caution)";
export const MONO = { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em" } as const;

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

export function PageRdr({ ring, lock, warn }: { ring: string; lock: string; warn: string }) {
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

export function PageTsd() {
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

export function PageSms() {
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

export function PageEng() {
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

export function PageFuel() {
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

export function PageFcs() {
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
