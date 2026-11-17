import { C, line, pad3, pageChrome, text, thousands, type DrawPage, type Frame } from "./draw";

/** Simulated, smoothly varying flight state. */
function state(t: number) {
    const pitch = 2 + Math.sin(t * 0.3) * 3;
    const roll = Math.sin(t * 0.21) * 12;
    const speed = 420 + Math.sin(t * 0.17) * 12;
    const alt = 24000 + Math.sin(t * 0.11) * 300;
    const vs = Math.cos(t * 0.11) * 0.11 * 300 * 60;
    const heading = 274 + Math.sin(t * 0.07) * 8;
    const mach = 0.92 + (speed - 420) / 700;
    const g = 1 / Math.cos((roll * Math.PI) / 180);
    const aoa = 4 + pitch * 0.3;
    return { pitch, roll, speed, alt, vs, heading, mach, g, aoa };
}

function attitude(f: Frame, x: number, y: number, size: number, pitch: number, roll: number) {
    const { ctx } = f;
    const cx = x + size / 2;
    const cy = y + size / 2;
    const pxPerDeg = size / 40;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.clip();

    ctx.translate(cx, cy);
    ctx.rotate((-roll * Math.PI) / 180);
    ctx.translate(0, pitch * pxPerDeg);

    // Ground half, horizon, pitch ladder.
    ctx.fillStyle = C.surface2;
    ctx.fillRect(-size * 2, 0, size * 4, size * 2);
    line(ctx, -size * 2, 0, size * 2, 0, C.fg2, 1.5);
    for (let p = -20; p <= 20; p += 5) {
        if (p === 0) continue;
        const yy = -p * pxPerDeg;
        const half = p % 10 === 0 ? size * 0.18 : size * 0.09;
        line(ctx, -half, yy, half, yy, p > 0 ? C.fg2 : C.muted, 1, p < 0 ? [5, 4] : undefined);
        if (p % 10 === 0) {
            text(f, `${Math.abs(p)}`, half + 8, yy + 4, { color: C.muted });
            text(f, `${Math.abs(p)}`, -half - 8, yy + 4, { color: C.muted, align: "right" });
        }
    }
    ctx.restore();

    // Fixed own-ship waterline symbol.
    const s = size * 0.12;
    ctx.beginPath();
    ctx.moveTo(cx - s * 1.6, cy);
    ctx.lineTo(cx - s * 0.6, cy);
    ctx.lineTo(cx - s * 0.3, cy + s * 0.35);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + s * 0.3, cy + s * 0.35);
    ctx.lineTo(cx + s * 0.6, cy);
    ctx.lineTo(cx + s * 1.6, cy);
    ctx.strokeStyle = C.signal;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Roll scale.
    const r = size * 0.44;
    for (const a of [-60, -45, -30, -20, -10, 0, 10, 20, 30, 45, 60]) {
        const rad = ((a - 90) * Math.PI) / 180;
        const len = a % 30 === 0 ? 10 : 6;
        line(ctx, cx + Math.cos(rad) * r, cy + Math.sin(rad) * r, cx + Math.cos(rad) * (r - len), cy + Math.sin(rad) * (r - len), C.fg2, 1);
    }
    const pr = ((-roll - 90) * Math.PI) / 180;
    const px = cx + Math.cos(pr) * (r - 12);
    const py = cy + Math.sin(pr) * (r - 12);
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate((-roll * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(5, 4);
    ctx.lineTo(-5, 4);
    ctx.closePath();
    ctx.fillStyle = C.fg;
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = C.lineStrong;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
}

/** Vertical tape with a value box. `step` = minor tick, `labelEvery` in units. */
function tape(f: Frame, x: number, y: number, tw: number, th: number, value: number, unitsPerPx: number, step: number, labelEvery: number, label: string, right: boolean) {
    const { ctx } = f;
    const cy = y + th / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, tw, th);
    ctx.clip();
    const span = (th / 2) * unitsPerPx;
    const first = Math.floor((value - span) / step) * step;
    for (let v = first; v <= value + span; v += step) {
        const yy = cy - (v - value) / unitsPerPx;
        const major = v % labelEvery === 0;
        const len = major ? 12 : 6;
        const edge = right ? x : x + tw;
        line(ctx, edge, yy, right ? edge + len : edge - len, yy, major ? C.fg2 : C.faint, 1);
        if (major) text(f, thousands(v), right ? x + 18 : x + tw - 18, yy + 4, { color: C.muted, align: right ? "left" : "right" });
    }
    ctx.restore();
    ctx.strokeStyle = C.line;
    ctx.strokeRect(x + 0.5, y + 0.5, tw - 1, th - 1);

    // Current value box.
    const bh = 30;
    ctx.fillStyle = C.ground;
    ctx.fillRect(x + 2, cy - bh / 2, tw - 4, bh);
    ctx.strokeStyle = C.fg;
    ctx.strokeRect(x + 2.5, cy - bh / 2 + 0.5, tw - 5, bh - 1);
    text(f, thousands(value), x + tw / 2, cy + 6, { color: C.fg, size: 16, align: "center", weight: 500 });
    text(f, label, x + tw / 2, y - 8, { color: C.muted, align: "center" });
}

function headingTape(f: Frame, x: number, y: number, tw: number, heading: number) {
    const { ctx } = f;
    const pxPerDeg = tw / 50;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, tw, 34);
    ctx.clip();
    const first = Math.floor((heading - 25) / 5) * 5;
    for (let d = first; d <= heading + 25; d += 5) {
        const xx = x + tw / 2 + (d - heading) * pxPerDeg;
        const major = d % 10 === 0;
        line(ctx, xx, y + 34, xx, y + 34 - (major ? 10 : 5), major ? C.fg2 : C.faint);
        if (major) text(f, pad3(d).slice(0, 2), xx, y + 16, { color: C.muted, align: "center" });
    }
    ctx.restore();
    const cx = x + tw / 2;
    ctx.fillStyle = C.ground;
    ctx.fillRect(cx - 28, y - 4, 56, 24);
    ctx.strokeStyle = C.fg;
    ctx.strokeRect(cx - 27.5, y - 3.5, 55, 23);
    text(f, pad3(heading), cx, y + 14, { color: C.fg, align: "center", size: 15, weight: 500 });
}

export const drawFlight: DrawPage = (f: Frame) => {
    const { w, h, t, labels } = f;
    const L = labels.flight;
    const s = state(t);
    const wide = w / h > 1.5;
    pageChrome(f, L.title);

    const readouts: [string, string][] = [
        [L.mach, s.mach.toFixed(2)],
        [L.g, s.g.toFixed(1)],
        [L.aoa, `${s.aoa.toFixed(1)}°`],
        [L.vs, `${s.vs >= 0 ? "+" : "−"}${thousands(Math.abs(s.vs))}`],
    ];

    if (wide) {
        const size = Math.min(h - 120, w * 0.34);
        const ax = w * 0.42 - size / 2;
        const ay = 92;
        const tw = Math.max(76, size * 0.3);
        headingTape(f, ax, 48, size, s.heading);
        attitude(f, ax, ay, size, s.pitch, s.roll);
        tape(f, ax - tw - 18, ay, tw, size, s.speed, 1, 5, 20, L.speed, false);
        tape(f, ax + size + 18, ay, tw + 12, size, s.alt, 10, 100, 500, L.alt, true);
        const rx = w * 0.78;
        readouts.forEach(([k, v], i) => {
            const yy = ay + 12 + i * (size / 4);
            text(f, k, rx, yy, { color: C.muted });
            text(f, v, rx, yy + 26, { color: C.fg, size: 20, weight: 500 });
        });
    } else {
        const tw = Math.max(64, w * 0.2);
        const size = Math.min(w - tw * 2 - 40, h * 0.5);
        const ax = (w - size) / 2;
        const ay = 96;
        headingTape(f, ax, 52, size, s.heading);
        attitude(f, ax, ay, size, s.pitch, s.roll);
        tape(f, ax - tw - 10, ay, tw, size, s.speed, 1, 5, 20, L.speed, false);
        tape(f, ax + size + 10, ay, tw, size, s.alt, 10, 100, 500, L.alt, true);
        const top = ay + size + 36;
        const colW = (w - 32) / 2;
        readouts.forEach(([k, v], i) => {
            const xx = 16 + (i % 2) * colW;
            const yy = top + Math.floor(i / 2) * Math.max(52, (h - top - 16) / 2);
            text(f, k, xx, yy, { color: C.muted });
            text(f, v, xx, yy + 24, { color: C.fg, size: 18, weight: 500 });
        });
    }
};
