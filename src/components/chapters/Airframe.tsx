"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Html, Lightformer, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { LazyMount } from "@/components/site/LazyMount";
import { useDeviceProfile, type DeviceProfile } from "@/hooks/useDeviceProfile";
import { useT } from "@/context/LanguageContext";
import { applyMaterialOverride, useModel } from "@/lib/three/useModel";
import { airframeCopy, features, VIEW_ORDER, VIEW_POSITIONS, type Feature, type ViewId } from "@/content/airframe";

const MODEL_PATH = "/models/KAAN.glb";
/** 20.3 m at 1 unit = 10 m. */
const MODEL_SIZE = 2.03;
/** The model has no landing gear: the ground sits about one gear height below the belly (−0.19). */
const GROUND_Y = -0.31;
const TARGET = new THREE.Vector3(0, 0, 0);

type Copy = (typeof airframeCopy)["tr"];

/** A camera move request. `n` changes on every request so the same view can be asked for twice. */
interface ViewRequest {
    view: ViewId;
    n: number;
}

/* ── Scene ──────────────────────────────────────────────────────────── */

/**
 * Daylight on an apron without an HDR file: an overcast sky panel overhead, a low sun, a bright
 * horizon band and a darker ground below. Rendered once into a cube map.
 */
function Daylight({ resolution }: { resolution: number }) {
    return (
        <Environment resolution={resolution} frames={1}>
            <color attach="background" args={["#7f8e9b"]} />
            {/* Sky */}
            <Lightformer form="rect" intensity={1.6} color="#d8e4ef" scale={[14, 14, 1]} position={[0, 6, 0]} rotation-x={Math.PI / 2} />
            {/* Sun, low in the south-east */}
            <Lightformer form="circle" intensity={9} color="#fff3df" scale={1.4} position={[5, 4.5, 3]} />
            {/* Horizon band, all round */}
            <Lightformer form="rect" intensity={1.1} color="#c5d3df" scale={[16, 1.6, 1]} position={[0, 0.6, -7]} />
            <Lightformer form="rect" intensity={1.1} color="#c5d3df" scale={[16, 1.6, 1]} position={[0, 0.6, 7]} />
            <Lightformer form="rect" intensity={0.9} color="#c5d3df" scale={[16, 1.6, 1]} position={[-7, 0.6, 0]} />
            <Lightformer form="rect" intensity={0.9} color="#c5d3df" scale={[16, 1.6, 1]} position={[7, 0.6, 0]} />
            {/* Concrete and fields below */}
            <Lightformer form="rect" intensity={0.55} color="#7c7a6c" scale={[16, 16, 1]} position={[0, -5, 0]} rotation-x={-Math.PI / 2} />
        </Environment>
    );
}

/** Snap each feature anchor onto the model skin with one ray, slightly outside so occlusion tests pass. */
function anchorsFor(root: THREE.Object3D) {
    const out = new Map<string, THREE.Vector3>();
    root.updateMatrixWorld(true);
    const ray = new THREE.Raycaster();
    for (const f of features) {
        const at = new THREE.Vector3(...f.anchor.at);
        const dir = new THREE.Vector3(...f.anchor.dir).normalize();
        ray.set(at.clone().addScaledVector(dir, -1.5), dir);
        const hit = ray.intersectObject(root, true)[0];
        out.set(f.id, hit ? hit.point.clone().addScaledVector(dir, -0.025) : at);
    }
    return out;
}

function Model({
    lite,
    wireframe,
    onReady,
    selected,
    onSelect,
    labels,
}: {
    lite: boolean;
    wireframe: boolean;
    onReady: () => void;
    selected: string | null;
    onSelect: (id: string) => void;
    labels: Record<string, string>;
}) {
    const { object } = useModel(MODEL_PATH, { size: MODEL_SIZE, lite, envIntensity: 1 });
    const modelRef = useRef<THREE.Group | null>(null);
    const anchors = useMemo(() => anchorsFor(object), [object]);
    const invalidate = useThree((s) => s.invalidate);
    const store = useRef(new WeakMap<THREE.Mesh, THREE.Material | THREE.Material[]>());
    const wireMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#0b0f14", wireframe: true, transparent: true, opacity: 0.55 }), []);

    useEffect(() => () => wireMat.dispose(), [wireMat]);

    useEffect(() => {
        applyMaterialOverride(object, wireframe ? wireMat : null, store.current);
        invalidate();
    }, [object, wireframe, wireMat, invalidate]);

    useEffect(() => {
        onReady();
        invalidate();
    }, [object, onReady, invalidate]);

    return (
        <>
            <group ref={modelRef}>
                <primitive object={object} />
            </group>
            {features.map((f, i) => {
                const p = anchors.get(f.id);
                if (!p) return null;
                return <Marker key={f.id} n={i + 1} feature={f} position={p} selected={selected === f.id} label={labels[f.id]} occluder={modelRef} onSelect={onSelect} />;
            })}
        </>
    );
}

function Marker({ n, feature, position, selected, label, occluder, onSelect }: { n: number; feature: Feature; position: THREE.Vector3; selected: boolean; label: string; occluder: RefObject<THREE.Group | null>; onSelect: (id: string) => void }) {
    const [hidden, setHidden] = useState(false);
    return (
        <Html position={position} center zIndexRange={[20, 0]} occlude={[occluder as RefObject<THREE.Object3D>]} onOcclude={setHidden}>
            <button
                type="button"
                onClick={() => onSelect(feature.id)}
                aria-pressed={selected}
                aria-label={`${n}. ${label}`}
                className={`t-data flex h-7 w-7 items-center justify-center border text-[0.75rem] transition-opacity duration-200 ${
                    selected ? "border-hmd bg-hmd text-ink" : "border-fg-2 bg-ink/85 text-fg hover:border-hmd hover:text-hmd"
                } ${feature.p1 && !selected ? "border-dashed" : ""}`}
                style={{ opacity: hidden && !selected ? 0.35 : 1 }}
            >
                {n}
            </button>
        </Html>
    );
}

function CameraRig({ request, fit, controlsRef, reducedMotion, animRef }: { request: ViewRequest; fit: number; controlsRef: RefObject<OrbitControlsImpl | null>; reducedMotion: boolean; animRef: RefObject<{ from: THREE.Spherical; to: THREE.Spherical; t: number } | null> }) {
    const camera = useThree((s) => s.camera);
    const invalidate = useThree((s) => s.invalidate);
    const scratch = useMemo(() => new THREE.Spherical(), []);

    useEffect(() => {
        const to = new THREE.Spherical().setFromVector3(new THREE.Vector3(...VIEW_POSITIONS[request.view]).multiplyScalar(fit));
        const c = controlsRef.current;
        // The first request only frames the model for this stage size; no need to animate it.
        if (reducedMotion || request.n === 0) {
            camera.position.setFromSpherical(to);
            camera.lookAt(TARGET);
            c?.target.copy(TARGET);
            c?.update();
            animRef.current = null;
        } else {
            const from = new THREE.Spherical().setFromVector3(camera.position.clone().sub(c?.target ?? TARGET));
            c?.target.copy(TARGET);
            // Turn the short way round.
            let d = to.theta - from.theta;
            d = Math.atan2(Math.sin(d), Math.cos(d));
            to.theta = from.theta + d;
            animRef.current = { from, to, t: 0 };
        }
        invalidate();
    }, [request, fit, camera, controlsRef, reducedMotion, animRef, invalidate]);

    useFrame((_, delta) => {
        const a = animRef.current;
        if (!a) return;
        // Demand mode: the first delta after an idle stretch can be seconds long.
        a.t = Math.min(1, a.t + Math.min(delta, 1 / 30) / 0.9);
        const e = a.t < 0.5 ? 4 * a.t ** 3 : 1 - (-2 * a.t + 2) ** 3 / 2;
        scratch.set(
            THREE.MathUtils.lerp(a.from.radius, a.to.radius, e),
            THREE.MathUtils.lerp(a.from.phi, a.to.phi, e),
            THREE.MathUtils.lerp(a.from.theta, a.to.theta, e)
        );
        scratch.makeSafe();
        camera.position.setFromSpherical(scratch).add(TARGET);
        camera.lookAt(TARGET);
        controlsRef.current?.update();
        if (a.t < 1) invalidate();
        else animRef.current = null;
    });

    return null;
}

function Scene({
    profile,
    wireframe,
    request,
    selected,
    onSelect,
    controlsEnabled,
    zoomEnabled,
    onReady,
    labels,
}: {
    profile: DeviceProfile;
    wireframe: boolean;
    request: ViewRequest;
    selected: string | null;
    onSelect: (id: string) => void;
    controlsEnabled: boolean;
    zoomEnabled: boolean;
    onReady: () => void;
    labels: Record<string, string>;
}) {
    const controlsRef = useRef<OrbitControlsImpl | null>(null);
    const animRef = useRef<{ from: THREE.Spherical; to: THREE.Spherical; t: number } | null>(null);
    const lite = profile.tier === 1;
    // Narrow stages need the camera further back to keep the whole aircraft in frame.
    const size = useThree((s) => s.size);
    const fit = Math.round(Math.min(1.9, Math.max(1, 1.2 / (size.width / Math.max(1, size.height)))) * 10) / 10;

    return (
        <>
            {lite ? (
                <>
                    <hemisphereLight args={["#d4e0ea", "#5f5c52", 1.6]} />
                    <directionalLight position={[5, 4.5, 3]} intensity={2.2} color="#fff3df" />
                </>
            ) : (
                <>
                    <Daylight resolution={profile.tier === 3 ? 256 : 128} />
                    <directionalLight position={[5, 4.5, 3]} intensity={1.4} color="#fff3df" />
                </>
            )}

            <Suspense fallback={null}>
                <Model lite={lite} wireframe={wireframe} onReady={onReady} selected={selected} onSelect={onSelect} labels={labels} />
                {profile.tier >= 2 && <ContactShadows position={[0, GROUND_Y, 0]} scale={3.4} far={0.7} blur={2.6} opacity={0.5} resolution={512} frames={1} color="#1d232a" />}
            </Suspense>

            <OrbitControls
                ref={controlsRef}
                makeDefault
                target={[0, 0, 0]}
                enabled={controlsEnabled}
                enablePan={false}
                enableZoom={zoomEnabled}
                enableDamping={!profile.reducedMotion}
                dampingFactor={0.08}
                rotateSpeed={0.7}
                zoomSpeed={0.6}
                minDistance={1.3}
                maxDistance={5.2 * fit}
                minPolarAngle={0.02}
                // A little below the horizon so the belly can be seen, never under the ground.
                maxPolarAngle={Math.PI / 2 + 0.14}
                onStart={() => {
                    animRef.current = null;
                }}
            />
            <CameraRig request={request} fit={fit} controlsRef={controlsRef} reducedMotion={profile.reducedMotion} animRef={animRef} />
        </>
    );
}

/* ── Stage ──────────────────────────────────────────────────────────── */

function Viewer({ profile, copy, wireframe, request, selected, onSelect }: { profile: DeviceProfile; copy: Copy; wireframe: boolean; request: ViewRequest; selected: string | null; onSelect: (id: string) => void }) {
    const root = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(true);
    const [ready, setReady] = useState(false);
    const [touchActive, setTouchActive] = useState(false);
    const [engaged, setEngaged] = useState(false);
    const touch = profile.isMobile;

    useEffect(() => {
        const el = root.current;
        if (!el || !("IntersectionObserver" in window)) return;
        const io = new IntersectionObserver(([e]) => {
            setInView(e.isIntersecting);
            if (!e.isIntersecting) {
                setTouchActive(false);
                setEngaged(false);
            }
        });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // OrbitControls sets touch-action: none on the canvas. On touch devices hand vertical panning back
    // to the page until the user opts in, so a swipe over the model still scrolls.
    useEffect(() => {
        if (!touch) return;
        const canvas = root.current?.querySelector("canvas");
        if (!canvas) return;
        const apply = () => canvas.style.setProperty("touch-action", touchActive ? "none" : "pan-y");
        apply();
        const id = requestAnimationFrame(apply);
        return () => cancelAnimationFrame(id);
    }, [touch, touchActive, ready]);

    const onReady = useCallback(() => setReady(true), []);
    const t = useT();
    const labels = useMemo(() => Object.fromEntries(features.map((f) => [f.id, t(f.title)])), [t]);
    const gl = useMemo(
        () => ({ antialias: profile.antialias, alpha: true, powerPreference: "high-performance" as const, toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1.05 }),
        [profile.antialias]
    );

    return (
        <div
            ref={root}
            className="absolute inset-0"
            role="group"
            aria-label={copy.canvasLabel}
            // Mouse: the wheel zooms only after the user has clicked into the model, so scrolling past never gets caught.
            onPointerDown={(e) => {
                if (e.pointerType === "mouse") setEngaged(true);
            }}
            onPointerLeave={(e) => {
                if (e.pointerType === "mouse") setEngaged(false);
            }}
        >
            <Canvas
                frameloop={inView ? "demand" : "never"}
                dpr={profile.dpr}
                gl={gl}
                camera={{ fov: 30, near: 0.05, far: 40, position: VIEW_POSITIONS.three }}
            >
                <Scene
                    profile={profile}
                    wireframe={wireframe}
                    request={request}
                    selected={selected}
                    onSelect={onSelect}
                    controlsEnabled={!touch || touchActive}
                    zoomEnabled={touch ? touchActive : engaged}
                    onReady={onReady}
                    labels={labels}
                />
            </Canvas>

            {!ready && (
                <p className="t-label pointer-events-none absolute inset-0 flex items-center justify-center text-ink/70" role="status">
                    {copy.loading}
                </p>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 md:p-4">
                <p className={`t-label text-ink/75 ${touch ? (touchActive ? "" : "invisible") : "hidden md:block"}`}>{touch ? copy.hintTouch : copy.hint}</p>
                {touch && (
                    <button type="button" className="btn pointer-events-auto ml-auto" aria-pressed={touchActive} onClick={() => setTouchActive((v) => !v)}>
                        {touchActive ? copy.deactivate : copy.activate}
                    </button>
                )}
            </div>
        </div>
    );
}

function Still({ copy }: { copy: Copy }) {
    return (
        <figure className="absolute inset-0 m-0">
            <Image src="/media/clips/chase.jpg" alt={copy.still.alt} width={854} height={480} className="h-full w-full object-cover" sizes="(min-width: 1024px) 66vw, 100vw" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-ink/80 px-4 py-3 text-[0.8125rem] text-fg-2">{copy.still.caption}</figcaption>
        </figure>
    );
}

/* ── Chapter ────────────────────────────────────────────────────────── */

export function Airframe() {
    const t = useT();
    const copy = t(airframeCopy);
    const profile = useDeviceProfile();
    const [request, setRequest] = useState<ViewRequest>({ view: "three", n: 0 });
    const [wireframe, setWireframe] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const segRef = useRef<HTMLDivElement>(null);

    const goTo = useCallback((view: ViewId) => setRequest((r) => ({ view, n: r.n + 1 })), []);
    const selectFromModel = useCallback((id: string) => setSelected((s) => (s === id ? null : id)), []);
    const selectFromList = (f: Feature) => {
        const next = selected === f.id ? null : f.id;
        setSelected(next);
        if (next) goTo(f.view);
    };

    const onSegKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const i = VIEW_ORDER.indexOf(request.view);
        const next = VIEW_ORDER[(i + (e.key === "ArrowRight" ? 1 : VIEW_ORDER.length - 1)) % VIEW_ORDER.length];
        goTo(next);
        segRef.current?.querySelector<HTMLButtonElement>(`[data-view="${next}"]`)?.focus();
    };

    const show3d = profile.ready && profile.tier > 0;

    return (
        <Chapter id="airframe" index={3} label={copy.label} title={copy.title} lede={copy.lede} solid>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-8">
                    {/* Controls */}
                    {show3d && (
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className="t-label" id="airframe-views">
                                    {copy.viewsLabel}
                                </span>
                                <div ref={segRef} className="seg" role="group" aria-labelledby="airframe-views" onKeyDown={onSegKey}>
                                    {VIEW_ORDER.map((v) => (
                                        <button key={v} type="button" data-view={v} aria-pressed={request.view === v} tabIndex={request.view === v ? 0 : -1} onClick={() => goTo(v)}>
                                            {copy.views[v]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="seg">
                                <button type="button" aria-pressed={wireframe} onClick={() => setWireframe((w) => !w)}>
                                    {copy.wireframe}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Stage */}
                    <div
                        className="relative h-[60svh] min-h-[22rem] overflow-hidden border border-edge-2 md:h-[80svh] md:max-h-[56rem]"
                        style={{ background: "linear-gradient(180deg, #a9b8c5 0%, #92a2b0 46%, #7b8791 64%, #5d666e 100%)" }}
                    >
                        {!profile.ready ? null : show3d ? (
                            <LazyMount minHeight="1px" rootMargin="400px 0px">
                                <Viewer profile={profile} copy={copy} wireframe={wireframe} request={request} selected={selected} onSelect={selectFromModel} />
                            </LazyMount>
                        ) : (
                            <Still copy={copy} />
                        )}
                    </div>

                    {/* Features */}
                    <h3 className="t-label mt-8">{copy.featuresTitle}</h3>
                    <ol className="mt-3 grid gap-px border border-edge bg-edge sm:grid-cols-2">
                        {features.map((f, i) => {
                            const on = selected === f.id;
                            return (
                                <li key={f.id} className="bg-ink">
                                    <button
                                        type="button"
                                        onClick={() => selectFromList(f)}
                                        aria-expanded={on}
                                        aria-controls={`airframe-f-${f.id}`}
                                        className="flex w-full items-baseline gap-3 px-4 py-3 text-left transition-colors hover:bg-ink-2"
                                    >
                                        <span className={`t-data inline-flex h-6 w-6 shrink-0 items-center justify-center border text-[0.75rem] ${on ? "border-hmd bg-hmd text-ink" : "border-edge-2 text-fg-2"} ${f.p1 && !on ? "border-dashed" : ""}`}>{i + 1}</span>
                                        <span className={`font-display text-lg font-semibold uppercase leading-tight ${on ? "text-hmd" : "text-fg"}`}>{t(f.title)}</span>
                                        {f.p1 && <span className="t-label ml-auto text-caution">{copy.p1Tag}</span>}
                                    </button>
                                    <div id={`airframe-f-${f.id}`} hidden={!on} className="px-4 pb-4 pl-[3.25rem]">
                                        <p className="t-body text-[0.9375rem]">{t(f.body)}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                    <SourceNote>
                        {copy.note} {copy.modelCredit}
                    </SourceNote>
                </div>

                {/* Side panel */}
                <aside className="lg:col-span-4">
                    <h3 className="t-label">{copy.dimsTitle}</h3>
                    <dl className="mt-3 grid grid-cols-2 gap-px border border-edge bg-edge">
                        {copy.dims.map((d) => (
                            <div key={d.k} className="bg-ink px-4 py-4">
                                <dt className="t-label">{d.k}</dt>
                                <dd className="mt-2 flex items-baseline gap-1.5">
                                    <span className="t-num text-4xl text-fg">{d.v}</span>
                                    <span className="t-data text-sm text-muted">{d.unit}</span>
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <SourceNote>{copy.dimsSource}</SourceNote>

                    <h3 className="t-label mt-10">{copy.compareTitle}</h3>
                    <div className="mt-3 border border-edge">
                        <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-3 border-b border-edge px-4 py-2">
                            {copy.compareHead.map((h, i) => (
                                <span key={i} className={`t-label ${i === 2 ? "text-caution" : ""}`}>
                                    {h}
                                </span>
                            ))}
                        </div>
                        <dl>
                            {copy.compare.map((r) => (
                                <div key={r.k} className="grid grid-cols-[1.1fr_1fr_1fr] gap-3 border-b border-edge px-4 py-2.5 text-[0.875rem] last:border-b-0">
                                    <dt className="text-muted">{r.k}</dt>
                                    <dd className="text-fg-2">{r.p0}</dd>
                                    <dd className="text-fg">{r.p1}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                    <SourceNote>{copy.note}</SourceNote>
                </aside>
            </div>
        </Chapter>
    );
}
