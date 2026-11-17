import type { FormationMode } from "@/content/mumt";

export type { FormationMode };

type V3 = [number, number, number];

export interface FormationPose {
    kaan: { bank: number; yaw: number };
    alpha: { pos: V3; rot: V3 };
    bravo: { pos: V3; rot: V3 };
    /** Data-link line opacity per wingman, 0..1. */
    linkAlpha: number;
    linkBravo: number;
}

export const FORMATION_MODES: FormationMode[] = ["FORMATION", "BANK_LEFT", "BANK_RIGHT", "SEAD_DEPLOY", "STRIKE_RELEASE"];

const ALPHA: V3 = [-6.5, -0.8, -3];
const BRAVO: V3 = [6.5, -0.8, -3];
const BANK = 0.3;

/** Target pose of each aircraft for a formation command. The scene eases toward it. */
export function formationPose(mode: FormationMode): FormationPose {
    switch (mode) {
        case "BANK_LEFT":
            return {
                kaan: { bank: -BANK, yaw: -0.08 },
                alpha: { pos: [ALPHA[0] + 1.2, ALPHA[1] - 0.4, ALPHA[2]], rot: [0, 0, -BANK * 0.8] },
                bravo: { pos: [BRAVO[0] + 1.2, BRAVO[1] + 0.4, BRAVO[2]], rot: [0, 0, -BANK * 0.8] },
                linkAlpha: 0.55,
                linkBravo: 0.55,
            };
        case "BANK_RIGHT":
            return {
                kaan: { bank: BANK, yaw: 0.08 },
                alpha: { pos: [ALPHA[0] - 1.2, ALPHA[1] + 0.4, ALPHA[2]], rot: [0, 0, BANK * 0.8] },
                bravo: { pos: [BRAVO[0] - 1.2, BRAVO[1] - 0.4, BRAVO[2]], rot: [0, 0, BANK * 0.8] },
                linkAlpha: 0.55,
                linkBravo: 0.55,
            };
        case "SEAD_DEPLOY":
            return {
                kaan: { bank: 0, yaw: 0 },
                alpha: { pos: ALPHA, rot: [0, 0, 0] },
                bravo: { pos: [9.5, 0.6, -8], rot: [0.08, -0.3, BANK * 0.4] },
                linkAlpha: 0.55,
                linkBravo: 0.25,
            };
        case "STRIKE_RELEASE":
            return {
                kaan: { bank: 0.04, yaw: 0 },
                alpha: { pos: [-9, -2.6, 2], rot: [-0.15, 0.12, -0.12] },
                bravo: { pos: BRAVO, rot: [0, 0, 0] },
                linkAlpha: 0.25,
                linkBravo: 0.55,
            };
        case "FORMATION":
        default:
            return {
                kaan: { bank: 0, yaw: 0 },
                alpha: { pos: ALPHA, rot: [0, 0, 0] },
                bravo: { pos: BRAVO, rot: [0, 0, 0] },
                linkAlpha: 0.55,
                linkBravo: 0.55,
            };
    }
}
