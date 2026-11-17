import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

export interface Beat {
    id: string;
    /** Scroll progress through the flight section where the beat is centred. */
    at: number;
    side: "left" | "right";
    label: string;
    title: string;
    body: string;
    facts?: { k: string; v: string }[];
}

export const flightCopy: L<{
    kicker: string;
    date: string;
    place: string;
    meta: { k: string; v: string }[];
    scroll: string;
    hmdLabel: string;
    disclaimer: string;
    beats: Beat[];
}> = {
    tr: {
        kicker: "Milli Muharip Uçak · P0 prototipi",
        date: "21 Şubat 2024 · 08.50",
        place: "Mürted, Ankara",
        meta: [
            { k: "Pilot", v: "Barbaros Demirbaş" },
            { k: "Süre", v: "13 dakika" },
            { k: "Eskort", v: "F-16D" },
        ],
        scroll: "İlk uçuşu kaydırarak izleyin",
        hmdLabel: "TULGAR · TEMSİLİ SEMBOLOJİ · SAHNEDEKİ UÇAĞIN VERİSİ",
        disclaimer:
            "Sahne, ilk uçuşun açıklanan bilgilerine dayanan bir canlandırmadır: saat, meydan, en yüksek irtifa ve hız, açık iniş takımları. Rota, kamera ve ara değerler temsilidir.",
        beats: [
            {
                id: "takeoff",
                at: 0.15,
                side: "left",
                label: "01 · Kalkış",
                title: "İki F110, tam güç",
                body: "P0, iki adet General Electric F110-GE-129 motorla kalktı. Motor başına itki art yakıcıyla 13.150 kgf. İniş takımları uçuş boyunca açık bırakıldı; ilk uçuşta sistemlerin ve uçuş kontrolünün davranışı ölçülüyordu, performans değil.",
                facts: [
                    { k: "Motor", v: "2 × F110-GE-129" },
                    { k: "İtki", v: "2 × 13.150 kgf" },
                    { k: "İniş takımı", v: "Açık" },
                ],
            },
            {
                id: "visor",
                at: 0.3,
                side: "right",
                label: "02 · Pilotun gözünden",
                title: "Vizörde ne var",
                body: "KAAN'ın resmi sistem listesinde sabit bir HUD yok; uçuş bilgisi ASELSAN TULGAR kaska yansıtılıyor. TULGAR renkli, saydam bir vizör ekranı: 40° × 32° görüş alanı, dijital gece görüşü. Ekrandaki semboller bu sahnedeki uçağın anlık hızından, irtifasından ve duruşundan çiziliyor.",
                facts: [
                    { k: "Görüş alanı", v: "40° × 32°" },
                    { k: "Ağırlık", v: "< 2,1 kg" },
                    { k: "Üretici", v: "ASELSAN" },
                ],
            },
            {
                id: "overview",
                at: 0.5,
                side: "left",
                label: "03 · Gövde",
                title: "Radara az görünmek için",
                body: "Düz paneller, ortak açılara hizalanmış kenarlar, gövde içi silah yuvaları ve motor yüzünü gizleyen hava alığı kanalları. P1 prototipinde alıklar geriye alındı ve büyüdü, gövde ortası genişledi, panel kenarlarında testere dişi hatlar belirginleşti.",
                facts: [
                    { k: "Uzunluk", v: "20,3 m" },
                    { k: "Kanat açıklığı", v: "13,4 m" },
                    { k: "Kanat alanı", v: "71,6 m²" },
                ],
            },
            {
                id: "systems",
                at: 0.72,
                side: "right",
                label: "04 · Sensörler",
                title: "ASELSAN'ın sensör ailesi",
                body: "ASELSAN, Paris Air Show 2025'te KAAN için geliştirdiği sistemleri sergiledi. Burunda MURAD 600-A AESA radar; kanopinin önünde KARAT 100 kızılötesi arama-takip; burun altında TOYGUN 100 elektro-optik hedefleme. Lazer ve füze ikaz alıcıları ile YILDIRIM 300 kızılötesi karşı tedbir sistemi uçağı korur.",
                facts: [
                    { k: "Radar", v: "MURAD 600-A" },
                    { k: "IRST", v: "KARAT 100" },
                    { k: "EOTS", v: "TOYGUN 100" },
                ],
            },
            {
                id: "landing",
                at: 0.92,
                side: "left",
                label: "05 · 13 dakika",
                title: "8.000 ft, 230 knot",
                body: "İlk uçuş yaklaşık 13 dakika sürdü. Uçak 8.000 ft irtifaya ve 230 knot hıza çıktı, iniş paraşütüyle piste döndü. İkinci uçuş 6 Mayıs 2024'te yapıldı. Ekim 2026 itibarıyla ilk seri üretim tasarımına yakın P1 prototipi taksi testlerinde; ilk uçuşu yıl sonuna kadar hedefleniyor.",
                facts: [
                    { k: "İrtifa", v: "8.000 ft" },
                    { k: "Hız", v: "230 kt" },
                    { k: "İkinci uçuş", v: "6 Mayıs 2024" },
                ],
            },
        ],
    },
    en: {
        kicker: "National Combat Aircraft · P0 prototype",
        date: "21 February 2024 · 08:50",
        place: "Mürted, Ankara",
        meta: [
            { k: "Pilot", v: "Barbaros Demirbaş" },
            { k: "Duration", v: "13 minutes" },
            { k: "Chase", v: "F-16D" },
        ],
        scroll: "Scroll to fly the first flight",
        hmdLabel: "TULGAR · ILLUSTRATIVE SYMBOLOGY · LIVE DATA FROM THE SCENE",
        disclaimer:
            "The scene re-enacts the first flight from its published details: time, airfield, peak altitude and speed, gear down. The route, camera and in-between values are illustrative.",
        beats: [
            {
                id: "takeoff",
                at: 0.15,
                side: "left",
                label: "01 · Take-off",
                title: "Two F110s, full power",
                body: "P0 took off on two General Electric F110-GE-129 engines, each rated at 13,150 kgf with afterburner. The landing gear stayed down for the whole flight: the first sortie measured how the systems and flight controls behaved, not performance.",
                facts: [
                    { k: "Engines", v: "2 × F110-GE-129" },
                    { k: "Thrust", v: "2 × 13,150 kgf" },
                    { k: "Gear", v: "Down" },
                ],
            },
            {
                id: "visor",
                at: 0.3,
                side: "right",
                label: "02 · Through the visor",
                title: "What the pilot sees",
                body: "KAAN's official system list has no fixed HUD; flight data is projected into the ASELSAN TULGAR helmet. TULGAR is a colour, see-through visor display with a 40° × 32° field of view and digital night vision. The symbols on screen are drawn from the live speed, altitude and attitude of the aircraft in this scene.",
                facts: [
                    { k: "Field of view", v: "40° × 32°" },
                    { k: "Weight", v: "< 2.1 kg" },
                    { k: "Maker", v: "ASELSAN" },
                ],
            },
            {
                id: "overview",
                at: 0.5,
                side: "left",
                label: "03 · Airframe",
                title: "Shaped to stay off radar",
                body: "Flat panels, edges aligned to shared angles, internal weapons bays and intake ducts that hide the engine faces. On the P1 prototype the intakes moved aft and grew, the mid-fuselage widened, and serrated panel edges became more visible.",
                facts: [
                    { k: "Length", v: "20.3 m" },
                    { k: "Wingspan", v: "13.4 m" },
                    { k: "Wing area", v: "71.6 m²" },
                ],
            },
            {
                id: "systems",
                at: 0.72,
                side: "right",
                label: "04 · Sensors",
                title: "ASELSAN's sensor family",
                body: "ASELSAN showed its KAAN systems at the Paris Air Show 2025. A MURAD 600-A AESA radar in the nose, a KARAT 100 infrared search-and-track ahead of the canopy, a TOYGUN 100 electro-optical targeting system under the nose. Laser and missile warners plus the YILDIRIM 300 directional infrared countermeasure protect the aircraft.",
                facts: [
                    { k: "Radar", v: "MURAD 600-A" },
                    { k: "IRST", v: "KARAT 100" },
                    { k: "EOTS", v: "TOYGUN 100" },
                ],
            },
            {
                id: "landing",
                at: 0.92,
                side: "left",
                label: "05 · 13 minutes",
                title: "8,000 ft, 230 knots",
                body: "The first flight lasted about 13 minutes. The aircraft reached 8,000 ft and 230 knots and landed with its brake chute. The second flight followed on 6 May 2024. As of October 2026 the P1 prototype, close to the production design, is in taxi tests, with a first flight targeted before the end of the year.",
                facts: [
                    { k: "Altitude", v: "8,000 ft" },
                    { k: "Speed", v: "230 kt" },
                    { k: "Second flight", v: "6 May 2024" },
                ],
            },
        ],
    },
};

export const visorCopy: L<{
    index: string;
    label: string;
    title: string;
    lede: string;
    hmdLabel: string;
    note: string;
    beats: Beat[];
}> = {
    tr: {
        index: "02",
        label: "Pilotun gözünden",
        title: "TULGAR vizöründen bakış",
        lede: "Aşağı kaydırdıkça uçak tırmanır, bulut katmanını geçer ve yatışa girer. Vizördeki her sembol, sahnedeki uçağın o anki hızından, irtifasından ve duruşundan çiziliyor.",
        hmdLabel: "TULGAR · TEMSİLİ SEMBOLOJİ · SAHNEDEKİ UÇAĞIN VERİSİ",
        note: "Canlandırma ilk uçuşun açıklanan sınırları içinde kalır: en çok 8.000 ft, 230 knot, iniş takımları açık. Rota ve kamera temsilidir; KAAN'ın gerçek vizör sembolojisi yayımlanmadı.",
        beats: [
            {
                id: "visor-hmd",
                at: 0.22,
                side: "right",
                label: "Kask monte gösterge",
                title: "HUD yok, vizör var",
                body: "TUSAŞ'ın KAAN için açıkladığı kokpit listesinde sabit bir HUD bulunmuyor. Uçuş bilgisi ASELSAN'ın TULGAR kaskına yansıtılıyor: renkli, saydam bir vizör ekranı, dijital gece görüşü ve ataletsel-optik karma kafa takibi.",
                facts: [
                    { k: "Görüş alanı", v: "40° × 32°" },
                    { k: "Ağırlık", v: "< 2,1 kg" },
                    { k: "Test", v: "F-16'da uçtu" },
                ],
            },
            {
                id: "visor-read",
                at: 0.5,
                side: "left",
                label: "Okuma kılavuzu",
                title: "Ekranda ne görüyorsunuz",
                body: "Ortada yunuslama merdiveni: ufkun üstünde düz, altında kesikli çizgiler, her 5 derecede bir. Küçük daire uçuş yolu işareti, uçağın gerçekten gittiği yön. Solda hava hızı (knot), sağda irtifa (ft), üstte pusula şeridi. Mavi işaret eskort F-16D'yi gösterir; tek renkli bir HUD'da bu ayrım yapılamaz.",
                facts: [
                    { k: "Sol", v: "Hız, kt" },
                    { k: "Sağ", v: "İrtifa, ft" },
                    { k: "Üst", v: "Pusula" },
                ],
            },
            {
                id: "visor-out",
                at: 0.84,
                side: "right",
                label: "Bulutların üstünde",
                title: "8.000 ft, 230 knot",
                body: "İlk uçuşta uçak bu irtifa ve hızın üstüne çıkmadı; amaç uçuş kontrol sisteminin davranışını görmekti. İkinci uçuşta 10.000 ft'e tırmanıldı. Tam performans testleri seri üretim tasarımına yakın P1 ile başlayacak.",
            },
        ],
    },
    en: {
        index: "02",
        label: "Through the visor",
        title: "The view through TULGAR",
        lede: "As you scroll, the aircraft climbs, passes the cloud layer and rolls into a turn. Every symbol on the visor is drawn from the live speed, altitude and attitude of the aircraft in the scene.",
        hmdLabel: "TULGAR · ILLUSTRATIVE SYMBOLOGY · LIVE DATA FROM THE SCENE",
        note: "The re-enactment stays inside the first flight's published limits: at most 8,000 ft and 230 knots, gear down. The route and camera are illustrative; KAAN's actual visor symbology has not been published.",
        beats: [
            {
                id: "visor-hmd",
                at: 0.22,
                side: "right",
                label: "Helmet-mounted display",
                title: "No HUD, a visor",
                body: "The cockpit list Turkish Aerospace published for KAAN has no fixed HUD. Flight data is projected into ASELSAN's TULGAR helmet: a colour, see-through visor display with digital night vision and hybrid inertial/optical head tracking.",
                facts: [
                    { k: "Field of view", v: "40° × 32°" },
                    { k: "Weight", v: "< 2.1 kg" },
                    { k: "Tested", v: "Flown on F-16" },
                ],
            },
            {
                id: "visor-read",
                at: 0.5,
                side: "left",
                label: "How to read it",
                title: "What you are looking at",
                body: "In the centre, the pitch ladder: solid lines above the horizon, dashed below, every 5 degrees. The small circle is the flight path marker, where the aircraft is actually going. Airspeed (knots) on the left, altitude (ft) on the right, the heading tape on top. The blue cue marks the F-16D chase aircraft; a monochrome HUD could not make that distinction.",
                facts: [
                    { k: "Left", v: "Speed, kt" },
                    { k: "Right", v: "Altitude, ft" },
                    { k: "Top", v: "Heading" },
                ],
            },
            {
                id: "visor-out",
                at: 0.84,
                side: "right",
                label: "Above the clouds",
                title: "8,000 ft, 230 knots",
                body: "On the first flight the aircraft went no higher or faster than this; the aim was to see how the flight control system behaved. The second flight climbed to 10,000 ft. Full performance testing will start with P1, which is close to the production design.",
            },
        ],
    },
};
