"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * SoundEngine – Web Audio API atmospheric audio with spatial capabilities.
 * Provides:
 * - Low-volume ambient jet engine hum (low-pass filtered brown noise)
 * - Dynamic pitch based on scroll velocity
 * - Mute toggle state shared via props
 * - playClick() for mechanical click SFX
 * - playSonicBoom() for dramatic section transitions
 */
export function useSoundEngine(enabled: boolean) {
    const ctxRef = useRef<AudioContext | null>(null);
    const noiseRef = useRef<AudioBufferSourceNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);
    const filterRef = useRef<BiquadFilterNode | null>(null);
    const startedRef = useRef(false);
    const scrollVelRef = useRef(0);
    const lastScrollRef = useRef(0);

    const init = useCallback(() => {
        if (ctxRef.current || !enabled) return;
        try {
            const ctx = new AudioContext();
            ctxRef.current = ctx;

            /* Brown noise generator for jet hum */
            const bufferSize = ctx.sampleRate * 4;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            let last = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                last = (last + 0.02 * white) / 1.02;
                data[i] = last * 3.5;
            }

            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            /* Low-pass filter – deep rumble, frequency controlled by scroll */
            const lpf = ctx.createBiquadFilter();
            lpf.type = "lowpass";
            lpf.frequency.value = 180;
            lpf.Q.value = 1.2;

            /* High-pass filter for scroll-based whine */
            const hpf = ctx.createBiquadFilter();
            hpf.type = "highpass";
            hpf.frequency.value = 40;

            /* Gain – very low volume */
            const gain = ctx.createGain();
            gain.gain.value = 0.08;

            source.connect(lpf);
            lpf.connect(hpf);
            hpf.connect(gain);
            gain.connect(ctx.destination);
            source.start();

            noiseRef.current = source;
            gainRef.current = gain;
            filterRef.current = lpf;
            startedRef.current = true;
        } catch {
            /* Audio not supported */
        }
    }, [enabled]);

    /* Start on first user interaction */
    useEffect(() => {
        if (!enabled) return;

        const startOnInteraction = () => {
            if (!startedRef.current) init();
            document.removeEventListener("click", startOnInteraction);
            document.removeEventListener("keydown", startOnInteraction);
        };

        document.addEventListener("click", startOnInteraction, { once: true });
        document.addEventListener("keydown", startOnInteraction, { once: true });

        return () => {
            document.removeEventListener("click", startOnInteraction);
            document.removeEventListener("keydown", startOnInteraction);
        };
    }, [enabled, init]);

    /* Scroll-based dynamic pitch */
    useEffect(() => {
        if (!enabled) return;

        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const velocity = Math.abs(currentScroll - lastScrollRef.current);
            lastScrollRef.current = currentScroll;
            scrollVelRef.current = velocity;

            if (filterRef.current && ctxRef.current) {
                const baseFreq = 180;
                const scrollBoost = Math.min(velocity * 2, 300);
                filterRef.current.frequency.linearRampToValueAtTime(
                    baseFreq + scrollBoost,
                    ctxRef.current.currentTime + 0.1
                );
            }

            if (gainRef.current && ctxRef.current) {
                const baseGain = 0.08;
                const scrollGain = Math.min(velocity * 0.0005, 0.06);
                gainRef.current.gain.linearRampToValueAtTime(
                    enabled ? baseGain + scrollGain : 0,
                    ctxRef.current.currentTime + 0.1
                );
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [enabled]);

    /* Toggle mute */
    useEffect(() => {
        if (gainRef.current) {
            gainRef.current.gain.linearRampToValueAtTime(
                enabled ? 0.08 : 0,
                (ctxRef.current?.currentTime ?? 0) + 0.3
            );
        }
    }, [enabled]);

    /* Click SFX */
    const playClick = useCallback(() => {
        if (!ctxRef.current || !enabled) return;
        const ctx = ctxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = 1200;
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
    }, [enabled]);

    /* Sonic boom SFX */
    const playSonicBoom = useCallback(() => {
        if (!ctxRef.current || !enabled) return;
        const ctx = ctxRef.current;

        const bufferSize = ctx.sampleRate * 0.8;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            const t = i / bufferSize;
            data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 6) * 0.5;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const lpf = ctx.createBiquadFilter();
        lpf.type = "lowpass";
        lpf.frequency.value = 200;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        source.connect(lpf);
        lpf.connect(gain);
        gain.connect(ctx.destination);
        source.start();
    }, [enabled]);

    return { playClick, playSonicBoom };
}

/**
 * SoundToggle – renders a mute/unmute button.
 */
export function SoundToggle({
    enabled,
    toggle,
}: {
    enabled: boolean;
    toggle: () => void;
}) {
    return (
        <button
            onClick={toggle}
            className="group relative flex items-center justify-center rounded border border-neon-blue/20 bg-neon-blue/5 p-1.5 transition-all hover:border-neon-blue/40 hover:bg-neon-blue/10"
            aria-label={enabled ? "Mute" : "Unmute"}
            title={enabled ? "Sound ON (M)" : "Sound OFF (M)"}
        >
            {enabled ? (
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-neon-blue"
                >
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                </svg>
            ) : (
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-titanium-light/50"
                >
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
            )}
        </button>
    );
}
