import { ConfirmationButtonType } from "@/structures/types";
import { Ref } from "@vue/composition-api";

export interface LoadDialogsOutput {
    periodNamesEditDialog: Ref<boolean>;
    periodNamesEditDialogForceRender: Ref<number>;
    periodNamesExportDialog: Ref<boolean>;
    periodNamesImportDialog: Ref<boolean>;
    notificationsEditDialog: Ref<boolean>;
    notificationsEditDialogForceRender: Ref<number>;
    notificationsExportDialog: Ref<boolean>;
    notificationsImportDialog: Ref<boolean>;
}
export interface ConfirmationButton {
    place: ConfirmationButtonType;
    title: string;
    callbackName?: string;
}

export enum ConfirmationKeys {
    CLEAR_PERIOD_NAMES = "clearPeriodNames",
}
