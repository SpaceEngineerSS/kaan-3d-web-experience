import type { CanvasLabels, PageId } from "@/content/cockpit";
import { box, boxedText, clock, DH, DW, HALF, P, pad3, rowH, text, thousands, type DrawPage, type Frame, type Rect } from "./draw";
import { drawENG, drawFCS, drawFUEL, drawSMS } from "./pageSystems";
import { drawRDR, drawTSD } from "./pageTactical";
import { ACTIVE_STPT, bearingRange, ROUTE, simulate } from "./sim";

const PAGES: Record<PageId, DrawPage> = {
    tsd: drawTSD,
    rdr: drawRDR,
    sms: drawSMS,
    eng: drawENG,
    fuel: drawFUEL,
    fcs: drawFCS,
};

const M = 10;
const PORTAL_H = 770;
const STRIP_Y = PORTAL_H + M * 2;
const STRIP_H = DH - STRIP_Y - M;

export interface DisplayState {
    pages: [PageId, PageId];
    /** Tab mnemonics by page id. */
    tabs: Record<PageId, string>;
    active: 0 | 1;
    labels: CanvasLabels;
    mono: string;
}

/** Below this canvas aspect ratio only the active half is drawn (phones). */
export const HALF_MODE_RATIO = 1.8;

export function portalRect(i: 0 | 1): Rect {
    return { x: i * HALF + M, y: M, w: HALF - M * 2, h: PORTAL_H };
}

function drawPortal(f: Frame, i: 0 | 1, page: PageId, active: boolean, tab: string) {
    const { ctx } = f;
    const pr = portalRect(i);
    box(f, pr.x, pr.y, pr.w, pr.h, active ? P.grey : P.faint, 2);

    const size = 24;
    const hh = rowH(f, size) * 1.45;
    boxedText(f, tab, pr.x + 14, pr.y + hh / 2, { size, color: active ? P.green : P.grey, bold: true });
    text(f, f.labels.notional, pr.x + pr.w - 14, pr.y + hh / 2, { size: 20, color: P.grey, align: "right" });

    const r: Rect = { x: pr.x + 8, y: pr.y + hh, w: pr.w - 16, h: pr.h - hh - 8 };
    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    PAGES[page](f, r);
    ctx.restore();
}

type Row = [label: string, value: string, colour: string, value2?: string];

function window_(f: Frame, x: number, w: number, title: string, rows: Row[]) {
    const y = STRIP_Y;
    box(f, x, y, w, STRIP_H, P.dim, 2);
    const size = 24;
    // Rows spread over the window; on phones the minimum text size fills it.
    const lh = (STRIP_H - 12) / 4;
    text(f, title, x + 12, y + 6 + lh * 0.5, { size: 20, color: P.grey });
    rows.forEach(([label, value, colour, value2], k) => {
        const ry = y + 6 + lh * (k + 1.5);
        text(f, label, x + 12, ry, { size, color: P.grey });
        if (value2 !== undefined) {
            text(f, value, x + w * 0.66, ry, { size, color: colour, align: "right" });
            text(f, value2, x + w - 12, ry, { size, color: colour, align: "right" });
        } else {
            text(f, value, x + w - 12, ry, { size, color: colour, align: "right" });
        }
    });
}

function drawStrip(f: Frame, i: 0 | 1) {
    const { sim } = f;
    const ww = (HALF - M * 4) / 3;
    const x = (k: number) => i * HALF + M + k * (ww + M);
    if (i === 0) {
        window_(f, x(0), ww, "FUEL", [
            ["TOT KG", thousands(Math.round(sim.fuelKg / 10) * 10), P.green],
            ["TOT LBS", thousands(Math.round((sim.fuelKg * 2.20462) / 10) * 10), P.text],
            ["BINGO", thousands(sim.bingoKg), P.cyan],
        ]);
        window_(f, x(1), ww, "ENG", [
            ["RPM", sim.eng[0].rpm.toFixed(0), P.green, sim.eng[1].rpm.toFixed(0)],
            ["FTIT", sim.eng[0].ftit.toFixed(0), P.green, sim.eng[1].ftit.toFixed(0)],
            ["AB", "OFF", P.grey, "OFF"],
        ]);
        window_(f, x(2), ww, "ICAWS", [
            ["WARN", "0", P.green],
            ["CAUT", "0", P.green],
            ["ADVY", "0", P.green],
        ]);
    } else {
        const st = ROUTE.find((p) => p.n === ACTIVE_STPT)!;
        const sr = bearingRange(0, 0, st.x, st.y);
        window_(f, x(0), ww, "CNI", [
            ["COM1", "243.000", P.text],
            ["COM2", "121.500", P.text],
            ["IFF", "NORM", P.green],
        ]);
        window_(f, x(1), ww, "NAV", [
            ["STPT", String(ACTIVE_STPT), P.magenta],
            ["BRG", pad3(sr.brg), P.magenta],
            ["DIST", sr.rng.toFixed(1), P.magenta],
        ]);
        window_(f, x(2), ww, "TIME", [
            ["LCL", clock(sim.clock), P.text],
            ["ET", clock(38 * 60 + sim.t), P.text],
        ]);
    }
}

/** Paints the whole display, or only the active half when the canvas is narrow. */
export function paintDisplay(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, s: DisplayState) {
    const halfMode = w / h < HALF_MODE_RATIO;
    const scale = halfMode ? w / HALF : w / DW;
    const x0 = halfMode ? s.active * HALF : 0;
    const f: Frame = { ctx, scale, sim: simulate(t), labels: s.labels, mono: s.mono };

    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(-x0, 0);
    ctx.fillStyle = P.bg;
    ctx.fillRect(x0, 0, halfMode ? HALF : DW, DH);
    for (const i of [0, 1] as const) {
        if (halfMode && i !== s.active) continue;
        drawPortal(f, i, s.pages[i], i === s.active, s.tabs[s.pages[i]]);
        drawStrip(f, i);
    }
    ctx.restore();
}
