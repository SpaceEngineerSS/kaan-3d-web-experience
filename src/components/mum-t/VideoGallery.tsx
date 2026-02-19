"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, X, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMumtT } from "@/lib/mumt-translations";

interface VideoItem {
    id: string;
    title: string;
    description: string;
    src: string;
    tag: string;
    tagColor: string;
}

const VIDEO_META = [
    { id: "kaan-flight", src: "/videos/kaan.mp4", tag: "KAAN", tagColor: "#00d4ff" },
    { id: "anka3-test", src: "/videos/anka3.mp4", tag: "ANKA-3", tagColor: "#a78bfa" },
    { id: "simsek-launch", src: "/videos/süpersimsek.mp4", tag: "S.ŞİMŞEK", tagColor: "#fbbf24" },
];

function VideoCard({
    video,
    onPlay,
    index,
}: {
    video: VideoItem;
    onPlay: () => void;
    index: number;
}) {
    const previewRef = useRef<HTMLVideoElement>(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/5 transition-colors duration-300 hover:border-cyan-500/15"
            onClick={onPlay}
            onMouseEnter={() => previewRef.current?.play()}
            onMouseLeave={() => {
                if (previewRef.current) {
                    previewRef.current.pause();
                    previewRef.current.currentTime = 0;
                }
            }}
        >
            <div className="relative aspect-video overflow-hidden bg-slate-900">
                <video
                    ref={previewRef}
                    src={video.src}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                        <Play className="ml-0.5 h-5 w-5 text-white" />
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                    <span
                        className="rounded-md border px-2 py-0.5 font-mono text-[8px] tracking-wider"
                        style={{
                            borderColor: `${video.tagColor}20`,
                            color: video.tagColor,
                        }}
                    >
                        {video.tag}
                    </span>
                </div>
                <h3 className="mb-1 text-sm font-bold text-white">
                    {video.title}
                </h3>
                <p className="text-[11px] text-slate-500">
                    {video.description}
                </p>
            </div>
        </motion.div>
    );
}

export function VideoGallery() {
    const { locale } = useLanguage();
    const mt = useMumtT(locale);
    const VIDEOS: VideoItem[] = VIDEO_META.map((v, i) => ({
        ...v,
        title: mt.videos[i]?.title ?? v.id,
        description: mt.videos[i]?.description ?? "",
    }));
    const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const modalVideoRef = useRef<HTMLVideoElement>(null);

    function handlePlay(video: VideoItem) {
        setActiveVideo(video);
        setIsPlaying(true);
    }

    function handleClose() {
        setActiveVideo(null);
        setIsPlaying(false);
    }

    function togglePlayPause() {
        if (!modalVideoRef.current) return;
        if (modalVideoRef.current.paused) {
            modalVideoRef.current.play();
            setIsPlaying(true);
        } else {
            modalVideoRef.current.pause();
            setIsPlaying(false);
        }
    }

    return (
        <section className="relative bg-[#020617] px-4 py-16 sm:px-6 md:px-12 md:py-24">
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-14 text-center"
                >
                    <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-cyan-400/60">
                        {mt.videoGallery.tag}
                    </p>
                    <h2 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                        {mt.videoGallery.title}{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            {mt.videoGallery.titleHighlight}
                        </span>
                    </h2>
                </motion.div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {VIDEOS.map((video, i) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            index={i}
                            onPlay={() => handlePlay(video)}
                        />
                    ))}
                </div>
            </div>

            {activeVideo && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 md:p-8"
                    onClick={handleClose}
                >
                    <button
                        onClick={handleClose}
                        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:bg-white/10"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div
                        className="relative w-full max-w-5xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                            <video
                                ref={modalVideoRef}
                                src={activeVideo.src}
                                autoPlay
                                controls
                                playsInline
                                className="h-full w-full object-contain"
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div>
                                <span
                                    className="mr-2 rounded-md border px-2 py-0.5 font-mono text-[8px] tracking-wider"
                                    style={{
                                        borderColor: `${activeVideo.tagColor}20`,
                                        color: activeVideo.tagColor,
                                    }}
                                >
                                    {activeVideo.tag}
                                </span>
                                <span className="text-sm font-bold text-white">
                                    {activeVideo.title}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </section>
    );
}
