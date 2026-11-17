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
 * Where the site's figures and dates come from. Links point at stable top-level pages; individual
 * articles change URL too often to be worth deep-linking.
 */
export const dataSources: SourceGroup[] = [
    {
        id: "reference",
        title: { tr: "Genel başvuru", en: "General reference" },
        items: [
            {
                name: "Wikipedia: TAI TF Kaan",
                url: "https://en.wikipedia.org/wiki/TAI_TF_Kaan",
                use: { tr: "Program geçmişi, tarihler, boyutlar; kaynakçası üzerinden birincil kaynaklara ulaşmak için.", en: "Programme history, dates, dimensions; and its references, to reach primary sources." },
            },
            {
                name: "Vikipedi: TUSAŞ KAAN",
                url: "https://tr.wikipedia.org/wiki/TUSAŞ_KAAN",
                use: { tr: "Türkçe adlar ve tarihlerin karşılaştırılması.", en: "Turkish names and cross-checking dates." },
            },
        ],
    },
    {
        id: "official",
        title: { tr: "Resmî açıklamalar", en: "Official statements" },
        items: [
            {
                name: "TUSAŞ (Turkish Aerospace)",
                url: "https://www.tusas.com/",
                use: { tr: "Basın bültenleri: ilk uçuş, prototip testleri, Endonezya sözleşmesi.", en: "Press releases: first flight, prototype tests, Indonesia contract." },
            },
            {
                name: "SSB, Savunma Sanayii Başkanlığı",
                url: "https://www.ssb.gov.tr/",
                use: { tr: "Program kararları ve sözleşmeler.", en: "Programme decisions and contracts." },
            },
            {
                name: "ASELSAN",
                url: "https://www.aselsan.com/",
                use: { tr: "MURAD radarı, TULGAR kask sistemi ve diğer aviyonik.", en: "MURAD radar, TULGAR helmet system and other avionics." },
            },
            {
                name: "TEI",
                url: "https://www.tei.com.tr/",
                use: { tr: "TF35000 motor programı.", en: "TF35000 engine programme." },
            },
            {
                name: "ROKETSAN",
                url: "https://www.roketsan.com.tr/",
                use: { tr: "Havadan atılan mühimmat.", en: "Air-launched munitions." },
            },
            {
                name: "TÜBİTAK SAGE",
                url: "https://www.sage.tubitak.gov.tr/",
                use: { tr: "GÖKDOĞAN ve BOZDOĞAN füzeleri.", en: "GÖKDOĞAN and BOZDOĞAN missiles." },
            },
            {
                name: "HAVELSAN",
                url: "https://www.havelsan.com.tr/",
                use: { tr: "Simülasyon ve eğitim sistemleri.", en: "Simulation and training systems." },
            },
        ],
    },
    {
        id: "press",
        title: { tr: "Savunma basını", en: "Defence press" },
        items: [
            {
                name: "Defense News",
                url: "https://www.defensenews.com/",
                use: { tr: "Endonezya sözleşmesi, motor ve takvim haberleri.", en: "Reporting on the Indonesia contract, engines and schedule." },
            },
            {
                name: "Breaking Defense",
                url: "https://breakingdefense.com/",
                use: { tr: "Endonezya sözleşmesi ve prototip testleri.", en: "Reporting on the Indonesia contract and prototype testing." },
            },
            {
                name: "Janes",
                url: "https://www.janes.com/",
                use: { tr: "Program ve alt sistem haberleri.", en: "Programme and subsystem reporting." },
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
