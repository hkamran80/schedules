import { onMounted, ref } from "@vue/composition-api";
import { Nullable } from "@/models/types";

export function loadUpdateMechanism() {
    const refreshing = ref(false),
        serviceWorker = ref(null as Nullable<ServiceWorker>),
        updateExists = ref(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateAvailable = ({ detail }: any): void => {
        serviceWorker.value = detail.waiting;
        updateExists.value = true;
    };

    const refreshApp = (): void => {
        updateExists.value = false;

        if (serviceWorker.value !== null) {
            serviceWorker.value.postMessage({ type: "SKIP_WAITING" });
        }
    };

    onMounted(() => {
        document.addEventListener("swUpdated", updateAvailable, {
            once: true,
        });

        navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (!refreshing.value) {
                refreshing.value = true;
                window.location.reload();
            }
        });
    });

    return { updateExists, refreshApp };
}
