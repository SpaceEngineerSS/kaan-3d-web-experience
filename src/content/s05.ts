import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

/** Section 05, the engineering file: plate labels and UI strings. Figures live in comparison / programme. */
export const s05Copy: L<{
    index: string;
    title: string;
    hmdsLabel: string;
    hmdsTitle: string;
    fov: string;
    visorNote: string;
    matrixLabel: string;
    matrixTitle: string;
    planLabel: string;
    planNote: string;
    sinceFirst: string;
    years: string;
    genStatus: string;
    pinsTitle: string;
    progLabel: string;
    progTitle: string;
    colDate: string;
    colEvent: string;
    colStatus: string;
    ordersLabel: string;
    archiveLabel: string;
    archiveHint: string;
    filmLabel: string;
    sources: string;
    noSource: string;
    prev: string;
    next: string;
    strip: string;
}> = {
    tr: {
        index: "05",
        title: "Mühendislik dosyası",
        hmdsLabel: "HMDS // VİZÖR",
        hmdsTitle: "HUD yok, vizör var",
        fov: "Görüş alanı",
        visorNote:
            "İlk uçuşun açıklanan sınırları: en çok 8.000 ft, 230 knot, iniş takımları açık, yaklaşık 13 dakika. Sahnedeki canlandırma bu zarfın içinde kalır; KAAN'ın gerçek vizör sembolojisi yayımlanmadı.",
        matrixLabel: "TEKNİK KARŞILAŞTIRMA MATRİSİ",
        matrixTitle: "KAAN / F-35A / Su-57",
        planLabel: "PLAN GÖRÜNÜŞÜ // AYNI ÖLÇEK",
        planNote: "Uzunluk × kanat açıklığı çerçeveleri, metre. Gövde biçimi değil, zarf karşılaştırması.",
        sinceFirst: "İlk uçuştan bu yana",
        years: "yıl",
        genStatus: "Nesil / durum",
        pinsTitle: "Sensörler, silahlar, gözlemler",
        progLabel: "PROGRAM MATRİSİ",
        progTitle: "Takvim ve siparişler",
        colDate: "Tarih",
        colEvent: "Olay",
        colStatus: "Durum",
        ordersLabel: "SİPARİŞLER",
        archiveLabel: "ARŞİV ŞERİDİ",
        archiveHint: "Sürükleyin, kaydırın ya da ok tuşlarını kullanın. Büyütmek için bir görsel seçin.",
        filmLabel: "UÇUŞ KAYDI // P0 2024",
        sources: "Tüm kaynaklar",
        noSource: "bağlantı yok",
        prev: "Önceki",
        next: "Sonraki",
        strip: "Görsel arşivi, yatay şerit",
    },
    en: {
        index: "05",
        title: "Engineering file",
        hmdsLabel: "HMDS // VISOR",
        hmdsTitle: "No HUD, a visor",
        fov: "Field of view",
        visorNote:
            "Published first-flight limits: at most 8,000 ft, 230 kt, gear down, about 13 minutes. The animation in the scene stays inside that envelope; KAAN's real visor symbology has not been published.",
        matrixLabel: "TECHNICAL COMPARISON MATRIX",
        matrixTitle: "KAAN / F-35A / Su-57",
        planLabel: "PLAN VIEW // SAME SCALE",
        planNote: "Length × span frames, metres. An envelope comparison, not airframe shapes.",
        sinceFirst: "Since first flight",
        years: "yr",
        genStatus: "Generation / status",
        pinsTitle: "Sensors, weapons, observations",
        progLabel: "PROGRAMME MATRIX",
        progTitle: "Timeline and orders",
        colDate: "Date",
        colEvent: "Event",
        colStatus: "Status",
        ordersLabel: "ORDERS",
        archiveLabel: "ARCHIVE STRIP",
        archiveHint: "Drag, scroll or use the arrow keys. Select an image to enlarge it.",
        filmLabel: "FLIGHT RECORD // P0 2024",
        sources: "All sources",
        noSource: "no link",
        prev: "Previous",
        next: "Next",
        strip: "Image archive, horizontal strip",
    },
};
