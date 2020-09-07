<template>
    <div class="navigation">
        <h1>
            Schedules
        </h1>
        <div id="nav_links">
            <router-link to="/">Home</router-link> |
            <span>
                <router-link to="/schedule/ca-auhsd-hss">
                    Acalanes High School
                </router-link>
                |
            </span>
            <span>
                <router-link to="/schedule/ca-auhsd-dls">
                    AUHSD Distance Learning Schedule
                </router-link>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: "Navigation",
    props: {
        schedules: Object
    },
    methods: {
        toggle_dark_mode: function() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            localStorage.setItem(
                "dark_theme",
                this.$vuetify.theme.dark.toString()
            );
        }
    },
    mounted() {
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
    }
};
</script>

<style scoped>
.navigation {
    padding: 30px 0;
}

.navigation a {
    font-weight: bold;
    color: #2c3e50;
}

.navigation a.router-link-exact-active {
    color: #42b983;
}
</style>
