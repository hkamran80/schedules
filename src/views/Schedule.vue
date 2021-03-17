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
                            currentPrettyDateTime.day !== null &&
                                currentPrettyDateTime.time !== null
                        "
                        v-text="
                            `${currentPrettyDateTime.day} - ${currentPrettyDateTime.time}`
                        "
                    />
                </v-col>
                <v-col cols="3" class="text-right">
                    <v-btn
                        icon
                        color="primary"
                        v-if="$edge_mode || $dev_mode"
                        @click="toggleDebugMode"
                    >
                        <v-icon>
                            mdi-console-line
                        </v-icon>
                    </v-btn>
                    <v-btn
                        icon
                        color="primary"
                        @click="timetable = true"
                        :disabled="schedulePeriods.length === 0"
                    >
                        <v-icon>mdi-calendar-outline</v-icon>
                    </v-btn>
                    <v-btn icon color="primary" @click="settingsDialog = true">
                        <v-icon>mdi-cog-outline</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </header>

        <v-card class="mx-auto" outlined>
            <v-card-title>
                <span
                    class="title font-weight-regular"
                    v-if="
                        currentPeriod !== null &&
                            currentPeriod !== 'No Period' &&
                            currentPeriod !== 'No Periods Today'
                    "
                    v-text="`${currentPeriod} - ${timeRemaining}`"
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
                nextPeriod !== null &&
                    nextPeriod !== 'No Period' &&
                    nextPeriod !== 'No Periods Today'
            "
        >
            <v-card-title>
                <span
                    class="title font-weight-regular"
                    v-text="`${nextPeriod} - ${nextPeriodStarting}`"
                />
            </v-card-title>
        </v-card>

        <v-dialog v-model="timetable" width="750" scrollable>
            <v-card class="mx-auto">
                <v-calendar
                    color="primary"
                    type="day"
                    :events="schedulePeriods"
                    :first-time="calendarFirstTime"
                    :short-weekdays="false"
                    :event-ripple="false"
                    :event-height="60"
                    :event-margin-bottom="5"
                    :interval-count="calendarIntervalCount"
                    :interval-height="150"
                />
            </v-card>
        </v-dialog>

        <v-dialog v-model="editDialog" width="750" scrollable>
            <v-card class="mx-auto">
                <v-card-title>
                    <v-row align="center">
                        <v-col class="text-wrap--break">
                            Edit Period Names
                        </v-col>
                        <v-col cols="4" class="text-right">
                            <v-btn icon @click="savePeriodNames">
                                <v-icon color="primary">
                                    mdi-content-save-outline
                                </v-icon>
                            </v-btn>
                            <v-btn icon @click="editDialog = false">
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
                        v-if="Object.keys(this.periodNames).length === 0"
                    />

                    <div v-if="Object.keys(this.periodNames).length !== 0">
                        <v-text-field
                            v-for="(value, pn) of periodNames"
                            :key="pn"
                            :label="pn"
                            v-model="periodNames[pn]"
                            outlined
                        />
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="settingsDialog" width="750" scrollable>
            <v-card class="mx-auto">
                <v-card-title>
                    <v-row align="center">
                        <v-col class="text-wrap--break">
                            Settings
                        </v-col>
                        <v-col cols="4" class="text-right">
                            <v-btn icon @click="settingsDialog = false">
                                <v-icon color="primary">mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>

                <v-card-text>
                    <div class="mb-5">
                        <h3 class="mb-5">
                            Period Names
                        </h3>

                        <v-btn
                            block
                            color="primary"
                            class="mb-3"
                            @click="openEditDialog"
                        >
                            Edit
                        </v-btn>
                        <v-btn
                            block
                            color="primary"
                            class="mb-3"
                            @click="periodNamesImport.dialog = true"
                        >
                            Import
                        </v-btn>
                        <v-btn
                            block
                            color="primary"
                            @click="periodNamesExportDialog = true"
                        >
                            Export
                        </v-btn>
                    </div>

                    <v-divider class="mb-2" />

                    <div class="mt-5">
                        <h3 class="mb-1">
                            Notifications
                        </h3>
                        <div class="mb-5">
                            <h4 class="mb-2">
                                Days
                            </h4>

                            <v-switch
                                v-for="(state,
                                day) in allowedNotifications.days"
                                :key="day"
                                v-model="allowedNotifications.days[day]"
                                :label="
                                    day.replace(/\b[a-z]/g, str =>
                                        str.toUpperCase()
                                    )
                                "
                                inset
                                hide-details
                                readonly
                                @click="
                                    updateAllowedNotifications(
                                        'day',
                                        day,
                                        !state
                                    )
                                "
                            />
                        </div>
                        <div class="mb-5">
                            <h4 class="mb-2">
                                Intervals
                            </h4>

                            <v-switch
                                v-for="(state,
                                interval) in allowedNotifications.intervals"
                                :key="interval"
                                v-model="
                                    allowedNotifications.intervals[interval]
                                "
                                :label="
                                    interval
                                        .split('_')
                                        .join(' ')
                                        .replace(/\b[a-z]/g, str =>
                                            str.toUpperCase()
                                        )
                                "
                                inset
                                hide-details
                                readonly
                                @click="
                                    updateAllowedNotifications(
                                        'interval',
                                        interval,
                                        !state
                                    )
                                "
                            />
                        </div>
                        <div class="mb-5">
                            <h4 class="mb-2">
                                Periods
                            </h4>

                            <v-switch
                                v-for="(state,
                                period) in allowedNotifications.periods"
                                :key="period"
                                v-model="allowedNotifications.periods[period]"
                                :label="period"
                                inset
                                hide-details
                                readonly
                                @click="
                                    updateAllowedNotifications(
                                        'period',
                                        period,
                                        !state
                                    )
                                "
                            />
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="periodNamesExportDialog" width="750">
            <v-card class="mx-auto">
                <v-card-title>
                    <v-row align="center">
                        <v-col class="text-wrap--break">
                            Export Period Names
                        </v-col>
                        <v-col cols="4" class="text-right">
                            <v-btn icon @click="copyExportedPeriodNames">
                                <v-icon color="primary">
                                    mdi-content-copy
                                </v-icon>
                            </v-btn>
                            <v-btn
                                icon
                                @click="periodNamesExportDialog = false"
                            >
                                <v-icon color="primary">mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-textarea
                        id="exportPeriodNamesString"
                        v-model="exportPeriodNamesString"
                        rows="8"
                        readonly
                        outlined
                        label="Period Names String"
                    />
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="periodNamesImport.dialog" width="750">
            <v-card class="mx-auto">
                <v-card-title>
                    <v-row align="center">
                        <v-col class="text-wrap--break">
                            Import Period Names
                        </v-col>
                        <v-col cols="4" class="text-right">
                            <v-btn
                                icon
                                @click="importPeriodNamesString"
                                :disabled="
                                    periodNamesImport.string === null ||
                                        periodNamesImport.string === ''
                                "
                            >
                                <v-icon color="primary">
                                    mdi-calendar-import
                                </v-icon>
                            </v-btn>
                            <v-btn
                                icon
                                @click="periodNamesImport.dialog = false"
                            >
                                <v-icon color="primary">mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-textarea
                        v-model="periodNamesImport.string"
                        rows="8"
                        outlined
                        label="Period Names String"
                    />
                </v-card-text>
            </v-card>
        </v-dialog>

        <div v-if="debugMode">
            <v-divider />
            <v-card class="mx-auto" outlined>
                <v-card-text v-text="$app_version" />
                <v-divider />
                <v-card-text>
                    {{ currentDay }} - {{ currentSplitTime }}
                </v-card-text>
                <v-divider />
                <v-card-text>
                    {{ currentPeriodRaw }}
                </v-card-text>
                <v-divider />
                <v-card-text>
                    {{ nextPeriodRaw }}
                </v-card-text>
            </v-card>
            <v-btn text block @click="debugFunction">
                Debug Function
            </v-btn>
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
            currentPeriod: null,
            timeRemaining: null,
            nextPeriod: null,
            nextPeriodStarting: null,

            // Previous Period Information
            previousPeriod: null,
            differentPeriod: false,

            // Raw Period Information
            currentPeriodRaw: [],
            nextPeriodRaw: [],

            // Date and Time
            currentDay: "",
            currentTime: "",
            currentSplitTime: "",
            currentPrettyDateTime: {
                day: null,
                time: null
            },

            // Settings
            settingsDialog: false,

            // Period Editing Functionality
            periodNamesScheduleId: "",
            periodNames: {},
            editDialog: false,
            periodNamesImport: {
                dialog: false,
                string: null
            },
            periodNamesExportDialog: false,

            // Timetable
            timetable: false,

            // Notifications
            notificationsSupported: false,
            notifications: {
                oneHour: false,
                thirtyMinute: false,
                fifteenMinute: false,
                tenMinute: false,
                fiveMinute: false,
                oneMinute: false,
                thirtySecond: false
            },
            allowedNotifications: {
                intervals: {
                    oneHour: true,
                    thirtyMinute: true,
                    fifteenMinute: true,
                    tenMinute: true,
                    fiveMinute: true,
                    oneMinute: true,
                    thirtySecond: true
                },
                days: {
                    sunday: true,
                    monday: true,
                    tuesday: true,
                    wednesday: true,
                    thursday: true,
                    friday: true,
                    saturday: true
                },
                periods: {}
            },

            mainInterval: null,
            debugMode: this.$route.query.debug === "true"
        };
    },
    created() {
        this.mainInterval = setInterval(this.main, 1000);

        // Load Settings
        this.getPeriodNames();
        this.loadAllowedNotifications();

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
            .then(this.notificationPermissionsCallback, console.error)
            .catch(console.error);
    },
    destroyed() {
        clearInterval(this.mainInterval);
        this.mainInterval = 0;
    },
    computed: {
        schedule: function() {
            return this.schedules[this.$route.params.id].schedule;
        },
        color: function() {
            return this.schedules[this.$route.params.id].color;
        },
        calendarIntervalCount: function() {
            if (typeof this.schedule[this.currentDay] !== "undefined") {
                let end_times = this.schedule[this.currentDay][
                        Object.keys(this.schedule[this.currentDay]).slice(-1)[0]
                    ][1].split("-"),
                    start_time_hour = Number(
                        this.schedule[this.currentDay][
                            Object.keys(this.schedule[this.currentDay])[0]
                        ][0].split("-")[0]
                    ),
                    end_time_hour;

                end_time_hour =
                    Number(end_times[1]) !== 0
                        ? Number(end_times[0]) + 1
                        : Number(end_times[0]);

                return end_time_hour - start_time_hour;
            } else {
                return null;
            }
        },
        calendarFirstTime: function() {
            return typeof this.schedule[this.currentDay] !== "undefined"
                ? this.schedule[this.currentDay][
                      Object.keys(this.schedule[this.currentDay])[0]
                  ][0].split("-")[0] + "00"
                : "08:00";
        },
        schedulePeriods: function() {
            let periods = [];
            if (typeof this.schedule[this.currentDay] !== "undefined") {
                let day_schedule = this.schedule[this.currentDay],
                    d = new Date(),
                    date = `${d.getFullYear()}-${this.padNumber(
                        Number(d.getMonth()) + 1
                    )}-${this.padNumber(d.getDate())}`;

                Object.keys(day_schedule).forEach(period =>
                    periods.push({
                        name: this.checkForCustomPeriodName(period, true),
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
        exportPeriodNamesString: function() {
            return JSON.stringify(this.periodNames);
        }
    },
    methods: {
        loadAllowedNotifications: function() {
            let allowedNotifications = localStorage.getItem(
                `allowedNotifications.${this.$route.params.id}`
            );

            if (allowedNotifications !== null) {
                this.allowedNotifications = JSON.parse(allowedNotifications);
            }

            if (Object.keys(this.allowedNotifications.periods).length === 0) {
                let periodNames = {};
                Object.keys(this.schedule).forEach(day =>
                    Object.keys(this.schedule[day]).forEach(
                        periodName => (periodNames[periodName] = true)
                    )
                );
                this.allowedNotifications.periods = periodNames;
            }
        },
        updateAllowedNotifications: function(type, id, value) {
            switch (type) {
                case "interval":
                    this.allowedNotifications.intervals[id] = value;
                    break;
                case "day":
                    this.allowedNotifications.days[id] = value;
                    break;
                case "period":
                    this.allowedNotifications.periods[id] = value;
                    break;
            }

            localStorage.setItem(
                `allowedNotifications.${this.$route.params.id}`,
                JSON.stringify(this.allowedNotifications)
            );
        },
        toggleDebugMode: function() {
            this.debugMode = !this.debugMode;

            if (this.debugMode === true) {
                this.$router.replace({
                    name: "Schedule",
                    params: { id: this.$route.params.id },
                    query: { debug: true }
                });
            } else {
                this.$router.replace({
                    name: "Schedule",
                    params: { id: this.$route.params.id }
                });
            }
        },
        importPeriodNamesString: function() {
            try {
                let periodNamesImport_string = JSON.parse(
                    this.periodNamesImport.string
                );

                this.getPeriodNames();
                let pn_keys = Object.keys(this.periodNames),
                    pn_match;

                Object.keys(periodNamesImport_string).forEach(key => {
                    if (pn_match !== false) {
                        pn_match = pn_keys.indexOf(key) !== -1 ? true : false;
                    }
                });

                if (pn_match) {
                    this.periodNames = periodNamesImport_string;
                    localStorage.setItem(
                        `schedule.${this.$route.params.id}`,
                        JSON.stringify(periodNamesImport_string)
                    );

                    this.periodNamesImport.string = null;
                    this.periodNamesImport.dialog = false;
                    this.editDialog = false;

                    this.showToast(
                        "Successfully imported period names!",
                        "success"
                    );
                } else {
                    this.showToast(
                        "Key match failed. Please enter the correct string that matches this schedule's period name keys.",
                        "error"
                    );
                }
            } catch (e) {
                this.showToast(
                    "Unable to import period names. An error occurred when parsing. Try again.",
                    "error"
                );
            }
        },
        copyExportedPeriodNames: function() {
            let epn_element = document.getElementById(
                "exportPeriodNamesString"
            );
            epn_element.select();
            document.execCommand("copy");

            this.showToast("Copied period names to the clipboard", "info");

            this.periodNamesExportDialog = false;
        },
        debugFunction: function() {
            console.debug("Development function called");
            console.debug(this.currentPrettyDateTime.day.toLowerCase());
        },
        checkForCustomPeriodName: function(period_name, with_period = false) {
            this.getPeriodNames();

            if (
                typeof this.periodNames[period_name] === "undefined" ||
                this.periodNames[period_name] === ""
            ) {
                return period_name;
            } else {
                return with_period
                    ? `${this.periodNames[period_name]} (${period_name})`
                    : this.periodNames[period_name];
            }
        },
        openEditDialog: function() {
            this.getPeriodNames();
            this.editDialog = true;
        },
        savePeriodNames: function() {
            localStorage.setItem(
                `schedule.${this.$route.params.id}`,
                JSON.stringify(this.periodNames)
            );
            this.editDialog = false;
            this.showToast("Saved period names!", "success");
        },
        getPeriodNames: function() {
            if (
                Object.keys(this.periodNames).length === 0 ||
                this.periodNamesScheduleId !== this.$route.params.id
            ) {
                this.periodNamesScheduleId = this.$route.params.id;
                if (
                    localStorage.getItem(
                        `schedule.${this.$route.params.id}`
                    ) !== null
                ) {
                    this.periodNames = JSON.parse(
                        localStorage.getItem(
                            `schedule.${this.$route.params.id}`
                        )
                    );
                } else {
                    this.periodNames = {};

                    Object.keys(this.schedule).forEach(day =>
                        Object.keys(this.schedule[day]).forEach(
                            pn => (this.periodNames[pn] = "")
                        )
                    );
                }
            }
        },
        main: function() {
            this.updateTimes();
            this.getCurrentPeriod();

            if (
                this.currentPeriodRaw[0] !== "No Period" &&
                this.currentPeriodRaw[0] !== "No Periods Today"
            ) {
                this.currentPeriod = this.checkForCustomPeriodName(
                    this.currentPeriodRaw[0],
                    true
                );

                if (this.currentPeriod !== this.previousPeriod) {
                    this.differentPeriod = true;
                } else {
                    this.differentPeriod = false;
                }
                this.previousPeriod = this.currentPeriod;

                this.updateNextPeriod();

                let compiled_time_difference;
                var time_difference;
                if (this.currentPeriodRaw[1] !== "") {
                    let scheduled_end = this.currentPeriodRaw[1][1].toString();

                    time_difference = this.calculateTimeDifference(
                        this.currentSplitTime,
                        scheduled_end
                    );

                    if (time_difference[0] === 0) {
                        if (time_difference[1] === 0) {
                            compiled_time_difference =
                                "00:00:" + this.padNumber(time_difference[2]);
                        } else {
                            compiled_time_difference =
                                time_difference[2] === 0
                                    ? "00:" +
                                      this.padNumber(time_difference[1]) +
                                      ":00"
                                    : "00:" +
                                      this.padNumber(time_difference[1]) +
                                      ":" +
                                      this.padNumber(time_difference[2]);
                        }
                    } else {
                        compiled_time_difference =
                            this.padNumber(time_difference[0]) +
                            ":" +
                            this.padNumber(time_difference[1]) +
                            ":" +
                            this.padNumber(time_difference[2]);
                    }
                } else {
                    compiled_time_difference = "";
                    time_difference = "";
                }
                this.timeRemaining = compiled_time_difference;

                if (this.differentPeriod) {
                    this.differentPeriod = false;

                    this.notifications.oneHour = false;
                    this.notifications.thirtyMinute = false;
                    this.notifications.fifteenMinute = false;
                    this.notifications.tenMinute = false;
                    this.notifications.fiveMinute = false;
                    this.notifications.oneMinute = false;
                    this.notifications.thirtySecond = false;
                }

                if (time_difference) {
                    this.scheduledNotifications(time_difference);
                }
            } else {
                this.currentPeriod = this.checkForCustomPeriodName(
                    this.currentPeriodRaw[0]
                );
                this.nextPeriod = "No Period";
            }
        },
        updateNextPeriod: function() {
            this.getNextPeriod();

            this.nextPeriod = this.checkForCustomPeriodName(
                this.nextPeriodRaw[0]
            );
            if (
                this.nextPeriodRaw[0] != "No Period" &&
                this.nextPeriodRaw[0] != "No Periods Today"
            ) {
                let np_starting_string;

                if (!this.$twenty_four_hour_time) {
                    let np_starting_hour = Number(
                        this.nextPeriodRaw[1][0].split("-").slice(0, 1)
                    );

                    let hour_string =
                        np_starting_hour > 12
                            ? (np_starting_hour - 12).toString()
                            : np_starting_hour.toString();

                    let np_starting =
                        hour_string +
                        ":" +
                        this.nextPeriodRaw[1][0].split("-").slice(1, 2);
                    let np_starting_12hr = np_starting_hour >= 12 ? "PM" : "AM";

                    np_starting_string = np_starting + " " + np_starting_12hr;
                } else {
                    np_starting_string = this.nextPeriodRaw[1][0]
                        .split("-")
                        .slice(0, 2)
                        .join(":");
                }
                this.nextPeriodStarting = np_starting_string;
            }
        },
        scheduledNotifications: function(time_difference) {
            let notification_title =
                this.schedules[this.$route.params.id].short_name +
                " - " +
                this.currentPeriod;
            let notification_icon = "";

            if (
                this.allowedNotifications.days[
                    this.currentPrettyDateTime.day.toLowerCase()
                ] &&
                this.allowedNotifications.periods[this.currentPeriod]
            ) {
                if (Number(time_difference[0]) === 0) {
                    let minutes_remaining = Number(time_difference[1]);
                    if (Number(time_difference[2]) == 0) {
                        if (
                            minutes_remaining === 30 &&
                            !this.notifications.thirtyMinute &&
                            this.allowedNotifications.intervals.thirtyMinute
                        ) {
                            this.notify(
                                notification_title,
                                "Thirty minutes remaining",
                                notification_icon
                            );
                            this.notifications.thirtyMinute = true;
                        } else if (
                            minutes_remaining === 15 &&
                            !this.notifications.fifteenMinute &&
                            this.allowedNotifications.intervals.fifteenMinute
                        ) {
                            this.notify(
                                notification_title,
                                "Fifteen minutes remaining",
                                notification_icon
                            );
                            this.notifications.fifteenMinute = true;
                        } else if (
                            minutes_remaining === 10 &&
                            !this.notifications.tenMinute &&
                            this.allowedNotifications.intervals.tenMinute
                        ) {
                            this.notify(
                                notification_title,
                                "Ten minutes remaining",
                                notification_icon
                            );
                            this.notifications.tenMinute = true;
                        } else if (
                            minutes_remaining === 5 &&
                            !this.notifications.fiveMinute &&
                            this.allowedNotifications.intervals.fiveMinute
                        ) {
                            this.notify(
                                notification_title,
                                "Five minutes remaining",
                                notification_icon
                            );
                            this.notifications.fiveMinute = true;
                        } else if (
                            minutes_remaining === 1 &&
                            !this.oneMinute_notification &&
                            this.allowedNotifications.intervals.oneMinute
                        ) {
                            this.notify(
                                notification_title,
                                "One minute remaining",
                                notification_icon
                            );
                            this.notifications.oneMinute = true;
                        }
                    } else if (
                        minutes_remaining === 0 &&
                        Number(time_difference[2]) === 0 &&
                        !this.notifications.thirtySecond &&
                        this.allowedNotifications.intervals.thirtySecond
                    ) {
                        this.notify(
                            notification_title,
                            "Thirty seconds remaining",
                            notification_icon
                        );
                        this.notifications.thirtySecond = true;
                    }
                } else if (
                    Number(time_difference[0]) === 1 &&
                    Number(time_difference[1]) === 0 &&
                    Number(time_difference[2]) === 0 &&
                    !this.notifications.oneHour &&
                    this.allowedNotifications.intervals.oneHour
                ) {
                    this.notify(
                        notification_title,
                        "One hour remaining",
                        notification_icon
                    );
                    this.notifications.oneHour = true;
                }
            }
        },
        calculateTimeDifference: function(time_1, time_2) {
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
        getCurrentPeriod: function() {
            var currentPeriod = false;
            if (typeof this.schedule[this.currentDay] !== "undefined") {
                var day_schedule = this.schedule[this.currentDay],
                    split_time = this.currentSplitTime.split("-").join("");

                Object.keys(day_schedule).forEach(period_name => {
                    let period_times = day_schedule[period_name],
                        period_start = period_times[0].replaceAll("-", ""),
                        period_end = period_times[1].replaceAll("-", "");

                    if (
                        period_start <= split_time &&
                        split_time <= period_end
                    ) {
                        this.currentPeriodRaw = [period_name, period_times];
                        currentPeriod = true;
                    }
                });

                if (!currentPeriod) {
                    this.currentPeriodRaw = ["No Period", ""];
                }
            } else {
                if (!currentPeriod) {
                    this.currentPeriodRaw = ["No Periods Today", ""];
                }
            }
        },
        getNextPeriod: function() {
            var nextPeriod;

            if (typeof this.schedule[this.currentDay] !== "undefined") {
                var day_schedule = this.schedule[this.currentDay];
                for (var _period in day_schedule) {
                    var period = day_schedule[_period],
                        period_start = period[0].split("-").join("");

                    let previousPeriod_end;
                    if (this.currentPeriodRaw[1][1].split("-")[2] !== "59") {
                        previousPeriod_end = (
                            Number(
                                this.currentPeriodRaw[1][1].split("-").join("")
                            ) + 1
                        ).toString();
                    } else {
                        let end = this.currentPeriodRaw[1][1].split("-"),
                            hours = Number(end[0]),
                            minutes = Number(end[1]),
                            seconds = Number(end[2]);

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

                        previousPeriod_end =
                            this.padNumber(hours) +
                            this.padNumber(minutes) +
                            this.padNumber(seconds);
                    }

                    if (Number(period_start).toString() == previousPeriod_end) {
                        this.nextPeriodRaw = [_period, period];
                        nextPeriod = [_period, period];
                    }
                }
                if (!nextPeriod) {
                    this.nextPeriodRaw = ["No Period", ""];
                }
            } else {
                if (!nextPeriod) {
                    this.nextPeriodRaw = ["No Periods Today", ""];
                }
            }
        },
        updateTimes: function() {
            const d = new Date();

            this.currentDay = d
                .toLocaleDateString("en-us", { weekday: "short" })
                .toUpperCase();

            this.currentTime =
                this.padNumber(d.getHours().toString()) +
                this.padNumber(d.getMinutes().toString());
            this.currentSplitTime =
                this.padNumber(d.getHours().toString()) +
                "-" +
                this.padNumber(d.getMinutes().toString()) +
                "-" +
                this.padNumber(d.getSeconds().toString());

            /*
            this.currentTime = "1252";
            this.currentSplitTime = "12-52-33";
            */

            this.currentPrettyDateTime.day = d.toLocaleDateString("en-us", {
                weekday: "long"
            });
            this.currentPrettyDateTime.time = d.toLocaleString("en-us", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: !this.$twenty_four_hour_time
            });
        },
        padNumber: function(number) {
            return Number(number < 10)
                ? "0" + Number(number).toString()
                : Number(number).toString();
        },
        showToast: function(content, type) {
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
        notificationPermissionsCallback: function(result) {
            if (result != "granted") {
                this.showToast(
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
