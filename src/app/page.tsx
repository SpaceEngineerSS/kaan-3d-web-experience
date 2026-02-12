"use client";

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

const HeroScene = dynamic(
  () => import("@/components/HeroScene").then((mod) => ({ default: mod.HeroScene })),
  { ssr: false }
);

const HUDOverlay = dynamic(
  () => import("@/components/ui/HUDOverlay").then((mod) => ({ default: mod.HUDOverlay })),
  { ssr: false }
);

export default function Home() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <main className="relative">
          <LegalDisclaimer />
          <HUDOverlay />
          <Navbar />
          <HeroScene />
          <ScrollSections />
          <SpecsGrid />
          <CockpitDashboard />
          <TechnologyDetails />
          <ComparisonChart />
          <Timeline />
          <VideoBriefing />
          <PhotoGallery />
          <Footer />
        </main>
      </ThemeProvider>
    </LanguageProvider>
  );
}
