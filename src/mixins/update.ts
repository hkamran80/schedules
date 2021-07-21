import Vue from "vue";

// Based on: https://dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip
export default Vue.extend({
    data() {
        return {
            refreshing: false,
            registrationWaiting: null as ServiceWorker | null,
            updateExists: false,
        };
    },

    created() {
        document.addEventListener("swUpdated", this.updateAvailable, {
            once: true,
        });

        navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (this.refreshing) return;
            this.refreshing = true;
            window.location.reload();
        });
    },

    methods: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateAvailable(event: any): void {
            this.registrationWaiting = event.detail.waiting;
            this.updateExists = true;
        },
        refreshApp(): void {
            this.updateExists = false;

            if (this.registrationWaiting === null) return;
            this.registrationWaiting.postMessage({ type: "SKIP_WAITING" });
        },
    },
});
