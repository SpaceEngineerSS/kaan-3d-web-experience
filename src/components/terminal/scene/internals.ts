import * as THREE from "three";
import type { KaanFeatures } from "./shared";

/**
 * Procedural internals, built from the airframe's measured features. Lines only — never solid
 * meshes. Everything here is notional: engine fan/compressor discs, inlet S-ducts, the internal
 * weapons bay outline with notional store silhouettes, and the AESA array with a ±60° field of regard.
 *
 * Attributes: position, aSpin (1 = rotates about aCenter around Z), aCenter (x, y of the spin axis).
 */
class LineBuilder {
    pos: number[] = [];
    spin: number[] = [];
    center: number[] = [];

    seg(a: THREE.Vector3, b: THREE.Vector3, spin = 0, cx = 0, cy = 0) {
        this.pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
        this.spin.push(spin, spin);
        this.center.push(cx, cy, cx, cy);
    }

    /** Circle in the XY plane at depth z. */
    ring(cx: number, cy: number, z: number, r: number, segs = 32, spin = 0) {
        const a = new THREE.Vector3();
        const b = new THREE.Vector3();
        for (let i = 0; i < segs; i++) {
            const t0 = (i / segs) * Math.PI * 2;
            const t1 = ((i + 1) / segs) * Math.PI * 2;
            a.set(cx + Math.cos(t0) * r, cy + Math.sin(t0) * r, z);
            b.set(cx + Math.cos(t1) * r, cy + Math.sin(t1) * r, z);
            this.seg(a, b, spin, cx, cy);
        }
    }

    polyline(pts: THREE.Vector3[]) {
        for (let i = 0; i < pts.length - 1; i++) this.seg(pts[i], pts[i + 1]);
    }

    build() {
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(this.pos, 3));
        g.setAttribute("aSpin", new THREE.Float32BufferAttribute(this.spin, 1));
        g.setAttribute("aCenter", new THREE.Float32BufferAttribute(this.center, 2));
        g.computeBoundingSphere();
        return g;
    }
}

function engine(lb: LineBuilder, fan: THREE.Vector3, nozzle: THREE.Vector3, L: number) {
    const r = 0.024 * L;
    const { x: cx, y: cy } = fan;
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    // Fan + two compressor stages: rings and swept blades that spin.
    const stages: [number, number, number][] = [
        [fan.z, r, 18],
        [fan.z - 0.03 * L, r * 0.86, 14],
        [fan.z - 0.06 * L, r * 0.74, 12],
    ];
    for (const [z, rr, blades] of stages) {
        lb.ring(cx, cy, z, rr, 36);
        lb.ring(cx, cy, z, rr * 0.28, 12, 1);
        for (let i = 0; i < blades; i++) {
            const t = (i / blades) * Math.PI * 2;
            a.set(cx + Math.cos(t) * rr * 0.28, cy + Math.sin(t) * rr * 0.28, z);
            b.set(cx + Math.cos(t + 0.35) * rr * 0.97, cy + Math.sin(t + 0.35) * rr * 0.97, z);
            lb.seg(a, b, 1, cx, cy);
        }
    }
    // Casing: rings tapering to the nozzle and longitudinal stringers.
    const rings = 6;
    for (let i = 0; i <= rings; i++) {
        const t = i / rings;
        const z = THREE.MathUtils.lerp(fan.z, nozzle.z, t);
        const x = THREE.MathUtils.lerp(cx, nozzle.x, t);
        const y = THREE.MathUtils.lerp(cy, nozzle.y, t);
        lb.ring(x, y, z, r * THREE.MathUtils.lerp(1.12, 0.82, t), 28);
    }
    for (let k = 0; k < 8; k++) {
        const t = (k / 8) * Math.PI * 2;
        a.set(cx + Math.cos(t) * r * 1.12, cy + Math.sin(t) * r * 1.12, fan.z);
        b.set(nozzle.x + Math.cos(t) * r * 0.82, nozzle.y + Math.sin(t) * r * 0.82, nozzle.z);
        lb.seg(a, b);
    }
}

function sDuct(lb: LineBuilder, intake: THREE.Vector3, fan: THREE.Vector3, L: number) {
    const curve = new THREE.CubicBezierCurve3(
        intake.clone(),
        new THREE.Vector3(intake.x * 0.95, intake.y + 0.012 * L, intake.z - 0.1 * L),
        new THREE.Vector3(fan.x, fan.y + 0.02 * L, fan.z + 0.1 * L),
        fan.clone()
    );
    const steps = 24;
    const pts = curve.getPoints(steps);
    lb.polyline(pts);
    const r = 0.022 * L;
    const offs = [
        [r, 0],
        [-r, 0],
        [0, r],
        [0, -r],
    ];
    for (const [ox, oy] of offs) lb.polyline(pts.map((p) => new THREE.Vector3(p.x + ox, p.y + oy, p.z)));
    for (let i = 0; i <= steps; i += 4) lb.ring(pts[i].x, pts[i].y, pts[i].z, r, 20);
}

function store(lb: LineBuilder, x: number, y: number, zc: number, len: number, rad: number) {
    const z0 = zc - len / 2;
    const z1 = zc + len / 2;
    const v = (a: number, b: number, c: number) => new THREE.Vector3(a, b, c);
    // Body profile in side and plan view.
    lb.seg(v(x, y + rad, z0), v(x, y + rad, z1 - rad * 3));
    lb.seg(v(x, y - rad, z0), v(x, y - rad, z1 - rad * 3));
    lb.seg(v(x + rad, y, z0), v(x + rad, y, z1 - rad * 3));
    lb.seg(v(x - rad, y, z0), v(x - rad, y, z1 - rad * 3));
    // Ogive nose.
    for (const [ox, oy] of [
        [0, rad],
        [0, -rad],
        [rad, 0],
        [-rad, 0],
    ])
        lb.seg(v(x + ox, y + oy, z1 - rad * 3), v(x, y, z1));
    // Cruciform tail fins and mid-body strakes.
    const f = rad * 2.6;
    for (const [ox, oy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ]) {
        lb.seg(v(x + ox * rad, y + oy * rad, z0), v(x + ox * f, y + oy * f, z0 + rad * 0.6));
        lb.seg(v(x + ox * f, y + oy * f, z0 + rad * 0.6), v(x + ox * rad, y + oy * rad, z0 + rad * 4));
    }
    lb.ring(x, y, z0, rad, 10);
}

function bay(lb: LineBuilder, f: KaanFeatures) {
    const L = f.L;
    const y0 = f.bellyY + 0.004 * L;
    const y1 = y0 + 0.045 * L;
    const xw = 0.045 * L;
    const zA = f.box.min.z + 0.38 * L;
    const zB = f.box.min.z + 0.62 * L;
    const c = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    const lo = [c(-xw, y0, zA), c(xw, y0, zA), c(xw, y0, zB), c(-xw, y0, zB)];
    const hi = lo.map((p) => c(p.x * 0.9, y1, p.z));
    for (let i = 0; i < 4; i++) {
        lb.seg(lo[i], lo[(i + 1) % 4]);
        lb.seg(hi[i], hi[(i + 1) % 4]);
        lb.seg(lo[i], hi[i]);
    }
    // Door hinge lines along the centreline and the outer edges.
    lb.seg(c(0, y0, zA), c(0, y0, zB));
    // Four notional stores, two per side.
    const len = 0.18 * L;
    const rad = 0.0085 * L;
    const ys = y0 + 0.018 * L;
    const zc = (zA + zB) / 2;
    for (const x of [-0.033 * L, -0.013 * L, 0.013 * L, 0.033 * L]) store(lb, x, ys, zc, len, rad);
}

function aesa(lb: LineBuilder, f: KaanFeatures) {
    const L = f.L;
    const c = new THREE.Vector3(0, f.nose.y, f.nose.z - 0.1 * L);
    const r = 0.034 * L;
    // Array face: rim plus a grid of chords (T/R module rows).
    lb.ring(c.x, c.y, c.z, r, 40);
    for (let i = -3; i <= 3; i++) {
        const t = (i / 4) * r;
        const h = Math.sqrt(Math.max(r * r - t * t, 0));
        lb.seg(new THREE.Vector3(c.x - h, c.y + t, c.z), new THREE.Vector3(c.x + h, c.y + t, c.z));
        lb.seg(new THREE.Vector3(c.x + t, c.y - h, c.z), new THREE.Vector3(c.x + t, c.y + h, c.z));
    }
    // ±60° field of regard (notional): rays and two rings, no range implied.
    const len = 0.32 * L;
    const half = THREE.MathUtils.degToRad(60);
    const rays = 16;
    const tip = new THREE.Vector3();
    for (let i = 0; i < rays; i++) {
        const t = (i / rays) * Math.PI * 2;
        tip.set(c.x + Math.cos(t) * Math.sin(half) * len, c.y + Math.sin(t) * Math.sin(half) * len, c.z + Math.cos(half) * len);
        lb.seg(c, tip);
    }
    for (const k of [0.5, 1]) lb.ring(c.x, c.y, c.z + Math.cos(half) * len * k, Math.sin(half) * len * k, 48);
}

export function buildInternals(f: KaanFeatures) {
    const lb = new LineBuilder();
    engine(lb, f.fanR, f.nozzleR, f.L);
    engine(lb, f.fanL, f.nozzleL, f.L);
    const intakeL = f.intake.clone();
    intakeL.x = -intakeL.x;
    sDuct(lb, f.intake, f.fanR, f.L);
    sDuct(lb, intakeL, f.fanL, f.L);
    bay(lb, f);
    aesa(lb, f);
    return lb.build();
}
