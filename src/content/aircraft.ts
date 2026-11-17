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
    { key: "length", label: { tr: "Uzunluk", en: "Length" }, value: "20,3", unit: { tr: "m", en: "m" }, n: 20.3 },
    { key: "span", label: { tr: "Kanat açıklığı", en: "Wingspan" }, value: "13,4", unit: { tr: "m", en: "m" }, n: 13.4 },
    { key: "height", label: { tr: "Yükseklik", en: "Height" }, value: "5", unit: { tr: "m", en: "m" }, n: 5 },
    { key: "wing", label: { tr: "Kanat alanı", en: "Wing area" }, value: "71,6", unit: { tr: "m²", en: "m²" } },
    { key: "mtow", label: { tr: "Azami kalkış ağırlığı", en: "Max take-off weight" }, value: "34 750", unit: { tr: "kg", en: "kg" }, n: 34750 },
    { key: "speed", label: { tr: "Azami hız", en: "Max speed" }, value: "1,8", unit: { tr: "Mach, 40 000 ft'te", en: "Mach, at 40,000 ft" }, note: { tr: "tasarım hedefi", en: "design target" } },
    { key: "ceiling", label: { tr: "Servis tavanı", en: "Service ceiling" }, value: "55 000", unit: { tr: "ft", en: "ft" }, note: { tr: "tasarım hedefi", en: "design target" } },
    { key: "g", label: { tr: "Yük limitleri", en: "Load limits" }, value: "+9 / −3,5", unit: { tr: "g", en: "g" }, note: { tr: "tasarım hedefi", en: "design target" } },
    { key: "engine", label: { tr: "Motor", en: "Engines" }, value: "2 × F110-GE-129", unit: { tr: "", en: "" }, note: { tr: "ilk bloklar; ileride TEI TF35000", en: "early blocks; TEI TF35000 later" } },
    { key: "thrust", label: { tr: "İtki (motor başına)", en: "Thrust (per engine)" }, value: "13 150", unit: { tr: "kgf (29 000 lb), art yakıcılı", en: "kgf (29,000 lb), with afterburner" } },
    { key: "crew", label: { tr: "Mürettebat", en: "Crew" }, value: "1", unit: { tr: "pilot · Martin-Baker T18T koltuk", en: "pilot · Martin-Baker T18T seat" } },
];

export const specsCopy: L<{ label: string; title: string; lede: string; colItem: string; colValue: string; source: string; sizeTitle: string; sizeNote: string }> = {
    tr: {
        label: "Teknik veriler",
        title: "Rakamlarla KAAN",
        lede: "Boyutlar ve ağırlık yayımlanmış değerlerdir. Hız, tavan ve menzil ise program hedefleri; uçuş testleri bitmeden kesinleşmeyecek.",
        colItem: "Özellik",
        colValue: "Değer",
        source: "Kaynak: TUSAŞ resmi ürün sayfası (tusas.com), Martin-Baker; Kasım 2026 itibarıyla. Hedef değerler işaretlenmiştir.",
        sizeTitle: "Ölçek",
        sizeNote: "Üstten bakış, aynı ölçek. Her çerçeve uçağın uzunluğu ve kanat açıklığıdır.",
    },
    en: {
        label: "Specifications",
        title: "KAAN in numbers",
        lede: "Dimensions and weight are published figures. Speed, ceiling and range are programme targets and will not be final until flight testing is done.",
        colItem: "Item",
        colValue: "Value",
        source: "Source: Turkish Aerospace official product page (tusas.com), Martin-Baker; as of November 2026. Targets are marked.",
        sizeTitle: "Scale",
        sizeNote: "Plan view, same scale. Each frame is the aircraft's length by its wingspan.",
    },
};

/** Reference aircraft for the size comparison (manufacturer-published figures). */
export const peers = [
    { id: "kaan", name: "KAAN", length: 20.3, span: 13.4 },
    { id: "f35", name: "F-35A", length: 15.7, span: 10.7 },
    { id: "f16", name: "F-16C", length: 15.06, span: 9.96 },
    { id: "su57", name: "Su-57", length: 20.1, span: 14.1 },
    { id: "ef2000", name: "Eurofighter", length: 15.96, span: 10.95 },
];
