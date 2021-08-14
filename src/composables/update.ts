import { onMounted, ref } from "@vue/composition-api";
import { Nullable } from "@/structures/types";

export function loadUpdateMechanism() {
    const refreshing = ref(false),
        serviceWorker = ref(null as Nullable<ServiceWorker>),
        updateExists = ref(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateAvailable = ({ detail }: any): void => {
        serviceWorker.value = detail.waiting;
        updateExists.value = true;
        console.debug("[SW] Update available");
    };

    const refreshApp = (): void => {
        updateExists.value = false;

        if (serviceWorker.value !== null) {
            console.debug("[SW] Skipped waiitng");
            serviceWorker.value.postMessage({ type: "SKIP_WAITING" });
        }
    };

    onMounted(() => {
        console.debug("Service worker update monitoring now active");

        document.addEventListener("swUpdated", updateAvailable, {
            once: true,
        });

        navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (!refreshing.value) {
                console.debug("[SW] Refreshing...");
                refreshing.value = true;
                window.location.reload();
                console.debug("[SW] Refreshed");
            }
        });
    });

    return { updateExists, refreshApp };
}
