<script setup lang="ts">
import feather from "feather-icons";
import { computed, ref } from "vue";
import type { ScheduleDays, SchedulePeriodTimes } from "../types/schedule";
import type { LongDay } from "../types/datetime";

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
import { generateSchedulePeriods } from "../composables/periods";
import {
    convertShortWeekdayToLong,
    convertLongWeekdayToShort,
} from "@hkamran/utility-datetime";

const props = defineProps<{
    show: boolean;
    day: string;
    schedule: ScheduleDays;
    currentPeriodName?: string;
    nextPeriodName?: string;
}>();
const emit = defineEmits<{ (e: "hide"): void }>();

const selectedDay = ref<LongDay>(props.day as LongDay);
const periods = computed(() => {
    let shortWeekday = convertLongWeekdayToShort(selectedDay.value);

    if (
        props.schedule &&
        shortWeekday &&
        Object.keys(props.schedule).indexOf(shortWeekday) !== -1
    ) {
        return generateSchedulePeriods(
            props.schedule[shortWeekday] as SchedulePeriodTimes,
        );
    } else {
        return null;
    }
});

const validLongDays = computed(() => {
    if (props.schedule) {
        return Object.keys(props.schedule)
            .map((shortDay) => convertShortWeekdayToLong(shortDay))
            .filter((longDay) => longDay !== null) as LongDay[];
    } else {
        return null;
    }
});
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
                            class="inline-block w-full max-w-md max-h-256 p-6 my-8 overflow-none text-left align-middle transition-all transform bg-white dark:bg-black shadow-xl rounded-lg"
                        >
                            <DialogTitle
                                as="h3"
                                class="text-xl font-medium leading-6 text-gray-900 dark:text-gray-100 bg-white dark:bg-black flex space-x-3 items-center pb-2"
                            >
                                <div class="flex-1 flex flex-col space-y-1">
                                    <span> Timetable </span>
                                    <span
                                        class="text-sm"
                                        v-text="selectedDay"
                                    />
                                </div>

                                <Listbox v-model="selectedDay">
                                    <div class="relative mt-1">
                                        <ListboxButton
                                            class="relative w-full py-1 pl-4 pr-1 text-left bg-white dark:bg-gray-900 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 text-sm items-center"
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
                                                    class="flex-1 block truncate text-black dark:text-white"
                                                    v-text="selectedDay"
                                                />
                                                <span
                                                    class="inset-y-0 right-0 flex items-center pr-2 pointer-events-none w-8 h-8 text-gray-400"
                                                    v-html="
                                                        feather.icons[
                                                            'chevron-down'
                                                        ].toSvg()
                                                    "
                                                />
                                            </div>
                                        </ListboxButton>

                                        <transition
                                            leave-active-class="transition duration-100 ease-in"
                                            leave-from-class="opacity-100"
                                            leave-to-class="opacity-0"
                                        >
                                            <ListboxOptions
                                                class="absolute w-full py-1 mt-1 overflow-auto text-base bg-white dark:bg-gray-900 rounded-lg shadow-lg max-h-60 ring-1 ring-black dark:ring-white ring-opacity-5 focus:outline-none sm:text-sm"
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
                                                                ? 'text-pink-900 dark:text-gray-100 bg-pink-100 dark:bg-pink-900'
                                                                : 'text-gray-900 dark:text-gray-100',
                                                            'cursor-default select-none relative py-2 px-4 flex items-center',
                                                        ]"
                                                    >
                                                        <span
                                                            :class="[
                                                                selected
                                                                    ? 'font-medium'
                                                                    : 'font-normal',
                                                                'block truncate flex-1',
                                                            ]"
                                                            v-text="dayOption"
                                                        />

                                                        <span
                                                            v-if="
                                                                dayOption ===
                                                                props.day
                                                            "
                                                            class="bg-pink-700 dark:bg-pink-500 flex-shrink-0 inline-block h-2 w-2 rounded-full"
                                                            aria-hidden="true"
                                                        />

                                                        <span
                                                            v-else-if="
                                                                dayOption ===
                                                                selectedDay
                                                            "
                                                            class="bg-green-600 flex-shrink-0 inline-block h-2 w-2 rounded-full"
                                                            aria-hidden="true"
                                                        />
                                                    </li>
                                                </ListboxOption>
                                            </ListboxOptions>
                                        </transition>
                                    </div>
                                </Listbox>

                                <button
                                    type="button"
                                    @click="emit('hide')"
                                    v-html="feather.icons.x.toSvg()"
                                />
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
                                                {{
                                                    period.times?.start
                                                        .split("-")
                                                        .slice(0, 2)
                                                        .join(":")
                                                }}
                                                -
                                                {{
                                                    period.times?.end
                                                        .split("-")
                                                        .slice(0, 2)
                                                        .join(":")
                                                }}
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
