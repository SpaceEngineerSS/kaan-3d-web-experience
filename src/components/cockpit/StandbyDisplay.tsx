"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { P, pad3, resolveMono } from "./draw";
import { simulate } from "./sim";
import { useDisplayLoop, usePrefersReducedMotion } from "./useDisplayLoop";

const D2R = Math.PI / 180;

/**
 * Standby flight display: attitude, airspeed and altitude on a small square screen.
 * Drawn in CSS pixels (text 11 px or larger), shares the deterministic simulation with the main display.
 */
export function StandbyDisplay({ label }: { label: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reduced = usePrefersReducedMotion();
    const [mono, setMono] = useState("ui-monospace, monospace");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMono(resolveMono());
    }, []);

    const paint = useCallback(
        (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
            const s = simulate(t);
            const cx = w / 2;
            const cy = h / 2;
            const ppd = h / 50; // pixels per degree of pitch
            const font = (px: number, bold = false) => `${bold ? 700 : 400} ${Math.max(11, px)}px ${mono}`;
            const big = Math.max(13, w * 0.068);

            // Attitude: flat sky and earth, rotated by roll, shifted by pitch.
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(-s.roll * D2R);
            ctx.translate(0, s.pitch * ppd);
            const ext = Math.max(w, h) * 2;
            ctx.fillStyle = P.sky;
            ctx.fillRect(-ext, -ext, ext * 2, ext);
            ctx.fillStyle = P.earth;
            ctx.fillRect(-ext, 0, ext * 2, ext);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-ext, 0);
            ctx.lineTo(ext, 0);
            ctx.stroke();
            ctx.font = font(11);
            ctx.fillStyle = "#ffffff";
            ctx.textBaseline = "middle";
            for (let p = -20; p <= 20; p += 5) {
                if (p === 0) continue;
                const y = -p * ppd;
                const half = p % 10 === 0 ? w * 0.13 : w * 0.06;
                ctx.beginPath();
                ctx.moveTo(-half, y);
                ctx.lineTo(half, y);
                ctx.stroke();
                if (p % 10 === 0) {
                    ctx.textAlign = "left";
                    ctx.fillText(String(Math.abs(p)), half + 4, y);
                }
            }
            ctx.restore();

            // Roll scale, fixed, with the moving pointer.
            const rr = h * 0.4;
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.5;
            for (const a of [-60, -45, -30, -20, -10, 0, 10, 20, 30, 45, 60]) {
                const ang = (a - 90) * D2R;
                const len = a % 30 === 0 ? 10 : 6;
                ctx.beginPath();
                ctx.moveTo(cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr);
                ctx.lineTo(cx + Math.cos(ang) * (rr + len), cy + Math.sin(ang) * (rr + len));
                ctx.stroke();
            }
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(-s.roll * D2R);
            ctx.beginPath();
            ctx.moveTo(0, -rr + 1);
            ctx.lineTo(-6, -rr + 11);
            ctx.lineTo(6, -rr + 11);
            ctx.closePath();
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.restore();

            // Fixed aircraft reference, black-outlined white bars.
            const ref = (draw: () => void) => {
                ctx.lineCap = "butt";
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 6;
                draw();
                ctx.stroke();
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 3;
                draw();
                ctx.stroke();
            };
            const wing = w * 0.17;
            ref(() => {
                ctx.beginPath();
                ctx.moveTo(cx - wing - w * 0.06, cy);
                ctx.lineTo(cx - w * 0.06, cy);
                ctx.lineTo(cx - w * 0.06, cy + 6);
                ctx.moveTo(cx + wing + w * 0.06, cy);
                ctx.lineTo(cx + w * 0.06, cy);
                ctx.lineTo(cx + w * 0.06, cy + 6);
            });
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(cx - 2.5, cy - 2.5, 5, 5);

            // Speed (left) and altitude (right) boxes.
            const bh = big * 1.6;
            const readout = (txt: string, x: number, align: "left" | "right", sub: string) => {
                ctx.font = font(big, true);
                const tw = ctx.measureText(txt).width + 12;
                const bx = align === "left" ? x : x - tw;
                ctx.fillStyle = "#000000";
                ctx.fillRect(bx, cy - bh / 2, tw, bh);
                ctx.strokeStyle = P.text;
                ctx.lineWidth = 1;
                ctx.strokeRect(bx + 0.5, cy - bh / 2 + 0.5, tw - 1, bh - 1);
                ctx.fillStyle = P.text;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(txt, bx + tw / 2, cy + 1);
                ctx.font = font(11);
                ctx.fillStyle = "#000000";
                ctx.fillRect(bx, cy + bh / 2 + 2, tw, 15);
                ctx.fillStyle = P.text;
                ctx.fillText(sub, bx + tw / 2, cy + bh / 2 + 10);
            };
            readout(String(Math.round(s.kcas)), 6, "left", "KT");
            readout(String(Math.round(s.alt / 10) * 10), w - 6, "right", "FT");

            // Top band: Mach and baro; bottom band: heading.
            const band = 20;
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, w, band);
            ctx.fillRect(0, h - band, w, band);
            ctx.font = font(11);
            ctx.fillStyle = P.text;
            ctx.textBaseline = "middle";
            ctx.textAlign = "left";
            ctx.fillText(`M ${s.mach.toFixed(2)}`, 6, band / 2 + 1);
            ctx.textAlign = "right";
            ctx.fillText("STD", w - 6, band / 2 + 1);
            ctx.textAlign = "center";
            ctx.fillText(pad3(s.hdg), cx, h - band / 2 + 1);
            ctx.textAlign = "left";
            ctx.fillStyle = P.grey;
            ctx.fillText(label, 6, h - band / 2 + 1);
        },
        [mono, label]
    );

    useDisplayLoop(canvasRef, paint, { animate: !reduced, fps: 30 });

    return <canvas ref={canvasRef} aria-hidden className="block aspect-square w-full bg-black" />;
}
