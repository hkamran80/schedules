import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueNativeNotification from "vue-native-notification";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Sentry Tracking
// import * as Sentry from "@sentry/vue";
import { init } from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing/dist/browser";
const packageJson = require("../package.json");

Vue.config.productionTip = false;

// Vue Global Variables
Vue.prototype.$developmentMode = process.env.NODE_ENV === "development";
Vue.prototype.$edgeMode = process.env.VUE_APP_EDGE_MODE === "true";
Vue.prototype.$appVersion = require("../package.json").version;

Vue.use(VueNativeNotification, {
    requestOnNotify: true
});
Vue.use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 5,
    newestOnTop: true
});

// Sentry.io Tracking
if (!Vue.prototype.$developmentMode) {
    init({
        Vue,
        dsn: process.env.VUE_APP_SENTRY_DSN,
        integrations: [new BrowserTracing()],
        release: `schedules@${packageJson.version}`,
        environment: process.env.VUE_APP_SENTRY_ENVIRONMENT,

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 0.25,
        tracingOptions: {
            trackComponents: true
        }
    });
}

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount("#app");
