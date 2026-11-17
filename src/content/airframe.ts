import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

export type ViewId = "front" | "side" | "top" | "rear" | "three";

/** Camera positions for the view presets, in scene units (1 unit = 10 m). Nose points to +Z, up is +Y. */
export const VIEW_POSITIONS: Record<ViewId, [number, number, number]> = {
    front: [0, 0.22, 3.3],
    side: [3.5, 0.14, 0.02],
    top: [0, 3.7, 0.04],
    rear: [0, 0.3, -3.3],
    three: [2.35, 1.05, 2.45],
};

export const VIEW_ORDER: ViewId[] = ["three", "front", "side", "top", "rear"];

/**
 * Where each marker sits. `at` is an approximate point on the KAAN.glb model after it is scaled to
 * 20.3 m and turned nose-forward; `dir` is the direction a ray travels to find the skin there.
 * The component snaps each marker to the first surface the ray hits and falls back to `at`.
 */
export interface FeatureAnchor {
    at: [number, number, number];
    dir: [number, number, number];
}

export interface Feature {
    id: string;
    anchor: FeatureAnchor;
    view: ViewId;
    /** The feature is described from photographs of P1, not shown on this model. */
    p1?: boolean;
    title: L;
    body: L;
}

export const features: Feature[] = [
    {
        id: "probe",
        anchor: { at: [0, -0.09, 1.02], dir: [0, 0, -1] },
        view: "three",
        title: { tr: "Hava verisi probu", en: "Air-data probe" },
        body: {
            tr: "P0'ın burnunun ucunda uzun bir hava verisi çubuğu var; test uçuşlarında hız, irtifa ve hücum açısı ölçümü için kullanılır. P1 fotoğraflarında probun burnun sağ yanına alındığı görülüyor.",
            en: "P0 carries a long air-data boom on the tip of its nose, used to measure speed, altitude and angle of attack in flight test. Photographs of P1 show the probe moved to the right side of the nose.",
        },
    },
    {
        id: "irst",
        anchor: { at: [0, 0.02, 0.77], dir: [0, -1, 0] },
        view: "front",
        p1: true,
        title: { tr: "KARAT 100 IRST penceresi", en: "KARAT 100 IRST window" },
        body: {
            tr: "Kanopinin önündeki pencere ASELSAN'ın KARAT 100 kızılötesi arama ve takip sistemine ait. IRST hedefleri ısı izinden bulur ve bunun için radar yayını gerekmez. Pencere P1'de görülüyor; işaret o konumu gösterir.",
            en: "The window ahead of the canopy belongs to ASELSAN's KARAT 100 infrared search and track system. An IRST finds targets by their heat and needs no radar emission. The window is seen on P1; the marker shows its position.",
        },
    },
    {
        id: "canopy",
        anchor: { at: [0, 0.12, 0.62], dir: [0, -1, 0] },
        view: "three",
        title: { tr: "Kanopi ve fırlatma koltuğu", en: "Canopy and ejection seat" },
        body: {
            tr: "Tek kişilik kokpit. Fırlatma koltuğu Martin-Baker T18T; Mk18 ailesinden olan koltuk 2025 Paris Air Show'da KAAN için sergilendi.",
            en: "A single-seat cockpit. The ejection seat is the Martin-Baker T18T, a member of the Mk18 family, shown for KAAN at the 2025 Paris Air Show.",
        },
    },
    {
        id: "eots",
        anchor: { at: [0, -0.2, 0.68], dir: [0, 1, 0] },
        view: "front",
        p1: true,
        title: { tr: "TOYGUN 100 EOTS kaplaması", en: "TOYGUN 100 EOTS fairing" },
        body: {
            tr: "Burnun altındaki kaplama ASELSAN'ın TOYGUN 100 elektro-optik hedefleme sistemini taşıyor; hedef tespiti ve takibi için kullanılır. Kaplama P1'de görülüyor.",
            en: "The fairing under the nose houses ASELSAN's TOYGUN 100 electro-optical targeting system, used to detect and track targets. The fairing is seen on P1.",
        },
    },
    {
        id: "intakes",
        anchor: { at: [0.3, -0.04, 0.48], dir: [-1, 0, 0] },
        view: "side",
        title: { tr: "Hava alıkları", en: "Intakes" },
        body: {
            tr: "Kokpitin iki yanında, gövdeye yaslanmış iki alık. Kanallar kıvrılarak motor yüzünü dışarıdan görünmez kılar; dönen fan kanatları güçlü bir radar yansımasıdır. P1'de alıkların geriye alındığı ve büyütüldüğü görülüyor.",
            en: "Two intakes set against the fuselage on either side of the cockpit. The ducts curve so the engine face cannot be seen from outside; spinning fan blades are a strong radar reflector. On P1 the intakes appear moved aft and enlarged.",
        },
    },
    {
        id: "bays",
        anchor: { at: [0, -0.3, 0.18], dir: [0, 1, 0] },
        view: "side",
        title: { tr: "İç silah yuvaları", en: "Internal weapons bays" },
        body: {
            tr: "Gövde altındaki yuvalar resmî TUSAŞ özellik listesinde yer alıyor. Silahları gövde içinde taşımak radar yansımasını düşük tutar. Yuva ölçüleri açıklanmadı; açık kaynaklarda 8 iç istasyon bildiriliyor.",
            en: "The bays under the fuselage are on TUSAŞ's official feature list. Carrying weapons inside keeps the radar return low. Bay dimensions are unpublished; open sources report 8 internal stations.",
        },
    },
    {
        id: "serrations",
        anchor: { at: [0, 0.2, 0.42], dir: [0, -1, 0] },
        view: "top",
        p1: true,
        title: { tr: "Testere dişli panel kenarları", en: "Serrated panel edges" },
        body: {
            tr: "Kapak ve panel kenarlarındaki zikzak hatlar, kenarlardan dönen radar yansımasını birkaç dar yöne toplar. Analistler bu hatların P1'de belirginleştiğini not ediyor.",
            en: "Zigzag lines on door and panel edges gather the radar return from those edges into a few narrow directions. Analysts note that these lines are more pronounced on P1.",
        },
    },
    {
        id: "nozzles",
        anchor: { at: [0.087, -0.13, -1.4], dir: [0, 0, 1] },
        view: "rear",
        title: { tr: "İki F110 egzozu", en: "Twin F110 nozzles" },
        body: {
            tr: "Prototipler ve ilk üretim blokları iki GE F110-GE-129 ile uçuyor; her biri art yakıcıyla 13.150 kgf itki veriyor (TUSAŞ). Uzun vadede TEI TF35000'e geçilmesi planlanıyor.",
            en: "The prototypes and early production blocks fly on two GE F110-GE-129s, each giving 13,150 kgf of thrust with afterburner (TUSAŞ). The long-term plan is a switch to the TEI TF35000.",
        },
    },
];

export const airframeCopy: L<{
    label: string;
    title: string;
    lede: string;
    views: Record<ViewId, string>;
    viewsLabel: string;
    wireframe: string;
    reset: string;
    featuresTitle: string;
    p1Tag: string;
    activate: string;
    deactivate: string;
    hint: string;
    hintTouch: string;
    loading: string;
    canvasLabel: string;
    still: { alt: string; caption: string };
    dimsTitle: string;
    dims: { k: string; v: string; unit: string }[];
    dimsSource: string;
    compareTitle: string;
    compareHead: [string, string, string];
    compare: { k: string; p0: string; p1: string }[];
    note: string;
    modelCredit: string;
}> = {
    tr: {
        label: "Gövde",
        title: "Gövdeyi yakından inceleyin",
        lede: "Model, TUSAŞ'ın açıkladığı 20,3 metrelik boya ölçeklendi. Döndürün, yakınlaştırın, numaralı noktalara bakın. Model P0'a benzer bir yapılanmayı gösteriyor; P1'de görülen farklar ayrıca işaretlendi.",
        views: { three: "3/4", front: "Ön", side: "Yan", top: "Üst", rear: "Arka" },
        viewsLabel: "Görünüm",
        wireframe: "Tel kafes",
        reset: "Sıfırla",
        featuresTitle: "İşaretli noktalar",
        p1Tag: "P1",
        activate: "Döndürmek için dokunun",
        deactivate: "Kaydırmaya dön",
        hint: "Sürükleyerek döndürün. Yakınlaştırmak için modele tıklayıp tekerleği kullanın.",
        hintTouch: "Tek parmakla döndürün, iki parmakla yakınlaştırın.",
        loading: "Model yükleniyor",
        canvasLabel: "KAAN'ın döndürülebilir üç boyutlu modeli",
        still: {
            alt: "KAAN P0 uçuşta, iniş takımları açık, yanında takip uçağından çekilmiş görüntü",
            caption: "Bu cihazda 3D model kapalı. Görüntü: KAAN P0, 2024 test uçuşu (TUSAŞ).",
        },
        dimsTitle: "Boyutlar",
        dims: [
            { k: "Uzunluk", v: "20,3", unit: "m" },
            { k: "Kanat açıklığı", v: "13,4", unit: "m" },
            { k: "Yükseklik", v: "5", unit: "m" },
            { k: "Kanat alanı", v: "71,6", unit: "m²" },
        ],
        dimsSource: "Kaynak: TUSAŞ resmî KAAN teknik özellikleri.",
        compareTitle: "P0 ve P1",
        compareHead: ["", "P0", "P1"],
        compare: [
            { k: "Hava alıkları", p0: "Daha önde", p1: "Geriye alınmış, büyük" },
            { k: "Orta gövde", p0: "Dar", p1: "Daha geniş" },
            { k: "Burun sensörleri", p0: "Görülmüyor", p1: "KARAT IRST, TOYGUN EOTS" },
            { k: "Hava verisi probu", p0: "Burun ucunda", p1: "Sağ yanda" },
            { k: "Panel kenarları", p0: "Daha az belirgin", p1: "Testere dişli" },
            { k: "Ana iniş takımı", p0: "Yüksek", p1: "Daha alçak ve geniş" },
            { k: "Kaplama", p0: "Gri boya", p1: "Astar (beyaz)" },
        ],
        note: "P1 farkları, analistlerin fotoğraflardan yaptığı gözlemlere dayanır; resmî bir liste değildir.",
        modelCredit: "3D model: Kaan Azman. Model iniş takımsız ve P0'a benzer bir yapılanmada; ayrıntılar gerçek uçaktan farklı olabilir.",
    },
    en: {
        label: "Airframe",
        title: "Inspect the airframe",
        lede: "The model is scaled to the 20.3 m length published by TUSAŞ. Turn it, zoom in, look at the numbered points. It shows a P0-like configuration; differences seen on P1 are marked separately.",
        views: { three: "3/4", front: "Front", side: "Side", top: "Top", rear: "Rear" },
        viewsLabel: "View",
        wireframe: "Wireframe",
        reset: "Reset",
        featuresTitle: "Marked points",
        p1Tag: "P1",
        activate: "Tap to rotate",
        deactivate: "Back to scrolling",
        hint: "Drag to rotate. Click the model, then use the wheel to zoom.",
        hintTouch: "Rotate with one finger, zoom with two.",
        loading: "Loading model",
        canvasLabel: "Rotatable 3D model of KAAN",
        still: {
            alt: "KAAN P0 in flight with landing gear down, seen from the chase aircraft",
            caption: "The 3D model is off on this device. Image: KAAN P0, 2024 test flight (TUSAŞ).",
        },
        dimsTitle: "Dimensions",
        dims: [
            { k: "Length", v: "20.3", unit: "m" },
            { k: "Wingspan", v: "13.4", unit: "m" },
            { k: "Height", v: "5", unit: "m" },
            { k: "Wing area", v: "71.6", unit: "m²" },
        ],
        dimsSource: "Source: official TUSAŞ KAAN specifications.",
        compareTitle: "P0 and P1",
        compareHead: ["", "P0", "P1"],
        compare: [
            { k: "Intakes", p0: "Further forward", p1: "Moved aft, larger" },
            { k: "Mid-fuselage", p0: "Narrow", p1: "Wider" },
            { k: "Nose sensors", p0: "Not seen", p1: "KARAT IRST, TOYGUN EOTS" },
            { k: "Air-data probe", p0: "Nose tip", p1: "Right side" },
            { k: "Panel edges", p0: "Less pronounced", p1: "Serrated" },
            { k: "Main landing gear", p0: "Tall", p1: "Lower, wider" },
            { k: "Finish", p0: "Grey paint", p1: "Primer (white)" },
        ],
        note: "P1 differences are based on analysts' observations of photographs; they are not an official list.",
        modelCredit: "3D model: Kaan Azman. The model has no landing gear and shows a P0-like configuration; details may differ from the real aircraft.",
    },
};
