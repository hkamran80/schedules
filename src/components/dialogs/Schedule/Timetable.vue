<template>
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
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: {
        daySchedule: {
            type: Object,
            required: true,
            default: function() {
                return {};
            },
        },
        schedulePeriods: {
            type: Array,
            required: true,
            default: function() {
                return [];
            },
        },
    },
    computed: {
        calendarFirstTime() {
            return typeof this.daySchedule !== "undefined"
                ? this.daySchedule[Object.keys(this.daySchedule)[0]][0].split(
                      "-"
                  )[0] + "00"
                : "08:00";
        },
        calendarIntervalCount() {
            if (typeof this.daySchedule !== "undefined") {
                const endTimes = this.daySchedule[
                        Object.keys(this.daySchedule).slice(-1)[0]
                    ][1].split("-"),
                    startTimeHour = Number(
                        this.daySchedule[
                            Object.keys(this.daySchedule)[0]
                        ][0].split("-")[0]
                    );

                const endTimeHour =
                    Number(endTimes[1]) !== 0
                        ? Number(endTimes[0]) + 1
                        : Number(endTimes[0]);

                return endTimeHour - startTimeHour;
            } else {
                return null;
            }
        },
    },
});
</script>
