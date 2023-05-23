<script setup lang="ts">
import { computed, ref } from "vue";
import { generateSchedulePeriods } from "../composables/periods";
import {
    convertShortWeekdayToLong,
    convertLongWeekdayToShort,
    convert24HourTo12Hour,
} from "@hkamran/utility-datetime";
import { hour24 } from "../composables/storage";
import { ChevronDown, X } from "lucide-vue-next";
import type { ScheduleDays, SchedulePeriodTimes } from "../types/schedule";
import type { Period } from "../types/periods";
import { fixOffsetTime } from "../lib/datetime";

import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from "@headlessui/vue";

const props = defineProps<{
    show: boolean;
    day: string;
    schedule: ScheduleDays;
    currentPeriodName?: string;
    nextPeriodName?: string;
}>();
const emit = defineEmits<{ (e: "hide"): void }>();

const selectedDay = ref<string>(props.day);
const periods = computed(() => {
    let dayKeyName =
        convertLongWeekdayToShort(selectedDay.value) ?? selectedDay.value;

    if (
        props.schedule &&
        dayKeyName &&
        Object.keys(props.schedule).indexOf(dayKeyName) !== -1
    ) {
        return generateSchedulePeriods(
            props.schedule[dayKeyName] as SchedulePeriodTimes,
        )
            .map((period) => {
                if (period.times) {
                    const correctedStart = fixOffsetTime(period.times.start);
                    const correctedEnd = fixOffsetTime(period.times.end);

                    return {
                        ...period,
                        times: {
                            start: hour24.value
                                ? correctedStart
                                      .split(":")
                                      .slice(0, 2)
                                      .join(":")
                                : convert24HourTo12Hour(correctedStart),
                            end: hour24.value
                                ? correctedEnd.split(":").slice(0, 2).join(":")
                                : convert24HourTo12Hour(correctedEnd),
                        },
                    };
                }
            })
            .filter(
                (period) => period !== undefined && period !== null,
            ) as Period[];
    } else {
        return null;
    }
});

const validLongDays = computed(() =>
    props.schedule
        ? Object.keys(props.schedule).map(
              (shortDay) => convertShortWeekdayToLong(shortDay) ?? shortDay,
          )
        : null,
);
</script>

<template>
    <TransitionRoot appear :show="props.show" as="template">
        <Dialog as="div" @close="emit('hide')">
            <div
                class="fixed inset-0 z-10 overflow-clip bg-black bg-opacity-60"
            >
                <div class="min-h-screen px-4 text-center">
                    <TransitionChild
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <DialogOverlay class="fixed inset-0" />
                    </TransitionChild>

                    <span
                        class="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>

                    <TransitionChild
                        as="span"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <div
                            class="overflow-none my-8 inline-block max-h-256 w-full max-w-md transform rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-ut-grey"
                        >
                            <DialogTitle
                                as="h3"
                                class="flex items-center space-x-3 pb-2 text-xl font-medium leading-6 text-gray-900 dark:text-gray-100"
                            >
                                <div class="flex flex-1 flex-col space-y-1">
                                    <span> Timetable </span>
                                    <span
                                        class="text-sm"
                                        v-text="selectedDay"
                                    />
                                </div>

                                <Listbox v-model="selectedDay">
                                    <div class="relative mt-1">
                                        <ListboxButton
                                            class="relative w-full cursor-default items-center rounded-lg py-1 pl-4 pr-1 text-left text-sm ring-2 ring-gray-100 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-ut-grey-lighter dark:ring-0"
                                        >
                                            <div
                                                class="flex items-center"
                                                :class="{
                                                    'space-x-8':
                                                        selectedDay.length < 7,
                                                    'space-x-4':
                                                        selectedDay.length >= 7,
                                                }"
                                            >
                                                <span
                                                    class="block flex-1 truncate text-black dark:text-white"
                                                    v-text="selectedDay"
                                                />
                                                <span
                                                    class="pointer-events-none inset-y-0 right-0 flex h-8 w-8 items-center pr-2 text-gray-400"
                                                >
                                                    <ChevronDown />
                                                </span>
                                            </div>
                                        </ListboxButton>

                                        <transition
                                            leave-active-class="transition duration-100 ease-in"
                                            leave-from-class="opacity-100"
                                            leave-to-class="opacity-0"
                                        >
                                            <ListboxOptions
                                                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-ut-grey-lighter sm:text-sm"
                                            >
                                                <ListboxOption
                                                    v-for="dayOption in validLongDays"
                                                    v-slot="{
                                                        active,
                                                        selected,
                                                    }"
                                                    :key="dayOption"
                                                    :value="dayOption"
                                                    as="template"
                                                >
                                                    <li
                                                        :class="[
                                                            active
                                                                ? 'bg-pink-100 text-pink-900 dark:bg-pink-900 dark:text-gray-100'
                                                                : 'text-gray-900 dark:text-gray-100',
                                                            'relative flex cursor-default select-none items-center py-2 px-4',
                                                        ]"
                                                    >
                                                        <span
                                                            :class="[
                                                                selected
                                                                    ? 'font-medium'
                                                                    : 'font-normal',
                                                                'block flex-1 truncate',
                                                            ]"
                                                            v-text="dayOption"
                                                        />

                                                        <span
                                                            v-if="
                                                                dayOption ===
                                                                props.day
                                                            "
                                                            class="inline-block h-2 w-2 flex-shrink-0 rounded-full bg-pink-700 dark:bg-pink-500"
                                                            aria-hidden="true"
                                                        />

                                                        <span
                                                            v-else-if="
                                                                dayOption ===
                                                                selectedDay
                                                            "
                                                            class="inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-600"
                                                            aria-hidden="true"
                                                        />
                                                    </li>
                                                </ListboxOption>
                                            </ListboxOptions>
                                        </transition>
                                    </div>
                                </Listbox>

                                <button type="button" @click="emit('hide')">
                                    <X />
                                </button>
                            </DialogTitle>

                            <div class="mt-2 max-h-128 overflow-y-auto">
                                <ul
                                    v-if="periods"
                                    class="divide-y divide-gray-200"
                                >
                                    <li
                                        v-for="period in periods"
                                        :key="period.name"
                                        class="py-4"
                                    >
                                        <div class="flex-1 space-y-1">
                                            <div
                                                class="flex items-center justify-between"
                                            >
                                                <h3
                                                    class="text-sm font-medium text-black dark:text-white"
                                                    v-text="period.name"
                                                />

                                                <p
                                                    v-if="
                                                        selectedDay ===
                                                            props.day &&
                                                        props.currentPeriodName &&
                                                        period.name ===
                                                            props.currentPeriodName
                                                    "
                                                    class="text-sm text-gray-500 dark:text-gray-400"
                                                >
                                                    Current
                                                </p>
                                                <p
                                                    v-if="
                                                        selectedDay ===
                                                            props.day &&
                                                        props.nextPeriodName &&
                                                        period.name ===
                                                            props.nextPeriodName
                                                    "
                                                    class="text-sm text-gray-500 dark:text-gray-400"
                                                >
                                                    Next
                                                </p>
                                            </div>
                                            <p
                                                class="text-sm text-gray-500 dark:text-gray-400"
                                            >
                                                {{ period.times?.start }}
                                                -
                                                {{ period.times?.end }}
                                            </p>
                                        </div>
                                    </li>
                                </ul>

                                <span v-else class="text-black dark:text-white">
                                    No periods found
                                </span>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
