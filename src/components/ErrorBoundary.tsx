"use client";

import React, { Component, type ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

const copy = {
    tr: {
        title: "3D görünüm yüklenemedi",
        body: "Tarayıcınız WebGL'i desteklemiyor ya da grafik bağlamı kayboldu. Sayfanın geri kalanı normal çalışır.",
        retry: "Tekrar dene",
    },
    en: {
        title: "The 3D view could not load",
        body: "Your browser does not support WebGL, or the graphics context was lost. The rest of the page works as usual.",
        retry: "Try again",
    },
};

function DefaultFallback({ onRetry }: { onRetry: () => void }) {
    const { locale } = useLanguage();
    const c = copy[locale];
    return (
        <div role="status" className="flex h-full min-h-64 w-full items-center justify-center bg-ink-2 p-6">
            <div className="panel max-w-md p-6">
                <p className="t-h3 text-fg">{c.title}</p>
                <p className="t-body mt-3 text-[0.9375rem]">{c.body}</p>
                <button type="button" onClick={onRetry} className="btn mt-6">
                    {c.retry}
                </button>
            </div>
        </div>
    );
}

/** Catches render errors from a 3D subtree (usually WebGL) and shows a fallback instead. */
export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("[KAAN] 3D view failed:", error, info.componentStack);
    }

    private retry = () => this.setState({ hasError: false });

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? <DefaultFallback onRetry={this.retry} />;
        }
        return this.props.children;
    }
}
