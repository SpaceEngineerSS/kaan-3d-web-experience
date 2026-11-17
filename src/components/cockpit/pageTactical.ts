import { C, line, ownShip, pad3, pageChrome, text, type DrawPage, type Frame } from "./draw";

type Kind = "wingman" | "unknown" | "hostile";

/** Simulated tracks: bearing relative to the nose (deg), range (nm), altitude (thousands of ft). */
const TRACKS: { id: string; kind: Kind; rel: number; rng: number; alt: number }[] = [
    { id: "K2", kind: "wingman", rel: -28, rng: 9, alt: 24 },
    { id: "T1", kind: "hostile", rel: 14, rng: 46, alt: 31 },
    { id: "T2", kind: "hostile", rel: 22, rng: 52, alt: 29 },
    { id: "U1", kind: "unknown", rel: -48, rng: 34, alt: 18 },
    { id: "U2", kind: "unknown", rel: 55, rng: 27, alt: 12 },
];

const MAX_NM = 60;

function symbol(ctx: CanvasRenderingContext2D, kind: Kind, x: number, y: number) {
    const s = 7;
    ctx.beginPath();
    ctx.setLineDash([]);
    if (kind === "wingman") {
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.strokeStyle = C.fg2;
        ctx.lineWidth = 1.5;
    } else if (kind === "hostile") {
        ctx.moveTo(x, y - s - 1);
        ctx.lineTo(x + s + 1, y);
        ctx.lineTo(x, y + s + 1);
        ctx.lineTo(x - s - 1, y);
        ctx.closePath();
        ctx.strokeStyle = C.fg;
        ctx.lineWidth = 1.75;
    } else {
        ctx.rect(x - s + 1, y - s + 1, (s - 1) * 2, (s - 1) * 2);
        ctx.strokeStyle = C.airframe;
        ctx.lineWidth = 1.25;
        ctx.setLineDash([3, 2]);
    }
    ctx.stroke();
    ctx.setLineDash([]);
}

function trackState(t: number, i: number) {
    const tr = TRACKS[i];
    return {
        ...tr,
        rel: tr.rel + Math.sin(t * 0.08 + i * 1.7) * 3,
        rng: tr.rng - ((t * 0.12 + i * 3) % 6) + 3,
    };
}

export const drawTactical: DrawPage = (f: Frame) => {
    const { ctx, w, h, t, labels } = f;
    const L = labels.tsd;
    const wide = w / h > 1.5;
    pageChrome(f, L.title);

    const heading = 274 + Math.sin(t * 0.05) * 4;

    // Map area and table area.
    const map = wide ? { x: 16, y: 40, w: w * 0.6 - 24, h: h - 56 } : { x: 16, y: 40, w: w - 32, h: h * 0.5 - 40 };
    const tab = wide ? { x: w * 0.6 + 16, y: 56, w: w * 0.4 - 32, h: h - 72 } : { x: 16, y: h * 0.5 + 16, w: w - 32, h: h * 0.5 - 24 };

    const ox = map.x + map.w / 2;
    const oy = map.y + map.h * 0.86;
    const R = Math.min(map.w / 2 - 12, map.h * 0.8);
    const toXY = (rel: number, rng: number) => {
        const a = (rel * Math.PI) / 180;
        const r = (rng / MAX_NM) * R;
        return [ox + Math.sin(a) * r, oy - Math.cos(a) * r] as const;
    };

    ctx.save();
    ctx.beginPath();
    ctx.rect(map.x, map.y, map.w, map.h);
    ctx.clip();

    // Range arcs and labels.
    for (let i = 1; i <= 3; i++) {
        const r = (R / 3) * i;
        ctx.beginPath();
        ctx.arc(ox, oy, r, Math.PI * 1.1, Math.PI * 1.9);
        ctx.strokeStyle = i === 3 ? C.lineStrong : C.line;
        ctx.lineWidth = 1;
        ctx.stroke();
        const [lx, ly] = toXY(0, (MAX_NM / 3) * i);
        text(f, `${(MAX_NM / 3) * i}`, lx + 6, ly + 14, { color: C.faint });
    }
    // Centreline.
    line(ctx, ox, oy, ox, oy - R, C.line, 1, [10, 3, 2, 3]);

    // Radar sector (±60°) and the electronic scan position.
    const [ax, ay] = toXY(-60, MAX_NM);
    const [bx, by] = toXY(60, MAX_NM);
    line(ctx, ox, oy, ax, ay, C.lineStrong, 1, [4, 4]);
    line(ctx, ox, oy, bx, by, C.lineStrong, 1, [4, 4]);
    const scan = Math.sin(t * 0.9) * 60;
    const [sx, sy] = toXY(scan, MAX_NM);
    ctx.globalAlpha = 0.35;
    line(ctx, ox, oy, sx, sy, C.fg2, 1);
    ctx.globalAlpha = 1;
    text(f, L.sector, bx - 4, by + 18, { color: C.faint, align: "right" });

    // Tracks.
    const states = TRACKS.map((_, i) => trackState(t, i));
    for (const s of states) {
        const [x, y] = toXY(s.rel, s.rng);
        symbol(ctx, s.kind, x, y);
        text(f, s.id, x + 12, y - 8, { color: s.kind === "unknown" ? C.muted : C.fg2 });
        text(f, `${s.alt}`, x + 12, y + 8, { color: C.faint });
    }
    ctx.restore();

    // Heading readout above the arc, own ship at the origin.
    text(f, `${labels.flight.hdg} ${pad3(heading)}`, ox, map.y + 16, { color: C.fg, align: "center", size: 13 });
    ownShip(ctx, ox, oy);
    text(f, L.own, ox + 14, oy + 6, { color: C.signal });
    text(f, L.nm, map.x + map.w - 4, oy + 6, { color: C.faint, align: "right" });

    // Track table.
    const cols = [0, 0.25, 0.5, 0.75].map((p) => tab.x + p * tab.w);
    const rowH = Math.max(20, Math.min(26, (tab.h - 84) / (TRACKS.length + 1)));
    text(f, L.tracks, tab.x, tab.y, { color: C.muted });
    let y = tab.y + rowH + 4;
    [L.colId, L.colBrg, L.colRng, L.colAlt].forEach((c, i) => text(f, c, cols[i], y, { color: C.faint }));
    line(ctx, tab.x, y + 8, tab.x + tab.w, y + 8, C.lineStrong);
    states
        .slice()
        .sort((a, b) => a.rng - b.rng)
        .forEach((s) => {
            y += rowH;
            const color = s.kind === "hostile" ? C.fg : C.fg2;
            text(f, s.id, cols[0], y, { color, size: 13 });
            text(f, pad3(heading + s.rel), cols[1], y, { color, size: 13 });
            text(f, s.rng.toFixed(0), cols[2], y, { color, size: 13 });
            text(f, `${s.alt}k`, cols[3], y, { color, size: 13 });
            line(ctx, tab.x, y + 8, tab.x + tab.w, y + 8, C.line);
        });

    // Legend.
    const lg = tab.y + tab.h - 4;
    const items: [Kind | "own", string][] = [
        ["own", L.own],
        ["wingman", L.wingman],
        ["unknown", L.unknown],
        ["hostile", L.hostile],
    ];
    const step = tab.w / 2;
    items.forEach(([k, label], i) => {
        const x = tab.x + (i % 2) * step + 8;
        const yy = lg - (i < 2 ? 26 : 0);
        if (k === "own") ownShip(ctx, x, yy - 4, 7);
        else symbol(ctx, k, x, yy - 4);
        text(f, label, x + 16, yy, { color: k === "own" ? C.signal : C.muted });
    });
};
