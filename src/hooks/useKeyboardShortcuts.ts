"use client";

import { useEffect } from "react";

interface KeyboardShortcutsProps {
    onToggleTheme: () => void;
    onToggleMute: () => void;
    onToggleLanguage: () => void;
    onToggleXRay?: () => void;
    onToggleHotspots?: () => void;
    onCameraPreset?: (preset: string | null) => void;
    onToggleFullscreen?: () => void;
    onShowHelp?: () => void;
}

/**
 * useKeyboardShortcuts — Global keyboard shortcuts for the KAAN site.
 *
 * Shortcuts:
 * - N: Toggle Night/Day mode
 * - M: Toggle Mute/Unmute
 * - L: Toggle Language (TR/EN)
 * - X: Toggle X-Ray mode
 * - H: Toggle Hotspots
 * - 1-5: Camera presets (Front, Side, Top, Rear, Cockpit)
 * - 0: Reset camera
 * - F: Toggle Fullscreen
 * - ?: Show shortcuts help
 */
export function useKeyboardShortcuts({
    onToggleTheme,
    onToggleMute,
    onToggleLanguage,
    onToggleXRay,
    onToggleHotspots,
    onCameraPreset,
    onToggleFullscreen,
    onShowHelp,
}: KeyboardShortcutsProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            if (e.ctrlKey || e.metaKey || e.altKey) return;

            switch (e.key.toLowerCase()) {
                case "n":
                    e.preventDefault();
                    onToggleTheme();
                    break;
                case "m":
                    e.preventDefault();
                    onToggleMute();
                    break;
                case "l":
                    e.preventDefault();
                    onToggleLanguage();
                    break;
                case "x":
                    e.preventDefault();
                    onToggleXRay?.();
                    break;
                case "h":
                    e.preventDefault();
                    onToggleHotspots?.();
                    break;
                case "1":
                    e.preventDefault();
                    onCameraPreset?.("front");
                    break;
                case "2":
                    e.preventDefault();
                    onCameraPreset?.("side");
                    break;
                case "3":
                    e.preventDefault();
                    onCameraPreset?.("top");
                    break;
                case "4":
                    e.preventDefault();
                    onCameraPreset?.("rear");
                    break;
                case "5":
                    e.preventDefault();
                    onCameraPreset?.("cockpit");
                    break;
                case "0":
                    e.preventDefault();
                    onCameraPreset?.(null);
                    break;
                case "f":
                    e.preventDefault();
                    onToggleFullscreen?.();
                    break;
                case "?":
                    e.preventDefault();
                    onShowHelp?.();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onToggleTheme, onToggleMute, onToggleLanguage, onToggleXRay, onToggleHotspots, onCameraPreset, onToggleFullscreen, onShowHelp]);
}
