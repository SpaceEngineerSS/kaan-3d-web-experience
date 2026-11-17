import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HomeScene } from "@/components/HomeScene";
import { Story } from "@/components/chapters/Story";
import { Specifications } from "@/components/chapters/Specifications";
import { Stealth } from "@/components/chapters/Stealth";
import { Cockpit } from "@/components/chapters/Cockpit";
import { Weapons } from "@/components/chapters/Weapons";
import { Engine } from "@/components/chapters/Engine";
import { Comparison } from "@/components/chapters/Comparison";
import { Industry } from "@/components/chapters/Industry";
import { Timeline } from "@/components/chapters/Timeline";
import { Media } from "@/components/chapters/Media";
import { MumtTeaser } from "@/components/chapters/MumtTeaser";
import { LazyMount } from "@/components/site/LazyMount";

export const metadata: Metadata = {
    alternates: { canonical: "/" },
};

export default function Home() {
    return (
        <>
            <Navbar />
            <HomeScene />
            <main id="main" className="relative">
                <Story />
                {/* The 3D layer stops drawing once this marker scrolls past the top. */}
                <div id="scene-end" aria-hidden className="relative h-px" />
                <div className="relative z-10 bg-ground">
                    <Specifications />
                    <Stealth />
                    <LazyMount minHeight="100vh" id="cockpit">
                        <Cockpit />
                    </LazyMount>
                    <Weapons />
                    <Engine />
                    <Comparison />
                    <Industry />
                    <Timeline />
                    <Media />
                    <MumtTeaser />
                </div>
            </main>
            <Footer />
        </>
    );
}
