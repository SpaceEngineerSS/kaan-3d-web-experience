"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage, type Locale } from "@/context/LanguageContext";

export interface NavItem {
    href: string;
    label: Record<Locale, string>;
}

export const HOME_NAV: NavItem[] = [
    { href: "/#s01", label: { tr: "01", en: "01" } },
    { href: "/#s02", label: { tr: "02", en: "02" } },
    { href: "/#s03", label: { tr: "03", en: "03" } },
    { href: "/#s04", label: { tr: "04", en: "04" } },
    { href: "/#s05", label: { tr: "05 Dosya", en: "05 File" } },
];

interface NavbarProps {
    items?: NavItem[];
    /** Extra link to the other route. */
    route?: { href: string; label: Record<Locale, string> };
    /** Where the wordmark points. */
    homeHref?: string;
}

export function Navbar({ items = HOME_NAV, route = { href: "/mum-t", label: { tr: "MUM-T", en: "MUM-T" } }, homeHref = "/" }: NavbarProps) {
    const { locale, setLocale } = useLanguage();
    const [open, setOpen] = useState(false);
    const progress = useRef<HTMLDivElement>(null);
    const menuBtn = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const y = window.scrollY;
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
        <div className="flex items-center gap-2" role="group" aria-label={locale === "tr" ? "Dil" : "Language"}>
            {(["tr", "en"] as Locale[]).map((l) => (
                <button key={l} type="button" className="toggle" aria-pressed={locale === l} onClick={() => setLocale(l)} lang={l}>
                    {l.toUpperCase()}
                </button>
            ))}
        </div>
    );

    const RouteLink = route.href.startsWith("/") ? Link : "a";

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-edge bg-ink sm:inset-x-4 sm:top-4 sm:border-x">
            <nav aria-label={locale === "tr" ? "Ana menü" : "Main"} className="flex h-11 items-stretch">
                <a href={homeHref} className="flex items-center gap-3 border-r border-edge px-4" onClick={() => setOpen(false)}>
                    <span className="font-display text-base font-bold uppercase tracking-[-0.03em] text-fg">KAAN</span>
                    <span className="t-tele hidden text-faint sm:inline">{locale === "tr" ? "BAĞIMSIZ ÇALIŞMA" : "INDEPENDENT STUDY"}</span>
                </a>

                <ul className="hidden min-w-0 flex-1 items-stretch lg:flex">
                    {items.map((it) => (
                        <li key={it.href} className="flex border-r border-edge">
                            <a href={it.href} className="t-tele flex items-center px-3 text-fg-2 transition-colors hover:text-fg">
                                {it.label[locale]}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="ml-auto flex items-stretch">
                    <div className="hidden items-center border-l border-edge px-3 lg:flex">
                        <RouteLink href={route.href} className="toggle inline-flex items-center hover:text-hmd">
                            {route.label[locale]}
                        </RouteLink>
                    </div>
                    <div className="flex items-center border-l border-edge px-3">{langSwitch}</div>
                    <div className="flex items-center border-l border-edge px-3 lg:hidden">
                        <button
                            ref={menuBtn}
                            type="button"
                            className="toggle"
                            aria-expanded={open}
                            aria-controls="mobile-menu"
                            aria-label={open ? (locale === "tr" ? "Menüyü kapat" : "Close menu") : locale === "tr" ? "Menüyü aç" : "Open menu"}
                            onClick={() => setOpen((o) => !o)}
                        >
                            {open ? "×" : "MENU"}
                        </button>
                    </div>
                </div>
            </nav>

            <div className="h-px w-full origin-left bg-hmd" ref={progress} style={{ transform: "scaleX(0)" }} aria-hidden />

            {open && (
                <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-11 z-40 overflow-y-auto border-t border-edge bg-ink lg:hidden">
                    <ul className="grid gap-px bg-edge">
                        {items.map((it, i) => (
                            <li key={it.href} className="bg-ink">
                                <a href={it.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 px-4 py-4">
                                    <span className="t-tele text-faint">{String(i + 1).padStart(2, "0")}</span>
                                    <span className="font-display text-2xl font-bold uppercase tracking-[-0.03em]">{it.label[locale]}</span>
                                </a>
                            </li>
                        ))}
                        <li className="bg-ink px-4 py-4">
                            <RouteLink href={route.href} onClick={() => setOpen(false)} className="toggle inline-flex items-center">
                                {route.label[locale]} →
                            </RouteLink>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
