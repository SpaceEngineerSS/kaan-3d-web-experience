"use client";

import { createContext, useContext, useReducer, type Dispatch } from "react";

export type FormationMode =
    | "FORMATION"
    | "BANK_LEFT"
    | "BANK_RIGHT"
    | "SEAD_DEPLOY"
    | "STRIKE_RELEASE"
    | "FREE";

interface FormationState {
    mode: FormationMode;
    kaan: { bankAngle: number; yawOffset: number };
    alpha: { pos: [number, number, number]; rot: [number, number, number]; deployed: boolean };
    bravo: { pos: [number, number, number]; rot: [number, number, number]; deployed: boolean };
    linkAlpha: { opacity: number };
    linkBravo: { opacity: number };
}

type FormationAction = { type: "SET_MODE"; mode: FormationMode };

const BASE_ALPHA: [number, number, number] = [-6, -1, -2.5];
const BASE_BRAVO: [number, number, number] = [6, -1, -2.5];

const BANK_ANGLE = 0.3;

function computeState(mode: FormationMode): FormationState {
    switch (mode) {
        case "FORMATION":
            return {
                mode,
                kaan: { bankAngle: 0, yawOffset: 0 },
                alpha: { pos: BASE_ALPHA, rot: [0, 0, 0], deployed: false },
                bravo: { pos: BASE_BRAVO, rot: [0, 0, 0], deployed: false },
                linkAlpha: { opacity: 0.35 },
                linkBravo: { opacity: 0.35 },
            };

        case "BANK_LEFT":
            return {
                mode,
                kaan: { bankAngle: -BANK_ANGLE, yawOffset: -0.08 },
                alpha: {
                    pos: [BASE_ALPHA[0] + 1.2, BASE_ALPHA[1] - 0.4, BASE_ALPHA[2]],
                    rot: [0, 0, -BANK_ANGLE * 0.7],
                    deployed: false,
                },
                bravo: {
                    pos: [BASE_BRAVO[0] + 1.2, BASE_BRAVO[1] + 0.3, BASE_BRAVO[2]],
                    rot: [0, 0, -BANK_ANGLE * 0.7],
                    deployed: false,
                },
                linkAlpha: { opacity: 0.35 },
                linkBravo: { opacity: 0.35 },
            };

        case "BANK_RIGHT":
            return {
                mode,
                kaan: { bankAngle: BANK_ANGLE, yawOffset: 0.08 },
                alpha: {
                    pos: [BASE_ALPHA[0] - 1.2, BASE_ALPHA[1] + 0.3, BASE_ALPHA[2]],
                    rot: [0, 0, BANK_ANGLE * 0.7],
                    deployed: false,
                },
                bravo: {
                    pos: [BASE_BRAVO[0] - 1.2, BASE_BRAVO[1] - 0.4, BASE_BRAVO[2]],
                    rot: [0, 0, BANK_ANGLE * 0.7],
                    deployed: false,
                },
                linkAlpha: { opacity: 0.35 },
                linkBravo: { opacity: 0.35 },
            };

        case "SEAD_DEPLOY":
            return {
                mode,
                kaan: { bankAngle: 0, yawOffset: 0 },
                alpha: { pos: BASE_ALPHA, rot: [0, 0, 0], deployed: false },
                bravo: {
                    pos: [10, 0.5, -6],
                    rot: [0.08, -0.35, BANK_ANGLE * 0.5],
                    deployed: true,
                },
                linkAlpha: { opacity: 0.35 },
                linkBravo: { opacity: 0.08 },
            };

        case "STRIKE_RELEASE":
            return {
                mode,
                kaan: { bankAngle: 0.04, yawOffset: 0 },
                alpha: {
                    pos: [-9, -2.5, 3],
                    rot: [-0.15, 0.12, -0.1],
                    deployed: true,
                },
                bravo: { pos: BASE_BRAVO, rot: [0, 0, 0], deployed: false },
                linkAlpha: { opacity: 0.08 },
                linkBravo: { opacity: 0.35 },
            };

        case "FREE":
            return {
                mode,
                kaan: { bankAngle: 0, yawOffset: 0 },
                alpha: { pos: BASE_ALPHA, rot: [0, 0, 0], deployed: false },
                bravo: { pos: BASE_BRAVO, rot: [0, 0, 0], deployed: false },
                linkAlpha: { opacity: 0.35 },
                linkBravo: { opacity: 0.35 },
            };
    }
}

function formationReducer(_: FormationState, action: FormationAction): FormationState {
    return computeState(action.mode);
}

const initialState = computeState("FORMATION");

export const FormationStateCtx = createContext<FormationState>(initialState);
export const FormationDispatchCtx = createContext<Dispatch<FormationAction>>(() => { });

export function useFormationState() {
    return useContext(FormationStateCtx);
}

export function useFormationDispatch() {
    return useContext(FormationDispatchCtx);
}

export function useFormationReducer() {
    return useReducer(formationReducer, initialState);
}
