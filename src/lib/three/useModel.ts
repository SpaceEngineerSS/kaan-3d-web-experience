"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export interface ModelOptions {
    /** Largest dimension after normalising, in scene units. */
    size: number;
    /** Swap PBR for Lambert (no image-based lighting). Use on tier 1. */
    lite?: boolean;
    /** Turn the model around Y so the nose faces the camera. */
    flip?: boolean;
    /** Override envMapIntensity on PBR materials. */
    envIntensity?: number;
}

function toLite(m: THREE.MeshStandardMaterial): THREE.Material {
    const lam = new THREE.MeshLambertMaterial({
        map: m.map,
        color: m.color,
        transparent: m.transparent,
        opacity: m.opacity,
        side: m.side,
        alphaTest: m.alphaTest,
    });
    lam.name = m.name;
    return lam;
}

/**
 * Load a GLB once (drei caches it), then hand back an independent, centred and scaled
 * copy whose materials belong to this instance only. Everything this hook creates is
 * disposed when the component unmounts or the options change. Shared geometry and
 * textures stay in drei's cache.
 */
export function useModel(path: string, { size, lite = false, flip = true, envIntensity }: ModelOptions) {
    const { scene } = useGLTF(path);

    const model = useMemo(() => {
        const clone = scene.clone(true);
        const owned: THREE.Material[] = [];

        clone.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;
            const convert = (m: THREE.Material): THREE.Material => {
                let out: THREE.Material;
                if (m instanceof THREE.MeshStandardMaterial) {
                    if (lite) out = toLite(m);
                    else {
                        const c = m.clone();
                        if (envIntensity !== undefined) c.envMapIntensity = envIntensity;
                        // KHR_materials_transmission makes three.js render an extra transmission pass that
                        // samples the scene behind it; on these exports it shows up as black/white noise.
                        // A plain transparent surface reads the same for a canopy and costs nothing.
                        if (c instanceof THREE.MeshPhysicalMaterial) {
                            // Exported anisotropy has no tangents here and adds shimmer; drop it.
                            c.anisotropy = 0;
                            if (c.transmission > 0) {
                                c.transmission = 0;
                                // Near-black metal with transmission is body paint, not glass: keep it opaque.
                                const isGlass = c.roughness < 0.05 && c.color.getHSL({ h: 0, s: 0, l: 0 }).l > 0.2;
                                if (isGlass) {
                                    c.transparent = true;
                                    c.opacity = Math.min(c.opacity, 0.45);
                                    c.depthWrite = false;
                                }
                            }
                        }
                        out = c;
                    }
                } else out = m.clone();
                owned.push(out);
                return out;
            };
            child.material = Array.isArray(child.material) ? child.material.map(convert) : convert(child.material);
        });

        const box = new THREE.Box3().setFromObject(clone);
        const center = box.getCenter(new THREE.Vector3());
        const dims = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(dims.x, dims.y, dims.z, 0.001);
        clone.position.set(-center.x, -center.y, -center.z);

        const wrapper = new THREE.Group();
        wrapper.add(clone);
        wrapper.scale.setScalar(size / maxDim);
        if (flip) wrapper.rotation.y = Math.PI;

        return { object: wrapper, materials: owned };
    }, [scene, size, lite, flip, envIntensity]);

    useEffect(() => {
        return () => {
            model.materials.forEach((m) => m.dispose());
        };
    }, [model]);

    return model;
}

/** Swap every mesh in `root` to `override` (or back to the originals when null). */
export function applyMaterialOverride(root: THREE.Object3D, override: THREE.Material | null, store: WeakMap<THREE.Mesh, THREE.Material | THREE.Material[]>) {
    root.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        if (!store.has(child)) store.set(child, child.material);
        child.material = override ?? store.get(child)!;
    });
}
