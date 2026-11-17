import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Rajdhani } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { LanguageProvider, type Locale } from "@/context/LanguageContext";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { MotionRuntime } from "@/components/site/MotionRuntime";
import { NoticeBar } from "@/components/site/NoticeBar";
import { LOCALE_COOKIE, SITE_URL } from "@/lib/site";

const rajdhani = Rajdhani({
    variable: "--font-rajdhani",
    subsets: ["latin", "latin-ext"],
    weight: ["500", "600", "700"],
    display: "swap",
});

/* B612 (Airbus / Polarsys, SIL OFL 1.1), self-hosted. The upstream files lack Ş ş İ ı Ğ ğ;
   those six letters were composed from the font's own S, s, I, i, G, g, cedilla, breve and dot glyphs. */
const b612 = localFont({
    variable: "--font-b612",
    src: [
        { path: "./fonts/B612-Regular.woff2", weight: "400", style: "normal" },
        { path: "./fonts/B612-Bold.woff2", weight: "700", style: "normal" },
    ],
    display: "swap",
});

const b612Mono = localFont({
    variable: "--font-b612-mono",
    src: [
        { path: "./fonts/B612Mono-Regular.woff2", weight: "400", style: "normal" },
        { path: "./fonts/B612Mono-Bold.woff2", weight: "700", style: "normal" },
    ],
    display: "swap",
});

export const viewport: Viewport = {
    themeColor: "#05070a",
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
        <html lang={locale} className={`${rajdhani.variable} ${b612.variable} ${b612Mono.variable}`}>
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
