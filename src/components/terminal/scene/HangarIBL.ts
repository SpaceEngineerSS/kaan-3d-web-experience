/* eslint-disable react-hooks/immutability -- scene.environment is set on the three.js scene by design. */
import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { COLOR } from "./shared";

/**
 * A hangar environment baked once into a PMREM cube, with no image files:
 *  - six long cool ceiling strips (6500 K) running nose to tail
 *  - a large soft fill card on the left at ~15 %
 *  - a warm titanium rim card behind and above the tail
 *  - a dark floor so the underside stays in shadow
 * The returned texture feeds envMap on the airframe material only.
 */
function buildHangar(): THREE.Scene {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050607");
    const box = new THREE.BoxGeometry(1, 1, 1);
    const plane = new THREE.PlaneGeometry(1, 1);
    const emit = (hex: string, intensity: number) => new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(intensity), side: THREE.DoubleSide });

    const room = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color: "#07080a", side: THREE.BackSide }));
    room.scale.set(24, 10, 30);
    room.position.y = 3;
    scene.add(room);

    const cool = emit("#e8eef5", 8);
    for (let i = 0; i < 6; i++) {
        const strip = new THREE.Mesh(plane, cool);
        strip.rotation.x = Math.PI / 2;
        strip.scale.set(0.35, 18, 1);
        strip.position.set(-5 + i * 2, 7.9, 0);
        scene.add(strip);
    }

    const fill = new THREE.Mesh(plane, emit("#c7ced6", 0.9));
    fill.scale.set(10, 5, 1);
    fill.position.set(-11.8, 2.5, 2);
    fill.rotation.y = Math.PI / 2;
    scene.add(fill);

    const rim = new THREE.Mesh(plane, emit(COLOR.ti, 3.2));
    rim.scale.set(9, 2.2, 1);
    rim.position.set(3, 4.5, -14.8);
    scene.add(rim);

    const kick = new THREE.Mesh(plane, emit("#ffffff", 1.4));
    kick.scale.set(1.2, 6, 1);
    kick.position.set(11.8, 3, -4);
    kick.rotation.y = -Math.PI / 2;
    scene.add(kick);

    return scene;
}

/**
 * Bakes the hangar once the browser is idle (the PMREM pass and its shaders would otherwise land in
 * the first long task), then hands back the texture. `size` is the cube face resolution.
 */
export function useHangarEnvironment(enabled: boolean, size = 256) {
    const gl = useThree((s) => s.gl);
    const [env, setEnv] = useState<THREE.WebGLRenderTarget | null>(null);

    useEffect(() => {
        if (!enabled) return;
        let rt: THREE.WebGLRenderTarget | null = null;
        let cancelled = false;
        const run = () => {
            if (cancelled) return;
            const pmrem = new THREE.PMREMGenerator(gl);
            const scene = buildHangar();
            rt = pmrem.fromScene(scene, 0.035, 0.1, 100, { size });
            scene.traverse((o) => {
                const m = o as THREE.Mesh;
                if (m.isMesh) {
                    m.geometry.dispose();
                    (m.material as THREE.Material).dispose();
                }
            });
            pmrem.dispose();
            setEnv(rt);
        };
        const idle = typeof window.requestIdleCallback === "function";
        const id = idle ? window.requestIdleCallback(run, { timeout: 1500 }) : window.setTimeout(run, 300);
        return () => {
            cancelled = true;
            if (idle) window.cancelIdleCallback(id);
            else window.clearTimeout(id);
            rt?.dispose();
        };
    }, [gl, enabled, size]);

    return env?.texture ?? null;
}

/** Sets the procedural hangar as scene.environment, for scenes that light stock PBR materials with it. */
export function HangarEnvironment() {
    const scene = useThree((s) => s.scene);
    const env = useHangarEnvironment(true);
    useEffect(() => {
        const prev = scene.environment;
        scene.environment = env;
        return () => {
            scene.environment = prev;
        };
    }, [scene, env]);
    return null;
}

/**
 * The same hangar, pre-integrated into a 128 px matcap for phones and mid laptops: a sphere of normals
 * shaded with the reflected ceiling strips, the left fill and the warm rim. One texture lookup per
 * pixel instead of a PMREM bake and a full PBR shader.
 */
export function hangarMatcap(): THREE.CanvasTexture {
    const N = 128;
    const c = document.createElement("canvas");
    c.width = c.height = N;
    const g = c.getContext("2d")!;
    const img = g.createImageData(N, N);
    const ti = new THREE.Color(COLOR.ti);
    for (let py = 0; py < N; py++) {
        for (let px = 0; px < N; px++) {
            const x = ((px + 0.5) / N) * 2 - 1;
            const y = 1 - ((py + 0.5) / N) * 2;
            const d = x * x + y * y;
            const i = (py * N + px) * 4;
            if (d > 1) {
                img.data[i + 3] = 0;
                continue;
            }
            const z = Math.sqrt(1 - d);
            // reflect the view ray (0,0,1) about the normal
            const rx = 2 * z * x;
            const ry = 2 * z * y;
            const rz = 2 * z * z - 1;
            const diffuse = 0.1 + 0.22 * Math.max(0, y) + 0.06 * Math.max(0, -x);
            const strips = ry > 0.35 ? Math.pow(Math.max(0, Math.cos(rx * 9)), 6) * Math.min(1, (ry - 0.35) * 2.2) * 0.55 : 0;
            const sky = Math.max(0, ry) * 0.12;
            const fill = Math.max(0, -rx) * Math.max(0, 1 - Math.abs(ry)) * 0.1;
            const rim = Math.max(0, -rz) * Math.max(0, ry + 0.2) * 0.5;
            const fres = Math.pow(1 - z, 3) * 0.25;
            const v = diffuse + strips + sky + fill + fres;
            img.data[i] = Math.min(255, (v + rim * ti.r) * 255);
            img.data[i + 1] = Math.min(255, (v + rim * ti.g) * 255);
            img.data[i + 2] = Math.min(255, (v * 1.04 + rim * ti.b) * 255);
            img.data[i + 3] = 255;
        }
    }
    g.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
}
