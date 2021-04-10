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
// import { Integrations } from "@sentry/tracing";

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
// if (!Vue.prototype.$developmentMode) {
//     Sentry.init({
//         Vue,
//         dsn: process.env.VUE_APP_SENTRY_DSN,
//         integrations: [new Integrations.BrowserTracing()],
//         environment: process.env.VUE_APP_SENTRY_ENVIRONMENT,

//         // Set tracesSampleRate to 1.0 to capture 100%
//         // of transactions for performance monitoring.
//         // We recommend adjusting this value in production
//         tracesSampleRate: 1.0
//     });
// }

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount("#app");
