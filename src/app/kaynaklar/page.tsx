import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SourcesContent } from "@/components/sources/SourcesContent";

export const metadata: Metadata = {
    title: "Kaynaklar / Sources",
    description: "Image, video and 3D model credits and the data sources used on the KAAN study site.",
    alternates: { canonical: "/kaynaklar" },
};

export default function SourcesPage() {
    return (
        <>
            <Navbar items={[]} homeHref="/" route={{ href: "/", label: { tr: "Ana sayfa", en: "Home" } }} />
            <main id="main" className="relative">
                <SourcesContent />
            </main>
            <Footer />
        </>
    );
}
