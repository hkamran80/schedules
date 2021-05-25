<template>
    <center-layout>
        <utds-header
            :title="schedules[this.$route.params.id].name"
            :subtitle="prettyDateAndTime"
        >
            <template v-slot:icons>
                <v-btn
                    icon
                    color="primary"
                    title="Toggle Debug Mode"
                    aria-label="Toggle Debug Mode"
                    v-if="$edgeMode || $developmentMode"
                    @click="toggleDebugMode"
                >
                    <v-icon v-text="mdiConsoleLine" />
                </v-btn>
                <v-btn
                    icon
                    color="primary"
                    title="Open Timetable"
                    aria-label="Open Timetable"
                    :disabled="schedulePeriods.length === 0"
                    @click="timetable = true"
                >
                    <v-icon v-text="mdiCalendarOutline" />
                </v-btn>
                <v-btn
                    icon
                    color="primary"
                    title="Open Schedule Preferences"
                    aria-label="Open Schedule Preferences"
                    @click="settingsDialog = true"
                >
                    <v-icon v-text="mdiCogOutline" />
                </v-btn>
            </template>
        </utds-header>

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
                <v-card-title>
                    <v-spacer />
                    <v-btn icon color="primary" @click="timetable = false">
                        <v-icon v-text="mdiClose" />
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <timetable
                        :daySchedule="schedule[currentDay]"
                        :schedulePeriods="schedulePeriods"
                        @close="closeDialogs"
                    />
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="periodNamesEditDialog" width="750" scrollable>
            <v-card class="mx-auto">
                <v-card-title>
                    <v-row align="center">
                        <v-col class="text-wrap--break">
                            Edit Period Names
                        </v-col>
                        <v-col cols="4" class="text-right">
                            <v-btn
                                icon
                                color="primary"
                                @click="savePeriodNames"
                            >
                                <v-icon v-text="mdiContentSaveOutline" />
                            </v-btn>
                            <v-btn
                                icon
                                color="primary"
                                @click="periodNamesEditDialog = false"
                            >
                                <v-icon v-text="mdiClose" />
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
                    Settings
                    <v-spacer />
                    <v-btn icon color="primary" @click="settingsDialog = false">
                        <v-icon v-text="mdiClose" />
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    <v-select
                        v-model="currentDayUserOverride"
                        label="Day Override"
                        hint="The override will get reset if you reload the page"
                        outlined
                        clearable
                        persistent-hint
                        class="mt-3"
                        :items="possibleDays"
                        item-text="long"
                        item-value="short"
                    />

                    <v-divider class="mb-4" />

                    <div class="mb-5">
                        <h3 class="mb-5">
                            Period Names
                        </h3>

                        <v-btn
                            block
                            color="primary"
                            class="mb-3"
                            @click="openPeriodNameEditDialog"
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

                    <v-divider class="mb-4" />

                    <div class="mb-5">
                        <h3 class="mb-5">
                            Notifications
                        </h3>

                        <v-btn
                            block
                            color="primary"
                            class="mb-3"
                            @click="openNotificationEditDialog"
                        >
                            Edit
                        </v-btn>
                        <v-btn
                            block
                            color="primary"
                            class="mb-3"
                            @click="notificationSettingsImport.dialog = true"
                        >
                            Import
                        </v-btn>
                        <v-btn
                            block
                            color="primary"
                            @click="notificationSettingsExportDialog = true"
                        >
                            Export
                        </v-btn>
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
                            <v-btn
                                icon
                                color="primary"
                                @click="copyExportedPeriodNames"
                            >
                                <v-icon v-text="mdiContentCopy" />
                            </v-btn>
                            <v-btn
                                icon
                                color="primary"
                                @click="periodNamesExportDialog = false"
                            >
                                <v-icon v-text="mdiClose" />
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
                                color="primary"
                                @click="importPeriodNamesString"
                                :disabled="
                                    periodNamesImport.string === null ||
                                        periodNamesImport.string === ''
                                "
                            >
                                <v-icon v-text="mdiCalendarImport" />
                            </v-btn>
                            <v-btn
                                icon
                                color="primary"
                                @click="periodNamesImport.dialog = false"
                            >
                                <v-icon v-text="mdiClose" />
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

        <v-dialog
            v-model="notificationSettingsEditDialog"
            width="750"
            scrollable
        >
            <v-card class="mx-auto">
                <v-card-title>
                    <v-row align="center">
                        <v-col class="text-wrap--break">
                            Edit Notification Settings
                        </v-col>
                        <v-col cols="1" class="text-right">
                            <v-btn
                                icon
                                color="primary"
                                @click="notificationSettingsEditDialog = false"
                            >
                                <v-icon v-text="mdiClose" />
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-progress-linear
                        color="primary lighten-1"
                        background-color="primary lighten-4"
                        indeterminate
                        v-if="
                            Object.keys(this.allowedNotifications.periods)
                                .length === 0
                        "
                    />

                    <div
                        v-if="
                            Object.keys(this.allowedNotifications.periods)
                                .length !== 0
                        "
                    >
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
                                Time Remaining
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
                                        .replace(/([A-Z]+)/g, ' $1')
                                        .replace(/([A-Z][a-z])/g, ' $1')
                                        .replace(/(^|\s)\S/g, t =>
                                            t.toUpperCase()
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

        <v-dialog v-model="notificationSettingsExportDialog" width="750">
            <v-card class="mx-auto">
                <v-card-title>
                    <v-row align="center">
                        <v-col class="text-wrap--break">
                            Export Notification Settings
                        </v-col>
                        <v-col cols="4" class="text-right">
                            <v-btn
                                icon
                                color="primary"
                                @click="copyExportedNotificationSettings"
                            >
                                <v-icon v-text="mdiContentCopy" />
                            </v-btn>
                            <v-btn
                                icon
                                color="primary"
                                @click="
                                    notificationSettingsExportDialog = false
                                "
                            >
                                <v-icon v-text="mdiClose" />
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-textarea
                        id="exportNotificationsString"
                        v-model="exportNotificationsString"
                        rows="8"
                        readonly
                        outlined
                        label="Notification Settings String"
                    />
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="notificationSettingsImport.dialog" width="750">
            <v-card class="mx-auto">
                <v-card-title>
                    <v-row align="center">
                        <v-col class="text-wrap--break">
                            Import Notification Settings
                        </v-col>
                        <v-col cols="4" class="text-right">
                            <v-btn
                                icon
                                color="primary"
                                @click="importNotificationSettingsString"
                                :disabled="
                                    notificationSettingsImport.string ===
                                        null ||
                                        notificationSettingsImport.string === ''
                                "
                            >
                                <v-icon v-text="mdiCalendarImport" />
                            </v-btn>
                            <v-btn
                                icon
                                color="primary"
                                @click="
                                    notificationSettingsImport.dialog = false
                                "
                            >
                                <v-icon v-text="mdiClose" />
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-textarea
                        v-model="notificationSettingsImport.string"
                        rows="8"
                        outlined
                        label="Notification Settings String"
                    />
                </v-card-text>
            </v-card>
        </v-dialog>

        <div v-if="debugMode">
            <v-divider />
            <v-card class="mx-auto" outlined>
                <v-card-text v-text="`${currentDay} - ${currentSplitTime}`" />
                <v-divider />
                <v-card-text v-text="currentPeriodRaw" />
                <v-divider />
                <v-card-text v-text="nextPeriodRaw" />
            </v-card>
            <v-btn text block @click="debugFunction">
                Debug Function
            </v-btn>
        </div>
    </center-layout>
</template>

<script>
import CenterLayout from "@/components/CenterLayout.vue";
import UtdsHeader from "@/components/utds/UtdsHeader.vue";
import {
    mdiConsoleLine,
    mdiCalendarOutline,
    mdiCogOutline,
    mdiContentSaveOutline,
    mdiClose,
    mdiContentCopy,
    mdiCalendarImport
} from "@mdi/js";
import {
    days as shortLongDays,
    padNumber,
    calculateTimeDifference,
    shortenedDayStringToLong,
    getShortDay
} from "@/helper-functions.js";

const Timetable = () => import("@/components/dialogs/Schedule/Timetable.vue");

export default {
    name: "Schedule",
    props: {
        schedules: {
            type: Object,
            required: true,
            default: function() {
                return {};
            }
        }
    },
    components: { CenterLayout, UtdsHeader, Timetable },
    data() {
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
            currentDayUserOverride: null,
            currentTime: "",
            currentSplitTime: "",
            currentPrettyDateTime: {
                day: null,
                time: null
            },
            possibleDays: Object.entries(shortLongDays)
                .filter(
                    day =>
                        Object.keys(
                            this.schedules[this.$route.params.id].schedule
                        ).indexOf(day[0]) !== -1
                )
                .map(day => {
                    return {
                        short: day[0],
                        long: day[1],
                        disabled: day[0] === getShortDay()
                    };
                }),

            // Settings
            settingsDialog: false,

            // Period Editing Functionality
            periodNamesScheduleId: "",
            periodNames: {},
            periodNamesEditDialog: false,
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
            notificationSettingsEditDialog: false,
            notificationSettingsImport: {
                dialog: false,
                string: null
            },
            notificationSettingsExportDialog: false,

            mainInterval: null,
            debugMode: this.$route.query.debug === "true",

            // Icons
            mdiConsoleLine: mdiConsoleLine,
            mdiCalendarOutline: mdiCalendarOutline,
            mdiCogOutline: mdiCogOutline,
            mdiContentSaveOutline: mdiContentSaveOutline,
            mdiClose: mdiClose,
            mdiContentCopy: mdiContentCopy,
            mdiCalendarImport: mdiCalendarImport
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
        prettyDateAndTime() {
            if (
                this.currentPrettyDateTime.day !== null &&
                this.currentPrettyDateTime.time !== null &&
                this.currentDayUserOverride === null
            ) {
                return `${this.currentPrettyDateTime.day} - ${this.currentPrettyDateTime.time}`;
            } else if (
                this.currentPrettyDateTime.day !== null &&
                this.currentPrettyDateTime.time !== null &&
                this.currentDayUserOverride !== null
            ) {
                return `${
                    this.currentPrettyDateTime.day
                } (${shortenedDayStringToLong(this.currentDayUserOverride) ||
                    this.currentDayUserOverride} schedule) - ${
                    this.currentPrettyDateTime.time
                }`;
            } else {
                return "";
            }
        },
        currentDayOrOverride() {
            return this.currentDayUserOverride !== null
                ? this.currentDayUserOverride
                : this.currentDay;
        },
        schedule: function() {
            return this.schedules[this.$route.params.id].schedule;
        },
        color: function() {
            return this.schedules[this.$route.params.id].color;
        },
        icon: function() {
            return this.schedules[this.$route.params.id].icon;
        },
        schedulePeriods: function() {
            let periods = [];
            if (
                typeof this.schedule[this.currentDayOrOverride] !== "undefined"
            ) {
                let daySchedule = this.schedule[this.currentDayOrOverride],
                    d = new Date(),
                    date = `${d.getFullYear()}-${padNumber(
                        Number(d.getMonth()) + 1
                    )}-${padNumber(d.getDate())}`;

                periods = Object.keys(daySchedule).map(period => {
                    return {
                        name: this.checkForCustomPeriodName(period, true),
                        start: `${date} ${daySchedule[period][0].replaceAll(
                            "-",
                            ":"
                        )}`,
                        end: `${date} ${daySchedule[period][1].replaceAll(
                            "-",
                            ":"
                        )}`,
                        color:
                            period.indexOf("Passing") === -1
                                ? this.color
                                : "primary"
                    };
                });
            }

            return periods;
        },
        exportPeriodNamesString: function() {
            return JSON.stringify(this.periodNames);
        },
        exportNotificationsString: function() {
            return JSON.stringify(this.allowedNotifications);
        }
    },
    methods: {
        importNotificationSettingsString: function() {
            try {
                let notificationSettingsImportString = JSON.parse(
                    this.notificationSettingsImport.string
                );

                let rootKeys = Object.keys(this.allowedNotifications),
                    intervalKeys = Object.keys(
                        this.allowedNotifications.intervals
                    ),
                    dayKeys = Object.keys(this.allowedNotifications.days),
                    periodKeys = Object.keys(this.allowedNotifications.periods);

                // Root key match
                if (
                    Object.keys(notificationSettingsImportString)
                        .map(key => rootKeys.indexOf(key))
                        .filter(keyIndex => keyIndex === -1).length === 0
                ) {
                    let intervalKeyMatch =
                            Object.keys(
                                notificationSettingsImportString.intervals
                            )
                                .map(key => intervalKeys.indexOf(key))
                                .filter(keyIndex => keyIndex === -1).length ===
                            0,
                        daysKeyMatch =
                            Object.keys(notificationSettingsImportString.days)
                                .map(key => dayKeys.indexOf(key))
                                .filter(keyIndex => keyIndex === -1).length ===
                            0,
                        periodsKeyMatch =
                            Object.keys(
                                notificationSettingsImportString.periods
                            )
                                .map(key => periodKeys.indexOf(key))
                                .filter(keyIndex => keyIndex === -1).length ===
                            0,
                        typeCheck =
                            Object.values(notificationSettingsImportString)
                                .map(rootValue =>
                                    Object.values(rootValue).map(
                                        keyValue => typeof keyValue
                                    )
                                )
                                .flat()
                                .filter(type => type !== "boolean").length ===
                            0;

                    if (
                        intervalKeyMatch &&
                        daysKeyMatch &&
                        periodsKeyMatch &&
                        typeCheck
                    ) {
                        this.allowedNotifications = notificationSettingsImportString;

                        localStorage.setItem(
                            `allowedNotifications.${this.$route.params.id}`,
                            JSON.stringify(this.allowedNotifications)
                        );

                        this.notificationSettingsImport.string = null;
                        this.notificationSettingsImport.dialog = false;
                        this.notificationSettingsEditDialog = false;

                        this.showToast(
                            "Successfully imported notification settings!",
                            "success"
                        );
                    } else {
                        this.showToast(
                            "One of the key/value pairs is incorrect. Please copy and paste the exported notification settings from Schedules.",
                            "error"
                        );
                    }
                } else {
                    this.showToast(
                        "One of the root keys is incorrect. Please copy and paste the exported notification settings from Schedules.",
                        "error"
                    );
                }
            } catch (e) {
                this.showToast(
                    "Unable to import notification settings. An error occurred when parsing. Try again.",
                    "error"
                );
            }
        },
        copyExportedNotificationSettings: function() {
            let exportedNotificationSettingsElement = document.getElementById(
                "exportNotificationsString"
            );
            exportedNotificationSettingsElement.select();
            document.execCommand("copy");

            this.showToast(
                "Copied notification settings to the clipboard",
                "info"
            );

            this.notificationSettingsExportDialog = false;
        },
        openNotificationEditDialog: function() {
            this.loadAllowedNotifications();
            this.notificationSettingsEditDialog = true;
        },
        closeDialogs: function() {
            this.timetable = false;
        },
        loadAllowedNotifications: function() {
            let allowedNotifications = localStorage.getItem(
                `allowedNotifications.${this.$route.params.id}`
            );

            if (allowedNotifications !== null) {
                this.allowedNotifications = JSON.parse(allowedNotifications);
            }

            if (Object.keys(this.allowedNotifications.periods).length === 0) {
                this.allowedNotifications.periods = Object.fromEntries(
                    Object.values(this.schedule)
                        .map(day =>
                            Object.keys(day).map(day_schedule => [
                                day_schedule,
                                true
                            ])
                        )
                        .flat()
                );
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
                let periodNamesImportString = JSON.parse(
                    this.periodNamesImport.string
                );

                this.getPeriodNames();
                let periodNameKeys = Object.keys(this.periodNames),
                    periodNameMatch =
                        Object.keys(periodNamesImportString)
                            .map(periodName =>
                                periodNameKeys.indexOf(periodName)
                            )
                            .filter(nameIndex => nameIndex === -1).length === 0;

                if (periodNameMatch) {
                    this.periodNames = periodNamesImportString;
                    localStorage.setItem(
                        `schedule.${this.$route.params.id}`,
                        JSON.stringify(periodNamesImportString)
                    );

                    this.periodNamesImport.string = null;
                    this.periodNamesImport.dialog = false;
                    this.periodNamesEditDialog = false;

                    this.showToast(
                        "Successfully imported period names!",
                        "success"
                    );
                } else {
                    this.showToast(
                        "One of the period keys is incorrect. Please copy and paste the exported period names from Schedules.",
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
            let exportedPeriodNamesElement = document.getElementById(
                "exportPeriodNamesString"
            );
            exportedPeriodNamesElement.select();
            document.execCommand("copy");

            this.showToast("Copied period names to the clipboard", "info");

            this.periodNamesExportDialog = false;
        },
        debugFunction: function() {
            console.debug("Development function called");
            console.debug(Object.keys(this.schedule));
        },
        checkForCustomPeriodName: function(periodName, withPeriod = false) {
            this.getPeriodNames();

            if (
                typeof this.periodNames[periodName] === "undefined" ||
                this.periodNames[periodName] === ""
            ) {
                return periodName;
            } else {
                return withPeriod
                    ? `${this.periodNames[periodName]} (${periodName})`
                    : this.periodNames[periodName];
            }
        },
        openPeriodNameEditDialog: function() {
            this.getPeriodNames();
            this.periodNamesEditDialog = true;
        },
        savePeriodNames: function() {
            localStorage.setItem(
                `schedule.${this.$route.params.id}`,
                JSON.stringify(this.periodNames)
            );
            this.periodNamesEditDialog = false;
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

                let compiledTimeDifference;
                var timeDifference;
                if (this.currentPeriodRaw[1] !== "") {
                    let scheduledEnd = this.currentPeriodRaw[1][1].toString();

                    timeDifference = calculateTimeDifference(
                        this.currentSplitTime,
                        scheduledEnd
                    );

                    if (timeDifference[0] === 0) {
                        if (timeDifference[1] === 0) {
                            compiledTimeDifference =
                                "00:00:" + padNumber(timeDifference[2]);
                        } else {
                            compiledTimeDifference =
                                timeDifference[2] === 0
                                    ? "00:" +
                                      padNumber(timeDifference[1]) +
                                      ":00"
                                    : "00:" +
                                      padNumber(timeDifference[1]) +
                                      ":" +
                                      padNumber(timeDifference[2]);
                        }
                    } else {
                        compiledTimeDifference =
                            padNumber(timeDifference[0]) +
                            ":" +
                            padNumber(timeDifference[1]) +
                            ":" +
                            padNumber(timeDifference[2]);
                    }
                } else {
                    compiledTimeDifference = "";
                    timeDifference = "";
                }
                this.timeRemaining = compiledTimeDifference;

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

                if (timeDifference) {
                    this.scheduledNotifications(timeDifference);
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
                let nextPeriodStartTimeString;

                // FIXME: Add 24-hour time variable
                if (!this.$twenty_four_hour_time) {
                    let nextPeriodStartTimeHour = Number(
                        this.nextPeriodRaw[1][0].split("-").slice(0, 1)
                    );

                    let hourString =
                        nextPeriodStartTimeHour > 12
                            ? (nextPeriodStartTimeHour - 12).toString()
                            : nextPeriodStartTimeHour.toString();

                    let nextPeriodStartTime =
                        hourString +
                        ":" +
                        this.nextPeriodRaw[1][0].split("-").slice(1, 2);
                    let nextPeriodStartTimeTwelveHour =
                        nextPeriodStartTimeHour >= 12 ? "PM" : "AM";

                    nextPeriodStartTimeString =
                        nextPeriodStartTime +
                        " " +
                        nextPeriodStartTimeTwelveHour;
                } else {
                    nextPeriodStartTimeString = this.nextPeriodRaw[1][0]
                        .split("-")
                        .slice(0, 2)
                        .join(":");
                }
                this.nextPeriodStarting = nextPeriodStartTimeString;
            }
        },
        scheduledNotifications: function(timeDifference) {
            let notificationTitle =
                this.schedules[this.$route.params.id].shortName +
                " - " +
                this.currentPeriod;

            if (
                this.allowedNotifications.days[
                    this.currentPrettyDateTime.day.toLowerCase()
                ] &&
                this.allowedNotifications.periods[this.currentPeriod]
            ) {
                if (Number(timeDifference[0]) === 0) {
                    let minutesRemaining = Number(timeDifference[1]);
                    if (Number(timeDifference[2]) == 0) {
                        if (
                            minutesRemaining === 30 &&
                            !this.notifications.thirtyMinute &&
                            this.allowedNotifications.intervals.thirtyMinute
                        ) {
                            this.notify(
                                notificationTitle,
                                "Thirty minutes remaining"
                            );
                            this.notifications.thirtyMinute = true;
                        } else if (
                            minutesRemaining === 15 &&
                            !this.notifications.fifteenMinute &&
                            this.allowedNotifications.intervals.fifteenMinute
                        ) {
                            this.notify(
                                notificationTitle,
                                "Fifteen minutes remaining"
                            );
                            this.notifications.fifteenMinute = true;
                        } else if (
                            minutesRemaining === 10 &&
                            !this.notifications.tenMinute &&
                            this.allowedNotifications.intervals.tenMinute
                        ) {
                            this.notify(
                                notificationTitle,
                                "Ten minutes remaining"
                            );
                            this.notifications.tenMinute = true;
                        } else if (
                            minutesRemaining === 5 &&
                            !this.notifications.fiveMinute &&
                            this.allowedNotifications.intervals.fiveMinute
                        ) {
                            this.notify(
                                notificationTitle,
                                "Five minutes remaining"
                            );
                            this.notifications.fiveMinute = true;
                        } else if (
                            minutesRemaining === 1 &&
                            !this.notifications.oneMinute &&
                            this.allowedNotifications.intervals.oneMinute
                        ) {
                            this.notify(
                                notificationTitle,
                                "One minute remaining"
                            );
                            this.notifications.oneMinute = true;
                        }
                    } else if (
                        minutesRemaining === 0 &&
                        Number(timeDifference[2]) === 0 &&
                        !this.notifications.thirtySecond &&
                        this.allowedNotifications.intervals.thirtySecond
                    ) {
                        this.notify(
                            notificationTitle,
                            "Thirty seconds remaining"
                        );
                        this.notifications.thirtySecond = true;
                    }
                } else if (
                    Number(timeDifference[0]) === 1 &&
                    Number(timeDifference[1]) === 0 &&
                    Number(timeDifference[2]) === 0 &&
                    !this.notifications.oneHour &&
                    this.allowedNotifications.intervals.oneHour
                ) {
                    this.notify(notificationTitle, "One hour remaining");
                    this.notifications.oneHour = true;
                }
            }
        },
        getCurrentPeriod: function() {
            var currentPeriod = false;
            if (
                typeof this.schedule[this.currentDayOrOverride] !== "undefined"
            ) {
                var daySchedule = this.schedule[this.currentDayOrOverride],
                    splitTime = this.currentSplitTime.split("-").join("");

                Object.keys(daySchedule).forEach(periodName => {
                    let periodTimes = daySchedule[periodName],
                        periodStartTime = periodTimes[0].replaceAll("-", ""),
                        periodEndTime = periodTimes[1].replaceAll("-", "");

                    if (
                        periodStartTime <= splitTime &&
                        splitTime <= periodEndTime
                    ) {
                        this.currentPeriodRaw = [periodName, periodTimes];
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

            if (
                typeof this.schedule[this.currentDayOrOverride] !== "undefined"
            ) {
                var daySchedule = this.schedule[this.currentDayOrOverride];
                for (var _period in daySchedule) {
                    var period = daySchedule[_period],
                        periodStartTime = period[0].split("-").join("");

                    let previousPeriodEndTime;
                    if (this.currentPeriodRaw[1][1].split("-")[2] !== "59") {
                        previousPeriodEndTime = (
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

                        previousPeriodEndTime =
                            padNumber(hours) +
                            padNumber(minutes) +
                            padNumber(seconds);
                    }

                    if (
                        Number(periodStartTime).toString() ==
                        previousPeriodEndTime
                    ) {
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
                padNumber(d.getHours().toString()) +
                padNumber(d.getMinutes().toString());
            this.currentSplitTime =
                padNumber(d.getHours().toString()) +
                "-" +
                padNumber(d.getMinutes().toString()) +
                "-" +
                padNumber(d.getSeconds().toString());

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
        showToast: function(content, type) {
            // TODO: Switch to native Vuetify snackbar
            let toastOptions = {
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
                    this.$toast.warning(content, toastOptions);
                    break;
                case "success":
                    this.$toast.success(content, toastOptions);
                    break;
                case "info":
                    this.$toast.info(content, toastOptions);
                    break;
                case "error":
                    this.$toast.error(content, toastOptions);
                    break;
                default:
                    this.$toast(content, toastOptions);
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
        notify: function(title, body) {
            this.$notification.show(
                title,
                {
                    body: body,
                    icon: `/img/icons/${this.icon}.192.png`,
                    badge: `/img/icons/${this.icon}.96.png`
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
