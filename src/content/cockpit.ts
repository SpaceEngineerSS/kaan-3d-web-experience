import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

export type DisplayPageId = "tsd" | "flight" | "systems";

/** Text drawn on the simulated display canvas. Kept short: it has to fit at 12 CSS px. */
export interface DisplayLabels {
    tsd: {
        title: string;
        own: string;
        wingman: string;
        unknown: string;
        hostile: string;
        tracks: string;
        colId: string;
        colBrg: string;
        colRng: string;
        colAlt: string;
        sector: string;
        nm: string;
    };
    flight: {
        title: string;
        speed: string;
        alt: string;
        hdg: string;
        mach: string;
        g: string;
        aoa: string;
        vs: string;
    };
    systems: {
        title: string;
        bay: string;
        doorsClosed: string;
        engL: string;
        engR: string;
        rpm: string;
        egt: string;
        fuel: string;
        cautions: string;
        none: string;
    };
    simulated: string;
}

export interface DisplayPage {
    id: DisplayPageId;
    tab: string;
    title: string;
    body: string;
}

export interface FactRow {
    term: string;
    value: string;
    note?: string;
}

export interface AvionicsNode {
    id: string;
    short: string;
    name: string;
    maker: string;
    status: NodeStatus;
    body: string;
}

/** announced = stated by the manufacturer for KAAN; reported = press/trade-show; planned = stated as future work. */
export type NodeStatus = "confirmed" | "reported" | "planned";

export interface CockpitCopy {
    label: string;
    title: string;
    lede: string;
    displayTitle: string;
    displayHint: string;
    pages: DisplayPage[];
    displaySource: string;
    labels: DisplayLabels;
    layoutTitle: string;
    layout: FactRow[];
    tulgar: {
        title: string;
        body: string;
        showsTitle: string;
        shows: string[];
        source: string;
    };
    avionicsTitle: string;
    avionicsLede: string;
    avionicsHint: string;
    makerLabel: string;
    statusLabel: string;
    statusWords: Record<NodeStatus, string>;
    nodes: AvionicsNode[];
    avionicsSource: string;
}

export const cockpit: L<CockpitCopy> = {
    tr: {
        label: "Kokpit ve aviyonik",
        title: "Bir ekran, bir kask, tek resim",
        lede: "KAAN'ın kokpiti klasik gösterge kümeleri yerine geniş bir dokunmatik ekran ve kaska entegre görüntüleme sistemi üzerine kurulu. Sensörlerden gelen veri, pilota ayrı ayrı değil birleştirilmiş olarak sunulmak üzere tasarlanıyor.",
        displayTitle: "Panoramik ekran, temsili sayfalar",
        displayHint: "Sayfa seçin. Değerler simülasyondur.",
        pages: [
            {
                id: "tsd",
                tab: "Taktik durum",
                title: "Taktik durum sayfası",
                body: "Uçağın üstten görünümü. Radar ve veri bağıyla gelen izler tek haritada; her iz için kerteriz, mesafe ve irtifa yan tabloda. Beşinci nesil kokpitlerin ana sayfası genellikle budur.",
            },
            {
                id: "flight",
                tab: "Uçuş",
                title: "Uçuş sayfası",
                body: "Yapay ufuk, hız ve irtifa şeritleri, baş göstergesi. Bu bilgilerin önemli kısmı kask vizörüne de yansıtılır; ekrandaki karşılığı yedek ve özet görevi görür.",
            },
            {
                id: "systems",
                tab: "Sistemler",
                title: "Sistem sayfası",
                body: "İç silah yuvası kapakları, iki motorun devir ve egzoz sıcaklığı, yakıt seviyesi ve uyarı listesi. Gerçek uçakta bu sayfalar ihtiyaç anında öne gelir.",
            },
        ],
        displaySource:
            "Not: Ekran düzeni ve semboloji temsilidir; KAAN'ın gerçek ekran sayfaları yayımlanmadı. Tek parça geniş ekran yaklaşımı TUSAŞ'ın kokpit görselleri ve ASELSAN sunumlarına dayanır.",
        labels: {
            tsd: {
                title: "TAKTİK DURUM",
                own: "KAAN",
                wingman: "Kol",
                unknown: "Bilinmeyen",
                hostile: "Hasım",
                tracks: "İZLER",
                colId: "İZ",
                colBrg: "KRT",
                colRng: "MSF",
                colAlt: "İRT",
                sector: "Radar sektörü",
                nm: "dm",
            },
            flight: {
                title: "UÇUŞ",
                speed: "HIZ kt",
                alt: "İRT ft",
                hdg: "BAŞ",
                mach: "Mach",
                g: "G",
                aoa: "Hücum açısı",
                vs: "Dikey hız",
            },
            systems: {
                title: "SİSTEMLER",
                bay: "İç silah yuvası",
                doorsClosed: "Kapaklar kapalı",
                engL: "MOTOR 1",
                engR: "MOTOR 2",
                rpm: "Devir %",
                egt: "EGT °C",
                fuel: "Yakıt",
                cautions: "Uyarılar",
                none: "Yok",
            },
            simulated: "SİMÜLASYON",
        },
        layoutTitle: "Kokpit düzeni",
        layout: [
            { term: "Ana ekran", value: "Tek parça, geniş alanlı dokunmatik ekran (ASELSAN)", note: "bildirilen" },
            { term: "Kask", value: "ASELSAN TULGAR kaska entegre görüntüleme sistemi" },
            { term: "Uçuş kontrol", value: "Sayısal fly-by-wire (TUSAŞ)" },
            { term: "Mürettebat", value: "Tek pilot" },
        ],
        tulgar: {
            title: "TULGAR kask sistemi",
            body: "TULGAR, ASELSAN'ın geliştirdiği kaska entegre görüntüleme ve nişangâh sistemi. Uçuş ve hedef bilgisini pilotun vizörüne yansıtır, kafa hareketini izleyerek sensörleri ve silahları pilotun baktığı yöne yönlendirmeye imkân verir. ASELSAN, sistemin renkli semboloji sunduğunu belirtiyor.",
            showsTitle: "Vizörde gösterilenler",
            shows: [
                "Hız, irtifa, baş ve yönelim gibi temel uçuş verileri",
                "Hedef işaretleri ve silah durumu",
                "Dost ve hasım iz sembolleri",
                "Gece kullanım için sayısal gece görüş görüntüsü",
            ],
            source: "Kaynak: ASELSAN TULGAR ürün tanıtımı ve fuar açıklamaları. Görüş alanı ve ağırlık gibi değerler resmi olarak teyit edilemediği için verilmedi.",
        },
        avionicsTitle: "Aviyonik mimari",
        avionicsLede: "Sensörler, ekranlar ve haberleşme sistemleri ortak bir modüler aviyonik çekirdeğe bağlanır. Aşağıdaki şema yalnızca KAAN için kamuoyuna açıklanmış veya basında yer almış sistemleri gösterir; bağlantılar kavramsaldır.",
        avionicsHint: "Ayrıntı için bir kutunun üzerine gelin veya seçin.",
        makerLabel: "Geliştirici",
        statusLabel: "Durum",
        statusWords: { confirmed: "açıklandı", reported: "bildirilen", planned: "planlanan" },
        nodes: [
            {
                id: "ima",
                short: "IMA",
                name: "Entegre modüler aviyonik çekirdek",
                maker: "TUSAŞ ve yerli ortaklar; TÜBİTAK BİLGEM katkısı bildirildi",
                status: "reported",
                body: "Görev ve uçuş yazılımlarının ortak işlemci modüllerinde, birbirinden yalıtılmış bölümlerde çalıştığı mimari. Sensör verisinin birleştirilmesi ve ekranlara tek bir taktik resim olarak aktarılması burada yapılır.",
            },
            {
                id: "radar",
                short: "MURAD",
                name: "MURAD AESA radar",
                maker: "ASELSAN",
                status: "confirmed",
                body: "Aktif elektronik taramalı dizi radar. Huzmeyi mekanik dönüş olmadan elektronik olarak yönlendirir; hava-hava takip ve hava-yer haritalama modlarını aynı antende birleştirir. KAAN için MURAD ailesinin bir sürümü geliştiriliyor.",
            },
            {
                id: "ew",
                short: "EH",
                name: "Elektronik harp süiti",
                maker: "ASELSAN",
                status: "planned",
                body: "Radar ikaz alıcısı ve elektronik karıştırma işlevlerini kapsayan, gövdeye gömülü anten yapılarıyla çalışan öz koruma sistemi.",
            },
            {
                id: "irst",
                short: "IRST",
                name: "Kızılötesi arama ve takip",
                maker: "ASELSAN",
                status: "planned",
                body: "Radar yayını yapmadan hedeflerin ısı izini algılayan pasif sensör. Radar sessizken de iz üretebilir.",
            },
            {
                id: "das",
                short: "DAS",
                name: "Dağıtık kızılötesi sensörler",
                maker: "ASELSAN",
                status: "reported",
                body: "Gövdenin farklı noktalarına yerleştirilen kızılötesi kameralarla uçağın çevresinin izlenmesi; füze yaklaşma ikazı ve kask vizörüne görüntü aktarımı hedefleniyor.",
            },
            {
                id: "eots",
                short: "EOTS",
                name: "Elektro-optik hedefleme",
                maker: "ASELSAN",
                status: "reported",
                body: "Gövde içine yerleştirilen, harici pod gerektirmeyen elektro-optik hedefleme sistemi. Gizliliği korumak için dış yüzeye uyumlu bir pencere arkasında çalışır.",
            },
            {
                id: "link",
                short: "LINK",
                name: "Veri bağları ve haberleşme",
                maker: "ASELSAN",
                status: "reported",
                body: "Diğer uçaklar, insansız sistemler ve yer unsurlarıyla taktik veri paylaşımı. Milli veri bağı ile NATO standartlarına uyumlu bağlantıların birlikte kullanılması bekleniyor.",
            },
            {
                id: "cni",
                short: "CNI",
                name: "Seyrüsefer ve tanımlama",
                maker: "ASELSAN",
                status: "reported",
                body: "Telsizler, uydu ve ataletsel seyrüsefer ile dost-düşman tanıma (IFF) işlevleri.",
            },
            {
                id: "fcs",
                short: "FCS",
                name: "Uçuş kontrol bilgisayarı",
                maker: "TUSAŞ",
                status: "confirmed",
                body: "Sayısal fly-by-wire sistemi. Pilot komutlarını kumanda yüzeylerine iletir ve uçağı kararlı tutar; görev sistemlerinden ayrı, uçuş açısından kritik bir hat olarak çalışır.",
            },
            {
                id: "wad",
                short: "EKRAN",
                name: "Panoramik kokpit ekranı",
                maker: "ASELSAN",
                status: "reported",
                body: "Pilotun önünü kaplayan geniş dokunmatik ekran. Birleştirilmiş taktik resim, uçuş ve sistem sayfaları burada pencereler halinde gösterilir.",
            },
            {
                id: "hmd",
                short: "TULGAR",
                name: "TULGAR kask sistemi",
                maker: "ASELSAN",
                status: "confirmed",
                body: "Uçuş ve hedef sembolojisini vizöre yansıtan, kafa takibiyle sensör ve silahları yönlendiren kask sistemi.",
            },
        ],
        avionicsSource:
            "Kaynak: TUSAŞ ve ASELSAN açıklamaları, savunma basını, Kasım 2026 itibarıyla. 'Planlanan' ve 'bildirilen' işaretli sistemler resmi bir yapılandırma listesi değildir; ilk blokların donanımı farklı olabilir.",
    },
    en: {
        label: "Cockpit and avionics",
        title: "One display, one helmet, one picture",
        lede: "KAAN's cockpit is built around a single wide touchscreen and a helmet-mounted display instead of clusters of separate gauges. Sensor data is meant to reach the pilot merged into one picture, not instrument by instrument.",
        displayTitle: "Panoramic display, representative pages",
        displayHint: "Pick a page. Values are simulated.",
        pages: [
            {
                id: "tsd",
                tab: "Tactical",
                title: "Tactical situation page",
                body: "A top-down view around the aircraft. Tracks from the radar and the data link share one map; bearing, range and altitude for each track sit in the table beside it. In fifth-generation cockpits this is usually the main page.",
            },
            {
                id: "flight",
                tab: "Flight",
                title: "Flight page",
                body: "Attitude indicator, speed and altitude tapes, heading. Much of this is also projected on the helmet visor; the display version serves as a backup and summary.",
            },
            {
                id: "systems",
                tab: "Systems",
                title: "Systems page",
                body: "Internal weapons bay doors, speed and exhaust temperature of both engines, fuel state and the caution list. In the real aircraft these pages come forward when needed.",
            },
        ],
        displaySource:
            "Note: the layout and symbology are representative; KAAN's actual display pages have not been published. The single wide display follows Turkish Aerospace cockpit imagery and ASELSAN presentations.",
        labels: {
            tsd: {
                title: "TACTICAL",
                own: "KAAN",
                wingman: "Wingman",
                unknown: "Unknown",
                hostile: "Hostile",
                tracks: "TRACKS",
                colId: "ID",
                colBrg: "BRG",
                colRng: "RNG",
                colAlt: "ALT",
                sector: "Radar sector",
                nm: "nm",
            },
            flight: {
                title: "FLIGHT",
                speed: "SPD kt",
                alt: "ALT ft",
                hdg: "HDG",
                mach: "Mach",
                g: "G",
                aoa: "Angle of attack",
                vs: "Vertical speed",
            },
            systems: {
                title: "SYSTEMS",
                bay: "Internal weapons bay",
                doorsClosed: "Doors closed",
                engL: "ENGINE 1",
                engR: "ENGINE 2",
                rpm: "RPM %",
                egt: "EGT °C",
                fuel: "Fuel",
                cautions: "Cautions",
                none: "None",
            },
            simulated: "SIMULATED",
        },
        layoutTitle: "Cockpit layout",
        layout: [
            { term: "Main display", value: "Single wide-area touchscreen (ASELSAN)", note: "reported" },
            { term: "Helmet", value: "ASELSAN TULGAR helmet-mounted display" },
            { term: "Flight control", value: "Digital fly-by-wire (Turkish Aerospace)" },
            { term: "Crew", value: "Single pilot" },
        ],
        tulgar: {
            title: "TULGAR helmet",
            body: "TULGAR is ASELSAN's helmet-mounted display and sight. It projects flight and targeting information onto the pilot's visor and tracks head movement, so sensors and weapons can be pointed where the pilot is looking. ASELSAN states that it provides colour symbology.",
            showsTitle: "What the visor shows",
            shows: [
                "Basic flight data such as speed, altitude, heading and attitude",
                "Target markers and weapon status",
                "Friendly and hostile track symbols",
                "Digital night-vision imagery for night use",
            ],
            source: "Source: ASELSAN TULGAR product material and trade-show statements. Field of view and weight are not given because they could not be confirmed from official sources.",
        },
        avionicsTitle: "Avionics architecture",
        avionicsLede: "Sensors, displays and communications connect to a shared modular avionics core. The diagram shows only systems that have been announced for KAAN or reported in the press; the links are conceptual.",
        avionicsHint: "Hover over or select a box for details.",
        makerLabel: "Developer",
        statusLabel: "Status",
        statusWords: { confirmed: "announced", reported: "reported", planned: "planned" },
        nodes: [
            {
                id: "ima",
                short: "IMA",
                name: "Integrated modular avionics core",
                maker: "Turkish Aerospace with national partners; TÜBİTAK BİLGEM involvement reported",
                status: "reported",
                body: "An architecture in which mission and flight software run in isolated partitions on shared processing modules. Sensor data is fused here and passed to the displays as one tactical picture.",
            },
            {
                id: "radar",
                short: "MURAD",
                name: "MURAD AESA radar",
                maker: "ASELSAN",
                status: "confirmed",
                body: "Active electronically scanned array radar. It steers its beam electronically, without a moving antenna, and combines air-to-air tracking and air-to-ground mapping modes in one array. A version of the MURAD family is being developed for KAAN.",
            },
            {
                id: "ew",
                short: "EW",
                name: "Electronic warfare suite",
                maker: "ASELSAN",
                status: "planned",
                body: "Self-protection covering radar warning and electronic jamming, working through antennas embedded in the airframe.",
            },
            {
                id: "irst",
                short: "IRST",
                name: "Infrared search and track",
                maker: "ASELSAN",
                status: "planned",
                body: "A passive sensor that detects the heat signature of targets without emitting. It can produce tracks while the radar stays silent.",
            },
            {
                id: "das",
                short: "DAS",
                name: "Distributed infrared sensors",
                maker: "ASELSAN",
                status: "reported",
                body: "Infrared cameras placed around the airframe to watch the space around the aircraft; missile approach warning and imagery on the helmet visor are the stated aims.",
            },
            {
                id: "eots",
                short: "EOTS",
                name: "Electro-optical targeting",
                maker: "ASELSAN",
                status: "reported",
                body: "An internal electro-optical targeting system that needs no external pod. It looks out through a window shaped to the airframe to keep the signature low.",
            },
            {
                id: "link",
                short: "LINK",
                name: "Data links and communications",
                maker: "ASELSAN",
                status: "reported",
                body: "Tactical data sharing with other aircraft, uncrewed systems and ground units. A national data link alongside NATO-compatible links is expected.",
            },
            {
                id: "cni",
                short: "CNI",
                name: "Navigation and identification",
                maker: "ASELSAN",
                status: "reported",
                body: "Radios, satellite and inertial navigation, and identification friend or foe (IFF).",
            },
            {
                id: "fcs",
                short: "FCS",
                name: "Flight control computer",
                maker: "Turkish Aerospace",
                status: "confirmed",
                body: "Digital fly-by-wire. It turns pilot inputs into control-surface commands and keeps the aircraft stable; it runs as a flight-critical channel separate from the mission systems.",
            },
            {
                id: "wad",
                short: "DISPLAY",
                name: "Panoramic cockpit display",
                maker: "ASELSAN",
                status: "reported",
                body: "A wide touchscreen across the front of the cockpit. The fused tactical picture, flight and systems pages appear here as windows.",
            },
            {
                id: "hmd",
                short: "TULGAR",
                name: "TULGAR helmet",
                maker: "ASELSAN",
                status: "confirmed",
                body: "Helmet system that projects flight and targeting symbology onto the visor and uses head tracking to cue sensors and weapons.",
            },
        ],
        avionicsSource:
            "Source: Turkish Aerospace and ASELSAN statements and defence press, as of November 2026. Items marked 'planned' or 'reported' are not an official configuration list; early blocks may be equipped differently.",
    },
};
