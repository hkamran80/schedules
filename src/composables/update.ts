import { ref } from "@vue/composition-api";
import { Nullable } from "@/structures/types";

export function loadUpdateMechanism() {
    const refreshing = ref(false),
        serviceWorker = ref(null as Nullable<ServiceWorker>),
        updateExists = ref(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateAvailable = (event: any): void => {
        serviceWorker.value = event.detail.waiting;
        updateExists.value = true;
    };

    const refreshApp = (): void => {
        updateExists.value = false;

        if (serviceWorker.value === null) return;
        serviceWorker.value.postMessage({ type: "SKIP_WAITING" });
    };

    document.addEventListener("swUpdated", updateAvailable, {
        once: true,
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing.value) return;

        refreshing.value = true;
        window.location.reload();
    });

    return { updateExists, refreshApp };
}
