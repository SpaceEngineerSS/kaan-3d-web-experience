"use client";

import { useEffect } from "react";

interface KeyboardShortcutsProps {
    onToggleTheme: () => void;
    onToggleMute: () => void;
    onToggleLanguage: () => void;
}

/**
 * useKeyboardShortcuts — Global keyboard shortcuts for the KAAN site.
 *
 * Shortcuts:
 * - N: Toggle Night/Day mode
 * - M: Toggle Mute/Unmute
 * - L: Toggle Language (TR/EN)
 *
 * All shortcuts are disabled when user is focused on an input, textarea, or
 * contenteditable element to prevent interference with typing.
 */
export function useKeyboardShortcuts({
    onToggleTheme,
    onToggleMute,
    onToggleLanguage,
}: KeyboardShortcutsProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Skip if user is typing in an input
            const target = e.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            // Skip if modifier keys are held
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
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onToggleTheme, onToggleMute, onToggleLanguage]);
}
