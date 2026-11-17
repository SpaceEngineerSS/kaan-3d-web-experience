import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

/**
 * Copy for the /mum-t route (manned–unmanned teaming).
 * Facts checked November 2026. Anything reported only in the press, or a programme
 * target, is marked as such in the text or in a `note`.
 */

export const MUMT_NAV = [
    { href: "#concept", label: { tr: "Kavram", en: "Concept" } },
    { href: "#threats", label: { tr: "Tehdit", en: "Threats" } },
    { href: "#mission", label: { tr: "Görev", en: "Mission" } },
    { href: "#platforms", label: { tr: "Platformlar", en: "Platforms" } },
    { href: "#datalink", label: { tr: "Veri bağı", en: "Data link" } },
    { href: "#super-simsek", label: { tr: "Süper Şimşek", en: "Süper Şimşek" } },
    { href: "#ecosystem", label: { tr: "Sanayi", en: "Industry" } },
];

/* ── Hero + formation ─────────────────────────────── */

export type FormationMode = "FORMATION" | "BANK_LEFT" | "BANK_RIGHT" | "SEAD_DEPLOY" | "STRIKE_RELEASE";

export const hero: L<{
    kicker: string;
    title: string;
    statement: string;
    meta: string[];
    controls: string;
    sceneLabel: string;
    modes: Record<FormationMode, { label: string; caption: string }>;
    note: string;
    scroll: string;
}> = {
    tr: {
        kicker: "İnsanlı–insansız ekip (MUM-T)",
        title: "KAAN ve kanat uçakları",
        statement:
            "Bir pilotun yönettiği KAAN ile iki insansız ANKA-3'ün aynı ekipte uçması. TUSAŞ bu düzeni Şubat 2026'da World Defense Show'da dijital bir senaryo olarak gösterdi; Ekim 2026'da TEKNOFEST Şanlıurfa'da iki uçağın tam ölçekli maketleri yan yana sergilendi. Bu sayfa kavramı, platformları ve bilinen program adımlarını açık kaynaklarla anlatıyor.",
        meta: ["1 × KAAN, insanlı", "2 × ANKA-3, insansız", "Durum: geliştirme aşamasında"],
        controls: "Düzen",
        sceneLabel: "KAAN ve iki ANKA-3'ün üç boyutlu kol düzeni",
        modes: {
            FORMATION: { label: "Kol düzeni", caption: "ANKA-3'ler KAAN'ın iki yanında ve biraz gerisinde uçuyor." },
            BANK_LEFT: { label: "Sola dönüş", caption: "Ekip birlikte sola yatıyor; kanat uçakları düzeni koruyor." },
            BANK_RIGHT: { label: "Sağa dönüş", caption: "Ekip birlikte sağa yatıyor; kanat uçakları düzeni koruyor." },
            SEAD_DEPLOY: { label: "İleri gönder", caption: "Sağdaki ANKA-3 hava savunmasını aramak için öne ve yükseğe çıkıyor." },
            STRIKE_RELEASE: { label: "Taarruza ayır", caption: "Soldaki ANKA-3 hedefe yönelmek için alçalıp ayrılıyor." },
        },
        note: "Hareketler temsilîdir; gerçek bir uçuş profilini göstermez.",
        scroll: "Aşağı kaydırın",
    },
    en: {
        kicker: "Manned–unmanned teaming (MUM-T)",
        title: "KAAN and its wingmen",
        statement:
            "One piloted KAAN flying in the same team as two uncrewed ANKA-3s. Turkish Aerospace showed this arrangement as a digital scenario at the World Defense Show in February 2026; in October 2026 full-scale mock-ups of both aircraft stood side by side at TEKNOFEST in Şanlıurfa. This page explains the concept, the platforms and the known programme steps from public sources.",
        meta: ["1 × KAAN, crewed", "2 × ANKA-3, uncrewed", "Status: in development"],
        controls: "Formation",
        sceneLabel: "3D formation of KAAN and two ANKA-3s",
        modes: {
            FORMATION: { label: "Formation", caption: "The ANKA-3s fly either side of KAAN, slightly behind it." },
            BANK_LEFT: { label: "Bank left", caption: "The team banks left together; the wingmen hold position." },
            BANK_RIGHT: { label: "Bank right", caption: "The team banks right together; the wingmen hold position." },
            SEAD_DEPLOY: { label: "Push ahead", caption: "The right ANKA-3 climbs and moves ahead to search for air defences." },
            STRIKE_RELEASE: { label: "Detach to strike", caption: "The left ANKA-3 descends and breaks away towards a target." },
        },
        note: "Movements are illustrative and do not show a real flight profile.",
        scroll: "Scroll down",
    },
};

/* ── Footage band ──────────────────────────────────── */

export const filmBand: L<{ label: string; statement: string; caption: string; credit: string }> = {
    tr: {
        label: "Ekibin insanlı üyesi",
        statement: "Bu sayfadaki her senaryo bir pilotla başlar. Ekibin insanlı üyesi bugün yalnızca bir prototip olarak uçuyor.",
        caption: "KAAN P0, 2024 uçuş görüntüsü",
        credit: "TUSAŞ görüntüleri; kamuya açık paylaşımdan",
    },
    en: {
        label: "The crewed member of the team",
        statement: "Every scenario on this page starts with a pilot. Today the crewed member of the team flies only as a prototype.",
        caption: "KAAN P0, 2024 flight footage",
        credit: "TUSAŞ footage, from a public release",
    },
};

/* ── 02 Concept ───────────────────────────────────── */

export const concept: L<{
    label: string;
    title: string;
    lede: string;
    body: string[];
    loiTitle: string;
    loiIntro: string;
    loi: { level: string; title: string; body: string }[];
    compareTitle: string;
    colTopic: string;
    colSingle: string;
    colTeam: string;
    compare: { topic: string; single: string; team: string }[];
    source: string;
}> = {
    tr: {
        label: "Kavram",
        title: "Pilot karar verir, insansız uçak uygular",
        lede: "MUM-T, insanlı bir uçakla bir ya da birkaç insansız uçağın tek bir ekip gibi çalışmasıdır. Pilot görevleri dağıtır; insansız uçaklar uçuşu ve görevin ayrıntılarını büyük ölçüde kendileri yürütür.",
        body: [
            "KAAN için düşünülen düzende pilot bir tür görev komutanıdır. İnsansız uçaklara hedef, rota ya da görev verir; onların sensör verisini kendi ekranında görür. TUSAŞ'a göre KAAN ile ANKA-3 arasındaki haberleşme, atış ve güdüm bağlantıları KAAN Hava Kuvvetleri'nde hizmete girmeden çalışır hâle gelecek. Sürü yönetimi ve eş zamanlı atış mantığı ayrıca geliştiriliyor.",
            "Fikir yeni değil. ABD'de Boeing MQ-28 Ghost Bat ve CCA (Collaborative Combat Aircraft) programları da aynı soruyu yanıtlamaya çalışıyor: pahalı ve sayıca az insanlı uçakları, daha ucuz ve riske atılabilir insansız uçaklarla nasıl tamamlarsınız?",
        ],
        loiTitle: "Birlikte çalışabilirlik seviyeleri",
        loiIntro: "NATO'nun STANAG 4586 standardı, bir kullanıcının insansız uçak üzerindeki yetkisini beş seviyede tanımlar. Kavramı anlamak için iyi bir ölçek.",
        loi: [
            { level: "1", title: "Dolaylı veri alımı", body: "Sensör verisi başka bir sistem üzerinden, gecikmeli olarak gelir." },
            { level: "2", title: "Doğrudan veri alımı", body: "Sensör verisi doğrudan kullanıcıya gelir." },
            { level: "3", title: "Faydalı yük kontrolü", body: "Kullanıcı sensörleri ve faydalı yükü yönetebilir." },
            { level: "4", title: "Uçuş kontrolü", body: "Kullanıcı uçağın rotasını ve uçuşunu yönetir; kalkış ve iniş hariç." },
            { level: "5", title: "Tam kontrol", body: "Kalkış ve iniş dahil uçuşun tamamı kullanıcıdadır." },
        ],
        compareTitle: "Tek uçak ile ekip arasındaki fark",
        colTopic: "Konu",
        colSingle: "Tek insanlı uçak",
        colTeam: "İnsanlı–insansız ekip",
        compare: [
            { topic: "Sensör kapsamı", single: "Tek uçağın sensörleri ve bakış açısı", team: "Birden fazla uçaktan gelen veri tek resimde birleşir" },
            { topic: "Riskli bölgeye kim girer", single: "Pilotlu uçak", team: "Önce insansız uçak; insanlı uçak geride kalabilir" },
            { topic: "Kayıp durumunda", single: "Pilot ve pahalı bir uçak risk altında", team: "Kaybedilen uçak insansızsa pilot riski yoktur" },
            { topic: "Pilotun iş yükü", single: "Kendi uçağı ve silahları", team: "Artar; otonomi ve arayüz tasarımı bu yükü azaltmak için var" },
            { topic: "Bağımlılık", single: "Veri bağı olmadan da görev sürer", team: "Güvenli ve karıştırmaya dayanıklı veri bağı şart" },
        ],
        source: "Kaynak: TUSAŞ'ın World Defense Show 2026 açıklamaları (Şubat 2026, basında aktarıldığı şekliyle); NATO STANAG 4586.",
    },
    en: {
        label: "Concept",
        title: "The pilot decides, the drone carries it out",
        lede: "MUM-T means a crewed aircraft and one or more uncrewed aircraft working as one team. The pilot hands out tasks; the uncrewed aircraft handle the flying and the detail of the task largely on their own.",
        body: [
            "In the arrangement planned for KAAN, the pilot acts as a mission commander. They give the uncrewed aircraft a target, a route or a task, and see their sensor data on their own display. Turkish Aerospace says the communication, firing and guidance links between KAAN and ANKA-3 will be working before KAAN enters Turkish Air Force service. Swarm management and coordinated firing logic are being developed alongside.",
            "The idea is not new. In the United States, Boeing's MQ-28 Ghost Bat and the CCA (Collaborative Combat Aircraft) programme try to answer the same question: how do you add cheaper, expendable uncrewed aircraft to a small fleet of expensive crewed ones?",
        ],
        loiTitle: "Levels of interoperability",
        loiIntro: "NATO's STANAG 4586 defines a user's authority over an uncrewed aircraft in five levels. It is a useful scale for the concept.",
        loi: [
            { level: "1", title: "Indirect data receipt", body: "Sensor data arrives through another system, with delay." },
            { level: "2", title: "Direct data receipt", body: "Sensor data comes straight to the user." },
            { level: "3", title: "Payload control", body: "The user can direct the sensors and payload." },
            { level: "4", title: "Flight control", body: "The user directs the aircraft's route and flight, except take-off and landing." },
            { level: "5", title: "Full control", body: "The user controls the whole flight, including take-off and landing." },
        ],
        compareTitle: "Single aircraft versus a team",
        colTopic: "Topic",
        colSingle: "Single crewed aircraft",
        colTeam: "Crewed–uncrewed team",
        compare: [
            { topic: "Sensor coverage", single: "One aircraft's sensors and viewpoint", team: "Data from several aircraft merges into one picture" },
            { topic: "Who enters the risky area", single: "The piloted aircraft", team: "The uncrewed aircraft first; the crewed one can stay back" },
            { topic: "If an aircraft is lost", single: "A pilot and an expensive aircraft at risk", team: "No pilot at risk if the lost aircraft is uncrewed" },
            { topic: "Pilot workload", single: "Own aircraft and weapons", team: "Higher; autonomy and interface design exist to reduce it" },
            { topic: "Dependency", single: "The mission continues without a data link", team: "Needs a secure, jam-resistant data link" },
        ],
        source: "Source: Turkish Aerospace statements at the World Defense Show 2026 (February 2026, as reported in the press); NATO STANAG 4586.",
    },
};

/* ── 03 Threats ───────────────────────────────────── */

export type LayerId = "long" | "medium" | "short" | "target";

export const threats: L<{
    label: string;
    title: string;
    lede: string;
    figureLabel: string;
    layers: { id: LayerId; label: string; example: string; body: string }[];
    platforms: { kaan: string; anka: string; simsek: string };
    note: string;
    source: string;
}> = {
    tr: {
        label: "Tehdit",
        title: "Katmanlı hava savunmasına karşı",
        lede: "Modern hava savunması üst üste binen halkalardan oluşur: uzun, orta ve kısa menzilli sistemler aynı alanı farklı mesafelerden korur. Bu ortama A2/AD (erişim engelleme ve alan hakimiyeti) denir. İnsansız kanat uçakları, pilotlu uçağı en tehlikeli halkaların dışında tutmak için kullanılır.",
        figureLabel: "Katman seçin",
        layers: [
            { id: "long", label: "Uzun menzil", example: "S-400 sınıfı sistemler", body: "En dış halka. Büyük radarları ve uzun menzilli füzeleriyle geniş bir alanı kapsar. Senaryoda KAAN bu halkanın dışında ya da kenarında kalır; tespit ve ilk temas insansız uçaklara bırakılır." },
            { id: "medium", label: "Orta menzil", example: "Buk sınıfı sistemler", body: "Daha hareketli ve sık konuşlanan sistemler. ANKA-3 burada sensörleriyle radar yayınlarını arar, gerekirse elektronik harp uygular." },
            { id: "short", label: "Kısa menzil", example: "Pantsir ve Tor sınıfı sistemler", body: "Hedefin hemen çevresindeki yakın savunma. Süper Şimşek gibi ucuz bir hava aracı, radarda bir savaş uçağı gibi görünerek bu sistemlerin dikkatini ve füzelerini üzerine çekebilir." },
            { id: "target", label: "Hedef", example: "Korunan tesis", body: "Savunma katmanları zayıflatıldıktan sonra taarruz yapılır. Atış, insansız uçaktan ya da menzil dışında kalan KAAN'dan gelebilir." },
        ],
        platforms: { kaan: "KAAN, menzil dışında", anka: "ANKA-3, ileride", simsek: "Süper Şimşek, aldatıcı" },
        note: "Şema ölçekli değildir. Gerçek menziller sisteme, füzeye, araziye ve hedefin irtifasına göre değişir.",
        source: "Kaynak: genel hava savunma doktrini; platform rolleri TUSAŞ ve MSB açıklamalarından.",
    },
    en: {
        label: "Threats",
        title: "Against layered air defence",
        lede: "Modern air defence is a set of overlapping rings: long-, medium- and short-range systems protect the same area from different distances. This is called an A2/AD (anti-access, area denial) environment. Uncrewed wingmen are used to keep the piloted aircraft outside the most dangerous rings.",
        figureLabel: "Choose a layer",
        layers: [
            { id: "long", label: "Long range", example: "S-400 class systems", body: "The outer ring. Large radars and long-range missiles cover a wide area. In the scenario KAAN stays outside or at the edge of this ring; detection and first contact are left to the uncrewed aircraft." },
            { id: "medium", label: "Medium range", example: "Buk class systems", body: "More mobile systems, deployed more densely. Here ANKA-3 uses its sensors to look for radar emissions and can apply electronic warfare." },
            { id: "short", label: "Short range", example: "Pantsir and Tor class systems", body: "Close defence right around the target. A cheap air vehicle like Süper Şimşek can look like a fighter on radar and draw these systems' attention and missiles onto itself." },
            { id: "target", label: "Target", example: "Defended site", body: "The strike comes after the defensive layers are weakened. It can come from an uncrewed aircraft or from KAAN, staying out of range." },
        ],
        platforms: { kaan: "KAAN, out of range", anka: "ANKA-3, forward", simsek: "Süper Şimşek, decoy" },
        note: "Not to scale. Real ranges depend on the system, missile, terrain and target altitude.",
        source: "Source: general air-defence doctrine; platform roles from Turkish Aerospace and Turkish Ministry of Defence statements.",
    },
};

/* ── 04 Mission timeline ──────────────────────────── */

export type PlatformKey = "kaan" | "anka" | "simsek";

export const mission: L<{
    label: string;
    title: string;
    lede: string;
    colPhase: string;
    platforms: Record<PlatformKey, string>;
    lead: string;
    support: string;
    phases: { title: string; body: string; roles: Partial<Record<PlatformKey, "lead" | "support">> }[];
    note: string;
}> = {
    tr: {
        label: "Görev akışı",
        title: "Bir görev, beş aşama",
        lede: "Aşağıdaki akış, açıklanan kavrama dayanan örnek bir senaryodur. Resmi bir görev profili değildir; kimin ne zaman öne çıktığını göstermek için hazırlandı.",
        colPhase: "Aşama",
        platforms: { kaan: "KAAN", anka: "ANKA-3", simsek: "Süper Şimşek" },
        lead: "önde",
        support: "destek",
        phases: [
            { title: "Planlama ve kalkış", body: "Görev, rota ve hedefler yerde yüklenir. Uçaklar kalkar ve buluşma noktasında kol düzenine girer.", roles: { kaan: "lead", anka: "support" } },
            { title: "Keşif", body: "ANKA-3'ler öne geçer. Radar ve elektro-optik sensörleriyle bölgeyi tarar, bulduklarını veri bağı üzerinden KAAN'a gönderir.", roles: { anka: "lead", kaan: "support" } },
            { title: "Hava savunmasını zayıflatma", body: "ANKA-3'ten bırakılan Süper Şimşek, radarda savaş uçağı gibi görünerek savunmayı açığa çıkarır. ANKA-3 elektronik harp uygular.", roles: { simsek: "lead", anka: "support" } },
            { title: "Taarruz", body: "Hedef, ANKA-3'ün TOLUN gibi küçük çaplı mühimmatıyla ya da KAAN'ın gövde içi silahlarıyla vurulur. Pilot atış iznini verir.", roles: { anka: "lead", kaan: "lead" } },
            { title: "Dönüş ve değerlendirme", body: "Ekip bölgeden çekilir. Sensör kayıtları, hasar tespiti için yere aktarılır.", roles: { kaan: "lead", anka: "support" } },
        ],
        note: "Örnek senaryo. ANKA-3'ün TOLUN ile hava-yer konfigürasyonu TUSAŞ ürün sayfasında yer alır; aşamaların sırası ve içeriği bu sitenin yorumudur.",
    },
    en: {
        label: "Mission flow",
        title: "One mission, five phases",
        lede: "The flow below is an example scenario based on the announced concept. It is not an official mission profile; it shows who takes the lead, and when.",
        colPhase: "Phase",
        platforms: { kaan: "KAAN", anka: "ANKA-3", simsek: "Süper Şimşek" },
        lead: "lead",
        support: "support",
        phases: [
            { title: "Planning and take-off", body: "Mission, route and targets are loaded on the ground. The aircraft take off and form up at a rendezvous point.", roles: { kaan: "lead", anka: "support" } },
            { title: "Reconnaissance", body: "The ANKA-3s move ahead. They scan the area with radar and electro-optical sensors and send what they find to KAAN over the data link.", roles: { anka: "lead", kaan: "support" } },
            { title: "Weakening air defence", body: "A Süper Şimşek released from ANKA-3 looks like a fighter on radar and makes the defences reveal themselves. ANKA-3 applies electronic warfare.", roles: { simsek: "lead", anka: "support" } },
            { title: "Strike", body: "The target is hit with small munitions such as TOLUN from ANKA-3, or with KAAN's internal weapons. The pilot gives clearance to fire.", roles: { anka: "lead", kaan: "lead" } },
            { title: "Return and assessment", body: "The team leaves the area. Sensor recordings go to the ground for damage assessment.", roles: { kaan: "lead", anka: "support" } },
        ],
        note: "Example scenario. ANKA-3's air-to-ground configuration with TOLUN is listed on the Turkish Aerospace product page; the order and content of the phases are this site's interpretation.",
    },
};

/* ── 05 Scenario simulator ────────────────────────── */

/** Positions on a 100 × 60 map, x left→right toward the target, y top→bottom. */
export type Pos = [number, number];

export interface ScenarioStep {
    kaan: Pos;
    anka1: Pos;
    anka2: Pos;
    simsek?: Pos;
    /** Which threat rings are still active (outer → inner). */
    rings: [boolean, boolean, boolean];
}

export const scenarioGeometry: Record<"sead" | "strike" | "isr", ScenarioStep[]> = {
    sead: [
        { kaan: [10, 30], anka1: [16, 22], anka2: [16, 38], rings: [true, true, true] },
        { kaan: [14, 30], anka1: [34, 20], anka2: [24, 38], rings: [true, true, true] },
        { kaan: [16, 30], anka1: [40, 20], anka2: [30, 38], simsek: [58, 30], rings: [true, true, true] },
        { kaan: [18, 30], anka1: [42, 22], anka2: [46, 36], simsek: [72, 32], rings: [true, false, true] },
        { kaan: [20, 30], anka1: [40, 24], anka2: [44, 34], rings: [true, false, true] },
    ],
    strike: [
        { kaan: [10, 30], anka1: [16, 22], anka2: [16, 38], rings: [true, true, true] },
        { kaan: [18, 30], anka1: [46, 20], anka2: [26, 38], rings: [true, true, true] },
        { kaan: [22, 30], anka1: [56, 22], anka2: [40, 38], rings: [true, true, true] },
        { kaan: [24, 30], anka1: [56, 22], anka2: [58, 36], rings: [true, true, false] },
        { kaan: [22, 30], anka1: [48, 22], anka2: [46, 36], simsek: [80, 28], rings: [true, true, false] },
    ],
    isr: [
        { kaan: [10, 30], anka1: [16, 22], anka2: [16, 38], rings: [true, true, true] },
        { kaan: [14, 30], anka1: [40, 14], anka2: [40, 46], rings: [true, true, true] },
        { kaan: [16, 30], anka1: [50, 12], anka2: [50, 48], simsek: [70, 30], rings: [true, true, true] },
        { kaan: [16, 30], anka1: [58, 14], anka2: [58, 46], rings: [true, true, true] },
        { kaan: [12, 30], anka1: [30, 22], anka2: [30, 38], rings: [true, true, true] },
    ],
};

export const scenario: L<{
    label: string;
    title: string;
    lede: string;
    prev: string;
    next: string;
    reset: string;
    step: string;
    of: string;
    mapLabel: string;
    legend: { kaan: string; anka: string; simsek: string; ring: string; ringOff: string };
    scenarios: { id: "sead" | "strike" | "isr"; name: string; summary: string; steps: { title: string; body: string }[] }[];
    note: string;
}> = {
    tr: {
        label: "Senaryo",
        title: "Adım adım üç senaryo",
        lede: "Bir senaryo seçin ve adımlar arasında ilerleyin. Haritadaki konumlar şematiktir.",
        prev: "Önceki",
        next: "Sonraki",
        reset: "Başa dön",
        step: "Adım",
        of: "/",
        mapLabel: "Senaryo haritası",
        legend: { kaan: "KAAN", anka: "ANKA-3", simsek: "Süper Şimşek", ring: "Etkin savunma halkası", ringOff: "Bastırılmış halka" },
        scenarios: [
            {
                id: "sead",
                name: "Hava savunmasını bastırma",
                summary: "Amaç, orta menzilli bir hava savunma sistemini bulmak ve etkisiz hâle getirmek.",
                steps: [
                    { title: "Görev ataması", body: "KAAN, iki ANKA-3'e görev ve rota verir. Ekip kol düzeninde ilerler." },
                    { title: "Arama", body: "Üstteki ANKA-3 öne çıkar ve pasif sensörlerle radar yayınlarını dinler." },
                    { title: "Aldatma", body: "Bir Süper Şimşek bırakılır. Radarda savaş uçağı gibi görünür ve savunmayı radarını açmaya zorlar." },
                    { title: "Bastırma", body: "Radarın yeri belirlenince alttaki ANKA-3 sistemi hedef alır. Orta halka devre dışı kalır." },
                    { title: "Doğrulama", body: "KAAN sonucu kendi sensörleriyle doğrular ve ekibi bir sonraki adıma yönlendirir." },
                ],
            },
            {
                id: "strike",
                name: "Derin taarruz",
                summary: "Amaç, savunmanın gerisindeki sabit bir hedefi vurmak.",
                steps: [
                    { title: "Hedef tespiti", body: "Hedef, KAAN'ın MURAD AESA radarıyla ve önceden gelen istihbaratla belirlenir." },
                    { title: "Yaklaşma", body: "Üstteki ANKA-3 hedefe yaklaşır ve görüntüyü KAAN'a gönderir." },
                    { title: "Koordinat güncelleme", body: "İki kaynaktan gelen veri birleştirilir, hedef koordinatları kesinleşir." },
                    { title: "Atış", body: "Alttaki ANKA-3, kısa menzilli savunmanın dışından mühimmatını bırakır. Pilot atışı onaylar." },
                    { title: "Hasar tespiti", body: "Bir Süper Şimşek hedefin üzerinden geçerek sonucu görüntüler." },
                ],
            },
            {
                id: "isr",
                name: "Keşif ve gözetleme",
                summary: "Amaç, geniş bir alanı silah kullanmadan izlemek.",
                steps: [
                    { title: "Alan tanımı", body: "Görev alanı ve uçuş hatları belirlenir." },
                    { title: "Geniş tarama", body: "İki ANKA-3 ayrı hatlardan alanı radarla tarar." },
                    { title: "Yakın bakış", body: "İlgi çeken bir nokta için Süper Şimşek yakın geçiş yapar." },
                    { title: "Sinyal toplama", body: "ANKA-3'ler savunmanın kenarında kalarak elektronik sinyalleri kaydeder." },
                    { title: "Dönüş", body: "Ekip çekilir; veriler birleşik bir rapora dönüştürülür." },
                ],
            },
        ],
        note: "Senaryolar bu siteye aittir ve açıklanan kavramın bir yorumudur. Gerçek taktikler kamuya açık değildir.",
    },
    en: {
        label: "Scenario",
        title: "Three scenarios, step by step",
        lede: "Pick a scenario and move through the steps. Positions on the map are schematic.",
        prev: "Previous",
        next: "Next",
        reset: "Start over",
        step: "Step",
        of: "/",
        mapLabel: "Scenario map",
        legend: { kaan: "KAAN", anka: "ANKA-3", simsek: "Süper Şimşek", ring: "Active defence ring", ringOff: "Suppressed ring" },
        scenarios: [
            {
                id: "sead",
                name: "Suppressing air defence",
                summary: "The goal is to find and neutralise a medium-range air-defence system.",
                steps: [
                    { title: "Tasking", body: "KAAN gives the two ANKA-3s a task and a route. The team moves in formation." },
                    { title: "Search", body: "The upper ANKA-3 moves ahead and listens for radar emissions with passive sensors." },
                    { title: "Deception", body: "A Süper Şimşek is released. It looks like a fighter on radar and forces the defence to switch its radar on." },
                    { title: "Suppression", body: "Once the radar is located, the lower ANKA-3 engages the system. The medium ring goes down." },
                    { title: "Confirmation", body: "KAAN confirms the result with its own sensors and directs the team to the next step." },
                ],
            },
            {
                id: "strike",
                name: "Deep strike",
                summary: "The goal is to hit a fixed target behind the defences.",
                steps: [
                    { title: "Target detection", body: "The target is found with KAAN's MURAD AESA radar and prior intelligence." },
                    { title: "Approach", body: "The upper ANKA-3 closes on the target and sends imagery to KAAN." },
                    { title: "Coordinate update", body: "Data from both sources is merged and the target coordinates are confirmed." },
                    { title: "Release", body: "The lower ANKA-3 releases its munition from outside the short-range defence. The pilot approves the release." },
                    { title: "Damage assessment", body: "A Süper Şimşek passes over the target and images the result." },
                ],
            },
            {
                id: "isr",
                name: "Reconnaissance and surveillance",
                summary: "The goal is to watch a wide area without using weapons.",
                steps: [
                    { title: "Area definition", body: "The mission area and flight lines are set." },
                    { title: "Wide scan", body: "The two ANKA-3s scan the area with radar along separate lines." },
                    { title: "Close look", body: "Süper Şimşek makes a close pass over a point of interest." },
                    { title: "Signal collection", body: "The ANKA-3s stay at the edge of the defences and record electronic signals." },
                    { title: "Return", body: "The team withdraws; the data becomes one combined report." },
                ],
            },
        ],
        note: "The scenarios are this site's own interpretation of the announced concept. Real tactics are not public.",
    },
};

/* ── 06 Platforms ─────────────────────────────────── */

export interface PlatformRow {
    key: string;
    label: L;
    kaan: L;
    anka: L;
    note?: L;
}

const same = (v: string): L => ({ tr: v, en: v });

export const platformRows: PlatformRow[] = [
    { key: "role", label: { tr: "Rol", en: "Role" }, kaan: { tr: "Muharip uçak, hava üstünlüğü ağırlıklı", en: "Fighter, mainly air superiority" }, anka: { tr: "İnsansız muharip uçak", en: "Uncrewed combat aircraft" } },
    { key: "crew", label: { tr: "Mürettebat", en: "Crew" }, kaan: { tr: "1 pilot", en: "1 pilot" }, anka: { tr: "Yok", en: "None" } },
    { key: "length", label: { tr: "Uzunluk", en: "Length" }, kaan: { tr: "20,3 m", en: "20.3 m" }, anka: { tr: "8,9 m", en: "8.9 m" } },
    { key: "span", label: { tr: "Kanat açıklığı", en: "Wingspan" }, kaan: { tr: "13,4 m", en: "13.4 m" }, anka: { tr: "13,1 m", en: "13.1 m" } },
    { key: "height", label: { tr: "Yükseklik", en: "Height" }, kaan: same("5 m"), anka: { tr: "2,5 m", en: "2.5 m" } },
    { key: "mtow", label: { tr: "Azami kalkış ağırlığı", en: "Max take-off weight" }, kaan: { tr: "34 750 kg", en: "34,750 kg" }, anka: { tr: "7 250 kg", en: "7,250 kg" } },
    { key: "payload", label: { tr: "Azami faydalı yük", en: "Max payload" }, kaan: { tr: "Açıklanmadı", en: "Not published" }, anka: { tr: "1 700 kg", en: "1,700 kg" } },
    { key: "speed", label: { tr: "Azami hız", en: "Max speed" }, kaan: { tr: "Mach 1,8 (40 000 ft'te, tasarım değeri)", en: "Mach 1.8 (at 40,000 ft, design value)" }, anka: { tr: "Mach 0,7 (30 000 ft'te)", en: "Mach 0.7 (at 30,000 ft)" } },
    { key: "ceiling", label: { tr: "Servis tavanı", en: "Service ceiling" }, kaan: { tr: "55 000 ft (tasarım değeri)", en: "55,000 ft (design value)" }, anka: { tr: "40 000 ft", en: "40,000 ft" } },
    { key: "g", label: { tr: "Yük faktörü", en: "Load factor" }, kaan: same("+9 / −3,5 g"), anka: { tr: "Açıklanmadı", en: "Not published" } },
    { key: "radius", label: { tr: "Muharebe yarıçapı", en: "Combat radius" }, kaan: { tr: "1 100 km (bildirilen)", en: "1,100 km (reported)" }, anka: { tr: "1 075 km hava-hava, 750 km hava-yer", en: "1,075 km air-to-air, 750 km air-to-ground" } },
    { key: "endurance", label: { tr: "Havada kalış", en: "Endurance" }, kaan: { tr: "Açıklanmadı", en: "Not published" }, anka: { tr: "Yaklaşık 10 saat", en: "About 10 hours" } },
    {
        key: "engine",
        label: { tr: "Motor", en: "Engine" },
        kaan: { tr: "2 × F110-GE-129, her biri art yakıcıyla 13 150 kgf", en: "2 × F110-GE-129, 13,150 kgf each with afterburner" },
        anka: { tr: "1 turbofan (AI-322F olarak bildiriliyor)", en: "1 turbofan (reported as AI-322F)" },
    },
    { key: "stations", label: { tr: "Silah istasyonu", en: "Weapon stations" }, kaan: { tr: "Gövde içi yuvalar ve dış istasyonlar", en: "Internal bays and external stations" }, anka: { tr: "2 iç, 2 dış", en: "2 internal, 2 external" } },
    { key: "first", label: { tr: "İlk uçuş", en: "First flight" }, kaan: { tr: "21 Şubat 2024", en: "21 February 2024" }, anka: { tr: "28 Aralık 2023", en: "28 December 2023" } },
];

export const platforms: L<{
    label: string;
    title: string;
    lede: string;
    colItem: string;
    rolesTitle: string;
    roles: string[];
    scaleTitle: string;
    scaleNote: string;
    photoAlt: string;
    photoCredit: string;
    source: string;
}> = {
    tr: {
        label: "Platformlar",
        title: "KAAN ve ANKA-3 yan yana",
        lede: "İki uçağın kanat açıklığı neredeyse aynı (13,4 m ve 13,1 m), ama ANKA-3'ün azami kalkış ağırlığı KAAN'ınkinin beşte biri kadar. Kuyruğu olmayan uçan kanat biçimi, radar izini küçültmek için seçildi.",
        colItem: "Özellik",
        rolesTitle: "TUSAŞ'ın ANKA-3 için saydığı görevler",
        roles: ["Hava-hava ve hava-yer taarruz", "İnsanlı–insansız ekip (MUM-T)", "Elektronik harp", "Uçak gemisinden kalkış ve iniş"],
        scaleTitle: "Üstten bakış, aynı ölçek",
        scaleNote: "Her çerçeve uçağın uzunluğu ve kanat açıklığıdır.",
        photoAlt: "İniş takımları açık hâlde uçan ANKA-3, alttan görünüm",
        photoCredit: "ANKA-3 tanıtım videosundan kare (SSB, TUSAŞ)",
        source: "Kaynak: ANKA-3 için TUSAŞ ürün sayfası (Kasım 2026'da kontrol edildi). Önceki TUSAŞ broşürü 12,5 m kanat açıklığı ve 6 500 kg kalkış ağırlığı veriyordu; tablo güncel sayfayı izler. ANKA-3'ün motor modeli TUSAŞ tarafından belirtilmiyor. KAAN değerleri TUSAŞ'ın resmi teknik verileridir; hız ve tavan henüz uçuşta gösterilmemiş tasarım değerleridir, muharebe yarıçapı ise basında bildirilen bir değerdir.",
    },
    en: {
        label: "Platforms",
        title: "KAAN and ANKA-3 side by side",
        lede: "The two aircraft have almost the same wingspan (13.4 m and 13.1 m), but ANKA-3's maximum take-off weight is about a fifth of KAAN's. Its tailless flying-wing shape was chosen to keep its radar signature small.",
        colItem: "Item",
        rolesTitle: "Roles Turkish Aerospace lists for ANKA-3",
        roles: ["Air-to-air and air-to-ground strike", "Manned–unmanned teaming (MUM-T)", "Electronic warfare", "Take-off from and landing on an aircraft carrier"],
        scaleTitle: "Plan view, same scale",
        scaleNote: "Each frame is the aircraft's length by its wingspan.",
        photoAlt: "ANKA-3 in flight with its landing gear down, seen from below",
        photoCredit: "Still from the ANKA-3 promotional video (SSB, Turkish Aerospace)",
        source: "Source: Turkish Aerospace ANKA-3 product page (checked November 2026). An earlier Turkish Aerospace brochure gave a 12.5 m span and 6,500 kg take-off weight; the table follows the current page. Turkish Aerospace does not name ANKA-3's engine model. KAAN figures are Turkish Aerospace's official specifications; speed and ceiling are design values not yet shown in flight, and the combat radius is a press-reported figure.",
    },
};

/** Plan-view dimensions in metres (length × span) for the scale drawing. */
export const planDims = {
    kaan: { length: 20.3, span: 13.4 },
    anka: { length: 8.9, span: 13.1 },
    simsek: { length: 4, span: 1.75 },
};

/* ── 07 Data link ─────────────────────────────────── */

export type LinkId = "tasking" | "sensor" | "status" | "warning";

export const datalink: L<{
    label: string;
    title: string;
    lede: string;
    figureLabel: string;
    nodes: { kaan: string; anka1: string; anka2: string; simsek: string; ground: string };
    links: { id: LinkId; label: string; body: string }[];
    needsTitle: string;
    needs: { term: string; body: string }[];
    source: string;
}> = {
    tr: {
        label: "Veri bağı",
        title: "Ekibi bir arada tutan bağlantı",
        lede: "İnsanlı ve insansız uçakları ekip yapan şey aralarındaki veri bağıdır. KAAN ile ANKA-3 arasında kullanılacak bağın teknik ayrıntıları açıklanmadı; aşağıdaki şema hangi bilginin hangi yöne aktığını gösterir.",
        figureLabel: "Mesaj türü seçin",
        nodes: { kaan: "KAAN", anka1: "ANKA-3", anka2: "ANKA-3", simsek: "Süper Şimşek", ground: "Yer istasyonu" },
        links: [
            { id: "tasking", label: "Görev ataması", body: "Pilot hedef, rota ya da görev değişikliğini KAAN'dan insansız uçaklara gönderir. Silah kullanımı için onay da bu yoldan gider." },
            { id: "sensor", label: "Sensör verisi", body: "ANKA-3'lerin radar ve elektro-optik verisi KAAN'a akar ve pilotun ekranındaki tek resme eklenir." },
            { id: "status", label: "Durum raporu", body: "Yakıt, konum, sistem durumu ve kalan mühimmat düzenli olarak paylaşılır. Yer istasyonu da bu bilgiyi izler." },
            { id: "warning", label: "Tehdit uyarısı", body: "Bir uçak bir tehdit algılarsa bunu ekibin geri kalanına hemen bildirir." },
        ],
        needsTitle: "Bir MUM-T veri bağından beklenenler",
        needs: [
            { term: "Düşük gecikme", body: "Karar ile uygulama arasındaki süre kısa olmalı; özellikle atış onayında." },
            { term: "Düşük yakalanma olasılığı", body: "Yayın, düşman sensörlerine uçakların yerini ele vermemeli." },
            { term: "Karıştırmaya dayanıklılık", body: "Elektronik harp altında da bağlantı sürmeli." },
            { term: "Bağ kesilirse ne olur", body: "İnsansız uçaklarda genel uygulama, bağ koptuğunda önceden tanımlanmış bir prosedürü izlemektir; örneğin belirli bir noktaya dönmek." },
        ],
        source: "Kaynak: TUSAŞ, Şubat 2026: iletişim, atış ve güdüm bağlantıları KAAN hizmete girmeden çalışır olacak. Beklentiler genel mühendislik gereksinimleridir; KAAN'a özel değerler açıklanmadı.",
    },
    en: {
        label: "Data link",
        title: "The link that holds the team together",
        lede: "What makes crewed and uncrewed aircraft a team is the data link between them. Technical details of the link KAAN and ANKA-3 will use have not been published; the diagram shows which information flows in which direction.",
        figureLabel: "Choose a message type",
        nodes: { kaan: "KAAN", anka1: "ANKA-3", anka2: "ANKA-3", simsek: "Süper Şimşek", ground: "Ground station" },
        links: [
            { id: "tasking", label: "Tasking", body: "The pilot sends targets, routes or task changes from KAAN to the uncrewed aircraft. Clearance to use weapons travels the same way." },
            { id: "sensor", label: "Sensor data", body: "Radar and electro-optical data from the ANKA-3s flows to KAAN and is added to the single picture on the pilot's display." },
            { id: "status", label: "Status report", body: "Fuel, position, system health and remaining munitions are shared regularly. The ground station monitors this too." },
            { id: "warning", label: "Threat warning", body: "If one aircraft detects a threat, it tells the rest of the team at once." },
        ],
        needsTitle: "What a MUM-T data link needs",
        needs: [
            { term: "Low latency", body: "The time between a decision and its execution must be short, especially for weapons clearance." },
            { term: "Low probability of intercept", body: "Transmissions should not give away the aircraft's position to enemy sensors." },
            { term: "Jam resistance", body: "The link has to keep working under electronic attack." },
            { term: "If the link is lost", body: "The usual practice for uncrewed aircraft is to follow a pre-set procedure when the link drops, such as returning to a set point." },
        ],
        source: "Source: Turkish Aerospace, February 2026: communication, firing and guidance links will work before KAAN enters service. The requirements are general engineering needs; no KAAN-specific values have been published.",
    },
};

/* ── 08 Süper Şimşek ──────────────────────────────── */

export interface SimsekSpec {
    label: L;
    value: string;
    unit: L;
}

export const simsekSpecs: SimsekSpec[] = [
    { label: { tr: "Uzunluk", en: "Length" }, value: "4", unit: same("m") },
    { label: { tr: "Kanat açıklığı", en: "Wingspan" }, value: "1,75", unit: same("m") },
    { label: { tr: "Azami kalkış ağırlığı", en: "Max take-off weight" }, value: "200", unit: same("kg") },
    { label: { tr: "Faydalı yük", en: "Payload" }, value: "50", unit: same("kg") },
    { label: { tr: "Azami hız", en: "Max speed" }, value: "0,85", unit: same("Mach") },
    { label: { tr: "Servis tavanı", en: "Service ceiling" }, value: "35 000", unit: same("ft") },
    { label: { tr: "Havada kalış", en: "Endurance" }, value: "80", unit: { tr: "dakika", en: "minutes" } },
    { label: { tr: "Görüş hattı veri bağı", en: "Line-of-sight data link" }, value: "150", unit: same("km") },
    { label: { tr: "Harp başlığı (kamikaze)", en: "Warhead (kamikaze)" }, value: "35", unit: same("kg") },
];

export const simsek: L<{
    label: string;
    title: string;
    lede: string;
    body: string[];
    specsTitle: string;
    rolesTitle: string;
    roles: { term: string; body: string }[];
    timelineTitle: string;
    timeline: { date: string; text: string }[];
    uncertain: string;
    canvasLabel: string;
    dragHint: string;
    source: string;
}> = {
    tr: {
        label: "Süper Şimşek",
        title: "Hedef uçağından kamikaze İHA'ya",
        lede: "Süper Şimşek, TUSAŞ'ın jet motorlu yüksek hızlı hedef uçağı Şimşek'ten geliştirildi. Başta hava savunma atışlarında hedef olarak tasarlandı; geliştirme sırasında kamikaze, aldatma ve elektronik harp görevleri eklendi.",
        body: [
            "200 kg'lık bu küçük hava aracı yerden roket destekli olarak ya da başka bir insansız uçaktan havada bırakılarak fırlatılabiliyor. Nisan 2025'te ANKA-3'ten havada bırakılması, jet motorlu bir İHA'dan jet motorlu bir hedef uçağının ilk atışı olarak duyuruldu.",
            "MUM-T düzeninde üçüncü halkayı oluşturur: KAAN yönetir, ANKA-3 taşır ve bırakır, Süper Şimşek en riskli işi üstlenir. Kaybedilmesi göze alınabilecek kadar ucuz olması, kavramın temelidir.",
        ],
        specsTitle: "Bildirilen özellikler",
        rolesTitle: "Görevler",
        roles: [
            { term: "Hedef uçağı", body: "Hava savunma sistemlerinin test ve eğitim atışlarında hedef olur." },
            { term: "Aldatma", body: "Radarda bir savaş uçağı gibi görünerek düşman savunmasını yanıltır." },
            { term: "Elektronik harp", body: "Karıştırma ve hava savunmasını bastırma görevlerinde kullanılabilir." },
            { term: "Kamikaze", body: "35 kg harp başlığıyla hedefe dalan bir dolanan mühimmat gibi çalışır." },
            { term: "Sürü uçuşu", body: "Yapay zekâ destekli sürü uçuşu ile birden fazla hedefe aynı anda yönelebildiği belirtiliyor." },
        ],
        timelineTitle: "Bilinen adımlar",
        timeline: [
            { date: "Nisan 2025", text: "ANKA-3'ten havada bırakma atışı" },
            { date: "Mart 2026", text: "MSB, Süper Şimşek'in Hava Kuvvetleri envanterine girdiğini açıkladı (sayı belirtilmedi)" },
            { date: "Ağustos 2026", text: "TUSAŞ, kanatları altında iki Süper Şimşek taşıyan ANKA-3'ün görüntüsünü paylaştı" },
        ],
        uncertain: "Değerler Mart 2026'daki MSB açıklamasının basına yansıyan hâlidir; TUSAŞ'ın ürün sayfasında yayımlanmış bir teknik tablo yoktur. Menzil için kaynaklar 700 km ile 900 km arasında farklı değerler veriyor, bu yüzden tabloya alınmadı.",
        canvasLabel: "Süper Şimşek'in üç boyutlu modeli",
        dragHint: "Döndürmek için sürükleyin",
        source: "Kaynak: MSB basın toplantısı, 19 Mart 2026 (DonanımHaber ve CNN Türk aktarımı); ANKA-3 atışı, 9 Nisan 2025 haberleri; Army Recognition, Ağustos 2026.",
    },
    en: {
        label: "Süper Şimşek",
        title: "From target drone to kamikaze drone",
        lede: "Süper Şimşek was developed from Şimşek, Turkish Aerospace's jet-powered high-speed target drone. It was first designed as a target for air-defence firings; kamikaze, decoy and electronic-warfare roles were added during development.",
        body: [
            "The 200 kg air vehicle can be launched from the ground with rocket assistance, or released in flight from another uncrewed aircraft. Its release from ANKA-3 in April 2025 was announced as the first launch of a jet-powered target drone from a jet-powered UAV.",
            "In the MUM-T arrangement it forms the third tier: KAAN commands, ANKA-3 carries and releases, Süper Şimşek takes the riskiest job. Being cheap enough to lose is the point of the concept.",
        ],
        specsTitle: "Reported specifications",
        rolesTitle: "Roles",
        roles: [
            { term: "Target drone", body: "Serves as a target in test and training firings of air-defence systems." },
            { term: "Decoy", body: "Looks like a fighter on radar to mislead enemy defences." },
            { term: "Electronic warfare", body: "Can be used for jamming and air-defence suppression." },
            { term: "Kamikaze", body: "Works like a loitering munition, diving onto a target with a 35 kg warhead." },
            { term: "Swarm flight", body: "Reported to use AI-assisted swarm flight to engage several targets at once." },
        ],
        timelineTitle: "Known steps",
        timeline: [
            { date: "April 2025", text: "Released in flight from ANKA-3" },
            { date: "March 2026", text: "Turkish Ministry of Defence announced it had entered Air Force inventory (number not given)" },
            { date: "August 2026", text: "Turkish Aerospace released imagery of an ANKA-3 carrying two Süper Şimşeks under its wings" },
        ],
        uncertain: "Values are from the Turkish Ministry of Defence statement of March 2026 as reported in the press; Turkish Aerospace has not published a specification table on its product page. Sources give range figures between 700 km and 900 km, so range is left out.",
        canvasLabel: "3D model of Süper Şimşek",
        dragHint: "Drag to rotate",
        source: "Source: Turkish Ministry of Defence press briefing, 19 March 2026 (as reported by DonanımHaber and CNN Türk); ANKA-3 release, reports of 9 April 2025; Army Recognition, August 2026.",
    },
};

/* ── 09 Ecosystem ─────────────────────────────────── */

export const ecosystem: L<{
    label: string;
    title: string;
    lede: string;
    statusTitle: string;
    status: { date: string; text: string; note?: string }[];
    colCompany: string;
    colRole: string;
    colItems: string;
    companies: { name: string; role: string; items: string }[];
    source: string;
}> = {
    tr: {
        label: "Sanayi ve takvim",
        title: "Kim ne yapıyor, nerede kaldı",
        lede: "KAAN, ANKA-3 ve Süper Şimşek aynı firmanın ürünü; radar, motor ve mühimmat ise farklı kuruluşlardan geliyor. Aşağıdaki tablo bu sayfada geçen sistemlerle sınırlıdır.",
        statusTitle: "Program durumu",
        status: [
            { date: "28 Ara 2023", text: "ANKA-3 ilk uçuşunu yaptı." },
            { date: "21 Şub 2024", text: "KAAN P0 ilk uçuşunu yaptı (13 dakika)." },
            { date: "Nis 2025", text: "ANKA-3'ten Süper Şimşek havada bırakıldı." },
            { date: "Şub 2026", text: "TUSAŞ, KAAN ve iki ANKA-3'lü MUM-T kavramını World Defense Show'da dijital senaryo olarak gösterdi." },
            { date: "Mar 2026", text: "Süper Şimşek Hava Kuvvetleri envanterine girdi." },
            { date: "May 2026", text: "SAHA 2026'da Hava Kuvvetleri için ilk KAAN sözleşmesi (20 adet Blok 10) imzalandı. Aynı fuarda ANKA-3 seri üretimi için de sözleşme imzalandığı bildirildi.", note: "ANKA-3 için 50'nin üzerinde adet bildirildi" },
            { date: "Tem 2026", text: "ABD, KAAN için F110 motorlarının ihracatına onay verdi (prototipler için 10, seri üretim için 80 motor)." },
            { date: "31 Tem 2026", text: "KAAN P1 ilk düşük hızlı taksisini yaptı." },
            { date: "30 Eyl–4 Eki 2026", text: "TEKNOFEST Şanlıurfa'da KAAN ve ANKA-3'ün tam ölçekli maketleri birlikte sergilendi." },
            { date: "Kas 2026", text: "KAAN P1 henüz uçmadı; ilk uçuşu 2026 sonundan önce hedefleniyor.", note: "hedef" },
            { date: "~2028", text: "KAAN Blok 10 teslimatları hedefleniyor.", note: "hedef" },
        ],
        colCompany: "Kuruluş",
        colRole: "Bu ekipteki payı",
        colItems: "Bu sayfada geçen sistemler",
        companies: [
            { name: "TUSAŞ", role: "Platform tasarımı ve üretimi", items: "KAAN, ANKA-3, Süper Şimşek" },
            { name: "ASELSAN", role: "Sensörler, aviyonik ve mühimmat", items: "MURAD 600-A AESA radarı, TOYGUN EOTS, TULGAR kaska monte gösterge, TOLUN" },
            { name: "TEI", role: "Motor", items: "TF35000 (KAAN için yerli motor; kritik tasarım gözden geçirmesi Şubat 2026, prototip üretimi 2027'den, geçiş 2032 civarı hedefleniyor)" },
            { name: "TÜBİTAK SAGE", role: "Hava-hava füzeleri", items: "GÖKDOĞAN, BOZDOĞAN (KAAN için planlandığı bildiriliyor)" },
            { name: "ROKETSAN", role: "Seyir füzeleri", items: "SOM-J (gövde içi yuvaya göre boyutlandırıldığı bildiriliyor)" },
            { name: "General Electric", role: "İlk blokların motoru", items: "F110-GE-129 (ABD ihracat onayı Temmuz 2026)" },
        ],
        source: "Kaynak: TUSAŞ, SSB ve MSB açıklamaları; basında yer alan program haberleri, Kasım 2026 itibarıyla. ANKA-3 sözleşme adedi resmi olarak teyit edilmemiştir.",
    },
    en: {
        label: "Industry and timeline",
        title: "Who builds what, and where it stands",
        lede: "KAAN, ANKA-3 and Süper Şimşek come from the same company; the radar, engines and munitions come from other organisations. The table is limited to the systems mentioned on this page.",
        statusTitle: "Programme status",
        status: [
            { date: "28 Dec 2023", text: "ANKA-3 made its first flight." },
            { date: "21 Feb 2024", text: "KAAN P0 made its first flight (13 minutes)." },
            { date: "Apr 2025", text: "Süper Şimşek released in flight from ANKA-3." },
            { date: "Feb 2026", text: "Turkish Aerospace showed the KAAN plus two ANKA-3 MUM-T concept as a digital scenario at the World Defense Show." },
            { date: "Mar 2026", text: "Süper Şimşek entered Turkish Air Force inventory." },
            { date: "May 2026", text: "At SAHA 2026 the first Turkish Air Force contract for KAAN (20 Block 10 aircraft) was signed. A serial production contract for ANKA-3 was reported at the same show.", note: "more than 50 ANKA-3 reported" },
            { date: "Jul 2026", text: "The United States cleared the export of F110 engines for KAAN (10 for the prototypes, 80 for series production)." },
            { date: "31 Jul 2026", text: "KAAN P1 made its first slow taxi." },
            { date: "30 Sep–4 Oct 2026", text: "Full-scale KAAN and ANKA-3 mock-ups were shown together at TEKNOFEST in Şanlıurfa." },
            { date: "Nov 2026", text: "KAAN P1 has not flown yet; its first flight is targeted before the end of 2026.", note: "target" },
            { date: "~2028", text: "KAAN Block 10 deliveries targeted.", note: "target" },
        ],
        colCompany: "Organisation",
        colRole: "Part in this team",
        colItems: "Systems on this page",
        companies: [
            { name: "TUSAŞ", role: "Platform design and production", items: "KAAN, ANKA-3, Süper Şimşek" },
            { name: "ASELSAN", role: "Sensors, avionics and munitions", items: "MURAD 600-A AESA radar, TOYGUN EOTS, TULGAR helmet-mounted display, TOLUN" },
            { name: "TEI", role: "Engines", items: "TF35000 (indigenous KAAN engine; critical design review February 2026, prototype production from 2027, switch-over targeted around 2032)" },
            { name: "TÜBİTAK SAGE", role: "Air-to-air missiles", items: "GÖKDOĞAN, BOZDOĞAN (reported as planned for KAAN)" },
            { name: "ROKETSAN", role: "Cruise missiles", items: "SOM-J (reported as sized for the internal bay)" },
            { name: "General Electric", role: "Engines for early blocks", items: "F110-GE-129 (US export clearance July 2026)" },
        ],
        source: "Source: Turkish Aerospace, SSB and Turkish Ministry of Defence statements; programme reporting in the press, as of November 2026. The ANKA-3 contract quantity has not been officially confirmed.",
    },
};

/* ── 10 Videos ────────────────────────────────────── */

export const videos: L<{
    label: string;
    title: string;
    lede: string;
    items: { name: "kaan" | "anka3" | "super-simsek"; title: string; body: string }[];
    rights: string;
}> = {
    tr: {
        label: "Videolar",
        title: "Üç platform, üç kayıt",
        lede: "Videolar ancak oynat'a bastığınızda yüklenir.",
        items: [
            { name: "kaan", title: "KAAN", body: "P0 prototipinin 2024 uçuşlarından görüntüler: kalkış, eskort uçağından çekimler ve frenleme paraşütüyle iniş. TUSAŞ görüntüleri; kamuya açık paylaşımdan." },
            { name: "anka3", title: "ANKA-3", body: "ANKA-3'ün taksi ve uçuş görüntüleri." },
            { name: "super-simsek", title: "Süper Şimşek", body: "Süper Şimşek atış testi; görüntülerde ANKA-3 de yer alıyor." },
        ],
        rights: "Görüntülerin hakları sahiplerine aittir; ayrıntılar Kaynaklar sayfasındadır.",
    },
    en: {
        label: "Videos",
        title: "Three platforms, three recordings",
        lede: "Videos load only when you press play.",
        items: [
            { name: "kaan", title: "KAAN", body: "Footage from the P0 prototype's 2024 flights: take-off, views from the chase aircraft and the brake-chute landing. TUSAŞ footage, from a public release." },
            { name: "anka3", title: "ANKA-3", body: "ANKA-3 taxiing and in flight." },
            { name: "super-simsek", title: "Süper Şimşek", body: "A Süper Şimşek firing test; ANKA-3 also appears." },
        ],
        rights: "Footage rights belong to their owners; details are on the Sources page.",
    },
};
