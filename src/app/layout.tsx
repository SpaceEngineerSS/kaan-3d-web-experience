import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { LanguageProvider, type Locale } from "@/context/LanguageContext";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { MotionRuntime } from "@/components/site/MotionRuntime";
import { NoticeBar } from "@/components/site/NoticeBar";
import { LOCALE_COOKIE, SITE_URL } from "@/lib/site";

const chakra = Chakra_Petch({
    variable: "--font-chakra",
    subsets: ["latin", "latin-ext"],
    weight: ["500", "600", "700"],
    display: "swap",
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin", "latin-ext"],
    display: "swap",
});

const jetbrains = JetBrains_Mono({
    variable: "--font-jetbrains",
    subsets: ["latin", "latin-ext"],
    weight: ["400", "500", "700"],
    display: "swap",
});

export const viewport: Viewport = {
    themeColor: "#050608",
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    colorScheme: "dark",
};

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "KAAN — Etkileşimli 3D İnceleme",
        template: "%s · KAAN",
    },
    description:
        "Türkiye'nin beşinci nesil muharip uçağı KAAN'ı açık kaynaklardan derlenmiş verilerle ve 3D model üzerinden anlatan bağımsız bir çalışma. An independent, interactive 3D study of the KAAN fighter.",
    applicationName: "KAAN 3D",
    authors: [{ name: "Mehmet Gümüş", url: "https://github.com/SpaceEngineerSS" }],
    creator: "Mehmet Gümüş",
    keywords: ["KAAN", "TF-X", "MMU", "Milli Muharip Uçak", "TUSAŞ", "beşinci nesil", "fifth-generation fighter", "three.js", "WebGL"],
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        siteName: "KAAN 3D",
        locale: "tr_TR",
        alternateLocale: ["en_US"],
        url: "/",
        images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "KAAN P0 in flight, 2024, under the site title" }],
    },
    twitter: { card: "summary_large_image", images: ["/og-image.png"] },
    robots: { index: true, follow: true },
    manifest: "/manifest.json",
    icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
    appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "KAAN" },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KAAN — Interactive 3D Study",
    url: SITE_URL,
    inLanguage: ["tr", "en"],
    author: { "@type": "Person", name: "Mehmet Gümüş", url: "https://github.com/SpaceEngineerSS" },
    about: { "@type": "Thing", name: "TUSAŞ KAAN", sameAs: "https://en.wikipedia.org/wiki/TAI_TF_Kaan" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const store = await cookies();
    const saved = store.get(LOCALE_COOKIE)?.value;
    const locale: Locale = saved === "en" ? "en" : "tr";

    return (
        <html lang={locale} className={`${chakra.variable} ${inter.variable} ${jetbrains.variable}`}>
            <body className="antialiased">
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-fg focus:px-4 focus:py-2 focus:text-ink"
                >
                    {locale === "tr" ? "İçeriğe geç" : "Skip to content"}
                </a>
                <LanguageProvider initialLocale={locale}>
                    {children}
                    <NoticeBar />
                </LanguageProvider>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                <MotionRuntime />
                <Analytics />
                <ServiceWorkerRegistration />
            </body>
        </html>
    );
}
