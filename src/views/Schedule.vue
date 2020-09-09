<template>
    <div class="schedule">
        <h3>{{ this.schedules[this.$route.params.id].name }}</h3>
        <v-card class="mx-auto" max-width="500" outlined v-if="developer_mode">
            <v-card-text>
                {{ current_day }} - {{ current_split_time }} ||
                {{ current_period }} || {{ current_period_raw }}
            </v-card-text>
        </v-card>
        <v-card class="mx-auto" max-width="500" outlined>
            <v-card-title>
                <span
                    class="title font-weight-regular"
                    v-if="
                        current_period != 'No Period' &&
                            current_period != 'No Periods Today'
                    "
                >
                    {{ current_period }} - {{ time_remaining }}
                </span>
                <span class="title font-weight-regular" v-else>
                    No Period
                </span>
            </v-card-title>
        </v-card>
        <v-card
            class="mx-auto"
            max-width="500"
            outlined
            v-if="
                next_period != 'No Period' && next_period != 'No Periods Today'
            "
        >
            <v-card-title>
                <span class="title font-weight-regular">
                    {{ next_period }} - {{ next_period_starting }}
                </span>
            </v-card-title>
        </v-card>
    </div>
</template>

<style scoped>
div.v-card {
    padding: 0 5px;
    margin: 10px 0;
    text-align: center;
}
</style>

<script>
export default {
    name: "Schedule",
    props: {
        schedules: Object
    },
    data: function() {
        return {
            // Current and Next Period Information
            current_period: "",
            time_remaining: "",
            next_period: "",
            next_period_starting: "",

            // Previous Period Information
            previous_period: "",
            period_different: false,

            // Raw Period Information
            current_period_raw: "",
            next_period_raw: "",

            // Date and Time
            current_day: "",
            current_time: "",
            current_split_time: "",

            // Notifications
            one_hour_notification: false,
            thirty_minute_notification: false,
            fifteen_minute_notification: false,
            ten_minute_notification: false,
            five_minute_notification: false,
            one_minute_notification: false,
            thirty_second_notification: false,

            // Preferences
            allow_one_hour_notification: true,
            allow_thirty_minute_notification: true,
            allow_fifteen_minute_notification: true,
            allow_ten_minute_notification: true,
            allow_five_minute_notification: true,
            allow_one_minute_notification: true,
            allow_thirty_second_notification: true,
            twenty_four_hour_time: false,

            main_interval: "",
            developer_mode: this.$route.query.dev == "true"
        };
    },
    created() {
        this.main_interval = setInterval(this.main, 1000);
    },
    mounted() {
        this.$notification
            .requestPermission()
            .then(this.notification_permissions_callback, console.error)
            .catch(console.error);

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
        clearInterval(this.main_interval);
        this.main_interval = 0;
    },
    methods: {
        main: function() {
            this.update_times();
            this.get_current_period();

            this.current_period = this.current_period_raw[0];

            if (this.current_period != this.previous_period) {
                this.period_different = true;
            } else {
                this.period_different = false;
            }
            this.previous_period = this.current_period;

            this.update_next_period();

            let compiled_time_difference;
            var time_difference;
            if (this.current_period_raw[1] != "") {
                let scheduled_end = this.current_period_raw[1][1].toString();

                time_difference = this.calculate_time(
                    this.current_split_time,
                    scheduled_end
                );

                if (time_difference[0] == 0) {
                    if (time_difference[1] == 0) {
                        compiled_time_difference =
                            "00:00:" + this.pad_number(time_difference[2]);
                    } else {
                        if (time_difference[2] == 0) {
                            compiled_time_difference =
                                "00:" +
                                this.pad_number(time_difference[1]) +
                                ":00";
                        } else {
                            compiled_time_difference =
                                "00:" +
                                this.pad_number(time_difference[1]) +
                                ":" +
                                this.pad_number(time_difference[2]);
                        }
                    }
                } else {
                    compiled_time_difference =
                        this.pad_number(time_difference[0]) +
                        ":" +
                        this.pad_number(time_difference[1]) +
                        ":" +
                        this.pad_number(time_difference[2]);
                }
            } else {
                compiled_time_difference = "";
                time_difference = "";
            }
            this.time_remaining = compiled_time_difference;

            if (this.period_different) {
                this.period_different = false;

                this.one_hour_notification = false;
                this.thirty_minute_notification = false;
                this.fifteen_minute_notification = false;
                this.ten_minute_notification = false;
                this.five_minute_notification = false;
                this.one_minute_notification = false;
                this.thirty_second_notification = false;
            }

            if (time_difference) {
                this.scheduled_notifications(time_difference);
            }
        },
        update_next_period: function() {
            this.get_next_period();
            this.next_period = this.next_period_raw[0];

            if (this.developer_mode) console.log(this.next_period_raw);

            let np_starting_string;
            if (!this.twenty_four_hour_time) {
                let np_starting_hour = Number(
                    this.next_period_raw[1][0].split("-").slice(0, 1)
                );

                let hour_string;
                if (np_starting_hour > 12) {
                    hour_string = (np_starting_hour - 12).toString();
                } else {
                    hour_string = np_starting_hour.toString();
                }

                let np_starting =
                    hour_string +
                    ":" +
                    this.next_period_raw[1][0].split("-").slice(1, 2);
                let np_starting_12hr = np_starting_hour >= 12 ? "PM" : "AM";

                np_starting_string = np_starting + " " + np_starting_12hr;
            } else {
                np_starting_string = this.next_period_raw[1][0]
                    .split("-")
                    .slice(0, 2)
                    .join(":");
            }
            this.next_period_starting = np_starting_string;
        },
        scheduled_notifications: function(time_difference) {
            let notification_title =
                this.schedules[this.$route.params.id].short_name +
                " - " +
                this.current_period;
            let notification_icon = "";

            if (Number(time_difference[0]) == 0) {
                let minutes_remaining = Number(time_difference[1]);
                if (Number(time_difference[2]) == 0) {
                    if (
                        minutes_remaining == 30 &&
                        !this.thirty_minute_notification &&
                        this.allow_thirty_minute_notification
                    ) {
                        this.notify(
                            notification_title,
                            "Thirty minutes remaining",
                            notification_icon
                        );
                        this.thirty_minute_notification = true;
                    } else if (
                        minutes_remaining == 15 &&
                        !this.fifteen_minute_notification &&
                        this.allow_fifteen_minute_notification
                    ) {
                        this.notify(
                            notification_title,
                            "Fifteen minutes remaining",
                            notification_icon
                        );
                        this.fifteen_minute_notification = true;
                    } else if (
                        minutes_remaining == 10 &&
                        !this.ten_minute_notification &&
                        this.allow_ten_minute_notification
                    ) {
                        this.notify(
                            notification_title,
                            "Ten minutes remaining",
                            notification_icon
                        );
                        this.ten_minute_notification = true;
                    } else if (
                        minutes_remaining == 5 &&
                        !this.five_minute_notification &&
                        this.allow_five_minute_notification
                    ) {
                        this.notify(
                            notification_title,
                            "Five minutes remaining",
                            notification_icon
                        );
                        this.five_minute_notification = true;
                    } else if (
                        minutes_remaining == 1 &&
                        !this.one_minute_notification &&
                        this.allow_one_minute_notification
                    ) {
                        this.notify(
                            notification_title,
                            "One minute remaining",
                            notification_icon
                        );
                        this.one_minute_notification = true;
                    }
                } else if (
                    minutes_remaining == 0 &&
                    Number(time_difference[2]) == 0 &&
                    !this.thirty_second_notification &&
                    this.allow_thirty_second_notification
                ) {
                    this.notify(
                        notification_title,
                        "Thirty seconds remaining",
                        notification_icon
                    );
                    this.thirty_second_notification = true;
                }
            } else if (
                Number(time_difference[0]) == 1 &&
                Number(time_difference[1]) == 0 &&
                Number(time_difference[2]) == 0 &&
                !this.one_hour_notification &&
                this.allow_one_hour_notification
            ) {
                this.notify(
                    notification_title,
                    "One hour remaining",
                    notification_icon
                );
                this.one_hour_notification = true;
            }
        },
        calculate_time: function(time_1, time_2) {
            const time_1_string = time_1.toString(),
                time_2_string = time_2.toString();

            let time_1_split = time_1_string.split("-"),
                time_1_hour = Number(time_1_split[0]),
                time_1_minutes = Number(time_1_split[1]),
                time_1_seconds = Number(time_1_split[2]);

            let time_2_split = time_2_string.split("-"),
                time_2_hour = Number(time_2_split[0]),
                time_2_minutes = Number(time_2_split[1]),
                time_2_seconds = Number(time_2_split[2]);

            let hour_difference = time_2_hour - time_1_hour,
                minute_difference = time_2_minutes - time_1_minutes,
                second_difference = time_2_seconds - time_1_seconds;

            if (minute_difference < 0) {
                hour_difference -= 1;
                minute_difference += 60;
            }
            if (second_difference < 0) {
                minute_difference -= 1;
                second_difference += 60;
            }

            return [hour_difference, minute_difference, second_difference];
        },
        get_current_period: function() {
            var current_period;
            if (this.schedules[this.$route.params.id] != undefined) {
                var day_schedule = JSON.parse(
                        this.schedules[this.$route.params.id].schedule
                    )[this.current_day],
                    split_time = this.current_split_time.split("-").join("");
                if (this.developer_mode) console.debug(day_schedule);
                for (var _period in day_schedule) {
                    var period = day_schedule[_period],
                        period_start = period[0].split("-").join(""),
                        period_end = period[1].split("-").join("");

                    if (
                        period_start <= split_time &&
                        split_time <= period_end
                    ) {
                        this.current_period_raw = [_period, period];
                        current_period = [_period, period];
                    }
                }
                if (!current_period) {
                    this.current_period_raw = ["No Period", ""];
                }
            } else {
                if (!current_period) {
                    this.current_period_raw = ["No Periods Today", ""];
                }
            }
        },
        get_next_period: function() {
            var next_period;
            if (this.schedules[this.$route.params.id] != undefined) {
                var day_schedule = JSON.parse(
                    this.schedules[this.$route.params.id].schedule
                )[this.current_day];
                for (var _period in day_schedule) {
                    var period = day_schedule[_period],
                        period_start = period[0].split("-").join("");

                    if (this.developer_mode)
                        console.log(
                            _period,
                            period,
                            this.current_split_time,
                            this.current_period_raw[1],
                            period_start ==
                                (
                                    Number(
                                        this.current_period_raw[1][1]
                                            .split("-")
                                            .join("")
                                    ) + 1
                                ).toString()
                        );

                    if (
                        Number(period_start) ==
                        (
                            Number(
                                this.current_period_raw[1][1]
                                    .split("-")
                                    .join("")
                            ) + 1
                        ).toString()
                    ) {
                        this.next_period_raw = [_period, period];
                        next_period = [_period, period];
                    }
                }
                if (!next_period) {
                    this.next_period_raw = ["No Period", ""];
                }
            } else {
                if (!next_period) {
                    this.next_period_raw = ["No Periods Today", ""];
                }
            }
        },
        update_times: function() {
            const d = new Date();
            this.current_day = d
                .toLocaleDateString("en-us", { weekday: "short" })
                .toUpperCase();
            this.current_time =
                this.pad_number(d.getHours().toString()) +
                this.pad_number(d.getMinutes().toString());
            this.current_split_time =
                this.pad_number(d.getHours().toString()) +
                "-" +
                this.pad_number(d.getMinutes().toString()) +
                "-" +
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
        },
        notification_permissions_callback: function(result) {
            if (result != "granted") {
                this.show_toast(
                    'To receive notifications, click "Allow" on the notification permission pop-up',
                    "warning"
                );
            }
        },
        show_toast: function(content, type) {
            let toast_options = {
                position: "bottom-right",
                timeout: 5000,
                closeOnClick: true,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: false,
                draggablePercent: 0.6,
                showCloseButtonOnHover: false,
                hideProgressBar: true,
                closeButton: false,
                icon: true,
                rtl: false
            };

            switch (type) {
                case "warning":
                    this.$toast.warning(content, toast_options);
                    break;
                case "success":
                    this.$toast.success(content, toast_options);
                    break;
                default:
                    console.error("Invalid toast type");
            }
        },
        notify: function(title, body, icon) {
            this.$notification.show(
                title,
                {
                    body: body,
                    icon: icon
                },
                {}
            );
        },
        toggle_dark_mode: function() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            localStorage.setItem(
                "dark_theme",
                this.$vuetify.theme.dark.toString()
            );
        }
    }
};
</script>
