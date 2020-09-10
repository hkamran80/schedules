import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueNativeNotification from "vue-native-notification";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
//import Toasted from "vue-toasted";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;

Vue.use(VueNativeNotification, {
    requestOnNotify: true
});
Vue.use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 5,
    newestOnTop: true
});
/*Vue.use(Toasted, {
    position: "bottom-right",
    duration: 5000,
    theme: "outline",
    iconPack: "mdi"
});*/

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount("#app");
