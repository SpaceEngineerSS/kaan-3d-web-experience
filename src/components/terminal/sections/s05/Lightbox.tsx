"use client";

import { useCallback, useEffect, useRef } from "react";
import { fileName } from "./shared";
import { createPortal } from "react-dom";
import Image from "next/image";
import type Lenis from "lenis";
import { useLanguage } from "@/context/LanguageContext";
import type { MediaCredit } from "@/content/media-credits";
import { mediaCopy } from "@/content/media";

export function Lightbox({ items, index, onIndex, onClose }: { items: MediaCredit[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
    const { locale } = useLanguage();
    const m = mediaCopy[locale];
    const dialog = useRef<HTMLDivElement>(null);
    const closeBtn = useRef<HTMLButtonElement>(null);
    const item = items[index];
    const n = items.length;

    const go = useCallback((d: number) => onIndex((index + d + n) % n), [index, n, onIndex]);

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

    const kind = item.kind === "photo" || item.kind === "render" || item.kind === "diagram" ? m.kind[item.kind] : "";

    return createPortal(
        <div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-caption"
            className="fixed inset-0 z-[80] flex flex-col bg-ink"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-edge px-4">
                <p className="t-tele" aria-live="polite">
                    {String(index + 1).padStart(2, "0")} {m.of} {String(n).padStart(2, "0")}
                    {" // "}
                    {fileName(item.src)}
                    {" // "}
                    {item.width ?? "?"}×{item.height ?? "?"}PX
                </p>
                <button ref={closeBtn} type="button" onClick={onClose} className="toggle">
                    {m.close} · ESC
                </button>
            </div>

            <div
                className="relative flex min-h-0 flex-1 items-center justify-center p-4"
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
                    quality={80}
                    className="h-auto max-h-full w-auto max-w-full border border-edge object-contain"
                />
            </div>

            <div className="grid shrink-0 gap-px border-t border-edge bg-edge md:grid-cols-12">
                <div id="lightbox-caption" className="bg-ink px-4 py-3 md:col-span-9">
                    <p className="text-[0.9375rem] text-fg">
                        {item.alt[locale]}
                        {kind && <span className="t-tele ml-2 text-faint">{kind}</span>}
                    </p>
                    <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
                        {m.credit}: {item.credit[locale]}
                        {item.licence && <> · {item.licence}</>}
                        {item.sourceUrl && (
                            <>
                                {" · "}
                                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="link text-fg-2">
                                    {m.source} ↗
                                </a>
                            </>
                        )}
                    </p>
                    {item.note && <p className="mt-1 text-[0.8125rem] leading-relaxed text-faint">{item.note[locale]}</p>}
                </div>
                <div className="flex items-center gap-4 bg-ink px-4 py-3 md:col-span-3 md:justify-end">
                    <button type="button" onClick={() => go(-1)} className="toggle" aria-label={m.prev}>
                        ←
                    </button>
                    <button type="button" onClick={() => go(1)} className="toggle" aria-label={m.next}>
                        →
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}

/* ── Flight film ─────────────────────────────────────────────────────── */
