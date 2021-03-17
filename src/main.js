import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueNativeNotification from "vue-native-notification";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

Vue.config.productionTip = false;

Vue.prototype.$dev_mode = process.env.NODE_ENV === "development";
Vue.prototype.$edge_mode = process.env.VUE_APP_EDGE_MODE === "true";
Vue.prototype.$app_version = require("../package.json").version;

Vue.use(VueNativeNotification, {
    requestOnNotify: true
});
Vue.use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 5,
    newestOnTop: true
});

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount("#app");
