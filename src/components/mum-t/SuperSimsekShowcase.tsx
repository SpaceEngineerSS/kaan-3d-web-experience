"use client";

import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";
import {
    Crosshair,
    Radio,
    Search,
    Flame,
    ShieldAlert,
    ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const MODEL_PATH = "/models/süperşimşek.glb";

function SuperSimsekModel() {
    const { scene } = useGLTF(MODEL_PATH);
    const groupRef = useRef<THREE.Group>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const model = useMemo(() => {
        const clone = scene.clone(true);

        clone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const convertMat = (m: THREE.Material): THREE.Material => {
                    if (m instanceof THREE.MeshStandardMaterial) {
                        if (isMobile) {
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
                        const mat = m.clone();
                        mat.envMap = null;
                        mat.envMapIntensity = 0;
                        return mat;
                    }
                    return m.clone();
                };
                if (Array.isArray(child.material)) {
                    child.material = child.material.map(convertMat);
                } else if (child.material) {
                    child.material = convertMat(child.material);
                }
            }
        });

        const box = new THREE.Box3().setFromObject(clone);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const sf = 4.5 / maxDim;

        clone.position.set(-center.x, -center.y, -center.z);

        const wrapper = new THREE.Group();
        wrapper.add(clone);
        wrapper.scale.setScalar(sf);

        wrapper.traverse((obj) => {
            obj.frustumCulled = false;
        });

        return wrapper;
    }, [scene]);

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        groupRef.current.rotation.y = t * 0.3;
        groupRef.current.position.y = Math.sin(t * 0.8) * 0.08;
    });

    return (
        <group ref={groupRef} scale={isMobile ? 0.7 : 1}>
            <primitive object={model} />
        </group>
    );
}

interface SpecItem {
    tag: string;
    value: string;
    unit: string;
}

const SPEC_ICONS = ["speed", "range", "weight", "warhead", "mission", "developer"] as const;

interface MissionProfile {
    icon: LucideIcon;
    tag: string;
    title: string;
    desc: string;
}

const MISSION_META = [
    { icon: Crosshair, tag: "DECOY" },
    { icon: Radio, tag: "EW/EA" },
    { icon: Search, tag: "ISR" },
    { icon: Flame, tag: "STRIKE" },
    { icon: ShieldAlert, tag: "SEAD" },
];

interface ChainNode {
    platform: string;
    role: string;
    tag: string;
}

/* CHAIN is now translated at runtime */

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, ease: "easeOut" as const },
};

export function SuperSimsekShowcase() {
    const { locale } = useLanguage();
    const mt = useMumtT(locale);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const SPECS = mt.simsekSpecs;
    const MISSIONS: MissionProfile[] = MISSION_META.map((m, i) => ({
        ...m,
        title: mt.simsekMissions[i]?.title ?? "",
        desc: mt.simsekMissions[i]?.desc ?? "",
    }));
    const CHAIN: ChainNode[] = mt.simsekChain;
    return (
        <section className="relative bg-[#020617] px-4 py-16 sm:px-6 md:px-12 md:py-28">
            <div className="mx-auto max-w-7xl">

                <motion.div {...fadeUp} className="mb-20 text-center">
                    <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-cyan-400/60">
                        {mt.simsek.tag}
                    </p>
                    <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                        {mt.simsek.title}{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            {mt.simsek.titleHighlight}
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
                        {mt.simsek.extendedDescription}
                    </p>
                </motion.div>

                <div className="mb-24 grid items-center gap-8 lg:grid-cols-5 lg:gap-12">
                    <motion.div
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: 0.1 }}
                        className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-cyan-500/10 sm:aspect-square lg:col-span-3"
                        style={{ background: "rgba(6, 10, 24, 0.8)" }}
                    >
                        <div className="absolute inset-0">
                            <Canvas
                                camera={{ position: [0, 1, 6], fov: 45 }}
                                dpr={1}
                                gl={{ antialias: false, alpha: true, powerPreference: isMobile ? "low-power" : "high-performance" }}
                                style={{ touchAction: "pan-y" }}
                            >
                                <Suspense fallback={null}>
                                    <ambientLight intensity={0.6} />
                                    <directionalLight
                                        position={[5, 8, 4]}
                                        intensity={1.4}
                                        color="#c8d6e5"
                                    />
                                    <pointLight position={[-3, 2, 4]} color="#00e5ff" intensity={0.5} distance={15} />
                                    {/* Environment removed — Lambert materials don't need IBL */}
                                    <SuperSimsekModel />
                                    <OrbitControls
                                        autoRotate={false}
                                        enableZoom={false}
                                        enablePan={false}
                                        enableRotate={!isMobile}
                                        maxPolarAngle={Math.PI * 0.65}
                                        minPolarAngle={Math.PI * 0.35}
                                    />
                                </Suspense>
                            </Canvas>
                        </div>

                        <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[9px] tracking-[0.2em] text-cyan-500/30">
                            {locale === "tr" ? "3D MODEL · DÖNDÜRMEK İÇİN SÜRÜKLE" : "3D MODEL · DRAG TO ROTATE"}
                        </div>
                    </motion.div>

                    <motion.div
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: 0.2 }}
                        className="flex flex-col gap-3 lg:col-span-2"
                    >
                        {SPECS.map((spec, i) => (
                            <motion.div
                                key={spec.tag}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                                className="group relative overflow-hidden rounded-lg border border-cyan-500/8 px-5 py-3.5 transition-colors duration-300 hover:border-cyan-500/20"
                                style={{ background: "rgba(10, 10, 20, 0.5)", backdropFilter: "blur(8px)" }}
                            >
                                <div className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.04) 0%, transparent 60%)" }}
                                />
                                <p className="mb-0.5 font-mono text-[9px] tracking-[0.25em] text-cyan-400/50">
                                    {spec.tag}
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-white">{spec.value}</span>
                                    <span className="text-[11px] text-slate-500">{spec.unit}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <motion.div {...fadeUp} className="mb-6 text-center">
                    <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-cyan-400/60">
                        {locale === "tr" ? "GÖREV PROFİLLERİ" : "MISSION PROFILES"}
                    </p>
                    <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                        {locale === "tr" ? "11 Göreve Tek Platform" : "One Platform, 11 Missions"}
                    </h3>
                </motion.div>

                <div className="mb-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {MISSIONS.map((m, i) => (
                        <motion.div
                            key={m.tag}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ delay: i * 0.08, duration: 0.45, ease: "easeOut" }}
                            className="group relative overflow-hidden rounded-xl border border-cyan-500/8 p-5 transition-colors duration-300 hover:border-cyan-500/20"
                            style={{ background: "rgba(10, 10, 20, 0.55)", backdropFilter: "blur(12px)" }}
                        >
                            <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.05) 0%, transparent 60%)" }}
                            />
                            <div className="relative">
                                <div className="mb-3 flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-cyan-500/15 bg-cyan-500/5">
                                        <m.icon className="h-4 w-4 text-cyan-400" />
                                    </div>
                                    <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-cyan-400/60">
                                        {m.tag}
                                    </span>
                                </div>
                                <h4 className="mb-1.5 text-sm font-bold text-white">{m.title}</h4>
                                <p className="text-[12px] leading-relaxed text-slate-400">{m.desc}</p>
                            </div>
                            <div
                                className="pointer-events-none absolute -bottom-px left-0 right-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                style={{ background: "linear-gradient(90deg, transparent, #00d4ff40, transparent)" }}
                            />
                        </motion.div>
                    ))}
                </div>

                <motion.div {...fadeUp} className="mb-6 text-center">
                    <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-cyan-400/60">
                        {locale === "tr" ? "KOMUTA ZİNCİRİ" : "COMMAND CHAIN"}
                    </p>
                    <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                        {locale === "tr" ? "Otonom Kol Uçuş Doktrini" : "Autonomous Wing Flight Doctrine"}
                    </h3>
                </motion.div>

                <div className="flex flex-col items-center gap-3 md:flex-row md:justify-center md:gap-0">
                    {CHAIN.map((node, i) => (
                        <div key={node.platform} className="flex items-center gap-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                className="group relative w-full overflow-hidden rounded-xl border border-cyan-500/10 p-4 text-center transition-colors duration-300 hover:border-cyan-500/25 sm:w-56 sm:p-5"
                                style={{ background: "rgba(10, 10, 20, 0.6)", backdropFilter: "blur(12px)" }}
                            >
                                <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, transparent 60%)" }}
                                />
                                <p className="mb-1 font-mono text-[9px] tracking-[0.25em] text-cyan-400/50">
                                    {node.tag}
                                </p>
                                <p className="mb-1 text-base font-bold text-white">{node.platform}</p>
                                <p className="text-[11px] text-slate-500">{node.role}</p>
                            </motion.div>

                            {i < CHAIN.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 + 0.25, duration: 0.3 }}
                                    className="hidden px-3 md:block"
                                >
                                    <div className="flex items-center gap-1">
                                        <div className="h-px w-8 bg-gradient-to-r from-cyan-500/40 to-cyan-400/20" />
                                        <ChevronRight className="h-4 w-4 text-cyan-500/40" />
                                    </div>
                                </motion.div>
                            )}

                            {i < CHAIN.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 + 0.25, duration: 0.3 }}
                                    className="flex items-center py-1 md:hidden"
                                >
                                    <div className="flex flex-col items-center gap-0.5">
                                        <div className="h-4 w-px bg-gradient-to-b from-cyan-500/40 to-cyan-400/20" />
                                        <ChevronRight className="h-3.5 w-3.5 rotate-90 text-cyan-500/40" />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
