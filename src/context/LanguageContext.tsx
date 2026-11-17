"use client";

import { LOCALE_COOKIE } from "@/lib/site";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "tr" | "en";


interface LanguageContextValue {
    locale: Locale;
    setLocale: (next: Locale) => void;
    toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
    locale: "tr",
    setLocale: () => {},
    toggle: () => {},
});

export function LanguageProvider({ children, initialLocale = "tr" }: { children: ReactNode; initialLocale?: Locale }) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale);

    const setLocale = useCallback((next: Locale) => {
        setLocaleState(next);
        document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    }, []);

    const toggle = useCallback(() => {
        setLocale(locale === "tr" ? "en" : "tr");
    }, [locale, setLocale]);

    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    const value = useMemo(() => ({ locale, setLocale, toggle }), [locale, setLocale, toggle]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    return useContext(LanguageContext);
}

/** Pick the string for the active locale from a { tr, en } pair. */
export function useT() {
    const { locale } = useLanguage();
    return useCallback(<T,>(pair: Record<Locale, T>) => pair[locale], [locale]);
}
