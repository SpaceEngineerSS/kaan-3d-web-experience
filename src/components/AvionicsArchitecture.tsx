"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Cpu } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SystemNode {
    id: string;
    nameTR: string;
    nameEN: string;
    descTR: string;
    descEN: string;
    devTR: string;
    devEN: string;
    color: string;
    x: number;
    y: number;
}

const systems: SystemNode[] = [
    { id: "mmp", nameTR: "Görev Platformu", nameEN: "Mission Platform", descTR: "Görev Yönetim Platformu — görev-kritik alt sistemlere hesaplama kaynağı sağlayan gerçek zamanlı ağ. İşlem modülleri ve ağ anahtarlarından oluşur. Veri işleme, grafik işleme, güvenlik ve sağlık izleme yeteneklerine sahiptir.", descEN: "Mission Management Platform — real-time computational network providing resources for mission-critical subsystems. Comprises processing modules and network switches. Handles data processing, graphic processing, security and health monitoring.", devTR: "TÜBİTAK BİLGEM", devEN: "TÜBİTAK BİLGEM", color: "#00d4ff", x: 35, y: 45 },
    { id: "fmp", nameTR: "Uçuş Platformu", nameEN: "Flight Platform", descTR: "Uçuş Yönetim Platformu — uçuş-kritik alt sistemlere ayrılmış gerçek zamanlı hesaplama ağı. Uçuş kontrol, navigasyon ve güvenlik fonksiyonlarını işler. Yüksek güvenilirlik sertifikasyonuna sahip işlemciler kullanır.", descEN: "Flight Management Platform — dedicated real-time computational network for flight-critical subsystems. Processes flight control, navigation and safety functions. Uses processors with high reliability certification.", devTR: "TÜBİTAK BİLGEM", devEN: "TÜBİTAK BİLGEM", color: "#00ff88", x: 65, y: 45 },
    { id: "aesa", nameTR: "AESA Radar", nameEN: "AESA Radar", descTR: "Aktif Elektronik Taramalı Dizi — eşzamanlı çoklu hedef takibi, SAR haritalama, hava-hava / hava-yer modları ve elektronik harp fonksiyonlarını tek bir aperturde birleştirir.", descEN: "Active Electronically Scanned Array — combines simultaneous multi-target tracking, SAR mapping, air-to-air / air-to-ground modes and electronic warfare functions in a single aperture.", devTR: "ASELSAN", devEN: "ASELSAN", color: "#ff6644", x: 50, y: 10 },
    { id: "das", nameTR: "DAS", nameEN: "DAS", descTR: "Dağıtık Açıklık Sistemi — gövde etrafına yerleştirilmiş 6 kızılötesi sensörle 360° küresel kapsama sağlar. Füze uyarı, hedef takip ve durum farkındalığı fonksiyonları.", descEN: "Distributed Aperture System — provides 360° spherical coverage with 6 IR sensors mounted around the fuselage. Missile warning, target tracking and situational awareness functions.", devTR: "ASELSAN", devEN: "ASELSAN", color: "#aa66ff", x: 12, y: 22 },
    { id: "ew", nameTR: "EH Süiti", nameEN: "EW Suite", descTR: "Elektronik Harp — radar uyarı alıcısı, aktif ve pasif karıştırma sistemleri. Düşük tespit olasılığı sağlayan gelişmiş dalga formları ve entegre anten yapıları.", descEN: "Electronic Warfare — radar warning receiver, active and passive jamming systems. Advanced waveforms for low probability of detection and integrated antenna structures.", devTR: "ASELSAN", devEN: "ASELSAN", color: "#ffaa22", x: 88, y: 22 },
    { id: "cns", nameTR: "CNS/NAV", nameEN: "CNS/NAV", descTR: "Haberleşme, Seyrüsefer, Gözetim — radyo haberleşme, taktik veri bağı, uydu navigasyonu, dost-düşman tanıma ve hava veri sensörleri entegrasyonu.", descEN: "Communication, Navigation, Surveillance — radio communications, tactical datalink, satellite navigation, friend-or-foe identification and air data sensor integration.", devTR: "ASELSAN / HAVELSAN", devEN: "ASELSAN / HAVELSAN", color: "#66ddaa", x: 12, y: 70 },
    { id: "mc", nameTR: "Sensör Füzyonu", nameEN: "Sensor Fusion", descTR: "Yapay zeka destekli sensör füzyon motoru — AESA, DAS, EH ve harici sensör verilerini birleştirerek ağ merkezli harp yeteneği sağlar. Tüm sensör verileri tek bir birleşik görüntüde pilota sunulur.", descEN: "AI-driven sensor fusion engine — merges AESA, DAS, EW and external sensor data for network-centric warfare capability. All sensor data presented to the pilot in a single unified display.", devTR: "HAVELSAN / TUSAŞ", devEN: "HAVELSAN / TUSAŞ", color: "#ff44aa", x: 88, y: 70 },
    { id: "wad", nameTR: "Kokpit Arayüzü", nameEN: "Cockpit Interface", descTR: "Panoramik Geniş Alanlı Ekran (WAD) — tüm uçuş ve taktik verilerin birleşik görüntülenmesi. TULGAR HMD entegrasyonu, kayıt sistemi ve gelecekte artırılmış gerçeklik (AR), dokunmatik ekran ve haptik geri bildirim desteği.", descEN: "Panoramic Wide Area Display (WAD) — unified display of all flight and tactical data. TULGAR HMD integration, recording system and future augmented reality (AR), touchscreen and haptic feedback support.", devTR: "ASELSAN", devEN: "ASELSAN", color: "#66ccff", x: 50, y: 85 },
    { id: "rdc", nameTR: "Veri Dağıtım Ağı", nameEN: "Data Distribution", descTR: "Dağıtık veri yoğunlaştırıcılar — giriş/çıkış fonksiyonlarını uçak genelinde dağıtarak kablo karmaşıklığını ve ağırlığı azaltır. Çeşitli standart arayüzlerle sensör ve aktüatör bağlantısı sağlar.", descEN: "Distributed data concentrators — distribute input/output functions across the aircraft to reduce wiring complexity and weight. Provide sensor and actuator connectivity via standard interfaces.", devTR: "TÜBİTAK BİLGEM", devEN: "TÜBİTAK BİLGEM", color: "#999999", x: 50, y: 55 },
];

const connections = [
    ["mmp", "aesa"], ["mmp", "das"], ["mmp", "ew"], ["mmp", "mc"], ["mmp", "wad"], ["mmp", "rdc"],
    ["fmp", "cns"], ["fmp", "wad"], ["fmp", "rdc"],
    ["mmp", "fmp"],
    ["mc", "aesa"], ["mc", "das"], ["mc", "ew"],
    ["rdc", "cns"], ["rdc", "das"], ["rdc", "ew"],
];

const platformFeatures = {
    tr: [
        { label: "Çoklu Güvenlik Seviyesi", desc: "Farklı gizlilik seviyelerinde eş zamanlı uygulama çalıştırabilme yeteneği" },
        { label: "Sağlam Bölümleme", desc: "Gerçek zamanlı işletim sistemi ile kaynak ve zaman bölümleme" },
        { label: "Dinamik Yeniden Yapılandırma", desc: "Arıza durumunda önceden tanımlı konfigürasyona otomatik geçiş" },
        { label: "Sağlık İzleme", desc: "Yerleşik testler ile bileşen ve modül seviyesinde sürekli durum takibi" },
    ],
    en: [
        { label: "Multi-Level Security", desc: "Ability to run applications at different classification levels simultaneously" },
        { label: "Robust Partitioning", desc: "Real-time operating system with resource and time partitioning" },
        { label: "Dynamic Reconfiguration", desc: "Automatic transition to pre-defined configuration in case of fault" },
        { label: "Health Monitoring", desc: "Continuous status tracking at component and module level with built-in tests" },
    ],
};

export function AvionicsArchitecture() {
    const { locale } = useLanguage();
    const [activeNode, setActiveNode] = useState<string | null>("mmp");
    const containerRef = useRef<HTMLDivElement>(null);
    const features = platformFeatures[locale];

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { gsap.fromTo(entry.target, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }); observer.unobserve(entry.target); } }); },
            { threshold: 0.15 }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const activeSystem = systems.find((s) => s.id === activeNode);

    return (
        <section id="avionics" className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
            <div ref={containerRef} className="mx-auto max-w-6xl opacity-0">
                <div className="mb-12">
                    <div className="mb-3 flex items-center gap-3">
                        <Cpu className="h-4 w-4 text-neon-blue" />
                        <div className="h-px w-10 bg-neon-blue/40" />
                        <span className="text-[10px] tracking-[0.4em] text-neon-blue/70 uppercase animate-hud-blink" style={{ fontFamily: "var(--font-mono)" }}>
                            {locale === "tr" ? "AVİYONİK MİMARİ" : "AVIONICS ARCHITECTURE"}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                        IMA <span className="text-gradient">{locale === "tr" ? "PLATFORM" : "PLATFORM"}</span>
                    </h2>
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-400">
                        {locale === "tr"
                            ? "Dağıtık modüler aviyonik mimarisi — Görev ve Uçuş olarak iki ana platforma ayrılmıştır. İşlem modülleri ve veri dağıtım ağı yüksek hızlı deterministik bağlantı ile birbirine bağlıdır."
                            : "Distributed modular avionics architecture — divided into two main platforms: Mission and Flight. Processing modules and data distribution network are interconnected via high-speed deterministic links."}
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                    {/* Network diagram */}
                    <div className="glass-panel relative rounded-2xl p-6" style={{ minHeight: "420px" }}>
                        <svg viewBox="0 0 100 100" className="absolute inset-6 h-[calc(100%-48px)] w-[calc(100%-48px)]">
                            {connections.map(([from, to], i) => {
                                const f = systems.find((s) => s.id === from)!;
                                const t = systems.find((s) => s.id === to)!;
                                const isActive = activeNode === from || activeNode === to;
                                return (
                                    <line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                                        stroke={isActive ? "#00d4ff" : "rgba(0,212,255,0.08)"}
                                        strokeWidth={isActive ? 0.5 : 0.2}
                                        strokeDasharray={isActive ? "none" : "2 2"}
                                        className="transition-all duration-500"
                                    />
                                );
                            })}
                        </svg>

                        {systems.map((sys) => {
                            const isActive = activeNode === sys.id;
                            const isConnected = activeNode ? connections.some(([a, b]) => (a === activeNode && b === sys.id) || (b === activeNode && a === sys.id)) : false;
                            const isPlatform = sys.id === "mmp" || sys.id === "fmp";
                            return (
                                <button key={sys.id} onClick={() => setActiveNode(activeNode === sys.id ? null : sys.id)}
                                    className={`absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isActive ? "z-10 scale-110" : isConnected ? "z-5 opacity-80" : "opacity-40 hover:opacity-70"}`}
                                    style={{ left: `${sys.x}%`, top: `${sys.y}%` }}
                                >
                                    <div className={`flex items-center justify-center rounded-full border transition-all duration-300 ${isPlatform ? "h-12 w-12 md:h-14 md:w-14" : "h-9 w-9 md:h-11 md:w-11"} ${isActive ? "border-2" : "border"}`}
                                        style={{ borderColor: isActive ? sys.color : "rgba(255,255,255,0.1)", backgroundColor: isActive ? sys.color + "20" : "rgba(10,10,20,0.8)" }}
                                    >
                                        <span className={`font-bold ${isPlatform ? "text-[8px] md:text-[10px]" : "text-[7px] md:text-[8px]"}`} style={{ color: sys.color, fontFamily: "var(--font-mono)" }}>
                                            {sys.id === "mmp" ? "MMP" : sys.id === "fmp" ? "FMP" : sys.id === "aesa" ? "AESA" : sys.id === "das" ? "DAS" : sys.id === "ew" ? "EW" : sys.id === "cns" ? "CNS" : sys.id === "mc" ? "FUSN" : sys.id === "rdc" ? "RDC" : "WAD"}
                                        </span>
                                    </div>
                                    <span className="text-[6px] text-slate-400 md:text-[7px]" style={{ fontFamily: "var(--font-mono)" }}>
                                        {locale === "tr" ? sys.nameTR : sys.nameEN}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Detail panel */}
                    <div className="space-y-4">
                        <div className="glass-panel rounded-2xl p-5">
                            {activeSystem ? (
                                <div className="space-y-3">
                                    <div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: activeSystem.color }} />
                                            <span className="text-sm font-bold text-white">{locale === "tr" ? activeSystem.nameTR : activeSystem.nameEN}</span>
                                        </div>
                                        <span className="rounded border px-2 py-0.5 text-[7px] tracking-[0.15em]" style={{ borderColor: activeSystem.color + "30", backgroundColor: activeSystem.color + "10", color: activeSystem.color + "aa", fontFamily: "var(--font-mono)" }}>
                                            {locale === "tr" ? activeSystem.devTR : activeSystem.devEN}
                                        </span>
                                    </div>
                                    <p className="text-[10px] leading-relaxed text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
                                        {locale === "tr" ? activeSystem.descTR : activeSystem.descEN}
                                    </p>
                                    <div className="space-y-1">
                                        <span className="text-[8px] tracking-[0.2em] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>
                                            {locale === "tr" ? "BAĞLANTI" : "LINKS"}
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                            {connections.filter(([a, b]) => a === activeSystem.id || b === activeSystem.id).map(([a, b], i) => {
                                                const other = systems.find((s) => s.id === (a === activeSystem.id ? b : a))!;
                                                return (
                                                    <button key={i} onClick={() => setActiveNode(other.id)} className="rounded bg-titanium/20 px-2 py-0.5 text-[7px] text-slate-400 transition-all hover:bg-titanium/40" style={{ fontFamily: "var(--font-mono)" }}>
                                                        {locale === "tr" ? other.nameTR : other.nameEN}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-xs text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>
                                    {locale === "tr" ? "Bir düğüme tıklayın" : "Click a node"}
                                </p>
                            )}
                        </div>

                        {/* Platform features */}
                        <div className="glass-panel rounded-2xl p-5">
                            <span className="text-[8px] tracking-[0.3em] text-neon-blue/50" style={{ fontFamily: "var(--font-mono)" }}>
                                {locale === "tr" ? "PLATFORM YETENEKLERİ" : "PLATFORM CAPABILITIES"}
                            </span>
                            <div className="mt-3 space-y-3">
                                {features.map((f, i) => (
                                    <div key={i}>
                                        <div className="text-[10px] font-bold text-white">{f.label}</div>
                                        <div className="text-[8px] leading-relaxed text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>{f.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
