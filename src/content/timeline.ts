import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

export interface Milestone {
    id: string;
    /** Display date, already localised where it contains a month. */
    when: L;
    title: L;
    body: L;
    /** true: happened and is documented. false: a target or plan. */
    done: boolean;
}

/**
 * Programme milestones, oldest first. Past items are documented events; planned items are
 * targets stated by Turkish Aerospace or officials and are shown as such.
 */
export const milestones: Milestone[] = [
    {
        id: "launch",
        when: { tr: "2010–2011", en: "2010–2011" },
        title: { tr: "Program kararı ve kavramsal tasarım", en: "Programme decision and concept design" },
        body: {
            tr: "Savunma Sanayii İcra Komitesi yerli bir muharip uçak geliştirilmesine karar verdi; kavramsal tasarım çalışması TUSAŞ'a verildi.",
            en: "Türkiye's Defence Industry Executive Committee decided to develop a domestic fighter; the concept design study went to Turkish Aerospace.",
        },
        done: true,
    },
    {
        id: "contract",
        when: { tr: "Ağustos 2016", en: "August 2016" },
        title: { tr: "Geliştirme sözleşmesi", en: "Development contract" },
        body: {
            tr: "SSB ile TUSAŞ arasında TF-X geliştirme sözleşmesi imzalandı. 2017'de BAE Systems ile tasarım desteği anlaşması yapıldı.",
            en: "SSB and Turkish Aerospace signed the TF-X development contract. A design-support agreement with BAE Systems followed in 2017.",
        },
        done: true,
    },
    {
        id: "rollout",
        when: { tr: "Mart–Mayıs 2023", en: "March–May 2023" },
        title: { tr: "Hangardan çıkış ve isim", en: "Roll-out and name" },
        body: {
            tr: "İlk prototip P0, 18 Mart 2023'te hangardan çıkarıldı. Uçağın adı 1 Mayıs 2023'te KAAN olarak açıklandı.",
            en: "The first prototype, P0, was rolled out on 18 March 2023. The aircraft was named KAAN on 1 May 2023.",
        },
        done: true,
    },
    {
        id: "first-flight",
        when: { tr: "21 Şubat 2024", en: "21 February 2024" },
        title: { tr: "İlk uçuş", en: "First flight" },
        body: {
            tr: "P0 yaklaşık 13 dakika uçtu, yaklaşık 8.000 ft irtifaya ve 230 knot hıza çıktı.",
            en: "P0 flew for about 13 minutes, reaching roughly 8,000 ft and 230 kt.",
        },
        done: true,
    },
    {
        id: "indonesia",
        when: { tr: "Temmuz 2025", en: "July 2025" },
        title: { tr: "Endonezya sözleşmesi", en: "Indonesia contract" },
        body: {
            tr: "İstanbul'daki IDEF fuarında 48 uçaklık sözleşme imzalandı; KAAN'ın ilk ihracatı.",
            en: "A contract for 48 aircraft was signed at the IDEF exhibition in Istanbul; KAAN's first export.",
        },
        done: true,
    },
    {
        id: "p1-taxi",
        when: { tr: "Temmuz 2026", en: "July 2026" },
        title: { tr: "P1 taksi testleri", en: "P1 taxi trials" },
        body: {
            tr: "Seri üretim standardına yakın ilk prototip P1 düşük hızlı taksi testlerine başladı. P2 de taksi testinden geçti.",
            en: "P1, the first production-representative prototype, began slow taxi trials. P2 has also been taxi-tested.",
        },
        done: true,
    },
    {
        id: "p1-flight",
        when: { tr: "2026 sonu hedefi", en: "Target: end of 2026" },
        title: { tr: "P1 ilk uçuşu", en: "P1 first flight" },
        body: {
            tr: "TUSAŞ Ekim 2026'da P1'in \"birkaç hafta içinde\" uçacağını söyledi. Kasım 2026 itibarıyla uçuş doğrulanmadı.",
            en: "In October 2026 Turkish Aerospace said P1 would fly \"within weeks\". As of November 2026 the flight has not been confirmed.",
        },
        done: false,
    },
    {
        id: "block10",
        when: { tr: "≈2028", en: "≈2028" },
        title: { tr: "Blok 10 teslimatları", en: "Block 10 deliveries" },
        body: {
            tr: "GE F110 motorlu ilk seri üretim uçaklarının Türk Hava Kuvvetleri'ne teslimi hedefleniyor.",
            en: "First production aircraft, with GE F110 engines, are targeted for delivery to the Turkish Air Force.",
        },
        done: false,
    },
    {
        id: "tf35000",
        when: { tr: "2030'ların başı", en: "Early 2030s" },
        title: { tr: "TF35000 motoru", en: "TF35000 engine" },
        body: {
            tr: "TEI'nin geliştirdiği yerli TF35000 motorunun sonraki bloklarda F110'un yerini alması planlanıyor.",
            en: "TEI's indigenous TF35000 is planned to replace the F110 in later blocks.",
        },
        done: false,
    },
];

export const timelineCopy: L<{ label: string; title: string; lede: string; done: string; planned: string; legend: string; source: string }> = {
    tr: {
        label: "Takvim",
        title: "Kararlardan ilk uçuşa",
        lede: "Program 2010'daki karardan bu yana adım adım ilerledi. Dolu işaretler gerçekleşmiş olayları, boş işaretler hedefleri gösteriyor; hedef tarihler kayabilir.",
        done: "gerçekleşti",
        planned: "planlanan",
        legend: "İşaretler",
        source: "Kaynak: TUSAŞ ve SSB açıklamaları, Wikipedia (TAI TF Kaan) ve savunma basını, Kasım 2026 itibarıyla.",
    },
    en: {
        label: "Timeline",
        title: "From decision to first flight",
        lede: "The programme has moved step by step since the 2010 decision. Filled markers are events that happened, hollow markers are targets; target dates can slip.",
        done: "happened",
        planned: "planned",
        legend: "Markers",
        source: "Source: Turkish Aerospace and SSB statements, Wikipedia (TAI TF Kaan) and defence press, as of November 2026.",
    },
};
