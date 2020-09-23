<template>
    <div class="navigation">
        <v-row no-gutters>
            <v-col align-self="center" justify="center">
                <h1 color="primary">
                    <router-link
                        id="schedules-home-link"
                        to="/"
                        color="primary"
                    >
                        Schedules
                    </router-link>
                </h1>
                <div id="nav_links">
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
            </v-col>
            <v-col
                class="text-align--right"
                align-self="center"
                justify="center"
                cols="4"
            >
                <span>{{ current_date }}</span> -
                <span>{{ current_time }}</span>

                <v-btn
                    icon
                    id="settings_icon"
                    @click.stop="settings = true"
                    aria-label="Settings"
                    title="Settings"
                >
                    <v-icon>
                        mdi-settings-outline
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>

        <v-dialog v-model="settings" scrollable max-width="500">
            <v-card>
                <v-card-title class="headline">
                    Preferences
                </v-card-title>

                <v-card-text>
                    <v-subheader>General</v-subheader>
                    <v-switch
                        v-model="toggle_theme"
                        label="Dark Theme"
                        inset
                    ></v-switch>
                    <!--<v-switch
                        v-model="toggle_tfht"
                        :label="
                            `Twenty-four Hour Time (${this.$twenty_four_hour_time})`
                        "
                        inset
                    ></v-switch>-->
                    <v-switch
                        v-model="toggle_tfht"
                        label="Twenty-four Hour Time"
                        inset
                    ></v-switch>

                    <v-divider />

                    <v-subheader>Notifications</v-subheader>
                    <v-switch
                        v-model="toggle_ohn"
                        label="One Hour Notifications"
                        inset
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
                    ></v-switch>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: "Navigation",
    props: {
        schedules: Object
    },
    data: function() {
        return {
            settings: false,
            toggle_theme: this.$vuetify.theme.dark,
            toggle_tfht: !this.$twenty_four_hour_time,
            toggle_ohn: this.$allow_one_hour_notification,
            toggle_thmn: this.$allow_thirty_minute_notification,
            toggle_fimn: this.$allow_fifteen_minute_notification,
            toggle_tmn: this.$allow_ten_minute_notification,
            toggle_fmn: this.$allow_five_minute_notification,
            toggle_omn: this.$allow_one_minute_notification,
            toggle_thsn: this.$allow_thirty_second_notification,
            current_date: "",
            current_time: "",
            datetime_interval: ""
        };
    },
    methods: {
        toggle_dark_mode: function() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            localStorage.setItem(
                "dark_theme",
                this.$vuetify.theme.dark.toString()
            );
            if (this.$vuetify.theme.dark) {
                for (let a of document.getElementsByTagName("a")) {
                    a.style.setProperty("--inactive-link-color", "#3179bc");
                }
            } else {
                for (let a of document.getElementsByTagName("a")) {
                    a.style.setProperty("--inactive-link-color", "#2c3e50");
                }
            }
        },
        toggle_twenty_four_hour_time: function() {
            this.$twenty_four_hour_time = !this.$twenty_four_hour_time;
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
        },
        toggle_thirty_minute: function() {
            this.$allow_thirty_minute_notification = !this
                .$allow_thirty_minute_notification;
            localStorage.setItem(
                "allow_thirty_minute",
                this.$allow_thirty_minute_notification.toString()
            );
        },
        toggle_fifteen_minute: function() {
            this.$allow_fifteen_minute_notification = !this
                .$allow_fifteen_minute_notification;
            localStorage.setItem(
                "allow_fifteen_minute",
                this.$allow_fifteen_minute_notification.toString()
            );
        },
        toggle_ten_minute: function() {
            this.$allow_ten_minute_notification = !this
                .$allow_ten_minute_notification;
            localStorage.setItem(
                "allow_ten_minute",
                this.$allow_ten_minute_notification.toString()
            );
        },
        toggle_five_minute: function() {
            this.$allow_five_minute_notification = !this
                .$allow_five_minute_notification;
            localStorage.setItem(
                "allow_five_minute",
                this.$allow_five_minute_notification.toString()
            );
        },
        toggle_one_minute: function() {
            this.$allow_one_minute_notification = !this
                .$allow_one_minute_notification;
            localStorage.setItem(
                "allow_one_minute",
                this.$allow_one_minute_notification.toString()
            );
        },
        toggle_thirty_second: function() {
            this.$allow_thirty_second_notification = !this
                .$allow_thirty_second_notification;
            localStorage.setItem(
                "allow_thirty_second",
                this.$allow_thirty_second_notification.toString()
            );
        },
        update_datetime_strings: function() {
            const d = new Date();
            this.current_date =
                d.toLocaleDateString("en-us", { weekday: "long" }) +
                ", " +
                d.toLocaleDateString("en-us", { month: "long" }) +
                " " +
                d.getDate() +
                ", " +
                d.getFullYear();

            if (this.$twenty_four_hour_time) {
                this.current_time =
                    this.pad_number(d.getHours().toString()) +
                    ":" +
                    this.pad_number(d.getMinutes().toString()) +
                    ":" +
                    this.pad_number(d.getSeconds().toString());
            } else {
                this.current_time = d.toLocaleString("en-us", {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true
                });
            }
        },
        pad_number: function(number) {
            var padded;
            if (Number(number) < 10) {
                padded = "0" + Number(number).toString();
            } else {
                padded = Number(number).toString();
            }

            return padded;
        }
    },
    created() {
        // Twenty-four Hour Time
        const _twenty_four_hour_time = localStorage.getItem(
            "twenty_four_hour_time"
        );
        if (_twenty_four_hour_time) {
            if (_twenty_four_hour_time == "true") {
                this.$twenty_four_hour_time = true;
            } else {
                this.$twenty_four_hour_time = false;
            }
        } else {
            localStorage.setItem("twenty_four_hour_time", "false");
        }

        // Interval Initalization
        this.datetime_interval = setInterval(
            this.update_datetime_strings,
            1000
        );
    },
    mounted() {
        // Dark Theme
        const theme = localStorage.getItem("dark_theme");
        if (theme) {
            // deepcode ignore UseStrictEquality: Loaded as a String, not a Boolean
            if (theme == "true") {
                this.$vuetify.theme.dark = true;
                for (let a of document.getElementsByTagName("a")) {
                    a.style.setProperty("--inactive-link-color", "#3179bc");
                }
            } else {
                this.$vuetify.theme.dark = false;
                for (let a of document.getElementsByTagName("a")) {
                    a.style.setProperty("--inactive-link-color", "#2c3e50");
                }
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
            for (let a of document.getElementsByTagName("a")) {
                a.style.setProperty("--inactive-link-color", "#3179bc");
            }
        } else {
            for (let a of document.getElementsByTagName("a")) {
                a.style.setProperty("--inactive-link-color", "#2c3e50");
            }
        }
    },
    watch: {
        toggle_theme: function() {
            this.toggle_dark_mode();
        },
        toggle_tfht: function() {
            this.toggle_twenty_four_hour_time();
        },
        toggle_ohn: function() {
            this.toggle_one_hour();
        },
        toggle_thmn: function() {
            this.toggle_thirty_minute();
        },
        toggle_fimn: function() {
            this.toggle_fifteen_minute();
        },
        toggle_tmn: function() {
            this.toggle_ten_minute();
        },
        toggle_fmn: function() {
            this.toggle_five_minute();
        },
        toggle_omn: function() {
            this.toggle_one_minute();
        },
        toggle_thsn: function() {
            this.toggle_thirty_second();
        }
    },
    destroyed() {
        clearInterval(this.datetime_interval);
        this.datetime_interval = 0;
    }
};
</script>

<style scoped>
a {
    --inactive-link-color: #2c3e50;
}

.navigation {
    padding: 30px 0;
}

.navigation a {
    font-weight: bold;
    color: var(--inactive-link-color);
}

.navigation a#schedules-home-link {
    text-decoration: none;
}

.navigation a.router-link-exact-active {
    color: #42b983;
}

.text-align--right {
    text-align: right;
}
.navigation button#settings_icon {
    margin-left: 15px;
}
</style>
