"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { ScrollSections } from "@/components/ScrollSections";
import { SpecsGrid } from "@/components/SpecsGrid";
import { TechnologyDetails } from "@/components/TechnologyDetails";
import { Timeline } from "@/components/Timeline";
import { VideoBriefing } from "@/components/VideoBriefing";
import { PhotoGallery } from "@/components/TechnicalArchive";
import { Footer } from "@/components/Footer";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { CockpitDashboard } from "@/components/ui/CockpitDashboard";
import { ComparisonChart } from "@/components/ui/ComparisonChart";
import { SceneControls } from "@/components/SceneControls";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ShortcutsModal } from "@/components/ShortcutsModal";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { FactCards } from "@/components/FactCards";
import { KonamiOverlay } from "@/components/KonamiOverlay";
import { SpecSheetDownload } from "@/components/SpecSheetDownload";

const HeroScene = dynamic(() => import("@/components/HeroScene").then((m) => ({ default: m.HeroScene })), { ssr: false });
const HUDOverlay = dynamic(() => import("@/components/ui/HUDOverlay").then((m) => ({ default: m.HUDOverlay })), { ssr: false });
const TulgarSection = dynamic(() => import("@/components/TulgarSection").then((m) => ({ default: m.TulgarSection })), { ssr: false });
const SizeComparison = dynamic(() => import("@/components/SizeComparison").then((m) => ({ default: m.SizeComparison })), { ssr: false });
const MissionBriefing = dynamic(() => import("@/components/MissionBriefing").then((m) => ({ default: m.MissionBriefing })), { ssr: false });
const EngineSection = dynamic(() => import("@/components/EngineSection").then((m) => ({ default: m.EngineSection })), { ssr: false });
const ProductionSection = dynamic(() => import("@/components/ProductionSection").then((m) => ({ default: m.ProductionSection })), { ssr: false });
const WeaponConfig = dynamic(() => import("@/components/WeaponConfig").then((m) => ({ default: m.WeaponConfig })), { ssr: false });
const LoyalWingman = dynamic(() => import("@/components/LoyalWingman").then((m) => ({ default: m.LoyalWingman })), { ssr: false });
const RCSVisualization = dynamic(() => import("@/components/RCSVisualization").then((m) => ({ default: m.RCSVisualization })), { ssr: false });
const GForceSimulator = dynamic(() => import("@/components/GForceSimulator").then((m) => ({ default: m.GForceSimulator })), { ssr: false });
const FlightEnvelope = dynamic(() => import("@/components/FlightEnvelope").then((m) => ({ default: m.FlightEnvelope })), { ssr: false });
const AvionicsArchitecture = dynamic(() => import("@/components/AvionicsArchitecture").then((m) => ({ default: m.AvionicsArchitecture })), { ssr: false });
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop").then((m) => ({ default: m.ScrollToTop })), { ssr: false });

export default function Home() {
    const [xRayMode, setXRayMode] = useState(false);
    const [cameraPreset, setCameraPreset] = useState<string | null>(null);
    const [showShortcuts, setShowShortcuts] = useState(false);

    const handleToggleXRay = useCallback(() => setXRayMode((p) => !p), []);
    const handleCameraPreset = useCallback((preset: string | null) => setCameraPreset(preset), []);
    const handleToggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }, []);
    const handleShowHelp = useCallback(() => setShowShortcuts((p) => !p), []);

    return (
        <LanguageProvider>
            <ThemeProvider>
                <main className="relative">
                    <LegalDisclaimer />
                    <HUDOverlay />
                    <KonamiOverlay />
                    <Navbar
                        onToggleXRay={handleToggleXRay}
                        onCameraPreset={handleCameraPreset}
                        onToggleFullscreen={handleToggleFullscreen}
                        onShowHelp={handleShowHelp}
                    />
                    <HeroScene xRayMode={xRayMode} cameraPreset={cameraPreset} />
                    <ScrollProgress />
                    <SceneControls
                        xRayMode={xRayMode}
                        onToggleXRay={handleToggleXRay}
                        cameraPreset={cameraPreset}
                        onSetCameraPreset={handleCameraPreset}
                    />

                    {/* Story & Overview */}
                    <ScrollSections />
                    <SpecsGrid />
                    <FlightEnvelope />
                    <GForceSimulator />

                    {/* Systems & Tech */}
                    <CockpitDashboard />
                    <TulgarSection />
                    <AvionicsArchitecture />
                    <TechnologyDetails />
                    <RCSVisualization />

                    {/* Weapons & Missions */}
                    <WeaponConfig />
                    <MissionBriefing />

                    {/* Comparisons */}
                    <ComparisonChart />
                    <SizeComparison />

                    {/* Ecosystem & Production */}
                    <LoyalWingman />
                    <EngineSection />
                    <ProductionSection />

                    {/* Facts & History */}
                    <FactCards />
                    <Timeline />

                    {/* Media */}
                    <VideoBriefing />
                    <PhotoGallery />

                    {/* Download & Footer */}
                    <SpecSheetDownload />
                    <Footer />

                    {/* Overlays */}
                    <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
                    <MobileBottomNav />
                    <ScrollToTop />
                </main>
            </ThemeProvider>
        </LanguageProvider>
    );
}
