import { useEffect, useMemo } from "react";
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

export function useHangarEnvironment(enabled: boolean) {
    const gl = useThree((s) => s.gl);
    const env = useMemo(() => {
        if (!enabled) return null;
        const pmrem = new THREE.PMREMGenerator(gl);
        const scene = buildHangar();
        const rt = pmrem.fromScene(scene, 0.035);
        scene.traverse((o) => {
            const m = o as THREE.Mesh;
            if (m.isMesh) {
                m.geometry.dispose();
                (m.material as THREE.Material).dispose();
            }
        });
        pmrem.dispose();
        return rt;
    }, [gl, enabled]);

    useEffect(() => () => env?.dispose(), [env]);
    return env?.texture ?? null;
}
