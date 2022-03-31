import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import PiniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "./index.css";

createApp(App)
    .use(createPinia().use(PiniaPluginPersistedstate))
    .use(router)
    .mount("#app");
