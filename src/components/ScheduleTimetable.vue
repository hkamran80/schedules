<template>
    <v-calendar
        color="primary"
        type="day"
        :events="periods"
        :first-time="firstEventStart"
        :short-weekdays="false"
        :event-ripple="false"
        :event-height="60"
        :event-margin-bottom="5"
        :interval-count="intervalCount"
        :interval-height="150"
    />
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";

import { getTimetablePeriods } from "@/constructs/schedule";

import { ScheduleTimes } from "@/structures/schedule";
import { PeriodNames } from "@/structures/periods";

export default defineComponent({
    props: {
        daySchedule: {
            type: Object as () => ScheduleTimes,
            required: true,
            default: function() {
                return {};
            },
        },
        periodNames: {
            type: Object as () => PeriodNames,
            required: true,
            default: function() {
                return {};
            },
        },
        color: {
            type: String,
            required: true,
            default: function() {
                return "blue";
            },
        },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(props: any) {
        const periods = getTimetablePeriods(
            props.daySchedule,
            props.periodNames,
            props.color,
            true
        );

        const firstEventStart = computed(() =>
            typeof props.daySchedule !== "undefined"
                ? props.daySchedule[Object.keys(props.daySchedule)[0]][0].split(
                      "-"
                  )[0] + "00"
                : "08:00"
        );
        const intervalCount = computed(() => {
            if (typeof props.daySchedule !== "undefined") {
                const endTimes = props.daySchedule[
                        Object.keys(props.daySchedule).slice(-1)[0]
                    ][1].split("-"),
                    startTimeHour = Number(
                        props.daySchedule[
                            Object.keys(props.daySchedule)[0]
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
        });

        return { periods, firstEventStart, intervalCount };
    },
});
</script>
