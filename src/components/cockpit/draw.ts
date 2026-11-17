import type { DisplayLabels } from "@/content/cockpit";

/** Site tokens (globals.css) as hex, for canvas drawing. */
export const C = {
    ground: "#0d1013",
    ground2: "#12161a",
    surface: "#171c21",
    surface2: "#1d2329",
    line: "#2a3138",
    lineStrong: "#3a434c",
    fg: "#e8e9e6",
    fg2: "#c3c8cb",
    muted: "#969fa7",
    faint: "#78828b",
    airframe: "#8d969e",
    signal: "#f2662b",
    ok: "#8fbf7a",
} as const;

/** Everything a page needs to draw one frame. Sizes are CSS pixels; the context is already scaled for DPR. */
export interface Frame {
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    /** Seconds since start (a fixed value when motion is reduced). */
    t: number;
    labels: DisplayLabels;
    mono: string;
}

export type DrawPage = (f: Frame) => void;

let monoFamily: string | null = null;

/** The site's mono family as resolved by next/font (CSS variables do not work inside canvas font strings). */
export function resolveMono(): string {
    if (monoFamily) return monoFamily;
    const v = getComputedStyle(document.documentElement).getPropertyValue("--font-plex-mono").trim();
    monoFamily = v ? `${v}, ui-monospace, monospace` : "ui-monospace, monospace";
    return monoFamily;
}

interface TextOpts {
    size?: number;
    color?: string;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
    weight?: number;
}

/** Text at 12 CSS px or larger. */
export function text(f: Frame, s: string, x: number, y: number, o: TextOpts = {}) {
    const { ctx } = f;
    ctx.font = `${o.weight ?? 400} ${Math.max(12, o.size ?? 12)}px ${f.mono}`;
    ctx.fillStyle = o.color ?? C.fg2;
    ctx.textAlign = o.align ?? "left";
    ctx.textBaseline = o.baseline ?? "alphabetic";
    ctx.fillText(s, x, y);
}

export function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, width = 1, dash?: number[]) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash ?? []);
    ctx.stroke();
    ctx.setLineDash([]);
}

/** Page title (top left) and the "simulated" stamp (top right). */
export function pageChrome(f: Frame, title: string) {
    text(f, title, 16, 26, { color: C.muted });
    text(f, f.labels.simulated, f.w - 16, 26, { color: C.faint, align: "right" });
}

/** KAAN own-ship chevron, nose up, centred on (x, y). */
export function ownShip(ctx: CanvasRenderingContext2D, x: number, y: number, s = 9) {
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s * 0.75, y + s * 0.8);
    ctx.lineTo(x, y + s * 0.35);
    ctx.lineTo(x - s * 0.75, y + s * 0.8);
    ctx.closePath();
    ctx.fillStyle = C.signal;
    ctx.fill();
}

export const pad3 = (n: number) => String(Math.round(((n % 360) + 360) % 360)).padStart(3, "0");

/** Thousands with a thin space, e.g. 24 300. */
export const thousands = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
