"use client";

import { useLanguage } from "@/context/LanguageContext";

interface ShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const shortcuts = [
    { key: "N", descTR: "Gece/Gündüz Modu", descEN: "Night/Day Mode" },
    { key: "M", descTR: "Ses Aç/Kapat", descEN: "Mute/Unmute" },
    { key: "L", descTR: "Dil Değiştir (TR/EN)", descEN: "Toggle Language (TR/EN)" },
    { key: "X", descTR: "X-Ray Modu", descEN: "X-Ray Mode" },
    { key: "H", descTR: "Bilgi Noktaları", descEN: "Info Hotspots" },
    { key: "1-5", descTR: "Kamera Açıları", descEN: "Camera Presets" },
    { key: "0", descTR: "Kamerayı Sıfırla", descEN: "Reset Camera" },
    { key: "F", descTR: "Tam Ekran", descEN: "Fullscreen" },
    { key: "?", descTR: "Kısayollar", descEN: "Show Shortcuts" },
];

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
    const { locale } = useLanguage();

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-stealth-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="glass-panel w-full max-w-md rounded-2xl p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">
                        {locale === "tr" ? "Klavye Kısayolları" : "Keyboard Shortcuts"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-titanium/20 text-slate-400 transition-all hover:border-red-500/30 hover:text-red-400"
                    >
                        &times;
                    </button>
                </div>

                <div className="space-y-2">
                    {shortcuts.map((shortcut, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between rounded-lg border border-titanium/10 bg-titanium/5 px-4 py-2.5"
                        >
                            <span className="text-sm text-slate-300">
                                {locale === "tr" ? shortcut.descTR : shortcut.descEN}
                            </span>
                            <kbd
                                className="rounded border border-neon-blue/20 bg-neon-blue/5 px-2.5 py-1 text-xs font-bold text-neon-blue"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {shortcut.key}
                            </kbd>
                        </div>
                    ))}
                </div>

                <p
                    className="mt-4 text-center text-[9px] tracking-[0.2em] text-slate-500"
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    {locale === "tr"
                        ? "ESC VEYA DIŞARI TIKLAYARAK KAPATIN"
                        : "PRESS ESC OR CLICK OUTSIDE TO CLOSE"}
                </p>
            </div>
        </div>
    );
}
