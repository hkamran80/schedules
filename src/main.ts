import Vue from "vue";
import App from "@/App.vue";
import "@/registerServiceWorker";
import router from "@/router";
import vuetify from "@/plugins/vuetify";
import VueCompositionAPI from "@vue/composition-api";
import { version as pkgVersion } from "../package.json";

// Sentry Tracking
import { init as sentryInit } from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing/dist/browser";

Vue.config.productionTip = false;

// Vue Global Variables
Vue.prototype.$developmentMode = process.env.NODE_ENV === "development";
Vue.prototype.$edgeMode = process.env.VUE_APP_EDGE_MODE === "true";

Vue.use(VueCompositionAPI);

// Accessibility Testing
if (Vue.prototype.$developmentMode) {
    const VueAxe = require("vue-axe").default;
    Vue.use(VueAxe, {
        allowConsoleClears: false,
    });
}

// Sentry.io Tracking
if (!Vue.prototype.$developmentMode) {
    sentryInit({
        Vue,
        dsn: process.env.VUE_APP_SENTRY_DSN,
        integrations: [new BrowserTracing()],
        release: `schedules@${pkgVersion}`,
        environment: process.env.VUE_APP_SENTRY_ENVIRONMENT,
        tracesSampleRate: 0.75,
        tracingOptions: {
            trackComponents: true,
        },
    });
}

new Vue({
    router,
    vuetify,
    render: (h) => h(App),
}).$mount("#app");
