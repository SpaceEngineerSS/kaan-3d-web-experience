import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

/** "confirmed": stated by the company or the procurement agency. "reported": press reports or announced plans. */
export type Attribution = "confirmed" | "reported";

export interface WorkShare {
    company: string;
    work: L;
    status: Attribution;
}

/**
 * Who builds what. Kept deliberately narrow: a company is listed against a work package only when that link
 * appears in company statements or in mainstream defence press. Integration of a given weapon on KAAN is
 * always "reported" until it has been test-fired from the aircraft.
 */
export const workShare: WorkShare[] = [
    {
        company: "TUSAŞ",
        work: {
            tr: "Ana yüklenici. Tasarım, gövde üretimi, sistem entegrasyonu ve uçuş testleri.",
            en: "Prime contractor. Design, airframe manufacture, systems integration and flight testing.",
        },
        status: "confirmed",
    },
    {
        company: "ASELSAN",
        work: {
            tr: "MURAD AESA radar ve TULGAR kask tipi görüntüleme sistemi.",
            en: "MURAD AESA radar and the TULGAR helmet-mounted display.",
        },
        status: "confirmed",
    },
    {
        company: "ASELSAN",
        work: {
            tr: "Elektronik harp süiti, elektro-optik hedefleme ve kızılötesi arama-izleme sensörleri, kokpit ekranları.",
            en: "Electronic-warfare suite, electro-optical targeting and infrared search-and-track sensors, cockpit displays.",
        },
        status: "reported",
    },
    {
        company: "GE Aerospace",
        work: {
            tr: "F110-GE-129 motorları; P0 prototipi ve ilk seri üretim blokları için.",
            en: "F110-GE-129 engines, for the P0 prototype and the first production blocks.",
        },
        status: "confirmed",
    },
    {
        company: "TEI",
        work: {
            tr: "Yerli TF35000 turbofan motorunun geliştirilmesi.",
            en: "Development of the indigenous TF35000 turbofan.",
        },
        status: "confirmed",
    },
    {
        company: "TÜBİTAK SAGE",
        work: {
            tr: "GÖKDOĞAN ve BOZDOĞAN hava-hava füzeleri; KAAN entegrasyonu planlanıyor.",
            en: "GÖKDOĞAN and BOZDOĞAN air-to-air missiles; integration on KAAN is planned.",
        },
        status: "reported",
    },
    {
        company: "ROKETSAN",
        work: {
            tr: "SOM-J seyir füzesi gibi iç silah yuvasına uygun havadan atılan mühimmat.",
            en: "Air-launched munitions sized for the internal bays, such as the SOM-J cruise missile.",
        },
        status: "reported",
    },
    {
        company: "HAVELSAN",
        work: {
            tr: "Simülatörler, eğitim sistemleri ve görev yazılımı katkıları.",
            en: "Simulators, training systems and mission-software contributions.",
        },
        status: "reported",
    },
    {
        company: "BAE Systems",
        work: {
            tr: "Erken tasarım aşamasında mühendislik desteği (2017 anlaşması).",
            en: "Engineering support during the early design phase (2017 agreement).",
        },
        status: "reported",
    },
];

export interface PlanRow {
    term: L;
    when: L;
    detail: L;
    planned: boolean;
}

export const production: PlanRow[] = [
    {
        term: { tr: "Blok 10", en: "Block 10" },
        when: { tr: "≈2028 hedefi", en: "≈2028 target" },
        detail: {
            tr: "İlk seri üretim partisi, GE F110 motorlu. Türk Hava Kuvvetleri'ne teslimat hedefleniyor.",
            en: "First production batch, with GE F110 engines. Deliveries to the Turkish Air Force are targeted.",
        },
        planned: true,
    },
    {
        term: { tr: "Sonraki bloklar", en: "Later blocks" },
        when: { tr: "2030'ların başı hedefi", en: "early-2030s target" },
        detail: {
            tr: "Daha fazla yerli alt sistem ve TEI TF35000 motoruna geçiş planlanıyor. Adet ve takvim açıklanmış değil.",
            en: "More domestic subsystems and a switch to the TEI TF35000 engine are planned. Quantities and dates have not been published.",
        },
        planned: true,
    },
];

export const exportDeal: { rows: { term: L; value: L }[]; note: L } = {
    rows: [
        { term: { tr: "Alıcı", en: "Customer" }, value: { tr: "Endonezya Savunma Bakanlığı", en: "Indonesian Ministry of Defence" } },
        { term: { tr: "Adet", en: "Quantity" }, value: { tr: "48 uçak", en: "48 aircraft" } },
        { term: { tr: "İmza", en: "Signed" }, value: { tr: "Temmuz 2025, IDEF fuarı, İstanbul", en: "July 2025, IDEF exhibition, Istanbul" } },
        { term: { tr: "Durum", en: "Status" }, value: { tr: "Sözleşme imzalandı; KAAN'ın ilk ihracatı", en: "Contract signed; KAAN's first export" } },
    ],
    note: {
        tr: "Sözleşme bedeli ve teslimat takvimi için kaynaklarda farklı rakamlar geçiyor; burada verilmedi. Başka ülkelerin ilgisine dair haberler var, ancak derlenen kaynaklarda imzalı ikinci bir sözleşme yok.",
        en: "Sources give differing figures for the contract value and delivery schedule, so none are given here. Other countries have been reported as interested, but the sources compiled here show no second signed contract.",
    },
};

export const industryCopy: L<{
    label: string;
    title: string;
    lede: string;
    workTitle: string;
    colCompany: string;
    colWork: string;
    colStatus: string;
    status: Record<Attribution, string>;
    planTitle: string;
    exportTitle: string;
    plannedLabel: string;
    source: string;
}> = {
    tr: {
        label: "Sanayi",
        title: "Kim ne üretiyor",
        lede: "KAAN'ı TUSAŞ tasarlıyor ve topluyor; radar, motor ve mühimmat gibi ana alt sistemler başka Türk savunma şirketlerinden geliyor. Aşağıdaki liste yalnızca kaynağı olan iş paylarını içeriyor.",
        workTitle: "İş payları",
        colCompany: "Şirket",
        colWork: "İş payı",
        colStatus: "Dayanak",
        status: { confirmed: "açıklanan", reported: "bildirilen" },
        planTitle: "Üretim planı",
        exportTitle: "İhracat: Endonezya",
        plannedLabel: "planlanan",
        source: "Kaynak: TUSAŞ ve ilgili şirketlerin açıklamaları, SSB, Defense News ve Breaking Defense haberleri, Kasım 2026 itibarıyla. \"Bildirilen\" satırlar basın haberlerine ve duyurulmuş planlara dayanır.",
    },
    en: {
        label: "Industry",
        title: "Who builds what",
        lede: "Turkish Aerospace designs and assembles KAAN; the main subsystems, such as radar, engine and weapons, come from other Turkish defence companies. The list below only includes work shares that have a source.",
        workTitle: "Work shares",
        colCompany: "Company",
        colWork: "Work share",
        colStatus: "Basis",
        status: { confirmed: "announced", reported: "reported" },
        planTitle: "Production plan",
        exportTitle: "Export: Indonesia",
        plannedLabel: "planned",
        source: "Source: statements by Turkish Aerospace and the companies listed, SSB, Defense News and Breaking Defense reporting, as of November 2026. \"Reported\" rows rest on press reports and announced plans.",
    },
};
