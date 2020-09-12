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

Vue.prototype.$twenty_four_hour_time = false;
Vue.prototype.$allow_one_hour_notification = true;
Vue.prototype.$allow_thirty_minute_notification = true;
Vue.prototype.$allow_fifteen_minute_notification = true;
Vue.prototype.$allow_ten_minute_notification = true;
Vue.prototype.$allow_five_minute_notification = true;
Vue.prototype.$allow_one_minute_notification = true;
Vue.prototype.$allow_thirty_second_notification = true;

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
