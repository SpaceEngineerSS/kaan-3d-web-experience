"use client";

import { useEffect, useRef } from "react";
import { flight } from "@/lib/flight/profile";

/**
 * TULGAR helmet-mounted display, drawn from the live state of the aircraft in the scene.
 * TULGAR is a colour, see-through visor display with a 40° × 32° field of view (ASELSAN datasheet).
 * The symbology here follows the standard HUD/HMD conventions (MIL-STD-1787 lineage): pitch ladder in 5° steps,
 * solid above the horizon and dashed below, flight path marker, heading tape, airspeed and altitude boxes.
 * Exact KAAN symbology is not public; this is an illustrative rendering, and the page says so.
 */

const GREEN = "#5cff8f";
const GREEN_DIM = "rgba(92,255,143,0.55)";
const CYAN = "#7fd4ff";

interface Props {
    /** 0..1 how much of the full visor symbology to show (1 = cockpit view). */
    visor: React.RefObject<number>;
    /** Camera vertical FOV in the cockpit shot, degrees (keeps the ladder honest to the scene). */
    vfov: number;
    active: boolean;
    label: string;
}

export function HelmetDisplay({ visor, vfov, active, label }: Props) {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const cv = canvas.current;
        if (!cv || !active) return;
        const ctx = cv.getContext("2d");
        if (!ctx) return;
        let raf = 0;
        let w = 0;
        let h = 0;
        let dpr = 1;

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = cv.clientWidth;
            h = cv.clientHeight;
            cv.width = Math.round(w * dpr);
            cv.height = Math.round(h * dpr);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(cv);

        // next/font gives the family a generated name; read it from the CSS variable.
        const family = getComputedStyle(document.documentElement).getPropertyValue("--font-b612-mono").trim() || "ui-monospace";
        const font = (px: number) => `${px}px ${family}, ui-monospace, monospace`;

        let v = 0;
        const draw = () => {
            raf = requestAnimationFrame(draw);
            if (document.hidden) return;
            v += ((visor.current ?? 0) - v) * 0.12;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);
            if (v < 0.02) return;

            ctx.globalAlpha = v;
            ctx.strokeStyle = GREEN;
            ctx.fillStyle = GREEN;
            ctx.lineWidth = 1.6;
            ctx.lineCap = "round";
            ctx.textBaseline = "middle";

            const cx = w / 2;
            const cy = h / 2;
            const pxPerDeg = h / vfov;
            // TULGAR field of view: 40° × 32°, centred.
            const boxH = Math.min(h * 0.92, 32 * pxPerDeg);
            const boxW = Math.min(w * 0.94, 40 * pxPerDeg);
            const left = cx - boxW / 2;
            const right = cx + boxW / 2;
            const top = cy - boxH / 2;
            const bottom = cy + boxH / 2;
            const fs = Math.max(12, Math.min(16, boxH / 34));

            // Pitch ladder, rotated with bank, clipped to the FOV.
            ctx.save();
            ctx.beginPath();
            ctx.rect(left + 70, top + 40, boxW - 140, boxH - 80);
            ctx.clip();
            ctx.translate(cx, cy);
            ctx.rotate((-flight.roll * Math.PI) / 180);
            const pitch = flight.pitch;
            for (let deg = -30; deg <= 30; deg += 5) {
                const y = (pitch - deg) * pxPerDeg;
                if (Math.abs(y) > boxH) continue;
                if (deg === 0) {
                    ctx.setLineDash([]);
                    ctx.beginPath();
                    ctx.moveTo(-boxW * 0.42, y);
                    ctx.lineTo(-boxW * 0.06, y);
                    ctx.moveTo(boxW * 0.06, y);
                    ctx.lineTo(boxW * 0.42, y);
                    ctx.stroke();
                    continue;
                }
                const half = boxW * 0.11;
                const gap = boxW * 0.045;
                // Bars tilt towards the horizon by half the pitch angle.
                const tilt = (deg / 2) * (Math.PI / 180) * 0.5;
                const tick = deg > 0 ? 8 : -8;
                ctx.setLineDash(deg > 0 ? [] : [7, 5]);
                for (const side of [-1, 1]) {
                    const x0 = side * gap;
                    const x1 = side * (gap + half);
                    const dy = Math.tan(tilt) * half * (deg > 0 ? 1 : -1);
                    ctx.beginPath();
                    ctx.moveTo(x0, y);
                    ctx.lineTo(x1, y + dy);
                    ctx.lineTo(x1, y + dy + tick);
                    ctx.stroke();
                    ctx.font = font(fs - 1);
                    ctx.textAlign = side < 0 ? "right" : "left";
                    ctx.fillText(String(Math.abs(deg)), x1 + side * 8, y + dy);
                }
            }
            ctx.restore();
            ctx.setLineDash([]);

            // Flight path marker: where the aircraft is actually going (here: on the boresight minus AoA).
            const aoa = flight.onGround ? 0 : 4;
            const fpmY = cy + aoa * pxPerDeg;
            ctx.beginPath();
            ctx.arc(cx, fpmY, 7, 0, Math.PI * 2);
            ctx.moveTo(cx - 7, fpmY);
            ctx.lineTo(cx - 20, fpmY);
            ctx.moveTo(cx + 7, fpmY);
            ctx.lineTo(cx + 20, fpmY);
            ctx.moveTo(cx, fpmY - 7);
            ctx.lineTo(cx, fpmY - 14);
            ctx.stroke();

            // Waterline (aircraft boresight)
            ctx.beginPath();
            ctx.moveTo(cx - 18, cy);
            ctx.lineTo(cx - 9, cy);
            ctx.lineTo(cx - 4.5, cy + 6);
            ctx.lineTo(cx, cy);
            ctx.lineTo(cx + 4.5, cy + 6);
            ctx.lineTo(cx + 9, cy);
            ctx.lineTo(cx + 18, cy);
            ctx.stroke();

            // Heading tape
            const tapeW = boxW * 0.42;
            const tapeY = top + 18;
            ctx.font = font(fs - 1);
            ctx.textAlign = "center";
            const hdg = flight.heading;
            const pxPerHdg = tapeW / 30;
            for (let d = Math.floor(hdg - 15); d <= Math.ceil(hdg + 15); d++) {
                if (d % 5 !== 0) continue;
                const x = cx + (d - hdg) * pxPerHdg;
                const big = d % 10 === 0;
                ctx.beginPath();
                ctx.moveTo(x, tapeY + 14);
                ctx.lineTo(x, tapeY + (big ? 4 : 9));
                ctx.stroke();
                if (big) ctx.fillText(String(((d % 360) + 360) % 360 / 10 | 0).padStart(2, "0"), x, tapeY - 4);
            }
            ctx.beginPath();
            ctx.moveTo(cx, tapeY + 16);
            ctx.lineTo(cx - 5, tapeY + 24);
            ctx.lineTo(cx + 5, tapeY + 24);
            ctx.closePath();
            ctx.stroke();
            ctx.fillText(String(Math.round(hdg)).padStart(3, "0"), cx, tapeY + 36);

            // Airspeed (left) and altitude (right) boxes
            const boxY = cy;
            const drawBox = (x: number, text: string, align: CanvasTextAlign) => {
                ctx.font = font(fs + 3);
                const tw = ctx.measureText(text).width + 16;
                const bx = align === "right" ? x - tw : x;
                ctx.strokeRect(bx, boxY - 14, tw, 28);
                ctx.textAlign = "center";
                ctx.fillText(text, bx + tw / 2, boxY + 1);
            };
            drawBox(left + 18, String(Math.round(flight.knots)), "left");
            drawBox(right - 18, String(Math.round(flight.altFt / 10) * 10), "right");

            ctx.font = font(fs - 1);
            ctx.textAlign = "left";
            ctx.fillText(`M ${flight.mach.toFixed(2)}`, left + 18, boxY + 34);
            ctx.fillText(`G ${flight.g.toFixed(1)}`, left + 18, top + 22);
            ctx.textAlign = "right";
            ctx.fillText(flight.onGround ? "GND" : "BARO", right - 18, boxY + 34);
            ctx.fillStyle = GREEN_DIM;
            ctx.fillText(flight.gearDown ? "GEAR DN" : "", right - 18, boxY + 52);
            if (flight.afterburner > 0.6) {
                ctx.fillStyle = GREEN;
                ctx.textAlign = "left";
                ctx.fillText("AB", left + 18, boxY + 52);
            }

            // A colour cue only a colour visor can show: chase aircraft cued in cyan, low on the right.
            if (!flight.onGround) {
                ctx.strokeStyle = CYAN;
                ctx.fillStyle = CYAN;
                const tx = cx + boxW * 0.28;
                const ty = cy + boxH * 0.2;
                ctx.beginPath();
                ctx.arc(tx, ty, 9, Math.PI, 0);
                ctx.stroke();
                ctx.font = font(fs - 2);
                ctx.textAlign = "left";
                ctx.fillText("F-16D", tx + 14, ty - 2);
            }

            // Corner label: what this is.
            ctx.globalAlpha = v * 0.8;
            ctx.fillStyle = GREEN_DIM;
            ctx.font = font(11);
            ctx.textAlign = "center";
            ctx.fillText(label, cx, bottom - 6);
            ctx.globalAlpha = 1;
        };
        raf = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [active, visor, vfov, label]);

    return <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 z-[5] h-full w-full" />;
}
