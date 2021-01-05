<template>
    <v-app id="app">
        <v-main>
            <v-container fluid>
                <navigation-bar :schedules="schedules" />
                <router-view :schedules="schedules" />
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import NavigationBar from "@/components/NavigationBar.vue";
import schedules from "@/schedules.json";

export default {
    name: "App",
    data: () => ({
        debug: false,
        schedules: schedules
    }),
    components: {
        NavigationBar
    },
    methods: {
        toggle_dark_mode: function() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            localStorage.setItem(
                "dark_theme",
                this.$vuetify.theme.dark.toString()
            );
        },
        tmp: function() {
            console.log(JSON.stringify(this.schedules));
        }
    },
    created() {
        // Preferences
        const theme = localStorage.getItem("dark_theme");
        if (theme) {
            // deepcode ignore UseStrictEquality: Loaded as a String, not a Boolean
            if (theme == "true") {
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
                "dark_theme",
                this.$vuetify.theme.dark.toString()
            );
        }

        const _allow_one_hour = localStorage.getItem("allow_one_hour");
        if (_allow_one_hour) {
            if (_allow_one_hour == "true") {
                this.$allow_one_hour_notification = true;
            } else {
                this.$allow_one_hour_notification = false;
            }
        } else {
            localStorage.setItem("allow_one_hour", "true");
        }

        const _allow_thirty_minute = localStorage.getItem(
            "allow_thirty_minute"
        );
        if (_allow_thirty_minute) {
            if (_allow_thirty_minute == "true") {
                this.$allow_thirty_minute_notification = true;
            } else {
                this.$allow_thirty_minute_notification = false;
            }
        } else {
            localStorage.setItem("allow_thirty_minutes", "true");
        }

        const _allow_fifteen_minute = localStorage.getItem(
            "allow_fifteen_minute"
        );
        if (_allow_fifteen_minute) {
            if (_allow_fifteen_minute == "true") {
                this.$allow_fifteen_minute_notification = true;
            } else {
                this.$allow_fifteen_minute_notification = false;
            }
        } else {
            localStorage.setItem("allow_fifteen_minutes", "true");
        }

        const _allow_ten_minute = localStorage.getItem("allow_ten_minute");
        if (_allow_ten_minute) {
            if (_allow_ten_minute == "true") {
                this.$allow_ten_minute_notification = true;
            } else {
                this.$allow_ten_minute_notification = false;
            }
        } else {
            localStorage.setItem("allow_ten_minutes", "true");
        }

        const _allow_five_minute = localStorage.getItem("allow_five_minute");
        if (_allow_five_minute) {
            if (_allow_five_minute == "true") {
                this.$allow_five_minute_notification = true;
            } else {
                this.$allow_five_minute_notification = false;
            }
        } else {
            localStorage.setItem("allow_five_minutes", "true");
        }

        const _allow_one_minute = localStorage.getItem("allow_one_minute");
        if (_allow_one_minute) {
            if (_allow_one_minute == "true") {
                this.$allow_one_minute_notification = true;
            } else {
                this.$allow_one_minute_notification = false;
            }
        } else {
            localStorage.setItem("allow_one_minute", "true");
        }

        const _allow_thirty_seconds = localStorage.getItem(
            "allow_thirty_seconds"
        );
        if (_allow_thirty_seconds) {
            if (_allow_thirty_seconds == "true") {
                this.$allow_thirty_second_notification = true;
            } else {
                this.$allow_thirty_second_notification = false;
            }
        } else {
            localStorage.setItem("_allow_thirty_seconds", "true");
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
