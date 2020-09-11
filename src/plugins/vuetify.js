import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: "#2c3e50",
                "primary--text": "#2c3e50"
            },
            dark: {
                primary: "#346a9c",
                "primary--text": "#346a9c"
            }
        }
    }
});
