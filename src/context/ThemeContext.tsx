"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    type ReactNode,
} from "react";

export type ThemeMode = "day" | "night";

interface ThemeContextValue {
    mode: ThemeMode;
    toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    mode: "night",
    toggle: () => { },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>(() => {
        if (typeof window === "undefined") return "night";
        const hour = new Date().getHours();
        return hour >= 6 && hour < 18 ? "day" : "night";
    });

    /* Auto-detect: 06:00–18:00 = day */
    const toggle = useCallback(() => {
        setMode((prev) => (prev === "day" ? "night" : "day"));
    }, []);

    /* Set data-theme on <html> so CSS can respond */
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", mode);
    }, [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
