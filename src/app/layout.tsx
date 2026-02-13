import type { Metadata, Viewport } from "next";
import { Rajdhani, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const rajdhani = Rajdhani({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "KAAN — 5th Generation Fighter Aircraft",
  description:
    "Türkiye's next-generation stealth fighter jet. An interactive experience showcasing the KAAN's advanced capabilities, avionics, and stealth technology.",
  authors: [{ name: "Mehmet Gümüş", url: "https://github.com/SpaceEngineerSS" }],
  icons: { icon: "/favicon.ico" },
  keywords: [
    "KAAN",
    "TF-X",
    "MMU",
    "5th generation fighter",
    "stealth aircraft",
    "Turkish aerospace",
    "TAI",
    "TUSAS",
    "fighter jet",
    "military aviation",
  ],
  openGraph: {
    title: "KAAN — 5th Generation Fighter Aircraft",
    description:
      "Interactive experience of Türkiye's next-generation stealth fighter jet. Explore specifications, avionics, and capabilities.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KAAN 5th Generation Stealth Fighter Jet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KAAN — 5th Generation Fighter Aircraft",
    description:
      "Interactive experience of Türkiye's next-generation stealth fighter jet.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${rajdhani.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <a
          href="#overview"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded focus:border focus:border-neon-blue/40 focus:bg-cockpit-dark focus:px-4 focus:py-2 focus:text-neon-blue focus:outline-none"
        >
          Skip to content
        </a>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
