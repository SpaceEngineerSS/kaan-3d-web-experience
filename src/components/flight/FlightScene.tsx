"use client";
/* eslint-disable react-hooks/immutability -- three.js objects and the shared scroll source are mutated imperatively by design (render loop, not React state). */

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Cloud, Clouds, Environment, PerformanceMonitor, Sky } from "@react-three/drei";
import * as THREE from "three";
import { Aircraft } from "./Aircraft";
import { CLOUD_TEXTURE, Runway, Terrain } from "./world";
import { flight, sampleFlight } from "@/lib/flight/profile";
import type { DeviceProfile } from "@/hooks/useDeviceProfile";

/** 21 Feb, 08:50 local, Ankara: sun about 20° up, bearing ~120° (to the right of a 033 take-off). */
const SUN = new THREE.Vector3(0.94, 0.34, -0.05).normalize();
const HAZE = new THREE.Color("#a9bfd6");

export interface ScrollSource {
    /** Target progress written by the DOM (0..1). */
    target: number;
}

/** Camera keyframes in the aircraft's yaw frame (x left, y up, z forward) plus a cockpit weight. */
interface Shot {
    p: number;
    off: [number, number, number];
    look: [number, number, number];
    fov: number;
    pov: number;
}
/** Shots for the visor chapter. p here is progress through that chapter (0..1). */
const SHOTS: Shot[] = [
    { p: 0.0, off: [2.4, 0.5, -4.8], look: [0, 0.3, 1.5], fov: 40, pov: 0 },
    { p: 0.08, off: [0.8, 0.45, -2.0], look: [0, 0.3, 5], fov: 44, pov: 0 },
    { p: 0.13, off: [0, 0.165, 0.42], look: [0, 0.16, 20], fov: 58, pov: 1 },
    { p: 0.72, off: [0, 0.165, 0.42], look: [0, 0.16, 20], fov: 58, pov: 1 },
    { p: 0.8, off: [-1.6, 0.7, -3.0], look: [0, 0, 1], fov: 40, pov: 0 },
    { p: 0.9, off: [-3.8, 1.2, -1.6], look: [0, 0, 0.4], fov: 36, pov: 0 },
    { p: 1.0, off: [3.6, 1.1, 5.2], look: [0, 0, 0], fov: 34, pov: 0 },
];

/** Map chapter progress onto the full sortie profile: from just after lift-off to the cruise. */
export const SORTIE_FROM = 0.2;
export const SORTIE_TO = 0.97;

function shotAt(p: number, out: Shot) {
    let i = 1;
    while (i < SHOTS.length - 1 && p > SHOTS[i].p) i++;
    const a = SHOTS[i - 1];
    const b = SHOTS[i];
    const t0 = THREE.MathUtils.clamp((p - a.p) / (b.p - a.p || 1), 0, 1);
    const t = t0 * t0 * (3 - 2 * t0);
    for (let k = 0; k < 3; k++) {
        out.off[k] = a.off[k] + (b.off[k] - a.off[k]) * t;
        out.look[k] = a.look[k] + (b.look[k] - a.look[k]) * t;
    }
    out.fov = a.fov + (b.fov - a.fov) * t;
    // The cut into and out of the cockpit is fast: a hard-ish blend, not a slow dolly through the airframe.
    out.pov = THREE.MathUtils.smoothstep(a.pov + (b.pov - a.pov) * t, 0.35, 0.65);
    out.p = p;
}

const _yaw = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _look = new THREE.Vector3();
const _camExt = new THREE.Vector3();
const _camPov = new THREE.Vector3();
const _lookExt = new THREE.Vector3();
const _lookPov = new THREE.Vector3();
const _upPov = new THREE.Vector3();
const _Y = new THREE.Vector3(0, 1, 0);

function CameraRig({ scroll, reduced, onPov }: { scroll: ScrollSource; reduced: boolean; onPov: (on: boolean) => void }) {
    const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
    const shot = useMemo<Shot>(() => ({ p: 0, off: [0, 0, 0], look: [0, 0, 0], fov: 40, pov: 0 }), []);
    const pRef = useRef(scroll.target);
    const povOn = useRef(false);

    useFrame((state, dt) => {
        // Ease towards the scroll target; reduced motion jumps.
        const k = reduced ? 1 : 1 - Math.exp(-Math.min(dt, 0.05) * 6);
        pRef.current += (scroll.target - pRef.current) * k;
        const p = pRef.current;
        sampleFlight(SORTIE_FROM + p * (SORTIE_TO - SORTIE_FROM), flight);
        shotAt(p, shot);

        // Yaw-only frame keeps the horizon level for external shots.
        _v.set(0, 0, 1).applyQuaternion(flight.quaternion);
        _yaw.setFromAxisAngle(_Y, Math.atan2(_v.x, _v.z));

        _camExt.set(...shot.off).applyQuaternion(_yaw).add(flight.position);
        _lookExt.set(...shot.look).applyQuaternion(_yaw).add(flight.position);
        // Never let an external camera dip under the runway.
        _camExt.y = Math.max(_camExt.y, 0.12);

        // Cockpit: fixed to the airframe, so it pitches and banks with the jet.
        _camPov.set(0, 0.165, 0.42).applyQuaternion(flight.quaternion).add(flight.position);
        _lookPov.set(0, 0.16, 20).applyQuaternion(flight.quaternion).add(flight.position);
        _upPov.set(0, 1, 0).applyQuaternion(flight.quaternion);

        const w = shot.pov;
        camera.position.lerpVectors(_camExt, _camPov, w);
        _look.lerpVectors(_lookExt, _lookPov, w);
        camera.up.copy(_Y).lerp(_upPov, w).normalize();

        // Engine and runway rumble during the roll, a little buffet in the climb.
        if (!reduced) {
            const rumble = flight.onGround ? THREE.MathUtils.smoothstep(flight.knots, 20, 160) * 0.006 : flight.afterburner * 0.0018;
            const t = state.clock.elapsedTime;
            camera.position.x += Math.sin(t * 47.3) * rumble;
            camera.position.y += Math.sin(t * 61.1 + 1.3) * rumble;
        }

        camera.lookAt(_look);
        if (Math.abs(camera.fov - shot.fov) > 0.01) {
            camera.fov = shot.fov;
            camera.updateProjectionMatrix();
        }

        const on = w > 0.5;
        if (on !== povOn.current) {
            povOn.current = on;
            onPov(on);
        }
    });

    return null;
}

/** Hide the aircraft from the inside when the camera sits in the cockpit (no interior in the model). */
function CockpitCull({ povRef }: { povRef: React.RefObject<boolean> }) {
    const scene = useThree((s) => s.scene);
    useFrame(() => {
        const ac = scene.getObjectByName("kaan-aircraft");
        if (ac) ac.visible = !povRef.current;
    });
    return null;
}

function CloudLayer({ count }: { count: number }) {
    // Scattered cumulus along the climb, plus a far deck for the horizon.
    const puffs = useMemo(() => {
        const out: { pos: [number, number, number]; seed: number; bounds: [number, number, number]; vol: number }[] = [];
        let s = 3;
        const rnd = () => {
            s = (s * 16807) % 2147483647;
            return s / 2147483647;
        };
        for (let i = 0; i < count; i++) {
            const t = i / Math.max(1, count - 1);
            const x = -40 + t * 520 + (rnd() - 0.5) * 160;
            const z = -260 - t * 420 + (rnd() - 0.5) * 220;
            out.push({ pos: [x, 82 + rnd() * 40, z], seed: i + 1, bounds: [26 + rnd() * 20, 7 + rnd() * 5, 18 + rnd() * 10], vol: 16 + rnd() * 10 });
        }
        return out;
    }, [count]);

    return (
        <Clouds texture={CLOUD_TEXTURE} limit={count * 18} material={THREE.MeshLambertMaterial}>
            {puffs.map((c) => (
                <Cloud key={c.seed} seed={c.seed} position={c.pos} bounds={c.bounds} volume={c.vol} segments={16} speed={0.06} growth={4} color="#f4efe8" fade={260} opacity={0.9} />
            ))}
        </Clouds>
    );
}

function Atmosphere() {
    const scene = useThree((s) => s.scene);
    useEffect(() => {
        scene.fog = new THREE.FogExp2(HAZE, 0.00022);
        return () => {
            scene.fog = null;
        };
    }, [scene]);
    return null;
}

export interface FlightSceneProps {
    profile: DeviceProfile;
    scroll: ScrollSource;
    active: boolean;
    onPov: (on: boolean) => void;
}

export function FlightScene({ profile, scroll, active, onPov }: FlightSceneProps) {
    const lite = profile.tier === 1;
    const povRef = useRef(false);
    const sun = useMemo(() => SUN.clone().multiplyScalar(1000), []);

    return (
        <Canvas
            frameloop={active ? "always" : "never"}
            dpr={profile.dpr}
            shadows={profile.shadows}
            camera={{ position: [3, 2, -150], fov: 40, near: 0.05, far: 7000 }}
            gl={{
                antialias: profile.antialias,
                alpha: false,
                logarithmicDepthBuffer: true,
                powerPreference: profile.tier === 3 ? "high-performance" : "default",
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 0.62,
            }}
            onCreated={({ gl }) => {
                gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
            }}
        >
            <PerformanceMonitor />
            <Atmosphere />
            <Sky distance={4500} sunPosition={sun} turbidity={2.4} rayleigh={1.15} mieCoefficient={0.004} mieDirectionalG={0.82} />
            <hemisphereLight args={["#bcd2e8", "#6b5a43", 0.55]} />
            <directionalLight
                position={[sun.x * 0.05, sun.y * 0.05, sun.z * 0.05]}
                intensity={2.6}
                color="#fff1df"
                castShadow={profile.shadows}
                shadow-mapSize={[1024, 1024]}
                shadow-camera-left={-4}
                shadow-camera-right={4}
                shadow-camera-top={4}
                shadow-camera-bottom={-4}
            />
            {!lite && (
                <Environment resolution={64} frames={1}>
                    <Sky distance={4500} sunPosition={sun} turbidity={2.4} rayleigh={1.15} mieCoefficient={0.004} mieDirectionalG={0.82} />
                </Environment>
            )}

            <Suspense fallback={null}>
                <group name="kaan-aircraft">
                    <Aircraft lite={lite} />
                </group>
                <Terrain segments={lite ? 90 : 160} />
                <Runway />
                {profile.tier >= 2 && <CloudLayer count={profile.tier === 3 ? 22 : 12} />}
            </Suspense>

            <CameraRig
                scroll={scroll}
                reduced={profile.reducedMotion}
                onPov={(on) => {
                    povRef.current = on;
                    onPov(on);
                }}
            />
            <CockpitCull povRef={povRef} />
        </Canvas>
    );
}
