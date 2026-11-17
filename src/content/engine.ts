import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

export interface EngineMilestone {
    id: string;
    date: L;
    engine: "f110" | "tf35";
    text: L;
    /** Plan or target, not an event that has happened. */
    target?: boolean;
}

export const engineMilestones: EngineMilestone[] = [
    {
        id: "first-flight",
        date: { tr: "21 Şub 2024", en: "21 Feb 2024" },
        engine: "f110",
        text: { tr: "P0 ilk uçuşunu iki F110-GE-129 ile yapar.", en: "P0 makes its first flight on two F110-GE-129s." },
    },
    {
        id: "ab-run",
        date: { tr: "6 Ara 2024", en: "6 Dec 2024" },
        engine: "f110",
        text: { tr: "İki motor birlikte art yakıcıyla yerde çalıştırılır.", en: "Both engines are run together on the ground with afterburner." },
    },
    {
        id: "cdr",
        date: { tr: "Şub 2026", en: "Feb 2026" },
        engine: "tf35",
        text: { tr: "TF35000 kritik tasarım gözden geçirmesi (CDR).", en: "TF35000 critical design review (CDR)." },
    },
    {
        id: "export",
        date: { tr: "Tem 2026", en: "Jul 2026" },
        engine: "f110",
        text: {
            tr: "ABD, F110 ihracatını onaylar: prototipler için 10, seri üretim için 80 motor.",
            en: "The US clears the F110 export: 10 engines for prototypes, 80 for series production.",
        },
    },
    {
        id: "tf-proto",
        date: { tr: "2027", en: "2027" },
        engine: "tf35",
        text: { tr: "TF35000 prototip üretiminin başlaması.", en: "TF35000 prototype production to begin." },
        target: true,
    },
    {
        id: "switch",
        date: { tr: "~2032", en: "~2032" },
        engine: "tf35",
        text: { tr: "KAAN'ın TF35000'e geçmesi.", en: "KAAN to switch to the TF35000." },
        target: true,
    },
];

export const engineCopy: L<{
    label: string;
    title: string;
    lede: string;
    nowTitle: string;
    nowValue: string;
    nowUnit: string;
    nowBody: string;
    nextTitle: string;
    nextValue: string;
    nextUnit: string;
    nextBody: string;
    targetNote: string;
    timelineTitle: string;
    filmCaption: string;
    drawingTitle: string;
    drawingNote: string;
    stations: { intake: string; fan: string; compressor: string; combustor: string; turbine: string; afterburner: string; nozzle: string; bypass: string };
    source: string;
}> = {
    tr: {
        label: "Motor",
        title: "Bugünün motoru, yarının motoru",
        lede: "KAAN iki motorla uçar. Prototiplerde ve ilk seri uçaklarda bu motorlar ABD yapımı GE F110-GE-129. Uzun vadeli plan, TEI'nin geliştirdiği yerli TF35000'e geçmek.",
        nowTitle: "Bugün · GE F110-GE-129",
        nowValue: "13 150",
        nowUnit: "kgf (29 000 lb), art yakıcılı, motor başına",
        nowBody: "F-16'larda uzun süredir kullanılan olgun bir motor. Tedarik ABD ihracat iznine bağlıydı; izin Temmuz 2026'da prototipler için 10, seri üretim için 80 motoru kapsayacak şekilde çıktı.",
        nextTitle: "Yarın · TEI TF35000",
        nextValue: "35 000",
        nextUnit: "lbf sınıfı, art yakıcılı, hedef",
        nextBody: "Adını hedeflenen itki sınıfından alıyor. Kritik tasarım gözden geçirmesi Şubat 2026'da tamamlandı; prototip üretimi 2027'de, KAAN'a geçiş 2032 civarında hedefleniyor.",
        targetNote: "hedef",
        timelineTitle: "Motor takvimi",
        filmCaption: "KAAN P0 kalkışta, 2024.",
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
        source: "Kaynak: TUSAŞ resmî ürün sayfası (itki), TUSAŞ ve TEI açıklamaları, savunma basını, Kasım 2026 itibarıyla. TF35000 değerleri ve tarihleri program hedefidir.",
    },
    en: {
        label: "Engine",
        title: "Today's engine, tomorrow's engine",
        lede: "KAAN is a twin-engine aircraft. On the prototypes and the first production aircraft those engines are the American GE F110-GE-129. The long-term plan is to switch to the TF35000, developed in Türkiye by TEI.",
        nowTitle: "Now · GE F110-GE-129",
        nowValue: "13,150",
        nowUnit: "kgf (29,000 lb), with afterburner, per engine",
        nowBody: "A mature engine, long in service on the F-16. Supply depended on US export approval, which came in July 2026, covering 10 engines for prototypes and 80 for series production.",
        nextTitle: "Next · TEI TF35000",
        nextValue: "35,000",
        nextUnit: "lbf class, with afterburner, target",
        nextBody: "Named after its target thrust class. The critical design review was completed in February 2026; prototype production is targeted for 2027 and the switch on KAAN for around 2032.",
        targetNote: "target",
        timelineTitle: "Engine timeline",
        filmCaption: "KAAN P0 on take-off, 2024.",
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
        source: "Source: Turkish Aerospace official product page (thrust), Turkish Aerospace and TEI statements, defence press, as of November 2026. TF35000 figures and dates are programme targets.",
    },
};
