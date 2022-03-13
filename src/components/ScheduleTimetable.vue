<template>
    <v-card>
        <v-card-title>
            <v-spacer />

            <v-btn
                icon
                color="primary"
                title="Close dialog"
                aria-label="Close dialog"
                @click="closeDialog"
            >
                <v-icon v-text="mdiClose" />
            </v-btn>
        </v-card-title>

        <v-card-text>
            <v-calendar
                color="primary"
                type="day"
                :events="periods"
                :first-time="firstEventStart"
                :short-weekdays="false"
                :event-ripple="false"
                :event-height="75"
                :event-margin-bottom="5"
                :interval-count="intervalCount"
                :interval-height="200"
            />
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, SetupContext } from "@vue/composition-api";
import { mdiClose } from "@mdi/js";

import { getPeriodTimes, getTimetablePeriods } from "@/constructs/schedule";

import { SchedulePeriodTimes } from "@/models/schedule";
import { PeriodNames } from "@/models/periods";

export default defineComponent({
    props: {
        daySchedule: {
            type: Object as () => SchedulePeriodTimes,
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
    setup(props: any, { emit }: SetupContext) {
        const periods = getTimetablePeriods(
            props.daySchedule,
            props.periodNames,
            props.color,
            true
        );

        const firstEventStart = computed(() => {
            if (typeof props.daySchedule !== "undefined") {
                return (
                    getPeriodTimes(
                        props.daySchedule[Object.keys(props.daySchedule)[0]]
                    )[0].split("-")[0] + "00"
                );
            } else {
                return "08:00";
            }
        });
        const intervalCount = computed(() => {
            if (typeof props.daySchedule !== "undefined") {
                const endPeriod =
                        props.daySchedule[
                            Object.keys(props.daySchedule).slice(-1)[0]
                        ],
                    startPeriod =
                        props.daySchedule[Object.keys(props.daySchedule)[0]];

                const endTimes = getPeriodTimes(endPeriod)[1].split("-"),
                    startTimeHour = Number(
                        getPeriodTimes(startPeriod)[0].split("-")[0]
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

        const closeDialog = () => emit("close");

        return {
            // Timetable
            periods,
            firstEventStart,
            intervalCount,

            // Functions
            closeDialog,

            // Icons
            mdiClose,
        };
    },
});
</script>
