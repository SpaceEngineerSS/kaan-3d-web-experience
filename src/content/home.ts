import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

export const heroCopy: L<{
    kicker: string;
    statement: string;
    footage: string;
    status: { k: string; v: string; state: "done" | "active" | "planned" }[];
    statusTitle: string;
    scroll: string;
}> = {
    tr: {
        kicker: "Milli Muharip Uçak · TUSAŞ",
        statement: "Türkiye'nin beşinci nesil muharip uçağı. Gerçek uçuş görüntüleri, açıklanmış veriler ve uçağın üç boyutlu modeliyle hazırlanmış bağımsız bir inceleme.",
        footage: "Görüntü: KAAN P0, 2024 uçuş testi · TUSAŞ",
        statusTitle: "Program durumu · Kasım 2026",
        status: [
            { k: "P0", v: "21 Şubat 2024'te uçtu", state: "done" },
            { k: "P1", v: "Taksi testlerinde, ilk uçuş 2026 sonu hedefi", state: "active" },
            { k: "Blok 10", v: "20 uçak sipariş edildi (SAHA 2026)", state: "active" },
            { k: "Endonezya", v: "48 uçak sözleşmesi, Temmuz 2025", state: "done" },
        ],
        scroll: "Aşağı kaydırın",
    },
    en: {
        kicker: "National Combat Aircraft · Turkish Aerospace",
        statement: "Türkiye's fifth-generation fighter. An independent study built from real flight footage, published figures and a 3D model of the aircraft.",
        footage: "Footage: KAAN P0, 2024 flight test · Turkish Aerospace",
        statusTitle: "Programme status · November 2026",
        status: [
            { k: "P0", v: "First flew on 21 February 2024", state: "done" },
            { k: "P1", v: "In taxi tests, first flight targeted for late 2026", state: "active" },
            { k: "Block 10", v: "20 aircraft ordered (SAHA 2026)", state: "active" },
            { k: "Indonesia", v: "Contract for 48 aircraft, July 2025", state: "done" },
        ],
        scroll: "Scroll down",
    },
};

export const firstFlightCopy: L<{
    label: string;
    title: string;
    lede: string;
    stamp: { date: string; time: string; place: string };
    log: { k: string; v: string }[];
    paragraphs: string[];
    filmCaption: string;
    source: string;
}> = {
    tr: {
        label: "İlk uçuş",
        title: "On üç dakika",
        lede: "KAAN, 21 Şubat 2024 sabahı Ankara'daki Mürted Hava Üssü'nden ilk kez havalandı. Uçuş planlanan Aralık 2023 tarihinden iki ay sonra yapıldı.",
        stamp: { date: "21.02.2024", time: "08.50", place: "Mürted · Ankara" },
        log: [
            { k: "Uçak", v: "P0 prototipi" },
            { k: "Pilot", v: "Barbaros Demirbaş" },
            { k: "Süre", v: "≈ 13 dk" },
            { k: "En yüksek irtifa", v: "8.000 ft" },
            { k: "En yüksek hız", v: "230 kt" },
            { k: "İniş takımı", v: "Açık" },
            { k: "İniş", v: "Fren paraşütü" },
            { k: "Eskort", v: "F-16D" },
            { k: "Motor", v: "2 × F110-GE-129" },
        ],
        paragraphs: [
            "İlk uçuşun amacı performans değil, uçağın ve uçuş kontrol sisteminin davranışını görmekti. Bu yüzden iniş takımları uçuş boyunca açık kaldı ve uçak 8.000 ft'in üstüne çıkmadı.",
            "Uçuşta TÜBİTAK BİLGEM'in geliştirdiği aviyonik bilgisayar da görev aldı; geniş ekranı ve kaska monte göstergeyi yöneten sistem bu bilgisayar üzerinde çalışıyor.",
            "İkinci uçuş 6 Mayıs 2024'te yapıldı: yaklaşık 14 dakika, 10.000 ft. 6 Aralık 2024'te iki motor art yakıcıyla birlikte yerde çalıştırıldı.",
        ],
        filmCaption: "Kalkış, 2024 uçuş testi",
        source: "Kaynak: Anadolu Ajansı, TÜBİTAK, The War Zone (Şubat 2024); ikinci uçuş ve motor testi için basın ve Wikipedia.",
    },
    en: {
        label: "First flight",
        title: "Thirteen minutes",
        lede: "KAAN first took off on the morning of 21 February 2024 from Mürted Air Base in Ankara, two months after the December 2023 date that had been planned.",
        stamp: { date: "21.02.2024", time: "08:50", place: "Mürted · Ankara" },
        log: [
            { k: "Aircraft", v: "P0 prototype" },
            { k: "Pilot", v: "Barbaros Demirbaş" },
            { k: "Duration", v: "≈ 13 min" },
            { k: "Max altitude", v: "8,000 ft" },
            { k: "Max speed", v: "230 kt" },
            { k: "Landing gear", v: "Down" },
            { k: "Landing", v: "Brake chute" },
            { k: "Chase", v: "F-16D" },
            { k: "Engines", v: "2 × F110-GE-129" },
        ],
        paragraphs: [
            "The first flight was about behaviour, not performance: how the aircraft and its flight control system responded. That is why the gear stayed down and the aircraft stayed below 8,000 ft.",
            "The avionics computer developed by TÜBİTAK BİLGEM also flew; it runs the system that drives the large-area display and the helmet-mounted display.",
            "The second flight followed on 6 May 2024: about 14 minutes, 10,000 ft. On 6 December 2024 both engines were run together on the ground with afterburner.",
        ],
        filmCaption: "Take-off, 2024 flight test",
        source: "Sources: Anadolu Agency, TÜBİTAK, The War Zone (February 2024); press and Wikipedia for the second flight and engine run.",
    },
};
