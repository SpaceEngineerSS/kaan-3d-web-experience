/**
 * @author Mehmet Gümüş [github.com/SpaceEngineerSS](https://github.com/SpaceEngineerSS)
 * @project KAAN 3D Web Experience
 */
"use client";

import { useSyncExternalStore } from "react";

interface DeviceProfile {
    isMobile: boolean;
    dpr: [number, number];
    shadowsEnabled: boolean;
    postProcessing: "full" | "off";
    particleDensity: number;
}

const MOBILE_BREAKPOINT = 768;

const MOBILE_PROFILE: DeviceProfile = {
    isMobile: true,
    dpr: [1, 1.5],
    shadowsEnabled: false,
    postProcessing: "off",
    particleDensity: 0.4,
};

const DESKTOP_PROFILE: DeviceProfile = {
    isMobile: false,
    dpr: [1, 2],
    shadowsEnabled: true,
    postProcessing: "full",
    particleDensity: 1.0,
};

const SERVER_PROFILE: DeviceProfile = DESKTOP_PROFILE;

let cachedProfile: DeviceProfile = SERVER_PROFILE;
const listeners = new Set<() => void>();

function getSnapshot(): DeviceProfile {
    return cachedProfile;
}

function getServerSnapshot(): DeviceProfile {
    return SERVER_PROFILE;
}

function recalculate() {
    const next =
        window.innerWidth < MOBILE_BREAKPOINT ? MOBILE_PROFILE : DESKTOP_PROFILE;

    if (next !== cachedProfile) {
        cachedProfile = next;
        listeners.forEach((fn) => fn());
    }
}

function subscribe(callback: () => void): () => void {
    if (listeners.size === 0) {
        recalculate();
        window.addEventListener("resize", recalculate);
    }

    listeners.add(callback);

    return () => {
        listeners.delete(callback);
        if (listeners.size === 0) {
            window.removeEventListener("resize", recalculate);
        }
    };
}

export function useDeviceProfile(): DeviceProfile {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
