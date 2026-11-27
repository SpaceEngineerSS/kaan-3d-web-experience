"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage, type Locale } from "@/context/LanguageContext";
import { SECTION_IDS, setTelemetry, subscribeTerminal, terminal } from "@/lib/terminal/state";
import { SoundToggle } from "./SoundToggle";

type L = Record<Locale, string>;

const HOME_SECTIONS: L[] = [
    { tr: "İlk uçuş", en: "First flight" },
    { tr: "Gövde", en: "Airframe" },
    { tr: "Kokpit", en: "Cockpit" },
    { tr: "MUM-T", en: "MUM-T" },
    { tr: "Dosya", en: "File" },
];

export interface ShellItem {
    href: string;
    label: L;
}

const ROUTES: { href: string; label: L }[] = [
    { href: "/", label: { tr: "KAAN", en: "KAAN" } },
    { href: "/mum-t", label: { tr: "MUM-T", en: "MUM-T" } },
    { href: "/kaynaklar", label: { tr: "Kaynaklar", en: "Sources" } },
];

/** The one top bar for every page: wordmark, in-page index, routes, HUD / sound / language. */
export function StatusBar({ items }: { items?: ShellItem[] }) {
    const { locale, setLocale } = useLanguage();
    const path = usePathname();
    const home = path === "/";
    const section = useSyncExternalStore(
        subscribeTerminal,
        () => terminal.section,
        () => 0,
    );
    const hud = useSyncExternalStore(
        subscribeTerminal,
        () => terminal.telemetry,
        () => true,
    );
    const [open, setOpen] = useState(false);

    const index: ShellItem[] = items ?? (home ? SECTION_IDS.map((id, i) => ({ href: `#${id}`, label: HOME_SECTIONS[i] })) : []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <header className="fixed inset-x-0 top-0 z-50 sm:inset-x-4 sm:top-4">
            <nav aria-label={locale === "tr" ? "Site gezinmesi" : "Site navigation"} className="flex h-11 items-stretch border-b border-edge bg-ink-2 sm:border">
                <Link href="/" className="flex items-center gap-3 border-r border-edge px-4">
                    <span className="font-display text-[15px] font-bold tracking-[0.04em] text-fg">KAAN</span>
                    <span className="t-tele hidden text-faint lg:inline">{locale === "tr" ? "Bağımsız monografi" : "Independent monograph"}</span>
                </Link>

                {index.length > 0 && (
                    <ol className="hidden flex-1 items-stretch md:flex">
                        {index.map((it, i) => {
                            const active = home && !items && section === i;
                            return (
                                <li key={it.href} className="flex">
                                    <a
                                        href={it.href}
                                        aria-current={active ? "true" : undefined}
                                        className={`t-tele relative flex items-center gap-2 border-r border-edge px-3 transition-colors hover:text-fg ${active ? "text-fg" : ""}`}
                                    >
                                        <span className={active ? "text-accent" : "text-faint"}>{String(i + 1).padStart(2, "0")}</span>
                                        <span className={items ? "hidden lg:inline" : "hidden xl:inline"}>{it.label[locale]}</span>
                                        {active && <span aria-hidden className="absolute inset-x-0 -bottom-px h-px bg-accent" />}
                                    </a>
                                </li>
                            );
                        })}
                    </ol>
                )}

                <div className="ml-auto flex items-stretch">
                    <ul className="hidden items-stretch lg:flex">
                        {ROUTES.filter((r) => r.href !== path).map((r) => (
                            <li key={r.href} className="flex border-l border-edge">
                                <Link href={r.href} className="t-tele flex items-center px-3 hover:text-fg">
                                    {r.label[locale]}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="flex items-center gap-3 border-l border-edge px-3">
                        {home && (
                            <button type="button" className="toggle hidden sm:inline" aria-pressed={hud} onClick={() => setTelemetry(!hud)}>
                                HUD
                            </button>
                        )}
                        <SoundToggle className="hidden sm:inline" />
                        <div role="group" aria-label={locale === "tr" ? "Dil" : "Language"} className="flex">
                            {(["tr", "en"] as Locale[]).map((l) => (
                                <button key={l} type="button" lang={l} aria-pressed={locale === l} onClick={() => setLocale(l)} className="toggle">
                                    {l.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <button type="button" className="toggle lg:hidden" aria-expanded={open} aria-controls="shell-menu" onClick={() => setOpen((o) => !o)}>
                            {open ? (locale === "tr" ? "KAPAT" : "CLOSE") : locale === "tr" ? "DİZİN" : "INDEX"}
                        </button>
                    </div>
                </div>
            </nav>

            {open && (
                <div id="shell-menu" className="max-h-[calc(100svh-2.75rem)] overflow-y-auto border-b border-edge bg-ink-2 sm:border-x lg:hidden">
                    {index.length > 0 && (
                        <ol>
                            {index.map((it, i) => (
                                <li key={it.href} className="border-t border-edge">
                                    <a href={it.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 px-4 py-3">
                                        <span className="t-tele text-accent">{String(i + 1).padStart(2, "0")}</span>
                                        <span className="font-display text-2xl font-bold uppercase tracking-[-0.02em]">{it.label[locale]}</span>
                                    </a>
                                </li>
                            ))}
                        </ol>
                    )}
                    <ul className="flex flex-wrap gap-x-5 border-t border-edge px-4 py-3">
                        {ROUTES.filter((r) => r.href !== path).map((r) => (
                            <li key={r.href}>
                                <Link href={r.href} onClick={() => setOpen(false)} className="toggle inline-flex items-center">
                                    {r.label[locale]}
                                </Link>
                            </li>
                        ))}
                        <li className="sm:hidden">
                            <SoundToggle />
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
