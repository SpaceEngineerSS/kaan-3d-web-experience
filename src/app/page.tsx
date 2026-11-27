import type { Metadata } from "next";
import { StatusBar } from "@/components/shell/StatusBar";
import { Frame } from "@/components/shell/Frame";
import { ModeBar } from "@/components/shell/ModeBar";
import { TerminalDriver } from "@/components/terminal/TerminalDriver";
import { LeaderLines } from "@/components/terminal/LeaderLines";
import { S01 } from "@/components/terminal/sections/S01";
import { S02 } from "@/components/terminal/sections/S02";
import { S03 } from "@/components/terminal/sections/S03";
import { S04 } from "@/components/terminal/sections/S04";
import { S05 } from "@/components/terminal/sections/s05/S05";
import { Footer } from "@/components/shell/Footer";
import { SceneMount } from "@/components/terminal/SceneMount";
import { Monument } from "@/components/terminal/Monument";

export const metadata: Metadata = {
    alternates: { canonical: "/" },
};

/**
 * The home page is a flight-test terminal. Sections 01–04 scroll over one pinned 3D scene (#track);
 * section 05 is the editorial engineering part that follows it.
 */
export default function Home() {
    return (
        <>
            <StatusBar />
            <Frame />
            <ModeBar />
            <TerminalDriver />
            <main id="main" className="relative bg-ink">
                <div id="track" className="relative">
                    <div className="sticky top-0 h-[100svh] overflow-hidden bg-ink">
                        <Monument />
                        <SceneMount />
                        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(8,9,11,0.75)_100%)]" />
                        {/* On phones and tablets the text blocks share the screen with the model; the leader lines would cross them. */}
                        <div className="hidden lg:contents">
                            <LeaderLines />
                        </div>
                    </div>
                    <div className="relative -mt-[100svh]">
                        <S01 />
                        <S02 />
                        <S03 />
                        <S04 />
                    </div>
                </div>
                <S05 />
            </main>
            <Footer />
        </>
    );
}
