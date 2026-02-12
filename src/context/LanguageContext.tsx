"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Locale = "tr" | "en";

interface LanguageContextValue {
    locale: Locale;
    toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
    locale: "tr",
    toggle: () => { },
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>("tr");

    const toggle = useCallback(() => {
        setLocale((prev) => (prev === "tr" ? "en" : "tr"));
    }, []);

    return (
        <LanguageContext.Provider value={{ locale, toggle }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
