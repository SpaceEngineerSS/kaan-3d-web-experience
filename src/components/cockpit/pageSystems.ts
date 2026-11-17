import { box, boxedText, fs, line, lw, measure, P, rowH, text, thousands, type DrawPage, type Frame } from "./draw";

const D2R = Math.PI / 180;

/* ── SMS ─────────────────────────────────────────── */

/** Notional internal load. Names are weapon families ASELSAN named for KAAN in 2025; the arrangement is invented for illustration. */
const STORES = [
    { st: "L1", name: "TOLUN" },
    { st: "L2", name: "TOLUN" },
    { st: "R2", name: "LGK" },
    { st: "R1", name: "GÖZDE" },
];

function weapon(f: Frame, x: number, y: number, h: number, wdt: number) {
    const { ctx } = f;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + wdt / 2, y + wdt * 1.2);
    ctx.lineTo(x + wdt / 2, y + h - wdt * 0.6);
    ctx.lineTo(x + wdt, y + h);
    ctx.lineTo(x - wdt, y + h);
    ctx.lineTo(x - wdt / 2, y + h - wdt * 0.6);
    ctx.lineTo(x - wdt / 2, y + wdt * 1.2);
    ctx.closePath();
    ctx.strokeStyle = P.text;
    ctx.lineWidth = lw(f, 2);
    ctx.stroke();
}

export const drawSMS: DrawPage = (f, r) => {
    const size = 22;
    const lh = rowH(f, size);
    const cx = r.x + r.w / 2;

    boxedText(f, f.labels.notionalLoadout, cx, r.y + lh * 0.8, { size, color: P.cyan, align: "center" });

    // Fuselage section outline.
    const top = r.y + lh * 2.2;
    const bottom = r.y + r.h - lh * 2.6;
    const fwH = Math.min(230, r.w * 0.2);
    const { ctx } = f;
    ctx.beginPath();
    ctx.moveTo(cx - fwH * 0.7, top);
    ctx.lineTo(cx + fwH * 0.7, top);
    ctx.lineTo(cx + fwH, top + (bottom - top) * 0.2);
    ctx.lineTo(cx + fwH, bottom - (bottom - top) * 0.1);
    ctx.lineTo(cx + fwH * 0.8, bottom);
    ctx.lineTo(cx - fwH * 0.8, bottom);
    ctx.lineTo(cx - fwH, bottom - (bottom - top) * 0.1);
    ctx.lineTo(cx - fwH, top + (bottom - top) * 0.2);
    ctx.closePath();
    ctx.strokeStyle = P.dim;
    ctx.lineWidth = lw(f, 2);
    ctx.stroke();

    // Two bays.
    const bw = fwH * 0.78;
    const gap = fwH * 0.14;
    const by = top + (bottom - top) * 0.16;
    const bh = (bottom - top) * 0.68;
    const bays = [cx - gap / 2 - bw, cx + gap / 2];
    for (const bx of bays) box(f, bx, by, bw, bh, P.grey, 2);

    const ww = Math.max(9, bw * 0.09);
    const wy = by + bh * 0.08;
    const wh = bh * 0.84;
    const xs = [bays[0] + bw * 0.3, bays[0] + bw * 0.7, bays[1] + bw * 0.3, bays[1] + bw * 0.7];
    xs.forEach((x) => weapon(f, x, wy, wh, ww));

    // Station labels outside the bays.
    const rows = [by + bh * 0.3, by + bh * 0.62];
    const lx = bays[0] - 28;
    const rx = bays[1] + bw + 28;
    [
        { s: STORES[0], x: lx, y: rows[0], a: "right" as const },
        { s: STORES[1], x: lx, y: rows[1], a: "right" as const },
        { s: STORES[2], x: rx, y: rows[1], a: "left" as const },
        { s: STORES[3], x: rx, y: rows[0], a: "left" as const },
    ].forEach(({ s, x, y, a }) => {
        text(f, `${s.st} ${s.name}`, x, y - lh * 0.5, { size, color: P.text, align: a });
        text(f, "RDY", x, y + lh * 0.5, { size, color: P.green, align: a });
    });

    const dy = by + bh + lh * 0.75;
    text(f, "DOORS", r.x + 12, dy, { size: 20, color: P.grey });
    for (const bx of bays) text(f, "CLSD", bx + bw / 2, dy, { size: 20, color: P.green, align: "center" });

    const armW = text(f, "MASTER ARM ", r.x + 12, r.y + r.h - lh * 0.7, { size, color: P.grey });
    text(f, "SAFE", r.x + 12 + armW, r.y + r.h - lh * 0.7, { size, color: P.text });
    text(f, "QTY 4", r.x + r.w - 12, r.y + r.h - lh * 0.7, { size, color: P.grey, align: "right" });
};

/* ── ENG ─────────────────────────────────────────── */

interface DialSpec {
    min: number;
    max: number;
    caution?: [number, number];
    limit: number;
}

const RPM: DialSpec = { min: 0, max: 110, limit: 104 };
const FTIT: DialSpec = { min: 200, max: 1100, caution: [930, 980], limit: 980 };

/** EICAS-style round dial: 240° scale, needle and digital readout. */
function dial(f: Frame, x: number, y: number, R: number, v: number, spec: DialSpec, digits: string) {
    const { ctx } = f;
    const a0 = 150 * D2R;
    const sweep = 240 * D2R;
    const ang = (val: number) => a0 + ((Math.min(Math.max(val, spec.min), spec.max) - spec.min) / (spec.max - spec.min)) * sweep;

    ctx.beginPath();
    ctx.arc(x, y, R, a0, a0 + sweep);
    ctx.strokeStyle = P.grey;
    ctx.lineWidth = lw(f, 3);
    ctx.stroke();

    if (spec.caution) {
        ctx.beginPath();
        ctx.arc(x, y, R, ang(spec.caution[0]), ang(spec.caution[1]));
        ctx.strokeStyle = P.yellow;
        ctx.lineWidth = lw(f, 6);
        ctx.stroke();
    }
    const la = ang(spec.limit);
    line(f, x + Math.cos(la) * (R - 14), y + Math.sin(la) * (R - 14), x + Math.cos(la) * (R + 12), y + Math.sin(la) * (R + 12), P.red, 5);

    for (let i = 0; i <= 8; i++) {
        const a = a0 + (i / 8) * sweep;
        line(f, x + Math.cos(a) * (R - 10), y + Math.sin(a) * (R - 10), x + Math.cos(a) * R, y + Math.sin(a) * R, P.grey, 2);
    }

    const inCaution = spec.caution ? v >= spec.caution[0] : false;
    const c = v >= spec.limit ? P.red : inCaution ? P.yellow : P.green;
    const va = ang(v);
    line(f, x, y, x + Math.cos(va) * (R - 6), y + Math.sin(va) * (R - 6), c, 4);

    boxedText(f, digits, x + R * 0.12, y + R * 0.55, { size: 26, color: c, align: "center" });
}

export const drawENG: DrawPage = (f, r) => {
    const { sim } = f;
    const size = 24;
    const lh = rowH(f, size);
    const cx = r.x + r.w / 2;
    const off = Math.min(300, r.w * 0.26);
    const cols = [cx - off, cx + off];

    let y = r.y + lh * 0.8;
    text(f, "ENG 1  F110", cols[0], y, { size, color: P.text, align: "center" });
    text(f, "ENG 2  F110", cols[1], y, { size, color: P.text, align: "center" });

    const digitalBlock = lh * 3.2;
    const abRow = lh * 1.4;
    const avail = r.h - lh * 1.6 - digitalBlock - abRow;
    const R = Math.max(40, Math.min(110, avail / 2 / 2.35));
    const dialH = avail / 2;

    const dials: [string, DialSpec, (i: 0 | 1) => [number, string]][] = [
        ["RPM %", RPM, (i) => [sim.eng[i].rpm, sim.eng[i].rpm.toFixed(0)]],
        ["FTIT °C", FTIT, (i) => [sim.eng[i].ftit, sim.eng[i].ftit.toFixed(0)]],
    ];
    y = r.y + lh * 1.6;
    for (const [label, spec, val] of dials) {
        const dy = y + dialH * 0.52;
        text(f, label, cx, dy, { size, color: P.grey, align: "center" });
        ([0, 1] as const).forEach((i) => {
            const [v, d] = val(i);
            dial(f, cols[i], dy, R, v, spec, d);
        });
        y += dialH;
    }

    const rows: [string, (i: 0 | 1) => string][] = [
        ["NOZ %", (i) => sim.eng[i].noz.toFixed(0)],
        ["OIL PSI", (i) => sim.eng[i].oil.toFixed(0)],
        ["FF PPH", (i) => thousands(Math.round(sim.eng[i].ff / 10) * 10)],
    ];
    for (const [label, val] of rows) {
        const ry = y + lh * 0.5;
        text(f, label, cx, ry, { size, color: P.grey, align: "center" });
        text(f, val(0), cols[0], ry, { size: 26, color: P.green, align: "center" });
        text(f, val(1), cols[1], ry, { size: 26, color: P.green, align: "center" });
        y += lh * 1.05;
    }

    const ay = r.y + r.h - abRow * 0.55;
    text(f, "AB", cx, ay, { size, color: P.grey, align: "center" });
    for (const c of cols) boxedText(f, "OFF", c, ay, { size, color: P.grey, align: "center" });
};

/* ── FUEL ────────────────────────────────────────── */

export const drawFUEL: DrawPage = (f, r) => {
    const { sim, ctx } = f;
    const size = 24;
    const lh = rowH(f, size);

    // Schematic on the left: fuselage tanks in a column feeding the FEED tank, wing tanks either side.
    const areaW = r.w * 0.56;
    const bh = Math.max(lh * 2.4, Math.min(170, (r.h - lh * 3) / 3.6));
    const gap = Math.max(26, bh * 0.2);
    const bw = Math.max(measure(f, "8 888", size) + fs(f, size) * 1.4, Math.min(bh * 1.4, (areaW - gap * 2 - 20) / 3));
    const cx = r.x + areaW / 2;
    const colTop = r.y + Math.max(lh * 1.2, (r.h - lh * 1.6 - (bh * 3 + gap * 2)) / 2);
    const pos: Record<string, [number, number]> = {
        F1: [cx - bw / 2, colTop],
        FEED: [cx - bw / 2, colTop + bh + gap],
        A1: [cx - bw / 2, colTop + (bh + gap) * 2],
        WL: [cx - bw * 1.5 - gap, colTop + bh + gap],
        WR: [cx + bw / 2 + gap, colTop + bh + gap],
    };

    // Transfer lines into FEED, drawn first so boxes sit on top.
    const feedY = colTop + bh + gap + bh / 2;
    line(f, cx, colTop + bh, cx, colTop + bh + gap, P.grey, 2);
    line(f, cx, colTop + bh * 2 + gap, cx, colTop + (bh + gap) * 2, P.grey, 2);
    line(f, cx - bw / 2 - gap, feedY, cx - bw / 2, feedY, P.grey, 2);
    line(f, cx + bw / 2, feedY, cx + bw / 2 + gap, feedY, P.grey, 2);

    for (const tk of sim.tanks) {
        const [x0, y0] = pos[tk.id];
        const frac = Math.min(1, tk.kg / tk.cap);
        ctx.fillStyle = P.greenDim;
        ctx.fillRect(x0, y0 + bh * (1 - frac), bw, bh * frac);
        box(f, x0, y0, bw, bh, tk.id === "FEED" ? P.green : P.grey, 2);
        text(f, tk.id, x0 + bw / 2, y0 + bh * 0.3, { size: 20, color: P.grey, align: "center" });
        text(f, thousands(Math.round(tk.kg / 10) * 10), x0 + bw / 2, y0 + bh * 0.68, { size, color: P.text, align: "center" });
    }
    text(f, f.labels.notionalTanks, cx, r.y + r.h - lh * 0.7, { size: 20, color: P.cyan, align: "center" });

    // Totals on the right.
    const x = r.x + r.w * 0.6;
    const right = r.x + r.w - 16;
    let y = r.y + lh * 1.2;
    text(f, "TOTAL", x, y, { size, color: P.grey });
    y += lh * 1.6;
    text(f, thousands(Math.round(sim.fuelKg / 10) * 10), right - measure(f, " KG", 26), y, { size: 44, color: P.green, align: "right", bold: true });
    text(f, " KG", right, y, { size: 26, color: P.grey, align: "right" });
    y += lh * 1.6;
    text(f, thousands(Math.round((sim.fuelKg * 2.20462) / 10) * 10), right - measure(f, " LBS", 26), y, { size: 32, color: P.text, align: "right" });
    text(f, " LBS", right, y, { size: 26, color: P.grey, align: "right" });

    y += lh * 1.8;
    line(f, x, y - lh * 0.6, right, y - lh * 0.6, P.dim, 2);
    const kv = (k: string, v: string, c: string) => {
        text(f, k, x, y, { size, color: P.grey });
        text(f, v, right, y, { size, color: c, align: "right" });
        y += lh * 1.2;
    };
    kv("BINGO KG", thousands(sim.bingoKg), P.cyan);
    kv("BINGO LBS", thousands(Math.round((sim.bingoKg * 2.20462) / 10) * 10), P.cyan);
    kv("TO BINGO", hmm((sim.fuelKg - sim.bingoKg) / sim.burnKgS), P.text);
    kv("FF PPH", thousands(Math.round((sim.eng[0].ff + sim.eng[1].ff) / 10) * 10), P.text);
};

/** Hours and minutes, e.g. 1:27. */
const hmm = (sec: number) => {
    const m = Math.max(0, Math.floor(sec / 60));
    return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
};

/* ── FCS ─────────────────────────────────────────── */

/** Generic twin-tail planform, right half; x as a fraction of the half-span, y from nose (0) to tail (1). Span/length from TUSAŞ 13.4 m / 20.3 m. */
const PLAN: [number, number][] = [
    [0, 0], [0.12, 0.12], [0.22, 0.3], [0.3, 0.4], [1, 0.66], [1, 0.72], [0.36, 0.76], [0.36, 0.82], [0.68, 0.94], [0.68, 0.99], [0.26, 0.99], [0.2, 1], [0, 1],
];

export const drawFCS: DrawPage = (f, r) => {
    const { sim, ctx } = f;
    const sf = sim.surfaces;
    const size = 22;
    const lh = rowH(f, size);
    const cx = r.x + r.w * 0.5;
    const top = r.y + lh * 1.4;
    const len = r.h - lh * 3.2;
    const half = (len * (13.4 / 20.3)) / 2;
    const at = (x: number, y: number): [number, number] => [cx + x * half, top + y * len];

    const poly = (pts: [number, number][], stroke: string, fill?: string) => {
        ctx.beginPath();
        pts.forEach(([x, y], i) => {
            const [px, py] = at(x, y);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.closePath();
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill();
        }
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lw(f, 2);
        ctx.stroke();
    };

    const full = [...PLAN, ...[...PLAN].reverse().map(([x, y]) => [-x, y] as [number, number])];
    poly(full, P.grey);

    const mirror = (pts: [number, number][]) => pts.map(([x, y]) => [-x, y] as [number, number]);
    const lef: [number, number][] = [[0.34, 0.415], [0.98, 0.645], [0.98, 0.665], [0.34, 0.435]];
    const flap: [number, number][] = [[0.42, 0.735], [0.95, 0.72], [0.95, 0.7], [0.42, 0.715]];
    const stab: [number, number][] = [[0.36, 0.82], [0.68, 0.94], [0.68, 0.99], [0.36, 0.99]];
    const fin: [number, number][] = [[0.22, 0.7], [0.27, 0.7], [0.32, 0.93], [0.27, 0.93]];

    const surf = [
        { pts: lef, v: sf.lefR, tag: "LEF" },
        { pts: mirror(lef), v: sf.lefL, tag: "LEF" },
        { pts: flap, v: sf.flapR, tag: "FLPRN" },
        { pts: mirror(flap), v: sf.flapL, tag: "FLPRN" },
        { pts: stab, v: sf.stabR, tag: "STAB" },
        { pts: mirror(stab), v: sf.stabL, tag: "STAB" },
        { pts: fin, v: sf.rudR, tag: "RUD" },
        { pts: mirror(fin), v: sf.rudL, tag: "RUD" },
    ];
    for (const s of surf) poly(s.pts, P.text, P.greenDim);

    // Deflection read-outs, left and right of the planform.
    const fmt = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(1)}`;
    const lx = r.x + 16;
    const rxx = r.x + r.w - 16;
    const rows: [string, number, number][] = [
        ["LEF", sf.lefL, sf.lefR],
        ["FLPRN", sf.flapL, sf.flapR],
        ["RUD", sf.rudL, sf.rudR],
        ["STAB", sf.stabL, sf.stabR],
    ];
    const step = Math.min(lh * 3, (r.h - lh * 4.5) / rows.length);
    rows.forEach(([tag, l, rv], i) => {
        const y = r.y + lh * 3.4 + step * i;
        text(f, tag, lx, y - lh * 0.5, { size: 20, color: P.grey });
        text(f, fmt(l), lx, y + lh * 0.5, { size, color: P.green });
        text(f, tag, rxx, y - lh * 0.5, { size: 20, color: P.grey, align: "right" });
        text(f, fmt(rv), rxx, y + lh * 0.5, { size, color: P.green, align: "right" });
    });

    text(f, "FLCS NORM", lx, r.y + lh * 0.6, { size, color: P.green });
    text(f, `AOA ${sim.aoa.toFixed(1)}`, rxx, r.y + lh * 0.6, { size, color: P.text, align: "right" });
    text(f, `G ${sim.g.toFixed(2)}`, rxx, r.y + lh * 1.6, { size, color: P.text, align: "right" });
    text(f, "DEG  + = TED/LED", lx, r.y + r.h - lh * 0.7, { size: 20, color: P.grey });
};
