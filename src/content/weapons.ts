import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

export type StationId = "bayL" | "bayR" | "sideL" | "sideR" | "wingL" | "wingR";

export interface Munition {
    id: string;
    name: string;
    developer: string;
    role: L;
    guidance: L;
    /** Integration status for KAAN. */
    status: L;
}

export interface MissionProfile {
    id: string;
    name: L;
    summary: L;
    /** Notional loading: which store sits on which station, and how many. */
    load: Partial<Record<StationId, { munition: string; qty: number }>>;
}

const planned: L = { tr: "KAAN için planlanan (basında)", en: "Planned for KAAN (reported)" };

/**
 * Only stores publicly associated with KAAN integration plans. Statuses are as reported,
 * not confirmed integration test results.
 */
export const munitions: Munition[] = [
    {
        id: "gokdogan",
        name: "Gökdoğan",
        developer: "TÜBİTAK SAGE",
        role: { tr: "Görüş ötesi havadan havaya füze", en: "Beyond-visual-range air-to-air missile" },
        guidance: { tr: "Aktif radar arayıcı", en: "Active radar seeker" },
        status: planned,
    },
    {
        id: "bozdogan",
        name: "Bozdoğan",
        developer: "TÜBİTAK SAGE",
        role: { tr: "Kısa menzilli havadan havaya füze", en: "Short-range air-to-air missile" },
        guidance: { tr: "Kızılötesi görüntüleyici arayıcı", en: "Imaging infrared seeker" },
        status: planned,
    },
    {
        id: "gokhan",
        name: "Gökhan",
        developer: "TÜBİTAK SAGE",
        role: { tr: "Ramjet motorlu uzun menzilli havadan havaya füze", en: "Ramjet-powered long-range air-to-air missile" },
        guidance: { tr: "Aktif radar arayıcı", en: "Active radar seeker" },
        status: { tr: "Geliştirmede; KAAN için planlanan (basında)", en: "In development; planned for KAAN (reported)" },
    },
    {
        id: "somj",
        name: "SOM-J",
        developer: "Roketsan / TÜBİTAK SAGE",
        role: { tr: "Gövde içi taşınabilen seyir füzesi", en: "Cruise missile sized for internal carriage" },
        guidance: { tr: "INS/GPS, kızılötesi terminal arayıcı", en: "INS/GPS, imaging infrared terminal seeker" },
        status: planned,
    },
    {
        id: "kuzgun",
        name: "KUZGUN",
        developer: "TÜBİTAK SAGE",
        role: { tr: "Modüler güdümlü mühimmat ailesi", en: "Modular guided munition family" },
        guidance: { tr: "Değişebilir arayıcı başlıklar", en: "Interchangeable seekers" },
        status: planned,
    },
    {
        id: "akbaba",
        name: "Akbaba",
        developer: "TÜBİTAK SAGE",
        role: { tr: "Radar karşıtı füze", en: "Anti-radiation missile" },
        guidance: { tr: "Pasif radar arayıcı", en: "Passive radar seeker" },
        status: { tr: "Geliştirmede; KAAN için planlanan (basında)", en: "In development; planned for KAAN (reported)" },
    },
];

export const missions: MissionProfile[] = [
    {
        id: "air",
        name: { tr: "Hava üstünlüğü", en: "Air superiority" },
        summary: {
            tr: "Yalnız gövde içi taşıma. Görüş ötesi füzeler ana yuvada, kısa menzilli füzeler yan yuvalarda; gizlilik korunur.",
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
        id: "long",
        name: { tr: "Uzun menzil önleme", en: "Long-range intercept" },
        summary: {
            tr: "Ramjet motorlu Gökhan ile daha uzak hedefler. Füzenin gövde içine sığıp sığmayacağı açıklanmadı; çizim iç yuvayı varsayar.",
            en: "The ramjet-powered Gökhan for more distant targets. Whether it fits the internal bay has not been stated; the drawing assumes it does.",
        },
        load: {
            bayL: { munition: "gokhan", qty: 1 },
            bayR: { munition: "gokhan", qty: 1 },
            sideL: { munition: "bozdogan", qty: 1 },
            sideR: { munition: "bozdogan", qty: 1 },
        },
    },
    {
        id: "strike",
        name: { tr: "Derin taarruz", en: "Deep strike" },
        summary: {
            tr: "SOM-J, F-35 gibi gizli uçakların iç yuvasına göre boyutlandırılmış bir seyir füzesi. Öz savunma için yan yuvalarda kısa menzilli füze.",
            en: "SOM-J is a cruise missile sized for the internal bays of stealth aircraft such as the F-35. Short-range missiles in the side bays for self-defence.",
        },
        load: {
            bayL: { munition: "somj", qty: 1 },
            bayR: { munition: "somj", qty: 1 },
            sideL: { munition: "bozdogan", qty: 1 },
            sideR: { munition: "bozdogan", qty: 1 },
        },
    },
    {
        id: "sead",
        name: { tr: "Hava savunma bastırma", en: "Air-defence suppression" },
        summary: {
            tr: "Akbaba radar yayınına kilitlenir; KUZGUN radarı susmuş mevzilere karşı ikinci vuruş içindir.",
            en: "Akbaba homes on radar emissions; KUZGUN follows up against sites whose radar has gone quiet.",
        },
        load: {
            bayL: { munition: "akbaba", qty: 1 },
            bayR: { munition: "kuzgun", qty: 2 },
            sideL: { munition: "bozdogan", qty: 1 },
            sideR: { munition: "bozdogan", qty: 1 },
        },
    },
    {
        id: "heavy",
        name: { tr: "Ağır yük (gizlilik dışı)", en: "Heavy load (non-stealth)" },
        summary: {
            tr: "Tehdit düşükse kanat altı istasyonlar da kullanılır. Daha çok mühimmat taşınır, ama dış askılar radar yansımasını büyütür.",
            en: "When the threat is low, wing stations are used as well. More stores are carried, but external pylons enlarge the radar return.",
        },
        load: {
            bayL: { munition: "gokdogan", qty: 2 },
            bayR: { munition: "gokdogan", qty: 2 },
            sideL: { munition: "bozdogan", qty: 1 },
            sideR: { munition: "bozdogan", qty: 1 },
            wingL: { munition: "somj", qty: 1 },
            wingR: { munition: "kuzgun", qty: 2 },
        },
    },
];

export const weaponsCopy: L<{
    label: string;
    title: string;
    lede: string;
    profile: string;
    diagramTitle: string;
    diagramNote: string;
    internal: string;
    external: string;
    stations: Record<StationId, string>;
    empty: string;
    colStation: string;
    colStore: string;
    colQty: string;
    colRole: string;
    colDeveloper: string;
    colStatus: string;
    source: string;
}> = {
    tr: {
        label: "Silahlar",
        title: "İçeride taşınan yük",
        lede: "Gizliliğin bedeli taşıma kapasitesidir. Gövde içi yuvalar az ama görünmez yük alır; kanat altı istasyonlar çok ama görünür. Aşağıdaki mühimmatlar KAAN ile birlikte anılan yerli sistemlerdir; hiçbirinin entegrasyonu henüz tamamlanmadı.",
        profile: "Görev profili",
        diagramTitle: "İstasyon şeması",
        diagramNote: "Temsili yerleşim. KAAN'ın yuva ölçüleri ve istasyon sayısı resmî olarak yayımlanmadı; adetler örnektir.",
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
        colStation: "İstasyon",
        colStore: "Mühimmat",
        colQty: "Adet",
        colRole: "Görev",
        colDeveloper: "Geliştirici",
        colStatus: "Durum",
        source: "Kaynak: TÜBİTAK SAGE ve Roketsan ürün sayfaları, TUSAŞ açıklamaları ve savunma basını, Kasım 2026 itibarıyla. Entegrasyon durumları basında yer aldığı hâliyle verilmiştir.",
    },
    en: {
        label: "Weapons",
        title: "Carried on the inside",
        lede: "Stealth costs payload. Internal bays take a small load that stays hidden; wing stations take more, in plain sight. The stores below are Turkish systems publicly linked to KAAN; none has completed integration yet.",
        profile: "Mission profile",
        diagramTitle: "Station diagram",
        diagramNote: "Notional layout. KAAN's bay dimensions and station count have not been officially published; quantities are examples.",
        internal: "Internal",
        external: "External",
        stations: {
            bayL: "Main bay, left",
            bayR: "Main bay, right",
            sideL: "Side bay, left",
            sideR: "Side bay, right",
            wingL: "Wing pylon, left",
            wingR: "Wing pylon, right",
        },
        empty: "Empty",
        colStation: "Station",
        colStore: "Store",
        colQty: "Qty",
        colRole: "Role",
        colDeveloper: "Developer",
        colStatus: "Status",
        source: "Source: TÜBİTAK SAGE and Roketsan product pages, Turkish Aerospace statements and defence press, as of November 2026. Integration status is given as reported.",
    },
};
