<template>
    <div>
        <v-row id="navigation" no-gutters>
            <v-col align-self="center" justify="center" md="8" cols="12">
                <router-link to="/">
                    <h1 color="primary">
                        Schedules <span v-if="$beta_mode">(beta)</span>
                        <span v-if="$dev_mode">(dev)</span>
                    </h1>
                </router-link>
            </v-col>
            <v-col
                align-self="center"
                justify="center"
                md="4"
                cols="12"
                :class="{ 'text-right': !$vuetify.breakpoint.mobile }"
            >
                <router-link
                    v-for="(schedule, id) in schedules"
                    :key="id"
                    :to="`/schedule/${id}`"
                    :title="schedule.name"
                    :aria-label="schedule.name"
                    class="navigation-item"
                    v-text="schedule.name"
                />

                <v-btn
                    icon
                    class="navigation-item"
                    title="Toggle Theme"
                    aria-label="Toggle Theme"
                    @click="toggle_theme"
                >
                    <v-icon color="primary">
                        mdi-theme-light-dark
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: "NavigationBar",
    props: {
        schedules: Object
    },
    mounted() {
        const theme = localStorage.getItem("dark_theme");
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
                "dark_theme",
                this.$vuetify.theme.dark.toString()
            );
        }
    },
    methods: {
        toggle_theme: function() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            localStorage.setItem(
                "dark_theme",
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

#navigation a.navigation-item {
    padding: 0 12px;
}
#navigation a.navigation-item:nth-of-type(1) {
    padding-left: 0;
}

#navigation a.router-link-exact-active {
    color: #e91e63;
}

#navigation button.v-btn {
    margin: 0 10px;
}
</style>
