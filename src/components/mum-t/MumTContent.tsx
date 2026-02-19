"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { FormationStateCtx, FormationDispatchCtx, useFormationReducer } from "@/components/mum-t/useFormation";
import { LanguageProvider } from "@/context/LanguageContext";

const MumTScene = dynamic(
    () =>
        import("@/components/mum-t/MumTScene").then((mod) => ({
            default: mod.MumTScene,
        })),
    { ssr: false }
);

const MumTHud = dynamic(
    () =>
        import("@/components/mum-t/MumTHud").then((mod) => ({
            default: mod.MumTHud,
        })),
    { ssr: false }
);

const FormationControls = dynamic(
    () =>
        import("@/components/mum-t/FormationControls").then((mod) => ({
            default: mod.FormationControls,
        })),
    { ssr: false }
);

const MumTConcept = dynamic(
    () =>
        import("@/components/mum-t/MumTConcept").then((mod) => ({
            default: mod.MumTConcept,
        })),
    { ssr: false }
);

const MissionTimeline = dynamic(
    () =>
        import("@/components/mum-t/MissionTimeline").then((mod) => ({
            default: mod.MissionTimeline,
        })),
    { ssr: false }
);

const PlatformCompare = dynamic(
    () =>
        import("@/components/mum-t/PlatformCompare").then((mod) => ({
            default: mod.PlatformCompare,
        })),
    { ssr: false }
);

const DataLinkDiagram = dynamic(
    () =>
        import("@/components/mum-t/DataLinkDiagram").then((mod) => ({
            default: mod.DataLinkDiagram,
        })),
    { ssr: false }
);

const CapabilityCards = dynamic(
    () =>
        import("@/components/mum-t/CapabilityCards").then((mod) => ({
            default: mod.CapabilityCards,
        })),
    { ssr: false }
);

const MumTStats = dynamic(
    () =>
        import("@/components/mum-t/MumTStats").then((mod) => ({
            default: mod.MumTStats,
        })),
    { ssr: false }
);

const AvionicsShowcase = dynamic(
    () =>
        import("@/components/mum-t/AvionicsShowcase").then((mod) => ({
            default: mod.AvionicsShowcase,
        })),
    { ssr: false }
);


const GenerationCompare = dynamic(
    () =>
        import("@/components/mum-t/GenerationCompare").then((mod) => ({
            default: mod.GenerationCompare,
        })),
    { ssr: false }
);

const ThreatLandscape = dynamic(
    () =>
        import("@/components/mum-t/ThreatLandscape").then((mod) => ({
            default: mod.ThreatLandscape,
        })),
    { ssr: false }
);

const ScenarioSimulator = dynamic(
    () =>
        import("@/components/mum-t/ScenarioSimulator").then((mod) => ({
            default: mod.ScenarioSimulator,
        })),
    { ssr: false }
);

const DefenseEcosystem = dynamic(
    () =>
        import("@/components/mum-t/DefenseEcosystem").then((mod) => ({
            default: mod.DefenseEcosystem,
        })),
    { ssr: false }
);

const VideoGallery = dynamic(
    () =>
        import("@/components/mum-t/VideoGallery").then((mod) => ({
            default: mod.VideoGallery,
        })),
    { ssr: false }
);

const SuperSimsekShowcase = dynamic(
    () =>
        import("@/components/mum-t/SuperSimsekShowcase").then((mod) => ({
            default: mod.SuperSimsekShowcase,
        })),
    { ssr: false }
);

const MumTFooter = dynamic(
    () =>
        import("@/components/mum-t/MumTFooter").then((mod) => ({
            default: mod.MumTFooter,
        })),
    { ssr: false }
);

const MumTTopBar = dynamic(
    () =>
        import("@/components/mum-t/MumTTopBar").then((mod) => ({
            default: mod.MumTTopBar,
        })),
    { ssr: false }
);

const ScrollToTop = dynamic(
    () =>
        import("@/components/mum-t/MumTTopBar").then((mod) => ({
            default: mod.ScrollToTop,
        })),
    { ssr: false }
);

export function MumTContent() {
    const [state, dispatch] = useFormationReducer();

    useEffect(() => {
        document.body.classList.add("mumt-page");
        return () => {
            document.body.classList.remove("mumt-page");
        };
    }, []);

    return (
        <LanguageProvider>
            <FormationStateCtx.Provider value={state}>
                <FormationDispatchCtx.Provider value={dispatch}>
                    <style>{`body::after { display: none !important; }`}</style>

                    <MumTTopBar />
                    <ScrollToTop />

                    <main className="relative z-[2] overflow-x-hidden bg-[#020617] text-white selection:bg-cyan-500/30">
                        <section className="relative h-dvh w-full overflow-hidden">
                            <div className="absolute inset-0">
                                <MumTScene />
                            </div>
                            <MumTHud />
                            <FormationControls />
                        </section>

                        <MumTConcept />
                        <ThreatLandscape />
                        <AvionicsShowcase />
                        <GenerationCompare />
                        <MissionTimeline />
                        <ScenarioSimulator />
                        <PlatformCompare />
                        <DataLinkDiagram />
                        <MumTStats />
                        <CapabilityCards />
                        <SuperSimsekShowcase />
                        <DefenseEcosystem />
                        <VideoGallery />
                        <MumTFooter />
                    </main>
                </FormationDispatchCtx.Provider>
            </FormationStateCtx.Provider>
        </LanguageProvider>
    );
}
