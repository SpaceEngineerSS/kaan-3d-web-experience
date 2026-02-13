"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

/* ── helpers ── */
const rand = (a: number, b: number) => Math.random() * (b - a) + a;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const pad3 = (n: number) => String(Math.round(n)).padStart(3, "0");

/* ── simulated telemetry ── */
function useTelemetry() {
    const [data, setData] = useState({
        lat: 39.9334, lon: 32.8597,
        alt: 35000, speed: 420, mach: 1.42,
        heading: 274, pitch: 2.5, roll: -3.2,
        gForce: 1.2, fuel: 78,
        rpm1: 97, rpm2: 96, egt1: 685, egt2: 678,
        aoa: 3.1, verticalSpeed: 200,
        courseHeading: 280, waypointDist: 42.8,
        tgtBearing: 315, tgtRange: 28.4,
        radarAzimuth: 0,
    });

    useEffect(() => {
        const id = setInterval(() => {
            setData((p) => ({
                lat: +(p.lat + rand(-0.001, 0.001)).toFixed(4),
                lon: +(p.lon + rand(-0.001, 0.001)).toFixed(4),
                alt: Math.round(clamp(p.alt + rand(-30, 30), 25000, 45000)),
                speed: Math.round(clamp(p.speed + rand(-3, 3), 300, 600)),
                mach: +(clamp(p.mach + rand(-0.01, 0.01), 0.85, 2.0)).toFixed(2),
                heading: Math.round((p.heading + rand(-0.5, 0.5) + 360) % 360),
                pitch: +(p.pitch + rand(-0.3, 0.3)).toFixed(1),
                roll: +(p.roll + rand(-0.4, 0.4)).toFixed(1),
                gForce: +(clamp(p.gForce + rand(-0.05, 0.05), 0.5, 4.0)).toFixed(1),
                fuel: +(clamp(p.fuel - rand(0, 0.01), 20, 99)).toFixed(1),
                rpm1: Math.round(clamp(p.rpm1 + rand(-1, 1), 88, 101)),
                rpm2: Math.round(clamp(p.rpm2 + rand(-1, 1), 88, 101)),
                egt1: Math.round(clamp(p.egt1 + rand(-3, 3), 600, 750)),
                egt2: Math.round(clamp(p.egt2 + rand(-3, 3), 600, 750)),
                aoa: +(clamp(p.aoa + rand(-0.2, 0.2), 0.5, 8.0)).toFixed(1),
                verticalSpeed: Math.round(clamp(p.verticalSpeed + rand(-20, 20), -1500, 1500)),
                courseHeading: Math.round((p.courseHeading + rand(-0.2, 0.2) + 360) % 360),
                waypointDist: +(clamp(p.waypointDist - rand(0, 0.05), 5, 80)).toFixed(1),
                tgtBearing: Math.round((p.tgtBearing + rand(-0.3, 0.3) + 360) % 360),
                tgtRange: +(clamp(p.tgtRange + rand(-0.2, 0.2), 10, 60)).toFixed(1),
                radarAzimuth: (p.radarAzimuth + 0.02) % (Math.PI * 2),
            }));
        }, 600);
        return () => clearInterval(id);
    }, []);
    return data;
}

type Tel = ReturnType<typeof useTelemetry>;

/* ══════════════════════════════════════════════
   TURKEY SIMPLIFIED COASTLINE (normalised 0-1)
   ══════════════════════════════════════════════ */
const turkeyCoast: [number, number][] = [
    [0.35, 0.18], [0.38, 0.15], [0.42, 0.14], [0.48, 0.13], [0.55, 0.14], [0.60, 0.12],
    [0.65, 0.15], [0.70, 0.13], [0.75, 0.16], [0.80, 0.15], [0.85, 0.18], [0.90, 0.20],
    [0.92, 0.24], [0.95, 0.28], [0.97, 0.32], [0.96, 0.38], [0.93, 0.42], [0.90, 0.45],
    [0.87, 0.50], [0.83, 0.52], [0.80, 0.56], [0.76, 0.58], [0.72, 0.60], [0.68, 0.62],
    [0.64, 0.60], [0.60, 0.58], [0.56, 0.60], [0.52, 0.62], [0.48, 0.60], [0.44, 0.58],
    [0.40, 0.60], [0.36, 0.62], [0.32, 0.64], [0.28, 0.62], [0.25, 0.58], [0.22, 0.55],
    [0.20, 0.50], [0.18, 0.45], [0.20, 0.40], [0.22, 0.35], [0.25, 0.30], [0.28, 0.25],
    [0.30, 0.22], [0.33, 0.19], [0.35, 0.18],
];

/* ══════════════════════════════════════════════
   PANEL 1 — MOVING MAP (TAK HRT / NAVİGASYON)
   ══════════════════════════════════════════════ */
function drawMovingMap(ctx: CanvasRenderingContext2D, w: number, h: number, col: string, _warnCol: string, tel: Tel) {
    ctx.clearRect(0, 0, w, h);

    /* background grid (topographic look) */
    ctx.strokeStyle = col + "12";
    ctx.lineWidth = 0.5;
    const gridSize = 24;
    for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    /* Turkey coastline silhouette */
    ctx.beginPath();
    turkeyCoast.forEach(([nx, ny], i) => {
        const px = nx * w;
        const py = ny * h;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle = col + "0a";
    ctx.fill();
    ctx.strokeStyle = col + "30";
    ctx.lineWidth = 1;
    ctx.stroke();

    /* terrain elevation blobs */
    const cx = w / 2, cy = h / 2;
    for (let i = 0; i < 6; i++) {
        const bx = (w * 0.15) + (i % 3) * (w * 0.3);
        const by = (h * 0.25) + Math.floor(i / 3) * (h * 0.4);
        const r = 30 + (i * 7) % 25;
        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, r);
        grad.addColorStop(0, col + "18");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(bx - r, by - r, r * 2, r * 2);
    }

    /* route line (cyan) */
    const waypoints = [
        { x: w * 0.15, y: h * 0.8 },
        { x: w * 0.3, y: h * 0.55 },
        { x: w * 0.55, y: h * 0.4 },
        { x: w * 0.75, y: h * 0.25 },
        { x: w * 0.9, y: h * 0.15 },
    ];

    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) {
        ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    /* waypoint markers */
    waypoints.forEach((wp, i) => {
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, 4, 0, Math.PI * 2);
        ctx.strokeStyle = col;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.font = "bold 7px monospace";
        ctx.fillStyle = col;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(`WP${i + 1}`, wp.x + 7, wp.y);
    });

    /* aircraft position (moving triangle) */
    const acX = cx + Math.sin(Date.now() * 0.0003) * 15;
    const acY = cy + Math.cos(Date.now() * 0.0004) * 10;
    const hdgRad = (tel.heading * Math.PI) / 180;

    ctx.save();
    ctx.translate(acX, acY);
    ctx.rotate(hdgRad);
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(-5, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(5, 6);
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();
    ctx.restore();

    /* heading vector line from aircraft */
    ctx.beginPath();
    ctx.moveTo(acX, acY);
    ctx.lineTo(acX + Math.sin(hdgRad) * 40, acY - Math.cos(hdgRad) * 40);
    ctx.strokeStyle = col + "66";
    ctx.lineWidth = 0.8;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    /* compass indicator (top) */
    ctx.font = "bold 9px monospace";
    ctx.fillStyle = col;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(`HDG ${pad3(tel.heading)}°`, cx, 6);

    /* coordinates readout (bottom) */
    ctx.font = "8px monospace";
    ctx.fillStyle = col + "bb";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(`${tel.lat.toFixed(4)}°N`, 6, h - 16);
    ctx.fillText(`${tel.lon.toFixed(4)}°E`, 6, h - 6);

    /* scale bar */
    ctx.textAlign = "right";
    ctx.fillText("20 NM", w - 6, h - 6);
    ctx.beginPath();
    ctx.moveTo(w - 60, h - 10);
    ctx.lineTo(w - 10, h - 10);
    ctx.strokeStyle = col + "88";
    ctx.lineWidth = 1;
    ctx.stroke();

    /* label */
    ctx.font = "bold 8px monospace";
    ctx.fillStyle = col + "66";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("TAK HRT", 6, 6);
}

/* ══════════════════════════════════════════════════
   PANEL 2 — TACTICAL SITUATION DISPLAY (TAK DURUM)
   ══════════════════════════════════════════════════ */
function drawTacticalSituation(ctx: CanvasRenderingContext2D, w: number, h: number, col: string, _warnCol: string, tel: Tel) {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.min(cx, cy) - 16;

    /* range rings */
    for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (maxR / 3) * i, 0, Math.PI * 2);
        ctx.strokeStyle = col + "18";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.font = "7px monospace";
        ctx.fillStyle = col + "44";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(`${i * 20}`, cx + (maxR / 3) * i + 3, cy);
    }

    /* cross lines */
    ctx.strokeStyle = col + "14";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR);
    ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy);
    ctx.stroke();

    /* 45-degree lines */
    for (let a = 0; a < 8; a++) {
        const rad = (a * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(rad) * 15, cy + Math.sin(rad) * 15);
        ctx.lineTo(cx + Math.cos(rad) * maxR, cy + Math.sin(rad) * maxR);
        ctx.strokeStyle = col + "0a";
        ctx.stroke();
    }

    /* radar sweep */
    const sweepAngle = tel.radarAzimuth;
    const sweepSpan = 0.6;
    for (let s = 0; s < 12; s++) {
        const t = s / 12;
        const a0 = sweepAngle - sweepSpan * (1 - t);
        const a1 = sweepAngle - sweepSpan * (1 - (t + 1) / 12);
        const alpha = Math.round((1 - t) * 0.2 * 255).toString(16).padStart(2, "0");
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, a0, a1);
        ctx.closePath();
        ctx.fillStyle = col + alpha;
        ctx.fill();
    }

    /* sweep line */
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweepAngle) * maxR, cy + Math.sin(sweepAngle) * maxR);
    ctx.strokeStyle = col + "66";
    ctx.lineWidth = 1;
    ctx.stroke();

    /* contacts/targets */
    const targets = [
        { r: 0.35, a: 0.8, type: "hostile" },
        { r: 0.55, a: 2.1, type: "hostile" },
        { r: 0.25, a: 4.5, type: "friendly" },
        { r: 0.7, a: 3.8, type: "friendly" },
        { r: 0.45, a: 5.2, type: "unknown" },
        { r: 0.8, a: 1.5, type: "hostile" },
    ];

    targets.forEach((tgt) => {
        const angleDiff = ((sweepAngle - tgt.a + Math.PI * 2) % (Math.PI * 2));
        const fade = angleDiff < 2.0 ? Math.max(0, 1 - angleDiff / 2.0) : 0;
        if (fade <= 0) return;

        const tx = cx + Math.cos(tgt.a) * (tgt.r * maxR);
        const ty = cy + Math.sin(tgt.a) * (tgt.r * maxR);
        const alpha = Math.round(fade * 255).toString(16).padStart(2, "0");

        if (tgt.type === "hostile") {
            /* red diamond */
            ctx.beginPath();
            ctx.moveTo(tx, ty - 5); ctx.lineTo(tx + 5, ty);
            ctx.lineTo(tx, ty + 5); ctx.lineTo(tx - 5, ty);
            ctx.closePath();
            ctx.strokeStyle = "#ff4444" + alpha;
            ctx.lineWidth = 1.2;
            ctx.stroke();
        } else if (tgt.type === "friendly") {
            /* green circle */
            ctx.beginPath();
            ctx.arc(tx, ty, 4, 0, Math.PI * 2);
            ctx.strokeStyle = "#44ff44" + alpha;
            ctx.lineWidth = 1.2;
            ctx.stroke();
        } else {
            /* yellow square */
            ctx.strokeStyle = "#ffaa44" + alpha;
            ctx.lineWidth = 1.2;
            ctx.strokeRect(tx - 4, ty - 4, 8, 8);
        }
    });

    /* own aircraft symbol */
    ctx.beginPath();
    ctx.moveTo(cx, cy - 6);
    ctx.lineTo(cx - 4, cy + 4);
    ctx.lineTo(cx, cy + 1);
    ctx.lineTo(cx + 4, cy + 4);
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();

    /* bearing/range info (bottom corners) */
    ctx.font = "8px monospace";
    ctx.fillStyle = col + "aa";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "left";
    ctx.fillText(`TGT BRG ${pad3(tel.tgtBearing)}°`, 6, h - 16);
    ctx.fillText(`RNG ${tel.tgtRange} NM`, 6, h - 6);

    ctx.textAlign = "right";
    ctx.fillText(`ALT ${tel.alt} FT`, w - 6, h - 6);

    /* heading caret top center */
    ctx.beginPath();
    ctx.moveTo(cx - 3, cy - maxR - 2);
    ctx.lineTo(cx + 3, cy - maxR - 2);
    ctx.lineTo(cx, cy - maxR + 3);
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();

    /* cardinal directions */
    ctx.font = "bold 8px monospace";
    ctx.fillStyle = col + "88";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("N", cx, cy - maxR - 5);
    ctx.textBaseline = "top";
    ctx.fillText("S", cx, cy + maxR + 5);
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    ctx.fillText("W", cx - maxR - 5, cy);
    ctx.textAlign = "left";
    ctx.fillText("E", cx + maxR + 5, cy);

    /* label */
    ctx.font = "bold 8px monospace";
    ctx.fillStyle = col + "66";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("TAK DURUM", 6, 6);
}

/* ════════════════════════════════════════════════════
   PANEL 3 — HSI / COMPASS ROSE / FLIGHT INSTRUMENTS
   ════════════════════════════════════════════════════ */
function drawHSI(ctx: CanvasRenderingContext2D, w: number, h: number, col: string, _warnCol: string, tel: Tel) {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2 + 8;
    const radius = Math.min(w, h) * 0.34;

    /* compass rose ring */
    const hdgRad = (-tel.heading * Math.PI) / 180;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(hdgRad);

    /* degree ticks */
    for (let deg = 0; deg < 360; deg += 5) {
        const rad = (deg * Math.PI) / 180;
        const isMajor = deg % 30 === 0;
        const isMid = deg % 10 === 0;
        const outerR = radius;
        const innerR = isMajor ? radius - 10 : isMid ? radius - 6 : radius - 3;

        ctx.beginPath();
        ctx.moveTo(Math.cos(rad) * outerR, Math.sin(rad) * outerR);
        ctx.lineTo(Math.cos(rad) * innerR, Math.sin(rad) * innerR);
        ctx.strokeStyle = isMajor ? col : col + "55";
        ctx.lineWidth = isMajor ? 1.5 : 0.6;
        ctx.stroke();

        /* labels at major ticks */
        if (isMajor) {
            const labelR = radius - 18;
            const lx = Math.cos(rad) * labelR;
            const ly = Math.sin(rad) * labelR;
            ctx.save();
            ctx.translate(lx, ly);
            ctx.rotate(-hdgRad); /* keep text upright */
            ctx.font = "bold 9px monospace";
            ctx.fillStyle = col;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const label = deg === 0 ? "N" : deg === 90 ? "E" : deg === 180 ? "S" : deg === 270 ? "W" : pad3(deg);
            ctx.fillText(label, 0, 0);
            ctx.restore();
        }
    }

    /* course deviation bar */
    const courseRad = (tel.courseHeading * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(Math.cos(courseRad) * (radius - 26), Math.sin(courseRad) * (radius - 26));
    ctx.lineTo(Math.cos(courseRad + Math.PI) * (radius - 26), Math.sin(courseRad + Math.PI) * (radius - 26));
    ctx.strokeStyle = col + "55";
    ctx.lineWidth = 2;
    ctx.stroke();

    /* heading bug */
    const bugRad = (tel.courseHeading * Math.PI) / 180;
    const bugR = radius + 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(bugRad) * bugR - 4 * Math.sin(bugRad), Math.sin(bugRad) * bugR + 4 * Math.cos(bugRad));
    ctx.lineTo(Math.cos(bugRad) * (bugR + 8), Math.sin(bugRad) * (bugR + 8));
    ctx.lineTo(Math.cos(bugRad) * bugR + 4 * Math.sin(bugRad), Math.sin(bugRad) * bugR - 4 * Math.cos(bugRad));
    ctx.fillStyle = col;
    ctx.fill();

    ctx.restore();

    /* aircraft symbol (fixed center) */
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(cx - 16, cy); ctx.lineTo(cx - 5, cy); ctx.lineTo(cx - 5, cy + 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 16, cy); ctx.lineTo(cx + 5, cy); ctx.lineTo(cx + 5, cy + 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - 5); ctx.lineTo(cx, cy + 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();

    /* heading caret (top fixed) */
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy - radius - 6);
    ctx.lineTo(cx + 4, cy - radius - 6);
    ctx.lineTo(cx, cy - radius);
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();

    /* digital heading readout (top center) */
    ctx.fillStyle = col + "15";
    ctx.fillRect(cx - 22, 6, 44, 16);
    ctx.strokeStyle = col + "44";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 22, 6, 44, 16);
    ctx.font = "bold 10px monospace";
    ctx.fillStyle = col;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(pad3(tel.heading) + "°", cx, 14);

    /* airspeed (left side) */
    ctx.font = "bold 10px monospace";
    ctx.fillStyle = col;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(String(tel.speed), 4, cy - 10);
    ctx.font = "7px monospace";
    ctx.fillStyle = col + "88";
    ctx.fillText("KTS", 4, cy + 5);
    ctx.fillText(`M${tel.mach}`, 4, cy + 15);

    /* altitude (right side) */
    ctx.font = "bold 10px monospace";
    ctx.fillStyle = col;
    ctx.textAlign = "right";
    ctx.fillText(String(tel.alt), w - 4, cy - 10);
    ctx.font = "7px monospace";
    ctx.fillStyle = col + "88";
    ctx.fillText("FT", w - 4, cy + 5);
    const vsSign = tel.verticalSpeed >= 0 ? "+" : "";
    ctx.fillText(`${vsSign}${tel.verticalSpeed}`, w - 4, cy + 15);

    /* G / AoA (bottom left) */
    ctx.font = "9px monospace";
    ctx.fillStyle = col;
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(`${tel.gForce}G`, 4, h - 16);
    ctx.fillText(`α ${tel.aoa}°`, 4, h - 6);

    /* waypoint info (bottom right) */
    ctx.textAlign = "right";
    ctx.fillStyle = col + "aa";
    ctx.fillText(`WP: ${tel.waypointDist} NM`, w - 4, h - 16);
    ctx.fillText(`CRS ${pad3(tel.courseHeading)}°`, w - 4, h - 6);

    /* label */
    ctx.font = "bold 8px monospace";
    ctx.fillStyle = col + "66";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("HSI / ADI", 6, 6);
}

/* ════════════════════════════════════════
   PANEL 4 — STORES / SYSTEMS (SİLAH/SİSTEM)
   ════════════════════════════════════════ */
function drawStores(ctx: CanvasRenderingContext2D, w: number, h: number, col: string, warnCol: string, tel: Tel) {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;

    /* aircraft planform silhouette */
    const sy = 40;
    const scale = Math.min(w, h) * 0.003;

    ctx.save();
    ctx.translate(cx, sy);
    ctx.scale(scale, scale);

    /* fuselage */
    ctx.beginPath();
    ctx.moveTo(0, -50);
    ctx.lineTo(-8, -30);
    ctx.lineTo(-10, 30);
    ctx.lineTo(-6, 50);
    ctx.lineTo(0, 55);
    ctx.lineTo(6, 50);
    ctx.lineTo(10, 30);
    ctx.lineTo(8, -30);
    ctx.closePath();
    ctx.strokeStyle = col + "66";
    ctx.lineWidth = 1;
    ctx.stroke();

    /* wings */
    ctx.beginPath();
    ctx.moveTo(-10, -5);
    ctx.lineTo(-45, 20);
    ctx.lineTo(-42, 25);
    ctx.lineTo(-10, 15);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(10, -5);
    ctx.lineTo(45, 20);
    ctx.lineTo(42, 25);
    ctx.lineTo(10, 15);
    ctx.closePath();
    ctx.stroke();

    /* tail fins */
    ctx.beginPath();
    ctx.moveTo(-6, 35);
    ctx.lineTo(-20, 48);
    ctx.lineTo(-18, 52);
    ctx.lineTo(-6, 45);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(6, 35);
    ctx.lineTo(20, 48);
    ctx.lineTo(18, 52);
    ctx.lineTo(6, 45);
    ctx.stroke();

    ctx.restore();

    /* hardpoints / weapon bays */
    const storeY = sy + 55 * scale;
    const weapons = [
        { name: "AIM-120C", pos: -0.35, status: "RDY", qty: 2 },
        { name: "SOM-J", pos: -0.12, status: "RDY", qty: 1 },
        { name: "SOM-J", pos: 0.12, status: "RDY", qty: 1 },
        { name: "AIM-120C", pos: 0.35, status: "RDY", qty: 2 },
    ];

    ctx.textBaseline = "middle";
    weapons.forEach((wpn) => {
        const wx = cx + wpn.pos * w;
        const wy = storeY + 15;

        /* bay indicator dot */
        ctx.beginPath();
        ctx.arc(wx, wy, 3, 0, Math.PI * 2);
        ctx.fillStyle = wpn.status === "RDY" ? "#44ff44" : wpn.status === "ARM" ? "#ff4444" : "#ffaa44";
        ctx.fill();

        /* connection line to aircraft */
        ctx.beginPath();
        ctx.moveTo(wx, wy - 3);
        ctx.lineTo(wx, storeY - 10);
        ctx.strokeStyle = col + "33";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        /* label */
        ctx.font = "7px monospace";
        ctx.fillStyle = col + "bb";
        ctx.textAlign = "center";
        ctx.fillText(wpn.name, wx, wy + 12);
        ctx.font = "6px monospace";
        ctx.fillStyle = col + "66";
        ctx.fillText(`×${wpn.qty} ${wpn.status}`, wx, wy + 21);
    });

    /* gun */
    ctx.font = "7px monospace";
    ctx.fillStyle = col + "88";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("M61 20mm: 480 RDS", cx, storeY + 42);

    /* ── Engine Status ── */
    const engY = storeY + 60;
    ctx.font = "bold 8px monospace";
    ctx.fillStyle = col + "77";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("ENGINE STATUS", 8, engY);

    /* ENG-1 */
    const barW = w / 2 - 14;
    const barH = 6;
    const e1Y = engY + 14;
    ctx.font = "7px monospace";
    ctx.fillStyle = col + "aa";
    ctx.fillText(`ENG-1  RPM ${tel.rpm1}%  EGT ${tel.egt1}°C`, 8, e1Y);

    ctx.fillStyle = col + "18";
    ctx.fillRect(8, e1Y + 10, barW, barH);
    ctx.fillStyle = col;
    ctx.fillRect(8, e1Y + 10, barW * (tel.rpm1 / 105), barH);

    /* ENG-2 */
    const e2Y = e1Y + 24;
    ctx.fillStyle = col + "aa";
    ctx.fillText(`ENG-2  RPM ${tel.rpm2}%  EGT ${tel.egt2}°C`, 8, e2Y);

    ctx.fillStyle = col + "18";
    ctx.fillRect(8, e2Y + 10, barW, barH);
    ctx.fillStyle = col;
    ctx.fillRect(8, e2Y + 10, barW * (tel.rpm2 / 105), barH);

    /* ── Fuel ── */
    const fuelY = e2Y + 30;
    ctx.font = "bold 8px monospace";
    ctx.fillStyle = col + "77";
    ctx.fillText("FUEL", 8, fuelY);

    ctx.font = "bold 14px monospace";
    ctx.fillStyle = tel.fuel < 30 ? warnCol : col;
    ctx.textAlign = "right";
    ctx.fillText(`${Math.round(tel.fuel)}%`, w - 8, fuelY);

    ctx.fillStyle = col + "18";
    ctx.fillRect(8, fuelY + 16, w - 16, 8);
    const fuelCol = tel.fuel < 30 ? warnCol : col;
    ctx.fillStyle = fuelCol;
    ctx.fillRect(8, fuelY + 16, (w - 16) * (tel.fuel / 100), 8);

    /* label */
    ctx.font = "bold 8px monospace";
    ctx.fillStyle = col + "66";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("SİLAH / SİSTEM", 6, 6);
}

/* ══════════════════════════════════════
   MFD Canvas Panel – renders one panel
   ══════════════════════════════════════ */
function MFDCanvas({
    drawFn,
    accent,
    warnColor,
    tel,
    id,
    onCanvasClick,
}: {
    drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number, col: string, warnCol: string, tel: Tel) => void;
    accent: string;
    warnColor: string;
    tel: Tel;
    id?: string;
    onCanvasClick?: (x: number, y: number, w: number, h: number) => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const telRef = useRef(tel);
    telRef.current = tel;

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const cw = canvas.clientWidth;
        const ch = canvas.clientHeight;
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
        ctx.scale(dpr, dpr);
        drawFn(ctx, cw, ch, accent, warnColor, telRef.current);
    }, [drawFn, accent, warnColor]);

    useEffect(() => {
        let raf: number;
        const loop = () => { draw(); raf = requestAnimationFrame(loop); };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [draw]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!onCanvasClick || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        onCanvasClick(x, y, rect.width, rect.height);
    }, [onCanvasClick]);

    return (
        <canvas
            id={id}
            ref={canvasRef}
            className="h-full w-full"
            style={{ background: "rgba(0,5,2,0.92)", cursor: onCanvasClick ? "crosshair" : "inherit" }}
            onClick={handleClick}
        />
    );
}

/* ══════════════════════════════════════
   OSB (Option Select Button) strip
   ══════════════════════════════════════ */
function OSBStrip({ count, accent, side }: { count: number; accent: string; side: "top" | "bottom" | "left" | "right" }) {
    const isVert = side === "left" || side === "right";
    return (
        <div className={`flex ${isVert ? "flex-col" : "flex-row"} justify-around`} style={{
            [isVert ? "width" : "height"]: "12px",
            [isVert ? "height" : "width"]: "100%",
        }}>
            {Array.from({ length: count }, (_, i) => (
                <div key={i} style={{
                    width: isVert ? "10px" : "14px",
                    height: isVert ? "14px" : "10px",
                    background: accent + "0a",
                    border: `1px solid ${accent}22`,
                    borderRadius: "1px",
                }} />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   MAIN COCKPIT DASHBOARD
   ═══════════════════════════════════════════════════════ */
export function CockpitDashboard() {
    const { locale } = useLanguage();
    const { mode } = useTheme();
    const tel = useTelemetry();
    const frameRef = useRef<HTMLDivElement>(null);

    const accent = mode === "night" ? "#22ff44" : "#00d4ff";
    const warnColor = mode === "night" ? "#ff4444" : "#ff6600";
    const [expandedPanel, setExpandedPanel] = useState<number | null>(null);
    const [selectedWeapon, setSelectedWeapon] = useState<number | null>(null);

    /* hover glow effect on the frame */
    const handleHover = useCallback(() => {
        if (!frameRef.current) return;
        gsap.fromTo(frameRef.current,
            { boxShadow: `0 0 30px ${accent}22, inset 0 0 20px ${accent}08` },
            { boxShadow: `0 0 10px ${accent}0a, inset 0 0 5px ${accent}04`, duration: 0.6, ease: "power2.out" }
        );
    }, [accent]);

    /* weapon bay click handler */
    const handleStoresClick = useCallback((x: number, _y: number, cw: number) => {
        const positions = [-0.35, -0.12, 0.12, 0.35];
        const clickRatio = (x / cw) - 0.5;
        let closest = 0;
        let minDist = 999;
        positions.forEach((p, i) => {
            const dist = Math.abs(clickRatio - p);
            if (dist < minDist) { minDist = dist; closest = i; }
        });
        if (minDist < 0.12) {
            setSelectedWeapon(prev => prev === closest ? null : closest);
        }
    }, []);

    /* panel click – expand/collapse */
    const togglePanel = useCallback((index: number) => {
        setExpandedPanel(prev => prev === index ? null : index);
    }, []);

    return (
        <section id="cockpit" className="relative z-10 px-4 py-20 md:px-8 lg:px-16">
            <div className="mx-auto max-w-7xl">
                {/* Section header */}
                <div className="mb-10 text-center">
                    <p
                        className="mb-2 text-[10px] tracking-[0.5em] uppercase"
                        style={{ color: accent, fontFamily: "var(--font-mono)" }}
                    >
                        {locale === "tr" ? "KOKPİT SİSTEMLERİ" : "COCKPIT SYSTEMS"}
                    </p>
                    <h2 className="text-3xl font-bold text-white md:text-5xl">
                        {locale === "tr" ? "Panoramik Kokpit Ekranı" : "Panoramic Cockpit Display"}
                    </h2>
                </div>

                {/* ── Panoramic Display Frame ── */}
                <div
                    ref={frameRef}
                    onMouseEnter={handleHover}
                    className="relative mx-auto overflow-hidden rounded-xl"
                    style={{
                        background: "linear-gradient(180deg, #0a0c0a 0%, #080a08 50%, #060806 100%)",
                        border: `2px solid ${accent}22`,
                        boxShadow: `0 0 10px ${accent}0a, inset 0 0 5px ${accent}04`,
                        maxWidth: "1100px",
                    }}
                >
                    {/* WARNING / CAUTION BAR */}
                    <div
                        className="flex items-center justify-between border-b px-2 py-1 sm:px-3"
                        style={{ borderColor: accent + "18", background: "#0a0a0a" }}
                    >
                        <div className="flex items-center gap-4">
                            <span className="rounded px-2 py-0.5 text-[8px] font-bold tracking-[0.15em]"
                                style={{ background: "#ff000020", color: "#ff4444", border: "1px solid #ff444433", fontFamily: "var(--font-mono)" }}>
                                WARNING
                            </span>
                            <span className="rounded px-2 py-0.5 text-[8px] font-bold tracking-[0.15em]"
                                style={{ background: "#ffaa0015", color: "#ffaa00", border: "1px solid #ffaa0033", fontFamily: "var(--font-mono)" }}>
                                CAUTION
                            </span>
                        </div>
                        <div className="hidden items-center gap-3 sm:flex">
                            <span className="text-[8px] tracking-[0.2em]" style={{ color: accent + "66", fontFamily: "var(--font-mono)" }}>
                                HDG {pad3(tel.heading)} // ALT {tel.alt} // M{tel.mach}
                            </span>
                            <span className="rounded px-2 py-0.5 text-[8px] font-bold tracking-[0.15em]"
                                style={{ background: accent + "12", color: accent, border: `1px solid ${accent}33`, fontFamily: "var(--font-mono)" }}>
                                NAV
                            </span>
                        </div>
                    </div>

                    {/* OSB strip top — hidden on mobile */}
                    <div className="hidden px-4 pt-1 sm:block">
                        <OSBStrip count={20} accent={accent} side="top" />
                    </div>

                    {/* ── 4-Panel Display Grid ── */}
                    <div className="flex flex-col gap-[2px] p-1 sm:p-2 md:flex-row" style={{ minHeight: "280px" }}>
                        {[
                            { label: "TAK HRT", drawFn: drawMovingMap, idx: 0 },
                            { label: "TAK DURUM", drawFn: drawTacticalSituation, idx: 1 },
                            { label: "HSI / ADI", drawFn: drawHSI, idx: 2 },
                            { label: "SİLAH / SİSTEM", drawFn: drawStores, idx: 3 },
                        ].map(panel => {
                            const isExpanded = expandedPanel === panel.idx;
                            const isHidden = expandedPanel !== null && expandedPanel !== panel.idx;
                            return (
                                <div
                                    key={panel.idx}
                                    className={`flex flex-col min-w-0 transition-all duration-500 ${isExpanded ? "flex-[4]" : isHidden ? "flex-0 opacity-0 overflow-hidden w-0 md:w-0" : "flex-1"
                                        }`}
                                    style={{ height: isExpanded ? "420px" : isHidden ? "0" : undefined }}
                                    data-panel-height
                                >
                                    <button
                                        onClick={() => togglePanel(panel.idx)}
                                        className="px-2 py-1.5 text-center text-[7px] font-bold tracking-[0.2em] uppercase transition-colors hover:opacity-100 active:scale-95 sm:py-0.5"
                                        style={{ color: accent + (isExpanded ? "cc" : "66"), fontFamily: "var(--font-mono)" }}
                                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${panel.label} panel`}
                                    >
                                        {panel.label} {isExpanded ? "▼" : "◆"}
                                    </button>
                                    <div
                                        className="flex-1 rounded border overflow-hidden"
                                        style={{ borderColor: accent + (isExpanded ? "44" : "18") }}
                                    >
                                        <MFDCanvas
                                            drawFn={panel.drawFn}
                                            accent={accent}
                                            warnColor={warnColor}
                                            tel={tel}
                                            id={panel.idx === 0 ? "radar-mfd" : undefined}
                                            onCanvasClick={panel.idx === 1 ? handleStoresClick : undefined}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* OSB strip bottom — hidden on mobile */}
                    <div className="hidden px-4 pb-1 sm:block">
                        <OSBStrip count={20} accent={accent} side="bottom" />
                    </div>

                    {/* Status bar bottom */}
                    <div
                        className="flex items-center justify-between border-t px-2 py-1 sm:px-4"
                        style={{ borderColor: accent + "18", background: "#0a0a0a" }}
                    >
                        <span className="text-[6px] tracking-[0.1em] sm:text-[7px] sm:tracking-[0.15em]" style={{ color: accent + "44", fontFamily: "var(--font-mono)" }}>
                            KAAN MMU // PCD v2.4
                        </span>
                        <span className="hidden text-[7px] tracking-[0.15em] sm:inline" style={{ color: accent + "44", fontFamily: "var(--font-mono)" }}>
                            {locale === "tr" ? "PANORAMIK KOKPİT EKRANI" : "PANORAMIC COCKPIT DISPLAY"}
                        </span>
                        <span className="text-[6px] tracking-[0.1em] sm:text-[7px] sm:tracking-[0.15em]" style={{ color: accent + "44", fontFamily: "var(--font-mono)" }}>
                            ASELSAN // HAVELSAN
                        </span>
                    </div>

                    {/* scan line effect */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div
                            className="absolute left-0 h-px w-full animate-scan-slow opacity-20"
                            style={{ background: `linear-gradient(90deg, transparent, ${accent}33, transparent)` }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
