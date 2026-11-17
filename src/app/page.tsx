import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/chapters/Hero";
import { FirstFlight } from "@/components/chapters/FirstFlight";
import { FlightExperience } from "@/components/flight/FlightExperience";
import { Airframe } from "@/components/chapters/Airframe";
import { Cockpit } from "@/components/chapters/Cockpit";
import { Sensors } from "@/components/chapters/Sensors";
import { Specifications } from "@/components/chapters/Specifications";
import { Weapons } from "@/components/chapters/Weapons";
import { Engine } from "@/components/chapters/Engine";
import { Programme } from "@/components/chapters/Programme";
import { Archive } from "@/components/chapters/Archive";
import { MumtTeaser } from "@/components/chapters/MumtTeaser";
import { LazyMount } from "@/components/site/LazyMount";

export const metadata: Metadata = {
    alternates: { canonical: "/" },
};

export default function Home() {
    return (
        <>
            <Navbar />
            <main id="main" className="relative">
                <Hero />
                <FirstFlight />
                <FlightExperience />
                <Airframe />
                <LazyMount minHeight="100svh" id="cockpit">
                    <Cockpit />
                </LazyMount>
                <Sensors />
                <Specifications />
                <Weapons />
                <Engine />
                <Programme />
                <Archive />
                <MumtTeaser />
            </main>
            <Footer />
        </>
    );
}
