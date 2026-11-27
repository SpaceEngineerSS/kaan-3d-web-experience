"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { galleryCredits } from "@/content/media-credits";
import { mediaCopy } from "@/content/media";
import { s05Copy } from "@/content/s05";
import { Lightbox } from "./Lightbox";
import { Plate } from "./shared";

import { fileName } from "./shared";

export function ArchiveStrip() {
    const { locale } = useLanguage();
    const c = s05Copy[locale];
    const m = mediaCopy[locale];
    const scroller = useRef<HTMLDivElement>(null);
    const moved = useRef(0);
    const opener = useRef<HTMLButtonElement | null>(null);
    const [active, setActive] = useState<number | null>(null);

    const step = useCallback((dir: number) => {
        const el = scroller.current;
        if (!el) return;
        el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: "smooth" });
    }, []);

    // Vertical wheel scrolls the strip until it reaches an end, then the page takes over.
    useEffect(() => {
        const el = scroller.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // native horizontal scroll
            const max = el.scrollWidth - el.clientWidth;
            const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
            const atEnd = el.scrollLeft >= max - 1 && e.deltaY > 0;
            if (atStart || atEnd) return;
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);

    const close = () => {
        setActive(null);
        requestAnimationFrame(() => opener.current?.focus());
    };

    return (
        <div className="mb-24 md:mb-32">
            <Plate n="05" label={c.archiveLabel} title={m.galleryTitle} />
            <div className="flex items-center justify-between gap-4 border-b border-edge bg-ink px-4 py-2">
                <p className="t-tele hidden sm:block">{c.archiveHint}</p>
                <div className="ml-auto flex gap-4">
                    <button type="button" className="toggle" onClick={() => step(-1)} aria-controls="archive-strip">
                        ← {c.prev}
                    </button>
                    <button type="button" className="toggle" onClick={() => step(1)} aria-controls="archive-strip">
                        {c.next} →
                    </button>
                </div>
            </div>
            <div
                id="archive-strip"
                ref={scroller}
                tabIndex={0}
                role="region"
                aria-label={c.strip}
                data-lenis-prevent-wheel
                onKeyDown={(e) => {
                    if (e.target !== e.currentTarget) return;
                    if (e.key === "ArrowRight") {
                        e.preventDefault();
                        step(1);
                    } else if (e.key === "ArrowLeft") {
                        e.preventDefault();
                        step(-1);
                    }
                }}
                className="archive-strip overflow-x-auto overscroll-x-contain border-b border-edge bg-ink"
                style={{
                    scrollbarColor: "var(--color-edge-2) var(--color-ink)",
                    scrollbarWidth: "thin",
                }}
            >
                <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0}
                    dragMomentum={false}
                    onDragStart={() => {
                        moved.current = 0;
                    }}
                    onDrag={(_, info) => {
                        moved.current += Math.abs(info.delta.x);
                        if (scroller.current) scroller.current.scrollLeft -= info.delta.x;
                    }}
                    className="flex w-max cursor-grab gap-px bg-edge active:cursor-grabbing"
                >
                    {galleryCredits.map((g, i) => {
                        const w = g.width ?? 1600;
                        const h = g.height ?? 900;
                        return (
                            <figure key={g.src} className="archive-item flex shrink-0 flex-col bg-ink" style={{ "--ar": w / h } as CSSProperties}>
                                <button
                                    type="button"
                                    className="group relative block overflow-hidden focus-visible:outline-offset-[-2px]"
                                    aria-label={`${m.open}: ${g.alt[locale]}`}
                                    aria-haspopup="dialog"
                                    onClick={(e) => {
                                        if (moved.current > 6) {
                                            moved.current = 0;
                                            return;
                                        }
                                        opener.current = e.currentTarget;
                                        setActive(i);
                                    }}
                                >
                                    <Image
                                        src={g.src}
                                        alt=""
                                        width={w}
                                        height={h}
                                        draggable={false}
                                        sizes="(min-width: 768px) min(1200px, 90vw), 100vw"
                                        loading={i < 2 ? "eager" : "lazy"}
                                        className="archive-img select-none object-cover contrast-125 grayscale transition-[filter] duration-300 group-hover:contrast-100 group-hover:grayscale-0 group-focus-visible:contrast-100 group-focus-visible:grayscale-0"
                                    />
                                </button>
                                <figcaption className="t-tele grid gap-px border-t border-edge bg-edge text-[10px]">
                                    <span className="flex justify-between gap-3 bg-ink px-3 py-1.5">
                                        <span className="text-fg-2">{String(i + 1).padStart(2, "0")}</span>
                                        <span className="truncate">{fileName(g.src)}</span>
                                        <span className="tabular-nums">
                                            {w}×{h}PX
                                        </span>
                                    </span>
                                    <span className="bg-ink px-3 py-1.5 normal-case tracking-normal text-muted">{g.credit[locale]}</span>
                                    <span className="bg-ink px-3 py-1.5">
                                        {g.sourceUrl ? (
                                            <a href={g.sourceUrl} target="_blank" rel="noopener noreferrer" className="link text-fg-2">
                                                {m.source} ↗
                                            </a>
                                        ) : (
                                            <span className="text-faint">{c.noSource}</span>
                                        )}
                                    </span>
                                </figcaption>
                            </figure>
                        );
                    })}
                </motion.div>
            </div>
            <style>{`
                .archive-item { width: calc(50svh * var(--ar)); }
                .archive-img { height: 50svh; width: 100%; }
                @media (min-width: 768px) {
                    .archive-item { width: calc(70svh * var(--ar)); }
                    .archive-img { height: 70svh; }
                }
            `}</style>
            <p className="mt-2 text-[0.75rem] leading-relaxed text-faint">
                {m.galleryNote}{" "}
                <Link href="/kaynaklar" className="link text-fg-2">
                    {m.allSources}
                </Link>
            </p>

            {active !== null && <Lightbox items={galleryCredits} index={active} onIndex={setActive} onClose={close} />}
        </div>
    );
}
