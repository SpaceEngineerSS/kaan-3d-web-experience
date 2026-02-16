"use client";

import { useEffect, useRef } from "react";
import { useKonamiCode } from "@/hooks/useKonamiCode";

export function KonamiOverlay() {
    const { activated } = useKonamiCode();
    const audioRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (!activated) return;

        document.body.classList.add("konami-shake");
        setTimeout(() => document.body.classList.remove("konami-shake"), 800);

        try {
            const ctx = new AudioContext();
            audioRef.current = ctx;

            const bufferSize = ctx.sampleRate * 1.2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                const t = i / bufferSize;
                data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 3) * 0.4;
            }

            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const lpf = ctx.createBiquadFilter();
            lpf.type = "lowpass";
            lpf.frequency.value = 300;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

            source.connect(lpf);
            lpf.connect(gain);
            gain.connect(ctx.destination);
            source.start();
        } catch { /* audio not supported */ }
    }, [activated]);

    if (!activated) return null;

    return (
        <div className="fixed inset-0 z-[200] pointer-events-none">
            {/* Flash */}
            <div className="absolute inset-0 bg-white/10 animate-[konamiFlash_0.3s_ease-out_forwards]" />

            {/* Shockwave ring */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-4 w-4 rounded-full border-2 border-neon-blue animate-[konamiRing_1s_ease-out_forwards]" />
            </div>

            {/* Text */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-[konamiFade_2s_ease-out_forwards]">
                <div className="text-4xl font-bold text-neon-blue text-glow-strong md:text-6xl">AFTERBURNER</div>
                <div className="mt-2 text-sm tracking-[0.4em] text-hud-green" style={{ fontFamily: "var(--font-mono)" }}>
                    // FULL POWER ENGAGED //
                </div>
            </div>

            {/* Particle burst */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-1 w-8 rounded-full bg-gradient-to-r from-orange-500 to-transparent"
                        style={{
                            transform: `rotate(${i * 30}deg)`,
                            animation: `konamiParticle 0.8s ease-out ${i * 0.03}s forwards`,
                            opacity: 0,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
