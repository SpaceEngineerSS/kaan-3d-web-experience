"use client";

import React, { Component, type ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("[KAAN] WebGL Error:", error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex h-screen w-full flex-col items-center justify-center bg-cockpit-dark">
                    <div className="glass-panel rounded-lg p-8 text-center max-w-md">
                        <div className="mb-4 flex justify-center">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neon-blue">
                                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <h2 className="mb-2 font-[var(--font-heading)] text-xl font-semibold text-neon-blue">
                            SYSTEMS OFFLINE
                        </h2>
                        <p className="text-sm text-titanium-light font-[var(--font-mono)]">
                            WebGL context lost or GPU unavailable. Refresh to re-engage.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 rounded border border-neon-blue/30 bg-neon-blue/10 px-6 py-2 text-sm text-neon-blue transition-all hover:bg-neon-blue/20 hover:border-neon-blue/50"
                        >
                            RESTART SYSTEMS
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
