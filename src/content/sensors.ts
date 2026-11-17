import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

/** Shape of the notional coverage drawn for a sensor. */
export type Coverage = "radar" | "irst" | "eots" | "sphere";

/** Where the sensor sits on the drawing. "distributed" = apertures around the airframe, positions not published. */
export type Mount = "nose" | "aheadCanopy" | "underNose" | "distributed";

export interface Sensor {
    id: string;
    name: string;
    kind: L;
    mount: Mount;
    where: L;
    body: L;
    coverage: Coverage;
}

/**
 * ASELSAN's KAAN sensor family as presented at the Paris Air Show, June 2025.
 * Performance figures (range, element count, fields of regard) have not been published and are not given here.
 */
export const sensors: Sensor[] = [
    {
        id: "murad",
        name: "MURAD 600-A",
        kind: { tr: "AESA radar · Entegre RF Sistemi", en: "AESA radar · Integrated RF System" },
        mount: "nose",
        where: { tr: "Burun, radom altında", en: "Nose, under the radome" },
        body: {
            tr: "Aktif elektronik taramalı atış kontrol radarı. ASELSAN, radarı elektronik harp işlevleriyle birlikte tek bir Entegre RF Sistemi olarak sundu. Verici/alıcı modül sayısı ve menzil açıklanmadı.",
            en: "Active electronically scanned fire-control radar. ASELSAN presented it together with the electronic-warfare functions as one Integrated RF System. Transmit/receive module count and range have not been published.",
        },
        coverage: "radar",
    },
    {
        id: "karat",
        name: "KARAT 100",
        kind: { tr: "IRST · kızılötesi arama ve takip", en: "IRST · infrared search and track" },
        mount: "aheadCanopy",
        where: { tr: "Kanopinin önünde pencere (P1)", en: "Window ahead of the canopy (P1)" },
        body: {
            tr: "Hedefin ısı izini pasif olarak arar ve izler; kendisi yayın yapmadığı için uçağın yerini belli etmez. P1 prototipinde kanopinin önünde bu sensöre ait pencere görülüyor.",
            en: "Searches for and tracks a target's heat signature passively; it emits nothing, so it does not give the aircraft away. On the P1 prototype a window for this sensor is visible ahead of the canopy.",
        },
        coverage: "irst",
    },
    {
        id: "toygun",
        name: "TOYGUN 100",
        kind: { tr: "EOTS · elektro-optik hedefleme", en: "EOTS · electro-optical targeting" },
        mount: "underNose",
        where: { tr: "Burnun altında kaporta (P1)", en: "Fairing under the nose (P1)" },
        body: {
            tr: "Gövdeye gömülü elektro-optik hedefleme sistemi; harici hedefleme podu taşımadan hedef tespiti ve tanıma için. P1'de burnun altındaki kaporta bu sisteme ayrılmış.",
            en: "Electro-optical targeting system built into the airframe, for finding and identifying targets without an external targeting pod. On P1 the fairing under the nose houses it.",
        },
        coverage: "eots",
    },
    {
        id: "lias",
        name: "LIAS 300",
        kind: { tr: "Lazer ikaz sistemi", en: "Laser warning system" },
        mount: "distributed",
        where: { tr: "Gövdeye dağıtılmış algılayıcılar", en: "Sensors spread around the airframe" },
        body: {
            tr: "Uçağın bir lazer mesafe ölçer ya da işaretleyici tarafından aydınlatıldığını algılar ve pilotu uyarır.",
            en: "Detects that the aircraft is being illuminated by a laser rangefinder or designator and warns the pilot.",
        },
        coverage: "sphere",
    },
    {
        id: "iris",
        name: "IRIS 300",
        kind: { tr: "Füze ikaz sistemi", en: "Missile warning system" },
        mount: "distributed",
        where: { tr: "Gövdeye dağıtılmış algılayıcılar", en: "Sensors spread around the airframe" },
        body: {
            tr: "Uçağa yaklaşan füzeyi algılar, pilotu uyarır ve karşı tedbir sistemlerine yön bilgisi verir.",
            en: "Detects a missile approaching the aircraft, warns the pilot and cues the countermeasure systems.",
        },
        coverage: "sphere",
    },
    {
        id: "yildirim",
        name: "YILDIRIM 300",
        kind: { tr: "DIRCM · yönlendirilmiş kızılötesi karşı tedbir", en: "DIRCM · directed infrared countermeasure" },
        mount: "distributed",
        where: { tr: "Yeri açıklanmadı", en: "Position not published" },
        body: {
            tr: "Kızılötesi güdümlü bir füzenin arayıcısına lazer yönelterek onu şaşırtır. Füze ikaz sisteminden gelen yön bilgisiyle çalışır.",
            en: "Points a laser at the seeker of an infrared-guided missile to confuse it. It works from the direction given by the missile warning system.",
        },
        coverage: "sphere",
    },
    {
        id: "icni",
        name: "ICNI",
        kind: { tr: "Entegre haberleşme, seyrüsefer, tanımlama", en: "Integrated communication, navigation, identification" },
        mount: "distributed",
        where: { tr: "Gövdeye dağıtılmış antenler", en: "Antennas spread around the airframe" },
        body: {
            tr: "Telsiz, veri bağı, seyrüsefer ve dost-düşman tanımlama işlevlerini ortak bir donanımda toplar.",
            en: "Brings radio, data link, navigation and identification friend-or-foe functions onto shared hardware.",
        },
        coverage: "sphere",
    },
];

export const sensorsCopy: L<{
    label: string;
    title: string;
    lede: string;
    listLabel: string;
    maker: string;
    position: string;
    plan: string;
    side: string;
    notional: string;
    coverageNote: string;
    distributedNote: string;
    source: string;
}> = {
    tr: {
        label: "Sensörler",
        title: "ASELSAN'ın KAAN için sensör ailesi",
        lede: "ASELSAN, Haziran 2025'teki Paris Hava Fuarı'nda KAAN için geliştirdiği sensörleri bir arada gösterdi: burunda radar, önde iki elektro-optik göz, gövdeye dağılmış ikaz sistemleri. Bir sensör seçin; çizimde yeri ve kabaca baktığı yön belirir.",
        listLabel: "Sensör seçin",
        maker: "Üretici",
        position: "Konum",
        plan: "Üstten",
        side: "Yandan",
        notional: "temsili",
        coverageNote: "Gövde çizimi ve kapsama şekilleri temsilidir; açıklanmış açı ya da menzil değerlerini göstermez. Radar için çizilen ±60° koni sabit AESA antenlerinde yaygın bir tarama sınırıdır, KAAN için yayımlanmış bir değer değildir.",
        distributedNote: "Algılayıcılar gövdeye dağıtılmış; yerleri yayımlanmadı. Çevre, her yönü kapsama amacını gösterir.",
        source: "Kaynak: ASELSAN, Paris Hava Fuarı 2025 açıklamaları ve ürün sayfaları; P0/P1 karşılaştırmaları savunma basınındaki analizlerden, Kasım 2026 itibarıyla.",
    },
    en: {
        label: "Sensors",
        title: "ASELSAN's sensor family for KAAN",
        lede: "At the Paris Air Show in June 2025 ASELSAN showed the sensors it develops for KAAN side by side: a radar in the nose, two electro-optical eyes up front, warning systems spread around the airframe. Pick a sensor; the drawing shows where it sits and roughly where it looks.",
        listLabel: "Choose a sensor",
        maker: "Maker",
        position: "Position",
        plan: "Plan",
        side: "Side",
        notional: "notional",
        coverageNote: "The airframe drawing and the coverage shapes are illustrative; they do not show published angles or ranges. The ±60° cone drawn for the radar is a common scan limit for fixed AESA antennas, not a figure published for KAAN.",
        distributedNote: "The sensors are spread around the airframe; their positions have not been published. The circle stands for the aim of covering every direction.",
        source: "Source: ASELSAN, Paris Air Show 2025 announcements and product pages; P0/P1 comparisons from defence-press analysis, as of November 2026.",
    },
};
