"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, X, Radio } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/lib/translations";

export function VideoBriefing() {
    const { locale } = useLanguage();
    const v = translations.video[locale];
    const [modalOpen, setModalOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleOpen = useCallback(() => {
        setModalOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setModalOpen(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, []);

    useEffect(() => {
        if (modalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [modalOpen]);

    return (
        <>
            <section className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
                <div className="mx-auto max-w-6xl">
                    {/* Section header */}
                    <div className="mb-12">
                        <div className="mb-3 flex items-center gap-3">
                            <Radio className="h-4 w-4 text-neon-blue" />
                            <div className="h-px w-10 bg-neon-blue/40" />
                            <span
                                className="text-[10px] tracking-[0.4em] text-neon-blue/70 uppercase animate-hud-blink"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {v.sectionTag}
                            </span>
                        </div>
                        <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                            {v.title}{" "}
                            <span className="text-gradient">{v.titleAccent}</span>
                        </h2>
                    </div>

                    {/* Video thumbnail card */}
                    <button
                        onClick={handleOpen}
                        className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 backdrop-blur-sm transition-all duration-700 hover:border-neon-blue/30 hover:shadow-[0_0_60px_rgba(0,212,255,0.1)]"
                        aria-label={v.playLabel}
                    >
                        {/* Aspect ratio container */}
                        <div className="relative aspect-video w-full bg-cockpit-dark">
                            {/* Video poster / preview */}
                            <video
                                className="absolute inset-0 h-full w-full object-cover opacity-40 transition-opacity duration-700 group-hover:opacity-60"
                                src="/videos/kaan.mp4"
                                muted
                                playsInline
                                preload="metadata"
                            />

                            {/* Scan lines overlay */}
                            <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage:
                                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
                                }}
                            />

                            {/* Center play button — target lock style */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative flex h-24 w-24 items-center justify-center md:h-32 md:w-32">
                                    {/* Outer ring */}
                                    <div className="absolute inset-0 rounded-full border-2 border-neon-blue/30 transition-all duration-700 group-hover:border-neon-blue/60 group-hover:scale-110" />
                                    {/* Inner ring */}
                                    <div className="absolute inset-3 rounded-full border border-neon-blue/20 transition-all duration-700 group-hover:border-neon-blue/40" />
                                    {/* Crosshair lines */}
                                    <div className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-neon-blue/40" />
                                    <div className="absolute right-0 top-1/2 h-px w-4 -translate-y-1/2 bg-neon-blue/40" />
                                    <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-neon-blue/40" />
                                    <div className="absolute bottom-0 left-1/2 h-4 w-px -translate-x-1/2 bg-neon-blue/40" />
                                    {/* Play icon */}
                                    <Play className="h-8 w-8 fill-neon-blue text-neon-blue transition-all duration-500 group-hover:scale-110 md:h-10 md:w-10" />
                                </div>
                            </div>

                            {/* Bottom HUD bar */}
                            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-6 pb-5 pt-16">
                                <div>
                                    <p
                                        className="text-[10px] tracking-[0.3em] text-neon-blue/80"
                                        style={{ fontFamily: "var(--font-mono)" }}
                                    >
                                        {v.caption}
                                    </p>
                                </div>
                                <span
                                    className="text-[10px] tracking-[0.2em] text-slate-400"
                                    style={{ fontFamily: "var(--font-mono)" }}
                                >
                                    ▶ {v.playLabel}
                                </span>
                            </div>
                        </div>
                    </button>
                </div>
            </section>

            {/* Fullscreen video modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/95 backdrop-blur-lg">
                    <button
                        onClick={handleClose}
                        className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition-all hover:border-neon-blue/50 hover:text-neon-blue"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <video
                        ref={videoRef}
                        className="max-h-[90vh] max-w-[95vw] rounded-lg"
                        src="/videos/kaan.mp4"
                        controls
                        autoPlay
                        playsInline
                    />
                </div>
            )}
        </>
    );
}
