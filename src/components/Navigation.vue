<template>
    <div class="navigation">
        <v-row no-gutters>
            <v-col align-self="center" justify="center">
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
            </v-col>
            <v-col class="text-align--right" align-self="center" cols="3">
                <span>{{ current_date }}</span> - 
                <span>{{ current_time }}</span>
            </v-col>
        </v-row>
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
            this.current_time =
                this.pad_number(d.getHours().toString()) +
                ":" +
                this.pad_number(d.getMinutes().toString()) +
                ":" +
                this.pad_number(d.getSeconds().toString());
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
        this.datetime_interval = setInterval(
            this.update_datetime_strings,
            1000
        );
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
    },
    destroyed() {
        clearInterval(this.datetime_interval);
        this.datetime_interval = 0;
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

.text-align--right {
    text-align: right;
}
</style>
