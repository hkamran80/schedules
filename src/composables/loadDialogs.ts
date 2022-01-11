import { ref } from "@vue/composition-api";

export function loadDialogs(): any {
    const periodNamesEditDialog = ref(false);
    const periodNamesEditDialogForceRender = ref(0);
    const periodNamesExportDialog = ref(false);
    const periodNamesImportDialog = ref(false);

    const notificationsEditDialog = ref(false);
    const notificationsEditDialogForceRender = ref(0);
    const notificationsExportDialog = ref(false);
    const notificationsImportDialog = ref(false);

    return {
        periodNamesEditDialog,
        periodNamesEditDialogForceRender,
        periodNamesExportDialog,
        periodNamesImportDialog,

        notificationsEditDialog,
        notificationsEditDialogForceRender,
        notificationsExportDialog,
        notificationsImportDialog,
    };
}
