"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

/** Deterministic value noise so the terrain is the same on every visit. */
function hash(x: number, y: number) {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
}
function vnoise(x: number, y: number) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi);
    const b = hash(xi + 1, yi);
    const c = hash(xi, yi + 1);
    const d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x: number, y: number) {
    let f = 0;
    let amp = 0.5;
    let fr = 1;
    for (let i = 0; i < 5; i++) {
        f += amp * vnoise(x * fr, y * fr);
        fr *= 2.03;
        amp *= 0.5;
    }
    return f;
}

/** Central Anatolian steppe: low rolling hills, dry ochre and sage, a flat apron around the airfield. */
export function Terrain({ segments = 160 }: { segments?: number }) {
    const geometry = useMemo(() => {
        const size = 5000;
        const g = new THREE.PlaneGeometry(size, size, segments, segments);
        g.rotateX(-Math.PI / 2);
        const pos = g.attributes.position as THREE.BufferAttribute;
        const colors = new Float32Array(pos.count * 3);
        const dry = new THREE.Color("#a08f68");
        const sage = new THREE.Color("#6f7552");
        const rock = new THREE.Color("#7d6e57");
        const field = new THREE.Color("#8c8a5c");
        const c = new THREE.Color();
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);
            const n = fbm(x / 520 + 11.3, z / 520 - 4.1);
            // Flatten a wide apron around the runway.
            const dx = Math.max(0, Math.abs(x) - 60) / 220;
            const dz = Math.max(0, z > 80 ? (z - 80) / 220 : z < -340 ? (-340 - z) / 220 : 0);
            const flat = Math.min(1, Math.hypot(dx, dz));
            const h = Math.pow(n, 1.6) * 95 * flat - 1.2;
            pos.setY(i, h);
            const t = THREE.MathUtils.clamp(h / 60, 0, 1);
            c.copy(field).lerp(dry, fbm(x / 90, z / 90)).lerp(sage, t * 0.6).lerp(rock, Math.max(0, t - 0.6));
            colors.set([c.r, c.g, c.b], i * 3);
        }
        g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        g.computeVertexNormals();
        return g;
    }, [segments]);

    useEffect(() => () => geometry.dispose(), [geometry]);

    return (
        <mesh geometry={geometry} receiveShadow>
            <meshStandardMaterial vertexColors roughness={0.95} metalness={0} flatShading />
        </mesh>
    );
}

/** Runway 03/21: asphalt, centreline, threshold bars, designators, edge lines. Drawn once on a canvas. */
export function Runway() {
    const texture = useMemo(() => {
        const W = 256;
        const H = 4096;
        const cv = document.createElement("canvas");
        cv.width = W;
        cv.height = H;
        const ctx = cv.getContext("2d")!;
        let seed = 17;
        const rnd = () => {
            seed = (seed * 16807) % 2147483647;
            return seed / 2147483647;
        };
        ctx.fillStyle = "#3b3d3f";
        ctx.fillRect(0, 0, W, H);
        // Aggregate speckle and tyre marks.
        for (let i = 0; i < 9000; i++) {
            const v = 50 + rnd() * 30;
            ctx.fillStyle = `rgba(${v},${v},${v + 2},0.35)`;
            ctx.fillRect(rnd() * W, rnd() * H, 1.5, 1.5);
        }
        ctx.fillStyle = "rgba(20,20,20,0.35)";
        for (let i = 0; i < 40; i++) ctx.fillRect(W / 2 - 40 + rnd() * 80, 200 + rnd() * 500, 3, 60 + rnd() * 120);
        ctx.fillStyle = "#e9e7df";
        // Edge lines
        ctx.fillRect(10, 0, 4, H);
        ctx.fillRect(W - 14, 0, 4, H);
        // Centreline dashes
        for (let y = 360; y < H - 360; y += 90) ctx.fillRect(W / 2 - 2, y, 4, 48);
        // Threshold piano keys and designators at both ends
        const keys = (y: number) => {
            for (let i = 0; i < 8; i++) {
                const x = 22 + i * 27;
                if (Math.abs(x + 9 - W / 2) < 14) continue;
                ctx.fillRect(x, y, 16, 110);
            }
        };
        keys(20);
        keys(H - 130);
        ctx.font = "bold 90px B612, Arial, sans-serif";
        ctx.textAlign = "center";
        // Canvas top maps to the far (-Z) end. "03" sits at the near threshold where the roll starts,
        // upright for an aircraft heading towards -Z; "21" is painted the other way round at the far end.
        ctx.save();
        ctx.translate(W / 2, H - 250);
        ctx.fillText("03", 0, 30);
        ctx.restore();
        ctx.save();
        ctx.translate(W / 2, 250);
        ctx.rotate(Math.PI);
        ctx.fillText("21", 0, 30);
        ctx.restore();
        const t = new THREE.CanvasTexture(cv);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        return t;
    }, []);

    useEffect(() => () => texture.dispose(), [texture]);

    // 45 m × 3,000 m. The aircraft lines up near the 03 threshold (z = +40) and rolls towards -Z.
    return (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, -100]} receiveShadow>
            <planeGeometry args={[4.5, 300]} />
            <meshStandardMaterial map={texture} roughness={0.9} metalness={0} />
        </mesh>
    );
}

/** A procedural cloud puff texture shipped in /public/textures; kept local because of the CSP. */
export const CLOUD_TEXTURE = "/textures/cloud.png";
