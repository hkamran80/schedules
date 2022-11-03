<script setup lang="ts">
import { chooseContrastingColour } from "@hkamran/utility-web";
import type {
    ScheduleTypes,
    ScheduleVariant,
} from "../types/schedule";

const props = defineProps<{
    scheduleId: string;
    schedule: ScheduleTypes;
}>();

const emit = defineEmits<{
    (e: "select", variant: ScheduleVariant): void;
}>();
</script>

<template>
    <router-link
        v-if="Object.keys(props.schedule).indexOf('variants') === -1"
        :to="`/schedule/${scheduleId}`"
        class="w-full rounded-lg px-6 py-4 text-left"
        :style="[
            `background-color: ${schedule.color}`,
            `color: ${chooseContrastingColour(
                schedule.color,
                '#FFFFFF',
                '#000000',
            )}`,
        ]"
        v-text="schedule.name"
    />

    <button
        v-else
        type="button"
        class="w-full rounded-lg px-6 py-4 text-left"
        :style="[
            `background-color: ${schedule.color}`,
            `color: ${chooseContrastingColour(
                schedule.color,
                '#FFFFFF',
                '#000000',
            )}`,
        ]"
        @click="emit('select', schedule as ScheduleVariant)"
        v-text="schedule.name"
    />
</template>
