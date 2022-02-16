import { ComponentInstance, ref } from "@vue/composition-api";
import { loadFromStorage, saveToStorage } from "@/constructs/storage";
import { StorageKeys } from "@/models/storage";

function checkUmamiInstalled(): boolean {
    return document.getElementById("umami-script") ? true : false;
}

function checkAllowedStatus(): boolean {
    if (loadFromStorage("", StorageKeys.ANALYTICS_STATUS)) {
        if (loadFromStorage("", StorageKeys.ANALYTICS_STATUS) === "true") {
            return true;
        } else {
            return false;
        }
    } else {
        saveToStorage("", StorageKeys.ANALYTICS_STATUS, "true");
        return true;
    }
}

export function installUmami(root: ComponentInstance): void {
    if (!root.$developmentMode && !checkUmamiInstalled()) {
        const umamiScript = document.createElement("script"),
            scriptTag = document.getElementsByTagName("script")[0];

        umamiScript.async = true;
        umamiScript.defer = true;
        umamiScript.src = "https://umami.unisontech.org/umami.js";
        umamiScript.id = "umami-script";
        umamiScript.setAttribute(
            "data-website-id",
            root.$edgeMode
                ? "377298e5-bec6-48f0-a2f1-7070f42f12ca"
                : "ab9840ad-16a1-4b04-b87f-e5e396f466b4"
        );

        if (scriptTag.parentNode) {
            scriptTag.parentNode.insertBefore(umamiScript, scriptTag);

            console.log("Anonymous analytics activated");
        } else {
            console.error(
                "An unknown error occurred when attempting to activate Umami"
            );
        }
    }
}

export function uninstallUmami(root: ComponentInstance): void {
    if (!root.$developmentMode && checkUmamiInstalled()) {
        const umamiScript = document.getElementById("umami-script");

        if (umamiScript) {
            umamiScript.remove();
            saveToStorage("", StorageKeys.ANALYTICS_STATUS, "false");

            console.log("Anonymous analytics deactivated");
        } else {
            console.error(
                "An unknown error occurred when attempting to deactivate Umami"
            );
        }
    }
}

export function umamiInstallStatus() {
    const allowed = ref(checkAllowedStatus());

    const setStatus = ({ root }: { root: ComponentInstance }) => {
        if (loadFromStorage("", StorageKeys.ANALYTICS_STATUS) === null) {
            saveToStorage("", StorageKeys.ANALYTICS_STATUS, "true");
            allowed.value = true;
            installUmami(root);
        } else {
            const inverseStorageState =
                loadFromStorage("", StorageKeys.ANALYTICS_STATUS) === "true"
                    ? false
                    : true;

            allowed.value = inverseStorageState;
            saveToStorage(
                "",
                StorageKeys.ANALYTICS_STATUS,
                inverseStorageState.toString()
            );
        }
    };

    return { allowed, setStatus };
}
