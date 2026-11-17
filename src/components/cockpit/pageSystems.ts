import { C, line, pageChrome, text, type DrawPage, type Frame } from "./draw";

/**
 * Simplified planform, right half, nose at y = 0, tail at y = 1.
 * x is a fraction of the half-span. Drawn to KAAN's published 21 m × 14 m proportions.
 */
const HALF: [number, number][] = [
    [0, 0],
    [0.08, 0.1],
    [0.15, 0.24],
    [0.2, 0.36],
    [0.24, 0.42],
    [1, 0.72],
    [1, 0.79],
    [0.32, 0.8],
    [0.36, 0.84],
    [0.62, 0.95],
    [0.62, 1],
    [0.2, 0.97],
    [0.14, 1],
    [0, 1],
];

function planform(f: Frame, cx: number, top: number, len: number) {
    const { ctx } = f;
    const half = (len * (14 / 21)) / 2;
    const P = (x: number, y: number) => [cx + x * half, top + y * len] as const;

    ctx.beginPath();
    HALF.forEach(([x, y], i) => {
        const [px, py] = P(x, y);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    });
    for (let i = HALF.length - 1; i >= 0; i--) {
        const [px, py] = P(-HALF[i][0], HALF[i][1]);
        ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = C.surface;
    ctx.fill();
    ctx.strokeStyle = C.airframe;
    ctx.lineWidth = 1.25;
    ctx.stroke();

    // Centreline.
    const [, y0] = P(0, -0.04);
    const [, y1] = P(0, 1.04);
    line(ctx, cx, y0, cx, y1, C.lineStrong, 1, [10, 3, 2, 3]);

    // Internal weapons bay with two doors (closed).
    const [bx0, by0] = P(-0.1, 0.42);
    const [bx1, by1] = P(0.1, 0.66);
    ctx.strokeStyle = C.fg2;
    ctx.lineWidth = 1.25;
    ctx.strokeRect(bx0, by0, bx1 - bx0, by1 - by0);
    line(ctx, cx, by0, cx, by1, C.fg2, 1);

    return { bayRight: bx1, bayMid: (by0 + by1) / 2 };
}

function bar(f: Frame, x: number, y: number, bw: number, frac: number, label: string, value: string) {
    const { ctx } = f;
    text(f, label, x, y, { color: C.muted });
    text(f, value, x + bw, y, { color: C.fg, align: "right", size: 14, weight: 500 });
    const by = y + 10;
    ctx.fillStyle = C.surface2;
    ctx.fillRect(x, by, bw, 8);
    ctx.fillStyle = C.fg2;
    ctx.fillRect(x, by, bw * Math.max(0, Math.min(1, frac)), 8);
    ctx.strokeStyle = C.line;
    ctx.strokeRect(x + 0.5, by + 0.5, bw - 1, 7);
}

export const drawSystems: DrawPage = (f: Frame) => {
    const { ctx, w, h, t, labels } = f;
    const L = labels.systems;
    const wide = w / h > 1.5;
    pageChrome(f, L.title);

    const rpm = [92 + Math.sin(t * 0.5) * 1.2, 91.6 + Math.sin(t * 0.47 + 1) * 1.2];
    const egt = [690 + Math.sin(t * 0.4) * 6, 684 + Math.sin(t * 0.43 + 2) * 6];
    const fuel = 0.64 - Math.sin(t * 0.02) * 0.004;

    // Planform with bay callout.
    // Size the drawing so planform + callout label always fit inside their area.
    const area = wide ? { x: 16, y: 44, w: w * 0.52 - 32, h: h - 60 } : { x: 16, y: 44, w: w - 32, h: h * 0.46 - 44 };
    ctx.font = `400 12px ${f.mono}`;
    const labelW = Math.max(ctx.measureText(L.bay).width, ctx.measureText(L.doorsClosed).width);
    const span = Math.max(40, Math.min(area.w - labelW - 32, (area.h - 16) * (14 / 21)));
    const len = span / (14 / 21);
    const cx = area.x + 8 + span / 2;
    const top = area.y + (area.h - len) / 2;
    const { bayRight, bayMid } = planform(f, cx, top, len);
    // Label sits just beyond the wing tip so it never covers the drawing.
    const calloutX = cx + span / 2 + 16;
    line(ctx, bayRight, bayMid, calloutX - 4, bayMid, C.muted, 1);
    text(f, L.bay, calloutX, bayMid - 4, { color: C.fg2 });
    text(f, L.doorsClosed, calloutX, bayMid + 14, { color: C.muted });

    // Engines, fuel and cautions.
    const panel = wide ? { x: w * 0.52, y: 64, w: w * 0.48 - 32 } : { x: 16, y: h * 0.46 + 24, w: w - 32 };
    const colW = (panel.w - 24) / 2;
    const rowGap = wide ? Math.max(48, (h - 140) / 5) : 46;
    [L.engL, L.engR].forEach((eng, i) => {
        const x = panel.x + i * (colW + 24);
        text(f, eng, x, panel.y, { color: C.fg2 });
        line(ctx, x, panel.y + 8, x + colW, panel.y + 8, C.lineStrong);
        bar(f, x, panel.y + 30, colW, rpm[i] / 110, L.rpm, rpm[i].toFixed(0));
        bar(f, x, panel.y + 30 + rowGap, colW, egt[i] / 1000, L.egt, egt[i].toFixed(0));
    });

    const fy = panel.y + 30 + rowGap * 2 + 8;
    bar(f, panel.x, fy, panel.w, fuel, L.fuel, `${Math.round(fuel * 100)} %`);

    const cy = fy + rowGap;
    text(f, L.cautions, panel.x, cy, { color: C.muted });
    line(ctx, panel.x, cy + 8, panel.x + panel.w, cy + 8, C.line);
    text(f, L.none, panel.x, cy + 30, { color: C.ok, size: 13 });
};
