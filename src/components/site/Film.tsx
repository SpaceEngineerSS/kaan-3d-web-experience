"use client";

import { useEffect, useRef, useState } from "react";

export type ClipName = "chase" | "takeoff" | "landing" | "wide";

interface FilmProps {
    name: ClipName;
    className?: string;
    /** Short line under or over the clip. */
    caption?: string;
    credit?: string;
    /** Fill the parent (absolute) instead of keeping 16:9. */
    cover?: boolean;
    /** Load immediately (first screen). */
    priority?: boolean;
}

/**
 * Real KAAN flight footage as a silent loop. Plays only while on screen and when motion is allowed;
 * otherwise shows the still. Clips are cut from the publicly shared TUSAŞ footage in /public/videos.
 */
export function Film({ name, className = "", caption, credit, cover, priority }: FilmProps) {
    const ref = useRef<HTMLVideoElement>(null);
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const apply = () => setReduced(mq.matches);
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, []);

    useEffect(() => {
        const v = ref.current;
        if (!v) return;
        if (reduced) {
            v.pause();
            return;
        }
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting && !document.hidden) {
                    if (v.preload !== "auto") v.preload = "auto";
                    v.play().catch(() => undefined);
                } else v.pause();
            },
            { threshold: 0.15 }
        );
        io.observe(v);
        const onVis = () => (document.hidden ? v.pause() : undefined);
        document.addEventListener("visibilitychange", onVis);
        return () => {
            io.disconnect();
            document.removeEventListener("visibilitychange", onVis);
        };
    }, [reduced]);

    const video = (
        <video
            ref={ref}
            className={cover ? "absolute inset-0 h-full w-full object-cover" : "h-full w-full object-cover"}
            muted
            loop
            playsInline
            preload={priority ? "auto" : "none"}
            poster={`/media/clips/${name}.jpg`}
            aria-hidden={!caption}
            disablePictureInPicture
        >
            <source src={`/media/clips/${name}.mp4`} type="video/mp4" />
        </video>
    );

    if (cover) return <div className={`absolute inset-0 overflow-hidden ${className}`}>{video}</div>;

    return (
        <figure className={className}>
            <div className="relative aspect-video overflow-hidden bg-ink-2">{video}</div>
            {(caption || credit) && (
                <figcaption className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-[0.8125rem] text-muted">
                    {caption && <span>{caption}</span>}
                    {credit && <span className="t-label text-[0.6875rem]">{credit}</span>}
                </figcaption>
            )}
        </figure>
    );
}
