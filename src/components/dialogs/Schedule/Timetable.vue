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

<script>
export default {
    name: "Timetable",
    props: {
        daySchedule: {
            type: Object,
            required: true,
            default: function() {
                return {};
            }
        },
        schedulePeriods: {
            type: Array,
            required: true,
            default: function() {
                return [];
            }
        }
    },
    computed: {
        calendarFirstTime: function() {
            return typeof this.daySchedule !== "undefined"
                ? this.daySchedule[Object.keys(this.daySchedule)[0]][0].split(
                      "-"
                  )[0] + "00"
                : "08:00";
        },
        calendarIntervalCount: function() {
            if (typeof this.daySchedule !== "undefined") {
                let endTimes = this.daySchedule[
                        Object.keys(this.daySchedule).slice(-1)[0]
                    ][1].split("-"),
                    startTimeHour = Number(
                        this.daySchedule[
                            Object.keys(this.daySchedule)[0]
                        ][0].split("-")[0]
                    ),
                    endTimeHour;

                endTimeHour =
                    Number(endTimes[1]) !== 0
                        ? Number(endTimes[0]) + 1
                        : Number(endTimes[0]);

                return endTimeHour - startTimeHour;
            } else {
                return null;
            }
        }
    }
};
</script>
