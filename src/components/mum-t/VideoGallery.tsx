"use client";

import { useT } from "@/context/LanguageContext";
import { Chapter, SourceNote } from "@/components/site/Chapter";
import { videos } from "@/content/mumt";
import { videoSources } from "@/content/media-credits";

/** Chapter 10: three videos, nothing downloaded until play. */
export function VideoGallery() {
    const t = useT();
    const c = t(videos);

    return (
        <Chapter id="videos" index={10} label={c.label} title={c.title} lede={c.lede} solid tight className="py-24 md:py-36">
            <ul className="grid gap-10 md:grid-cols-12 md:gap-6">
                {c.items.map((v, i) => {
                    const src = videoSources(v.name);
                    return (
                    <li key={v.name} className={i === 0 ? "md:col-span-12 lg:col-span-6" : "md:col-span-6 lg:col-span-3"} data-reveal>
                        <figure>
                            <video
                                className="border border-edge-2 bg-black aspect-video w-full object-cover"
                                controls
                                playsInline
                                preload="none"
                                poster={src.poster}
                                width={1280}
                                height={720}
                                aria-label={v.title}
                            >
                                <source src={src.mp4} type="video/mp4" />
                            </video>
                            <figcaption className="mt-3">
                                <span className="block font-medium text-fg">{v.title}</span>
                                <span className="mt-1 block text-[0.9375rem] text-fg-2">{v.body}</span>
                            </figcaption>
                        </figure>
                    </li>
                    );
                })}
            </ul>
            <SourceNote>{c.rights}</SourceNote>
        </Chapter>
    );
}
