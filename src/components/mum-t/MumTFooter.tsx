"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

export function MumTFooter() {
    const { locale } = useLanguage();
    const mt = useMumtT(locale);
    return (
        <footer className="relative border-t border-white/5 bg-[#020617] px-4 py-16 sm:px-6 md:px-12 md:py-20">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <p className="mb-6 font-mono text-[9px] tracking-[0.5em] text-red-500/40">
                        TOP SECRET // SCI // NOFORN — MUM-T TACTICAL DATA LINK INTERFACE v2.4
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded border border-red-500/20 bg-red-500/5 px-5 py-2.5 font-mono text-[11px] font-bold tracking-[0.2em] text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/10"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        {mt.footer.abort}
                    </Link>
                </motion.div>

                <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

                <div className="flex flex-col items-center gap-2 text-center">
                    <p className="font-mono text-[10px] tracking-[0.15em] text-slate-500">
                        {mt.footer.developedBy}
                    </p>
                    <a
                        href="https://github.com/SpaceEngineerSS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-slate-300 transition-colors hover:text-neon-blue"
                    >
                        Mehmet Gümüş
                    </a>
                    <a
                        href="https://github.com/SpaceEngineerSS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] text-slate-500 transition-colors hover:text-neon-blue"
                    >
                        github.com/SpaceEngineerSS
                    </a>
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] tracking-[0.15em] text-neon-blue/40">
                        {mt.footer.model3d}
                    </span>
                    <a
                        href="https://www.linkedin.com/in/kaan-azman-591776201/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[11px] text-slate-400 transition-colors hover:text-neon-blue"
                    >
                        Kaan Azman
                    </a>
                </div>

                <p className="font-mono text-[8px] tracking-[0.2em] text-slate-600">
                    {mt.footer.copyright}
                </p>
            </div>
        </footer>
    );
}
