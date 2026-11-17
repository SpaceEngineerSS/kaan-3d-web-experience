import type { NextConfig } from "next";
import path from "node:path";

const buildId = (process.env.VERCEL_GIT_COMMIT_SHA ?? `local-${Date.now().toString(36)}`).slice(0, 12);

const csp = [
    "default-src 'self'",
    // Next.js inline bootstrap + JSON-LD need 'unsafe-inline'; the Meshopt model decoder needs 'wasm-unsafe-eval'.
    "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'" + (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "media-src 'self' blob:",
    "font-src 'self'",
    "connect-src 'self' blob: data:",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
].join("; ");

const securityHeaders = [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
    env: { NEXT_PUBLIC_BUILD_ID: buildId },
    turbopack: { root: path.resolve(__dirname) },
    images: {
        formats: ["image/avif", "image/webp"],
    },
    async headers() {
        return [
            { source: "/:path*", headers: securityHeaders },
            {
                source: "/sw.js",
                headers: [
                    { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
                    { key: "Service-Worker-Allowed", value: "/" },
                ],
            },
            {
                source: "/models/:file*",
                headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
            },
        ];
    },
};

export default nextConfig;
