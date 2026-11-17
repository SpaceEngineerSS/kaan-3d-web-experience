"use client";

import { useCallback, useSyncExternalStore } from "react";
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
        text: "Bu site resmi değildir. TUSAŞ ile bağı olmayan, kâr amacı gütmeyen bağımsız bir çalışmadır; marka ve görsellerin hakları sahiplerine aittir.",
        ok: "Anladım",
    },
    en: {
        text: "This is not an official site. It is an independent, non-commercial study with no link to Turkish Aerospace; trademarks and images belong to their owners.",
        ok: "Got it",
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

    if (!open) return null;
    const c = t(copy);

    return (
        <div role="region" aria-label="Notice" className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ground-2/95 backdrop-blur-sm">
            <div className="wrap flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[0.8125rem] leading-snug text-fg-2">{c.text}</p>
                <button type="button" onClick={close} className="btn shrink-0 self-start sm:self-auto">
                    {c.ok}
                </button>
            </div>
        </div>
    );
}
