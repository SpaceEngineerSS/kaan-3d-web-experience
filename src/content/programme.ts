import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

/** "confirmed": stated by the company, the customer or the procurement agency. "reported": press or analyst reports. */
export type Basis = "confirmed" | "reported";

/* ── Timeline ─────────────────────────────────────────────────────────── */

export interface ProgrammeEvent {
    id: string;
    /** Year group the event is filed under. */
    year: string;
    /** Exact date as published, localised. */
    date: L;
    title: L;
    body: L;
    /** true: happened and is documented. false: a target or plan. */
    done: boolean;
    /** The one emphasised row of the chapter. */
    key?: boolean;
}

/**
 * Programme events, oldest first. Done items are documented; planned items are targets stated by
 * Turkish Aerospace, TEI or officials. Status as of mid-November 2026.
 */
export const events: ProgrammeEvent[] = [
    {
        id: "decision",
        year: "2010",
        date: { tr: "2010–2011", en: "2010–2011" },
        title: { tr: "Program kararı", en: "Programme decision" },
        body: {
            tr: "Savunma Sanayii İcra Komitesi yerli bir muharip uçak geliştirilmesine karar verdi; kavramsal tasarım TUSAŞ'a verildi.",
            en: "Türkiye's Defence Industry Executive Committee decided to develop a domestic fighter; concept design went to Turkish Aerospace.",
        },
        done: true,
    },
    {
        id: "contract",
        year: "2016",
        date: { tr: "Ağustos 2016", en: "August 2016" },
        title: { tr: "Geliştirme sözleşmesi", en: "Development contract" },
        body: {
            tr: "SSB ile TUSAŞ arasında TF-X geliştirme sözleşmesi imzalandı. 2017'de BAE Systems ile tasarım desteği anlaşması yapıldı.",
            en: "SSB and Turkish Aerospace signed the TF-X development contract. A design-support agreement with BAE Systems followed in 2017.",
        },
        done: true,
    },
    {
        id: "rollout",
        year: "2023",
        date: { tr: "Mart 2023", en: "March 2023" },
        title: { tr: "P0 hangardan çıktı", en: "P0 leaves the hangar" },
        body: {
            tr: "İlk prototip P0 yer testleri için hangardan çıkarıldı.",
            en: "The first prototype, P0, was rolled out for ground testing.",
        },
        done: true,
    },
    {
        id: "name",
        year: "2023",
        date: { tr: "1 Mayıs 2023", en: "1 May 2023" },
        title: { tr: "Adı KAAN", en: "Named KAAN" },
        body: {
            tr: "TF-X programının uçağı KAAN adını aldı.",
            en: "The TF-X programme's aircraft was given the name KAAN.",
        },
        done: true,
    },
    {
        id: "first-flight",
        year: "2024",
        date: { tr: "21 Şubat 2024, 08.50", en: "21 February 2024, 08:50" },
        title: { tr: "İlk uçuş", en: "First flight" },
        body: {
            tr: "Mürted (Akıncı) Hava Üssü. Pilot Barbaros Demirbaş; 13 dakika, 8.000 ft, 230 knot. İniş takımları açık uçtu, fren paraşütüyle indi; bir F-16D eşlik etti.",
            en: "Mürted (Akıncı) Air Base. Pilot Barbaros Demirbaş; 13 minutes, 8,000 ft, 230 kt. Flown with the gear down, landed with the brake chute, with an F-16D as chase.",
        },
        done: true,
        key: true,
    },
    {
        id: "second-flight",
        year: "2024",
        date: { tr: "6 Mayıs 2024", en: "6 May 2024" },
        title: { tr: "İkinci uçuş", en: "Second flight" },
        body: {
            tr: "P0 yaklaşık 14 dakika uçtu ve 10.000 ft'e çıktı.",
            en: "P0 flew for about 14 minutes and climbed to 10,000 ft.",
        },
        done: true,
    },
    {
        id: "ab-run",
        year: "2024",
        date: { tr: "6 Aralık 2024", en: "6 December 2024" },
        title: { tr: "Çift motor art yakıcı testi", en: "Twin-engine afterburner run" },
        body: {
            tr: "İki motor yerde birlikte art yakıcıda çalıştırıldı.",
            en: "Both engines were run together in afterburner on the ground.",
        },
        done: true,
    },
    {
        id: "indonesia-agreement",
        year: "2025",
        date: { tr: "11 Haziran 2025", en: "11 June 2025" },
        title: { tr: "Endonezya anlaşması", en: "Indonesia agreement" },
        body: {
            tr: "Endonezya ile KAAN tedariki için anlaşma imzalandı.",
            en: "An agreement on KAAN procurement was signed with Indonesia.",
        },
        done: true,
    },
    {
        id: "indonesia-contract",
        year: "2025",
        date: { tr: "26 Temmuz 2025", en: "26 July 2025" },
        title: { tr: "Endonezya'ya 48 uçak", en: "48 aircraft for Indonesia" },
        body: {
            tr: "IDEF fuarında 48 uçaklık sözleşme imzalandı; KAAN'ın ilk ihracatı. Teslimatlar 120 ay içinde.",
            en: "A contract for 48 aircraft was signed at IDEF; KAAN's first export. Deliveries within 120 months.",
        },
        done: true,
    },
    {
        id: "three-prototypes",
        year: "2026",
        date: { tr: "13 Şubat 2026", en: "13 February 2026" },
        title: { tr: "P0, P1 ve P2 yan yana", en: "P0, P1 and P2 side by side" },
        body: {
            tr: "Üç prototip ilk kez birlikte gösterildi. Aynı ay TEI, TF35000 motorunun kritik tasarım gözden geçirmesini (CDR) tamamladı.",
            en: "The three prototypes were shown together for the first time. The same month TEI completed the TF35000 critical design review (CDR).",
        },
        done: true,
    },
    {
        id: "block10-contract",
        year: "2026",
        date: { tr: "Mayıs 2026", en: "May 2026" },
        title: { tr: "Hava Kuvvetleri'ne 20 Blok 10", en: "20 Block 10 for the Air Force" },
        body: {
            tr: "SAHA fuarında Türk Hava Kuvvetleri için ilk seri üretim sözleşmesi imzalandı: 20 adet Blok 10.",
            en: "The first production contract for the Turkish Air Force was signed at SAHA: 20 Block 10 aircraft.",
        },
        done: true,
    },
    {
        id: "f110-export",
        year: "2026",
        date: { tr: "Temmuz 2026", en: "July 2026" },
        title: { tr: "F110 ihracat izni", en: "F110 export clearance" },
        body: {
            tr: "ABD, GE F110 motorlarının ihracatına izin verdi: prototipler için 10, seri üretim için 80 motor.",
            en: "The US cleared export of the GE F110: 10 engines for the prototypes and 80 for series production.",
        },
        done: true,
    },
    {
        id: "p1-taxi",
        year: "2026",
        date: { tr: "31 Temmuz 2026", en: "31 July 2026" },
        title: { tr: "P1 ilk taksi", en: "P1 first taxi" },
        body: {
            tr: "Seri üretim standardına yakın ilk prototip P1, düşük hızlı taksi testine başladı.",
            en: "P1, the first production-representative prototype, began slow-speed taxi trials.",
        },
        done: true,
    },
    {
        id: "teknofest",
        year: "2026",
        date: { tr: "30 Eylül – 4 Ekim 2026", en: "30 September – 4 October 2026" },
        title: { tr: "TEKNOFEST Şanlıurfa", en: "TEKNOFEST Şanlıurfa" },
        body: {
            tr: "Tam ölçekli KAAN maketi TEKNOFEST Güneydoğu'da sergilendi.",
            en: "A full-scale KAAN mock-up was shown at TEKNOFEST Güneydoğu.",
        },
        done: true,
    },
    {
        id: "p1-flight",
        year: "2026",
        date: { tr: "2026 sonu hedefi", en: "Target: end of 2026" },
        title: { tr: "P1 ilk uçuşu", en: "P1 first flight" },
        body: {
            tr: "TUSAŞ, P1'in yıl sonundan önce uçmasını hedefliyor. Kasım 2026 ortası itibarıyla P1 henüz uçmadı.",
            en: "Turkish Aerospace aims to fly P1 before the end of the year. As of mid-November 2026 P1 has not flown.",
        },
        done: false,
    },
    {
        id: "tf35000-proto",
        year: "2027",
        date: { tr: "2027'den itibaren", en: "From 2027" },
        title: { tr: "TF35000 prototip üretimi", en: "TF35000 prototype build" },
        body: {
            tr: "TEI'nin yerli motoru için prototip üretimi planlanıyor.",
            en: "Prototype production of TEI's indigenous engine is planned.",
        },
        done: false,
    },
    {
        id: "block10-delivery",
        year: "≈2028",
        date: { tr: "≈2028 hedefi", en: "≈2028 target" },
        title: { tr: "İlk Blok 10 teslimatı", en: "First Block 10 delivery" },
        body: {
            tr: "F110 motorlu ilk seri üretim uçaklarının Hava Kuvvetleri'ne teslimi hedefleniyor (bildirilen).",
            en: "First F110-powered production aircraft are targeted for delivery to the Air Force (reported).",
        },
        done: false,
    },
    {
        id: "tf35000-switch",
        year: "≈2032",
        date: { tr: "≈2032", en: "≈2032" },
        title: { tr: "TF35000'e geçiş", en: "Switch to TF35000" },
        body: {
            tr: "Sonraki bloklarda F110'un yerini yerli TF35000'in alması planlanıyor.",
            en: "The indigenous TF35000 is planned to replace the F110 in later blocks.",
        },
        done: false,
    },
];

/* ── Prototypes ───────────────────────────────────────────────────────── */

export type ProtoStatus = "flown" | "taxi";

export interface Prototype {
    id: "P0" | "P1" | "P2";
    status: ProtoStatus;
    statusText: L;
    finish: L;
    body: L;
    facts: { term: L; value: L }[];
}

export const prototypes: Prototype[] = [
    {
        id: "P0",
        status: "flown",
        statusText: { tr: "Uçtu", en: "Flown" },
        finish: { tr: "Gri son kat boya, BOTEK, MIL-PRF-85285", en: "Grey topcoat, BOTEK, MIL-PRF-85285" },
        body: {
            tr: "Teknoloji gösterim uçağı. 2024'te iki kez uçtu; uçuş zarfı bilinçli olarak dar tutuldu: iniş takımları açık, düşük irtifa ve hız.",
            en: "Technology demonstrator. Flew twice in 2024 inside a deliberately narrow envelope: gear down, low altitude and speed.",
        },
        facts: [
            { term: { tr: "Uçuşlar", en: "Flights" }, value: { tr: "21 Şub 2024 · 6 May 2024", en: "21 Feb 2024 · 6 May 2024" } },
            { term: { tr: "Motor", en: "Engines" }, value: { tr: "2 × GE F110", en: "2 × GE F110" } },
        ],
    },
    {
        id: "P1",
        status: "taxi",
        statusText: { tr: "Taksi · ilk uçuş bekleniyor", en: "Taxi · first flight pending" },
        finish: { tr: "Astar (beyaz), son kat boyasız", en: "Primer (white), no topcoat" },
        body: {
            tr: "Seri üretim standardına yakın ilk prototip; sensör ve aviyonik yerleşimini taşıyan ilk gövde. Analistlerin P0'a göre saydığı farklar aşağıda; TUSAŞ bunları resmî olarak listelemedi.",
            en: "The first production-representative prototype and the first airframe laid out for the sensors and avionics. Below are the differences from P0 that analysts point out; Turkish Aerospace has not listed them officially.",
        },
        facts: [
            { term: { tr: "İlk taksi", en: "First taxi" }, value: { tr: "31 Temmuz 2026", en: "31 July 2026" } },
            { term: { tr: "İlk uçuş", en: "First flight" }, value: { tr: "2026 sonu hedefi", en: "end-2026 target" } },
        ],
    },
    {
        id: "P2",
        status: "taxi",
        statusText: { tr: "Taksi testi yapıldı", en: "Taxi-tested" },
        finish: { tr: "Astar", en: "Primer" },
        body: {
            tr: "İkinci seri üretim temsilî prototip. Taksi testinden geçti; uçuş tarihi açıklanmadı.",
            en: "The second production-representative prototype. It has been taxi-tested; no flight date has been announced.",
        },
        facts: [{ term: { tr: "İlk gösterim", en: "First shown" }, value: { tr: "13 Şubat 2026", en: "13 February 2026" } }],
    },
];

/** P1 against P0, as reported by analysts from photographs. Not an official list. */
export const p1Changes: L<string[]> = {
    tr: [
        "Hava girişleri geriye alınmış ve büyütülmüş",
        "Orta gövde daha geniş",
        "Yatay stabilizeler ve radom yeniden şekillendirilmiş",
        "Panel kenarları testere dişli",
        "Kanopinin önünde KARAT IRST penceresi",
        "Burun altında TOYGUN kaplaması",
        "Ana iniş takımları daha alçak ve geniş",
        "Hava verisi probu sağ tarafa taşınmış",
    ],
    en: [
        "Intakes moved aft and enlarged",
        "Wider mid-fuselage",
        "Reshaped stabilators and radome",
        "Serrated panel edges",
        "KARAT IRST window ahead of the canopy",
        "TOYGUN fairing under the nose",
        "Lower, wider main landing gear",
        "Air-data probe moved to the right side",
    ],
};

/* ── Orders ───────────────────────────────────────────────────────────── */

export interface Order {
    id: string;
    figure: string;
    unit: L;
    customer: L;
    rows: { term: L; value: L }[];
}

export const orders: Order[] = [
    {
        id: "thk",
        figure: "20",
        unit: { tr: "Blok 10", en: "Block 10" },
        customer: { tr: "Türk Hava Kuvvetleri", en: "Turkish Air Force" },
        rows: [
            { term: { tr: "İmza", en: "Signed" }, value: { tr: "Mayıs 2026, SAHA", en: "May 2026, SAHA" } },
            { term: { tr: "Motor", en: "Engine" }, value: { tr: "GE F110", en: "GE F110" } },
        ],
    },
    {
        id: "indonesia",
        figure: "48",
        unit: { tr: "uçak", en: "aircraft" },
        customer: { tr: "Endonezya", en: "Indonesia" },
        rows: [
            { term: { tr: "İmza", en: "Signed" }, value: { tr: "26 Temmuz 2025, IDEF", en: "26 July 2025, IDEF" } },
            { term: { tr: "Teslimat", en: "Delivery" }, value: { tr: "120 ay içinde", en: "within 120 months" } },
            { term: { tr: "Bedel", en: "Value" }, value: { tr: "≈10 milyar $ (tahmin)", en: "≈US$10bn (estimate)" } },
        ],
    },
];

export const engineClearance: { figure: string; rows: { term: L; value: L }[]; title: L } = {
    figure: "10 + 80",
    title: { tr: "F110 ihracat izni, Temmuz 2026", en: "F110 export clearance, July 2026" },
    rows: [
        { term: { tr: "Prototipler", en: "Prototypes" }, value: { tr: "10 motor", en: "10 engines" } },
        { term: { tr: "Seri üretim", en: "Series" }, value: { tr: "80 motor", en: "80 engines" } },
    ],
};

/* ── Industry ─────────────────────────────────────────────────────────── */

export interface Share {
    company: string;
    work: L;
    basis: Basis;
}

/** Narrow on purpose: a company appears against a package only when a statement or mainstream defence press links them. */
export const shares: Share[] = [
    {
        company: "TUSAŞ",
        work: { tr: "Ana yüklenici: tasarım, gövde, sistem entegrasyonu, uçuş testleri.", en: "Prime: design, airframe, systems integration, flight test." },
        basis: "confirmed",
    },
    {
        company: "ASELSAN",
        work: {
            tr: "MURAD 600-A AESA radar ve Entegre RF Sistemi, TOYGUN 100 EOTS, KARAT 100 IRST, LIAS 300, IRIS 300, YILDIRIM 300 DIRCM, ICNI, TULGAR kask göstergesi, yedek uçuş göstergesi.",
            en: "MURAD 600-A AESA radar and Integrated RF System, TOYGUN 100 EOTS, KARAT 100 IRST, LIAS 300, IRIS 300, YILDIRIM 300 DIRCM, ICNI, TULGAR helmet display, standby flight display.",
        },
        basis: "confirmed",
    },
    {
        company: "TÜBİTAK BİLGEM",
        work: { tr: "Aviyonik bilgisayar; ilk uçuşta uçtu.", en: "Avionics computer; flew on the first flight." },
        basis: "confirmed",
    },
    {
        company: "Martin-Baker",
        work: { tr: "T18T fırlatma koltuğu (Mk18 ailesi), Paris 2025'te gösterildi.", en: "T18T ejection seat (Mk18 family), shown at Paris 2025." },
        basis: "confirmed",
    },
    {
        company: "GE Aerospace",
        work: { tr: "F110 motorları; prototipler ve ilk bloklar.", en: "F110 engines for the prototypes and first blocks." },
        basis: "confirmed",
    },
    {
        company: "TEI",
        work: { tr: "Yerli TF35000 turbofan; CDR Şubat 2026.", en: "Indigenous TF35000 turbofan; CDR February 2026." },
        basis: "confirmed",
    },
    {
        company: "STG Mühendislik",
        work: { tr: "LAD-208 geniş alan göstergesi.", en: "LAD-208 large area display." },
        basis: "reported",
    },
    {
        company: "HAVELSAN",
        work: { tr: "Gösterge grafik kütüphanesinin yerlileştirilmesi (Kasım 2026).", en: "Localised display graphics library (November 2026)." },
        basis: "reported",
    },
    {
        company: "ROKETSAN",
        work: { tr: "İç yuvaya uygun SOM-J seyir füzesi.", en: "SOM-J cruise missile sized for the internal bay." },
        basis: "reported",
    },
    {
        company: "TÜBİTAK SAGE",
        work: { tr: "GÖKDOĞAN ve BOZDOĞAN hava-hava füzeleri, entegrasyonu planlanıyor.", en: "GÖKDOĞAN and BOZDOĞAN air-to-air missiles, integration planned." },
        basis: "reported",
    },
];

/* ── Copy ─────────────────────────────────────────────────────────────── */

export const programmeCopy: L<{
    label: string;
    title: string;
    lede: string;
    protoTitle: string;
    finish: string;
    changesTitle: string;
    changesNote: string;
    filmCaption: string;
    filmCredit: string;
    timelineTitle: string;
    done: string;
    planned: string;
    now: string;
    ordersTitle: string;
    industryTitle: string;
    basis: Record<Basis, string>;
    source: string;
}> = {
    tr: {
        label: "Program",
        title: "Üç prototip, iki sipariş",
        lede: "P0 2024'te iki kez uçtu. Seri üretim standardına yakın P1 ve P2 taksi testinde; P1'in ilk uçuşu yıl sonuna hedefleniyor. Hava Kuvvetleri ve Endonezya'dan imzalı siparişler var.",
        protoTitle: "Prototipler",
        finish: "Yüzey",
        changesTitle: "P1'de P0'a göre farklar",
        changesNote: "Analist değerlendirmesi, fotoğraflardan; resmî değil.",
        filmCaption: "P0, 2024: fren paraşütüyle iniş",
        filmCredit: "TUSAŞ görüntüleri; kamuya açık paylaşımdan",
        timelineTitle: "Takvim",
        done: "gerçekleşti",
        planned: "planlanan",
        now: "Kasım 2026",
        ordersTitle: "Siparişler",
        industryTitle: "Kim ne yapıyor",
        basis: { confirmed: "açıklanan", reported: "bildirilen" },
        source: "Kaynak: TUSAŞ, SSB, ASELSAN, TEI ve TÜBİTAK açıklamaları; Anadolu Ajansı, Breaking Defense, Haber.Aero, Aviation Week, Janes, TURDEF ve SavunmaTR haberleri; Kasım 2026 itibarıyla. \"Bildirilen\" ve \"planlanan\" satırlar basın haberlerine ya da duyurulmuş hedeflere dayanır; hedef tarihler kayabilir.",
    },
    en: {
        label: "Programme",
        title: "Three prototypes, two orders",
        lede: "P0 flew twice in 2024. The production-representative P1 and P2 are in taxi trials; P1's first flight is targeted for the end of the year. There are signed orders from the Turkish Air Force and Indonesia.",
        protoTitle: "Prototypes",
        finish: "Finish",
        changesTitle: "P1 compared with P0",
        changesNote: "Analyst assessment from photographs; not official.",
        filmCaption: "P0, 2024: landing with the brake chute",
        filmCredit: "Turkish Aerospace footage; from a public share",
        timelineTitle: "Timeline",
        done: "happened",
        planned: "planned",
        now: "November 2026",
        ordersTitle: "Orders",
        industryTitle: "Who does what",
        basis: { confirmed: "announced", reported: "reported" },
        source: "Source: statements by Turkish Aerospace, SSB, ASELSAN, TEI and TÜBİTAK; reporting by Anadolu Agency, Breaking Defense, Haber.Aero, Aviation Week, Janes, TURDEF and SavunmaTR; as of November 2026. \"Reported\" and \"planned\" rows rest on press reports or announced targets; target dates can slip.",
    },
};
