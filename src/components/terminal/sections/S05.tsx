"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type Lenis from "lenis";
import { motion } from "motion/react";
import { useLanguage, type Locale } from "@/context/LanguageContext";
import { fighters, comparisonCopy, type Fighter } from "@/content/comparison";
import { events, orders, programmeCopy } from "@/content/programme";
import { galleryCredits, videoCredits, videoSources, type MediaCredit } from "@/content/media-credits";
import { mediaCopy } from "@/content/media";
import { cockpit } from "@/content/cockpit";
import { DATA_AS_OF } from "@/content/aircraft";

type L<T = string> = Record<Locale, T>;

/* ── Local copy ───────────────────────────────────────────────────────── */

const copy: L<{
    index: string;
    title: string;
    hmdsLabel: string;
    hmdsTitle: string;
    fov: string;
    visorNote: string;
    matrixLabel: string;
    matrixTitle: string;
    planLabel: string;
    planNote: string;
    sinceFirst: string;
    years: string;
    genStatus: string;
    progLabel: string;
    progTitle: string;
    colDate: string;
    colEvent: string;
    colStatus: string;
    ordersLabel: string;
    archiveLabel: string;
    archiveHint: string;
    filmLabel: string;
    sources: string;
    noSource: string;
    prev: string;
    next: string;
    strip: string;
}> = {
    tr: {
        index: "05",
        title: "Mühendislik dosyası",
        hmdsLabel: "HMDS // VİZÖR",
        hmdsTitle: "HUD yok, vizör var",
        fov: "Görüş alanı",
        visorNote:
            "İlk uçuşun açıklanan sınırları: en çok 8.000 ft, 230 knot, iniş takımları açık, yaklaşık 13 dakika. Sahnedeki canlandırma bu zarfın içinde kalır; KAAN'ın gerçek vizör sembolojisi yayımlanmadı.",
        matrixLabel: "TEKNİK KARŞILAŞTIRMA MATRİSİ",
        matrixTitle: "KAAN / F-35A / Su-57",
        planLabel: "PLAN GÖRÜNÜŞÜ // AYNI ÖLÇEK",
        planNote: "Uzunluk × kanat açıklığı çerçeveleri, metre. Gövde biçimi değil, zarf karşılaştırması.",
        sinceFirst: "İlk uçuştan bu yana",
        years: "yıl",
        genStatus: "Nesil / durum",
        progLabel: "PROGRAM MATRİSİ",
        progTitle: "Takvim ve siparişler",
        colDate: "Tarih",
        colEvent: "Olay",
        colStatus: "Durum",
        ordersLabel: "SİPARİŞLER",
        archiveLabel: "ARŞİV ŞERİDİ",
        archiveHint: "Sürükleyin, kaydırın ya da ok tuşlarını kullanın. Büyütmek için bir görsel seçin.",
        filmLabel: "UÇUŞ KAYDI // P0 2024",
        sources: "Tüm kaynaklar",
        noSource: "bağlantı yok",
        prev: "Önceki",
        next: "Sonraki",
        strip: "Görsel arşivi, yatay şerit",
    },
    en: {
        index: "05",
        title: "Engineering file",
        hmdsLabel: "HMDS // VISOR",
        hmdsTitle: "No HUD, a visor",
        fov: "Field of view",
        visorNote:
            "Published first-flight limits: at most 8,000 ft, 230 kt, gear down, about 13 minutes. The animation in the scene stays inside that envelope; KAAN's real visor symbology has not been published.",
        matrixLabel: "TECHNICAL COMPARISON MATRIX",
        matrixTitle: "KAAN / F-35A / Su-57",
        planLabel: "PLAN VIEW // SAME SCALE",
        planNote: "Length × span frames, metres. An envelope comparison, not airframe shapes.",
        sinceFirst: "Since first flight",
        years: "yr",
        genStatus: "Generation / status",
        progLabel: "PROGRAMME MATRIX",
        progTitle: "Timeline and orders",
        colDate: "Date",
        colEvent: "Event",
        colStatus: "Status",
        ordersLabel: "ORDERS",
        archiveLabel: "ARCHIVE STRIP",
        archiveHint: "Drag, scroll or use the arrow keys. Select an image to enlarge it.",
        filmLabel: "FLIGHT RECORD // P0 2024",
        sources: "All sources",
        noSource: "no link",
        prev: "Previous",
        next: "Next",
        strip: "Image archive, horizontal strip",
    },
};

const IDS = ["kaan", "f35a", "su57"] as const;
const PEERS: Fighter[] = IDS.map((id) => fighters.find((f) => f.id === id)).filter((f): f is Fighter => !!f);

/** Reference date for "time since first flight" (data as of mid-November 2026). */
const AS_OF = Date.UTC(2026, 10, 15);
const yearsSince = (iso: string) => (AS_OF - Date.parse(iso)) / (365.25 * 864e5);

const GRID_BG: CSSProperties = {
    backgroundImage:
        "linear-gradient(var(--color-edge) 1px, transparent 1px), linear-gradient(90deg, var(--color-edge) 1px, transparent 1px)",
    backgroundSize: "96px 96px",
    backgroundPosition: "-1px -1px",
};

function fmt(n: number, locale: Locale, digits = 1) {
    return n.toLocaleString(locale === "tr" ? "tr-TR" : "en-GB", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function SectionHead({ label, title }: { label: string; title: string }) {
    return (
        <div className="cross grid gap-2 border border-edge bg-ink px-4 py-4 md:grid-cols-12 md:items-end">
            <p className="t-tele md:col-span-4">{label}</p>
            <h3 className="t-h3 text-fg md:col-span-8">{title}</h3>
        </div>
    );
}

/* ── Section ──────────────────────────────────────────────────────────── */

export function S05() {
    const { locale } = useLanguage();
    const c = copy[locale];

    return (
        <section id="s05" aria-labelledby="s05-title" className="relative z-10 border-t border-edge bg-ink py-24 md:py-32" style={GRID_BG}>
            <div className="wrap">
                <header className="cross mb-16 grid gap-4 border border-edge bg-ink p-4 md:grid-cols-12 md:items-end md:p-6">
                    <p className="t-tele md:col-span-3">
                        {c.index}{" // "}{DATA_AS_OF[locale]}
                    </p>
                    <h2 id="s05-title" className="t-h2 text-fg md:col-span-9">
                        {c.title}
                    </h2>
                </header>

                <Hmds />
                <Matrix />
                <Programme />
                <ArchiveStrip />
                <Film />

                <div className="mt-16 flex justify-end">
                    <Link href="/kaynaklar" className="toggle inline-flex items-center hover:text-fg">
                        {c.sources} → /kaynaklar
                    </Link>
                </div>
            </div>
        </section>
    );
}

/* ── HMDS ─────────────────────────────────────────────────────────────── */

function Hmds() {
    const { locale } = useLanguage();
    const c = copy[locale];
    const t = cockpit[locale].tulgar;
    return (
        <div className="mb-20">
            <SectionHead label={c.hmdsLabel} title={c.hmdsTitle} />
            <div className="grid gap-px border-x border-b border-edge bg-edge md:grid-cols-12">
                <div className="bg-ink p-4 md:col-span-7 md:p-6">
                    <p className="t-label mb-3">{t.title}</p>
                    <p className="t-body max-w-[42ch]">{t.body}</p>
                </div>
                <div className="grid content-start gap-px bg-edge md:col-span-5">
                    <dl className="grid grid-cols-[9rem_1fr] gap-px bg-edge">
                        {t.specs.slice(0, 4).map((s) => (
                            <div key={s.term} className="contents">
                                <dt className="t-tele bg-ink px-4 py-3">{s.term}</dt>
                                <dd className="t-data bg-ink px-4 py-3 text-[0.8125rem] text-fg-2">{s.value}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="bg-ink p-4 text-[0.8125rem] leading-relaxed text-muted">
                        <span className="t-tele mr-2 text-caution">NOTE</span>
                        {c.visorNote}
                    </p>
                </div>
            </div>
            <p className="mt-2 text-[0.75rem] leading-relaxed text-faint">{t.source}</p>
        </div>
    );
}

/* ── Comparison matrix ───────────────────────────────────────────────── */

type Metric = { key: string; label: string; unit: string; value: (f: Fighter) => number; show: (f: Fighter) => string; est: (f: Fighter) => boolean };

function Matrix() {
    const { locale } = useLanguage();
    const c = copy[locale];
    const cc = comparisonCopy[locale];
    const estOf = (f: Fighter, k: "length" | "span" | "mtow") => !!f.estimated?.includes(k);

    // Thrust is omitted: no sourced per-engine figures for F-35A / Su-57 in src/content.
    const metrics: Metric[] = [
        { key: "length", label: cc.cols.length, unit: "m", value: (f) => f.length, show: (f) => fmt(f.length, locale), est: (f) => estOf(f, "length") },
        { key: "span", label: cc.cols.span, unit: "m", value: (f) => f.span, show: (f) => fmt(f.span, locale), est: (f) => estOf(f, "span") },
        { key: "mtow", label: cc.cols.mtow, unit: "kg", value: (f) => f.mtow, show: (f) => fmt(f.mtow, locale, 0), est: (f) => estOf(f, "mtow") },
        {
            key: "ff",
            label: `${cc.cols.firstFlight} · ${c.sinceFirst}`,
            unit: c.years,
            value: (f) => yearsSince(f.firstFlight),
            show: (f) => `${f.firstFlight.split("-").reverse().join(".")} · ${fmt(yearsSince(f.firstFlight), locale)}`,
            est: () => false,
        },
    ];

    return (
        <div className="mb-20">
            <SectionHead label={c.matrixLabel} title={c.matrixTitle} />
            <div className="grid gap-px border-x border-b border-edge bg-edge lg:grid-cols-12">
                <div className="grid content-start gap-px bg-edge lg:col-span-8">
                    {metrics.map((m) => {
                        const max = Math.max(...PEERS.map(m.value));
                        return (
                            <div key={m.key} className="grid gap-px bg-edge sm:grid-cols-[11rem_1fr]">
                                <div className="bg-ink px-4 py-3">
                                    <p className="t-tele">{m.label}</p>
                                    <p className="t-tele mt-1 text-faint">{m.unit}</p>
                                </div>
                                <ul className="grid gap-2 bg-ink px-4 py-3">
                                    {PEERS.map((f) => {
                                        const kaan = f.id === "kaan";
                                        const pct = (m.value(f) / max) * 100;
                                        return (
                                            <li key={f.id} className="grid grid-cols-[3.75rem_1fr_auto] items-center gap-3">
                                                <span className={`t-tele ${kaan ? "text-fg" : ""}`}>{f.name}</span>
                                                <span className="relative block h-2 border border-edge" aria-hidden>
                                                    <span
                                                        className={`absolute inset-y-0 left-0 ${kaan ? "bg-hmd" : "bg-topcoat/50"} ${m.est(f) ? "opacity-60" : ""}`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </span>
                                                <span className={`t-data text-[0.75rem] tabular-nums ${kaan ? "text-fg" : "text-fg-2"}`}>
                                                    {m.show(f)}
                                                    {m.est(f) && <span className="ml-1 text-caution">*{cc.estimate}</span>}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                    <div className="grid gap-px bg-edge sm:grid-cols-[11rem_1fr]">
                        <div className="bg-ink px-4 py-3">
                            <p className="t-tele">{c.genStatus}</p>
                        </div>
                        <ul className="grid gap-px bg-edge">
                            {PEERS.map((f) => (
                                <li key={f.id} className="grid grid-cols-[3.75rem_2rem_1fr] gap-3 bg-ink px-4 py-2.5">
                                    <span className={`t-tele ${f.id === "kaan" ? "text-fg" : ""}`}>{f.name}</span>
                                    <span className="t-data text-[0.75rem] text-fg-2">{f.generation[locale]}</span>
                                    <span className="text-[0.8125rem] leading-snug text-fg-2">
                                        {f.status[locale]}
                                        <span className="t-tele mt-0.5 block text-faint normal-case tracking-normal">{f.engines[locale]}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <PlanView />
            </div>
            <p className="mt-2 text-[0.75rem] leading-relaxed text-faint">{cc.source}</p>
        </div>
    );
}

function PlanView() {
    const { locale } = useLanguage();
    const c = copy[locale];
    const maxL = Math.max(...PEERS.map((f) => f.length));
    const maxS = Math.max(...PEERS.map((f) => f.span));
    const pad = 2.4;
    const W = maxS + pad * 2;
    const H = maxL + pad * 2;
    const cx = W / 2;
    // Nose at the top; frames share the nose line so length differences read at the tail.
    const top = pad;

    return (
        <figure className="flex flex-col bg-ink p-4 lg:col-span-4">
            <figcaption className="t-tele mb-3">{c.planLabel}</figcaption>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[22rem]" role="img" aria-label={c.planNote}>
                {/* metre ticks along the left edge */}
                {Array.from({ length: Math.floor(maxL / 5) + 1 }, (_, i) => (
                    <g key={i}>
                        <line x1={0.4} x2={1.1} y1={top + i * 5} y2={top + i * 5} stroke="var(--color-edge-2)" strokeWidth={0.06} />
                        <text x={0.4} y={top + i * 5 - 0.3} fontSize={0.55} fill="var(--color-faint)" fontFamily="var(--font-mono)">
                            {i * 5}
                        </text>
                    </g>
                ))}
                <line x1={cx} x2={cx} y1={top - 1} y2={top + maxL + 1} stroke="var(--color-edge)" strokeWidth={0.05} strokeDasharray="0.4 0.3" />
                {PEERS.filter((f) => f.id !== "kaan").map((f) => (
                    <g key={f.id}>
                        <rect
                            x={cx - f.span / 2}
                            y={top}
                            width={f.span}
                            height={f.length}
                            fill="none"
                            stroke="var(--color-topcoat)"
                            strokeWidth={1}
                            strokeDasharray="4 3"
                            vectorEffect="non-scaling-stroke"
                        />
                        <text x={cx + f.span / 2 - 0.2} y={top + f.length - 0.3} fontSize={0.6} textAnchor="end" fill="var(--color-muted)" fontFamily="var(--font-mono)">
                            {f.name}
                        </text>
                    </g>
                ))}
                {PEERS.filter((f) => f.id === "kaan").map((f) => (
                    <g key={f.id}>
                        <rect x={cx - f.span / 2} y={top} width={f.span} height={f.length} fill="none" stroke="var(--color-hmd)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                        <text x={cx - f.span / 2 + 0.2} y={top + f.length - 0.3} fontSize={0.6} fill="var(--color-hmd)" fontFamily="var(--font-mono)">
                            {f.name}
                        </text>
                    </g>
                ))}
            </svg>
            <dl className="mt-4 grid gap-px border border-edge bg-edge">
                {PEERS.map((f) => (
                    <div key={f.id} className="grid grid-cols-[4rem_1fr] bg-ink px-3 py-1.5">
                        <dt className={`t-tele ${f.id === "kaan" ? "text-hmd" : ""}`}>{f.name}</dt>
                        <dd className="t-data text-right text-[0.75rem] text-fg-2">
                            {fmt(f.length, locale)} × {fmt(f.span, locale)} m
                        </dd>
                    </div>
                ))}
            </dl>
            <p className="mt-3 text-[0.75rem] leading-relaxed text-faint">{c.planNote}</p>
        </figure>
    );
}

/* ── Programme matrix ────────────────────────────────────────────────── */

function Programme() {
    const { locale } = useLanguage();
    const c = copy[locale];
    const p = programmeCopy[locale];

    return (
        <div className="mb-20">
            <SectionHead label={c.progLabel} title={c.progTitle} />
            <div className="border-x border-b border-edge">
                <div className="hidden grid-cols-[12rem_1fr_9rem] gap-px border-b border-edge bg-edge md:grid">
                    <p className="t-tele bg-ink px-4 py-2">{c.colDate}</p>
                    <p className="t-tele bg-ink px-4 py-2">{c.colEvent}</p>
                    <p className="t-tele bg-ink px-4 py-2">{c.colStatus}</p>
                </div>
                <ol className="grid gap-px bg-edge">
                    {events.map((e) => (
                        <li key={e.id} className={`grid gap-px bg-edge md:grid-cols-[12rem_1fr_9rem] ${e.done ? "" : "opacity-60"}`}>
                            <p className={`t-data bg-ink px-4 pt-3 text-[0.75rem] md:py-3 ${e.key ? "text-hmd" : "text-fg-2"}`}>{e.date[locale]}</p>
                            <div className="bg-ink px-4 py-1 md:py-3">
                                <p className={`text-[0.9375rem] ${e.done ? "text-fg" : "text-muted"}`}>{e.title[locale]}</p>
                                <p className="mt-1 max-w-[70ch] text-[0.8125rem] leading-relaxed text-muted">{e.body[locale]}</p>
                            </div>
                            <p className="t-tele bg-ink px-4 pb-3 md:py-3">
                                <span className={e.done ? "text-fg-2" : "text-faint"}>{e.done ? `■ ${p.done}` : `□ ${p.planned}`}</span>
                            </p>
                        </li>
                    ))}
                </ol>
            </div>

            <div className="mt-8 grid gap-px border border-edge bg-edge md:grid-cols-2">
                <p className="t-tele bg-ink px-4 py-2 md:col-span-2">{c.ordersLabel}</p>
                {orders.map((o) => (
                    <div key={o.id} className="grid grid-cols-[6rem_1fr] gap-px bg-edge">
                        <div className="bg-ink px-4 py-3">
                            <p className="t-num text-[2.5rem] text-fg">{o.figure}</p>
                            <p className="t-tele mt-1">{o.unit[locale]}</p>
                        </div>
                        <div className="bg-ink px-4 py-3">
                            <p className="text-[0.9375rem] text-fg">{o.customer[locale]}</p>
                            <dl className="mt-2 grid grid-cols-[6rem_1fr] gap-x-3 gap-y-1">
                                {o.rows.map((r) => (
                                    <div key={r.term.en} className="contents">
                                        <dt className="t-tele">{r.term[locale]}</dt>
                                        <dd className="t-data text-[0.75rem] text-fg-2">{r.value[locale]}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-2 text-[0.75rem] leading-relaxed text-faint">{p.source}</p>
        </div>
    );
}

/* ── Archive strip ───────────────────────────────────────────────────── */

const fileName = (src: string) => src.split("/").pop() ?? src;

function ArchiveStrip() {
    const { locale } = useLanguage();
    const c = copy[locale];
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
        <div className="mb-20">
            <SectionHead label={c.archiveLabel} title={m.galleryTitle} />
            <div className="flex items-center justify-between gap-4 border-x border-b border-edge bg-ink px-4 py-2">
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
                className="archive-strip overflow-x-auto overscroll-x-contain border-x border-b border-edge bg-ink"
                style={{ scrollbarColor: "var(--color-edge-2) var(--color-ink)", scrollbarWidth: "thin" }}
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
                                        sizes="(min-width: 768px) 80vw, 100vw"
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

function Lightbox({ items, index, onIndex, onClose }: { items: MediaCredit[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
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
                    {String(index + 1).padStart(2, "0")} {m.of} {String(n).padStart(2, "0")}{" // "}{fileName(item.src)}{" // "}{item.width ?? "?"}×{item.height ?? "?"}PX
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
        document.body
    );
}

/* ── Flight film ─────────────────────────────────────────────────────── */

const tc = (s: number) => {
    const t = Math.max(0, Math.floor(s || 0));
    const hh = String(Math.floor(t / 3600)).padStart(2, "0");
    const mm = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
    const ss = String(t % 60).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
};

function Film() {
    const { locale } = useLanguage();
    const c = copy[locale];
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
                    <source src={v.webm} type="video/webm" />
                    <source src={v.mp4} type="video/mp4" />
                    {m.noVideo}
                </video>
            </div>
            <figcaption className="grid gap-px border-x border-b border-edge bg-edge md:grid-cols-12">
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
