"use client";

import { useCallback } from "react";
import { Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function SpecSheetDownload() {
    const { locale } = useLanguage();

    const generateAndDownload = useCallback(() => {
        const specs = [
            ["", "KAAN — 5th Generation Fighter Aircraft"],
            ["", "Technical Specifications Sheet"],
            ["", ""],
            ["GENERAL", ""],
            ["Designation", "KAAN (MMU / TF-X)"],
            ["Role", "5th Gen Multi-Role Air Superiority Fighter"],
            ["Manufacturer", "TUSAŞ (Turkish Aerospace Industries)"],
            ["First Flight", "21 February 2024"],
            ["Status", "Flight Testing — Serial Production 2028-2029"],
            ["", ""],
            ["PERFORMANCE", ""],
            ["Max Speed", "Mach 1.8+"],
            ["Service Ceiling", "55,000 ft"],
            ["Combat Range", "600+ NM"],
            ["Supercruise", "Yes (without afterburner)"],
            ["G-Limit", "9G structural"],
            ["", ""],
            ["DIMENSIONS", ""],
            ["Length", "~21 m"],
            ["Wingspan", "~14 m"],
            ["Height", "~6 m"],
            ["MTOW", "~27,000 kg"],
            ["", ""],
            ["PROPULSION", ""],
            ["Current Engine", "2x GE F110-GE-129 (29,000+ lbf each)"],
            ["Future Engine", "2x TEI TF35000 (indigenous, 2032+)"],
            ["", ""],
            ["AVIONICS", ""],
            ["Radar", "AESA (ASELSAN)"],
            ["IR Sensors", "DAS — 360° Spherical Coverage (ASELSAN)"],
            ["EW Suite", "Active/Passive ECM (ASELSAN)"],
            ["HMD", "TULGAR — World's First Color HMD (ASELSAN)"],
            ["Mission Computer", "AI-Driven Sensor Fusion (HAVELSAN)"],
            ["Platform", "Integrated Modular Avionics (IMA)"],
            ["", ""],
            ["STEALTH", ""],
            ["RCS", "Very low (classified)"],
            ["Features", "S-duct intakes, internal weapons bays, RAM coatings, FSS"],
            ["", ""],
            ["ARMAMENT (Internal Bay)", ""],
            ["AAM", "Gokhan (Ramjet BVR), Gokdogan (BVR), Bozdogan (WVR), Gokbora (Long Range BVR)"],
            ["Cruise", "SOM-J (275 km), ÇAKIR (150+ km, Swarm)"],
            ["PGM", "TOLUN SDB, HGK, KGK, TEBER, Gozde"],
            ["Anti-Rad", "Akbaba (HARM equivalent, in development)"],
            ["Modular", "KUZGUN series (TJ/SS/KY variants)"],
            ["Penetration", "NEB-84 (870 kg), SARB-83 (external)"],
            ["Cannon", "Internal gun (caliber TBD)"],
            ["", ""],
            ["LOYAL WINGMAN", ""],
            ["Platforms", "KIZILELMA (Baykar), ANKA-3 (TUSAŞ)"],
            ["Capability", "MUM-T Command & Control, Swarm Coordination"],
            ["", ""],
            ["PRODUCTION", ""],
            ["Planned Units", "250+"],
            ["Export", "Indonesia (48 units, $15B framework)"],
            ["Block 10/20", "GE F110 engine (2028-2032)"],
            ["Block 30", "TF35000 indigenous engine (2032+)"],
            ["", ""],
            ["", "---"],
            ["", "CONCEPT PROJECT — NOT OFFICIAL DATA"],
            ["", "All values are estimated for educational/portfolio purposes."],
            ["", "Generated from kaan-3d-web-experience.vercel.app"],
        ];

        let text = "";
        specs.forEach(([key, val]) => {
            if (key === "") {
                text += val + "\n";
            } else {
                text += `${key.padEnd(22)} ${val}\n`;
            }
        });

        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "KAAN_Spec_Sheet.txt";
        a.click();
        URL.revokeObjectURL(url);
    }, []);

    return (
        <section className="relative z-10 px-6 py-12 md:px-12 lg:px-24">
            <div className="mx-auto max-w-5xl">
                <div className="glass-panel flex flex-col items-center justify-between gap-4 rounded-xl p-6 sm:flex-row">
                    <div>
                        <h3 className="text-sm font-bold text-white md:text-base">
                            {locale === "tr" ? "Teknik Özellikler Dosyası" : "Technical Spec Sheet"}
                        </h3>
                        <p className="mt-1 text-[10px] tracking-[0.15em] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
                            {locale === "tr"
                                ? "KAAN performans, aviyonik ve silah sistemi verilerini indir"
                                : "Download KAAN performance, avionics and weapon system data"}
                        </p>
                    </div>
                    <button
                        onClick={generateAndDownload}
                        className="flex items-center gap-2 rounded-lg border border-neon-blue/30 bg-neon-blue/10 px-5 py-2.5 text-xs tracking-[0.2em] text-neon-blue transition-all hover:bg-neon-blue/20 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        <Download className="h-4 w-4" />
                        {locale === "tr" ? "İNDİR (.TXT)" : "DOWNLOAD (.TXT)"}
                    </button>
                </div>
            </div>
        </section>
    );
}
