import { airFrame, affiliationColour, boxedText, circle, fs, line, lw, measure, ownship, P, pad3, rowH, text, type DrawPage, type Frame } from "./draw";
import { ACTIVE_STPT, BULLSEYE, bearingRange, ROUTE, THREAT, toBody, type Track } from "./sim";

const D2R = Math.PI / 180;
const COMPASS: Record<number, string> = { 0: "N", 90: "E", 180: "S", 270: "W" };

/** Small black plate behind a label so it reads over map lines. */
function plate(f: Frame, s: string, x: number, y: number, size: number, align: CanvasTextAlign = "center") {
    const w = measure(f, s, size);
    const h = fs(f, size);
    const left = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
    f.ctx.fillStyle = P.bg;
    f.ctx.fillRect(left - 4, y - h * 0.6, w + 8, h * 1.2);
}

function dataBlock(f: Frame, tr: Track, x: number, y: number, s: number) {
    const c = affiliationColour[tr.kind];
    const size = 22;
    const lh = rowH(f, size);
    text(f, String(Math.round(tr.alt / 1000)), x + s * 1.6, y - lh * 0.55, { size, color: c });
    text(f, `M${tr.mach.toFixed(2).slice(1)}`, x + s * 1.6, y + lh * 0.45, { size, color: c });
}

function leader(f: Frame, tr: Track, ownHdg: number, x: number, y: number, s: number) {
    const rel = (tr.hdg - ownHdg) * D2R;
    const len = 26 + tr.mach * 30;
    const sx = x;
    const sy = y - s * 0.55;
    line(f, sx, sy, sx + Math.sin(rel) * len, sy - Math.cos(rel) * len, affiliationColour[tr.kind], 3);
}

/** Tactical situation display: heading-up plan view, ownship one third up from the bottom. */
export const drawTSD: DrawPage = (f, r) => {
    const { sim, ctx } = f;
    const hdgSize = 26;
    const cx = r.x + r.w / 2;
    const oy = r.y + (r.h * 2) / 3;
    const top = r.y + rowH(f, hdgSize) * 1.5;
    const k = (oy - top) / 80;
    const scr = (x: number, y: number): [number, number] => {
        const b = toBody(x, y, sim.hdg);
        return [cx + b.right * k, oy - b.ahead * k];
    };

    // Range rings.
    for (const nm of [10, 20, 40, 80]) circle(f, cx, oy, nm * k, P.dim, 2);

    // Compass rose on the 40 nm ring.
    const R = 40 * k;
    for (let d = 0; d < 360; d += 10) {
        const a = (d - sim.hdg - 90) * D2R;
        const major = d % 30 === 0;
        const t0 = R - (major ? 18 : 10);
        line(f, cx + Math.cos(a) * t0, oy + Math.sin(a) * t0, cx + Math.cos(a) * R, oy + Math.sin(a) * R, P.grey, 2);
        // On small screens the minimum text size would crowd the rose: keep the cardinal points only.
        if (major && (d % 90 === 0 || fs(f, 20) <= 28)) {
            const lbl = COMPASS[d] ?? String(d / 10);
            const lr = R - 18 - fs(f, 20) * 0.9;
            text(f, lbl, cx + Math.cos(a) * lr, oy + Math.sin(a) * lr, { size: 20, color: P.grey, align: "center" });
        }
    }

    // Ring scale labels, left of ownship and slightly below, clear of the route ahead.
    const la = Math.PI * 0.9;
    for (const nm of [10, 20, 40, 80]) {
        const x = cx + Math.cos(la) * nm * k;
        const y = oy + Math.sin(la) * nm * k;
        plate(f, String(nm), x, y, 20);
        text(f, String(nm), x, y, { size: 20, color: P.grey, align: "center" });
    }

    // Threat ring.
    const [tx, ty] = scr(THREAT.x, THREAT.y);
    circle(f, tx, ty, THREAT.r * k, P.red, 3);
    plate(f, THREAT.label, tx, ty - THREAT.r * k, 22);
    text(f, THREAT.label, tx, ty - THREAT.r * k, { size: 22, color: P.red, align: "center" });

    // Bullseye.
    const [bx, by] = scr(BULLSEYE.x, BULLSEYE.y);
    circle(f, bx, by, 10, P.cyan, 2);
    circle(f, bx, by, 22, P.cyan, 2);
    line(f, bx - 30, by, bx + 30, by, P.cyan, 2);
    line(f, bx, by - 30, bx, by + 30, P.cyan, 2);

    // Route and steerpoints.
    ctx.beginPath();
    ROUTE.forEach((p, i) => {
        const [x, y] = scr(p.x, p.y);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = P.magenta;
    ctx.lineWidth = lw(f, 3);
    ctx.stroke();
    for (const p of ROUTE) {
        const [x, y] = scr(p.x, p.y);
        const active = p.n === ACTIVE_STPT;
        ctx.beginPath();
        ctx.arc(x, y, active ? 13 : 10, 0, Math.PI * 2);
        ctx.fillStyle = active ? P.magenta : P.bg;
        ctx.fill();
        ctx.strokeStyle = P.magenta;
        ctx.lineWidth = lw(f, 3);
        ctx.stroke();
        text(f, String(p.n), x + 22, y + 22, { size: 22, color: P.magenta });
    }

    // Tracks.
    const s = Math.max(17, 8 / f.scale);
    for (const tr of sim.tracks) {
        const [x, y] = scr(tr.x, tr.y);
        if (x < r.x - 60 || x > r.x + r.w + 60 || y < r.y - 60 || y > r.y + r.h + 60) continue;
        leader(f, tr, sim.hdg, x, y, s);
        airFrame(f, tr.kind, x, y, s);
        if (tr.kind !== "friend" && tr.id !== "H2") dataBlock(f, tr, x, y, s);
    }

    ownship(f, cx, oy, Math.max(24, 11 / f.scale));

    // Heading box and lubber line.
    line(f, cx, top, cx, top + 16, P.text, 3);
    boxedText(f, pad3(sim.hdg), cx, r.y + rowH(f, hdgSize) * 0.65, { size: hdgSize, align: "center" });

    // Readouts.
    const lh = rowH(f, 22);
    const br = bearingRange(BULLSEYE.x, BULLSEYE.y, 0, 0);
    text(f, `BULL ${pad3(br.brg)}/${Math.round(br.rng)}`, r.x + 12, r.y + lh * 0.6, { size: 22, color: P.cyan });
    text(f, `TAS ${Math.round(sim.tas)}`, r.x + 12, r.y + lh * 1.6, { size: 22, color: P.text });
    text(f, "HDG UP", r.x + r.w - 12, r.y + lh * 0.6, { size: 22, color: P.grey, align: "right" });
    text(f, "RNG 80", r.x + r.w - 12, r.y + lh * 1.6, { size: 22, color: P.grey, align: "right" });
    const st = ROUTE.find((p) => p.n === ACTIVE_STPT)!;
    const sr = bearingRange(0, 0, st.x, st.y);
    text(f, `STPT ${ACTIVE_STPT}  ${pad3(sr.brg)}/${sr.rng.toFixed(1)}`, r.x + 12, r.y + r.h - lh * 0.7, { size: 22, color: P.magenta });
};

/** Triangle wave in [-1, 1]. */
const tri = (u: number) => 2 * Math.abs(2 * (u - Math.floor(u + 0.5))) - 1;

/** Radar B-scope: azimuth across, range up. */
export const drawRDR: DrawPage = (f, r) => {
    const { sim } = f;
    const size = 22;
    const lh = rowH(f, size);
    const padX = measure(f, "80", size) + 34;
    const fx = r.x + padX;
    const fy = r.y + lh * 2;
    const fw = r.w - padX * 2;
    const fh = r.h - lh * 2 - lh * 1.8;
    const RNG = 80;
    const ax = (az: number) => fx + ((az + 60) / 120) * fw;
    const ry = (nm: number) => fy + fh - (nm / RNG) * fh;

    f.ctx.strokeStyle = P.dim;
    f.ctx.lineWidth = lw(f, 2);
    f.ctx.strokeRect(fx, fy, fw, fh);

    for (const az of [-30, 0, 30]) line(f, ax(az), fy, ax(az), fy + fh, P.faint, 2, [10, 12]);
    for (const nm of [20, 40, 60]) line(f, fx, ry(nm), fx + fw, ry(nm), P.faint, 2, [10, 12]);

    for (let az = -60; az <= 60; az += 10) {
        const long = az % 30 === 0;
        line(f, ax(az), fy + fh, ax(az), fy + fh + (long ? 16 : 9), P.grey, 2);
    }
    for (const az of [-60, -30, 0, 30, 60]) {
        text(f, String(Math.abs(az)), ax(az), fy + fh + 16 + lh * 0.6, { size, color: P.grey, align: "center" });
    }
    for (const nm of [20, 40, 60, 80]) {
        line(f, fx - 12, ry(nm), fx, ry(nm), P.grey, 2);
        text(f, String(nm), fx - 18, ry(nm), { size, color: P.grey, align: "right" });
    }

    // Scan position marker under the field.
    const scan = 60 * tri(sim.t / 4.8);
    line(f, ax(scan), fy + fh - 26, ax(scan), fy + fh, P.text, 3);

    // Tracks inside ±60° and range.
    const s = Math.max(16, 8 / f.scale);
    let lead: { x: number; y: number } | null = null;
    for (const tr of sim.tracks) {
        const b = toBody(tr.x, tr.y, sim.hdg);
        const az = Math.atan2(b.right, b.ahead) / D2R;
        const rng = Math.hypot(b.right, b.ahead);
        if (Math.abs(az) > 60 || rng > RNG || b.ahead <= 0) continue;
        const x = ax(az);
        const y = ry(rng);
        leader(f, tr, sim.hdg, x, y, s);
        airFrame(f, tr.kind, x, y, s);
        if (tr.id !== "H2") text(f, String(Math.round(tr.alt / 1000)), x + s * 1.4, y - s * 0.4, { size, color: affiliationColour[tr.kind] });
        if (tr.id === "H1") lead = { x, y };
    }

    // Acquisition cursor beside the lead hostile.
    if (lead) {
        const cx = lead.x - 70;
        const cy = lead.y + 46;
        line(f, cx - 9, cy - 20, cx - 9, cy + 20, P.text, 3);
        line(f, cx + 9, cy - 20, cx + 9, cy + 20, P.text, 3);
    }

    text(f, "AA  TWS", r.x + 12, r.y + lh * 0.6, { size, color: P.text });
    text(f, "MURAD", r.x + r.w / 2, r.y + lh * 0.6, { size, color: P.grey, align: "center" });
    text(f, `RNG ${RNG}`, r.x + r.w - 12, r.y + lh * 0.6, { size, color: P.grey, align: "right" });
    text(f, "AZ ±60", r.x + r.w - 12, r.y + lh * 1.5, { size, color: P.grey, align: "right" });
};
