import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

export const ISSUES_URL = "https://github.com/SpaceEngineerSS/kaan-3d-web-experience/issues";

export interface DataSource {
    name: string;
    url: string;
    use: L;
}

export interface SourceGroup {
    id: string;
    title: L;
    items: DataSource[];
}

/**
 * Where the site's figures and dates come from. Company product pages and datasheets are linked directly;
 * press items link to the publication, with the story named in `use`, because article URLs change too often.
 */
export const dataSources: SourceGroup[] = [
    {
        id: "official",
        title: { tr: "Üretici ve kurum kaynakları", en: "Manufacturer and agency sources" },
        items: [
            {
                name: "TUSAŞ: KAAN",
                url: "https://www.tusas.com/urunler/ucak/ozgun-gelistirme/kaan",
                use: { tr: "Resmî teknik özellikler (boyutlar, ağırlık, itki, hız, irtifa, g sınırları) ve kokpit sistemleri listesi.", en: "Official specifications (dimensions, weight, thrust, speed, ceiling, g limits) and the cockpit systems list." },
            },
            {
                name: "ASELSAN: TULGAR",
                url: "https://www.aselsan.com/tr/savunma/urun/3428/tulgar",
                use: { tr: "Kask monteli gösterge sistemi ürün sayfası.", en: "Helmet-mounted display product page." },
            },
            {
                name: "ASELSAN: TULGAR veri sayfası (PDF)",
                url: "https://wwwcdn.aselsan.com/api/file/TULGAR_ENG.pdf",
                use: { tr: "40°×32° görüş alanı, ağırlık, ARINC-818-2 ve MIL-STD-1553 arayüzleri.", en: "40°×32° field of view, weight, ARINC-818-2 and MIL-STD-1553 interfaces." },
            },
            {
                name: "TÜBİTAK",
                url: "https://tubitak.gov.tr/",
                use: { tr: "İlk uçuş duyurusu; ilk uçuşta uçan BİLGEM aviyonik bilgisayarı.", en: "First-flight announcement; the BİLGEM avionics computer that flew on the first flight." },
            },
            {
                name: "SSB, Savunma Sanayii Başkanlığı",
                url: "https://www.ssb.gov.tr/",
                use: { tr: "Program kararları ve sözleşmeler.", en: "Programme decisions and contracts." },
            },
            {
                name: "TEI",
                url: "https://www.tei.com.tr/",
                use: { tr: "TF35000 motor programı.", en: "TF35000 engine programme." },
            },
        ],
    },
    {
        id: "press",
        title: { tr: "Haber ve savunma basını", en: "News and defence press" },
        items: [
            {
                name: "Anadolu Ajansı",
                url: "https://www.aa.com.tr/",
                use: { tr: "21 Şubat 2024 ilk uçuşu; TEKNOFEST Şanlıurfa'daki tam ölçekli maket.", en: "The 21 February 2024 first flight; the full-scale mock-up at TEKNOFEST Şanlıurfa." },
            },
            {
                name: "Breaking Defense",
                url: "https://breakingdefense.com/",
                use: { tr: "SAHA 2026'da 20 Blok 10 sözleşmesi; ABD'nin F110 ihracat izni.", en: "The 20 Block 10 contract at SAHA 2026; the US F110 export clearance." },
            },
            {
                name: "TURDEF",
                url: "https://www.turdef.com/",
                use: { tr: "ASELSAN'ın Paris 2025'te açıkladığı KAAN sensörleri ve faydalı yükleri; Martin-Baker T18T koltuğu.", en: "KAAN sensors and payloads shown by ASELSAN at Paris 2025; the Martin-Baker T18T seat." },
            },
            {
                name: "Haber.Aero",
                url: "https://www.haber.aero/",
                use: { tr: "P1'in 31 Temmuz 2026'daki ilk taksi testi.", en: "P1's first taxi test on 31 July 2026." },
            },
            {
                name: "Aviation Week",
                url: "https://aviationweek.com/",
                use: { tr: "Endonezya'nın 48 uçaklık sözleşmesi.", en: "Indonesia's contract for 48 aircraft." },
            },
            {
                name: "Janes",
                url: "https://www.janes.com/",
                use: { tr: "Endonezya sözleşmesi ve alt sistem haberleri.", en: "The Indonesia contract and subsystem reporting." },
            },
            {
                name: "SavunmaTR",
                url: "https://www.savunmatr.com/",
                use: { tr: "HAVELSAN'ın yerlileştirdiği gösterge grafik kütüphanesi (Kasım 2026).", en: "HAVELSAN's localised display graphics library (November 2026)." },
            },
        ],
    },
    {
        id: "reference",
        title: { tr: "Genel başvuru", en: "General reference" },
        items: [
            {
                name: "Wikipedia: TAI TF Kaan",
                url: "https://en.wikipedia.org/wiki/TAI_TF_Kaan",
                use: { tr: "Program geçmişi ve kaynakçası; sitede \"bildirilen\" diye işaretli bazı değerler.", en: "Programme history and its references; some values marked \"reported\" on the site." },
            },
            {
                name: "Vikipedi: TUSAŞ KAAN",
                url: "https://tr.wikipedia.org/wiki/TUSAŞ_KAAN",
                use: { tr: "Türkçe adlar ve tarihlerin karşılaştırılması.", en: "Turkish names and cross-checking dates." },
            },
        ],
    },
];

export const sourcesCopy: L<{
    kicker: string;
    title: string;
    lede: string;
    mediaTitle: string;
    gallery: string;
    videos: string;
    models: string;
    colItem: string;
    colCredit: string;
    link: string;
    dataTitle: string;
    dataLede: string;
    licenceTitle: string;
    licence: string[];
    takedown: string;
    takedownLink: string;
}> = {
    tr: {
        kicker: "Kaynaklar",
        title: "Kaynaklar ve görsel hakları",
        lede: "Bu sitede kullanılan her fotoğraf, video ve 3D model ile verilerin geldiği yerler. Kaynağı bilinmeyen görseller açıkça öyle işaretlendi.",
        mediaTitle: "Görseller, videolar ve modeller",
        gallery: "Fotoğraflar ve çizimler",
        videos: "Videolar",
        models: "3D modeller",
        colItem: "Görsel",
        colCredit: "Kaynak",
        link: "bağlantı",
        dataTitle: "Veri kaynakları",
        dataLede: "Rakamlar ve tarihler aşağıdaki kaynak türlerinden derlendi ve Kasım 2026'da kontrol edildi. Tahmini ya da hedef değerler sitede ayrıca işaretlidir.",
        licenceTitle: "Lisans",
        licence: [
            "Sitenin kaynak kodu MIT lisansıyla açıktır.",
            "KAAN adı ve tasarımı TUSAŞ'a aittir. Fotoğraf, video ve modellerin hakları sahiplerindedir; burada kâr amacı olmadan, bilgilendirme için ve kaynak gösterilerek kullanılıyor.",
            "Bu site TUSAŞ ya da başka bir kurumla bağlantılı değildir.",
        ],
        takedown: "Bir görselin sahibiyseniz ve kaldırılmasını ya da kaynağın düzeltilmesini istiyorsanız GitHub üzerinden bildirin.",
        takedownLink: "GitHub'da konu açın",
    },
    en: {
        kicker: "Sources",
        title: "Sources and image credits",
        lede: "Every photo, video and 3D model used on this site, and where the data comes from. Images whose source is unknown are marked as such.",
        mediaTitle: "Images, videos and models",
        gallery: "Photos and renders",
        videos: "Videos",
        models: "3D models",
        colItem: "Image",
        colCredit: "Source",
        link: "link",
        dataTitle: "Data sources",
        dataLede: "Figures and dates were compiled from the source types below and checked in November 2026. Estimates and targets are marked separately on the site.",
        licenceTitle: "Licence",
        licence: [
            "The site's source code is open under the MIT licence.",
            "The KAAN name and design belong to Turkish Aerospace. Rights to photos, videos and models belong to their owners; they are used here non-commercially, for information, with attribution.",
            "This site is not affiliated with Turkish Aerospace or any other organisation.",
        ],
        takedown: "If you own an image and want it removed or its credit corrected, let us know on GitHub.",
        takedownLink: "Open an issue on GitHub",
    },
};
