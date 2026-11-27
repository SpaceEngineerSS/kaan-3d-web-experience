import type { Locale } from "@/context/LanguageContext";
import { fighters, type Fighter } from "@/content/comparison";

const IDS = ["kaan", "f35a", "su57"] as const;
export const PEERS: Fighter[] = IDS.map((id) => fighters.find((f) => f.id === id)).filter((f): f is Fighter => !!f);

/** Reference date for "time since first flight" (data as of mid-November 2026). */
const AS_OF = Date.UTC(2026, 10, 15);
export const yearsSince = (iso: string) => (AS_OF - Date.parse(iso)) / (365.25 * 864e5);

export function fmt(n: number, locale: Locale, digits = 1) {
    return n.toLocaleString(locale === "tr" ? "tr-TR" : "en-GB", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
}

/** A numbered monograph plate heading: big plate number, label, title, one rule above. */
export function Plate({ n, label, title }: { n: string; label: string; title: string }) {
    return (
        <header className="grid gap-x-6 gap-y-2 border-t border-edge-2 pt-5 md:grid-cols-12 md:items-end">
            <p aria-hidden className="t-num text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.8] text-fg md:col-span-2">
                {n}
            </p>
            <div className="md:col-span-10">
                <p className="t-tele">{label}</p>
                <h3 className="t-h2 mt-2 text-[clamp(1.75rem,1.2rem+2vw,3.25rem)] text-fg">{title}</h3>
            </div>
        </header>
    );
}

export const fileName = (src: string) => src.split("/").pop() ?? src;
