"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Image as ImageIcon, ChevronRight, X, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/lib/translations";

const galleryImages = [
    { src: "/gallery/kaan-1.jpg", alt: "KAAN Front View" },
    { src: "/gallery/kaan-2.jpg", alt: "KAAN Cem Doğut" },
    { src: "/gallery/kaan-4.png", alt: "KAAN TF-X" },
    { src: "/gallery/kaan-5.png", alt: "KAAN AB View" },
    { src: "/gallery/kaan-6.jpg", alt: "KAAN Formation" },
    { src: "/gallery/kaan-7.png", alt: "KAAN Concept Art" },
    { src: "/gallery/kaan-8.jpeg", alt: "KAAN Fighter" },
    { src: "/gallery/kaan-9.png", alt: "KAAN Side Profile" },
    { src: "/gallery/kaan-13.jpg", alt: "KAAN Milli Muharip Uçak" },
    { src: "/gallery/kaan-14.jpg", alt: "KAAN İlk Uçuş" },
    { src: "/gallery/kaan(AB).png", alt: "KAAN Afterburner" },
    { src: "/gallery/2061439.jpg", alt: "KAAN Uçuş Görüntüsü" },
];

/* ═══════════════════════════════════════════
   LIGHTBOX MODAL
   ═══════════════════════════════════════════ */
function Lightbox({
    images,
    index,
    onClose,
    onPrev,
    onNext,
}: {
    images: typeof galleryImages;
    index: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    const img = images[index];

    /* Keyboard navigation */
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") onPrev();
            if (e.key === "ArrowRight") onNext();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose, onPrev, onNext]);

    /* Prevent body scroll */
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition-all hover:border-neon-blue/40 hover:text-neon-blue"
                aria-label="Close"
            >
                <X className="h-5 w-5" />
            </button>

            {/* Previous */}
            <button
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition-all hover:border-neon-blue/40 hover:text-neon-blue"
                aria-label="Previous image"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Next */}
            <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition-all hover:border-neon-blue/40 hover:text-neon-blue"
                aria-label="Next image"
            >
                <ChevronRight className="h-5 w-5" />
            </button>

            {/* Image */}
            <div
                className="relative max-h-[85vh] max-w-[90vw]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={img.src}
                    alt={img.alt}
                    className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
                />
                {/* Bottom info bar */}
                <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8">
                    <div className="flex items-center justify-between">
                        <span
                            className="text-[10px] tracking-[0.2em] text-slate-300"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {img.alt}
                        </span>
                        <span
                            className="text-[9px] tracking-[0.3em] text-slate-500"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {index + 1} / {images.length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   PHOTO GALLERY
   ═══════════════════════════════════════════ */
export function PhotoGallery() {
    const { locale } = useLanguage();
    const g = translations.gallery[locale];
    const scrollRef = useRef<HTMLDivElement>(null);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const scrollGallery = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const amount = 340;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -amount : amount,
                behavior: "smooth",
            });
        }
    };

    const openLightbox = useCallback((index: number) => {
        setLightboxIndex(index);
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxIndex(null);
    }, []);

    const prevImage = useCallback(() => {
        setLightboxIndex((prev) =>
            prev === null ? null : prev === 0 ? galleryImages.length - 1 : prev - 1
        );
    }, []);

    const nextImage = useCallback(() => {
        setLightboxIndex((prev) =>
            prev === null ? null : prev === galleryImages.length - 1 ? 0 : prev + 1
        );
    }, []);

    return (
        <>
            <section className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
                <div className="mx-auto max-w-6xl">
                    {/* Section header */}
                    <div className="mb-12">
                        <div className="mb-3 flex items-center gap-3">
                            <ImageIcon className="h-4 w-4 text-neon-blue" />
                            <div className="h-px w-10 bg-neon-blue/40" />
                            <span
                                className="text-[10px] tracking-[0.4em] text-neon-blue/70 uppercase animate-hud-blink"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {g.sectionTag}
                            </span>
                        </div>
                        <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                            {g.title}{" "}
                            <span className="text-gradient">{g.titleAccent}</span>
                        </h2>
                    </div>

                    {/* Gallery card */}
                    <div className="glass-panel overflow-hidden rounded-2xl">
                        {/* Header bar */}
                        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="h-3.5 w-3.5 text-neon-blue/60" />
                                <span
                                    className="text-[10px] tracking-[0.3em] text-slate-400 uppercase"
                                    style={{ fontFamily: "var(--font-mono)" }}
                                >
                                    {galleryImages.length} {locale === "tr" ? "GÖRÜNTÜ" : "IMAGES"}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => scrollGallery("left")}
                                    className="flex h-7 w-7 items-center justify-center rounded border border-white/10 text-titanium-light/60 transition-all hover:border-neon-blue/30 hover:text-neon-blue"
                                    aria-label="Scroll left"
                                >
                                    <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                                </button>
                                <button
                                    onClick={() => scrollGallery("right")}
                                    className="flex h-7 w-7 items-center justify-center rounded border border-white/10 text-titanium-light/60 transition-all hover:border-neon-blue/30 hover:text-neon-blue"
                                    aria-label="Scroll right"
                                >
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Horizontal scroll */}
                        <div
                            ref={scrollRef}
                            className="flex gap-4 overflow-x-auto p-6"
                            style={{ scrollbarWidth: "none" }}
                        >
                            {galleryImages.map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => openLightbox(i)}
                                    className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/5 transition-all duration-500 hover:border-neon-blue/30 active:scale-95"
                                >
                                    <div className="h-52 w-80 bg-cockpit-dark md:h-72 md:w-96">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            loading="lazy"
                                            className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = "none";
                                                if (target.parentElement) {
                                                    target.parentElement.classList.add("flex", "items-center", "justify-center");
                                                    const placeholder = document.createElement("div");
                                                    placeholder.className = "text-center";
                                                    placeholder.innerHTML =
                                                        `<div class="text-titanium-light/30 text-[10px] tracking-[0.2em]" style="font-family:var(--font-mono)">${locale === "tr" ? "GÖRÜNTÜ<br/>YÜKLENEMEDİ" : "IMAGE<br/>UNAVAILABLE"}</div>`;
                                                    target.parentElement.appendChild(placeholder);
                                                }
                                            }}
                                        />
                                    </div>
                                    {/* Overlay label */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="text-[9px] tracking-[0.2em] text-slate-400"
                                                style={{ fontFamily: "var(--font-mono)" }}
                                            >
                                                IMG_{String(i + 1).padStart(3, "0")}.RAW
                                            </span>
                                            <span
                                                className="text-[8px] tracking-[0.2em] text-neon-blue/0 transition-all duration-300 group-hover:text-neon-blue/70"
                                                style={{ fontFamily: "var(--font-mono)" }}
                                            >
                                                {locale === "tr" ? "GÖRÜNTÜLE ▸" : "VIEW ▸"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <Lightbox
                    images={galleryImages}
                    index={lightboxIndex}
                    onClose={closeLightbox}
                    onPrev={prevImage}
                    onNext={nextImage}
                />
            )}
        </>
    );
}
