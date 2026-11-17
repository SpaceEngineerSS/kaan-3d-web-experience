import type { CanvasLabels } from "@/content/cockpit";
import type { Sim } from "./sim";

/**
 * Display palette. Colour carries meaning only:
 * green own/normal, yellow caution/unknown, red warning/hostile, cyan information,
 * magenta route, grey map lines, near-white text. Flat fills, no glow or gradients.
 */
export const P = {
    bg: "#000000",
    green: "#00E05A",
    greenDim: "#06371B",
    yellow: "#FFD21F",
    red: "#FF3B30",
    cyan: "#3CCBFF",
    magenta: "#FF4FD8",
    grey: "#7A7A7A",
    dim: "#3A3A3A",
    faint: "#242424",
    text: "#E6E6E6",
    sky: "#2E6DB4",
    earth: "#7A4B26",
} as const;

/** Design space of the whole display, matching the reported 2560×1024 panel; each half is 1280×1024 (5:4). */
export const DW = 2560;
export const DH = 1024;
export const HALF = 1280;

/** Smallest canvas text, in CSS pixels. */
export const MIN_TEXT_PX = 11;

export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

/** Everything a page needs to draw one frame. Coordinates are design units; the context is scaled for CSS px and DPR. */
export interface Frame {
    ctx: CanvasRenderingContext2D;
    /** CSS pixels per design unit. */
    scale: number;
    sim: Sim;
    labels: CanvasLabels;
    mono: string;
}

export type DrawPage = (f: Frame, r: Rect) => void;

let monoFamily: string | null = null;

/** B612 Mono as resolved by next/font (a CSS variable cannot be used inside a canvas font string). */
export function resolveMono(): string {
    if (monoFamily) return monoFamily;
    const v = getComputedStyle(document.documentElement).getPropertyValue("--font-b612-mono").trim();
    monoFamily = v ? `${v}, ui-monospace, monospace` : "ui-monospace, monospace";
    return monoFamily;
}

/** Font size in design units, never below MIN_TEXT_PX on screen. */
export const fs = (f: Frame, n: number) => Math.max(n, MIN_TEXT_PX / f.scale);

/** Line width in design units, never below 1 CSS px. */
export const lw = (f: Frame, n = 2) => Math.max(n, 1 / f.scale);

interface TextOpts {
    size?: number;
    color?: string;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
    bold?: boolean;
}

/** Caps text in B612 Mono. Returns the drawn width. */
export function text(f: Frame, s: string, x: number, y: number, o: TextOpts = {}): number {
    const { ctx } = f;
    ctx.font = `${o.bold ? 700 : 400} ${fs(f, o.size ?? 24)}px ${f.mono}`;
    ctx.fillStyle = o.color ?? P.text;
    ctx.textAlign = o.align ?? "left";
    ctx.textBaseline = o.baseline ?? "middle";
    ctx.fillText(s, x, y);
    return ctx.measureText(s).width;
}

export function measure(f: Frame, s: string, size = 24, bold = false): number {
    f.ctx.font = `${bold ? 700 : 400} ${fs(f, size)}px ${f.mono}`;
    return f.ctx.measureText(s).width;
}

export function line(f: Frame, x1: number, y1: number, x2: number, y2: number, color: string, width = 2, dash?: number[]) {
    const { ctx } = f;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lw(f, width);
    ctx.setLineDash(dash ?? []);
    ctx.stroke();
    ctx.setLineDash([]);
}

export function box(f: Frame, x: number, y: number, w: number, h: number, color: string, width = 2) {
    const { ctx } = f;
    ctx.strokeStyle = color;
    ctx.lineWidth = lw(f, width);
    ctx.strokeRect(x, y, w, h);
}

export function circle(f: Frame, x: number, y: number, r: number, color: string, width = 2, dash?: number[]) {
    const { ctx } = f;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lw(f, width);
    ctx.setLineDash(dash ?? []);
    ctx.stroke();
    ctx.setLineDash([]);
}

/** Text inside a rectangle sized to it. */
export function boxedText(f: Frame, s: string, x: number, y: number, o: TextOpts & { pad?: number } = {}) {
    const size = o.size ?? 24;
    const w = measure(f, s, size, o.bold);
    const h = fs(f, size) * 1.35;
    const pad = o.pad ?? fs(f, size) * 0.4;
    const align = o.align ?? "left";
    const left = align === "center" ? x - w / 2 - pad : align === "right" ? x - w - pad * 2 : x;
    f.ctx.fillStyle = P.bg;
    f.ctx.fillRect(left, y - h / 2, w + pad * 2, h);
    box(f, left, y - h / 2, w + pad * 2, h, o.color ?? P.text, 2);
    text(f, s, left + pad, y + 1, { ...o, align: "left" });
}

export type Affiliation = "friend" | "hostile" | "unknown";

export const affiliationColour: Record<Affiliation, string> = {
    friend: P.green,
    hostile: P.red,
    unknown: P.yellow,
};

/**
 * MIL-STD-2525 air frames (top halves): friend semicircle, hostile half diamond, unknown half quatrefoil.
 * (x, y) is the middle of the frame's base.
 */
export function airFrame(f: Frame, kind: Affiliation, x: number, y: number, s: number) {
    const { ctx } = f;
    ctx.beginPath();
    if (kind === "friend") {
        ctx.arc(x, y, s, Math.PI, Math.PI * 2);
        ctx.closePath();
    } else if (kind === "hostile") {
        ctx.moveTo(x - s * 1.1, y);
        ctx.lineTo(x, y - s * 1.1);
        ctx.lineTo(x + s * 1.1, y);
        ctx.closePath();
    } else {
        const r = s / 2;
        ctx.moveTo(x - 2 * r, y);
        ctx.arc(x - r, y, r, Math.PI, Math.PI * 1.5);
        ctx.arc(x, y - r, r, Math.PI, Math.PI * 2);
        ctx.arc(x + r, y, r, Math.PI * 1.5, Math.PI * 2);
        ctx.closePath();
    }
    ctx.strokeStyle = affiliationColour[kind];
    ctx.lineWidth = lw(f, 3);
    ctx.stroke();
}

/** Ownship in plan view, nose up, centred on (x, y). */
export function ownship(f: Frame, x: number, y: number, s: number) {
    const { ctx } = f;
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s * 0.18, y - s * 0.35);
    ctx.lineTo(x + s * 0.85, y + s * 0.25);
    ctx.lineTo(x + s * 0.85, y + s * 0.42);
    ctx.lineTo(x + s * 0.2, y + s * 0.3);
    ctx.lineTo(x + s * 0.45, y + s * 0.9);
    ctx.lineTo(x - s * 0.45, y + s * 0.9);
    ctx.lineTo(x - s * 0.2, y + s * 0.3);
    ctx.lineTo(x - s * 0.85, y + s * 0.42);
    ctx.lineTo(x - s * 0.85, y + s * 0.25);
    ctx.lineTo(x - s * 0.18, y - s * 0.35);
    ctx.closePath();
    ctx.strokeStyle = P.green;
    ctx.lineWidth = lw(f, 3);
    ctx.stroke();
}

export const pad3 = (n: number) => String(Math.round(((n % 360) + 360) % 360) % 360).padStart(3, "0");

/** Thousands with a space, e.g. 24 300. */
export const thousands = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const clock = (sec: number) => {
    const s = Math.floor(((sec % 86400) + 86400) % 86400);
    const hh = String(Math.floor(s / 3600)).padStart(2, "0");
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
};

export const mmss = (sec: number) => {
    const s = Math.max(0, Math.floor(sec));
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/** Vertical rhythm for rows of text at a given size. */
export const rowH = (f: Frame, size = 24) => fs(f, size) * 1.32;
