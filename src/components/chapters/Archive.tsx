"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type Lenis from "lenis";
import { useLanguage } from "@/context/LanguageContext";
import { Chapter } from "@/components/site/Chapter";
import { galleryCredits, videoCredits, videoSources, type MediaCredit } from "@/content/media-credits";
import { mediaCopy } from "@/content/media";

/** Grid placement per gallery slot: asymmetric on desktop, two columns on phones. */
const SLOTS = [
    "col-span-2 row-span-2 md:col-span-8 md:row-span-2",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-4",
    "row-span-2 md:col-span-4 md:row-span-2",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-4",
    "col-span-2 md:col-span-8",
];

function Arrow({ dir = "right" }: { dir?: "left" | "right" | "out" }) {
    if (dir === "out")
        return (
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <path d="M2 8L8 2M3.5 2H8v4.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
        );
    return (
        <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden className={dir === "left" ? "-scale-x-100" : ""}>
            <path d="M1 5h14M11 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
    );
}

export function Archive() {
    const { locale } = useLanguage();
    const c = mediaCopy[locale];
    const video = videoSources("kaan");
    const videoCredit = videoCredits[0];
    const [active, setActive] = useState<number | null>(null);
    const opener = useRef<HTMLButtonElement | null>(null);

    const openAt = (i: number, el: HTMLButtonElement) => {
        opener.current = el;
        setActive(i);
    };

    const close = () => {
        setActive(null);
        // Return focus to the thumbnail that opened the dialog.
        requestAnimationFrame(() => opener.current?.focus());
    };

    return (
        <Chapter id="archive" index={10} label={c.label} title={c.title} lede={c.lede} solid>
            {/* Video */}
            <figure className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                <div className="bezel lg:col-span-8" data-reveal>
                    <video
                        controls
                        preload="none"
                        playsInline
                        poster={video.poster}
                        width={854}
                        height={480}
                        className="aspect-video w-full bg-black object-contain"
                        aria-label={videoCredit.alt[locale]}
                    >
                        <source src={video.webm} type="video/webm" />
                        <source src={video.mp4} type="video/mp4" />
                        {c.noVideo}
                    </video>
                </div>
                <figcaption className="lg:col-span-4 lg:self-end">
                    <h3 className="t-h3 text-fg">{c.videoTitle}</h3>
                    <p className="t-body mt-3 text-[0.9375rem]">{c.videoBody}</p>
                    <dl className="mt-6 divide-y divide-edge border-y border-edge text-[0.9375rem]">
                        <div className="grid grid-cols-[6rem_1fr] gap-3 py-2.5">
                            <dt className="t-label pt-0.5">{c.videoDuration}</dt>
                            <dd className="t-data text-fg-2">1:15</dd>
                        </div>
                        <div className="grid grid-cols-[6rem_1fr] gap-3 py-2.5">
                            <dt className="t-label pt-0.5">{c.credit}</dt>
                            <dd className="text-fg-2">
                                {videoCredit.credit[locale]}
                                {videoCredit.note && <span className="mt-1 block text-[0.8125rem] leading-relaxed text-faint">{videoCredit.note[locale]}</span>}
                            </dd>
                        </div>
                    </dl>
                </figcaption>
            </figure>

            {/* Gallery */}
            <div className="mt-20 md:mt-28">
                <h3 className="t-label mb-5">{c.galleryTitle}</h3>
                <ul className="grid auto-rows-[9rem] grid-cols-2 gap-2 sm:auto-rows-[12rem] md:auto-rows-[13rem] md:grid-cols-12 md:gap-3">
                    {galleryCredits.map((g, i) => (
                        <li key={g.src} className={`${SLOTS[i] ?? "md:col-span-4"} relative`} data-reveal>
                            <button
                                type="button"
                                onClick={(e) => openAt(i, e.currentTarget)}
                                className="group relative block h-full w-full overflow-hidden border border-edge bg-plate focus-visible:border-hmd"
                                aria-label={`${c.open}: ${g.alt[locale]}`}
                                aria-haspopup="dialog"
                            >
                                <Image
                                    src={g.src}
                                    alt=""
                                    fill
                                    sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                />
                                <span className="t-data absolute left-2 top-2 bg-ink/80 px-1.5 py-0.5 text-[0.6875rem] text-fg-2">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                            </button>
                        </li>
                    ))}
                    <li className="col-span-2 flex flex-col justify-end border-t border-edge pt-4 md:col-span-4 md:border-t-0 md:pt-0">
                        <p className="text-[0.9375rem] leading-relaxed text-fg-2">{c.galleryNote}</p>
                        <Link href="/kaynaklar" className="link t-label mt-4 inline-flex items-center gap-2 self-start text-fg">
                            {c.allSources} <Arrow />
                        </Link>
                    </li>
                </ul>
            </div>

            {active !== null && <Lightbox items={galleryCredits} index={active} onIndex={setActive} onClose={close} />}
        </Chapter>
    );
}

function Lightbox({ items, index, onIndex, onClose }: { items: MediaCredit[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
    const { locale } = useLanguage();
    const c = mediaCopy[locale];
    const dialog = useRef<HTMLDivElement>(null);
    const closeBtn = useRef<HTMLButtonElement>(null);
    const item = items[index];
    const n = items.length;

    const go = useCallback((d: number) => onIndex((index + d + n) % n), [index, n, onIndex]);

    // Lock page scroll while open, focus the close button.
    useEffect(() => {
        const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
        document.body.classList.add("overflow-locked");
        lenis?.stop();
        closeBtn.current?.focus();
        return () => {
            document.body.classList.remove("overflow-locked");
            lenis?.start();
        };
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            } else if (e.key === "ArrowRight") {
                go(1);
            } else if (e.key === "ArrowLeft") {
                go(-1);
            } else if (e.key === "Tab" && dialog.current) {
                // Keep focus inside the dialog.
                const f = dialog.current.querySelectorAll<HTMLElement>("button, a[href]");
                if (!f.length) return;
                const first = f[0];
                const last = f[f.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [go, onClose]);

    const kind = item.kind === "photo" || item.kind === "render" || item.kind === "diagram" ? c.kind[item.kind] : "";

    return createPortal(
        <div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-caption"
            className="fixed inset-0 z-[80] flex flex-col bg-ink/[0.97]"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="wrap flex h-16 shrink-0 items-center justify-between gap-4 border-b border-edge">
                <p className="t-data text-sm text-muted" aria-live="polite">
                    {String(index + 1).padStart(2, "0")} {c.of} {String(n).padStart(2, "0")}
                </p>
                <button ref={closeBtn} type="button" onClick={onClose} className="btn">
                    {c.close}
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                </button>
            </div>

            <div
                className="relative flex min-h-0 flex-1 items-center justify-center px-[var(--gutter)] py-4"
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <Image
                    key={item.src}
                    src={item.src}
                    alt={item.alt[locale]}
                    width={item.width ?? 1600}
                    height={item.height ?? 900}
                    sizes="100vw"
                    className="h-auto max-h-full w-auto max-w-full object-contain"
                />
            </div>

            <div className="wrap grid shrink-0 gap-4 border-t border-edge py-5 md:grid-cols-12 md:items-end">
                <div id="lightbox-caption" className="md:col-span-9">
                    <p className="text-[0.9375rem] text-fg">
                        {item.alt[locale]}
                        {kind && <span className="t-label ml-2 text-faint">{kind}</span>}
                    </p>
                    <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
                        {c.credit}: {item.credit[locale]}
                        {item.licence && <> · {item.licence}</>}
                        {item.sourceUrl && (
                            <>
                                {" · "}
                                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1 text-fg-2">
                                    {c.source} <Arrow dir="out" />
                                </a>
                            </>
                        )}
                    </p>
                    {item.note && <p className="mt-1 text-[0.8125rem] leading-relaxed text-faint">{item.note[locale]}</p>}
                </div>
                <div className="flex gap-2 md:col-span-3 md:justify-end">
                    <button type="button" onClick={() => go(-1)} className="btn" aria-label={c.prev}>
                        <Arrow dir="left" />
                    </button>
                    <button type="button" onClick={() => go(1)} className="btn" aria-label={c.next}>
                        <Arrow />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
