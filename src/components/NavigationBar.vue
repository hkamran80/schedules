<template>
    <div>
        <v-row id="navigation" no-gutters>
            <v-col align-self="center" justify="center">
                <router-link to="/" title="Home" aria-label="Home">
                    <h1 color="primary">
                        Schedules <span v-if="$edgeMode">(edge)</span>
                        <span v-if="$developmentMode">(dev)</span>
                    </h1>
                </router-link>
            </v-col>
            <v-col align-self="center" cols="1" class="text-right">
                <v-btn
                    icon
                    class="navigation-item"
                    title="Toggle Theme"
                    aria-label="Toggle Theme"
                    color="primary"
                    @click="toggleTheme"
                >
                    <v-icon v-text="mdiThemeLightDark" />
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mdiThemeLightDark } from "@mdi/js";

export default {
    name: "NavigationBar",
    data: function() {
        return {
            mdiThemeLightDark: mdiThemeLightDark
        };
    },
    mounted() {
        const theme = localStorage.getItem("darkTheme");
        if (theme) {
            if (theme === "true") {
                this.$vuetify.theme.dark = true;
            } else {
                this.$vuetify.theme.dark = false;
            }
        } else if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            this.$vuetify.theme.dark = true;
            localStorage.setItem(
                "darkTheme",
                this.$vuetify.theme.dark.toString()
            );
        }
    },
    methods: {
        toggleTheme: function() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            localStorage.setItem(
                "darkTheme",
                this.$vuetify.theme.dark.toString()
            );
        }
    }
};
</script>

<style scoped>
#navigation {
    padding: 30px 0;
}

#navigation a {
    font-weight: bold;
}

#navigation a.router-link-exact-active {
    color: #e91e63;
}
</style>
