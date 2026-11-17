"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage, type Locale } from "@/context/LanguageContext";

export interface NavItem {
    href: string;
    label: Record<Locale, string>;
}

export const HOME_NAV: NavItem[] = [
    { href: "#specs", label: { tr: "Veriler", en: "Specs" } },
    { href: "#stealth", label: { tr: "Gizlilik", en: "Stealth" } },
    { href: "#cockpit", label: { tr: "Kokpit", en: "Cockpit" } },
    { href: "#weapons", label: { tr: "Silahlar", en: "Weapons" } },
    { href: "#engine", label: { tr: "Motor", en: "Engine" } },
    { href: "#timeline", label: { tr: "Takvim", en: "Timeline" } },
    { href: "#media", label: { tr: "Arşiv", en: "Archive" } },
];

interface NavbarProps {
    items?: NavItem[];
    /** Extra link to the other route. */
    route?: { href: string; label: Record<Locale, string> };
    /** Where the wordmark points. */
    homeHref?: string;
}

export function Navbar({ items = HOME_NAV, route = { href: "/mum-t", label: { tr: "MUM-T", en: "MUM-T" } }, homeHref = "#hero" }: NavbarProps) {
    const { locale, setLocale } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const progress = useRef<HTMLDivElement>(null);
    const menuBtn = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const y = window.scrollY;
                setScrolled(y > 40);
                const max = document.documentElement.scrollHeight - window.innerHeight;
                if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
            });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        document.body.classList.add("overflow-locked");
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
                menuBtn.current?.focus();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.classList.remove("overflow-locked");
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const langSwitch = (
        <div className="seg" role="group" aria-label={locale === "tr" ? "Dil" : "Language"}>
            {(["tr", "en"] as Locale[]).map((l) => (
                <button key={l} type="button" aria-pressed={locale === l} onClick={() => setLocale(l)} lang={l}>
                    {l.toUpperCase()}
                </button>
            ))}
        </div>
    );

    const RouteLink = route.href.startsWith("/") ? Link : "a";

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,height] duration-300 ${
                scrolled || open ? "border-b border-line bg-ground/90 backdrop-blur-md" : "border-b border-transparent"
            }`}
        >
            <nav aria-label={locale === "tr" ? "Ana menü" : "Main"} className={`wrap flex items-center justify-between gap-6 transition-[height] duration-300 ${scrolled ? "h-14" : "h-[4.5rem]"}`}>
                <a href={homeHref} className="flex items-baseline gap-3" onClick={() => setOpen(false)}>
                    <span className="font-display text-xl font-semibold uppercase tracking-[-0.01em] cond">KAAN</span>
                    <span className="t-label hidden text-faint sm:inline">{locale === "tr" ? "bağımsız çalışma" : "independent study"}</span>
                </a>

                <ul className="hidden items-center gap-6 lg:flex">
                    {items.map((it) => (
                        <li key={it.href}>
                            <a href={it.href} className="t-label link text-fg-2 hover:text-fg">
                                {it.label[locale]}
                            </a>
                        </li>
                    ))}
                    <li>
                        <RouteLink href={route.href} className="t-label border border-line-strong px-2.5 py-1.5 text-fg transition-colors hover:border-signal hover:text-signal">
                            {route.label[locale]}
                        </RouteLink>
                    </li>
                </ul>

                <div className="flex items-center gap-3">
                    {langSwitch}
                    <button
                        ref={menuBtn}
                        type="button"
                        className="flex h-10 w-10 items-center justify-center border border-line-strong lg:hidden"
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label={open ? (locale === "tr" ? "Menüyü kapat" : "Close menu") : locale === "tr" ? "Menüyü aç" : "Open menu"}
                        onClick={() => setOpen((o) => !o)}
                    >
                        <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden>
                            <path d={open ? "M2 1l14 10M2 11L16 1" : "M0 1h18M0 6h18M0 11h12"} stroke="currentColor" strokeWidth="1.3" fill="none" className="transition-all" />
                        </svg>
                    </button>
                </div>
            </nav>

            <div className="h-px w-full origin-left bg-signal" ref={progress} style={{ transform: "scaleX(0)" }} aria-hidden />

            {open && (
                <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-14 z-40 overflow-y-auto bg-ground lg:hidden">
                    <ul className="wrap flex flex-col py-6">
                        {items.map((it, i) => (
                            <li key={it.href} className="border-b border-line">
                                <a href={it.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-4">
                                    <span className="t-data text-sm text-faint">{String(i + 1).padStart(2, "0")}</span>
                                    <span className="font-display text-3xl font-semibold uppercase cond">{it.label[locale]}</span>
                                </a>
                            </li>
                        ))}
                        <li className="pt-6">
                            <RouteLink href={route.href} onClick={() => setOpen(false)} className="btn">
                                {route.label[locale]}
                                <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden><path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" fill="none" strokeWidth="1.2" /></svg>
                            </RouteLink>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
