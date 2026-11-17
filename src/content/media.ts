import type { Locale } from "@/context/LanguageContext";

type L<T = string> = Record<Locale, T>;

export const mediaCopy: L<{
    label: string;
    title: string;
    lede: string;
    videoTitle: string;
    videoBody: string;
    videoDuration: string;
    credit: string;
    galleryTitle: string;
    galleryNote: string;
    allSources: string;
    open: string;
    close: string;
    prev: string;
    next: string;
    source: string;
    of: string;
    kind: Record<"photo" | "render" | "diagram", string>;
    noVideo: string;
}> = {
    tr: {
        label: "Arşiv",
        title: "Görüntüler",
        lede: "İlk uçuşun videosu ve kamuya açık paylaşılmış fotoğraflar. Her görselin altında bilinen kaynağı yazıyor; kaynağı bilinmeyenler de öyle işaretlendi.",
        videoTitle: "İlk uçuş, 21 Şubat 2024",
        videoBody: "P0 prototipinin kalkışı, eskort uçağından çekilen görüntüler ve fren paraşütüyle iniş.",
        videoDuration: "Süre",
        credit: "Kaynak",
        galleryTitle: "Fotoğraflar ve çizimler",
        galleryNote: "Görsellerin hakları sahiplerine aittir. Büyütmek ve kaynağı görmek için bir görsele dokunun.",
        allSources: "Tüm kaynaklar ve görsel hakları",
        open: "Büyüt",
        close: "Kapat",
        prev: "Önceki görsel",
        next: "Sonraki görsel",
        source: "Kaynak bağlantısı",
        of: "/",
        kind: { photo: "fotoğraf", render: "çizim", diagram: "şekil" },
        noVideo: "Tarayıcınız video oynatmayı desteklemiyor.",
    },
    en: {
        label: "Archive",
        title: "Footage and images",
        lede: "Video of the first flight and publicly shared photographs. Each image carries its known source; images whose source is unknown are marked as such.",
        videoTitle: "First flight, 21 February 2024",
        videoBody: "P0's take-off, views from the chase aircraft and the landing with the drag chute.",
        videoDuration: "Length",
        credit: "Source",
        galleryTitle: "Photos and renders",
        galleryNote: "Image rights belong to their owners. Tap an image to enlarge it and see its source.",
        allSources: "All sources and image credits",
        open: "Enlarge",
        close: "Close",
        prev: "Previous image",
        next: "Next image",
        source: "Source link",
        of: "of",
        kind: { photo: "photo", render: "render", diagram: "figure" },
        noVideo: "Your browser does not support video playback.",
    },
};
