"use client";

import { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/lib/translations";

export function LegalDisclaimer() {
    const { locale } = useLanguage();
    const d = translations.disclaimer[locale];
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = sessionStorage.getItem("kaan-disclaimer-accepted");
        if (!dismissed) {
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        sessionStorage.setItem("kaan-disclaimer-accepted", "1");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="relative mx-4 max-w-lg overflow-hidden rounded-2xl border border-red-500/20 bg-cockpit-dark/95 backdrop-blur-xl">
                {/* Top accent line */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />

                <div className="px-8 pb-8 pt-6">
                    {/* Icon + headline */}
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10">
                            <ShieldAlert className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-wide text-red-400">
                                {d.headline}
                            </h2>
                            <div
                                className="text-[10px] tracking-[0.3em] text-red-400/50"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {d.tag}
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <p className="mb-2 text-sm leading-relaxed text-titanium-light/90">
                        {d.body}
                    </p>

                    <p className="mb-8 text-xs leading-relaxed text-titanium-light/60">
                        {d.rights}
                    </p>

                    {/* CTA button */}
                    <button
                        onClick={handleAccept}
                        className="group relative w-full overflow-hidden rounded-lg border border-neon-blue/40 bg-neon-blue/5 py-3 text-sm font-bold tracking-[0.2em] text-neon-blue transition-all duration-500 hover:border-neon-blue/80 hover:bg-neon-blue/10 hover:shadow-[0_0_30px_rgba(0,212,255,0.2)]"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        {d.button}
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-neon-blue/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </button>

                    {/* Bottom subtle text */}
                    <p
                        className="mt-4 text-center text-[9px] tracking-[0.2em] text-titanium-light/30"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        {d.fair}
                    </p>
                </div>
            </div>
        </div>
    );
}
