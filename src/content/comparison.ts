import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

export interface Fighter {
    id: string;
    name: string;
    country: L;
    generation: L;
    /** ISO date of first flight. */
    firstFlight: string;
    length: number;
    span: number;
    /** Maximum take-off weight, kg. */
    mtow: number;
    engines: L;
    status: L;
    /** Fields whose values are estimates rather than manufacturer figures. */
    estimated?: ("length" | "span" | "mtow")[];
}

/**
 * Published figures (manufacturer data where it exists, otherwise widely cited values as listed on Wikipedia).
 * J-20 dimensions and weight are Western estimates; the manufacturer has not published them.
 */
export const fighters: Fighter[] = [
    {
        id: "kaan",
        name: "KAAN",
        country: { tr: "Türkiye", en: "Türkiye" },
        generation: { tr: "5", en: "5" },
        firstFlight: "2024-02-21",
        length: 20.3,
        span: 13.4,
        mtow: 34750,
        engines: { tr: "2 × GE F110-GE-129 (ileride TEI TF35000)", en: "2 × GE F110-GE-129 (TEI TF35000 later)" },
        status: { tr: "Prototip uçuş testleri; seri teslimat 2028 hedefi", en: "Prototype flight testing; deliveries targeted 2028" },
    },
    {
        id: "f35a",
        name: "F-35A",
        country: { tr: "ABD", en: "USA" },
        generation: { tr: "5", en: "5" },
        firstFlight: "2006-12-15",
        length: 15.7,
        span: 10.7,
        mtow: 31800,
        engines: { tr: "1 × P&W F135", en: "1 × P&W F135" },
        status: { tr: "Hizmette (2016'dan beri)", en: "In service (since 2016)" },
    },
    {
        id: "su57",
        name: "Su-57",
        country: { tr: "Rusya", en: "Russia" },
        generation: { tr: "5", en: "5" },
        firstFlight: "2010-01-29",
        length: 20.1,
        span: 14.1,
        mtow: 35000,
        engines: { tr: "2 × AL-41F1", en: "2 × AL-41F1" },
        status: { tr: "Hizmette (2020'den beri), az sayıda", en: "In service (since 2020), small numbers" },
    },
    {
        id: "j20",
        name: "J-20",
        country: { tr: "Çin", en: "China" },
        generation: { tr: "5", en: "5" },
        firstFlight: "2011-01-11",
        length: 20.4,
        span: 13,
        mtow: 37000,
        engines: { tr: "2 × WS-10C (yeni üretimde WS-15)", en: "2 × WS-10C (WS-15 on newer aircraft)" },
        status: { tr: "Hizmette (2017'den beri)", en: "In service (since 2017)" },
        estimated: ["length", "span", "mtow"],
    },
    {
        id: "kf21",
        name: "KF-21",
        country: { tr: "Güney Kore", en: "South Korea" },
        generation: { tr: "4,5", en: "4.5" },
        firstFlight: "2022-07-19",
        length: 16.9,
        span: 11.2,
        mtow: 25600,
        engines: { tr: "2 × GE F414-GE-400K", en: "2 × GE F414-GE-400K" },
        status: { tr: "Seri üretim; teslimatlar 2026'da başlıyor", en: "Series production; deliveries from 2026" },
    },
];

export const comparisonCopy: L<{
    label: string;
    title: string;
    lede: string;
    caption: string;
    cols: { aircraft: string; generation: string; firstFlight: string; length: string; span: string; mtow: string; engines: string; status: string };
    estimate: string;
    chartTitle: string;
    chartNote: string;
    source: string;
}> = {
    tr: {
        label: "Karşılaştırma",
        title: "Aynı sınıfın diğerleri",
        lede: "Gizlilik, menzil ya da radar performansı gibi değerler hiçbir ülke tarafından açıklanmıyor; bunları puanlayan tablolar tahmindir. Burada yalnızca yayımlanmış alanlar var.",
        caption: "KAAN ve benzer sınıftaki savaş uçakları, yayımlanmış verilerle",
        cols: {
            aircraft: "Uçak",
            generation: "Nesil",
            firstFlight: "İlk uçuş",
            length: "Uzunluk",
            span: "Kanat açıklığı",
            mtow: "Azami kalkış ağırlığı",
            engines: "Motor",
            status: "Durum",
        },
        estimate: "tahmini",
        chartTitle: "İlk uçuştan bugüne",
        chartNote: "Her çizgi ilk uçuştan Kasım 2026'ya kadar geçen süredir. KF-21 üreticisi tarafından 4,5. nesil olarak tanımlanıyor.",
        source: "Kaynak: üretici verileri (TUSAŞ, Lockheed Martin, KAI), Wikipedia ve savunma basını, Kasım 2026 itibarıyla. J-20 ölçüleri resmî olarak yayımlanmamış tahminlerdir.",
    },
    en: {
        label: "Comparison",
        title: "Others in the same class",
        lede: "Stealth, range and radar performance are not published by any country; tables that score them are guesswork. Only published fields appear here.",
        caption: "KAAN and fighters in a similar class, from published figures",
        cols: {
            aircraft: "Aircraft",
            generation: "Generation",
            firstFlight: "First flight",
            length: "Length",
            span: "Wingspan",
            mtow: "Max take-off weight",
            engines: "Engines",
            status: "Status",
        },
        estimate: "estimate",
        chartTitle: "Time since first flight",
        chartNote: "Each line runs from first flight to November 2026. KF-21 is described by its maker as a 4.5-generation fighter.",
        source: "Source: manufacturer data (Turkish Aerospace, Lockheed Martin, KAI), Wikipedia and defence press, as of November 2026. J-20 dimensions are unofficial estimates.",
    },
};
