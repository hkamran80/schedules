<template>
    <utds-layout>
        <utds-header
            :title="schedules[this.scheduleId].name"
            :subtitle="prettyDateAndTime"
            :subtitleTooltip="
                userOverridenDay !== null
                    ? `Override resets at ${overrideExpirationTime}`
                    : ''
            "
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
                    v-text="
                        `${currentPeriod.name} - ${currentPeriod.timeRemaining}`
                    "
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

        <div v-if="debugMode">
            <v-divider />
            <v-btn text block @click="debugFunction">
                Debug Function
            </v-btn>
        </div>
    </utds-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { UtdsCenterLayout, UtdsHeader } from "utds-component-library";
import {
    mdiConsoleLine,
    mdiCalendarOutline,
    mdiCogOutline,
    mdiContentSaveOutline,
    mdiClose,
    mdiContentCopy,
    mdiCalendarImport,
} from "@mdi/js";
import { requestPermission } from "@/notifications";

import { Schedule, ScheduleDays, ScheduleTimes } from "@/structures/schedule";
import { Period, PeriodNames } from "@/structures/periods";
import {
    AllowedNotifications,
    NotificationIntervals,
} from "@/structures/notifications";

import {
    checkForCustomPeriodName,
    getCurrentPeriod,
    getNextPeriod,
    loadPeriodNames,
} from "@/constructs/periods";
import { loadAllowedNotifications } from "@/constructs/notifications";
import {
    getDayOverride,
    getTimes,
    getTwentyFourHourStatus,
} from "@/constructs/datetime";
import { PrettyDayTime } from "@/structures/datetime";
import { Nullable } from "@/structures/types";
import { calculateTimeDifference, padNumber } from "@/constructs/calculations";

export default Vue.extend({
    props: {
        schedules: {
            type: Object as () => Schedule,
            required: true,
            default: function() {
                return {};
            },
        },
    },
    components: { UtdsCenterLayout, UtdsHeader },
    data() {
        return {
            // Periods
            currentPeriod: null as Nullable<Period>,
            currentPeriodName: null as Nullable<string>,
            timeRemaining: null as Nullable<string>,
            nextPeriod: null as Nullable<Period>,
            nextPeriodName: null as Nullable<string>,
            nextPeriodStarting: null as Nullable<string>,

            // Period Difference
            previousPeriodName: null as Nullable<string>,
            differentPeriod: false,

            // Period Names
            periodNames: {} as PeriodNames,

            // Notifications
            notifications: {
                oneHour: false,
                thirtyMinute: false,
                fifteenMinute: false,
                tenMinute: false,
                fiveMinute: false,
                oneMinute: false,
                thirtySecond: false,
            } as NotificationIntervals,
            allowedNotifications: {
                intervals: {},
                days: {},
                periods: {},
            } as AllowedNotifications,

            // Date and Time
            twentyFourHourStatus: getTwentyFourHourStatus(),
            day: null as Nullable<string>,
            time: null as Nullable<string>,
            splitTime: null as Nullable<string>,
            prettyDayTime: {
                day: null as Nullable<string>,
                time: null as Nullable<string>,
            } as PrettyDayTime,
            userOverridenDay: null as Nullable<string>,

            // Development
            debugMode: this.$route.query.debug === "true",

            // Intervals
            mainInterval: null as Nullable<number>,

            // Icons
            mdiConsoleLine,
            mdiCalendarOutline,
            mdiCogOutline,
            mdiContentSaveOutline,
            mdiClose,
            mdiContentCopy,
            mdiCalendarImport,
        };
    },
    computed: {
        scheduleId(): string {
            return this.$route.params.id;
        },
        schedule(): ScheduleDays {
            return this.schedules[this.scheduleId].schedule;
        },
        color(): string {
            return this.schedules[this.scheduleId].color;
        },
        icon(): string {
            return this.schedules[this.scheduleId].icon;
        },
        currentDay(): string {
            return this.userOverridenDay
                ? this.userOverridenDay
                : this.day
                ? this.day
                : "MON";
        },
        daySchedule(): ScheduleTimes {
            return this.schedule[this.currentDay];
        },
    },
    created() {
        if (typeof this.schedules[this.scheduleId] === "undefined") {
            this.$router.push({
                name: "Home",
                query: { notFound: this.$route.path },
            });
        }
    },
    mounted() {
        if (Notification.permission === "default") {
            requestPermission();
        }

        const periodNames = loadPeriodNames(
            this.periodNames,
            this.scheduleId,
            this.schedules[this.scheduleId].schedule
        );
        this.periodNames = periodNames ? periodNames : ({} as PeriodNames);

        this.allowedNotifications = loadAllowedNotifications(
            this.scheduleId,
            this.schedule,
            this.allowedNotifications
        );

        this.mainInterval = setInterval(this.main, 1000);
    },
    destroyed() {
        if (this.mainInterval) {
            clearInterval(this.mainInterval);
            this.mainInterval = null;
        }
    },
    methods: {
        main(): void {
            this.getNewTimes();

            this.currentPeriod = getCurrentPeriod(
                this.daySchedule,
                this.splitTime || "13-05-00"
            );

            this.getDayOverride();

            if (this.currentPeriod) {
                console.debug(
                    "Time difference and next period calculations here..."
                );

                this.currentPeriodName = checkForCustomPeriodName(
                    this.currentPeriod.name,
                    this.periodNames,
                    true
                );

                this.differentPeriod =
                    this.currentPeriod.name === this.previousPeriodName;
                this.previousPeriodName = this.currentPeriod.name;

                this.nextPeriod = getNextPeriod(
                    this.daySchedule,
                    this.currentPeriod.times?.end || "13-05-00"
                );

                const timeRemaining = calculateTimeDifference(
                    this.splitTime || "13-05-00",
                    this.currentPeriod.times?.end || "13-05-00"
                );

                this.timeRemaining =
                    padNumber(timeRemaining.hours) +
                    ":" +
                    padNumber(timeRemaining.minutes) +
                    ":" +
                    padNumber(timeRemaining.seconds);

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

                if (timeRemaining) {
                    console.debug(
                        "Error: Notifications are not currently support"
                    );
                }
            }
        },
        notifySchedule(notificationIntervals: NotificationIntervals): void {
            const notificationTitle = `${
                this.schedules[this.scheduleId].shortName
            } - ${this.currentPeriodName}`;if(this.allowedNotifications.days[this.])
        },
        debugFunction(): void {
            console.debug(this.periodNames);
            console.debug(this.allowedNotifications);
        },
        toggleDebugMode(): void {
            this.debugMode = !this.debugMode;

            if (this.debugMode === true) {
                this.$router.replace({
                    name: "Schedule",
                    params: { id: this.scheduleId },
                    query: { debug: "true" },
                });
            } else {
                this.$router.replace({
                    name: "Schedule",
                    params: { id: this.scheduleId },
                });
            }
        },
        getNewTimes(): void {
            const { day, time, splitTime, prettyDayTime } = getTimes(
                this.twentyFourHourStatus
            );

            this.day = day;
            this.time = time;
            this.splitTime = splitTime;
            this.prettyDayTime = prettyDayTime;
        },
        getDayOverride(): void {
            const dayOverride = getDayOverride(
                this.scheduleId,
                this.time || "130400",
                this.userOverridenDay
            );

            if (dayOverride.constructor === String) {
                this.userOverridenDay = dayOverride;
            } else {
                this.userOverridenDay = null;
            }
        },
    },
});
</script>

<style scoped>
div.v-card {
    padding: 0 5px;
    margin: 10px 0;
    overflow-wrap: break-word;
}
</style>
