"use client";

import { GlitchText } from "./GlitchText";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/lib/translations";

const navHrefs = ["#hero", "#overview", "#specs", "#systems"];

interface FooterLangData {
    description: Record<string, string>;
    navTitle: Record<string, string>;
    navLinks: Record<string, string[]>;
    devTitle: Record<string, string>;
    copyright: Record<string, string>;
    madeWith: Record<string, string>;
    footerLegal: Record<string, string>;
}

export function Footer() {
    const { locale } = useLanguage();
    const f: FooterLangData = { ...translations.footer, footerLegal: translations.footerLegal };

    return (
        <footer className="relative z-10 border-t border-neon-blue/10 bg-cockpit-dark">
            <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
                <div className="grid gap-12 md:grid-cols-3">
                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="h-8 w-1 bg-neon-blue" />
                            <span className="text-xl font-bold tracking-[0.2em] text-white">
                                KAAN
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-300">
                            {f.description[locale]}
                        </p>
                    </div>

                    <div>
                        <h3
                            className="mb-4 text-xs tracking-[0.3em] text-neon-blue/70 uppercase"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {f.navTitle[locale]}
                        </h3>
                        <div className="flex flex-col gap-2">
                            {f.navLinks[locale].map((link, i) => (
                                <a
                                    key={i}
                                    href={navHrefs[i]}
                                    className="text-sm text-slate-300 transition-colors hover:text-neon-blue"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3
                            className="mb-4 text-xs tracking-[0.3em] text-neon-blue/70 uppercase"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {f.devTitle[locale]}
                        </h3>
                        <a
                            href="https://github.com/SpaceEngineerSS"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-neon-blue"
                        >
                            <GlitchText className="text-neon-blue">
                                Mehmet Gümüş
                            </GlitchText>
                            <svg
                                className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <p
                            className="mt-2 text-xs text-slate-400"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            github.com/SpaceEngineerSS
                        </p>
                    </div>
                </div>

                {/* Legal Notice */}
                <div className="mt-10 rounded-lg border border-red-500/10 bg-red-500/5 px-6 py-4">
                    <p
                        className="text-center text-[10px] leading-relaxed tracking-[0.1em] text-red-400/70"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        {f.footerLegal[locale]}
                    </p>
                </div>

                <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-titanium/30 pt-6 md:flex-row">
                    <p
                        className="text-xs text-slate-400"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        {f.copyright[locale]}
                    </p>
                    <p
                        className="text-xs text-titanium-light/40"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        {locale === "tr" ? (
                            <>
                                <a
                                    href="https://github.com/SpaceEngineerSS"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-neon-blue/60 transition-colors hover:text-neon-blue"
                                >
                                    Mehmet Gümüş
                                </a>
                                {" "}{f.madeWith[locale]}
                            </>
                        ) : (
                            <>
                                {f.madeWith[locale]}{" "}
                                <a
                                    href="https://github.com/SpaceEngineerSS"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-neon-blue/60 transition-colors hover:text-neon-blue"
                                >
                                    Mehmet Gümüş
                                </a>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </footer>
    );
}
