import type { Metadata } from "next";
import { StatusBar } from "@/components/shell/StatusBar";
import { Footer } from "@/components/shell/Footer";
import { SourcesContent } from "@/components/sources/SourcesContent";

export const metadata: Metadata = {
    title: "Kaynaklar / Sources",
    description: "Image, video and 3D model credits and the data sources used on the KAAN study site.",
    alternates: { canonical: "/kaynaklar" },
};

export default function SourcesPage() {
    return (
        <>
            <StatusBar />
            <main id="main" className="relative">
                <SourcesContent />
            </main>
            <Footer />
        </>
    );
}
