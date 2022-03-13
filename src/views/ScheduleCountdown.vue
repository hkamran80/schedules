<template>
    <utds-layout>
        <utds-header
            :title="
                countdownTime && countdownTime.indexOf(':') === -1
                    ? `Countdown to ${countdownTimePretty}`
                    : `Countdown`
            "
            :subtitle="prettyDateAndTime"
        >
            <template v-slot:icons>
                <v-btn
                    icon
                    color="primary"
                    title="Edit Countdown"
                    aria-label="Edit Countdown"
                    @click="timePickerDialog = true"
                >
                    <v-icon v-text="mdiPencilOutline" />
                </v-btn>
                <v-btn
                    icon
                    color="primary"
                    title="Open Countdown Preferences"
                    aria-label="Open Countdown Preferences"
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
                        countdownTime &&
                            countdownTime.indexOf(':') === -1 &&
                            timeCheck
                    "
                    v-text="`Countdown - ${remainingTime}`"
                />
                <span
                    class="title font-weight-regular"
                    v-else-if="
                        countdownTime &&
                            countdownTime.indexOf(':') === -1 &&
                            !timeCheck
                    "
                >
                    Invalid countdown time set
                </span>
                <span class="title font-weight-regular" v-else>
                    No countdown is currently set
                </span>
            </v-card-title>
        </v-card>

        <v-dialog
            v-model="timePickerDialog"
            width="290px"
            :persistent="!timePickerTime || !countdownTime"
        >
            <v-time-picker
                v-model="timePickerTime"
                :format="twentyFourHourStatus ? '24hr' : 'ampm'"
                :min="minimumCountdownTime"
                :max="maximumCountdownTime"
                ampm-in-title
                full-width
                scrollable
            >
                <v-spacer />
                <v-btn
                    text
                    color="red"
                    @click="closeTimePicker"
                    v-if="!timePickerTime || !countdownTime"
                >
                    Home
                </v-btn>
                <v-btn
                    text
                    color="red"
                    @click="timePickerDialog = false"
                    v-else
                >
                    Cancel
                </v-btn>

                <v-btn
                    text
                    color="primary"
                    @click="saveTime"
                    :disabled="timePickerTime === null"
                >
                    Save
                </v-btn>
            </v-time-picker>
        </v-dialog>

        <v-dialog v-model="settingsDialog" width="500">
            <countdown-settings @close="settingsDialog = false" />
        </v-dialog>
    </utds-layout>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    onMounted,
    ref,
} from "@vue/composition-api";
import { UtdsLayout, UtdsHeader } from "utds-component-library";
import { mdiCogOutline, mdiPencilOutline } from "@mdi/js";
import { useToast } from "vue-toastification/composition";

import CountdownSettings from "@/components/CountdownSettings.vue";

import {
    getPermission,
    notificationsSupported,
    requestPermission,
} from "@/notifications";

import {
    calculateTimeDifference,
    hourConversion,
    padNumber,
} from "@/constructs/calculations";
import {
    loadBasicAllowedNotifications,
    notify,
} from "@/constructs/notifications";
import { splice } from "@/constructs/strings";
import { HourConversionType } from "@/models/calculations";
import {
    BasicAllowedNotifications,
    NotificationContent,
} from "@/models/notifications";
import { Nullable } from "@/models/types";

import { loadNotifications } from "@/composables/notifications";
import { loadDatetime } from "@/composables/dateTime";

export default defineComponent({
    components: { UtdsLayout, UtdsHeader, CountdownSettings },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(_, context: any) {
        const toast = useToast();
        const { notifications } = loadNotifications();
        const allowedNotifications = ref(
            loadBasicAllowedNotifications(
                "countdown"
            ) as BasicAllowedNotifications
        );

        const {
            dayTime,
            prettyDateAndTime,
            twentyFourHourStatus,
            getNewTimes,
        } = loadDatetime();

        const mainInterval = ref(null as Nullable<number>);

        // Dialogs
        const timePickerDialog = ref(true);
        const settingsDialog = ref(false);

        // Countdown Time Range
        const minimumCountdownTime = computed(() => {
            if (dayTime.value.time) {
                const d = new Date(new Date().getTime() + 60000);

                return splice(
                    padNumber(d.getHours().toString()) +
                        padNumber(d.getMinutes().toString()),
                    2,
                    ":"
                );
            }
        });
        const maximumCountdownTime = "23:59";

        // Countdown Time
        const countdownTime = ref(null as Nullable<string>);
        const timePickerTime = ref(null as Nullable<string>);
        const countdownTimePretty = computed(() =>
            countdownTime.value !== null
                ? hourConversion(
                      twentyFourHourStatus.value
                          ? HourConversionType.TwentyFourHour
                          : HourConversionType.TwelveHour,
                      countdownTime.value
                  )
                : ""
        );
        const timeCheck = computed(() =>
            countdownTime.value && dayTime.value.splitTime
                ? Number(countdownTime.value.replaceAll("-", "")) >=
                  Number(dayTime.value.splitTime.replaceAll("-", ""))
                : false
        );
        const remainingTime = ref(null as Nullable<string>);

        // Notifications
        const notifySchedule = (
            rtHour: number,
            rtMinute: number,
            rtSecond: number
        ) => {
            const title = `Countdown - ${countdownTimePretty.value}`;
            if (rtHour === 0 && rtSecond === 0) {
                if (
                    rtMinute === 30 &&
                    !notifications.value.thirtyMinute &&
                    allowedNotifications.value.intervals.thirtyMinute
                ) {
                    notifications.value.thirtyMinute = true;
                    notify(title, NotificationContent.THIRTY_MINUTE);
                } else if (
                    rtMinute === 15 &&
                    !notifications.value.fifteenMinute &&
                    allowedNotifications.value.intervals.fifteenMinute
                ) {
                    notifications.value.fifteenMinute = true;
                    notify(title, NotificationContent.FIFTEEN_MINUTE);
                } else if (
                    rtMinute === 10 &&
                    !notifications.value.tenMinute &&
                    allowedNotifications.value.intervals.tenMinute
                ) {
                    notifications.value.tenMinute = true;
                    notify(title, NotificationContent.TEN_MINUTE);
                } else if (
                    rtMinute === 5 &&
                    !notifications.value.fiveMinute &&
                    allowedNotifications.value.intervals.fiveMinute
                ) {
                    notifications.value.fiveMinute = true;
                    notify(title, NotificationContent.FIVE_MINUTE);
                } else if (
                    rtMinute === 1 &&
                    !notifications.value.oneMinute &&
                    allowedNotifications.value.intervals.oneMinute
                ) {
                    notifications.value.oneMinute = true;
                    notify(title, NotificationContent.ONE_MINUTE);
                }
            } else if (
                rtHour === 0 &&
                rtMinute === 0 &&
                rtSecond === 30 &&
                !notifications.value.thirtySecond &&
                allowedNotifications.value.intervals.thirtySecond
            ) {
                notify(title, NotificationContent.THIRTY_SECOND);
            } else if (
                rtHour === 1 &&
                rtMinute === 0 &&
                rtSecond === 0 &&
                !notifications.value.oneHour &&
                allowedNotifications.value.intervals.oneHour
            ) {
                notify(title, NotificationContent.ONE_HOUR);
                notifications.value.oneHour = true;
            } else if (rtHour === 0 && rtMinute === 0 && rtSecond === 0) {
                notify(title, "Countdown has been reached");
            }
        };

        const closeTimePicker = () => {
            timePickerDialog.value = false;
            context.root.$router.push({ name: "Home" });
        };
        const saveTime = () => {
            timePickerDialog.value = false;

            notifications.value.oneHour = false;
            notifications.value.thirtyMinute = false;
            notifications.value.fifteenMinute = false;
            notifications.value.tenMinute = false;
            notifications.value.fiveMinute = false;
            notifications.value.oneMinute = false;
            notifications.value.thirtySecond = false;

            if (timePickerTime.value) {
                countdownTime.value =
                    timePickerTime.value.replace(":", "-") + "-00";
            }
        };

        const main = () => {
            getNewTimes();

            if (countdownTime.value && dayTime.value.splitTime) {
                if (timeCheck.value) {
                    const [
                        rtHour,
                        rtMinute,
                        rtSecond,
                    ] = calculateTimeDifference(
                        dayTime.value.splitTime,
                        countdownTime.value
                    );

                    remainingTime.value =
                        padNumber(rtHour) +
                        ":" +
                        padNumber(rtMinute) +
                        ":" +
                        padNumber(rtSecond);

                    notifySchedule(rtHour, rtMinute, rtSecond);

                    if (rtHour === 0 && rtMinute === 0 && rtSecond === 0) {
                        countdownTime.value = null;
                        timePickerTime.value = null;
                        remainingTime.value = null;
                    }
                }
            }
        };

        onMounted(() => {
            mainInterval.value = setInterval(main, 1000);

            if (notificationsSupported()) {
                if (getPermission() !== "granted") {
                    toast.warning(
                        'To receive notifications, click "Allow" on the notification permission pop-up'
                    );
                } else if (getPermission() === "default") {
                    toast.warning(
                        'To receive notifications, click "Allow" on the notification permission pop-up'
                    );

                    requestPermission();
                }
            }
        });

        return {
            countdownTime,
            countdownTimePretty,
            prettyDateAndTime,
            twentyFourHourStatus,
            remainingTime,

            // Dialogs
            // Time Picker Dialog
            timePickerDialog,
            closeTimePicker,
            saveTime,
            timePickerTime,

            // Dialog Configuration
            minimumCountdownTime,
            maximumCountdownTime,

            // Settings Dialog
            settingsDialog,

            // Checks
            timeCheck,

            // Icons
            mdiCogOutline,
            mdiPencilOutline,
        };
    },
});
</script>
