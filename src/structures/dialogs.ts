import { ConfirmationButtonType } from "@/structures/types";

export interface ConfirmationButton {
    place: ConfirmationButtonType;
    title: string;
    callbackName?: string;
}

export enum ConfirmationKeys {
    CLEAR_PERIOD_NAMES = "clearPeriodNames",
}
