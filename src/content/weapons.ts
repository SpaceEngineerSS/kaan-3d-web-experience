import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

export type StationId = "bayL" | "bayR" | "sideL" | "sideR" | "wingL" | "wingR";

/**
 * Notional grouping of the reported 8 internal + 6 external stations (Wikipedia, as reported):
 * main bay 2 × 3, side bays 2 × 1, wings 2 × 3. The real layout has not been published.
 */
export const stationCapacity: Record<StationId, number> = { bayL: 3, bayR: 3, sideL: 1, sideR: 1, wingL: 3, wingR: 3 };
export const INTERNAL_STATIONS: StationId[] = ["bayL", "bayR", "sideL", "sideR"];

export interface Munition {
    id: string;
    name: string;
    developer: string;
    role: L;
    /** How the store is linked to KAAN, as publicly stated or reported. */
    status: L;
}

export interface MissionProfile {
    id: string;
    name: L;
    summary: L;
    /** Notional loading: which store sits on which station group, and how many. */
    load: Partial<Record<StationId, { munition: string; qty: number }>>;
}

const aselsan2025: L = { tr: "ASELSAN, 2025'te KAAN için andı", en: "Named for KAAN by ASELSAN, 2025" };
const planned: L = { tr: "KAAN için planlanan (basında)", en: "Planned for KAAN (reported)" };

export const munitions: Munition[] = [
    {
        id: "gokdogan",
        name: "Gökdoğan",
        developer: "TÜBİTAK SAGE",
        role: { tr: "Görüş ötesi havadan havaya füze", en: "Beyond-visual-range air-to-air missile" },
        status: planned,
    },
    {
        id: "bozdogan",
        name: "Bozdoğan",
        developer: "TÜBİTAK SAGE",
        role: { tr: "Görüş içi (kısa menzilli) havadan havaya füze", en: "Within-visual-range (short-range) air-to-air missile" },
        status: planned,
    },
    {
        id: "somj",
        name: "SOM-J",
        developer: "Roketsan · TÜBİTAK SAGE",
        role: { tr: "Seyir füzesi; iç yuvaya göre boyutlandırıldığı bildiriliyor", en: "Cruise missile; reported to be sized for the internal bay" },
        status: planned,
    },
    {
        id: "tolun",
        name: "TOLUN",
        developer: "ASELSAN",
        role: { tr: "Uzaktan atılan hassas güdümlü mühimmat", en: "Stand-off precision-guided munition" },
        status: aselsan2025,
    },
    {
        id: "lgk",
        name: "LGK",
        developer: "ASELSAN",
        role: { tr: "Lazer güdüm kiti; genel amaçlı bombaları güdümlü hâle getirir", en: "Laser guidance kit that turns general-purpose bombs into guided ones" },
        status: aselsan2025,
    },
    {
        id: "gozde",
        name: "Gözde",
        developer: "ASELSAN",
        role: { tr: "Hassas güdüm kiti", en: "Precision guidance kit" },
        status: aselsan2025,
    },
];

export const missions: MissionProfile[] = [
    {
        id: "air",
        name: { tr: "Hava üstünlüğü", en: "Air superiority" },
        summary: {
            tr: "Yalnız gövde içi taşıma. Görüş ötesi füzeler ana yuvada, kısa menzilli füzeler yan yuvalarda; gizli şekil bozulmaz.",
            en: "Internal carriage only. Beyond-visual-range missiles in the main bay, short-range missiles in the side bays; the low-observable shape is kept.",
        },
        load: {
            bayL: { munition: "gokdogan", qty: 2 },
            bayR: { munition: "gokdogan", qty: 2 },
            sideL: { munition: "bozdogan", qty: 1 },
            sideR: { munition: "bozdogan", qty: 1 },
        },
    },
    {
        id: "strike",
        name: { tr: "Derin taarruz", en: "Deep strike" },
        summary: {
            tr: "SOM-J'nin iç yuvaya sığacak şekilde boyutlandırıldığı bildiriliyor. Öz savunma için yan yuvalarda kısa menzilli füze.",
            en: "SOM-J is reported to be sized to fit the internal bay. Short-range missiles in the side bays for self-defence.",
        },
        load: {
            bayL: { munition: "somj", qty: 1 },
            bayR: { munition: "somj", qty: 1 },
            sideL: { munition: "bozdogan", qty: 1 },
            sideR: { munition: "bozdogan", qty: 1 },
        },
    },
    {
        id: "precision",
        name: { tr: "Hassas taarruz", en: "Precision strike" },
        summary: {
            tr: "ASELSAN'ın KAAN için andığı TOLUN ana yuvada. İç yuvaya kaç adet sığdığı açıklanmadı; adetler örnektir.",
            en: "TOLUN, which ASELSAN named for KAAN, in the main bay. How many fit inside has not been stated; quantities are examples.",
        },
        load: {
            bayL: { munition: "tolun", qty: 2 },
            bayR: { munition: "tolun", qty: 2 },
            sideL: { munition: "bozdogan", qty: 1 },
            sideR: { munition: "bozdogan", qty: 1 },
        },
    },
    {
        id: "heavy",
        name: { tr: "Ağır yük (gizlilik dışı)", en: "Heavy load (non-stealth)" },
        summary: {
            tr: "Tehdit düşükse kanat altı istasyonlar da kullanılır. Daha çok mühimmat taşınır, ama dış askılar radar yansımasını büyütür.",
            en: "When the threat is low, the wing stations are used as well. More stores are carried, but external pylons enlarge the radar return.",
        },
        load: {
            bayL: { munition: "gokdogan", qty: 2 },
            bayR: { munition: "gokdogan", qty: 2 },
            sideL: { munition: "bozdogan", qty: 1 },
            sideR: { munition: "bozdogan", qty: 1 },
            wingL: { munition: "lgk", qty: 2 },
            wingR: { munition: "gozde", qty: 2 },
        },
    },
];

export const weaponsCopy: L<{
    label: string;
    title: string;
    lede: string;
    figures: { value: string; unit: string; label: string }[];
    reported: string;
    profile: string;
    diagramTitle: string;
    diagramNote: string;
    internal: string;
    external: string;
    stations: Record<StationId, string>;
    empty: string;
    storesTitle: string;
    source: string;
}> = {
    tr: {
        label: "Silahlar",
        title: "İçeride taşınan yük",
        lede: "Gizliliğin bedeli taşıma kapasitesidir. Gövde içi yuvalar az ama görünmez yük alır; kanat altı istasyonlar çok ama görünür. Aşağıdaki mühimmatlar KAAN ile birlikte anılan yerli sistemlerdir; hiçbirinin entegrasyonu henüz tamamlanmadı.",
        figures: [
            { value: "8", unit: "", label: "Gövde içi istasyon" },
            { value: "6", unit: "", label: "Harici istasyon" },
            { value: "30", unit: "mm", label: "İç top" },
        ],
        reported: "basında",
        profile: "Görev profili",
        diagramTitle: "İstasyon şeması",
        diagramNote: "Temsili yerleşim, önden görünüş. 8 iç + 6 dış istasyon basında yer alan sayıdır (Wikipedia); yuvaların gerçek düzeni ve ölçüleri yayımlanmadı, adetler örnektir.",
        internal: "Gövde içi",
        external: "Harici",
        stations: {
            bayL: "Ana yuva, sol",
            bayR: "Ana yuva, sağ",
            sideL: "Yan yuva, sol",
            sideR: "Yan yuva, sağ",
            wingL: "Kanat altı, sol",
            wingR: "Kanat altı, sağ",
        },
        empty: "Boş",
        storesTitle: "KAAN ile anılan mühimmatlar",
        source: "Kaynak: ASELSAN 2025 açıklamaları (TOLUN, LGK, Gözde); TÜBİTAK SAGE ve Roketsan ürün sayfaları; istasyon sayısı ve top için Wikipedia ve savunma basını, Kasım 2026 itibarıyla. Durumlar basında yer aldığı hâliyle verilmiştir.",
    },
    en: {
        label: "Weapons",
        title: "Carried on the inside",
        lede: "Stealth costs payload. Internal bays take a small load that stays hidden; wing stations take more, in plain sight. The stores below are Turkish systems publicly linked to KAAN; none has completed integration yet.",
        figures: [
            { value: "8", unit: "", label: "Internal stations" },
            { value: "6", unit: "", label: "External stations" },
            { value: "30", unit: "mm", label: "Internal gun" },
        ],
        reported: "reported",
        profile: "Mission profile",
        diagramTitle: "Station diagram",
        diagramNote: "Notional layout, front view. 8 internal + 6 external stations is the reported count (Wikipedia); the real bay layout and dimensions have not been published, and quantities are examples.",
        internal: "Internal",
        external: "External",
        stations: {
            bayL: "Main bay, left",
            bayR: "Main bay, right",
            sideL: "Side bay, left",
            sideR: "Side bay, right",
            wingL: "Wing, left",
            wingR: "Wing, right",
        },
        empty: "Empty",
        storesTitle: "Stores linked to KAAN",
        source: "Source: ASELSAN 2025 announcements (TOLUN, LGK, Gözde); TÜBİTAK SAGE and Roketsan product pages; Wikipedia and defence press for the station count and gun, as of November 2026. Status is given as reported.",
    },
};
