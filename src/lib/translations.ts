import type { Locale } from "@/context/LanguageContext";

interface NavLink {
    label: string;
    href: string;
}

interface Phase {
    id: string;
    tag: string;
    title: string;
    subtitle: string;
    description: string;
    coordinates: string;
    status: string;
    icon: "target" | "crosshair";
}

interface SpecLabel {
    label: string;
    unit: string;
}

interface FooterTranslations {
    description: Record<Locale, string>;
    navTitle: Record<Locale, string>;
    navLinks: Record<Locale, string[]>;
    devTitle: Record<Locale, string>;
    copyright: Record<Locale, string>;
    madeWith: Record<Locale, string>;
}

interface DisclaimerTranslation {
    headline: string;
    tag: string;
    body: string;
    rights: string;
    button: string;
    fair: string;
}

interface TechCard {
    icon: string;
    tag: string;
    title: string;
    description: string;
    details: string[];
}

interface Milestone {
    year: string;
    title: string;
    description: string;
}

const nav: Record<Locale, NavLink[]> = {
    tr: [
        { label: "ANA SAYFA", href: "#hero" },
        { label: "GENEL BAKIŞ", href: "#overview" },
        { label: "ÖZELLİKLER", href: "#specs" },
        { label: "TEKNOLOJİ", href: "#technology" },
        { label: "SİSTEMLER", href: "#systems" },
    ],
    en: [
        { label: "HOME", href: "#hero" },
        { label: "OVERVIEW", href: "#overview" },
        { label: "SPECS", href: "#specs" },
        { label: "TECHNOLOGY", href: "#technology" },
        { label: "SYSTEMS", href: "#systems" },
    ],
};

const phases: Record<Locale, Phase[]> = {
    tr: [
        {
            id: "hero",
            tag: "SİSTEM HAZIR",
            title: "KAAN",
            subtitle: "GÖKLERİN HAKİMİ",
            description:
                "Türk Havacılık ve Uzay Sanayii (TUSAŞ) tarafından geliştirilen, 5. nesil çok rollü hava üstünlüğü muharip uçağı. Düşük gözlemlenebilirlik, süperseyir yeteneği, gelişmiş aviyonik ve sensör füzyonu ile donatılmıştır. İlk uçuşunu 21 Şubat 2024 tarihinde gerçekleştirmiştir.",
            coordinates: "39°55'N 32°51'E // ANKARA",
            status: "AKTİF",
            icon: "target",
        },
        {
            id: "overview",
            tag: "DÜŞÜK GÖZLEMLENEBİLİRLİK",
            title: "HAYALET",
            subtitle: "MODU",
            description:
                "Empedans eşleştirmeli radar soğurucu malzeme (RAM) katmanları, yıkıcı girişim teknolojisi ve elektroaktif polimer tabanlı adaptif yüzeyler kullanır. S-şekilli motor hava kanalları infrared ve radar izini minimize eder. Dahili silah yuvaları ve X-bandı frekans seçici yüzeyler (FSS) ile radar kesit alanı 0.01 m² altına indirilir.",
            coordinates: "RKA DEĞERİ: <0.01 m²",
            status: "GİZLİ",
            icon: "crosshair",
        },
        {
            id: "systems",
            tag: "AVİYONİK SİSTEMLER",
            title: "SENSÖR",
            subtitle: "FÜZYONU",
            description:
                "Entegre Modüler Aviyonik (IMA) platformu üzerinde çalışan AESA radar, Dağıtık Açıklık Sistemi (DAS) kızılötesi sensörleri, gelişmiş elektronik harp (EH) süiti ve makine öğrenimi tabanlı RKA kümeleme algoritmaları ile donatılmıştır. Tüm sensör verileri yapay zeka destekli füzyon motorunda birleştirilerek pilota benzersiz durumsal farkındalık sağlar.",
            coordinates: "AESA | DAS | EH | IMA | ML",
            status: "BAĞLI",
            icon: "target",
        },
    ],
    en: [
        {
            id: "hero",
            tag: "SYS.READY",
            title: "KAAN",
            subtitle: "DOMINATE THE SKIES",
            description:
                "A 5th generation multi-role air superiority fighter aircraft developed by Turkish Aerospace Industries (TUSAŞ). Equipped with low observability, supercruise capability, advanced avionics, and sensor fusion. Completed its maiden flight on February 21, 2024.",
            coordinates: "39°55'N 32°51'E // ANKARA",
            status: "ACTIVE",
            icon: "target",
        },
        {
            id: "overview",
            tag: "LOW OBSERVABILITY",
            title: "GHOST",
            subtitle: "MODE",
            description:
                "Utilizes impedance-matched Radar Absorbing Material (RAM) layers, destructive interference technology, and electroactive polymer-based adaptive surfaces. S-shaped engine air ducts minimize infrared and radar signatures. Internal weapons bays and X-band Frequency Selective Surfaces (FSS) reduce radar cross-section below 0.01 m².",
            coordinates: "RCS VALUE: <0.01 m²",
            status: "STEALTH",
            icon: "crosshair",
        },
        {
            id: "systems",
            tag: "AVIONICS SYSTEMS",
            title: "SENSOR",
            subtitle: "FUSION",
            description:
                "Powered by an Integrated Modular Avionics (IMA) platform running AESA radar, Distributed Aperture System (DAS) infrared sensors, advanced Electronic Warfare (EW) suite, and machine learning-based RCS clustering algorithms. All sensor data is fused through an AI-driven engine to provide the pilot with unprecedented situational awareness.",
            coordinates: "AESA | DAS | EW | IMA | ML",
            status: "LINKED",
            icon: "target",
        },
    ],
};

const scrollHint: Record<Locale, string> = {
    tr: "BAŞLATMAK İÇİN KAYDIR",
    en: "SCROLL TO ENGAGE",
};

const specItems: Record<Locale, SpecLabel[]> = {
    tr: [
        { label: "MAKSİMUM HIZ", unit: "MACH" },
        { label: "SERVİS TAVANI", unit: "FT" },
        { label: "MUHAREBE MENZİLİ", unit: "NM" },
        { label: "MAKSİMUM KALKIŞ AĞIRLIĞI", unit: "KG" },
        { label: "İTKİ / MOTOR", unit: "LBF" },
        { label: "KANAT AÇIKLIĞI", unit: "M" },
    ],
    en: [
        { label: "MAX SPEED", unit: "MACH" },
        { label: "SERVICE CEILING", unit: "FT" },
        { label: "COMBAT RANGE", unit: "NM" },
        { label: "MTOW", unit: "KG" },
        { label: "THRUST / ENGINE", unit: "LBF" },
        { label: "WINGSPAN", unit: "M" },
    ],
};

const specSection = {
    sectionTag: { tr: "Teknik Özellikler", en: "Technical Specifications" } as Record<Locale, string>,
    sectionTitle: { tr: "PERFORMANS", en: "PERFORMANCE" } as Record<Locale, string>,
    sectionTitleAccent: { tr: "VERİLERİ", en: "DATA" } as Record<Locale, string>,
};

const footer: FooterTranslations = {
    description: {
        tr: "Türkiye'nin 5. nesil gizli muharip uçağı. Türk Havacılık ve Uzay Sanayii (TAI/TUSAŞ) tarafından tasarlanıp üretilmektedir.",
        en: "Türkiye's 5th generation stealth fighter aircraft. Designed and manufactured by Turkish Aerospace Industries (TAI/TUSAŞ).",
    },
    navTitle: { tr: "Navigasyon", en: "Navigation" },
    navLinks: {
        tr: ["Ana Sayfa", "Genel Bakış", "Özellikler", "Teknoloji", "Sistemler"],
        en: ["Home", "Overview", "Specs", "Technology", "Systems"],
    },
    devTitle: { tr: "Geliştirici", en: "Developer" },
    copyright: {
        tr: "© 2026 KAAN Deneyimi. Tüm hakları saklıdır.",
        en: "© 2026 KAAN Experience. All rights reserved.",
    },
    madeWith: {
        tr: "tarafından geliştirildi",
        en: "Developed by",
    },
};

const disclaimer: Record<Locale, DisclaimerTranslation> = {
    tr: {
        headline: "DİKKAT: RESMİ SİTE DEĞİLDİR",
        tag: "YASAL BİLDİRİM",
        body: "Bu proje, Mehmet Gümüş tarafından geliştirilen, eğitim ve portfolyo amaçlı, kâr amacı gütmeyen bir Konsept Tasarım (Fan Art) çalışmasıdır. TUSAŞ (Türk Havacılık ve Uzay Sanayii) ile resmi bir bağı yoktur.",
        rights: "Tüm ticari haklar ve marka tescilleri ilgili kurumlara aittir.",
        button: "SİTEYE GİRİŞ (KONSEPT)",
        fair: "PORTFOLYO PROJESİ // TİCARİ AMAÇ GÜDÜLMEMEKTEDİR",
    },
    en: {
        headline: "WARNING: NOT AN OFFICIAL SITE",
        tag: "LEGAL NOTICE",
        body: "This project is a non-commercial Concept Design (Fan Art) developed by Mehmet Gümüş for educational and portfolio purposes. It has no official affiliation with TUSAŞ (Turkish Aerospace Industries).",
        rights: "All trademarks and brand registrations belong to their respective owners.",
        button: "ENTER SITE (CONCEPT)",
        fair: "PORTFOLIO PROJECT // NON-COMMERCIAL",
    },
};

const navBadge: Record<Locale, string> = {
    tr: "KONSEPT",
    en: "FAN PROJECT",
};

const footerLegal: Record<Locale, string> = {
    tr: "KAAN ismi ve tasarımları TUSAŞ'ın tescilli markasıdır. Bu web sitesi yalnızca WebGL ve Next.js yeteneklerini sergilemek amacıyla yapılmış bir hayran çalışmasıdır (Fair Use).",
    en: "The KAAN name and designs are registered trademarks of TUSAŞ. This website is a fan-made project solely created to showcase WebGL and Next.js capabilities (Fair Use).",
};

const video: Record<Locale, { sectionTag: string; title: string; titleAccent: string; caption: string; playLabel: string; classification: string }> = {
    tr: {
        sectionTag: "GÖREV KAYITLARI",
        title: "UÇUŞ",
        titleAccent: "GÖRÜNTÜLERİ",
        caption: "İLK UÇUŞ VE MANEVRA TESTLERİ",
        playLabel: "KAYDINI OYNAT",
        classification: "GİZLİLİK DERECESİ: KALDIRILDI",
    },
    en: {
        sectionTag: "MISSION RECORDS",
        title: "FLIGHT",
        titleAccent: "FOOTAGE",
        caption: "FIRST FLIGHT AND MANEUVER TESTS",
        playLabel: "PLAY RECORD",
        classification: "CLASSIFICATION: DECLASSIFIED",
    },
};

const gallery: Record<Locale, { sectionTag: string; title: string; titleAccent: string }> = {
    tr: {
        sectionTag: "GÖRÜNTÜ ARŞİVİ",
        title: "FOTOĞRAF",
        titleAccent: "GALERİSİ",
    },
    en: {
        sectionTag: "IMAGE ARCHIVE",
        title: "PHOTO",
        titleAccent: "GALLERY",
    },
};

const techSection: Record<Locale, { sectionTag: string; title: string; titleAccent: string }> = {
    tr: {
        sectionTag: "MÜHENDİSLİK DETAYLARI",
        title: "TEKNOLOJİ",
        titleAccent: "ALTYAPISI",
    },
    en: {
        sectionTag: "ENGINEERING DETAILS",
        title: "TECHNOLOGY",
        titleAccent: "FRAMEWORK",
    },
};

const techCards: Record<Locale, TechCard[]> = {
    tr: [
        {
            icon: "◇",
            tag: "GİZLİLİK",
            title: "Düşük Gözlemlenebilirlik",
            description: "Çok katmanlı gizlilik teknolojisi ile radar, kızılötesi ve görsel izleri minimize eder.",
            details: [
                "Empedans eşleştirmeli RAM katmanları ile gelen radar dalgaları etkin biçimde soğurulur",
                "S-şekilli motor kanalları, türbin yüzeylerini radardan tamamen gizler",
                "X-bandı Frekans Seçici Yüzeyler (FSS) belirli frekanslarda seçici filtreleme yapar",
                "Elektroaktif polimer ve grafen film tabanlı adaptif yüzey teknolojisi",
                "Dahili silah yuvaları, mühimmat yükünü gövde içinde taşıyarak RKA'yı azaltır",
                "Anizotropik iletkenlikli kompozit yapı ile yönlü radar soğurma",
            ],
        },
        {
            icon: "◈",
            tag: "AVİYONİK",
            title: "Entegre Modüler Aviyonik",
            description: "IMA platformu üzerinde çalışan sensör ağı, tüm verileri tek bir birleşik görüntüde sunar.",
            details: [
                "AESA (Aktif Elektronik Taramalı Dizi) radar — eşzamanlı çoklu hedef takibi",
                "DAS (Dağıtık Açıklık Sistemi) — 360° küresel kızılötesi kapsama",
                "Gelişmiş Elektronik Harp süiti — aktif ve pasif karıştırma",
                "Makine öğrenimi tabanlı RKA kümeleme algoritmaları",
                "Yapay zeka destekli sensör füzyonu — kapsamlı savaş alanı durumsal farkındalığı",
                "Model tabanlı IMA platform geliştirme ve sertifikasyon ekosistemi",
            ],
        },
        {
            icon: "▲",
            tag: "İTKİ",
            title: "Güç Ünitesi ve Performans",
            description: "Çift motorlu konfigürasyon ile süperseyir ve yüksek manevra kabiliyeti sağlar.",
            details: [
                "Çift turbofan motor (GE F110-GE-129) — motor başına 29,000+ lbf itki kapasitesi",
                "Afterburner olmadan süpersonik seyir (süperseyir) yeteneği",
                "Mach 1.8+ maksimum hız, 55,000 ft servis tavanı",
                "600+ NM muharebe menzili, hava yakıt ikmali ile artırılabilir",
                "Yüksek itki-ağırlık oranı ile üstün manevra kabiliyeti",
                "Dijital motor kontrol sistemi (FADEC) ile optimum yakıt verimliliği",
            ],
        },
        {
            icon: "◆",
            tag: "YAPI",
            title: "Yapısal Mühendislik",
            description: "İleri kompozit malzeme ve koruma sistemleri ile dayanıklılık ve hafiflik bir arada.",
            details: [
                "Karbon fiber takviyeli polimer (CFRP) kompozit gövde yapısı",
                "MXene tabanlı geçiş metali alaşım katmanları ile yıldırım koruma",
                "Gelişmiş kanopi mekanizması — patlayıcı ayrılma ve kuş çarpması dayanımı",
                "Dahili silah istasyonu entegrasyonu — 6+ hardpoint kapasitesi",
                "~21 metre uzunluk, ~14 metre kanat açıklığı, ~27,000 kg MTOW",
                "9G manevra yükü dayanımı ile yapısal bütünlük",
            ],
        },
    ],
    en: [
        {
            icon: "◇",
            tag: "STEALTH",
            title: "Low Observability",
            description: "Multi-layered stealth technology minimizes radar, infrared, and visual signatures.",
            details: [
                "Impedance-matched RAM layers effectively absorb incoming radar waves",
                "S-shaped engine ducts completely conceal turbine surfaces from radar",
                "X-band Frequency Selective Surfaces (FSS) for targeted frequency filtering",
                "Electroactive polymer and graphene film-based adaptive surface technology",
                "Internal weapons bays house ordnance within the fuselage, reducing RCS",
                "Anisotropic conductivity composite structure for directional radar absorption",
            ],
        },
        {
            icon: "◈",
            tag: "AVIONICS",
            title: "Integrated Modular Avionics",
            description: "Sensor network running on IMA platform presents all data in a unified display.",
            details: [
                "AESA (Active Electronically Scanned Array) radar — simultaneous multi-target tracking",
                "DAS (Distributed Aperture System) — 360° spherical infrared coverage",
                "Advanced Electronic Warfare suite — active and passive jamming",
                "Machine learning-based RCS clustering algorithms",
                "AI-driven sensor fusion — comprehensive battlefield situational awareness",
                "Model-based IMA platform development and certification ecosystem",
            ],
        },
        {
            icon: "▲",
            tag: "PROPULSION",
            title: "Powerplant & Performance",
            description: "Twin-engine configuration delivers supercruise and high maneuverability.",
            details: [
                "Twin turbofan engines (GE F110-GE-129) — 29,000+ lbf thrust per engine",
                "Supersonic cruise without afterburner (supercruise) capability",
                "Mach 1.8+ top speed, 55,000 ft service ceiling",
                "600+ NM combat range, extendable with aerial refueling",
                "High thrust-to-weight ratio for superior maneuverability",
                "Full Authority Digital Engine Control (FADEC) for optimal fuel efficiency",
            ],
        },
        {
            icon: "◆",
            tag: "STRUCTURE",
            title: "Structural Engineering",
            description: "Advanced composite materials and protection systems combine durability and lightness.",
            details: [
                "Carbon Fiber Reinforced Polymer (CFRP) composite airframe",
                "MXene-based transition metal alloy layers for lightning protection",
                "Advanced canopy mechanism — explosive separation and bird strike resistance",
                "Internal weapons station integration — 6+ hardpoint capacity",
                "~21m length, ~14m wingspan, ~27,000 kg MTOW",
                "Structural integrity for 9G maneuvering loads",
            ],
        },
    ],
};

const timeline: Record<Locale, { sectionTag: string; title: string; titleAccent: string; milestones: Milestone[] }> = {
    tr: {
        sectionTag: "GELİŞTİRME SÜRECİ",
        title: "KAAN",
        titleAccent: "KRONOLOJİSİ",
        milestones: [
            { year: "2010", title: "Program Başlangıcı", description: "Milli Muharip Uçak (MMU) programı TUSAŞ liderliğinde resmi olarak başlatıldı." },
            { year: "2018", title: "Program Başlangıç Koşulları (T0)", description: "Projenin başlangıç koşulları (T0) karşılandı; ön tasarım (Phase-1) faaliyetleri resmen başlatıldı." },
            { year: "2022", title: "Detaylı Tasarım Aşaması", description: "Phase-2 kapsamında detaylı tasarım ve kalifikasyon süreci başlatıldı, prototip üretimi hızlandı." },
            { year: "2023", title: "Çıkış Töreni (Roll-Out)", description: "18 Mart 2023'te ilk prototip kamuoyuna tanıtıldı. Cumhurbaşkanı himayesinde tören düzenlendi." },
            { year: "2024", title: "İlk Uçuş", description: "21 Şubat 2024'te ilk uçuşunu başarıyla tamamladı. 13 dakikalık uçuş testinde 8,000 ft irtifa ve 230 knot hıza ulaşıldı." },
            { year: "2025+", title: "Uçuş Test Programı", description: "Kapsamlı test ve sertifikasyon süreci devam ediyor. Seri üretim planlaması başlatıldı." },
        ],
    },
    en: {
        sectionTag: "DEVELOPMENT HISTORY",
        title: "KAAN",
        titleAccent: "CHRONOLOGY",
        milestones: [
            { year: "2010", title: "Program Launch", description: "National Combat Aircraft (MMU) program officially initiated under TUSAŞ leadership." },
            { year: "2018", title: "Initial Conditions (T0)", description: "Program initial conditions (T0) met; Phase-1 preliminary design activities officially commenced." },
            { year: "2022", title: "Detailed Design Phase", description: "Phase-2 detailed design and qualification process initiated, prototype manufacturing accelerated." },
            { year: "2023", title: "Roll-Out Ceremony", description: "First prototype unveiled to the public on March 18, 2023, under Presidential patronage." },
            { year: "2024", title: "Maiden Flight", description: "Successfully completed its maiden flight on February 21, 2024. A 13-minute test flight reached 8,000 ft altitude and 230 knots." },
            { year: "2025+", title: "Flight Test Program", description: "Comprehensive testing and certification process is ongoing. Serial production planning has commenced." },
        ],
    },
};

const translations = {
    nav,
    phases,
    scrollHint,
    specs: { ...specSection, items: specItems },
    footer,
    disclaimer,
    navBadge,
    footerLegal,
    video,
    gallery,
    techSection,
    techCards,
    timeline,
};

export default translations;
