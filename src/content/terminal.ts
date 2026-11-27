import type { Locale } from "@/context/LanguageContext";

/**
 * Copy for the home-page flight-test terminal (sections 01–04 and the leader-line labels).
 * First-flight facts (formerly home.ts) live here; other facts are reused from aircraft.ts, airframe.ts, sensors.ts, weapons.ts, cockpit.ts and mumt.ts.
 */

type L<T = string> = Record<Locale, T>;

/* ── Leader-line labels ─────────────────────────────────────────────────── */

export interface LeaderSpec {
    /** Anchor name written by the scene into terminal.anchors. */
    anchor: string;
    /** Short mono label (already uppercase). */
    label: string;
    /** Vertical offset of the elbow in px (negative = above the anchor). */
    dy: number;
    /** Force the label side; otherwise it points away from the screen centre. */
    side?: -1 | 1;
}

/** Index = terminal.section (0..4). */
export const leaderLabels: L<LeaderSpec[][]> = {
    tr: [
        [
            { anchor: "radar", label: "MURAD 600-A · AESA", dy: -44 },
            { anchor: "irst", label: "KARAT 100 · IRST", dy: -86 },
            { anchor: "nozzles", label: "2 × F110-GE-129", dy: 46 },
        ],
        [
            { anchor: "intake", label: "S-KANAL HAVA ALIĞI", dy: -52, side: 1 },
            { anchor: "bay", label: "İÇ SİLAH YUVASI · 8 İST. (BİLDİRİLEN)", dy: 56, side: 1 },
            { anchor: "eots", label: "TOYGUN 100 · EOTS (P1)", dy: 92, side: 1 },
        ],
        [{ anchor: "canopy", label: "TULGAR · 40°×32°", dy: -60 }],
        [
            { anchor: "anka1", label: "ANKA-3 · 01", dy: -40 },
            { anchor: "anka2", label: "ANKA-3 · 02", dy: 44 },
            { anchor: "kizilelma", label: "KIZILELMA · KONSEPT", dy: 48 },
        ],
        [],
    ],
    en: [
        [
            { anchor: "radar", label: "MURAD 600-A · AESA", dy: -44 },
            { anchor: "irst", label: "KARAT 100 · IRST", dy: -86 },
            { anchor: "nozzles", label: "2 × F110-GE-129", dy: 46 },
        ],
        [
            { anchor: "intake", label: "S-DUCT INTAKE", dy: -52, side: 1 },
            { anchor: "bay", label: "INTERNAL BAY · 8 STN (REPORTED)", dy: 56, side: 1 },
            { anchor: "eots", label: "TOYGUN 100 · EOTS (P1)", dy: 92, side: 1 },
        ],
        [{ anchor: "canopy", label: "TULGAR · 40°×32°", dy: -60 }],
        [
            { anchor: "anka1", label: "ANKA-3 · 01", dy: -40 },
            { anchor: "anka2", label: "ANKA-3 · 02", dy: 44 },
            { anchor: "kizilelma", label: "KIZILELMA · CONCEPT", dy: 48 },
        ],
        [],
    ],
};

/* ── 01 // First flight & air superiority ───────────────────────────────── */

export const s01Copy: L<{
    index: string;
    line: string;
    logTitle: string;
    log: { k: string; v: string }[];
    thrust: { k: string; v: string };
    open: string;
    close: string;
    logMore: string;
    logLess: string;
    feedLabel: string;
    caption: string;
    stillAlt: string;
}> = {
    tr: {
        index: "01 // İLK UÇUŞ & HAVA ÜSTÜNLÜĞÜ",
        line: "MMU · TUSAŞ · 5. NESİL",
        logTitle: "UÇUŞ KAYDI // P0 · 001",
        log: [
            { k: "TARİH / SAAT", v: "21.02.2024 08:50" },
            { k: "MEYDAN", v: "MÜRTED" },
            { k: "UÇAK", v: "P0" },
            { k: "PİLOT", v: "BARBAROS DEMİRBAŞ" },
            { k: "SÜRE", v: "~13 DK" },
            { k: "İRTİFA", v: "8.000 FT" },
            { k: "HIZ", v: "230 KT" },
            { k: "İNİŞ TAKIMI", v: "AÇIK" },
            { k: "ESKORT", v: "F-16D" },
        ],
        thrust: { k: "İTKİ", v: "2 × F110-GE-129 · 13.150 KGF / 29.000 LBF AY" },
        open: "P0 GÖRÜNTÜSÜ",
        close: "GÖRÜNTÜYÜ KAPAT",
        logMore: "TÜM KAYIT",
        logLess: "KISA KAYIT",
        feedLabel: "TUSAŞ P0 uçuş testi görüntüsü, termal kamera görünümüne benzetilmiş gri tonlu işlemle",
        caption: "TUSAŞ · P0 uçuş testi, 2024",
        stillAlt: "KAAN P0 uçuşta, takip uçağından çekilmiş gri tonlu kare (TUSAŞ, 2024)",
    },
    en: {
        index: "01 // FIRST FLIGHT & AIR SUPERIORITY",
        line: "MMU · TURKISH AEROSPACE · 5TH GEN",
        logTitle: "FLIGHT LOG // P0 · 001",
        log: [
            { k: "DATE / TIME", v: "21.02.2024 08:50" },
            { k: "FIELD", v: "MÜRTED" },
            { k: "AIRCRAFT", v: "P0" },
            { k: "PILOT", v: "BARBAROS DEMİRBAŞ" },
            { k: "DURATION", v: "~13 MIN" },
            { k: "ALTITUDE", v: "8,000 FT" },
            { k: "SPEED", v: "230 KT" },
            { k: "GEAR", v: "DN" },
            { k: "CHASE", v: "F-16D" },
        ],
        thrust: { k: "THRUST", v: "2 × F110-GE-129 · 13,150 KGF / 29,000 LBF AB" },
        open: "P0 FOOTAGE",
        close: "CLOSE FOOTAGE",
        logMore: "FULL LOG",
        logLess: "SHORT LOG",
        feedLabel: "Turkish Aerospace P0 flight-test footage, processed in grayscale to resemble a thermal camera view",
        caption: "Turkish Aerospace · P0 flight test, 2024",
        stillAlt: "KAAN P0 in flight seen from the chase aircraft, grayscale still (Turkish Aerospace, 2024)",
    },
};

/* ── 02 // Airframe & low observability ─────────────────────────────────── */

export const s02Copy: L<{
    index: string;
    title: string;
    paragraphs: string[];
    pinsTitle: string;
    pinsLink: string;
    pins: { name: string; sub: string; status: string }[];
    note: string;
}> = {
    tr: {
        index: "02 // GÖVDE & DÜŞÜK GÖRÜNÜRLÜK",
        title: "Yansımayı yöneten gövde",
        paragraphs: [
            "Kenarlar birkaç ortak açıda hizalanır; radar enerjisi az sayıda dar yöne toplanır, geri kalan her yöne düşük döner.",
            "S-kanal hava alığı kıvrılarak motor yüzünü dışarıdan gizler. Dönen fan kanatları güçlü bir radar yansımasıdır.",
            "Silahlar gövde içindeki yuvalarda taşınır. Yuva ölçüleri açıklanmadı; aşağıdaki durumlar basında yer aldığı hâliyle.",
        ],
        pinsTitle: "İŞARETLER // DURUM",
        pinsLink: "SENSÖR VE SİLAH LEVHASI → 05",
        pins: [
            { name: "GÖKDOĞAN", sub: "TÜBİTAK SAGE · GÖRÜŞ ÖTESİ HAVA-HAVA", status: "PLANLANAN · BASINDA" },
            { name: "BOZDOĞAN", sub: "TÜBİTAK SAGE · GÖRÜŞ İÇİ HAVA-HAVA", status: "PLANLANAN · BASINDA" },
            { name: "SOM-J", sub: "ROKETSAN · TÜBİTAK SAGE · İÇ YUVAYA GÖRE BOYUTLANDIRILDIĞI BİLDİRİLİYOR", status: "BİLDİRİLEN" },
            { name: "8 İÇ + 6 DIŞ İSTASYON", sub: "GERÇEK DÜZEN YAYIMLANMADI", status: "BİLDİRİLEN" },
            { name: "TESTERE DİŞLİ PANEL KENARLARI", sub: "P1 FOTOĞRAFLARINDA BELİRGİN", status: "ANALİST GÖZLEMİ" },
            { name: "KARAT 100 / TOYGUN 100", sub: "KANOPİ ÖNÜ IRST · BURUN ALTI EOTS", status: "P1'DE GÖRÜLDÜ" },
        ],
        note: "Kaynak: TUSAŞ özellik listesi; TÜBİTAK SAGE, Roketsan ve ASELSAN; istasyon sayısı için Wikipedia ve savunma basını. KAAN'ın hava alıkları DSI olarak belgelenmemiştir.",
    },
    en: {
        index: "02 // AIRFRAME & LOW OBSERVABILITY",
        title: "A body that steers the return",
        paragraphs: [
            "Edges are aligned to a few shared angles, so radar energy is gathered into a few narrow directions and stays low everywhere else.",
            "The S-duct intake curves to hide the engine face from outside. Spinning fan blades are a strong radar reflector.",
            "Weapons ride in internal bays. Bay dimensions are unpublished; the status below is as reported.",
        ],
        pinsTitle: "MARKERS // STATUS",
        pinsLink: "SENSOR AND WEAPON PLATE → 05",
        pins: [
            { name: "GÖKDOĞAN", sub: "TÜBİTAK SAGE · BEYOND-VISUAL-RANGE AAM", status: "PLANNED · REPORTED" },
            { name: "BOZDOĞAN", sub: "TÜBİTAK SAGE · WITHIN-VISUAL-RANGE AAM", status: "PLANNED · REPORTED" },
            { name: "SOM-J", sub: "ROKETSAN · TÜBİTAK SAGE · REPORTED SIZED FOR THE BAY", status: "REPORTED" },
            { name: "8 INTERNAL + 6 EXTERNAL STATIONS", sub: "REAL LAYOUT NOT PUBLISHED", status: "REPORTED" },
            { name: "SERRATED PANEL EDGES", sub: "PRONOUNCED IN P1 PHOTOGRAPHS", status: "ANALYSTS" },
            { name: "KARAT 100 / TOYGUN 100", sub: "IRST AHEAD OF CANOPY · EOTS UNDER NOSE", status: "SEEN ON P1" },
        ],
        note: "Source: TUSAŞ feature list; TÜBİTAK SAGE, Roketsan and ASELSAN; Wikipedia and defence press for the station count. KAAN's intakes are not documented as DSI.",
    },
};

/* ── 03 // Cockpit & avionics ───────────────────────────────────────────── */

export type LadPage = "TSD" | "RDR" | "SMS" | "ENG" | "FUEL" | "FCS";
export const LAD_PAGES: LadPage[] = ["TSD", "RDR", "SMS", "ENG", "FUEL", "FCS"];

export const s03Copy: L<{
    index: string;
    title: string;
    pagesLabel: string;
    ring: string;
    lock: string;
    warn: string;
    tulgar: string;
    honest: string;
    svgLabel: string;
    pageNames: Record<LadPage, string>;
}> = {
    tr: {
        index: "03 // KOKPİT & AVİYONİK",
        title: "Tek pilot, tek cam",
        pagesLabel: "LAD sayfaları",
        ring: "TEMSİLİ MENZİL HALKASI",
        lock: "KİLİT // HASIM",
        warn: "UYARI // STT KİLİT",
        tulgar: "TULGAR kask göstergesi (ASELSAN): renkli vizör, 40°×32° görüş alanı. Ekran donanımının STG LAD-208 olduğu bildiriliyor.",
        honest: "KAAN'ın gerçek ekran sayfaları yayımlanmadı. Bu görünüm, MIL-STD-2525 iz çerçeveleriyle çizilmiş temsili bir yorumdur.",
        svgLabel: "Temsili geniş ekran görünümü: yunuslama merdiveni, temsili menzil halkası, dost, hasım ve bilinmeyen izler, bir hasım izde kilit.",
        pageNames: { TSD: "Taktik durum", RDR: "Radar", SMS: "Mühimmat", ENG: "Motor", FUEL: "Yakıt", FCS: "Uçuş kontrol" },
    },
    en: {
        index: "03 // COCKPIT & AVIONICS",
        title: "One pilot, one glass",
        pagesLabel: "LAD pages",
        ring: "NOTIONAL RANGE RING",
        lock: "LOCK // HOSTILE",
        warn: "WARN // STT LOCK",
        tulgar: "TULGAR helmet display (ASELSAN): colour visor, 40°×32° field of view. The display hardware is reported as STG LAD-208.",
        honest: "KAAN's real display pages are unpublished. This view is a representative interpretation drawn with MIL-STD-2525 track frames.",
        svgLabel: "Representative wide-area display: pitch ladder, notional range ring, friendly, hostile and unknown tracks, lock on one hostile track.",
        pageNames: { TSD: "Tactical situation", RDR: "Radar", SMS: "Stores", ENG: "Engines", FUEL: "Fuel", FCS: "Flight controls" },
    },
};

/* ── 04 // MUM-T & UAV network ──────────────────────────────────────────── */

export type NodeId = "kaanNode" | "anka1" | "anka2" | "kizilelma";
export type ProfileId = "kaan" | "anka" | "kizilelma";
export const NODE_PROFILE: Record<NodeId, ProfileId> = { kaanNode: "kaan", anka1: "anka", anka2: "anka", kizilelma: "kizilelma" };

export const s04Copy: L<{
    index: string;
    title: string;
    lede: string;
    nodesLabel: string;
    nodes: Record<NodeId, string>;
    open: string;
    close: string;
    phases: string[];
    ring: string;
    profiles: Record<ProfileId, { name: string; role: string; tag?: string; rows: { k: string; v: string }[]; source: string }>;
    link: string;
}> = {
    tr: {
        index: "04 // MUM-T & İHA AĞI",
        title: "Bir pilot, bir ekip",
        lede: "KAAN'daki pilot görev komutanıdır: insansız uçaklara hedef ve rota verir, onların sensör verisini kendi ekranında görür.",
        nodesLabel: "AĞ DÜĞÜMLERİ",
        nodes: { kaanNode: "KAAN", anka1: "ANKA-3 · 01", anka2: "ANKA-3 · 02", kizilelma: "KIZILELMA" },
        open: "görev profilini aç",
        close: "Kapat",
        phases: ["KALKIŞ", "BULUŞMA", "İLERİ", "TAARRUZ", "DÖNÜŞ"],
        ring: "TEMSİLİ SAVUNMA HALKASI",
        profiles: {
            kaan: {
                name: "KAAN",
                role: "GÖREV KOMUTANI · İNSANLI",
                rows: [
                    { k: "MÜRETTEBAT", v: "1 PİLOT" },
                    { k: "AZAMİ KALKIŞ", v: "34.750 KG" },
                    { k: "AZAMİ HIZ", v: "MACH 1,8 @ 40.000 FT (TASARIM)" },
                    { k: "TAVAN", v: "55.000 FT (TASARIM)" },
                    { k: "ROL", v: "HALKA DIŞINDA KALIR, ATIŞ İZNİNİ VERİR" },
                ],
                source: "TUSAŞ resmî teknik verileri",
            },
            anka: {
                name: "ANKA-3",
                role: "İNSANSIZ MUHARİP UÇAK · TUSAŞ",
                rows: [
                    { k: "AZAMİ KALKIŞ", v: "7.250 KG" },
                    { k: "FAYDALI YÜK", v: "1.700 KG" },
                    { k: "AZAMİ HIZ", v: "MACH 0,7 @ 30.000 FT" },
                    { k: "TAVAN", v: "40.000 FT" },
                    { k: "YARIÇAP", v: "1.075 KM H-H · 750 KM H-Y" },
                    { k: "HAVADA KALIŞ", v: "~10 SAAT" },
                ],
                source: "TUSAŞ ANKA-3 ürün sayfası; KAAN ile ekip kavramı TUSAŞ'ındır (WDS 2026)",
            },
            kizilelma: {
                name: "KIZILELMA",
                role: "BAYKAR · İNSANSIZ MUHARİP UÇAK",
                tag: "konsept — KAAN ile entegrasyonu resmi olarak açıklanmadı",
                rows: [
                    { k: "ÜRETİCİ", v: "BAYKAR" },
                    { k: "KAAN BAĞLANTISI", v: "AÇIKLANMADI" },
                    { k: "BU ŞEMADA", v: "KONSEPT DÜĞÜM" },
                ],
                source: "Bu sitenin kavramsal gösterimi",
            },
        },
        link: "/MUM-T // TAM ANALİZ",
    },
    en: {
        index: "04 // MUM-T & UAV NETWORK",
        title: "One pilot, one team",
        lede: "The pilot in KAAN is a mission commander: giving uncrewed aircraft a target and a route, and seeing their sensor data on the main display.",
        nodesLabel: "NETWORK NODES",
        nodes: { kaanNode: "KAAN", anka1: "ANKA-3 · 01", anka2: "ANKA-3 · 02", kizilelma: "KIZILELMA" },
        open: "open mission profile",
        close: "Close",
        phases: ["TAKE-OFF", "RENDEZVOUS", "PUSH", "STRIKE", "RETURN"],
        ring: "NOTIONAL DEFENCE RING",
        profiles: {
            kaan: {
                name: "KAAN",
                role: "MISSION COMMANDER · CREWED",
                rows: [
                    { k: "CREW", v: "1 PILOT" },
                    { k: "MTOW", v: "34,750 KG" },
                    { k: "MAX SPEED", v: "MACH 1.8 @ 40,000 FT (DESIGN)" },
                    { k: "CEILING", v: "55,000 FT (DESIGN)" },
                    { k: "ROLE", v: "STAYS OUTSIDE THE RING, CLEARS RELEASE" },
                ],
                source: "Turkish Aerospace official specifications",
            },
            anka: {
                name: "ANKA-3",
                role: "UNCREWED COMBAT AIRCRAFT · TURKISH AEROSPACE",
                rows: [
                    { k: "MTOW", v: "7,250 KG" },
                    { k: "PAYLOAD", v: "1,700 KG" },
                    { k: "MAX SPEED", v: "MACH 0.7 @ 30,000 FT" },
                    { k: "CEILING", v: "40,000 FT" },
                    { k: "RADIUS", v: "1,075 KM A-A · 750 KM A-G" },
                    { k: "ENDURANCE", v: "~10 H" },
                ],
                source: "Turkish Aerospace ANKA-3 product page; teaming with KAAN is Turkish Aerospace's own concept (WDS 2026)",
            },
            kizilelma: {
                name: "KIZILELMA",
                role: "BAYKAR · UNCREWED COMBAT AIRCRAFT",
                tag: "concept — integration with KAAN has not been officially announced",
                rows: [
                    { k: "MAKER", v: "BAYKAR" },
                    { k: "KAAN LINK", v: "NOT ANNOUNCED" },
                    { k: "IN THIS DIAGRAM", v: "CONCEPT NODE" },
                ],
                source: "This site's conceptual depiction",
            },
        },
        link: "/MUM-T // FULL ANALYSIS",
    },
};

/** The monument word behind the aircraft in each pinned section. */
export const monuments: L<string[]> = {
    tr: ["KAAN", "GÖVDE", "KOKPİT", "MUM-T"],
    en: ["KAAN", "AIRFRAME", "COCKPIT", "MUM-T"],
};
