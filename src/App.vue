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
        if (this.$edge_mode) {
            this.base_document_title = "Schedules (edge)";
        } else if (this.$dev_mode) {
            this.base_document_title = "Schedules (dev)";
        }

        // TODO: Add user option for enabling/disabling Umami
        if (!this.$dev_mode) {
            let umami_script = document.createElement("script"),
                script_tag = document.getElementsByTagName("script")[0];

            umami_script.async = true;
            umami_script.defer = true;
            umami_script.src = "https://umami-sepia.vercel.app/umami.js";
            umami_script.setAttribute(
                "data-website-id",
                this.$edge_mode
                    ? "377298e5-bec6-48f0-a2f1-7070f42f12ca"
                    : "ab9840ad-16a1-4b04-b87f-e5e396f466b4"
            );

            script_tag.parentNode.insertBefore(umami_script, script_tag);

            console.log("Activated Umami anonymous analytics");
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
