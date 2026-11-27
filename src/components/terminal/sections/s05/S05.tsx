"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { DATA_AS_OF } from "@/content/aircraft";
import { s05Copy } from "@/content/s05";
import { VisorPlate } from "./VisorPlate";
import { CompareRule } from "./CompareRule";
import { SensorPlate } from "./SensorPlate";
import { ProgrammeTimeline } from "./ProgrammeTimeline";
import { ArchiveStrip } from "./ArchiveStrip";
import { FlightFilm } from "./FlightFilm";

/** 05 // The engineering file: numbered plates after the pinned 3D track. */
export function S05() {
    const { locale } = useLanguage();
    const c = s05Copy[locale];

    return (
        <section id="s05" aria-labelledby="s05-title" className="relative z-10 border-t border-edge bg-ink pb-24 pt-28 md:pb-32 md:pt-40">
            <div className="wrap">
                <header className="mb-20 md:mb-28">
                    <p className="t-tele">
                        {c.index}
                        {" // "}
                        {DATA_AS_OF[locale]}
                    </p>
                    <h2 id="s05-title" className="t-monument mt-4 whitespace-normal text-[clamp(3.5rem,1rem+10vw,12rem)]">
                        {c.title}
                    </h2>
                </header>

                <VisorPlate />
                <CompareRule />
                <SensorPlate />
                <ProgrammeTimeline />
                <ArchiveStrip />
                <FlightFilm />

                <div className="mt-16 flex justify-end border-t border-edge pt-4">
                    <Link href="/kaynaklar" className="toggle inline-flex items-center hover:text-fg">
                        {c.sources} → /kaynaklar
                    </Link>
                </div>
            </div>
        </section>
    );
}
