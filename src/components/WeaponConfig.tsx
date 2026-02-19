"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Crosshair } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface WeaponLoadout {
    id: string;
    labelTR: string;
    labelEN: string;
    modeTR: string;
    modeEN: string;
    descTR: string;
    descEN: string;
    weapons: { nameTR: string; nameEN: string; typeTR: string; typeEN: string; qty: number; devTR: string; devEN: string }[];
}

const loadouts: WeaponLoadout[] = [
    {
        id: "air-superiority",
        labelTR: "HAVA ÜSTÜNLÜĞÜ",
        labelEN: "AIR SUPERIORITY",
        modeTR: "STEALTH — DAHİLİ YUVA",
        modeEN: "STEALTH — INTERNAL BAY",
        descTR: "Tam hava hakimiyeti. GÖKTUĞ projesi kapsamında geliştirilen yerli AAM'ler ile tüm angajman zarflarında üstünlük. Dahili silah yuvalarından gizli fırlatma.",
        descEN: "Full air dominance. Indigenous AAMs from the GÖKTUĞ program covering all engagement envelopes. Stealth launch from internal weapons bays.",
        weapons: [
            { nameTR: "Gökhan", nameEN: "Gokhan", typeTR: "Çok Uzun Menzil BVR — Ramjet Tahrikli (geliştirme aşamasında)", typeEN: "Very Long Range BVR — Ramjet-Powered (in development)", qty: 4, devTR: "TÜBİTAK SAGE", devEN: "TÜBİTAK SAGE" },
            { nameTR: "Bozdoğan", nameEN: "Bozdogan", typeTR: "Kısa Menzil WVR — IIR Arayıcı, İtki Vektör Kontrol, 25+ km", typeEN: "Short Range WVR — IIR Seeker, Thrust Vector Control, 25+ km", qty: 2, devTR: "TÜBİTAK SAGE", devEN: "TÜBİTAK SAGE" },
        ],
    },
    {
        id: "bvr-sweep",
        labelTR: "BVR SÜPÜRME",
        labelEN: "BVR SWEEP",
        modeTR: "STEALTH — DAHİLİ YUVA",
        modeEN: "STEALTH — INTERNAL BAY",
        descTR: "Uzun menzil hava hakimiyeti. Gökbora ramjet füzeleri ile AWACS, tanker ve yüksek değerli hedeflere angajman. İç istasyondan fırlatma ile stealth korunur.",
        descEN: "Long range air dominance. Gokbora ramjet missiles for engagement against AWACS, tankers and high-value targets. Stealth preserved via internal bay launch.",
        weapons: [
            { nameTR: "Gökbora", nameEN: "Gokbora", typeTR: "Uzun Menzil BVR — Katı Yakıtlı Ramjet, 100+ NM (resmî), İç İstasyon Uyumlu", typeEN: "Long Range BVR — Solid Fuel Ramjet, 100+ NM (official), Internal Bay Compatible", qty: 2, devTR: "Roketsan", devEN: "Roketsan" },
            { nameTR: "Gökdoğan", nameEN: "Gokdogan", typeTR: "Orta Menzil BVR — Aktif Radar Arayıcı, 65+ km (resmî)", typeEN: "Medium Range BVR — Active Radar Seeker, 65+ km (official)", qty: 2, devTR: "TÜBİTAK SAGE", devEN: "TÜBİTAK SAGE" },
            { nameTR: "Bozdoğan", nameEN: "Bozdogan", typeTR: "Kısa Menzil WVR — IIR, İtki Vektör Kontrol, 25+ km", typeEN: "Short Range WVR — IIR, Thrust Vector Control, 25+ km", qty: 2, devTR: "TÜBİTAK SAGE", devEN: "TÜBİTAK SAGE" },
        ],
    },
    {
        id: "deep-strike",
        labelTR: "DERİN TAARRUZ",
        labelEN: "DEEP STRIKE",
        modeTR: "STEALTH — DAHİLİ YUVA",
        modeEN: "STEALTH — INTERNAL BAY",
        descTR: "Stealth derin taarruz. SOM-J seyir füzesi dahili yuvaya özel düşük RKA tasarımıyla stratejik hedeflere vuruş. TOLUN SDB, SADAK-4T salanıyla istasyon başına 4'lü taşınır.",
        descEN: "Stealth deep strike. SOM-J cruise missile with low-RCS design purpose-built for internal bays. TOLUN SDB carried in quad packs via SADAK-4T rack.",
        weapons: [
            { nameTR: "SOM-J", nameEN: "SOM-J", typeTR: "Seyir Füzesi — IIR, INS/GPS/TRN, 275 km (üretici datası)", typeEN: "Cruise Missile — IIR, INS/GPS/TRN, 275 km (manufacturer data)", qty: 2, devTR: "Roketsan / TÜBİTAK SAGE", devEN: "Roketsan / TÜBİTAK SAGE" },
            { nameTR: "TOLUN", nameEN: "TOLUN", typeTR: "Minyatür Bomba (SDB) — INS/GPS, Testlerde 100+ km, SADAK-4T", typeEN: "Miniature Bomb (SDB) — INS/GPS, 100+ km in tests, SADAK-4T", qty: 4, devTR: "ASELSAN / TÜBİTAK SAGE", devEN: "ASELSAN / TÜBİTAK SAGE" },
            { nameTR: "Bozdoğan", nameEN: "Bozdogan", typeTR: "Öz-Savunma WVR — IIR, İtki Vektör Kontrol", typeEN: "Self-Defense WVR — IIR, Thrust Vector Control", qty: 2, devTR: "TÜBİTAK SAGE", devEN: "TÜBİTAK SAGE" },
        ],
    },
    {
        id: "sead",
        labelTR: "SEAD / DEAD",
        labelEN: "SEAD / DEAD",
        modeTR: "KARMA — DAHİLİ + HARİCİ",
        modeEN: "MIXED — INTERNAL + EXTERNAL",
        descTR: "Düşman hava savunma bastırma/imha. Akbaba anti-radyasyon füzesi radar sistemlerini pasif olarak izler ve imha eder. ÇAKIR sürü konsepti görevleri ile SAM mevzilerini etkisiz hale getirir.",
        descEN: "Suppression/Destruction of Enemy Air Defenses. Akbaba anti-radiation missile passively tracks and destroys radar systems. ÇAKIR neutralizes SAM sites with swarm concept missions.",
        weapons: [
            { nameTR: "Akbaba", nameEN: "Akbaba", typeTR: "Anti-Radyasyon Füzesi — Detaylar kamuya açık değil (geliştirmede)", typeEN: "Anti-Radiation Missile — Details not publicly disclosed (in development)", qty: 2, devTR: "Roketsan / TÜBİTAK", devEN: "Roketsan / TÜBİTAK" },
            { nameTR: "ÇAKIR", nameEN: "ÇAKIR", typeTR: "Seyir Füzesi — Turbojet, Sürü Konsepti, 150+ km (resmî)", typeEN: "Cruise Missile — Turbojet, Swarm Concept, 150+ km (official)", qty: 2, devTR: "Roketsan", devEN: "Roketsan" },
            { nameTR: "Bozdoğan", nameEN: "Bozdogan", typeTR: "Öz-Savunma WVR — IIR Arayıcı, 25+ km", typeEN: "Self-Defense WVR — IIR Seeker, 25+ km", qty: 2, devTR: "TÜBİTAK SAGE", devEN: "TÜBİTAK SAGE" },
        ],
    },
    {
        id: "modular",
        labelTR: "MODÜLER TAARRUZ",
        labelEN: "MODULAR STRIKE",
        modeTR: "KARMA — DAHİLİ + HARİCİ",
        modeEN: "MIXED — INTERNAL + EXTERNAL",
        descTR: "KUZGUN modüler mühimmat ailesi ile esnek taarruz. Turbojet motorlu KUZGUN-TJ ile derin hedeflere ulaşım. Çoklu arayıcı başlık seçenekleri (IIR, Lazer, Radar, mmW).",
        descEN: "Flexible strike with KUZGUN modular munition family. KUZGUN-TJ with turbojet for deep target reach. Multiple seeker options (IIR, Laser, Radar, mmW).",
        weapons: [
            { nameTR: "KUZGUN-TJ", nameEN: "KUZGUN-TJ", typeTR: "Modüler Mühimmat — Turbojet, 150+ km (resmî), <85 kg, Çoklu Arayıcı", typeEN: "Modular Munition — Turbojet, 150+ km (official), <85 kg, Multi-Seeker", qty: 4, devTR: "TÜBİTAK SAGE", devEN: "TÜBİTAK SAGE" },
            { nameTR: "Gökdoğan", nameEN: "Gokdogan", typeTR: "Orta Menzil BVR — Aktif Radar, 65+ km", typeEN: "Medium Range BVR — Active Radar, 65+ km", qty: 2, devTR: "TÜBİTAK SAGE", devEN: "TÜBİTAK SAGE" },
            { nameTR: "Bozdoğan", nameEN: "Bozdogan", typeTR: "Kısa Menzil WVR — IIR Arayıcı", typeEN: "Short Range WVR — IIR Seeker", qty: 2, devTR: "TÜBİTAK SAGE", devEN: "TÜBİTAK SAGE" },
        ],
    },
    {
        id: "naval-strike",
        labelTR: "DENİZ TAARRUZU",
        labelEN: "NAVAL STRIKE",
        modeTR: "KARMA — DAHİLİ + HARİCİ",
        modeEN: "MIXED — INTERNAL + EXTERNAL",
        descTR: "Anti-gemi konfigürasyonu. SOM-J ile uzun menzilli deniz hedef angajmanı. ÇAKIR'ın IIR/RF arayıcı başlıklı versiyonu ile hareketli su üstü hedeflere taarruz.",
        descEN: "Anti-ship configuration. SOM-J for long range naval engagement. ÇAKIR IIR/RF seeker variant for moving surface target engagement.",
        weapons: [
            { nameTR: "SOM-J", nameEN: "SOM-J", typeTR: "Seyir Füzesi — Anti-gemi/Kara, IIR, 275 km", typeEN: "Cruise Missile — Anti-ship/Land, IIR, 275 km", qty: 2, devTR: "Roketsan / TÜBİTAK SAGE", devEN: "Roketsan / TÜBİTAK SAGE" },
            { nameTR: "ÇAKIR", nameEN: "ÇAKIR", typeTR: "Seyir Füzesi — IIR/RF Arayıcı Varyantı, 150+ km", typeEN: "Cruise Missile — IIR/RF Seeker Variant, 150+ km", qty: 2, devTR: "Roketsan", devEN: "Roketsan" },
            { nameTR: "Gökdoğan", nameEN: "Gokdogan", typeTR: "Orta Menzil BVR — Eskort, 65+ km", typeEN: "Medium Range BVR — Escort, 65+ km", qty: 2, devTR: "TÜBİTAK SAGE", devEN: "TÜBİTAK SAGE" },
        ],
    },
    {
        id: "beast-mode",
        labelTR: "BEAST MODE",
        labelEN: "BEAST MODE",
        modeTR: "BEAST — HARİCİ İSTASYONLAR",
        modeEN: "BEAST — EXTERNAL STATIONS",
        descTR: "Maksimum ateş gücü. Stealth önceliği olmayan durumlarda kanat altı harici istasyonlar aktif. Nüfuz edici bombalar, kanatlı güdümlü mühimmat ve tam AAM koruması.",
        descEN: "Maximum firepower. External wing stations active when stealth is not priority. Penetration bombs, wing-guided munitions and full AAM coverage.",
        weapons: [
            { nameTR: "NEB-84", nameEN: "NEB-84", typeTR: "Nüfuz Edici Bomba — 870 kg, Ardışık Delici Harp Başlığı", typeEN: "Penetration Bomb — 870 kg, Tandem Warhead", qty: 2, devTR: "TÜBİTAK SAGE", devEN: "TÜBİTAK SAGE" },
            { nameTR: "SARB-83", nameEN: "SARB-83", typeTR: "Sığınak Delici Bomba — ~415 kg, Ardışık Delici, MK-83 Uyumlu", typeEN: "Bunker Buster — ~415 kg, Tandem Warhead, MK-83 Compatible", qty: 2, devTR: "TÜBİTAK SAGE", devEN: "TÜBİTAK SAGE" },
            { nameTR: "GAZAP", nameEN: "GAZAP", typeTR: "Termobarik FAE Bombası — ~970 kg, 10.000+ Parçacık, 150–200 m Etki Alanı", typeEN: "Thermobaric FAE Bomb — ~970 kg, 10,000+ Fragments, 150–200 m Blast Radius", qty: 1, devTR: "MSB AR-GE", devEN: "MSB R&D" },
            { nameTR: "HAYALET", nameEN: "HAYALET", typeTR: "Bunker Delici Penetrasyon Bombası — ~1.000 kg, 90 m Derinlik, 7 m Beton (C50)", typeEN: "Bunker-Buster Penetration Bomb — ~1,000 kg, 90 m Depth, 7 m Concrete (C50)", qty: 1, devTR: "MSB AR-GE", devEN: "MSB R&D" },
            { nameTR: "KGK-83", nameEN: "KGK-83", typeTR: "Kanatlı Güdüm Kiti — INS/GPS, ~110 km (raporlanan), MK-83", typeEN: "Wing-Assisted Guidance Kit — INS/GPS, ~110 km (reported), MK-83", qty: 2, devTR: "TÜBİTAK SAGE / ASELSAN", devEN: "TÜBİTAK SAGE / ASELSAN" },
            { nameTR: "TEBER-82", nameEN: "TEBER-82", typeTR: "Güdüm Kiti — Lazer + INS/GPS, 28 km (üretici PDF)", typeEN: "Guidance Kit — Laser + INS/GPS, 28 km (manufacturer PDF)", qty: 2, devTR: "Roketsan", devEN: "Roketsan" },
            { nameTR: "Gökdoğan", nameEN: "Gokdogan", typeTR: "Orta Menzil BVR — Aktif Radar, 65+ km", typeEN: "Medium Range BVR — Active Radar, 65+ km", qty: 2, devTR: "TÜBİTAK SAGE", devEN: "TÜBİTAK SAGE" },
            { nameTR: "Bozdoğan", nameEN: "Bozdogan", typeTR: "Kısa Menzil WVR — IIR, 25+ km", typeEN: "Short Range WVR — IIR, 25+ km", qty: 2, devTR: "TÜBİTAK SAGE", devEN: "TÜBİTAK SAGE" },
        ],
    },
];

export function WeaponConfig() {
    const { locale } = useLanguage();
    const [activeLoadout, setActiveLoadout] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(
                            entry.target,
                            { opacity: 0, y: 30 },
                            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
                        );
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(
                contentRef.current.children,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }
            );
        }
    }, [activeLoadout]);

    const current = loadouts[activeLoadout];

    return (
        <section id="weapons" className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
            <div ref={containerRef} className="mx-auto max-w-5xl opacity-0">
                {/* Header */}
                <div className="mb-12">
                    <div className="mb-3 flex items-center gap-3">
                        <Crosshair className="h-4 w-4 text-neon-blue" />
                        <div className="h-px w-10 bg-neon-blue/40" />
                        <span
                            className="text-[10px] tracking-[0.4em] text-neon-blue/70 uppercase animate-hud-blink"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {locale === "tr" ? "SİLAH SİSTEMLERİ" : "WEAPON SYSTEMS"}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                        {locale === "tr" ? "GÖREV" : "MISSION"}{" "}
                        <span className="text-gradient">
                            {locale === "tr" ? "PROFİLLERİ" : "PROFILES"}
                        </span>
                    </h2>
                </div>

                {/* Loadout selector */}
                <div className="mb-8 flex flex-wrap gap-2">
                    {loadouts.map((loadout, i) => (
                        <button
                            key={loadout.id}
                            onClick={() => setActiveLoadout(i)}
                            className={`rounded-lg border px-3 py-2 text-[10px] tracking-[0.15em] transition-all duration-300 md:px-4 md:text-xs md:tracking-[0.2em] ${activeLoadout === i
                                    ? "border-neon-blue/40 bg-neon-blue/10 text-neon-blue shadow-[0_0_15px_rgba(0,212,255,0.1)]"
                                    : "border-titanium/20 bg-titanium/5 text-slate-400 hover:border-titanium/40 hover:text-slate-300"
                                }`}
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {locale === "tr" ? loadout.labelTR : loadout.labelEN}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="glass-panel rounded-2xl p-5 md:p-8">
                    {/* Mode badge */}
                    <div className="mb-4 flex items-center gap-3">
                        <span
                            className={`rounded border px-2.5 py-1 text-[8px] tracking-[0.2em] ${current.id === "beast-mode"
                                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                                    : current.modeTR.includes("KARMA") || current.modeEN.includes("MIXED")
                                        ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                                        : "border-neon-blue/30 bg-neon-blue/10 text-neon-blue"
                                }`}
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {locale === "tr" ? current.modeTR : current.modeEN}
                        </span>
                    </div>

                    <p className="mb-6 text-sm leading-relaxed text-slate-300">
                        {locale === "tr" ? current.descTR : current.descEN}
                    </p>

                    <div ref={contentRef} className="space-y-3">
                        {current.weapons.map((weapon, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between rounded-lg border border-titanium/15 bg-titanium/5 p-4 transition-all hover:border-neon-blue/20"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-neon-blue/20 bg-neon-blue/5">
                                        <span className="text-xs font-bold text-neon-blue">{weapon.qty}x</span>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-white">
                                                {locale === "tr" ? weapon.nameTR : weapon.nameEN}
                                            </span>
                                            <span
                                                className="hidden rounded border border-neon-blue/15 bg-neon-blue/5 px-1.5 py-0.5 text-[7px] tracking-[0.1em] text-neon-blue/50 sm:inline-block"
                                                style={{ fontFamily: "var(--font-mono)" }}
                                            >
                                                {locale === "tr" ? weapon.devTR : weapon.devEN}
                                            </span>
                                        </div>
                                        <div
                                            className="text-[8px] leading-relaxed tracking-[0.15em] text-slate-500 sm:text-[9px]"
                                            style={{ fontFamily: "var(--font-mono)" }}
                                        >
                                            {locale === "tr" ? weapon.typeTR : weapon.typeEN}
                                        </div>
                                    </div>
                                </div>

                                {/* Visual bar */}
                                <div className="hidden sm:block">
                                    <div className="flex gap-1">
                                        {Array.from({ length: weapon.qty }).map((_, j) => (
                                            <div
                                                key={j}
                                                className="h-1.5 w-6 rounded-full bg-neon-blue/40"
                                            />
                                        ))}
                                        {Array.from({ length: Math.max(0, 4 - weapon.qty) }).map((_, j) => (
                                            <div
                                                key={`empty-${j}`}
                                                className="h-1.5 w-6 rounded-full bg-titanium/20"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total + notes */}
                    <div className="mt-6 flex items-center justify-between border-t border-titanium/20 pt-4">
                        <div>
                            <span
                                className="text-[10px] tracking-[0.3em] text-slate-500"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {locale === "tr" ? "TOPLAM MÜHİMMAT" : "TOTAL ORDNANCE"}
                            </span>
                            <div
                                className="mt-1 text-[8px] tracking-[0.15em] text-slate-600"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {locale === "tr"
                                    ? "+ dahili top (tüm konfigürasyonlarda)"
                                    : "+ internal cannon (all configurations)"}
                            </div>
                        </div>
                        <span className="text-xl font-bold text-neon-blue">
                            {current.weapons.reduce((sum, w) => sum + w.qty, 0)} {locale === "tr" ? "ADET" : "UNITS"}
                        </span>
                    </div>

                    {/* Concept disclaimer */}
                    <p
                        className="mt-3 text-center text-[8px] tracking-[0.15em] text-slate-600"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        {locale === "tr"
                            ? "* Adetler örnek konsept konfigürasyondur. Nihai dahili/harici istasyon kapasiteleri kamuya açık teyitli değildir."
                            : "* Quantities are example concept configurations. Final internal/external station capacities are not publicly confirmed."}
                    </p>
                </div>
            </div>
        </section>
    );
}
