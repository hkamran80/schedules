<script setup lang="ts">
import {
    useTitle,
    useNow,
    useDateFormat,
    useIntervalFn,
    useWebNotification,
    usePermission,
} from "@vueuse/core";
import { useMainStore } from "../stores/main";
import { computed, onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import feather from "feather-icons";
import { setPeriods, currentPeriod, nextPeriod } from "../composables/periods";
import { padNumber } from "@hkamran/utility-strings";
import { convert24HourTo12Hour } from "@hkamran/utility-datetime";
import {
    setOffDays,
    setScheduleOverrides,
    offDay,
    lastOffDay,
    timezoneOffset,
} from "../composables/overrides";
import {
    timer,
    scheduleId,
    scheduleShortName,
} from "../composables/scheduleState";
import "../composables/notifications";
import { hour24, setDaySchedule } from "../composables/storage";
import type { SchedulePeriodTimes } from "../types/schedule";

import NavigationBar from "../components/NavigationBar.vue";
import Card from "../components/Card.vue";
import Timetable from "../components/Timetable.vue";
import NotificationPermissionDialog from "../components/NotificationPermissionDialog.vue";
import Settings from "../components/Settings.vue";
import EditNotifications from "../components/EditNotifications.vue";
import EditPeriodNames from "../components/EditPeriodNames.vue";

useTitle("Schedule | Schedules");
const { params } = useRoute();
const { push } = useRouter();

const store = useMainStore();
const schedule = computed(() => store.getSchedule(params.id as string));
scheduleId.value = params.id as string;

// Check if the schedule exists
let keys = Object.keys(store.schedules);
if (keys.length > 0 && keys.indexOf(params.id as string) === -1) {
    push({ name: "Home" });
} else {
    useTitle(`${schedule.value?.name} | Schedules`);
}
store.$subscribe(() => {
    let keys = Object.keys(store.schedules);
    if (keys.length > 0 && keys.indexOf(params.id as string) === -1) {
        push({ name: "Home" });
    } else {
        useTitle(`${schedule.value?.name} | Schedules`);
    }
});

const timetableDialog = ref<boolean>(false);
const settingsDialog = ref<boolean>(false);
const notificationsPermissionsDialog = ref<boolean>(false);
const editNotificationsDialog = ref<boolean>(false);
const editPeriodNamesDialog = ref<boolean>(false);

const notificationPermission = usePermission("notifications");
const notificationsSupported = !!window && "Notification" in window;
const demoNotification = () => {
    const { show } = useWebNotification({
        title: "Schedules",
        body: "If you see this, perfect! Notifications are enabled for Schedules!",
        lang: "en",
        tag: "demo",
    });

    show();
};

const currentDateTime = useNow();
const currentTime = useDateFormat(currentDateTime);
const currentLongDay = computed(() =>
    currentDateTime.value.toLocaleDateString(undefined, { weekday: "long" }),
);

const currentDay = computed(() =>
    currentDateTime.value
        .toLocaleDateString(undefined, { weekday: "short" })
        .toUpperCase(),
);

const daySchedule = computed(() => {
    if (
        schedule.value &&
        Object.keys(schedule.value.schedule).indexOf(currentDay.value) !== -1
    ) {
        return schedule.value.schedule[currentDay.value] as SchedulePeriodTimes;
    } else {
        return null;
    }
});

// TODO: Figure out a way to load the current/next periods immediately
const { pause, resume } = useIntervalFn(
    () => {
        if (schedule.value) {
            scheduleShortName.value = schedule.value.shortName;
            setDaySchedule(schedule.value.schedule);
            setOffDays(schedule.value.offDays);
            setScheduleOverrides(schedule.value.overrides);
        }

        if (daySchedule.value) {
            setPeriods(daySchedule.value);
        }

        if (
            currentPeriod.value &&
            currentPeriod.value.times &&
            (timer.isExpired.value || !timer.isRunning.value)
        ) {
            let [hours, minutes, seconds] = currentPeriod.value.times.end
                .split("-")
                .map((time) => Number(time));

            timer.restart(
                currentDateTime.value.setHours(hours, minutes, seconds),
            );
        }
    },
    1000,
    { immediate: true, immediateCallback: true },
);

const nextPeriodTime = computed(() => {
    if (nextPeriod.value && nextPeriod.value.times) {
        const baseTime = nextPeriod.value.times.end.split("-").slice(0, 2);
        if (hour24.value) {
            return baseTime.join(":");
        } else {
            return convert24HourTo12Hour(baseTime.join(":"));
        }
    }

    return null;
});

const openEditNotificationsDialog = () => {
    settingsDialog.value = false;
    setTimeout(() => (editNotificationsDialog.value = true), 250);
};
const closeEditNotificationsDialog = () => {
    editNotificationsDialog.value = false;
    setTimeout(() => (settingsDialog.value = true), 250);
};

const openEditPeriodNamesDialog = () => {
    settingsDialog.value = false;
    setTimeout(() => (editPeriodNamesDialog.value = true), 250);
};
const closeEditPeriodNamesDialog = () => {
    editPeriodNamesDialog.value = false;
    setTimeout(() => (settingsDialog.value = true), 250);
};

onBeforeMount(() => resume());
onBeforeUnmount(() => {
    pause();
    timer.pause();
});
</script>

<template>
    <NavigationBar />

    <div class="mt-10 md:mt-16">
        <div v-if="schedule">
            <div class="flex items-center">
                <header class="flex-1 flex flex-col space-y-2">
                    <span class="text-3xl" v-text="schedule?.name" />
                    <span
                        class="text-xl"
                        v-text="
                            `${currentDateTime.toLocaleDateString(undefined, {
                                weekday: 'long',
                            })} - ${currentTime}`
                        "
                    />
                </header>

                <div class="space-x-2 md:space-x-4">
                    <button
                        type="button"
                        class="rounded-lg text-gray-700 dark:text-gray-300 hover:text-pink-700 dark:hover:text-pink-500 p-2"
                        title="Open timetable"
                        @click="timetableDialog = true"
                        v-html="feather.icons.calendar.toSvg()"
                    />

                    <button
                        type="button"
                        class="rounded-lg text-gray-700 dark:text-gray-300 hover:text-pink-700 dark:hover:text-pink-500 p-2"
                        title="Open settings"
                        @click="settingsDialog = true"
                        v-html="feather.icons.settings.toSvg()"
                    />
                </div>
            </div>

            <div class="mt-10">
                <div v-if="offDay.length > 0">
                    <Card
                        v-for="offDayItem in offDay"
                        :key="offDayItem.name"
                        :title="offDayItem.name"
                        :description="`Enjoy your break! ${
                            lastOffDay
                                ? `It ends on ${new Date(
                                      `${lastOffDay}T${
                                          12 + timezoneOffset
                                      }:00:00`,
                                  ).toLocaleDateString(undefined, {
                                      month: 'long',
                                      day: 'numeric',
                                      year: 'numeric',
                                  })}.`
                                : ''
                        }`"
                    />
                </div>

                <div
                    v-else-if="currentPeriod || nextPeriod"
                    class="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <Card
                        v-if="currentPeriod"
                        header="Current"
                        :title="currentPeriod.name"
                        :description="`${padNumber(
                            timer.hours.value,
                        )}:${padNumber(timer.minutes.value)}:${padNumber(
                            timer.seconds.value,
                        )}`"
                    />

                    <Card
                        v-if="nextPeriod && nextPeriodTime"
                        header="Next"
                        :title="nextPeriod.name"
                        :description="nextPeriodTime"
                    />
                </div>

                <div v-else>
                    <!-- TODO: Replace description with countdown to next period -->
                    <Card
                        title="No Active Period"
                        description="There's no active period right now"
                    />
                </div>

                <!-- <p class="mt-5 md:mt-10 text-center">
                    In honor of Natalie Hiatt
                </p> -->
            </div>
        </div>

        <div
            v-else
            class="w-full flex flex-col justify-center items-center space-y-4"
        >
            <svg
                role="status"
                class="inline mr-2 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-pink-700 dark:fill-pink-500"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                />
            </svg>

            <span> Loading schedule... </span>
        </div>
    </div>

    <Timetable
        v-if="schedule && schedule.schedule"
        :show="timetableDialog"
        :day="currentLongDay"
        :schedule="schedule.schedule"
        :current-period-name="currentPeriod?.name"
        :next-period-name="nextPeriod?.name"
        @hide="timetableDialog = false"
    />

    <NotificationPermissionDialog
        v-if="notificationsSupported && notificationPermission !== 'granted'"
        :show="notificationsPermissionsDialog"
        @hide="notificationsPermissionsDialog = false"
        @enable="
            notificationsPermissionsDialog = false;
            notificationsSupported && notificationPermission === 'granted'
                ? demoNotification()
                : null;
        "
        @disable="notificationsPermissionsDialog = false"
    />

    <Settings
        v-if="schedule && schedule.schedule"
        :show="settingsDialog"
        :schedule="schedule.schedule"
        @hide="settingsDialog = false"
        @edit-notifications="openEditNotificationsDialog"
        @edit-period-names="openEditPeriodNamesDialog"
    />

    <EditNotifications
        :show="editNotificationsDialog"
        @hide="closeEditNotificationsDialog"
    />

    <EditPeriodNames
        :show="editPeriodNamesDialog"
        @hide="closeEditPeriodNamesDialog"
    />
</template>
