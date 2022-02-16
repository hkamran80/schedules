import { loadFromStorage, saveToStorage } from "@/constructs/storage";
import { StorageKeys } from "@/models/storage";
import { ComponentInstance } from "@vue/composition-api";

export function initializeThemeState(root: ComponentInstance): void {
    const theme = loadFromStorage("", StorageKeys.THEME_STATUS);
    if (theme) {
        if (theme === "true") {
            root.$vuetify.theme.dark = true;
        } else {
            root.$vuetify.theme.dark = false;
        }
    } else if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        root.$vuetify.theme.dark = true;
        saveToStorage(
            "",
            StorageKeys.THEME_STATUS,
            root.$vuetify.theme.dark.toString()
        );
    }
}

export function toggleThemeState(root: ComponentInstance): void {
    root.$vuetify.theme.dark = !root.$vuetify.theme.dark;
    saveToStorage(
        "",
        StorageKeys.THEME_STATUS,
        root.$vuetify.theme.dark.toString()
    );
}
