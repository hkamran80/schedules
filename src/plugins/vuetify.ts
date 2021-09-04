import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: "mdiSvg",
    },
    theme: {
        themes: {
            light: {
                primary: "#C2185B",
            },
            dark: {
                primary: "#F06292",
            },
        },
        options: { customProperties: true },
    },
});
