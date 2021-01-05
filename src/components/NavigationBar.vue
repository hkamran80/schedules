<template>
    <div>
        <v-row id="navigation" no-gutters>
            <v-col align-self="center" justify="center" md="8" cols="12">
                <router-link to="/">
                    <h1 color="primary">Schedules</h1>
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
                    title="Open Preferences"
                    aria-label="Open Preferences"
                    @click="settings = true"
                >
                    <v-icon color="primary">
                        mdi-cog-outline
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>

        <v-dialog v-model="settings" scrollable max-width="500">
            <v-card>
                <v-card-title class="headline">
                    <v-row no-gutters>
                        <v-col> Preferences </v-col>
                        <v-col cols="2" class="text-right">
                            <v-btn icon @click="settings = false">
                                <v-icon color="primary">mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>

                <v-card-text>
                    <v-switch
                        label="Dark Theme"
                        v-model="$vuetify.theme.dark"
                        readonly
                        inset
                        @click="toggle_theme"
                    />
                    <!-- TODO: Fix 24-hour time switch -->
                    <!--<v-switch
                        label="24-Hour Time"
                        v-model="$twenty_four_hour_time"
                        readonly
                        inset
                        @click="toggle_twenty_four_hour_time"
                    />

                    <v-divider />

                    <v-subheader>Notifications</v-subheader>
                    <v-switch
                        label="One Hour Notifications"
                        v-model="$allow_one_hour_notification"
                        readonly
                        inset
                        @click="toggle_one_hour"
                    ></v-switch>
                    <v-switch
                        v-model="toggle_thmn"
                        label="Thirty Minute Notifications"
                        inset
                    ></v-switch>
                    <v-switch
                        v-model="toggle_fimn"
                        label="Fifteen Minute Notifications"
                        inset
                    ></v-switch>
                    <v-switch
                        v-model="toggle_tmn"
                        label="Ten Minute Notifications"
                        inset
                    ></v-switch>
                    <v-switch
                        v-model="toggle_fmn"
                        label="Five Minute Notifications"
                        inset
                    ></v-switch>
                    <v-switch
                        v-model="toggle_omn"
                        label="One Minute Notifications"
                        inset
                    ></v-switch>
                    <v-switch
                        v-model="toggle_thsn"
                        label="Thirty Second Notifications"
                        inset
                    ></v-switch>-->
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: "NavigationBar",
    props: {
        schedules: Object
    },
    data: function() {
        return {
            settings: false
        };
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
        },
        toggle_twenty_four_hour_time: function() {
            this.$twenty_four_hour_time = !this.$twenty_four_hour_time;
            console.log(this.$twenty_four_hour_time);
            localStorage.setItem(
                "twenty_four_hour_time",
                this.$twenty_four_hour_time.toString()
            );
        },
        toggle_one_hour: function() {
            this.$allow_one_hour_notification = !this
                .$allow_one_hour_notification;
            localStorage.setItem(
                "allow_one_hour",
                this.$allow_one_hour_notification.toString()
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
