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
            <v-col align-self="center" cols="2" class="text-right">
                <v-btn
                    href="https://form.typeform.com/to/g0MlHGXj"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon
                    class="navigation-item"
                    title="Open Feedback Form"
                    aria-label="Open Feedback Form"
                    color="primary"
                >
                    <v-icon v-text="mdiCommentMultipleOutline" />
                </v-btn>
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
import { mdiThemeLightDark, mdiCommentMultipleOutline } from "@mdi/js";

export default {
    name: "NavigationBar",
    data: function() {
        return {
            mdiThemeLightDark: mdiThemeLightDark,
            mdiCommentMultipleOutline: mdiCommentMultipleOutline
        };
    },
    mounted() {
        // Set theme
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

#navigation .navigation-item {
    margin-right: 8px;
}
</style>
