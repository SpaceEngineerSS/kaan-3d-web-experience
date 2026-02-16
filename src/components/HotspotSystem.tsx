"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Hotspot {
    id: string;
    position: [number, number, number];
    labelTR: string;
    labelEN: string;
    descTR: string;
    descEN: string;
}

const hotspots: Hotspot[] = [
    {
        id: "radar",
        position: [0, 0.2, 2.0],
        labelTR: "AESA Radar",
        labelEN: "AESA Radar",
        descTR: "Aktif Elektronik Taramalı Dizi radar sistemi. Eşzamanlı çoklu hedef takibi ve ileri elektronik harp yetenekleri sağlar.",
        descEN: "Active Electronically Scanned Array radar. Provides simultaneous multi-target tracking and advanced electronic warfare capabilities.",
    },
    {
        id: "cockpit",
        position: [0, 0.8, 1.2],
        labelTR: "Kokpit",
        labelEN: "Cockpit",
        descTR: "Panoramik geniş alanlı ekran (WAD), kask monte görüntüleme sistemi (HMDS) ve sesle kontrol arayüzü ile donatılmıştır.",
        descEN: "Equipped with panoramic Wide Area Display (WAD), Helmet-Mounted Display System (HMDS), and voice control interface.",
    },
    {
        id: "engine-intake",
        position: [0.8, -0.2, 0.3],
        labelTR: "Motor Giriş Kanalı",
        labelEN: "Engine Intake",
        descTR: "S-şekilli hava kanalları, motor türbin yüzeylerini radardan gizleyerek RKA'yı minimize eder.",
        descEN: "S-shaped air ducts conceal engine turbine faces from radar, minimizing RCS signature.",
    },
    {
        id: "weapons-bay",
        position: [0, -0.6, 0.5],
        labelTR: "Dahili Silah Yuvası",
        labelEN: "Internal Weapons Bay",
        descTR: "Gövde içi silah yuvaları, mühimmat yükünü taşıyarak radar kesit alanını azaltır. 6+ hardpoint kapasitesi.",
        descEN: "Internal weapons bays carry ordnance within the fuselage, reducing radar cross-section. 6+ hardpoint capacity.",
    },
    {
        id: "das",
        position: [-1.2, 0.3, 0.0],
        labelTR: "DAS Sensörü",
        labelEN: "DAS Sensor",
        descTR: "Dağıtık Açıklık Sistemi — 360° küresel kızılötesi kapsama ile füze uyarı ve hedef takip yeteneği.",
        descEN: "Distributed Aperture System — 360° spherical infrared coverage for missile warning and target tracking.",
    },
    {
        id: "wing",
        position: [1.8, 0.0, -0.3],
        labelTR: "Kanat Kontrol Yüzeyleri",
        labelEN: "Wing Control Surfaces",
        descTR: "Fly-by-wire uçuş kontrol sistemi ile yönetilen ileri kontrol yüzeyleri. 9G manevra yüküne dayanıklı.",
        descEN: "Advanced control surfaces managed by fly-by-wire flight control system. Withstands 9G maneuvering loads.",
    },
];

export function HotspotSystem() {
    const { locale } = useLanguage();
    const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

    return (
        <group>
            {hotspots.map((hotspot) => (
                <HotspotMarker
                    key={hotspot.id}
                    hotspot={hotspot}
                    locale={locale}
                    isActive={activeHotspot === hotspot.id}
                    onActivate={() =>
                        setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)
                    }
                />
            ))}
        </group>
    );
}

function HotspotMarker({
    hotspot,
    locale,
    isActive,
    onActivate,
}: {
    hotspot: Hotspot;
    locale: string;
    isActive: boolean;
    onActivate: () => void;
}) {
    const ringRef = useRef<THREE.Mesh>(null);
    const lineRef = useRef<THREE.Line>(null);

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z = state.clock.elapsedTime * 1.5;
            const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
            ringRef.current.scale.setScalar(scale);
        }
    });

    const label = locale === "tr" ? hotspot.labelTR : hotspot.labelEN;
    const desc = locale === "tr" ? hotspot.descTR : hotspot.descEN;

    return (
        <group position={hotspot.position}>
            {/* Pulsing ring */}
            <mesh ref={ringRef} onClick={onActivate}>
                <ringGeometry args={[0.07, 0.1, 24]} />
                <meshBasicMaterial
                    color={isActive ? "#ff4444" : "#00d4ff"}
                    transparent
                    opacity={isActive ? 0.9 : 0.6}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Centre dot */}
            <mesh onClick={onActivate}>
                <circleGeometry args={[0.035, 16]} />
                <meshBasicMaterial
                    color={isActive ? "#ff4444" : "#00d4ff"}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Label using drei Html — always faces the camera */}
            <Html
                center
                distanceFactor={5}
                occlude={false}
                zIndexRange={[100, 0]}
                style={{ pointerEvents: "auto", userSelect: "none" }}
            >
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onActivate();
                    }}
                    style={{
                        transform: "translateY(-30px)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                    }}
                >
                    {/* Tag pill */}
                    <div
                        style={{
                            whiteSpace: "nowrap",
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: "9px",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            padding: "3px 10px",
                            borderRadius: "6px",
                            border: `1px solid ${isActive ? "rgba(255,68,68,0.5)" : "rgba(0,212,255,0.35)"}`,
                            background: isActive
                                ? "rgba(255,40,40,0.18)"
                                : "rgba(0,212,255,0.12)",
                            color: isActive ? "#ff6666" : "#00d4ff",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            boxShadow: isActive
                                ? "0 0 12px rgba(255,68,68,0.25)"
                                : "0 0 12px rgba(0,212,255,0.15)",
                            transition: "all 0.25s ease",
                        }}
                    >
                        {label}
                    </div>

                    {/* Expanded description card */}
                    {isActive && (
                        <div
                            style={{
                                fontFamily: "JetBrains Mono, monospace",
                                fontSize: "8px",
                                lineHeight: "1.6",
                                maxWidth: "210px",
                                padding: "8px 10px",
                                borderRadius: "8px",
                                border: "1px solid rgba(0,212,255,0.18)",
                                background: "rgba(5,5,10,0.92)",
                                color: "#c5c5d8",
                                backdropFilter: "blur(14px)",
                                WebkitBackdropFilter: "blur(14px)",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                                transition: "all 0.3s ease",
                            }}
                        >
                            {desc}
                        </div>
                    )}
                </div>
            </Html>
        </group>
    );
}
