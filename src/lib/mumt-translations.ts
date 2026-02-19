import type { Locale } from "@/context/LanguageContext";

/* ─── MUM-T page translations ─── */

const t = {
    tr: {
        // Hero / HUD
        hero: {
            subtitle: "TAKTİK VERİ BAĞLANTISI",
            tagline: "KAAN × ANKA-3 UCAV",
            scroll: "SCROLL TO BRIEF",
            designation: "DESIGNATION",
            role: "ROLE",
            datalink: "DATALINK",
            synced: "SYNCED",
            deploying: "DEPLOYING",
        },

        // MumTConcept
        concept: {
            tag: "TAKTİK DOKTRİN",
            title: "MUM-T",
            titleHighlight: "NEDİR?",
            description:
                "İnsanlı-İnsansız Takım Operasyonu (MUM-T), bir pilot tarafından yönetilen insanlı muharip uçak ile insansız savaş uçaklarının koordineli operasyon icra etmesi konseptidir. KAAN muharebe yöneticisi olarak görev yaparken, ANKA-3 platformları sadık kanatçı (loyal wingman) rolünü üstlenir.",
            loiTitle: "INTEROPERABILITY SEVİYELERİ (LOI)",
            conceptSummaryTag: "KONSEPT ÖZETİ",
            conceptSummary:
                "TUSAŞ, 2026 World Defense Show'da KAAN + 2× ANKA-3 konseptini resmi olarak tanıttı. KAAN, muharebe yöneticisi olarak İHA filolarını otonom sürü algoritmalarıyla koordine edecek.",
            svgMissionCmd: "GÖREV KMT",
            svgSensorData: "SENSÖR VERİ",
            svgSwarmCoord: "SÜRÜ KOORD.",
        },
        loiLevels: [
            { title: "Dolaylı Alım", description: "Temel telemetri, İHA'dan dolaylı veri alımı" },
            { title: "Doğrudan Alım", description: "Gerçek zamanlı sensör verisi doğrudan pilota" },
            { title: "Kontrol & Müdahale", description: "Pilot İHA'nın rota ve görevini değiştirebilir" },
            { title: "Tam Yetkilendirme", description: "Silah sistemleri ve görev yönetimi tam kontrol" },
            { title: "Otonom Sürü", description: "AI destekli otonom operasyon, minimum müdahale" },
        ],
        benefits: [
            {
                title: "Durumsal Farkındalık",
                description: "ANKA-3 sensörleri, KAAN pilotunun göremediği alanları tarar. 360° kapsama.",
            },
            {
                title: "Güç Çarpanı",
                description: "Tek pilot, birden fazla platformu yöneterek etkinliği 3× artırır.",
            },
            {
                title: "Risk Azaltma",
                description: "Yüksek tehdit ortamlarına İHA gönderilir, pilot güvende kalır.",
            },
        ],

        // ThreatLandscape
        threat: {
            tag: "A2/AD TEHDİT ORTAMI",
            title: "Neden",
            titleHighlight: "MUM-T?",
            description: "Modern A2/AD ortamında katmanlı hava savunma sistemlerine karşı MUM-T doktrini nasıl nüfuz eder.",
        },
        zones: [
            { label: "Uzun Menzil SAM", description: "S-400 sınıfı uzun menzil sistemleri. KAAN bu bölgeye giriş yapmadan ANKA-3 ve Süper Şimşek ile bastırma uygular." },
            { label: "Orta Menzil SAM", description: "BUK/Kub sınıfı orta menzil sistemleri. ANKA-3 SEAD görevi ile etkisiz hale getirilir." },
            { label: "Kısa Menzil SHORAD", description: "TOR/Pantsir sınıfı yakın alan savunması. Süper Şimşek aldatıcı hedef olarak bu sistemleri çeker." },
            { label: "Hedef Bölge", description: "Yüksek değerli hedef. Koordineli MUM-T taarruzu ile minimum kayıpla imha edilir." },
        ],
        platforms: [
            { role: "Güvenli Bölgede Komuta" },
            { role: "SEAD / ISR İleri Sevk" },
            { role: "Taarruz / EW" },
            { role: "Aldatıcı Hedef" },
            { role: "Kinetik Saldırı" },
        ],

        // AvionicsShowcase
        avionics: {
            tag: "AVİYONİK PAKET",
            title: "Aviyonik",
            titleHighlight: "Sistemler",
            description: "5. nesil savaş yönetim sistemi — tüm sensör ve veri kaynakları birleşik taktik ekranda füzyon edilerek pilota benzersiz durumsal farkındalık sağlar.",
        },
        avionicSystems: [
            {
                name: "Aktif Elektronik Taramalı Dizi Radar",
                description: "GaN tabanlı, çoklu mod AESA radar sistemi. Eş zamanlı hava-hava ve hava-yer angajman, SAR haritalama, hedef takibi ve entegre elektronik harp fonksiyonları sunar.",
                specs: [
                    { label: "Teknoloji", value: "GaN Dijital Beamforming" },
                    { label: "Tespit Menzili", value: "200+ km" },
                    { label: "Tarama", value: "Çok Modlu Eş Zamanlı" },
                    { label: "SAR", value: "Yüksek Çözünürlük" },
                ],
            },
            {
                name: "Entegre Elektro-Optik Sistem",
                description: "Kızılötesi Arama-Takip (IRST), Dağıtık Açıklık Sensörü (DAS) ve Elektro-Optik Hedefleme Sistemi (EOTS). Pasif hedef tespiti, 360° durumsal farkındalık ve gece/gündüz görüntüleme sağlar.",
                specs: [
                    { label: "IRST", value: "Pasif Uzun Menzil Tespit" },
                    { label: "DAS", value: "360° Küresel İzleme" },
                    { label: "EOTS", value: "Gece/Gündüz Hedefleme" },
                    { label: "MWS", value: "IR Füze Uyarısı" },
                ],
            },
            {
                name: "Yerli Uçuş Veri Bağlantısı",
                description: "ANKA-3 ve KIZILELMA ile düşük gözlemlenebilir iletişim sağlayan yerli data link. Link-16 uyumu, SATCOM tabanlı taktik ağ entegrasyonu ve 100+ km kooperatif hedefleme desteği.",
                specs: [
                    { label: "IVDL", value: "Stealthy MUM-T Bağlantısı" },
                    { label: "Link-16", value: "NATO Uyumlu" },
                    { label: "T-Link", value: "Taktik Bilgi Değişimi" },
                    { label: "BVR Destek", value: "100+ km Kooperatif" },
                ],
            },
            {
                name: "Elektronik Harp ve Savunma Paketi",
                description: "Katmanlı savunma: Radar Uyarı Alıcısı (RWR), Füze Uyarı Sensörleri (MWS), Lazer Uyarı Alıcısı (LWR), karşı tedbir dağıtıcıları ve IRFS geniş bant spektrum izleme sistemi.",
                specs: [
                    { label: "RWR", value: "Geniş Bant Radar Uyarısı" },
                    { label: "MWS", value: "Füze Yaklaşma Tespiti" },
                    { label: "LWR", value: "Lazer Tehdit Uyarısı" },
                    { label: "IRFS", value: "Yönlü Karıştırma" },
                ],
            },
            {
                name: "Görev Bilgisayarı ve Sensör Füzyon",
                description: "Tüm sensör verilerinin AI tabanlı füzyonu. Otonom hedef tespit/takip, tehdit önceliklendirme ve pilot karar destek sistemi. ANKA-3 sürü yönetim arayüzü.",
                specs: [
                    { label: "İşlemci", value: "Çok Çekirdekli SoC" },
                    { label: "AI", value: "Hedef Tanıma / Takip" },
                    { label: "Füzyon", value: "Çoklu Sensör Korelasyon" },
                    { label: "Sürü", value: "MUM-T Yönetim Paneli" },
                ],
            },
            {
                name: "Haberleşme ve Ağ Entegrasyonu",
                description: "Şifreli ses/veri haberleşmesi, SATCOM bağlantısı ve NATO STANAG uyumlu mesajlaşma. Gerçek zamanlı taktik resim paylaşımı.",
                specs: [
                    { label: "V/UHF", value: "Şifreli Ses" },
                    { label: "SATCOM", value: "Uydu Veri Bağlantısı" },
                    { label: "STANAG", value: "NATO Uyumlu" },
                    { label: "COP", value: "Ortak Operasyonel Resim" },
                ],
            },
        ],

        // GenerationCompare
        genCompare: {
            tag: "NESİL FARKI",
            title: "Geleneksel vs",
            titleHighlight: "MUM-T",
            traditional: "Geleneksel",
            description: "İnsansız-insanlı takım konsepti, hava operasyonlarının her boyutunu dönüştürüyor.",
        },
        compareRows: [
            { label: "Pilot Riski", traditional: "Yüksek — Tüm görevlerde pilot tehdit altında", mumt: "Minimum — UCAV'lar tehlikeli görevleri üstlenir" },
            { label: "ISR Kapsamı", traditional: "Sınırlı — Tek platformun sensör açısı", mumt: "360° Sürekli — Çoklu platform sensör füzyonu" },
            { label: "Sorti Maliyeti", traditional: "Yüksek — İnsan ve platform maliyeti", mumt: "Optimize — UCAV'lar düşük maliyetli tamamlayıcı" },
            { label: "EW Kapasitesi", traditional: "Tekil — Bir platformun EW gücü", mumt: "Dağıtık — Sürü halinde çok katmanlı EW" },
            { label: "Tepki Süresi", traditional: "Dakikalar — Manuel karar döngüsü", mumt: "Saniyeler — AI destekli otonom koordinasyon" },
            { label: "Kayıp Toleransı", traditional: "Kritik — Her kayıp stratejik darbe", mumt: "Kabul Edilebilir — Harcanabilir UCAV doktrini" },
        ],

        // MissionTimeline
        timeline: {
            tag: "GÖREV AKIŞI",
            title: "GÖREV",
            titleHighlight: "ZAMAN ÇİZELGESİ",
            scrollHint: "Aşağı kaydırarak MUM-T görev senaryosunun 5 fazını keşfedin",
        },
        phases: [
            { codename: "KARTAL GÖZCÜ", title: "ISR Tarama", platformFocus: "ANKA-3 ALPHA", description: "ANKA-3 Alpha, operasyon bölgesinde 40.000 ft yükseklikte keşif uçuşu icra eder. Elektro-optik ve SAR sensörleriyle geniş alan taraması yaparak tüm hedef verilerini şifreli data bağlantısı üzerinden KAAN kokpitine aktarır." },
            { codename: "ELEKTRİK FIRTINASI", title: "SEAD Operasyonu", platformFocus: "ANKA-3 BRAVO", description: "ANKA-3 Bravo, düşman hava savunma radarlarını tespit ederek elektronik karıştırma ve aldatma operasyonu başlatır. Anti-radyasyon mühimmatıyla SAM mevzilerini etkisiz hale getirerek KAAN'ın güvenli geçiş koridoru oluşturur." },
            { codename: "ÇELİK YUMRUK", title: "Hassas Taarruz", platformFocus: "KAAN + ANKA-3", description: "Koordineli eşzamanlı saldırı. Her iki ANKA-3 dahili silah yuvasından TOLUN güdümlü mühimmat atışı yaparken, KAAN yüksek değerli komuta-kontrol hedeflerini SOM-J ile imha eder. Tüm atışlar AI destekli zamanlama ile senkronize edilir." },
            { codename: "SESSIZ GECE", title: "Elektronik Harp", platformFocus: "ANKA-3 BRAVO", description: "Geniş spektrumlu iletişim karıştırma başlatılır. Süper Şimşek yem İHA'lar fırlatılarak düşman hava savunmasının dikkatini dağıtır. Tüm düşman haberleşme ağı baskı altına alınarak taarruz sonrası bölge kontrolü sağlanır." },
            { codename: "EVE DÖNÜŞ", title: "Çekilme & Raporlama", platformFocus: "TÜM PLATFORMLAR", description: "Görev tamamlandıktan sonra tüm platformlar formasyon uçuşuyla güvenli bölgeye çekilir. Görev raporu otomatik olarak karargaha aktarılır. Hasar değerlendirme verileri analiz için kaydedilir." },
        ],

        // ScenarioSimulator
        scenario: {
            tag: "GÖREV SİMÜLATÖRÜ",
            title: "Senaryo",
            titleHighlight: "Simülasyonu",
            description: "Bir senaryo seçin ve MUM-T operasyonunu adım adım izleyin.",
            nextStep: "SONRAKİ ADIM",
            reset: "SIFIRLA",
            step: "ADIM",
        },
        scenarios: [
            {
                name: "SEAD Görevi",
                description: "Düşman hava savunma sistemlerinin bastırılması. ANKA-3 SAM tespiti, Süper Şimşek aldatma, KAAN koordineli taarruz.",
                steps: [
                    { action: "Görev Emri", detail: "KAAN güvenli bölgeden formasyon komutu yayınlar. Link-16 üzerinden görev parametreleri aktarılır." },
                    { action: "SAM Tespiti", detail: "ANKA-3 α ileri sevk edilir. Pasif ESM/ELINT sensörleri ile düşman radar emisyonları tespit ve tanımlanır." },
                    { action: "Aldatma Operasyonu", detail: "Süper Şimşek aldatıcı hedef modunda fırlatılır. Kendi RCS imzasıyla düşman SAM sistemlerini kilitlenmeye zorlar." },
                    { action: "SEAD Taarruz", detail: "SAM radarı aktive olduğu an ANKA-3 β ARM (Anti-Radyasyon Mühimmat) fırlatır. SAM bataryası etkisiz hale getirilir." },
                    { action: "Sonuç Değerlendirme", detail: "KAAN sensör füzyonu ile taarruz sonucunu doğrular. Kazanım IVDL üzerinden komuta merkezine raporlanır." },
                ],
            },
            {
                name: "Derin Taarruz",
                description: "Yüksek değerli hedefe koordineli saldırı. Sensör füzyon, gerçek zamanlı hedef güncelleme, çoklu platform koordinasyonu.",
                steps: [
                    { action: "Hedef Tahsisi", detail: "MURAD AESA radar ile uzun menzil hedef tespiti. AI destekli sensör füzyon ile koordinat doğrulaması yapılır." },
                    { action: "ISR Keşif", detail: "ANKA-3 α SAR/GMTI modunda hedef bölgesine yaklaşır. Gerçek zamanlı görüntü IVDL üzerinden KAAN'a aktarılır." },
                    { action: "Koordinat Güncelleme", detail: "ISR verisi ile MURAD AESA verisinin füzyonu. Hedef koordinatları güncellenir ve taarruz planı kesinleştirilir." },
                    { action: "Stand-Off Atış", detail: "ANKA-3 β dahili silah yuvalarından SOM/TOLUN mühimmatı fırlatır. Hedef stand-off mesafeden angaje edilir." },
                    { action: "BDA & Takip", detail: "Süper Şimşek ISR modunda taarruz sonucu değerlendirir. Hasar analizi KAAN'a raporlanır." },
                ],
            },
            {
                name: "Keşif & Gözetleme",
                description: "Geniş alan keşif ve sürekli gözetleme operasyonu. Çoklu sensör platform koordinasyonu ile 360° ISR kapasitesi.",
                steps: [
                    { action: "Görev Planlama", detail: "Misyon bilgisayarı AO (Area of Operations) tanımlar. ANKA-3 ve Süper Şimşek uçuş rotaları oluşturulur." },
                    { action: "SAR Tarama", detail: "ANKA-3 α yüksek çözünürlüklü SAR tarama gerçekleştirir. Geniş alan haritası ve anomali tespiti yapılır." },
                    { action: "Nokta Keşif", detail: "Süper Şimşek ISR modunda ilgi noktalarına yakın geçiş yapar. Detaylı EO/IR görüntüler toplanır." },
                    { action: "SIGINT Toplama", detail: "ANKA-3 β SIGINT/COMINT sensörleri ile sinyal istihbaratı toplar. Veri IVDL üzerinden anlaşılır." },
                    { action: "İstihbarat Füzyon", detail: "Tüm platform verilerinin AI tabanlı füzyonu. Birleşik istihbarat raporu komuta merkezine iletilir." },
                ],
            },
        ],

        // PlatformCompare
        platformCompare: {
            tag: "PLATFORM KIYASLAMASI",
            title: "Platform",
            titleHighlight: "Karşılaştırma",
        },
        specs: [
            { label: "ROL", kaan: "5. Nesil Muharip", anka: "Stealth İHA" },
            { label: "KANAT AÇIKLIĞI", kaan: "14 m", anka: "12.5 m" },
            { label: "MAKSİMUM HIZ", kaan: "Mach 1.8+", anka: "Mach 0.7" },
            { label: "SERVİS TAVANI", kaan: "55,000 ft", anka: "40,000 ft" },
            { label: "DAYANIKLILIK", kaan: "—", anka: "10 saat" },
            { label: "MOTOR", kaan: "2× TEI TF-35000", anka: "1× AI-322" },
            { label: "FAYDALIYÜK", kaan: "Dahili + Harici", anka: "1,200 kg" },
        ],

        // DataLinkDiagram
        datalink: {
            tag: "VERİ BAĞLANTISI",
            title: "Taktik",
            titleHighlight: "Veri Akışı",
        },
        dataLinks: [
            { label: "Hedef Tahsisi" },
            { label: "Sensör Paylaşımı" },
            { label: "Görev Komutu" },
            { label: "Durum Raporu" },
            { label: "Sürü Koordinasyonu" },
            { label: "Tehdit Uyarısı" },
        ],

        // MumTStats
        stats: {
            tag: "OPERASYONEL METRİKLER",
            title: "Rakamlarla",
            titleHighlight: "MUM-T",
        },
        statItems: [
            { label: "NESİL", sublabel: "Muharip Jet Sınıfı" },
            { label: "ANKA-3", sublabel: "Otonom İHA Filosu" },
            { label: "GÖREV", sublabel: "Süper Şimşek Profili" },
            { label: "KM", sublabel: "Otonom Operasyon Menzili" },
            { label: "KM", sublabel: "MURAD AESA Tespit" },
            { label: "KG", sublabel: "ANKA-3 Faydalı Yük" },
        ],

        // CapabilityCards
        capability: {
            tag: "GÖREV PROFİLLERİ",
            title: "ANKA-3",
            titleHighlight: "KABİLİYETLERİ",
        },
        roles: [
            { title: "Keşif & Gözetleme", description: "ANKA-3, 40.000 ft yükseklikte 10 saate kadar süzülerek elektro-optik ve SAR sensörleriyle geniş alan taraması yapar. Veriler anlık olarak KAAN kokpitine aktarılır." },
            { title: "Hava Savunma Bastırma", description: "Düşman radar ve SAM mevzilerini tespit ederek anti-radyasyon mühimmatıyla etkisiz hale getirir. KAAN'ın güvenli operasyon alanını genişletir." },
            { title: "Hassas Taarruz", description: "Dahili silah yuvasından TOLUN güdümlü mühimmat atışı kapasitesi. 1.200 kg faydalı yük ile yüksek değerli hedeflere koordineli saldırı." },
            { title: "Elektronik Harp", description: "Geniş spektrumlu iletişim karıştırma ve aldatma operasyonları. Süper Şimşek yem İHA'lar ile düşman hava savunmasını yanıltır." },
        ],

        // SuperSimsekShowcase
        simsek: {
            tag: "OTONOM KOL UÇUCUSU",
            title: "Süper",
            titleHighlight: "Şimşek",
            description: "TUSAŞ'ın jet motorlu otonom muharip İHA'sı. Düşük maliyetli, harcanabilir ve sürü operasyonuna uygun sadık kanatçı platformu.",
            extendedDescription: "TUSAŞ tarafından geliştirilen jet motorlu otonom hava aracı, ANKA-3 platformundan havadan fırlatılarak 11 farklı görev profilinde operasyon yeteneği sunar. MUM-T doktrini içinde KAAN'\u0131n komutasıyla koordineli çalışarak savaş alanı hakimiyetini artırır.",
        },
        simsekSpecs: [
            { tag: "HIZ", value: "MACH 0.9", unit: "Yüksek Ses Altı" },
            { tag: "MENZİL", value: "700+", unit: "km · Havadan Fırlatma" },
            { tag: "AĞIRLIK", value: "~200", unit: "kg · Kompakt Form" },
            { tag: "HARP BAŞLIĞI", value: "20–50", unit: "kg · Modüler" },
            { tag: "GÖREV", value: "11", unit: "Farklı Görev Profili" },
            { tag: "GELİŞTİRİCİ", value: "TUSAŞ", unit: "Türk Havacılık ve Uzay" },
        ],
        simsekMissions: [
            { title: "Aldatıcı Hedef", desc: "Düşman hava savunma radarlarını yanıltarak asıl taarruz unsurlarının korunmasını sağlar." },
            { title: "Elektronik Harp", desc: "Geniş spektrumlu karıştırma ve elektronik taarruz görevleri ile düşman iletişimini felç eder." },
            { title: "Keşif & Gözetleme", desc: "Yüksek tehdit bölgelerinde gerçek zamanlı istihbarat toplama ve hedef tespit görevi yapar." },
            { title: "Kinetik Saldırı", desc: "Modüler harp başlığı ile yüksek değerli hedeflere hassas kinetik taarruz uygular." },
            { title: "SEAD Desteği", desc: "Düşman SAM sistemlerini tespit ederek taarruz unsurlarının güvenli geçişini sağlar." },
        ],
        simsekChain: [
            { platform: "KAAN", role: "Komuta & Kontrol", tag: "MMU" },
            { platform: "ANKA-3", role: "Fırlatma Platformu", tag: "MİUS" },
            { platform: "SÜPER ŞİMŞEK", role: "Otonom İcra", tag: "OKU" },
        ],

        // MunitionsShowcase
        munitions: {
            tag: "MİLLİ MÜHİMMAT",
            title: "KAAN",
            titleHighlight: "Cephaneliği",
            description: "MSB AR-GE Merkezi tarafından geliştirilen, KAAN'dan atılabilecek yerli ve milli stratejik mühimmatlar.",
        },
        gazap: {
            name: "GAZAP",
            type: "Termobarik FAE Bombası",
            description: "Türkiye'nin en güçlü konvansiyonel havadan atılan bombası. Patlama anında atmosferdeki oksijeni de kullanarak yüksek basınç ve ısı üreten şok dalgası oluşturur. Sığınaklar, bunkerler ve yeraltı tesislerine karşı yıkıcı etki sağlar.",
            specs: [
                { label: "AĞIRLIK", value: "~970 kg" },
                { label: "TİP", value: "Termobarik / FAE" },
                { label: "PARÇACIK", value: "10.000+" },
                { label: "ETKİ ALANI", value: "150–200 m" },
                { label: "GELİŞTİRİCİ", value: "MSB AR-GE" },
                { label: "PLATFORM", value: "KAAN · F-16 · İHA" },
            ],
        },
        hayalet: {
            name: "HAYALET",
            type: "Bunker Delici Penetrasyon Bombası",
            description: "90 metre derinliğe ulaşabilen ve 7 metre betonarmeyi delebilen, nükleer sığınak sınıfı korumalara etkili yerli bunker delici bomba. C50 kalite betonu ve 25 mm nervürlü çelik kafesli yapıları delme kapasitesine sahiptir.",
            specs: [
                { label: "AĞIRLIK", value: "~1.000 kg" },
                { label: "TİP", value: "Bunker Delici" },
                { label: "DERİNLİK", value: "90 m" },
                { label: "BETON PEN.", value: "7 m (C50)" },
                { label: "GELİŞTİRİCİ", value: "MSB AR-GE" },
                { label: "PLATFORM", value: "KAAN · F-16 · F-4" },
            ],
        },
        ecosystem: {
            tag: "YERLİ EKOSİSTEM",
            title: "Türk Savunma",
            titleHighlight: "Sanayii",
            description: "KAAN ekosistemini besleyen yerli savunma sanayii firmaları ve katkıları.",
        },
        companies: [
            { role: "Platform Tasarım & Üretim" },
            { role: "Aviyonik & Elektronik Harp" },
            { role: "Mühimmat & Füze Sistemleri" },
            { role: "Motor Geliştirme" },
            { role: "Yazılım & Hesaplama" },
            { role: "Simülasyon & Görev Sistemleri" },
        ],
        companyProducts: [
            ["KAAN", "ANKA-3", "HÜRJET", "Süper Şimşek"],
            ["MURAD AESA", "IVDL", "T-Link", "EW Paketi"],
            ["GÖKDOĞAN", "BOZDOĞAN", "SOM", "TOLUN"],
            ["TF-10000", "TF-35000", "TS-1400"],
            ["Aviyonik Bilgisayar", "Arayüz Üniteleri", "Kripto"],
            ["Görev Bilgisayarı", "Simülatör", "Eğitim Sistemi"],
        ],

        // VideoGallery
        videoGallery: {
            tag: "MEDYA GALERİSİ",
            title: "Video",
            titleHighlight: "Arşiv",
        },
        videos: [
            { title: "KAAN Uçuş Görüntüleri", description: "Türkiye'nin 5. nesil muharip jeti KAAN'ın uçuş ve manevra görüntüleri." },
            { title: "ANKA-3 Test Uçuşu", description: "Stealth İHA ANKA-3'ün otonom test uçuşu ve uçuş performansı." },
            { title: "Süper Şimşek Otonom Uçuş", description: "Jet motorlu otonom wingman Süper Şimşek'in test ve görev profili." },
        ],

        // MumTFooter
        footer: {
            abort: "GÖREVE SON VER",
            developedBy: "Geliştirici",
            model3d: "3D Model:",
            copyright: "© 2026 KAAN Experience — Hayran Projesi // Ticari Değil",
        },

        // FormationControls
        formation: {
            title: "CMD",
        },
    },

    en: {
        hero: {
            subtitle: "TACTICAL DATA LINK",
            tagline: "KAAN × ANKA-3 UCAV",
            scroll: "SCROLL TO BRIEF",
            designation: "DESIGNATION",
            role: "ROLE",
            datalink: "DATALINK",
            synced: "SYNCED",
            deploying: "DEPLOYING",
        },

        concept: {
            tag: "TACTICAL DOCTRINE",
            title: "MUM-T",
            titleHighlight: "EXPLAINED",
            description:
                "Manned-Unmanned Teaming (MUM-T) is a doctrine where a manned fighter aircraft, commanded by a single pilot, operates in coordination with unmanned combat aerial vehicles. KAAN serves as the battle manager while ANKA-3 platforms act as loyal wingmen.",
            loiTitle: "INTEROPERABILITY LEVELS (LOI)",
            conceptSummaryTag: "CONCEPT SUMMARY",
            conceptSummary:
                "TUSAŞ officially unveiled the KAAN + 2× ANKA-3 concept at the 2026 World Defense Show. KAAN will coordinate UAV formations using autonomous swarm algorithms as the battle manager.",
            svgMissionCmd: "MISSION CMD",
            svgSensorData: "SENSOR DATA",
            svgSwarmCoord: "SWARM COORD.",
        },
        loiLevels: [
            { title: "Indirect Receipt", description: "Basic telemetry, indirect data from UAV" },
            { title: "Direct Receipt", description: "Real-time sensor data directly to pilot" },
            { title: "Control & Intervention", description: "Pilot can modify UAV route and mission" },
            { title: "Full Authorization", description: "Full control of weapons and mission management" },
            { title: "Autonomous Swarm", description: "AI-powered autonomous operations, minimal intervention" },
        ],
        benefits: [
            {
                title: "Situational Awareness",
                description: "ANKA-3 sensors scan areas beyond the KAAN pilot's view. 360° coverage.",
            },
            {
                title: "Force Multiplier",
                description: "A single pilot manages multiple platforms, increasing effectiveness 3×.",
            },
            {
                title: "Risk Reduction",
                description: "UAVs are sent into high-threat environments, keeping the pilot safe.",
            },
        ],

        threat: {
            tag: "A2/AD THREAT ENVIRONMENT",
            title: "Why",
            titleHighlight: "MUM-T?",
            description: "How MUM-T doctrine penetrates layered air defense systems in modern A2/AD environments.",
        },
        zones: [
            { label: "Long Range SAM", description: "S-400 class long-range systems. KAAN suppresses with ANKA-3 and Süper Şimşek without entering this zone." },
            { label: "Medium Range SAM", description: "BUK/Kub class medium-range systems. Neutralized by ANKA-3 SEAD missions." },
            { label: "Short Range SHORAD", description: "TOR/Pantsir class close-area defense. Süper Şimşek acts as decoy to attract these systems." },
            { label: "Target Zone", description: "High-value target. Destroyed with minimal losses via coordinated MUM-T strike." },
        ],
        platforms: [
            { role: "Command from Safe Zone" },
            { role: "SEAD / ISR Forward Deploy" },
            { role: "Strike / EW" },
            { role: "Decoy Target" },
            { role: "Kinetic Strike" },
        ],

        avionics: {
            tag: "AVIONICS SUITE",
            title: "Avionics",
            titleHighlight: "Systems",
            description: "5th generation battle management system — all sensor and data sources are fused on a unified tactical display, providing the pilot with unparalleled situational awareness.",
        },
        avionicSystems: [
            {
                name: "Active Electronically Scanned Array Radar",
                description: "GaN-based multi-mode AESA radar. Simultaneous air-to-air and air-to-ground engagement, SAR mapping, target tracking, and integrated electronic warfare functions.",
                specs: [
                    { label: "Technology", value: "GaN Digital Beamforming" },
                    { label: "Detection Range", value: "200+ km" },
                    { label: "Scan", value: "Multi-Mode Simultaneous" },
                    { label: "SAR", value: "High Resolution" },
                ],
            },
            {
                name: "Integrated Electro-Optical System",
                description: "Infrared Search & Track (IRST), Distributed Aperture Sensor (DAS) and Electro-Optical Targeting System (EOTS). Passive target detection, 360° situational awareness and day/night imaging.",
                specs: [
                    { label: "IRST", value: "Passive Long-Range Detection" },
                    { label: "DAS", value: "360° Spherical Surveillance" },
                    { label: "EOTS", value: "Day/Night Targeting" },
                    { label: "MWS", value: "IR Missile Warning" },
                ],
            },
            {
                name: "Indigenous Flight Data Link",
                description: "Low-observable communication link for ANKA-3 coordination. Link-16 compatibility, SATCOM-based tactical network integration and 100+ km cooperative targeting support.",
                specs: [
                    { label: "IVDL", value: "Stealthy MUM-T Link" },
                    { label: "Link-16", value: "NATO Compatible" },
                    { label: "T-Link", value: "Tactical Information Exchange" },
                    { label: "BVR Support", value: "100+ km Cooperative" },
                ],
            },
            {
                name: "Electronic Warfare & Defense Suite",
                description: "Layered defense: Radar Warning Receiver (RWR), Missile Warning Sensors (MWS), Laser Warning Receiver (LWR), countermeasure dispensers and IRFS broadband spectrum monitoring.",
                specs: [
                    { label: "RWR", value: "Wideband Radar Warning" },
                    { label: "MWS", value: "Missile Approach Detection" },
                    { label: "LWR", value: "Laser Threat Warning" },
                    { label: "IRFS", value: "Directional Jamming" },
                ],
            },
            {
                name: "Mission Computer & Sensor Fusion",
                description: "AI-based fusion of all sensor data. Autonomous target detection/tracking, threat prioritization and pilot decision support system. ANKA-3 swarm management interface.",
                specs: [
                    { label: "Processor", value: "Multi-Core SoC" },
                    { label: "AI", value: "Target Recognition/Tracking" },
                    { label: "Fusion", value: "Multi-Sensor Correlation" },
                    { label: "Swarm", value: "MUM-T Management Panel" },
                ],
            },
            {
                name: "Communications & Network Integration",
                description: "Encrypted voice/data communications, SATCOM connectivity and NATO STANAG-compliant messaging. Real-time tactical picture sharing.",
                specs: [
                    { label: "V/UHF", value: "Encrypted Voice" },
                    { label: "SATCOM", value: "Satellite Data Link" },
                    { label: "STANAG", value: "NATO Compatible" },
                    { label: "COP", value: "Common Operational Picture" },
                ],
            },
        ],

        genCompare: {
            tag: "GENERATION GAP",
            title: "Traditional vs",
            titleHighlight: "MUM-T",
            traditional: "Traditional",
            description: "The manned-unmanned teaming concept is transforming every dimension of air operations.",
        },
        compareRows: [
            { label: "Pilot Risk", traditional: "High — Pilot under threat in all missions", mumt: "Minimal — UCAVs undertake dangerous missions" },
            { label: "ISR Coverage", traditional: "Limited — Single platform sensor angle", mumt: "360° Continuous — Multi-platform sensor fusion" },
            { label: "Sortie Cost", traditional: "High — Human and platform cost", mumt: "Optimized — UCAVs as low-cost supplements" },
            { label: "EW Capacity", traditional: "Single — One platform's EW power", mumt: "Distributed — Multi-layered swarm EW" },
            { label: "Response Time", traditional: "Minutes — Manual decision cycle", mumt: "Seconds — AI-powered autonomous coordination" },
            { label: "Loss Tolerance", traditional: "Critical — Each loss is a strategic blow", mumt: "Acceptable — Expendable UCAV doctrine" },
        ],

        timeline: {
            tag: "MISSION FLOW",
            title: "MISSION",
            titleHighlight: "TIMELINE",
            scrollHint: "Scroll down to explore the 5 phases of the MUM-T mission scenario",
        },
        phases: [
            { codename: "EAGLE WATCH", title: "ISR Sweep", platformFocus: "ANKA-3 ALPHA", description: "ANKA-3 Alpha conducts reconnaissance at 40,000 ft over the operations area. It performs wide-area scanning with electro-optical and SAR sensors, transmitting all target data to the KAAN cockpit via encrypted data link." },
            { codename: "ELECTRIC STORM", title: "SEAD Operation", platformFocus: "ANKA-3 BRAVO", description: "ANKA-3 Bravo detects enemy air defense radars and initiates electronic jamming and deception operations. It neutralizes SAM positions with anti-radiation munitions, clearing a safe passage corridor for KAAN." },
            { codename: "STEEL FIST", title: "Precision Strike", platformFocus: "KAAN + ANKA-3", description: "Coordinated simultaneous attack. Both ANKA-3s launch TOLUN guided munitions from internal bays while KAAN destroys high-value command-control targets with SOM-J. All launches are synchronized via AI-assisted timing." },
            { codename: "SILENT NIGHT", title: "Electronic Warfare", platformFocus: "ANKA-3 BRAVO", description: "Broadband communications jamming is initiated. Süper Şimşek decoy UAVs are launched to distract enemy air defenses. The entire enemy communications network is suppressed for post-strike area control." },
            { codename: "HOMEBOUND", title: "Withdrawal & Report", platformFocus: "ALL PLATFORMS", description: "After mission completion, all platforms withdraw to the safe zone in formation flight. Mission report is automatically transmitted to headquarters. Battle damage assessment data is recorded for analysis." },
        ],

        scenario: {
            tag: "MISSION SIMULATOR",
            title: "Scenario",
            titleHighlight: "Simulation",
            description: "Select a scenario and follow the MUM-T operation step by step.",
            nextStep: "NEXT STEP",
            reset: "RESET",
            step: "STEP",
        },
        scenarios: [
            {
                name: "SEAD Mission",
                description: "Suppression of enemy air defense systems. ANKA-3 SAM detection, Süper Şimşek decoy, KAAN coordinated strike.",
                steps: [
                    { action: "Mission Order", detail: "KAAN broadcasts formation command from safe zone. Mission parameters transmitted via Link-16." },
                    { action: "SAM Detection", detail: "ANKA-3 α is forward deployed. Passive ESM/ELINT sensors detect and identify enemy radar emissions." },
                    { action: "Decoy Operation", detail: "Süper Şimşek launched in decoy target mode. Forces enemy SAM systems to lock on using its own RCS signature." },
                    { action: "SEAD Strike", detail: "The moment SAM radar activates, ANKA-3 β launches ARM (Anti-Radiation Munition). SAM battery is neutralized." },
                    { action: "Battle Damage Assessment", detail: "KAAN confirms strike results via sensor fusion. Results reported to command center via IVDL." },
                ],
            },
            {
                name: "Deep Strike",
                description: "Coordinated attack on high-value target. Sensor fusion, real-time target update, multi-platform coordination.",
                steps: [
                    { action: "Target Assignment", detail: "Long-range target detection with MURAD AESA radar. Coordinate verification via AI-assisted sensor fusion." },
                    { action: "ISR Recon", detail: "ANKA-3 α approaches target area in SAR/GMTI mode. Real-time imagery transmitted to KAAN via IVDL." },
                    { action: "Coordinate Update", detail: "Fusion of ISR data with MURAD AESA data. Target coordinates updated and strike plan finalized." },
                    { action: "Stand-Off Strike", detail: "ANKA-3 β launches SOM/TOLUN munitions from internal weapon bays. Target engaged from stand-off range." },
                    { action: "BDA & Track", detail: "Süper Şimşek evaluates strike results in ISR mode. Damage analysis reported to KAAN." },
                ],
            },
            {
                name: "Recon & Surveillance",
                description: "Wide-area reconnaissance and continuous surveillance operation. 360° ISR capacity with multi-sensor platform coordination.",
                steps: [
                    { action: "Mission Planning", detail: "Mission computer defines AO (Area of Operations). ANKA-3 and Süper Şimşek flight routes are generated." },
                    { action: "SAR Sweep", detail: "ANKA-3 α performs high-resolution SAR scanning. Wide-area mapping and anomaly detection are conducted." },
                    { action: "Point Recon", detail: "Süper Şimşek makes close passes to points of interest in ISR mode. Detailed EO/IR imagery is collected." },
                    { action: "SIGINT Collection", detail: "ANKA-3 β collects signal intelligence with SIGINT/COMINT sensors. Data analyzed via IVDL." },
                    { action: "Intelligence Fusion", detail: "AI-based fusion of all platform data. Combined intelligence report transmitted to command center." },
                ],
            },
        ],

        platformCompare: {
            tag: "PLATFORM COMPARISON",
            title: "Platform",
            titleHighlight: "Comparison",
        },
        specs: [
            { label: "ROLE", kaan: "5th Gen Fighter", anka: "Stealth UCAV" },
            { label: "WINGSPAN", kaan: "14 m", anka: "12.5 m" },
            { label: "MAX SPEED", kaan: "Mach 1.8+", anka: "Mach 0.7" },
            { label: "SERVICE CEILING", kaan: "55,000 ft", anka: "40,000 ft" },
            { label: "ENDURANCE", kaan: "—", anka: "10 hours" },
            { label: "ENGINE", kaan: "2× TEI TF-35000", anka: "1× AI-322" },
            { label: "PAYLOAD", kaan: "Internal + External", anka: "1,200 kg" },
        ],

        datalink: {
            tag: "DATA LINK",
            title: "Tactical",
            titleHighlight: "Data Flow",
        },
        dataLinks: [
            { label: "Target Assignment" },
            { label: "Sensor Sharing" },
            { label: "Mission Command" },
            { label: "Status Report" },
            { label: "Swarm Coordination" },
            { label: "Threat Warning" },
        ],

        stats: {
            tag: "OPERATIONAL METRICS",
            title: "MUM-T in",
            titleHighlight: "Numbers",
        },
        statItems: [
            { label: "GEN", sublabel: "Fighter Jet Class" },
            { label: "ANKA-3", sublabel: "Autonomous UCAV Fleet" },
            { label: "MISSION", sublabel: "Süper Şimşek Profile" },
            { label: "KM", sublabel: "Autonomous Op. Range" },
            { label: "KM", sublabel: "MURAD AESA Detection" },
            { label: "KG", sublabel: "ANKA-3 Payload" },
        ],

        capability: {
            tag: "MISSION PROFILES",
            title: "ANKA-3",
            titleHighlight: "CAPABILITIES",
        },
        roles: [
            { title: "Recon & Surveillance", description: "ANKA-3 loiters at 40,000 ft for up to 10 hours, scanning wide areas with electro-optical and SAR sensors. Data is transmitted to the KAAN cockpit in real-time." },
            { title: "Air Defense Suppression", description: "Detects and neutralizes enemy radar and SAM positions with anti-radiation munitions. Expands KAAN's safe operating area." },
            { title: "Precision Strike", description: "Guided munition capability from internal weapon bay. Coordinated attack on high-value targets with 1,200 kg payload." },
            { title: "Electronic Warfare", description: "Broadband communication jamming and deception operations. Deceives enemy air defenses with Süper Şimşek decoy UAVs." },
        ],

        simsek: {
            tag: "AUTONOMOUS WINGMAN",
            title: "Süper",
            titleHighlight: "Şimşek",
            description: "TUSAŞ's jet-powered autonomous combat UAV. A low-cost, expendable loyal wingman platform designed for swarm operations.",
            extendedDescription: "A jet-powered autonomous air vehicle developed by TUSAŞ, air-launched from the ANKA-3 platform with capability for 11 different mission profiles. Operates in coordination with KAAN's command within MUM-T doctrine, enhancing battlefield dominance.",
        },
        simsekSpecs: [
            { tag: "SPEED", value: "MACH 0.9", unit: "High Subsonic" },
            { tag: "RANGE", value: "700+", unit: "km · Air-Launched" },
            { tag: "WEIGHT", value: "~200", unit: "kg · Compact Form" },
            { tag: "WARHEAD", value: "20–50", unit: "kg · Modular" },
            { tag: "MISSION", value: "11", unit: "Different Mission Profiles" },
            { tag: "DEVELOPER", value: "TUSAŞ", unit: "Turkish Aerospace" },
        ],
        simsekMissions: [
            { title: "Decoy Target", desc: "Deceives enemy air defense radars to protect the main strike elements." },
            { title: "Electronic Warfare", desc: "Broadband jamming and electronic attack missions that paralyze enemy communications." },
            { title: "Recon & Surveillance", desc: "Real-time intelligence gathering and target detection in high-threat zones." },
            { title: "Kinetic Strike", desc: "Precise kinetic attack on high-value targets with modular warhead." },
            { title: "SEAD Support", desc: "Detects and suppresses enemy SAM systems to ensure safe passage for strike elements." },
        ],
        simsekChain: [
            { platform: "KAAN", role: "Command & Control", tag: "MMU" },
            { platform: "ANKA-3", role: "Launch Platform", tag: "MİUS" },
            { platform: "SÜPER ŞİMŞEK", role: "Autonomous Execution", tag: "OKU" },
        ],

        // MunitionsShowcase
        munitions: {
            tag: "NATIONAL MUNITIONS",
            title: "KAAN",
            titleHighlight: "Arsenal",
            description: "Indigenous strategic munitions developed by MSB R&D Center, deployable from the KAAN fighter jet.",
        },
        gazap: {
            name: "GAZAP",
            type: "Thermobaric FAE Bomb",
            description: "Turkey's most powerful conventional air-dropped bomb. Creates a devastating shockwave of extreme pressure and heat by utilizing atmospheric oxygen during detonation. Highly effective against bunkers, shelters, and underground facilities.",
            specs: [
                { label: "WEIGHT", value: "~970 kg" },
                { label: "TYPE", value: "Thermobaric / FAE" },
                { label: "FRAGMENTS", value: "10,000+" },
                { label: "BLAST RADIUS", value: "150–200 m" },
                { label: "DEVELOPER", value: "MSB R&D" },
                { label: "PLATFORM", value: "KAAN · F-16 · UAV" },
            ],
        },
        hayalet: {
            name: "HAYALET",
            type: "Bunker-Buster Penetration Bomb",
            description: "An indigenous bunker-buster bomb capable of reaching 90 meters depth and piercing 7 meters of reinforced concrete, effective against nuclear-shelter-class protection. Proven to penetrate C50-grade concrete and 25mm ribbed steel cage structures.",
            specs: [
                { label: "WEIGHT", value: "~1,000 kg" },
                { label: "TYPE", value: "Bunker-Buster" },
                { label: "DEPTH", value: "90 m" },
                { label: "CONCRETE PEN.", value: "7 m (C50)" },
                { label: "DEVELOPER", value: "MSB R&D" },
                { label: "PLATFORM", value: "KAAN · F-16 · F-4" },
            ],
        },
        ecosystem: {
            tag: "INDIGENOUS ECOSYSTEM",
            title: "Turkish Defense",
            titleHighlight: "Industry",
            description: "Indigenous defense industry companies powering the KAAN ecosystem and their contributions.",
        },
        companies: [
            { role: "Platform Design & Manufacturing" },
            { role: "Avionics & Electronic Warfare" },
            { role: "Munitions & Missile Systems" },
            { role: "Engine Development" },
            { role: "Software & Computing" },
            { role: "Simulation & Mission Systems" },
        ],
        companyProducts: [
            ["KAAN", "ANKA-3", "HÜRJET", "Süper Şimşek"],
            ["MURAD AESA", "IVDL", "T-Link", "EW Suite"],
            ["GÖKDOĞAN", "BOZDOĞAN", "SOM", "TOLUN"],
            ["TF-10000", "TF-35000", "TS-1400"],
            ["Avionics Computer", "Interface Units", "Crypto"],
            ["Mission Computer", "Simulator", "Training System"],
        ],

        videoGallery: {
            tag: "MEDIA GALLERY",
            title: "Video",
            titleHighlight: "Archive",
        },
        videos: [
            { title: "KAAN Flight Footage", description: "Flight and maneuver footage of Türkiye's 5th generation fighter jet KAAN." },
            { title: "ANKA-3 Test Flight", description: "Autonomous test flight and performance of the stealth UCAV ANKA-3." },
            { title: "Süper Şimşek Autonomous Flight", description: "Test and mission profile of the jet-powered autonomous wingman Süper Şimşek." },
        ],

        footer: {
            abort: "ABORT MISSION",
            developedBy: "Developed by",
            model3d: "3D Model:",
            copyright: "© 2026 KAAN Experience — Fan Project // Non-Commercial",
        },

        formation: {
            title: "CMD",
        },
    },
};

type SectionStrings = { [key: string]: string };
type SectionWithSpecs = { name: string; description: string; specs: { label: string; value: string }[] };

export interface MumtT {
    hero: { subtitle: string; tagline: string; scroll: string; designation: string; role: string; datalink: string; synced: string; deploying: string };
    concept: { tag: string; title: string; titleHighlight: string; description: string; loiTitle: string; conceptSummaryTag: string; conceptSummary: string; svgMissionCmd: string; svgSensorData: string; svgSwarmCoord: string };
    loiLevels: { title: string; description: string }[];
    benefits: { title: string; description: string }[];
    threat: { tag: string; title: string; titleHighlight: string; description: string };
    zones: { label: string; description: string }[];
    platforms: { role: string }[];
    avionics: { tag: string; title: string; titleHighlight: string; description: string };
    avionicSystems: SectionWithSpecs[];
    genCompare: { tag: string; title: string; titleHighlight: string; traditional: string; description: string };
    compareRows: { label: string; traditional: string; mumt: string }[];
    timeline: { tag: string; title: string; titleHighlight: string; scrollHint: string };
    phases: { codename: string; title: string; platformFocus: string; description: string }[];
    scenario: { tag: string; title: string; titleHighlight: string; description: string; nextStep: string; reset: string; step: string };
    scenarios: { name: string; description: string; steps: { action: string; detail: string }[] }[];
    platformCompare: { tag: string; title: string; titleHighlight: string };
    specs: { label: string; kaan: string; anka: string }[];
    datalink: { tag: string; title: string; titleHighlight: string };
    dataLinks: { label: string }[];
    stats: { tag: string; title: string; titleHighlight: string };
    statItems: { label: string; sublabel: string }[];
    capability: { tag: string; title: string; titleHighlight: string };
    roles: { title: string; description: string }[];
    simsek: { tag: string; title: string; titleHighlight: string; description: string; extendedDescription: string };
    simsekSpecs: { tag: string; value: string; unit: string }[];
    simsekMissions: { title: string; desc: string }[];
    simsekChain: { platform: string; role: string; tag: string }[];
    munitions: { tag: string; title: string; titleHighlight: string; description: string };
    gazap: { name: string; type: string; description: string; specs: { label: string; value: string }[] };
    hayalet: { name: string; type: string; description: string; specs: { label: string; value: string }[] };
    ecosystem: { tag: string; title: string; titleHighlight: string; description: string };
    companies: { role: string }[];
    companyProducts: string[][];
    videoGallery: { tag: string; title: string; titleHighlight: string };
    videos: { title: string; description: string }[];
    footer: { abort: string; developedBy: string; model3d: string; copyright: string };
    formation: { title: string };
}

export function useMumtT(locale: Locale): MumtT {
    return t[locale] as MumtT;
}
