<script setup lang="ts">
import { useTitle, useNow, useDateFormat, useIntervalFn } from "@vueuse/core";
import { useMainStore } from "../stores/main";
import { computed, onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import feather from "feather-icons";
import { setPeriods, currentPeriod, nextPeriod } from "../composables/periods";
import { useTimer } from "vue-timer-hook";
import { padNumber } from "@hkamran/utility-strings";
import {
    setOffDays,
    setScheduleOverrides,
    offDay,
    lastOffDay,
    timezoneOffset,
} from "../composables/overrides";
import type { SchedulePeriodTimes } from "../types/schedule";

import NavigationBar from "../components/NavigationBar.vue";
import Card from "../components/Card.vue";
import Timetable from "../components/Timetable.vue";

useTitle("Schedule | Schedules");
const { params } = useRoute();
const { push } = useRouter();

const store = useMainStore();
const schedule = computed(() => store.getSchedule(params.id as string));

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
const timer = useTimer();

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

const { pause, resume } = useIntervalFn(
    () => {
        if (schedule.value) {
            setOffDays(schedule.value.offDays);
            setScheduleOverrides(schedule.value.overrides);
        }

        if (daySchedule.value) {
            setPeriods(daySchedule.value);
        }

        if (currentPeriod.value && currentPeriod.value.times) {
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

onBeforeMount(() => resume());
onBeforeUnmount(() => {
    pause();
    timer.pause();
});
</script>

<template>
    <NavigationBar />

    <div class="mt-10 md:mt-16">
        <div class="flex items-center">
            <div class="flex-1 flex flex-col space-y-2">
                <span class="text-3xl" v-text="schedule?.name" />
                <span
                    class="text-xl"
                    v-text="
                        `${currentDateTime.toLocaleDateString(undefined, {
                            weekday: 'long',
                        })} - ${currentTime}`
                    "
                />
            </div>

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
                                  `${lastOffDay}T${12 + timezoneOffset}:00:00`,
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
                    :description="`${padNumber(timer.hours.value)}:${padNumber(
                        timer.minutes.value,
                    )}:${padNumber(timer.seconds.value)}`"
                />

                <Card
                    v-if="nextPeriod"
                    header="Next"
                    :title="nextPeriod.name"
                    :description="
                        nextPeriod.times?.end.split('-').slice(0, 2).join(':')
                    "
                />
            </div>

            <div v-else>
                <!-- TODO: Replace description with countdown to next period -->
                <Card
                    title="No Active Period"
                    description="There's no active period right now"
                />
            </div>
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
</template>
