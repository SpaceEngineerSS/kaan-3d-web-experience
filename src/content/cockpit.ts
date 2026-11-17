import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

/** Pages of the simulated Large Area Display. Mnemonics follow common fighter-display usage. */
export type PageId = "tsd" | "rdr" | "sms" | "eng" | "fuel" | "fcs";

export interface DisplayPage {
    id: PageId;
    /** Mnemonic on the tab and on the canvas, always caps. */
    tab: string;
    name: string;
    body: string;
}

/** The few words drawn on the canvas that change with the language. Everything else is a cockpit mnemonic. */
export interface CanvasLabels {
    /** Stamp in every portal header. */
    notional: string;
    /** Stamp on the stores page. */
    notionalLoadout: string;
    /** Stamp on the fuel page. */
    notionalTanks: string;
}

export interface SourcedLine {
    term: string;
    value: string;
    source: string;
}

export interface CockpitCopy {
    label: string;
    title: string;
    lede: string;
    display: {
        title: string;
        hint: string;
        pagesLabel: string;
        portalLabel: string;
        portals: [string, string];
        pages: DisplayPage[];
        honestTag: string;
        honest: string;
        source: string;
        canvas: CanvasLabels;
    };
    standby: {
        title: string;
        body: string;
        aria: string;
        source: string;
    };
    tulgar: {
        title: string;
        body: string;
        specs: { term: string; value: string }[];
        frameTitle: string;
        frameCaption: string;
        source: string;
    };
    hardwareTitle: string;
    hardware: SourcedLine[];
}

export const cockpit: L<CockpitCopy> = {
    tr: {
        label: "Kokpit",
        title: "Tek geniş ekran ve bir kask",
        lede: "TUSAŞ'ın resmi sistem listesinde kokpit için iki kalem var: Geniş Ekran Gösterge Sistemi ve Kaska Monte Gösterge Sistemi. Listede HUD yok. Uçuş ve hedef bilgisi kask vizörüne, taktik resim ve sistem sayfaları pilotun önündeki tek parça dokunmatik ekrana gelir.",
        display: {
            title: "Geniş alan ekranı",
            hint: "Bir portal seçin, sonra sayfa seçin. Değerler zamana bağlı simülasyondur.",
            pagesLabel: "Ekran sayfası",
            portalLabel: "Portal",
            portals: ["PORTAL 1", "PORTAL 2"],
            pages: [
                {
                    id: "tsd",
                    tab: "TSD",
                    name: "Taktik durum",
                    body: "Uçağın üstten görünümü, burun yukarıda. Kendi uçak ekranın alttan üçte birinde; menzil halkaları 10, 20, 40 ve 80 deniz mili. Rota ve dönüm noktaları macenta, tehdit halkası kırmızı. İzler MIL-STD-2525 hava çerçeveleriyle çizildi: dost yarım daire, hasım yarım baklava, bilinmeyen yarım dörtyaprak. Yanlarındaki veri bloğunda bin feet cinsinden irtifa ve Mach var. Sol üstteki BULL satırı, kendi uçağın ortak referans noktasına (bullseye) göre kerteriz ve mesafesidir.",
                },
                {
                    id: "rdr",
                    tab: "RDR",
                    name: "Radar B-tarama",
                    body: "ASELSAN MURAD AESA radarı için temsili B-tarama görünümü: yatay eksen ±60° azimut, dikey eksen 80 deniz miline kadar menzil. Bu görünümde her iz, kerteriz ve mesafesine göre dikdörtgen bir alana yerleşir; kendi uçak alt kenarın ortasındadır. Mod adları ve menzil ölçeği temsilidir.",
                },
                {
                    id: "sms",
                    tab: "SMS",
                    name: "Mühimmat yönetimi",
                    body: "İç silah yuvalarının üstten görünümü. Gösterilen yük temsilidir: ASELSAN'ın 2025'te KAAN için andığı TOLUN, LGK ve Gözde ailelerinden örnekler. KAAN'ın gerçek istasyon sayısı ve yük seçenekleri resmi olarak yayımlanmadı.",
                },
                {
                    id: "eng",
                    tab: "ENG",
                    name: "Motorlar",
                    body: "İki motor yan yana: devir (%), türbin giriş sıcaklığı (FTIT, °C), lüle açıklığı (%), yağ basıncı (psi) ve yakıt akışı (pound/saat). Prototipler General Electric F110 ile uçuyor; değerler seyir için makul bir aralıkta, simülasyondur. Seri üretimde yerli TEI TF35000'e geçilmesi planlanıyor.",
                },
                {
                    id: "fuel",
                    tab: "FUEL",
                    name: "Yakıt",
                    body: "Tank şeması, toplam yakıt kilogram ve pound olarak, BINGO (üsse dönüş için ayrılan miktar) ve o miktara kalan süre. KAAN'ın yakıt kapasitesi ve tank düzeni yayımlanmadığı için şema ve miktarlar temsilidir.",
                },
                {
                    id: "fcs",
                    tab: "FCS",
                    name: "Uçuş kontrol",
                    body: "Üstten planform üzerinde kumanda yüzeyleri ve anlık sapmaları: hücum kenarı flapları, flaperonlar, yatay stabilizeler ve dümenler. KAAN sayısal fly-by-wire ile uçar; burada gösterilen yüzey sapmaları hafif dönüşteki bir seyir uçuşunun simülasyonudur.",
                },
            ],
            honestTag: "Temsili",
            honest: "KAAN'ın gerçek ekran sayfaları yayımlanmadı; düzen ve semboloji, savaş uçağı ekranlarında belgelenmiş genel kurallara göre çizilmiş temsili bir yorumdur.",
            source: "Kaynak: TUSAŞ resmi KAAN sistem listesi (Geniş Ekran Gösterge Sistemi). Ekran donanımının STG Mühendislik LAD-208 olduğu savunma basınında bildirildi; 2,5:1 oran ve 2560×1024 çözünürlük forum ve basın kaynaklıdır, resmi değildir. İz çerçeveleri MIL-STD-2525 hava sembollerine dayanır.",
            canvas: {
                notional: "TEMSİLİ",
                notionalLoadout: "TEMSİLİ YÜK",
                notionalTanks: "TEMSİLİ TANK DÜZENİ",
            },
        },
        standby: {
            title: "Yedek uçuş göstergesi",
            body: "Ana ekran veya kask bilgisi kaybolursa pilotun elinde kalan küçük, bağımsız gösterge: yapay ufuk, hız ve irtifa. KAAN'daki yedek uçuş göstergesi ASELSAN üretimi. Buradaki çizim temsilidir; değerler ana ekrandaki simülasyonla aynıdır.",
            aria: "Yedek uçuş göstergesi: yapay ufuk, hız ve irtifa, temsili çizim.",
            source: "Kaynak: ASELSAN, KAAN için Yedek Uçuş Göstergesi ürün açıklaması.",
        },
        tulgar: {
            title: "TULGAR kask göstergesi",
            body: "TULGAR, ASELSAN'ın kaska monte gösterge sistemi. Uçuş ve hedef sembolojisini renkli olarak vizöre yansıtır; kafa takibiyle sensörler ve silahlar pilotun baktığı yöne yönlendirilebilir. F-16 üzerinde uçuş testlerinden geçti ve Şubat 2026'da P1 prototipinin koltuğunda görüldü.",
            specs: [
                { term: "Görüntü", value: "Renkli, saydam vizör üzerine" },
                { term: "Görüş alanı", value: "40° × 32°" },
                { term: "Gece", value: "Sayısal gece görüş" },
                { term: "Kafa takibi", value: "Hibrit ataletsel ve optik" },
                { term: "Ağırlık", value: "2,1 kg altı, oksijen maskesi dahil" },
                { term: "Arayüz", value: "ARINC 818-2, DisplayPort, MIL-STD-1553" },
            ],
            frameTitle: "TULGAR vizör çerçevesi, temsili semboloji",
            frameCaption: "40° × 32° görüş alanı ölçekli çizildi. Yeşil kendi uçak ve uçuş bilgisi, kırmızı hasım hedef, sarı tanımlanmamış iz.",
            source: "Kaynak: ASELSAN TULGAR ürün bilgisi ve fuar açıklamaları; P1 koltuğundaki kask, TUSAŞ'ın Şubat 2026 görüntüleri.",
        },
        hardwareTitle: "Kokpitteki diğer donanım",
        hardware: [
            {
                term: "Geniş alan ekranı",
                value: "STG Mühendislik LAD-208: çoklu dokunmatik, gece görüş uyumlu (NVIS), ARINC 818-2 video arayüzü, bölünmüş ekran. Aynı ailenin Hürjet'te de kullanıldığı bildiriliyor.",
                source: "Kaynak: savunma basını ve STG Mühendislik fuar sunumları (bildirilen). Boyut ve çözünürlük resmi olarak açıklanmadı.",
            },
            {
                term: "Fırlatma koltuğu",
                value: "Martin-Baker T18T, Mk18 ailesinden. Paris Air Show 2025'te KAAN için sergilendi.",
                source: "Kaynak: Martin-Baker, Paris Air Show 2025 açıklaması.",
            },
            {
                term: "Ekran grafik kütüphanesi",
                value: "Ekranlarda kullanılan grafik kütüphanesi HAVELSAN tarafından yerlileştirildi.",
                source: "Kaynak: HAVELSAN açıklaması, Kasım 2026.",
            },
            {
                term: "Aviyonik bilgisayar",
                value: "TÜBİTAK BİLGEM'in geliştirdiği aviyonik bilgisayar, 21 Şubat 2024'teki ilk uçuşta uçaktaydı.",
                source: "Kaynak: TÜBİTAK BİLGEM açıklaması, Şubat 2024.",
            },
        ],
    },
    en: {
        label: "Cockpit",
        title: "One wide display and a helmet",
        lede: "Turkish Aerospace's official system list names two cockpit items: a Large Area Display and a Helmet Mounted Display. There is no HUD on the list. Flight and targeting data go to the helmet visor; the tactical picture and system pages go to a single touchscreen in front of the pilot.",
        display: {
            title: "Large Area Display",
            hint: "Pick a portal, then a page. Values are a time-based simulation.",
            pagesLabel: "Display page",
            portalLabel: "Portal",
            portals: ["PORTAL 1", "PORTAL 2"],
            pages: [
                {
                    id: "tsd",
                    tab: "TSD",
                    name: "Tactical situation",
                    body: "Plan view around the aircraft, nose up. Ownship sits one third up from the bottom; range rings at 10, 20, 40 and 80 nautical miles. Route and steerpoints are magenta, the threat ring red. Tracks use MIL-STD-2525 air frames: friend semicircle, hostile half diamond, unknown half quatrefoil. Their data blocks give altitude in thousands of feet and Mach. The BULL line at top left is ownship's bearing and range from the shared reference point (bullseye).",
                },
                {
                    id: "rdr",
                    tab: "RDR",
                    name: "Radar B-scope",
                    body: "A representative B-scope for the ASELSAN MURAD AESA radar: azimuth ±60° across, range up to 80 nautical miles upward. Each track is placed by bearing and range on a rectangular field, with ownship at the middle of the bottom edge. Mode names and range scale are representative.",
                },
                {
                    id: "sms",
                    tab: "SMS",
                    name: "Stores management",
                    body: "Plan view of the internal weapons bays. The load shown is notional: examples from the TOLUN, LGK and Gözde families that ASELSAN named for KAAN in 2025. KAAN's real station count and load options have not been officially published.",
                },
                {
                    id: "eng",
                    tab: "ENG",
                    name: "Engines",
                    body: "Both engines side by side: speed (%), fan turbine inlet temperature (FTIT, °C), nozzle position (%), oil pressure (psi) and fuel flow (pounds per hour). The prototypes fly with the General Electric F110; values sit in a plausible cruise range and are simulated. Series aircraft are planned to switch to the national TEI TF35000.",
                },
                {
                    id: "fuel",
                    tab: "FUEL",
                    name: "Fuel",
                    body: "Tank diagram, total fuel in kilograms and pounds, BINGO (the amount kept for the return to base) and the time left until it is reached. KAAN's fuel capacity and tank layout are unpublished, so the diagram and quantities are notional.",
                },
                {
                    id: "fcs",
                    tab: "FCS",
                    name: "Flight control",
                    body: "Control surfaces and their current deflection on a plan view: leading-edge flaps, flaperons, stabilators and rudders. KAAN flies with digital fly-by-wire; the deflections shown simulate cruise in a gentle turn.",
                },
            ],
            honestTag: "Representative",
            honest: "KAAN's actual display pages have not been published; the layout and symbology are a representative interpretation drawn to the general rules documented for fighter displays.",
            source: "Source: Turkish Aerospace official KAAN system list (Large Area Display). The defence press reports the hardware as STG Mühendislik's LAD-208; the 2.5:1 format and 2560×1024 resolution come from forum and press reports and are not official. Track frames follow MIL-STD-2525 air symbols.",
            canvas: {
                notional: "NOTIONAL",
                notionalLoadout: "NOTIONAL LOAD",
                notionalTanks: "NOTIONAL TANKS",
            },
        },
        standby: {
            title: "Standby flight display",
            body: "The small independent instrument the pilot still has if the main display or the helmet picture is lost: attitude, airspeed and altitude. KAAN's standby flight display is made by ASELSAN. The drawing here is representative; it shows the same simulated values as the main display.",
            aria: "Standby flight display: attitude, airspeed and altitude, representative drawing.",
            source: "Source: ASELSAN product statement on the Standby Flight Display (Yedek Uçuş Göstergesi) for KAAN.",
        },
        tulgar: {
            title: "TULGAR helmet display",
            body: "TULGAR is ASELSAN's helmet-mounted display. It projects flight and targeting symbology onto the visor in colour, and head tracking lets sensors and weapons be cued to where the pilot looks. It has been flight-tested on an F-16 and was seen on the P1 prototype's seat in February 2026.",
            specs: [
                { term: "Image", value: "Colour, on a see-through visor" },
                { term: "Field of view", value: "40° × 32°" },
                { term: "Night", value: "Digital night vision" },
                { term: "Head tracking", value: "Hybrid inertial and optical" },
                { term: "Weight", value: "Under 2.1 kg including oxygen mask" },
                { term: "Interfaces", value: "ARINC 818-2, DisplayPort, MIL-STD-1553" },
            ],
            frameTitle: "TULGAR visor frame, representative symbology",
            frameCaption: "The 40° × 32° field of view is drawn to scale. Green is ownship and flight data, red a hostile target, yellow an unidentified track.",
            source: "Source: ASELSAN TULGAR product information and trade-show statements; helmet on the P1 seat from Turkish Aerospace imagery, February 2026.",
        },
        hardwareTitle: "Other cockpit hardware",
        hardware: [
            {
                term: "Large Area Display",
                value: "STG Mühendislik LAD-208: multi-touch, night-vision compatible (NVIS), ARINC 818-2 video interface, split screen. The same family is reported on the Hürjet.",
                source: "Source: defence press and STG Mühendislik trade-show material (reported). Size and resolution have not been officially stated.",
            },
            {
                term: "Ejection seat",
                value: "Martin-Baker T18T, from the Mk18 family. Shown for KAAN at the Paris Air Show 2025.",
                source: "Source: Martin-Baker, Paris Air Show 2025 statement.",
            },
            {
                term: "Display graphics library",
                value: "The graphics library used on the displays has been localised by HAVELSAN.",
                source: "Source: HAVELSAN statement, November 2026.",
            },
            {
                term: "Avionics computer",
                value: "An avionics computer developed by TÜBİTAK BİLGEM was on board for the first flight on 21 February 2024.",
                source: "Source: TÜBİTAK BİLGEM statement, February 2024.",
            },
        ],
    },
};
