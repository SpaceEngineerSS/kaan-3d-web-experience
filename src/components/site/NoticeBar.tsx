"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useT } from "@/context/LanguageContext";

const KEY = "kaan-notice-v2";
const listeners = new Set<() => void>();

let dismissed = false;

function read(): boolean {
    if (dismissed) return false;
    try {
        return localStorage.getItem(KEY) !== "1";
    } catch {
        return true;
    }
}

const copy = {
    tr: {
        text: "Resmi site değildir · TUSAŞ ile bağı olmayan bağımsız, kâr amacı gütmeyen çalışma · görsel hakları sahiplerine aittir.",
        ok: "TAMAM",
    },
    en: {
        text: "Not an official site · independent, non-commercial study, not affiliated with Turkish Aerospace · image rights belong to their owners.",
        ok: "OK",
    },
};

/** A one-time, non-blocking notice. Rendered only on the client so it never mismatches the server HTML. */
export function NoticeBar() {
    const t = useT();
    const open = useSyncExternalStore(
        (cb) => {
            listeners.add(cb);
            return () => listeners.delete(cb);
        },
        read,
        () => false
    );

    const close = useCallback(() => {
        dismissed = true;
        try {
            localStorage.setItem(KEY, "1");
        } catch {
            /* private mode: close for this view only */
        }
        listeners.forEach((fn) => fn());
    }, []);

    // Once the visitor has scrolled a screen, they have seen it: dismiss on its own.
    useEffect(() => {
        if (!open) return;
        const onScroll = () => {
            if (window.scrollY > window.innerHeight) close();
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [open, close]);

    if (!open) return null;
    const c = t(copy);

    return (
        <div role="region" aria-label="Notice" className="fixed inset-x-0 bottom-0 z-50 border-t border-edge bg-ink sm:inset-x-4 sm:bottom-4 sm:border">
            <div className="flex items-center gap-3 px-4 py-2">
                <p className="t-tele flex-1 normal-case leading-snug tracking-[0.04em] text-fg-2">{c.text}</p>
                <button type="button" onClick={close} className="toggle shrink-0 text-fg">
                    {c.ok}
                </button>
            </div>
        </div>
    );
}
