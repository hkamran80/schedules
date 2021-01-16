<template>
    <center-layout>
        <header class="pb-4">
            <v-row dense no-gutters align="center">
                <v-col>
                    <h2
                        class="pb-1"
                        v-text="schedules[this.$route.params.id].name"
                    />
                    <h3
                        v-if="
                            current_pp.day !== null && current_pp.time !== null
                        "
                        v-text="`${current_pp.day} - ${current_pp.time}`"
                    />
                </v-col>
                <v-col cols="3" class="text-right">
                    <v-btn
                        icon
                        color="primary"
                        @click="timetable = true"
                        :disabled="schedule_periods.length === 0"
                    >
                        <v-icon>mdi-calendar-outline</v-icon>
                    </v-btn>
                    <v-btn icon color="primary" @click="open_edit_dialog">
                        <v-icon>mdi-calendar-edit</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </header>

        <v-card class="mx-auto" outlined>
            <v-card-title>
                <span
                    class="title font-weight-regular"
                    v-if="
                        current_period !== null &&
                            current_period !== 'No Period' &&
                            current_period !== 'No Periods Today'
                    "
                    v-text="`${current_period} - ${time_remaining}`"
                />
                <span class="title font-weight-regular" v-else>
                    No Period
                </span>
            </v-card-title>
        </v-card>
        <v-card
            class="mx-auto"
            outlined
            v-if="
                next_period !== null &&
                    next_period !== 'No Period' &&
                    next_period !== 'No Periods Today'
            "
        >
            <v-card-title>
                <span
                    class="title font-weight-regular"
                    v-text="`${next_period} - ${next_period_starting}`"
                />
            </v-card-title>
        </v-card>

        <v-dialog v-model="timetable" width="750" scrollable>
            <v-card class="mx-auto">
                <v-calendar
                    color="primary"
                    type="day"
                    :events="schedule_periods"
                    :first-time="calendar_first_time"
                    :short-weekdays="false"
                    :event-ripple="false"
                    :interval-count="calendar_interval_count"
                    :interval-height="100"
                />
            </v-card>
        </v-dialog>

        <v-dialog v-model="edit_dialog" width="750" scrollable>
            <v-card class="mx-auto">
                <v-card-title>
                    <v-row align="center">
                        <v-col class="text-wrap--break">
                            Edit Period Names
                        </v-col>
                        <v-col cols="4" class="text-right">
                            <v-btn icon @click="pn_import.dialog = true">
                                <v-icon color="primary">
                                    mdi-calendar-import
                                </v-icon>
                            </v-btn>
                            <v-btn icon @click="pn_export_dialog = true">
                                <v-icon color="primary">
                                    mdi-calendar-export
                                </v-icon>
                            </v-btn>

                            <v-btn icon @click="save_period_names">
                                <v-icon color="primary">
                                    mdi-content-save-outline
                                </v-icon>
                            </v-btn>
                            <v-btn icon @click="edit_dialog = false">
                                <v-icon color="primary">mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-progress-linear
                        color="primary lighten-1"
                        background-color="primary lighten-4"
                        indeterminate
                        v-if="Object.keys(this.period_names).length === 0"
                    />

                    <div v-if="Object.keys(this.period_names).length !== 0">
                        <v-text-field
                            v-for="(value, pn) of period_names"
                            :key="pn"
                            :label="pn"
                            v-model="period_names[pn]"
                            outlined
                        />
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="pn_export_dialog" width="750">
            <v-card class="mx-auto">
                <v-card-title>
                    <v-row align="center">
                        <v-col class="text-wrap--break">
                            Export Period Names
                        </v-col>
                        <v-col cols="4" class="text-right">
                            <v-btn icon @click="copy_epn_text">
                                <v-icon color="primary">
                                    mdi-content-copy
                                </v-icon>
                            </v-btn>
                            <v-btn icon @click="pn_export_dialog = false">
                                <v-icon color="primary">mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-textarea
                        id="epn_string"
                        v-model="epn_string"
                        rows="8"
                        readonly
                        outlined
                        label="Period Names String"
                    />
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="pn_import.dialog" width="750">
            <v-card class="mx-auto">
                <v-card-title>
                    <v-row align="center">
                        <v-col class="text-wrap--break">
                            Import Period Names
                        </v-col>
                        <v-col cols="4" class="text-right">
                            <v-btn
                                icon
                                @click="import_pn_string"
                                :disabled="
                                    pn_import.string === null ||
                                        pn_import.string === ''
                                "
                            >
                                <v-icon color="primary">
                                    mdi-calendar-import
                                </v-icon>
                            </v-btn>
                            <v-btn icon @click="pn_import.dialog = false">
                                <v-icon color="primary">mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-textarea
                        v-model="pn_import.string"
                        rows="8"
                        outlined
                        label="Period Names String"
                    />
                </v-card-text>
            </v-card>
        </v-dialog>

        <div v-if="developer_mode">
            <v-divider />
            <v-card class="mx-auto" outlined>
                <v-card-text>
                    {{ current_day }} - {{ current_split_time }} ||
                    {{ current_period_raw }} || {{ next_period_raw }}
                </v-card-text>
                <v-divider />
                <v-card-text v-text="schedule_periods" />
            </v-card>
            <v-btn text block @click="dev"> Development Function </v-btn>
        </div>
    </center-layout>
</template>

<script>
import CenterLayout from "@/components/CenterLayout.vue";

export default {
    name: "Schedule",
    props: {
        schedules: Object
    },
    components: { CenterLayout },
    data: function() {
        return {
            // Current and Next Period Information
            current_period: null,
            time_remaining: null,
            next_period: null,
            next_period_starting: null,

            // Previous Period Information
            previous_period: null,
            different_period: false,

            // Raw Period Information
            current_period_raw: [],
            next_period_raw: [],

            // Date and Time
            current_day: "",
            current_time: "",
            current_split_time: "",
            current_pp: {
                day: null,
                time: null
            },

            // Period Editing Functionality
            pn_sch_id: "",
            period_names: {},
            edit_dialog: false,
            pn_import: {
                dialog: false,
                string: null
            },
            pn_export_dialog: false,

            // Timetable
            timetable: false,

            // Notifications
            notifications_supported: false,
            notifications: {
                one_hour: false,
                thirty_minute: false,
                fifteen_minute: false,
                ten_minute: false,
                five_minute: false,
                one_minute: false,
                thirty_second: false
            },

            main_interval: null,
            developer_mode: this.$route.query.dev === "true"
        };
    },
    created() {
        this.main_interval = setInterval(this.main, 1000);
        this.get_period_names();

        if (typeof this.schedules[this.$route.params.id] === "undefined") {
            this.$router.push({
                name: "NotFound",
                query: { path: window.location.origin + this.$route.path }
            });
        }
    },
    mounted() {
        this.$notification
            .requestPermission()
            .then(this.notification_permissions_callback, console.error)
            .catch(console.error);
    },
    destroyed() {
        clearInterval(this.main_interval);
        this.main_interval = 0;
    },
    computed: {
        schedule: function() {
            return JSON.parse(this.schedules[this.$route.params.id].schedule);
        },
        color: function() {
            return this.schedules[this.$route.params.id].color;
        },
        calendar_interval_count: function() {
            if (typeof this.schedule[this.current_day] !== "undefined") {
                let end = this.schedule[this.current_day][
                        Object.keys(this.schedule[this.current_day]).slice(
                            -1
                        )[0]
                    ][1].split("-")[0],
                    start = this.schedule[this.current_day][
                        Object.keys(this.schedule[this.current_day])[0]
                    ][0].split("-")[0];

                return Number(end) - Number(start);
            } else {
                return null;
            }
        },
        calendar_first_time: function() {
            return typeof this.schedule[this.current_day] !== "undefined"
                ? this.schedule[this.current_day][
                      Object.keys(this.schedule[this.current_day])[0]
                  ][0].split("-")[0] + "00"
                : "08:00";
        },
        schedule_periods: function() {
            let periods = [];
            if (typeof this.schedule[this.current_day] !== "undefined") {
                let day_schedule = this.schedule[this.current_day],
                    d = new Date(),
                    date = `${d.getFullYear()}-${this.pad_number(
                        Number(d.getMonth()) + 1
                    )}-${this.pad_number(d.getDate())}`;

                Object.keys(day_schedule).forEach(period =>
                    periods.push({
                        name: period,
                        start: `${date} ${day_schedule[period][0].replaceAll(
                            "-",
                            ":"
                        )}`,
                        end: `${date} ${day_schedule[period][1].replaceAll(
                            "-",
                            ":"
                        )}`,
                        color:
                            period.indexOf("Passing") === -1
                                ? this.color
                                : "primary"
                    })
                );
            }

            return periods;
        },
        epn_string: function() {
            return JSON.stringify(this.period_names);
        }
    },
    methods: {
        import_pn_string: function() {
            try {
                let pn_import_string = JSON.parse(this.pn_import.string);

                this.get_period_names();
                let pn_keys = Object.keys(this.period_names),
                    pn_match;

                Object.keys(pn_import_string).forEach(key => {
                    if (pn_match !== false) {
                        if (pn_keys.indexOf(key) !== -1) {
                            pn_match = true;
                        } else {
                            pn_match = false;
                        }
                    }
                });

                if (pn_match) {
                    this.period_names = pn_import_string;
                    localStorage.setItem(
                        `schedule.${this.$route.params.id}`,
                        JSON.stringify(pn_import_string)
                    );

                    this.pn_import.string = null;
                    this.pn_import.dialog = false;
                    this.edit_dialog = false;

                    this.show_toast(
                        "Successfully imported period names!",
                        "success"
                    );
                } else {
                    this.show_toast(
                        "Key match failed. Please enter the correct string that matches this schedule's period name keys.",
                        "error"
                    );
                }
            } catch (e) {
                this.show_toast(
                    "Unable to import period names. An error occurred when parsing. Try again.",
                    "error"
                );
            }
        },
        copy_epn_text: function() {
            let epn_element = document.getElementById("epn_string");
            epn_element.select();
            document.execCommand("copy");

            this.show_toast("Copied period names to the clipboard", "info");

            this.pn_export_dialog = false;
        },
        dev: function() {
            console.debug("Development function called");
            console.debug(this.schedule_periods);
        },
        check_for_custom_period_name: function(period_name) {
            this.get_period_names();

            if (
                typeof this.period_names[period_name] === "undefined" ||
                this.period_names[period_name] === ""
            ) {
                return period_name;
            } else {
                return this.period_names[period_name];
            }
        },
        open_edit_dialog: function() {
            this.get_period_names();
            this.edit_dialog = true;
        },
        save_period_names: function() {
            localStorage.setItem(
                `schedule.${this.$route.params.id}`,
                JSON.stringify(this.period_names)
            );
            this.edit_dialog = false;
            this.show_toast("Saved period names!", "success");
        },
        get_period_names: function() {
            if (
                Object.keys(this.period_names).length === 0 ||
                this.pn_sch_id !== this.$route.params.id
            ) {
                this.pn_sch_id = this.$route.params.id;
                if (
                    localStorage.getItem(
                        `schedule.${this.$route.params.id}`
                    ) !== null
                ) {
                    this.period_names = JSON.parse(
                        localStorage.getItem(
                            `schedule.${this.$route.params.id}`
                        )
                    );
                } else {
                    this.period_names = {};

                    Object.keys(this.schedule).forEach(day =>
                        Object.keys(this.schedule[day]).forEach(
                            pn => (this.period_names[pn] = "")
                        )
                    );
                }
            }
        },
        main: function() {
            this.update_times();
            this.get_current_period();

            if (
                this.current_period_raw[0] !== "No Period" &&
                this.current_period_raw[0] !== "No Periods Today"
            ) {
                this.current_period = this.check_for_custom_period_name(
                    this.current_period_raw[0]
                );

                if (this.current_period !== this.previous_period) {
                    this.different_period = true;
                } else {
                    this.different_period = false;
                }
                this.previous_period = this.current_period;

                this.update_next_period();

                let compiled_time_difference;
                var time_difference;
                if (this.current_period_raw[1] !== "") {
                    let scheduled_end = this.current_period_raw[1][1].toString();

                    time_difference = this.calculate_time(
                        this.current_split_time,
                        scheduled_end
                    );

                    if (time_difference[0] === 0) {
                        if (time_difference[1] === 0) {
                            compiled_time_difference =
                                "00:00:" + this.pad_number(time_difference[2]);
                        } else {
                            if (time_difference[2] === 0) {
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

                if (this.different_period) {
                    this.different_period = false;

                    this.notifications.one_hour = false;
                    this.notifications.thirty_minute = false;
                    this.notifications.fifteen_minute = false;
                    this.notifications.ten_minute = false;
                    this.notifications.five_minute = false;
                    this.notifications.one_minute = false;
                    this.notifications.thirty_second = false;
                }

                if (time_difference) {
                    this.scheduled_notifications(time_difference);
                }
            } else {
                this.current_period = this.check_for_custom_period_name(
                    this.current_period_raw[0]
                );
                this.next_period = "No Period";
            }
        },
        update_next_period: function() {
            this.get_next_period();

            this.next_period = this.check_for_custom_period_name(
                this.next_period_raw[0]
            );
            if (
                this.next_period_raw[0] != "No Period" &&
                this.next_period_raw[0] != "No Periods Today"
            ) {
                let np_starting_string;

                if (!this.$twenty_four_hour_time) {
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
            }
        },
        scheduled_notifications: function(time_difference) {
            let notification_title =
                this.schedules[this.$route.params.id].short_name +
                " - " +
                this.current_period;
            let notification_icon = "";

            if (Number(time_difference[0]) === 0) {
                let minutes_remaining = Number(time_difference[1]);
                if (Number(time_difference[2]) == 0) {
                    if (
                        minutes_remaining === 30 &&
                        !this.notifications.thirty_minute
                    ) {
                        this.notify(
                            notification_title,
                            "Thirty minutes remaining",
                            notification_icon
                        );
                        this.notifications.thirty_minute = true;
                    } else if (
                        minutes_remaining === 15 &&
                        !this.notifications.fifteen_minute
                    ) {
                        this.notify(
                            notification_title,
                            "Fifteen minutes remaining",
                            notification_icon
                        );
                        this.notifications.fifteen_minute = true;
                    } else if (
                        minutes_remaining === 10 &&
                        !this.notifications.ten_minute
                    ) {
                        this.notify(
                            notification_title,
                            "Ten minutes remaining",
                            notification_icon
                        );
                        this.notifications.ten_minute = true;
                    } else if (
                        minutes_remaining === 5 &&
                        !this.notifications.five_minute
                    ) {
                        this.notify(
                            notification_title,
                            "Five minutes remaining",
                            notification_icon
                        );
                        this.notifications.five_minute = true;
                    } else if (
                        minutes_remaining === 1 &&
                        !this.one_minute_notification
                    ) {
                        this.notify(
                            notification_title,
                            "One minute remaining",
                            notification_icon
                        );
                        this.notifications.one_minute = true;
                    }
                } else if (
                    minutes_remaining === 0 &&
                    Number(time_difference[2]) === 0 &&
                    !this.notifications.thirty_second
                ) {
                    this.notify(
                        notification_title,
                        "Thirty seconds remaining",
                        notification_icon
                    );
                    this.notifications.thirty_second = true;
                }
            } else if (
                Number(time_difference[0]) === 1 &&
                Number(time_difference[1]) === 0 &&
                Number(time_difference[2]) === 0 &&
                !this.notifications.one_hour
            ) {
                this.notify(
                    notification_title,
                    "One hour remaining",
                    notification_icon
                );
                this.notifications.one_hour = true;
            }
        },
        calculate_time: function(time_1, time_2) {
            let time_1_string = time_1.replaceAll("-", ":"),
                time_2_string = time_2.replaceAll("-", ":");

            let start_time = new Date("1970-01-01 " + time_1_string),
                end_time = new Date("1970-01-01 " + time_2_string);
            let ms_difference = end_time - start_time;

            let seconds = ms_difference / 1000;
            let hours = parseInt(seconds / 3600);
            seconds = seconds % 3600;
            let minutes = parseInt(seconds / 60);
            seconds = seconds % 60;

            return [hours, minutes, seconds];
        },
        get_current_period: function() {
            var current_period = false;
            if (typeof this.schedule[this.current_day] !== "undefined") {
                var day_schedule = this.schedule[this.current_day],
                    split_time = this.current_split_time.split("-").join("");

                Object.keys(day_schedule).forEach(period_name => {
                    let period_times = day_schedule[period_name],
                        period_start = period_times[0].replaceAll("-", ""),
                        period_end = period_times[1].replaceAll("-", "");

                    if (
                        period_start <= split_time &&
                        split_time <= period_end
                    ) {
                        this.current_period_raw = [period_name, period_times];
                        current_period = true;
                    }
                });

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

            if (typeof this.schedule[this.current_day] !== "undefined") {
                var day_schedule = this.schedule[this.current_day];
                for (var _period in day_schedule) {
                    var period = day_schedule[_period],
                        period_start = period[0].split("-").join("");

                    let previous_period_end;
                    if (
                        this.current_period_raw[1][1].split("-").slice(2, 3) !==
                        "59"
                    ) {
                        previous_period_end = (
                            Number(
                                this.current_period_raw[1][1]
                                    .split("-")
                                    .join("")
                            ) + 1
                        ).toString();
                    } else {
                        let _end = this.current_period_raw[1][1].split("-"),
                            hours = Number(_end.slice(0, 1)),
                            minutes = Number(_end.slice(1, 2)),
                            seconds = Number(_end.slice(2, 3));

                        if (seconds >= 59) {
                            minutes += 1;
                            seconds =
                                seconds >= 60 ? seconds - 60 : seconds - 59;
                        }

                        if (minutes >= 59) {
                            hours += 1;
                            minutes =
                                minutes > 59 ? minutes - 60 : minutes - 59;
                        }

                        previous_period_end =
                            this.pad_number(hours) +
                            this.pad_number(minutes) +
                            this.pad_number(seconds);
                    }

                    if (
                        Number(period_start).toString() == previous_period_end
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

            this.current_pp.day = d.toLocaleDateString("en-us", {
                weekday: "long"
            });
            this.current_pp.time = d.toLocaleString("en-us", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: !this.$twenty_four_hour_time
            });
        },
        pad_number: function(number) {
            return Number(number < 10)
                ? "0" + Number(number).toString()
                : Number(number).toString();
        },
        show_toast: function(content, type) {
            // TODO: Switch to native Vuetify snackbar
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
                case "info":
                    this.$toast.info(content, toast_options);
                    break;
                case "error":
                    this.$toast.error(content, toast_options);
                    break;
                default:
                    this.$toast(content, toast_options);
            }
        },
        notification_permissions_callback: function(result) {
            if (result != "granted") {
                this.show_toast(
                    'To receive notifications, click "Allow" on the notification permission pop-up',
                    "warning"
                );
            }
        },
        notify: function(title, body, icon = "") {
            this.$notification.show(
                title,
                {
                    body: body,
                    icon: icon
                },
                {}
            );
        }
    }
};
</script>

<style scoped>
div.v-card {
    padding: 0 5px;
    margin: 10px 0;
    overflow-wrap: break-word;
}
</style>

<!--
<style lang="sass" scoped>
$calendar-daily-weekday-padding: 5px 0px 0px 0px
</style>
-->
