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
Vue.prototype.$beta_mode = process.env.VUE_APP_BETA_MODE === "true";

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
