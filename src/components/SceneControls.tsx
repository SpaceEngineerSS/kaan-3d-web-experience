"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
    Eye,
    RotateCcw,
    Scan,
    Camera,
    ChevronUp,
    ChevronDown,
} from "lucide-react";

interface SceneControlsProps {
    xRayMode: boolean;
    onToggleXRay: () => void;
    cameraPreset: string | null;
    onSetCameraPreset: (preset: string | null) => void;
}

const cameraPresets = [
    { id: "front", labelTR: "ÖN", labelEN: "FRONT", key: "1" },
    { id: "side", labelTR: "YAN", labelEN: "SIDE", key: "2" },
    { id: "top", labelTR: "ÜST", labelEN: "TOP", key: "3" },
    { id: "rear", labelTR: "ARKA", labelEN: "REAR", key: "4" },
    { id: "cockpit", labelTR: "KOKPİT", labelEN: "COCKPIT", key: "5" },
];

export function SceneControls({
    xRayMode,
    onToggleXRay,
    cameraPreset,
    onSetCameraPreset,
}: SceneControlsProps) {
    const { locale } = useLanguage();
    const [collapsed, setCollapsed] = useState(false);
    const [showCameras, setShowCameras] = useState(false);

    const handlePreset = useCallback(
        (id: string) => {
            onSetCameraPreset(cameraPreset === id ? null : id);
        },
        [cameraPreset, onSetCameraPreset]
    );

    return (
        <div className="fixed right-3 top-1/2 z-40 -translate-y-1/2 flex flex-col items-end gap-2 md:right-4">
            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neon-blue/20 bg-cockpit-dark/80 backdrop-blur-md transition-all hover:border-neon-blue/40"
                title={collapsed ? "Expand" : "Collapse"}
            >
                {collapsed ? (
                    <ChevronUp className="h-3 w-3 text-neon-blue/60" />
                ) : (
                    <ChevronDown className="h-3 w-3 text-neon-blue/60" />
                )}
            </button>

            {!collapsed && (
                <div className="flex flex-col gap-1.5 rounded-xl border border-neon-blue/10 bg-cockpit-dark/80 p-2 backdrop-blur-md">
                    {/* X-Ray Mode */}
                    <ControlButton
                        active={xRayMode}
                        onClick={onToggleXRay}
                        title={locale === "tr" ? "X-Ray Modu (X)" : "X-Ray Mode (X)"}
                        icon={<Scan className="h-3.5 w-3.5" />}
                        label="X-RAY"
                    />

                    {/* Camera Presets Toggle */}
                    <ControlButton
                        active={showCameras}
                        onClick={() => setShowCameras(!showCameras)}
                        title={locale === "tr" ? "Kamera Açıları" : "Camera Angles"}
                        icon={<Camera className="h-3.5 w-3.5" />}
                        label="CAM"
                    />

                    {/* Camera Preset List */}
                    {showCameras && (
                        <div className="flex flex-col gap-1 border-t border-neon-blue/10 pt-1.5">
                            {cameraPresets.map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => handlePreset(preset.id)}
                                    className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-left transition-all ${
                                        cameraPreset === preset.id
                                            ? "border border-neon-blue/30 bg-neon-blue/10 text-neon-blue"
                                            : "border border-transparent text-titanium-light/50 hover:bg-neon-blue/5 hover:text-titanium-light"
                                    }`}
                                    title={`${locale === "tr" ? preset.labelTR : preset.labelEN} (${preset.key})`}
                                >
                                    <Eye className="h-2.5 w-2.5" />
                                    <span
                                        className="text-[8px] tracking-[0.2em]"
                                        style={{ fontFamily: "var(--font-mono)" }}
                                    >
                                        {locale === "tr" ? preset.labelTR : preset.labelEN}
                                    </span>
                                    <span
                                        className="ml-auto text-[7px] opacity-40"
                                        style={{ fontFamily: "var(--font-mono)" }}
                                    >
                                        {preset.key}
                                    </span>
                                </button>
                            ))}

                            {/* Reset */}
                            <button
                                onClick={() => onSetCameraPreset(null)}
                                className="flex items-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-left text-titanium-light/40 transition-all hover:bg-red-500/5 hover:text-red-400/60"
                            >
                                <RotateCcw className="h-2.5 w-2.5" />
                                <span
                                    className="text-[8px] tracking-[0.2em]"
                                    style={{ fontFamily: "var(--font-mono)" }}
                                >
                                    {locale === "tr" ? "SIFIRLA" : "RESET"}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function ControlButton({
    active,
    onClick,
    title,
    icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    title: string;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-all ${
                active
                    ? "border border-neon-blue/30 bg-neon-blue/10 text-neon-blue"
                    : "border border-transparent text-titanium-light/40 hover:bg-neon-blue/5 hover:text-titanium-light/70"
            }`}
        >
            {icon}
            <span
                className="text-[8px] tracking-[0.2em]"
                style={{ fontFamily: "var(--font-mono)" }}
            >
                {label}
            </span>
        </button>
    );
}
