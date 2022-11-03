<script setup lang="ts">
import { chooseContrastingColour } from "@hkamran/utility-web";
import type { ScheduleDetails, ScheduleTypes } from "../types/schedule";

const props = defineProps<{
    scheduleId: string;
    schedule: ScheduleTypes;
}>();
</script>

<template>
    <router-link
        v-if="Object.keys(props.schedule).indexOf('variantIds') === -1"
        :to="`/schedule/${scheduleId}`"
        class="w-full rounded-lg px-6 py-4 text-left"
        :style="[
            `background-color: ${(schedule as ScheduleDetails).color}`,
            `color: ${chooseContrastingColour(
                (schedule as ScheduleDetails).color,
                '#FFFFFF',
                '#000000',
            )}`,
        ]"
        v-text="(schedule as ScheduleDetails).name"
    />

    <div
        v-else
        class="w-full rounded-lg px-6 py-4 text-left"
        :style="[
            `background-color: ${(schedule as ScheduleDetails).color}`,
            `color: ${chooseContrastingColour(
                (schedule as ScheduleDetails).color,
                '#FFFFFF',
                '#000000',
            )}`,
        ]"
        v-text="(schedule as ScheduleDetails).name"
    />
</template>
