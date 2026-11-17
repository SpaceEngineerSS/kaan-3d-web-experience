import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

export interface StealthFeature {
    id: string;
    /** Number shown on the plan-view drawing. */
    mark: number;
    title: string;
    body: string;
}

export const stealthCopy: L<{
    label: string;
    title: string;
    lede: string;
    planTitle: string;
    planCaption: string;
    polarTitle: string;
    polarCaption: string;
    illustrative: string;
    nose: string;
    tail: string;
    legendLe: string;
    legendTe: string;
    legendOther: string;
    featuresTitle: string;
    features: StealthFeature[];
    source: string;
}> = {
    tr: {
        label: "Düşük görünürlük",
        title: "Yansımayı yönlendiren şekil",
        lede: "Radar dalgası düz bir yüzeye çarptığında ayna gibi tek bir yöne seker. Gizli bir gövde bu yönleri az sayıda dar açıya toplar ve geri kalan her yönde radara dönen enerjiyi düşük tutar. Gerçek radar kesit alanı açıklanmış değil; aşağıdaki çizimler ilkeyi anlatır, ölçüm göstermez.",
        planTitle: "Üstten görünüş, kenar hizalama",
        planCaption: "Basit geometriyle çizilmiş temsili bir dış hat. Ön kenarlar kanatta ve yatay kuyrukta aynı açıda, arka kenarlar da kendi aralarında aynı açıda.",
        polarTitle: "Temsili yansıma deseni",
        polarCaption: "Soldaki dış hattın kenar yönlerinden hesaplanmıştır. Çizgi uzunluğu ve yön dışında hiçbir şey ölçülmemiştir; eksen birimsizdir.",
        illustrative: "Temsilidir, ölçülmüş değildir",
        nose: "Burun 0°",
        tail: "Kuyruk 180°",
        legendLe: "Ön kenarlar",
        legendTe: "Arka kenarlar",
        legendOther: "Diğer kenarlar",
        featuresTitle: "Görünen tasarım tercihleri",
        features: [
            {
                id: "planform",
                mark: 1,
                title: "Kenar hizalama",
                body: "Kanat ve kuyruk ön kenarları aynı ok açısını paylaşır, arka kenarlar da öyle. Yansımalar birkaç dar açıya toplanır; en önemli bölge olan burun yönü bu açıların dışında kalır.",
            },
            {
                id: "bays",
                mark: 2,
                title: "Gövde içi silah yuvaları",
                body: "Füze ve bombalar gövdenin içinde taşınır. Kanat altındaki dolu bir askı, gövdenin geri kalanından çok daha güçlü bir yansıma üretir. Yuva kapaklarının kenarları da testere dişi biçiminde ve gövde açılarıyla hizalı.",
            },
            {
                id: "intakes",
                mark: 3,
                title: "S şeklinde hava alığı kanalları",
                body: "Motorun dönen fan kanatları güçlü bir radar yansıtıcısıdır. Kıvrımlı kanal, önden bakıldığında fan yüzünü görüş hattından çıkarır; kanal içi kaplamalar içeri giren enerjiyi sönümler.",
            },
            {
                id: "coatings",
                mark: 4,
                title: "Radar soğurucu malzemeler",
                body: "Şekil yansımanın yönünü belirler, kaplamalar ise kalan enerjinin bir kısmını soğurur. KAAN'da kullanılan malzemelerin ayrıntıları yayımlanmadı.",
            },
            {
                id: "canopy",
                mark: 5,
                title: "Kokpit kanopisi",
                body: "Kaplamasız bir kanopi radar dalgasını içeri alır ve kokpitteki metal yüzeylerden geri yansıtır. Gizli tasarımlarda kanopiye ince, iletken bir kaplama uygulanır; KAAN için özellikler açıklanmadı.",
            },
        ],
        source: "Kaynak: TUSAŞ açıklamaları, prototip fotoğrafları ve gizlilik tasarımı üzerine genel teknik literatür (Wikipedia dahil), Kasım 2026 itibarıyla. Dış hat ve yansıma deseni bu site için çizilmiş temsili şekillerdir.",
    },
    en: {
        label: "Low observability",
        title: "A shape that steers the echo",
        lede: "A radar wave hitting a flat surface bounces off like light from a mirror, in one direction. A stealthy airframe gathers those directions into a few narrow angles and keeps the energy returned to the radar low everywhere else. The real radar cross-section has not been published; the drawings below explain the principle, they do not show a measurement.",
        planTitle: "Plan view, edge alignment",
        planCaption: "A notional outline drawn from simple geometry. Leading edges on the wing and tailplane share one angle; trailing edges share another.",
        polarTitle: "Notional return pattern",
        polarCaption: "Computed from the edge directions of the outline on the left. Nothing here is measured except edge length and direction; the axis has no unit.",
        illustrative: "Illustrative, not measured",
        nose: "Nose 0°",
        tail: "Tail 180°",
        legendLe: "Leading edges",
        legendTe: "Trailing edges",
        legendOther: "Other edges",
        featuresTitle: "Design choices you can see",
        features: [
            {
                id: "planform",
                mark: 1,
                title: "Planform alignment",
                body: "Wing and tail leading edges share one sweep angle, and the trailing edges share another. Reflections collect into a few narrow angles, and the nose-on sector, the one that matters most, sits outside them.",
            },
            {
                id: "bays",
                mark: 2,
                title: "Internal weapons bays",
                body: "Missiles and bombs ride inside the fuselage. A loaded pylon under the wing returns far more energy than the rest of the airframe. The bay doors have saw-tooth edges aligned with the main angles.",
            },
            {
                id: "intakes",
                mark: 3,
                title: "S-shaped intake ducts",
                body: "A spinning engine fan is a strong radar reflector. The curved duct takes the fan face out of the line of sight from the front, and duct linings absorb the energy that does get in.",
            },
            {
                id: "coatings",
                mark: 4,
                title: "Radar-absorbent materials",
                body: "Shape decides where the reflection goes; coatings absorb part of what is left. The materials used on KAAN have not been disclosed.",
            },
            {
                id: "canopy",
                mark: 5,
                title: "Cockpit canopy",
                body: "An uncoated canopy lets radar energy in to bounce off the metal inside the cockpit. Stealth designs apply a thin conductive coating to the canopy; KAAN's specification has not been published.",
            },
        ],
        source: "Source: Turkish Aerospace statements, prototype photographs and general technical literature on low-observable design (including Wikipedia), as of November 2026. The outline and return pattern are notional drawings made for this site.",
    },
};
