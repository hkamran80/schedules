<template>
    <v-card>
        <v-card-title class="text-wrap--break">
            Edit Notifications

            <v-spacer />

            <v-btn icon color="primary" @click="clearNotifications">
                <v-icon v-text="mdiBackupRestore" />
            </v-btn>
            <v-btn icon color="primary" @click="closeDialog">
                <v-icon v-text="mdiClose" />
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-progress-linear
                color="primary lighten-1"
                background-color="primary lighten-4"
                indeterminate
                v-if="
                    Object.keys(allowedNotifications.intervals).length === 0 &&
                        Object.keys(allowedNotifications.days).length === 0 &&
                        Object.keys(allowedNotifications.periods).length === 0
                "
            />

            <div v-if="Object.keys(allowedNotifications.periods).length !== 0">
                <div class="mb-5">
                    <h4 class="mb-2">
                        Days
                    </h4>

                    <v-switch
                        v-for="(state, day) in allowedNotifications.days"
                        :key="day"
                        v-model="allowedNotifications.days[day]"
                        :label="
                            day.replace(/\b[a-z]/g, (str) => str.toUpperCase())
                        "
                        inset
                        hide-details
                        readonly
                        @click="
                            updateNotifications(
                                NotificationType.DAY,
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
                        v-model="allowedNotifications.intervals[interval]"
                        :label="
                            interval
                                .replace(/([A-Z]+)/g, ' $1')
                                .replace(/([A-Z][a-z])/g, ' $1')
                                .replace(/(^|\s)\S/g, (t) => t.toUpperCase())
                        "
                        inset
                        hide-details
                        readonly
                        @click="
                            updateNotifications(
                                NotificationType.INTERVAL,
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
                        v-for="(state, period) in allowedNotifications.periods"
                        :key="period"
                        v-model="allowedNotifications.periods[period]"
                        :label="period"
                        inset
                        hide-details
                        readonly
                        @click="
                            updateNotifications(
                                NotificationType.PERIOD,
                                period,
                                !state
                            )
                        "
                    />
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from "@vue/composition-api";
import { mdiBackupRestore, mdiContentSaveOutline, mdiClose } from "@mdi/js";
import { useToast } from "vue-toastification/composition";

import { saveAllowedNotifications } from "@/constructs/notifications";
import {
    AllowedNotifications,
    NotificationPeriods,
    NotificationType,
} from "@/structures/notifications";

export default defineComponent({
    props: {
        scheduleId: {
            type: String,
            required: true,
            default: "",
        },
        currentAllowedNotifications: {
            type: Object as () => AllowedNotifications,
            required: true,
            default: function() {
                return {} as AllowedNotifications;
            },
        },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(props: any, { emit }: SetupContext) {
        const toast = useToast();
        const allowedNotifications = ref(props.currentAllowedNotifications);

        const closeDialog = () => emit("close");
        const updateNotifications = (
            type: NotificationType,
            id: string,
            value: boolean
        ) => {
            switch (type) {
                case NotificationType.INTERVAL:
                    allowedNotifications.value.intervals[id] = value;
                    break;
                case NotificationType.DAY:
                    allowedNotifications.value.days[id] = value;
                    break;
                case NotificationType.PERIOD:
                    allowedNotifications.value.periods[id] = value;
                    break;
            }

            saveAllowedNotifications(
                props.scheduleId,
                allowedNotifications.value
            );
            emit("update", allowedNotifications.value);
        };
        const clearNotifications = () => {
            const clearedNotifications = {
                intervals: {
                    oneHour: true,
                    thirtyMinute: true,
                    fifteenMinute: true,
                    tenMinute: true,
                    fiveMinute: true,
                    oneMinute: true,
                    thirtySecond: true,
                },
                days: {
                    sunday: true,
                    monday: true,
                    tuesday: true,
                    wednesday: true,
                    thursday: true,
                    friday: true,
                    saturday: true,
                },
                periods: Object.fromEntries(
                    Object.entries(
                        allowedNotifications.value.periods
                    ).map(([period]) => [period, true])
                ) as NotificationPeriods,
            } as AllowedNotifications;

            saveAllowedNotifications(props.scheduleId, clearedNotifications);
            emit("update", clearedNotifications, true);
            toast.success("Notifications reset!");
        };

        return {
            allowedNotifications,

            closeDialog,
            updateNotifications,
            clearNotifications,

            NotificationType,

            // Icons
            mdiBackupRestore,
            mdiContentSaveOutline,
            mdiClose,
        };
    },
});
</script>
