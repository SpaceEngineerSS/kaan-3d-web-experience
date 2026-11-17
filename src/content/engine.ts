import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

export interface EngineRow {
    key: string;
    label: L;
    f110: L;
    tf35: L;
    /** Marks a row whose TF35000 value is a target, not a measured figure. */
    target?: boolean;
}

export const engineRows: EngineRow[] = [
    {
        key: "maker",
        label: { tr: "Üretici", en: "Maker" },
        f110: { tr: "GE Aerospace (ABD)", en: "GE Aerospace (USA)" },
        tf35: { tr: "TEI (Türkiye)", en: "TEI (Türkiye)" },
    },
    {
        key: "type",
        label: { tr: "Tip", en: "Type" },
        f110: { tr: "Art yakıcılı turbofan", en: "Afterburning turbofan" },
        tf35: { tr: "Art yakıcılı turbofan", en: "Afterburning turbofan" },
    },
    {
        key: "wet",
        label: { tr: "Azami itki (art yakıcılı)", en: "Max thrust (afterburner)" },
        f110: { tr: "≈29 000 lbf (≈129 kN)", en: "≈29,000 lbf (≈129 kN)" },
        tf35: { tr: "≈35 000 lbf sınıfı (≈155 kN), hedef", en: "≈35,000 lbf class (≈155 kN), target" },
        target: true,
    },
    {
        key: "dry",
        label: { tr: "Askerî itki (art yakıcısız)", en: "Military thrust (dry)" },
        f110: { tr: "≈17 000 lbf (≈76 kN)", en: "≈17,000 lbf (≈76 kN)" },
        tf35: { tr: "Yayımlanmadı", en: "Not published" },
    },
    {
        key: "status",
        label: { tr: "Durum", en: "Status" },
        f110: { tr: "Üretimde; F-15 ve F-16'da kullanılıyor", en: "In production; flies in the F-15 and F-16" },
        tf35: { tr: "Geliştirmede", en: "In development" },
    },
    {
        key: "kaan",
        label: { tr: "KAAN'da", en: "On KAAN" },
        f110: { tr: "P0 ve prototipler; Blok 10 (2028 hedefi)", en: "P0 and prototypes; Block 10 (2028 target)" },
        tf35: { tr: "2030'ların başı hedefi", en: "Early 2030s target" },
        target: true,
    },
];

export const engineCopy: L<{
    label: string;
    title: string;
    lede: string;
    nowTitle: string;
    nowBody: string;
    nextTitle: string;
    nextBody: string;
    colItem: string;
    targetNote: string;
    drawingTitle: string;
    drawingNote: string;
    stations: { intake: string; fan: string; compressor: string; combustor: string; turbine: string; afterburner: string; nozzle: string; bypass: string };
    source: string;
}> = {
    tr: {
        label: "Motor",
        title: "Bugünün motoru, yarının motoru",
        lede: "KAAN iki motorla uçar. İlk uçuşta ve ilk üretim bloklarında bu motorlar ABD yapımı GE F110-GE-129. Uzun vadeli plan, TEI'nin geliştirdiği yerli TF35000'e geçmek.",
        nowTitle: "Bugün: GE F110-GE-129",
        nowBody: "P0, 21 Şubat 2024'teki ilk uçuşunu iki F110-GE-129 ile yaptı. Motor yıllardır F-16'larda kullanılan, olgun bir tasarım; tedarik ABD ihracat iznine bağlı. Blok 10 seri üretim uçaklarının da bu motorla teslim edilmesi planlanıyor.",
        nextTitle: "Yarın: TEI TF35000",
        nextBody: "TF35000, adını hedeflenen itki sınıfından alıyor: art yakıcıyla yaklaşık 35 000 lbf. Bu değerler testler tamamlanana kadar hedef olarak kalacak; motorun seri uçaklara 2030'ların başında girmesi hedefleniyor.",
        colItem: "Özellik",
        targetNote: "hedef",
        drawingTitle: "Art yakıcılı turbofan, istasyonlar",
        drawingNote: "Şematik yan kesit, ölçeksiz. Belirli bir motorun çizimi değildir.",
        stations: {
            intake: "Giriş",
            fan: "Fan",
            compressor: "Kompresör",
            combustor: "Yanma odası",
            turbine: "Türbin",
            afterburner: "Art yakıcı",
            nozzle: "Lüle",
            bypass: "Baypas akışı",
        },
        source: "Kaynak: GE Aerospace ürün verileri, TEI ve TUSAŞ açıklamaları, Wikipedia ve savunma basını, Kasım 2026 itibarıyla. TF35000 değerleri program hedefidir.",
    },
    en: {
        label: "Engine",
        title: "Today's engine, tomorrow's engine",
        lede: "KAAN is a twin-engine aircraft. For the first flight and the early production blocks those engines are the American GE F110-GE-129. The long-term plan is to switch to the TF35000, developed in Türkiye by TEI.",
        nowTitle: "Now: GE F110-GE-129",
        nowBody: "P0 made its first flight on 21 February 2024 on two F110-GE-129s. It is a mature engine, long in service on the F-16; supply depends on US export approval. Block 10 production aircraft are also planned to be delivered with it.",
        nextTitle: "Next: TEI TF35000",
        nextBody: "The TF35000 is named after its target thrust class: about 35,000 lbf with afterburner. The figures remain targets until testing is complete; the engine is meant to enter production aircraft in the early 2030s.",
        colItem: "Item",
        targetNote: "target",
        drawingTitle: "Afterburning turbofan, stations",
        drawingNote: "Schematic side section, not to scale. Not a drawing of any specific engine.",
        stations: {
            intake: "Intake",
            fan: "Fan",
            compressor: "Compressor",
            combustor: "Combustor",
            turbine: "Turbine",
            afterburner: "Afterburner",
            nozzle: "Nozzle",
            bypass: "Bypass flow",
        },
        source: "Source: GE Aerospace product data, TEI and Turkish Aerospace statements, Wikipedia and defence press, as of November 2026. TF35000 figures are programme targets.",
    },
};
