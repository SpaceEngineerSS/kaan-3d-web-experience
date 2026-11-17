import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

/** Date the public figures on this site were last checked. */
export const DATA_AS_OF: L = { tr: "Kasım 2026", en: "November 2026" };

export const story: L<{
    hero: { kicker: string; statement: string; meta: string[]; scroll: string };
    beats: { id: string; label: string; title: string; body: string }[];
}> = {
    tr: {
        hero: {
            kicker: "TF-X · Milli Muharip Uçak",
            statement: "Türkiye'nin beşinci nesil muharip uçağı. Bu site programı, açık kaynaklardan derlenmiş verilerle ve uçağın üç boyutlu modeli üzerinden anlatan bağımsız bir çalışmadır.",
            meta: ["Geliştirici: TUSAŞ", "İlk uçuş: 21 Şubat 2024", "Ağırlıklı rol: hava üstünlüğü"],
            scroll: "Aşağı kaydırın",
        },
        beats: [
            {
                id: "overview",
                label: "Gövde",
                title: "Görünmemek için çizilmiş bir gövde",
                body: "Düz paneller, aynı açılara hizalanmış kenarlar, gövde içine alınmış silah yuvaları ve S şeklinde kıvrılan hava alığı kanalları. Bunların hepsi radara dönen yansımayı azaltmak için var. Gerçek radar kesit alanı açıklanmış değil; tasarım tercihleri ise fotoğraflardan açıkça okunuyor.",
            },
            {
                id: "systems",
                label: "Sensörler",
                title: "Tek ekranda birleşen sensörler",
                body: "Burunda ASELSAN'ın MURAD AESA radarı, gövdeye dağılmış kızılötesi sensörler ve elektronik harp süiti var. Hedef, pilota her sensörü ayrı ayrı okutmak değil, hepsinden tek ve tutarlı bir taktik resim çıkarmak.",
            },
        ],
    },
    en: {
        hero: {
            kicker: "TF-X · National Combat Aircraft",
            statement: "Türkiye's fifth-generation fighter. This site is an independent study of the programme, built from public sources around a 3D model of the aircraft.",
            meta: ["Developer: Turkish Aerospace (TUSAŞ)", "First flight: 21 February 2024", "Primary role: air superiority"],
            scroll: "Scroll down",
        },
        beats: [
            {
                id: "overview",
                label: "Airframe",
                title: "An airframe drawn not to be seen",
                body: "Flat panels, edges aligned to a few shared angles, weapons carried inside the fuselage, and S-shaped intake ducts that hide the engine faces. All of it exists to cut the radar return. The actual radar cross-section has not been published; the design choices can be read straight off the photographs.",
            },
            {
                id: "systems",
                label: "Sensors",
                title: "Sensors fused into one picture",
                body: "An ASELSAN MURAD AESA radar in the nose, infrared sensors spread around the airframe and an electronic-warfare suite. The aim is not to make the pilot read each sensor, but to merge them into a single, consistent tactical picture.",
            },
        ],
    },
};

export interface SpecRow {
    key: string;
    label: L;
    value: string;
    unit: L;
    note?: L;
    /** Value for bar comparisons (in the row's unit). */
    n?: number;
}

/**
 * Declared and widely reported figures. Most performance values are design targets,
 * not test results; the table says so.
 */
export const specs: SpecRow[] = [
    { key: "length", label: { tr: "Uzunluk", en: "Length" }, value: "21", unit: { tr: "m", en: "m" }, n: 21 },
    { key: "span", label: { tr: "Kanat açıklığı", en: "Wingspan" }, value: "14", unit: { tr: "m", en: "m" }, n: 14 },
    { key: "height", label: { tr: "Yükseklik", en: "Height" }, value: "6", unit: { tr: "m", en: "m" }, n: 6 },
    { key: "mtow", label: { tr: "Azami kalkış ağırlığı", en: "Max take-off weight" }, value: "27 215", unit: { tr: "kg", en: "kg" }, n: 27215 },
    { key: "speed", label: { tr: "Azami hız", en: "Max speed" }, value: "1,8", unit: { tr: "Mach", en: "Mach" }, note: { tr: "tasarım hedefi", en: "design target" } },
    { key: "ceiling", label: { tr: "Servis tavanı", en: "Service ceiling" }, value: "55 000", unit: { tr: "ft", en: "ft" }, note: { tr: "tasarım hedefi", en: "design target" } },
    { key: "radius", label: { tr: "Muharebe yarıçapı", en: "Combat radius" }, value: "1 100", unit: { tr: "km", en: "km" }, note: { tr: "bildirilen", en: "reported" } },
    { key: "g", label: { tr: "Yük faktörü", en: "Load factor" }, value: "+9", unit: { tr: "g", en: "g" }, note: { tr: "tasarım hedefi", en: "design target" } },
    { key: "engine", label: { tr: "Motor", en: "Engines" }, value: "2 × F110-GE-129", unit: { tr: "", en: "" }, note: { tr: "ilk bloklar; ileride TEI TF35000", en: "early blocks; TEI TF35000 later" } },
    { key: "thrust", label: { tr: "İtki (motor başına)", en: "Thrust (per engine)" }, value: "≈129", unit: { tr: "kN, art yakıcılı", en: "kN, with afterburner" } },
    { key: "crew", label: { tr: "Mürettebat", en: "Crew" }, value: "1", unit: { tr: "pilot", en: "pilot" } },
];

export const specsCopy: L<{ label: string; title: string; lede: string; colItem: string; colValue: string; source: string; sizeTitle: string; sizeNote: string }> = {
    tr: {
        label: "Teknik veriler",
        title: "Rakamlarla KAAN",
        lede: "Boyutlar ve ağırlık yayımlanmış değerlerdir. Hız, tavan ve menzil ise program hedefleri; uçuş testleri bitmeden kesinleşmeyecek.",
        colItem: "Özellik",
        colValue: "Değer",
        source: "Kaynak: TUSAŞ açıklamaları ve basında yer alan program verileri, Kasım 2026 itibarıyla. Tahmini değerler işaretlenmiştir.",
        sizeTitle: "Ölçek",
        sizeNote: "Üstten bakış, aynı ölçek. Her çerçeve uçağın uzunluğu ve kanat açıklığıdır.",
    },
    en: {
        label: "Specifications",
        title: "KAAN in numbers",
        lede: "Dimensions and weight are published figures. Speed, ceiling and range are programme targets and will not be final until flight testing is done.",
        colItem: "Item",
        colValue: "Value",
        source: "Source: Turkish Aerospace statements and programme figures reported in the press, as of November 2026. Estimates are marked.",
        sizeTitle: "Scale",
        sizeNote: "Plan view, same scale. Each frame is the aircraft's length by its wingspan.",
    },
};

/** Reference aircraft for the size comparison (manufacturer-published figures). */
export const peers = [
    { id: "kaan", name: "KAAN", length: 21, span: 14 },
    { id: "f35", name: "F-35A", length: 15.7, span: 10.7 },
    { id: "f16", name: "F-16C", length: 15.06, span: 9.96 },
    { id: "su57", name: "Su-57", length: 20.1, span: 14.1 },
    { id: "ef2000", name: "Eurofighter", length: 15.96, span: 10.95 },
];
