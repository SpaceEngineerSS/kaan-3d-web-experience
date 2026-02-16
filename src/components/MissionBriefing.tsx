"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Map } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Waypoint { x: number; y: number; label: string }

interface MissionProfile {
    id: string;
    nameTR: string;
    nameEN: string;
    descTR: string;
    descEN: string;
    waypoints: Waypoint[];
    color: string;
}

const missions: MissionProfile[] = [
    {
        id: "cap",
        nameTR: "HAVA DEVRİYE (CAP)",
        nameEN: "COMBAT AIR PATROL",
        descTR: "Ankara üssünden kalkış, Batı Karadeniz'de devriye uçuşu ve üsse dönüş.",
        descEN: "Takeoff from Ankara base, patrol over Western Black Sea and return to base.",
        waypoints: [
            { x: 48, y: 52, label: "ANKARA" },
            { x: 42, y: 32, label: "WP1" },
            { x: 55, y: 22, label: "CAP ORBIT" },
            { x: 62, y: 30, label: "WP2" },
            { x: 48, y: 52, label: "RTB" },
        ],
        color: "#00d4ff",
    },
    {
        id: "strike",
        nameTR: "DERİN TAARRUZ",
        nameEN: "DEEP STRIKE",
        descTR: "Düşük irtifa penetrasyon ile hedef bölgeye yaklaşım, SOM-J atışı ve geri çekilme.",
        descEN: "Low altitude penetration to target area, SOM-J launch and withdrawal.",
        waypoints: [
            { x: 48, y: 52, label: "ANKARA" },
            { x: 35, y: 45, label: "IP" },
            { x: 22, y: 38, label: "TGT AREA" },
            { x: 25, y: 45, label: "EGRESS" },
            { x: 48, y: 52, label: "RTB" },
        ],
        color: "#ff4444",
    },
    {
        id: "sead",
        nameTR: "SEAD GÖREVİ",
        nameEN: "SEAD MISSION",
        descTR: "Düşman hava savunma sistemi tespit, AKBABA ile imha ve bölge temizleme.",
        descEN: "Detect enemy air defense systems, destroy with AKBABA and sanitize the area.",
        waypoints: [
            { x: 48, y: 52, label: "ANKARA" },
            { x: 58, y: 40, label: "MARSHAL" },
            { x: 70, y: 35, label: "SEAD ZONE" },
            { x: 65, y: 42, label: "EGRESS" },
            { x: 48, y: 52, label: "RTB" },
        ],
        color: "#ffaa22",
    },
];

export function MissionBriefing() {
    const { locale } = useLanguage();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeMission, setActiveMission] = useState(0);
    const animRef = useRef<number>(0);

    const drawMap = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);

        /* Grid */
        ctx.strokeStyle = "rgba(0, 212, 255, 0.06)";
        ctx.lineWidth = 0.5;
        for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let y = 0; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

        /* Simplified Turkey outline */
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 212, 255, 0.15)";
        ctx.lineWidth = 1;
        const outline = [[26,42],[30,35],[38,28],[50,24],[60,22],[72,25],[80,30],[82,38],[78,45],[72,50],[65,55],[55,58],[45,56],[35,52],[28,48],[26,42]];
        outline.forEach(([px, py], i) => {
            const sx = (px / 100) * w;
            const sy = (py / 100) * h;
            i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
        });
        ctx.closePath();
        ctx.fillStyle = "rgba(0, 212, 255, 0.02)";
        ctx.fill();
        ctx.stroke();

        /* Mission route */
        const mission = missions[activeMission];
        const progress = Math.min(animRef.current, 1);
        const wps = mission.waypoints;
        const totalSegments = wps.length - 1;
        const drawSegments = progress * totalSegments;

        ctx.beginPath();
        ctx.strokeStyle = mission.color + "cc";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);

        for (let i = 0; i <= Math.floor(drawSegments) && i < totalSegments; i++) {
            const from = wps[i];
            const to = wps[i + 1];
            const segProgress = i < Math.floor(drawSegments) ? 1 : drawSegments - Math.floor(drawSegments);
            const fx = (from.x / 100) * w;
            const fy = (from.y / 100) * h;
            const tx = fx + ((to.x / 100) * w - fx) * segProgress;
            const ty = fy + ((to.y / 100) * h - fy) * segProgress;

            if (i === 0) ctx.moveTo(fx, fy);
            ctx.lineTo(tx, ty);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        /* Waypoints */
        wps.forEach((wp, i) => {
            const wpProgress = i / totalSegments;
            if (wpProgress > progress + 0.05) return;

            const sx = (wp.x / 100) * w;
            const sy = (wp.y / 100) * h;

            ctx.beginPath();
            ctx.arc(sx, sy, 4, 0, Math.PI * 2);
            ctx.fillStyle = i === 0 || i === wps.length - 1 ? "#00ff88" : mission.color;
            ctx.fill();

            ctx.font = "9px monospace";
            ctx.fillStyle = "rgba(200, 210, 220, 0.7)";
            ctx.textAlign = "center";
            ctx.fillText(wp.label, sx, sy - 10);
        });

        /* Aircraft icon at current position */
        if (progress > 0) {
            const seg = Math.min(Math.floor(drawSegments), totalSegments - 1);
            const segP = drawSegments - seg;
            const from = wps[seg];
            const to = wps[Math.min(seg + 1, wps.length - 1)];
            const ax = ((from.x + (to.x - from.x) * segP) / 100) * w;
            const ay = ((from.y + (to.y - from.y) * segP) / 100) * h;

            ctx.beginPath();
            ctx.arc(ax, ay, 6, 0, Math.PI * 2);
            ctx.fillStyle = mission.color + "40";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(ax, ay, 3, 0, Math.PI * 2);
            ctx.fillStyle = mission.color;
            ctx.fill();
        }
    }, [activeMission]);

    useEffect(() => {
        animRef.current = 0;
        let frame: number;
        const animate = () => {
            animRef.current = Math.min(animRef.current + 0.008, 1);
            drawMap();
            if (animRef.current < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [activeMission, drawMap]);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { animRef.current = 0; } },
            { threshold: 0.3 }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const mission = missions[activeMission];

    return (
        <section id="mission" className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
            <div ref={containerRef} className="mx-auto max-w-5xl">
                <div className="mb-12">
                    <div className="mb-3 flex items-center gap-3">
                        <Map className="h-4 w-4 text-neon-blue" />
                        <div className="h-px w-10 bg-neon-blue/40" />
                        <span className="text-[10px] tracking-[0.4em] text-neon-blue/70 uppercase animate-hud-blink" style={{ fontFamily: "var(--font-mono)" }}>
                            {locale === "tr" ? "GÖREV BRİFİNG" : "MISSION BRIEFING"}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                        {locale === "tr" ? "TAKTİK" : "TACTICAL"}{" "}
                        <span className="text-gradient">{locale === "tr" ? "HARİTA" : "MAP"}</span>
                    </h2>
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                    {missions.map((m, i) => (
                        <button
                            key={m.id}
                            onClick={() => setActiveMission(i)}
                            className={`rounded-lg border px-3 py-2 text-[10px] tracking-[0.15em] transition-all duration-300 md:px-4 md:text-xs ${activeMission === i
                                ? "border-neon-blue/40 bg-neon-blue/10 text-neon-blue"
                                : "border-titanium/20 bg-titanium/5 text-slate-400 hover:border-titanium/40"
                            }`}
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {locale === "tr" ? m.nameTR : m.nameEN}
                        </button>
                    ))}
                </div>

                <div className="glass-panel overflow-hidden rounded-2xl">
                    <div className="border-b border-neon-blue/10 px-5 py-3 flex items-center justify-between">
                        <span className="text-[9px] tracking-[0.3em] text-neon-blue/50" style={{ fontFamily: "var(--font-mono)" }}>
                            {locale === "tr" ? mission.nameTR : mission.nameEN}
                        </span>
                        <span className="rounded border border-hud-green/30 bg-hud-green/10 px-2 py-0.5 text-[8px] text-hud-green" style={{ fontFamily: "var(--font-mono)" }}>
                            ● LIVE
                        </span>
                    </div>
                    <canvas ref={canvasRef} className="h-[280px] w-full sm:h-[350px] md:h-[400px]" />
                    <div className="border-t border-neon-blue/10 px-5 py-3">
                        <p className="text-xs leading-relaxed text-slate-400">
                            {locale === "tr" ? mission.descTR : mission.descEN}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
