import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MumtHero } from "@/components/mum-t/MumtHero";
import { MumTConcept } from "@/components/mum-t/MumTConcept";
import { ThreatLandscape } from "@/components/mum-t/ThreatLandscape";
import { MissionTimeline } from "@/components/mum-t/MissionTimeline";
import { ScenarioSimulator } from "@/components/mum-t/ScenarioSimulator";
import { PlatformCompare } from "@/components/mum-t/PlatformCompare";
import { DataLinkDiagram } from "@/components/mum-t/DataLinkDiagram";
import { SuperSimsekShowcase } from "@/components/mum-t/SuperSimsekShowcase";
import { DefenseEcosystem } from "@/components/mum-t/DefenseEcosystem";
import { VideoGallery } from "@/components/mum-t/VideoGallery";
import { MUMT_NAV } from "@/content/mumt";

const title = "İnsanlı–insansız ekip (MUM-T)";
const shareTitle = "KAAN ile insanlı–insansız ekip: ANKA-3 ve Süper Şimşek";
const description =
    "KAAN'ın ANKA-3 ve Süper Şimşek ile birlikte uçacağı insanlı–insansız ekip (MUM-T) kavramı: platformlar, veri bağı, örnek görevler ve program durumu, açık kaynaklarla. Manned–unmanned teaming with KAAN, ANKA-3 and Süper Şimşek.";

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: "/mum-t" },
    openGraph: {
        title: shareTitle,
        description,
        url: "/mum-t",
        images: [{ url: "/og-mumt.png", width: 1200, height: 630, alt: "KAAN flying with two ANKA-3 in formation" }],
    },
    twitter: {
        card: "summary_large_image",
        title: shareTitle,
        description,
        images: ["/og-mumt.png"],
    },
};

export default function MumTPage() {
    return (
        <>
            <Navbar items={MUMT_NAV} homeHref="#top" route={{ href: "/", label: { tr: "KAAN", en: "KAAN" } }} />
            <main id="main" className="relative bg-ground">
                <MumtHero />
                <MumTConcept />
                <ThreatLandscape />
                <MissionTimeline />
                <ScenarioSimulator />
                <PlatformCompare />
                <DataLinkDiagram />
                <SuperSimsekShowcase />
                <DefenseEcosystem />
                <VideoGallery />
            </main>
            <Footer />
        </>
    );
}
