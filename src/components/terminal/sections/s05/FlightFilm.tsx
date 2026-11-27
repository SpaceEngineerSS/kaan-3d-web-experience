"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { videoCredits, videoSources } from "@/content/media-credits";
import { mediaCopy } from "@/content/media";
import { s05Copy } from "@/content/s05";

const tc = (s: number) => {
    const t = Math.max(0, Math.floor(s || 0));
    const hh = String(Math.floor(t / 3600)).padStart(2, "0");
    const mm = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
    const ss = String(t % 60).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
};

export function FlightFilm() {
    const { locale } = useLanguage();
    const c = s05Copy[locale];
    const m = mediaCopy[locale];
    const v = videoSources("kaan");
    const credit = videoCredits.find((x) => x.src === v.mp4) ?? videoCredits[0];
    const video = useRef<HTMLVideoElement>(null);
    const readout = useRef<HTMLSpanElement>(null);

    // Timecode is written straight to the DOM on media events; no React state.
    useEffect(() => {
        const el = video.current;
        const out = readout.current;
        if (!el || !out) return;
        const write = () => {
            out.textContent = `TC ${tc(el.currentTime)} / ${Number.isFinite(el.duration) ? tc(el.duration) : "00:01:15"}`;
        };
        write();
        el.addEventListener("timeupdate", write);
        el.addEventListener("loadedmetadata", write);
        el.addEventListener("seeked", write);
        return () => {
            el.removeEventListener("timeupdate", write);
            el.removeEventListener("loadedmetadata", write);
            el.removeEventListener("seeked", write);
        };
    }, []);

    return (
        <figure>
            <div className="cross border border-edge bg-ink">
                <div className="flex items-center justify-between gap-4 border-b border-edge px-4 py-2">
                    <span className="t-tele">{c.filmLabel}</span>
                    <span ref={readout} className="t-tele tabular-nums text-fg-2" aria-hidden>
                        TC 00:00:00 / 00:01:15
                    </span>
                </div>
                <video
                    ref={video}
                    controls
                    preload="none"
                    playsInline
                    poster={v.poster}
                    width={854}
                    height={480}
                    className="aspect-video w-full bg-black object-contain"
                    aria-label={credit.alt[locale]}
                >
                    <source src={v.mp4} type="video/mp4" />
                    {m.noVideo}
                </video>
            </div>
            <figcaption className="grid gap-px border-b border-edge bg-edge md:grid-cols-12">
                <div className="bg-ink px-4 py-3 md:col-span-7">
                    <p className="text-[0.9375rem] text-fg">{m.videoTitle}</p>
                    <p className="mt-1 max-w-[60ch] text-[0.8125rem] leading-relaxed text-muted">{m.videoBody}</p>
                </div>
                <div className="bg-ink px-4 py-3 md:col-span-5">
                    <p className="t-tele">{m.credit}</p>
                    <p className="mt-1 text-[0.8125rem] text-fg-2">{credit.credit[locale]}</p>
                    {credit.note && <p className="mt-1 text-[0.75rem] leading-relaxed text-faint">{credit.note[locale]}</p>}
                </div>
            </figcaption>
        </figure>
    );
}
