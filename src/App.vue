<template>
    <v-app id="app">
        <v-main>
            <v-container fluid>
                <navigation-bar />
                <router-view :schedules="schedules" />

                <v-snackbar bottom right :value="updateExists" :timeout="-1">
                    An update is available for Schedules! Check out what's new
                    on the homepage!

                    <template v-slot:action="{ attrs }">
                        <v-btn
                            text
                            color="primary"
                            @click="refreshApp"
                            v-bind="attrs"
                        >
                            Update
                        </v-btn>
                    </template>
                </v-snackbar>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import NavigationBar from "@/components/NavigationBar.vue";
import update from "@/mixins/update";
import umami from "@/mixins/umami";
import schedules from "@/schedules.json";

export default {
    name: "App",
    data: () => ({
        schedules: schedules,
        baseDocumentTitle: "Schedules"
    }),
    components: {
        NavigationBar
    },
    mixins: [update, umami],
    created() {
        // Document title
        if (this.$edgeMode) {
            this.baseDocumentTitle = "Schedules (edge)";
        } else if (this.$developmentMode) {
            this.baseDocumentTitle = "Schedules (dev)";
        }
    },
    watch: {
        $route(to) {
            if (to.name === "Home") {
                document.title = this.baseDocumentTitle;
            } else if (
                to.name === "Schedule" &&
                typeof this.schedules[to.params.id] !== "undefined"
            ) {
                document.title = `${this.baseDocumentTitle} | ${
                    this.schedules[to.params.id].name
                }`;
            } else if (to.name === "NotFound") {
                document.title = `${this.baseDocumentTitle} | Page Not Found`;
            } else {
                document.title = this.baseDocumentTitle;
            }
        }
    }
};
</script>

<style>
#app {
    font-family: Lato, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    padding: 15px 45px;
}

a {
    text-decoration: none;
}

/* Global Classes */
.text-wrap--break {
    word-break: break-word;
    word-wrap: break-word;
}
</style>
