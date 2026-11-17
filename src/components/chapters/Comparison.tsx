"use client";

import { useLanguage, type Locale } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { comparisonCopy, fighters, type Fighter } from "@/content/comparison";

const MONTHS: Record<Locale, string[]> = {
    tr: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

/** Deterministic formatting (no Intl) so server and client render the same string. */
function fmtDate(iso: string, locale: Locale) {
    const [y, m, d] = iso.split("-").map(Number);
    return `${d} ${MONTHS[locale][m - 1]} ${y}`;
}

function fmtNum(n: number, locale: Locale) {
    const [int, dec] = String(n).split(".");
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, locale === "tr" ? " " : ",");
    return dec ? `${grouped}${locale === "tr" ? "," : "."}${dec}` : grouped;
}

export function Comparison() {
    const { locale } = useLanguage();
    const c = comparisonCopy[locale];

    const est = (f: Fighter, field: "length" | "span" | "mtow") =>
        f.estimated?.includes(field) ? <span className="t-label ml-1.5 text-faint">{c.estimate}</span> : null;

    return (
        <Chapter id="comparison" index={8} label={c.label} title={c.title} lede={c.lede} solid>
            <div className="overflow-x-auto" data-reveal>
                <table className="w-full min-w-[56rem] border-collapse text-left text-[0.9375rem]">
                    <caption className="sr-only">{c.caption}</caption>
                    <thead>
                        <tr className="t-label border-b border-line-strong">
                            <th scope="col" className="py-3 pr-4 font-normal">{c.cols.aircraft}</th>
                            <th scope="col" className="py-3 pr-4 text-right font-normal">{c.cols.generation}</th>
                            <th scope="col" className="py-3 pr-4 font-normal">{c.cols.firstFlight}</th>
                            <th scope="col" className="py-3 pr-4 text-right font-normal">{c.cols.length}</th>
                            <th scope="col" className="py-3 pr-4 text-right font-normal">{c.cols.span}</th>
                            <th scope="col" className="py-3 pr-4 text-right font-normal">{c.cols.mtow}</th>
                            <th scope="col" className="py-3 pr-4 font-normal">{c.cols.engines}</th>
                            <th scope="col" className="py-3 font-normal">{c.cols.status}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fighters.map((f) => {
                            const kaan = f.id === "kaan";
                            return (
                                <tr key={f.id} className={`border-b align-baseline ${kaan ? "border-signal bg-signal-soft" : "border-line"}`}>
                                    <th scope="row" className={`py-4 pl-2 pr-4 font-normal ${kaan ? "border-l-2 border-signal" : "border-l-2 border-transparent"}`}>
                                        <span className={`t-h3 block ${kaan ? "text-signal" : "text-fg"}`}>{f.name}</span>
                                        <span className="t-label">{f.country[locale]}</span>
                                    </th>
                                    <td className="t-data py-4 pr-4 text-right text-fg">{f.generation[locale]}</td>
                                    <td className="t-data whitespace-nowrap py-4 pr-4 text-fg-2">{fmtDate(f.firstFlight, locale)}</td>
                                    <td className="t-data whitespace-nowrap py-4 pr-4 text-right text-fg">
                                        {fmtNum(f.length, locale)} m{est(f, "length")}
                                    </td>
                                    <td className="t-data whitespace-nowrap py-4 pr-4 text-right text-fg">
                                        {fmtNum(f.span, locale)} m{est(f, "span")}
                                    </td>
                                    <td className="t-data whitespace-nowrap py-4 pr-4 text-right text-fg">
                                        {fmtNum(f.mtow, locale)} kg{est(f, "mtow")}
                                    </td>
                                    <td className="py-4 pr-4 text-fg-2">{f.engines[locale]}</td>
                                    <td className="py-4 text-[0.8125rem] text-muted">{f.status[locale]}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <SourceNote>{c.source}</SourceNote>

            <figure className="mt-16 grid gap-6 md:grid-cols-12" data-reveal>
                <figcaption className="md:col-span-3 lg:col-span-2">
                    <span className="t-label block">{c.chartTitle}</span>
                    <span className="mt-3 block text-[0.8125rem] leading-relaxed text-muted">{c.chartNote}</span>
                </figcaption>
                <div className="md:col-span-9 lg:col-span-10">
                    <FirstFlightChart locale={locale} label={c.chartTitle} />
                </div>
            </figure>
        </Chapter>
    );
}

/** Lines from each first flight to November 2026 on a shared year axis. */
function FirstFlightChart({ locale, label }: { locale: Locale; label: string }) {
    const W = 760;
    const rowH = 34;
    const top = 16;
    const left = 70;
    const right = 24;
    const H = top + fighters.length * rowH + 34;
    const y0 = 2005;
    const y1 = 2027;
    const now = 2026 + 10.5 / 12;
    const X = (yr: number) => left + ((yr - y0) / (y1 - y0)) * (W - left - right);
    const toYear = (iso: string) => {
        const [y, m] = iso.split("-").map(Number);
        return y + (m - 1) / 12;
    };
    const ticks = [2005, 2010, 2015, 2020, 2025];
    const sorted = [...fighters].sort((a, b) => a.firstFlight.localeCompare(b.firstFlight));

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${label}: ${sorted.map((f) => `${f.name} ${f.firstFlight.slice(0, 4)}`).join(", ")}`}>
            <g fontFamily="var(--font-mono)" fontSize="11">
                {ticks.map((t) => (
                    <g key={t}>
                        <line x1={X(t)} y1={top - 6} x2={X(t)} y2={H - 26} stroke="var(--color-line)" strokeWidth="0.75" />
                        <text x={X(t)} y={H - 10} textAnchor="middle" fill="var(--color-muted)">
                            {t}
                        </text>
                    </g>
                ))}
                <line x1={X(now)} y1={top - 6} x2={X(now)} y2={H - 26} stroke="var(--color-line-strong)" strokeDasharray="3 3" />
                {sorted.map((f, i) => {
                    const kaan = f.id === "kaan";
                    const y = top + i * rowH + rowH / 2;
                    const x = X(toYear(f.firstFlight));
                    const col = kaan ? "var(--color-signal)" : "var(--color-fg-2)";
                    return (
                        <g key={f.id}>
                            <text x={left - 12} y={y + 4} textAnchor="end" fill={kaan ? "var(--color-signal)" : "var(--color-fg-2)"}>
                                {f.name}
                            </text>
                            <line x1={x} y1={y} x2={X(now)} y2={y} stroke={col} strokeWidth={kaan ? 2 : 1.25} />
                            <circle cx={x} cy={y} r={4} fill={kaan ? "var(--color-signal)" : "var(--color-ground)"} stroke={col} strokeWidth="1.25" />
                            <text x={x - 8} y={y + 4} textAnchor="end" fill="var(--color-muted)">
                                {fmtDate(f.firstFlight, locale).replace(/^\d+ /, "")}
                            </text>
                        </g>
                    );
                })}
            </g>
        </svg>
    );
}
