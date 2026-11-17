import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

export type MediaKind = "photo" | "render" | "diagram" | "video" | "model";

/**
 * One credited asset. `credit` names the owner when known and says honestly when it is not.
 * Images that only have a vague provenance are kept with a clear "source unknown" credit,
 * as the site owner decided; anything that turns out to belong to someone who objects is
 * removed on request (see /kaynaklar).
 */
export interface MediaCredit {
    src: string;
    alt: L;
    credit: L;
    kind: MediaKind;
    sourceUrl?: string;
    licence?: string;
    note?: L;
    /** Intrinsic size, for images. */
    width?: number;
    height?: number;
}

const UNKNOWN: L = {
    tr: "Kaynak belirsiz, kamuya açık paylaşım",
    en: "Source unknown, publicly shared image",
};

/** Gallery, in display order. Files live in /public/gallery. */
export const galleryCredits: MediaCredit[] = [
    {
        src: "/gallery/kaan-2.jpg",
        kind: "photo",
        width: 1920,
        height: 1080,
        alt: {
            tr: "Gün batımında pistte duran KAAN, siluet halinde",
            en: "KAAN on the runway at sunset, in silhouette",
        },
        credit: { tr: "Fotoğraf: Cem Doğut", en: "Photo: Cem Doğut" },
        note: { tr: "Fotoğrafçının imzası görselin üzerindedir.", en: "The photographer's signature is on the image." },
    },
    {
        src: "/gallery/kaan-14.jpg",
        kind: "photo",
        width: 1280,
        height: 720,
        alt: {
            tr: "KAAN P0 prototipi iniş takımları açık halde pistten kalkarken",
            en: "The KAAN P0 prototype lifting off the runway with the landing gear down",
        },
        credit: {
            tr: "Alman basınında ilk uçuş haberiyle yayımlanan fotoğraf; asıl sahibi belirsiz",
            en: "News photo published with a first-flight report in German media; original owner unknown",
        },
    },
    {
        src: "/gallery/kaan-5.jpg",
        kind: "photo",
        width: 2560,
        height: 1440,
        alt: {
            tr: "Gece apronda, motorları art yakıcıda çalışan KAAN ve yanında yer ekibi",
            en: "KAAN on the apron at night with its engines in afterburner and ground crew nearby",
        },
        credit: UNKNOWN,
    },
    {
        src: "/gallery/2061439.jpg",
        kind: "photo",
        width: 1280,
        height: 720,
        alt: {
            tr: "KAAN kokpitinde oturan bir pilot; geniş ekran görünüyor",
            en: "A pilot seated in a KAAN cockpit, with the wide-area display visible",
        },
        credit: {
            tr: "Duvar kağıdı / stok görsel (no. 2061439); asıl sahibi belirsiz",
            en: "Wallpaper / stock image (no. 2061439); original owner unknown",
        },
    },
    {
        src: "/gallery/kaan-6.jpg",
        kind: "photo",
        width: 1536,
        height: 2048,
        alt: {
            tr: "Bir fuarda sergilenen, \"Turkish Fighter\" yazılı tam ölçekli kokpit maketi",
            en: "A full-scale cockpit mock-up with a \"Turkish Fighter\" sign, shown at an exhibition",
        },
        credit: { tr: "X (Twitter) üzerinden; paylaşan kişi belirsiz", en: "Via X (Twitter); author unknown" },
        sourceUrl: "https://pbs.twimg.com/media/FYQb1DOX0AABGLo?format=jpg",
    },
    {
        src: "/gallery/kaan-1.jpg",
        kind: "render",
        width: 2560,
        height: 1463,
        alt: {
            tr: "Alacakaranlıkta art yakıcıyla tırmanan KAAN'ın dijital çizimi",
            en: "Digital render of KAAN climbing in afterburner at dusk",
        },
        credit: UNKNOWN,
        note: { tr: "Bilgisayar çizimi; görselde \"KAAN MMU\" ibaresi var.", en: "Computer render; the image carries a \"KAAN MMU\" mark." },
    },
    {
        src: "/gallery/kaan-13.jpg",
        kind: "render",
        width: 1280,
        height: 720,
        alt: {
            tr: "Arazi üzerinde iniş takımları açık uçan KAAN çizimi",
            en: "Render of KAAN flying over open country with the landing gear down",
        },
        credit: {
            tr: "Türk haber sitelerinde kullanılan stok görsel; asıl sahibi belirsiz",
            en: "Stock image used by Turkish news sites; original owner unknown",
        },
    },
    {
        src: "/gallery/kaan-4.jpg",
        kind: "render",
        width: 2560,
        height: 1704,
        alt: {
            tr: "Erken dönem TF-X tasarımının önden çizimi",
            en: "Head-on render of an early TF-X design",
        },
        credit: UNKNOWN,
        note: { tr: "Program KAAN adını almadan önceki TF-X tasarımı.", en: "TF-X design from before the programme was named KAAN." },
    },
    {
        src: "/gallery/kaan-7.jpg",
        kind: "diagram",
        width: 1441,
        height: 700,
        alt: {
            tr: "KAAN gövdesini taşıyan montaj fikstürü (APAJ) çizimi",
            en: "Drawing of an assembly jig (APAJ) holding a KAAN airframe",
        },
        credit: {
            tr: "Türkçe bir yayından alınmış şekil (\"Şekil 1: APAJ sistemi\"); yayın belirsiz",
            en: "Figure from a Turkish-language publication (\"Şekil 1: APAJ sistemi\"); publication unknown",
        },
    },
];

/** Videos in /public/videos; each has an .mp4, a .webm and a poster in /media/posters. */
export const videoCredits: MediaCredit[] = [
    {
        src: "/videos/kaan.mp4",
        kind: "video",
        alt: {
            tr: "KAAN P0'ın ilk uçuşu: kalkış, eskort uçağından görüntüler ve paraşütle iniş",
            en: "KAAN P0's first flight: take-off, views from the chase aircraft and the drag-chute landing",
        },
        credit: UNKNOWN,
        note: {
            tr: "Görüntülerin TUSAŞ'ın ilk uçuş yayınından geldiği düşünülüyor; buradaki kopya kamuya açık bir paylaşımdan alındı, doğrulanmadı.",
            en: "The footage is thought to come from Turkish Aerospace's first-flight release; the copy used here came from a public share and is not verified.",
        },
    },
    {
        src: "/videos/anka3.mp4",
        kind: "video",
        alt: {
            tr: "ANKA-3 insansız savaş uçağının taksi ve uçuş görüntüleri",
            en: "ANKA-3 unmanned combat aircraft taxiing and in flight",
        },
        credit: {
            tr: "Videonun sonunda Cumhurbaşkanlığı, SSB ve TUSAŞ logoları yer alıyor",
            en: "The video ends with the logos of the Turkish Presidency, SSB and Turkish Aerospace",
        },
        note: {
            tr: "Kurumsal tanıtım videosu olduğu anlaşılıyor; buradaki kopya kamuya açık bir paylaşımdan alındı.",
            en: "Appears to be an official promotional video; the copy used here came from a public share.",
        },
    },
    {
        src: "/videos/super-simsek.mp4",
        kind: "video",
        alt: {
            tr: "Süper Şimşek atış testi görüntüleri; ANKA-3 de görülüyor",
            en: "Süper Şimşek firing test footage; ANKA-3 is also shown",
        },
        credit: UNKNOWN,
        note: {
            tr: "Videodaki yazı \"Süper Şimşek atış testi\" diyor; yayımlayan belirlenemedi.",
            en: "On-screen text reads \"Süper Şimşek atış testi\" (firing test); publisher not identified.",
        },
    },
];

/** 3D models in /public/models. */
export const modelCredits: MediaCredit[] = [
    {
        src: "/models/KAAN.glb",
        kind: "model",
        alt: { tr: "KAAN 3D modeli", en: "KAAN 3D model" },
        credit: { tr: "Model: Kaan Azman", en: "Model: Kaan Azman" },
        sourceUrl: "https://www.linkedin.com/in/kaan-azman-591776201/",
    },
    {
        src: "/models/anka3.glb",
        kind: "model",
        alt: { tr: "ANKA-3 3D modeli", en: "ANKA-3 3D model" },
        credit: { tr: "Modelin yapımcısı bilinmiyor", en: "Model author unknown" },
    },
    {
        src: "/models/super-simsek.glb",
        kind: "model",
        alt: { tr: "Süper Şimşek 3D modeli", en: "Süper Şimşek 3D model" },
        credit: { tr: "Modelin yapımcısı bilinmiyor", en: "Model author unknown" },
    },
];

export const allCredits: MediaCredit[] = [...galleryCredits, ...videoCredits, ...modelCredits];

/** Video file set for a name in the shared naming convention. */
export function videoSources(name: "kaan" | "anka3" | "super-simsek") {
    return {
        mp4: `/videos/${name}.mp4`,
        webm: `/videos/${name}.webm`,
        poster: `/media/posters/${name}.jpg`,
    };
}
