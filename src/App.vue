<template>
    <v-app id="app">
        <v-main>
            <v-container fluid>
                <navigation-bar :schedules="schedules" />
                <router-view :schedules="schedules" />

                <v-snackbar bottom right :value="updateExists" :timeout="-1">
                    An update is available for Schedules!

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
import update from "./mixins/update";
import schedules from "@/schedules.json";

export default {
    name: "App",
    data: () => ({
        debug: false,
        schedules: schedules,
        base_document_title: "Schedules"
    }),
    components: {
        NavigationBar
    },
    mixins: [update],
    created() {
        if (this.$beta_mode) {
            this.base_document_title = "Schedules (beta)";
        } else if (this.$dev_mode) {
            this.base_document_title = "Schedules (dev)";
        }
    },
    watch: {
        $route(to) {
            if (to.name === "Home") {
                document.title = this.base_document_title;
            } else if (
                to.name === "Schedule" &&
                typeof this.schedules[to.params.id] !== "undefined"
            ) {
                document.title = `${this.base_document_title} | ${
                    this.schedules[to.params.id].name
                }`;
            } else if (to.name === "NotFound") {
                document.title = `${this.base_document_title} | Page Not Found`;
            } else {
                document.title = this.base_document_title;
            }
        }
    }
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    padding: 15px 45px;
}

a {
    text-decoration: none;
}
</style>
