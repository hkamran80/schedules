<script setup lang="ts">
import feather from "feather-icons";

import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
    SwitchGroup,
    Switch,
    SwitchLabel,
} from "@headlessui/vue";
import { ref, toRef, watch, watchEffect } from "vue";
import { watchOnce } from "@vueuse/core";
import { scheduleId } from "../composables/scheduleState";
import {
    emptyAllowedNotifications,
    allowedNotifications,
} from "../composables/storage";
import { AllowedNotifications } from "../types/notifications";
import { notificationMap } from "../composables/notifications";
import { capitalizeFirstLetter } from "@hkamran/utility-strings";

const props = defineProps<{
    show: boolean;
}>();
const emit = defineEmits<{
    (e: "hide"): void;
}>();

const notificationNames = Object.fromEntries(
    Object.entries(notificationMap).map(([name, notification]) => [
        name,
        notification.content,
    ]),
);

const modelStorage = ref<AllowedNotifications | null>(
    emptyAllowedNotifications.value,
);

const showProp = toRef(props, "show");
watch(showProp, () => {
    if (scheduleId.value && allowedNotifications) {
        modelStorage.value = allowedNotifications.value;
    } else {
        watchOnce(scheduleId, () => {
            if (allowedNotifications) {
                modelStorage.value = allowedNotifications.value;
            }
        });
    }
});

watchEffect(() => {
    if (allowedNotifications && modelStorage.value) {
        allowedNotifications.value = modelStorage.value;
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
                            class="overflow-none my-8 inline-block max-h-256 w-full max-w-md transform rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-black"
                        >
                            <DialogTitle
                                as="h3"
                                class="flex items-center space-x-3 bg-white pb-2 text-xl font-medium leading-6 text-gray-900 dark:bg-black dark:text-gray-100"
                            >
                                <span class="flex-1"> Notifications </span>

                                <button
                                    type="button"
                                    class="focus:outline-none"
                                    @click="emit('hide')"
                                    v-html="feather.icons.x.toSvg()"
                                />
                            </DialogTitle>

                            <div
                                v-if="
                                    modelStorage &&
                                    typeof modelStorage !== 'string'
                                "
                                class="mt-2 max-h-128 space-y-4 overflow-y-auto"
                            >
                                <div
                                    v-if="modelStorage.intervals"
                                    class="space-y-2"
                                >
                                    <h3
                                        class="font-bold text-black dark:text-white"
                                    >
                                        Intervals
                                    </h3>

                                    <SwitchGroup
                                        v-for="(
                                            _, interval
                                        ) in modelStorage.intervals"
                                        :key="interval"
                                    >
                                        <div class="flex items-center">
                                            <SwitchLabel
                                                class="mr-4 flex-1 text-black dark:text-white"
                                                v-text="
                                                    notificationNames[interval]
                                                "
                                            />
                                            <Switch
                                                v-model="
                                                    modelStorage.intervals[
                                                        interval
                                                    ]
                                                "
                                                :class="
                                                    modelStorage.intervals[
                                                        interval
                                                    ]
                                                        ? 'bg-pink-700 dark:bg-pink-500'
                                                        : 'bg-gray-200 dark:bg-ut-grey'
                                                "
                                                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                                            >
                                                <span
                                                    :class="
                                                        modelStorage.intervals[
                                                            interval
                                                        ]
                                                            ? 'translate-x-6'
                                                            : 'translate-x-1'
                                                    "
                                                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform dark:bg-gray-200"
                                                />
                                            </Switch>
                                        </div>
                                    </SwitchGroup>
                                </div>

                                <div v-if="modelStorage.days" class="space-y-2">
                                    <h3
                                        class="font-bold text-black dark:text-white"
                                    >
                                        Days
                                    </h3>

                                    <SwitchGroup
                                        v-for="(_, day) in modelStorage.days"
                                        :key="day"
                                    >
                                        <div class="flex items-center">
                                            <SwitchLabel
                                                class="mr-4 flex-1 text-black dark:text-white"
                                                v-text="
                                                    capitalizeFirstLetter(day)
                                                "
                                            />
                                            <Switch
                                                v-model="modelStorage.days[day]"
                                                :class="
                                                    modelStorage.days[day]
                                                        ? 'bg-pink-700 dark:bg-pink-500'
                                                        : 'bg-gray-200 dark:bg-ut-grey'
                                                "
                                                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                                            >
                                                <span
                                                    :class="
                                                        modelStorage.days[day]
                                                            ? 'translate-x-6'
                                                            : 'translate-x-1'
                                                    "
                                                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform dark:bg-gray-200"
                                                />
                                            </Switch>
                                        </div>
                                    </SwitchGroup>
                                </div>

                                <div
                                    v-if="modelStorage.periods"
                                    class="space-y-2"
                                >
                                    <!-- TODO: Figure out a way to put brunch/break, lunch, and passing periods at the bottom of the list -->
                                    <h3
                                        class="font-bold text-black dark:text-white"
                                    >
                                        Periods
                                    </h3>

                                    <SwitchGroup
                                        v-for="(
                                            _, period
                                        ) in modelStorage.periods"
                                        :key="period"
                                    >
                                        <div class="flex items-center">
                                            <SwitchLabel
                                                class="mr-4 flex-1 text-black dark:text-white"
                                                v-text="
                                                    capitalizeFirstLetter(period as string)
                                                "
                                            />
                                            <Switch
                                                v-model="
                                                    modelStorage.periods[period]
                                                "
                                                :class="
                                                    modelStorage.periods[period]
                                                        ? 'bg-pink-700 dark:bg-pink-500'
                                                        : 'bg-gray-200 dark:bg-ut-grey'
                                                "
                                                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                                            >
                                                <span
                                                    :class="
                                                        modelStorage.periods[
                                                            period
                                                        ]
                                                            ? 'translate-x-6'
                                                            : 'translate-x-1'
                                                    "
                                                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform dark:bg-gray-200"
                                                />
                                            </Switch>
                                        </div>
                                    </SwitchGroup>
                                </div>
                            </div>

                            <div
                                v-else
                                class="flex w-full flex-col items-center justify-center space-y-2"
                            >
                                <svg
                                    role="status"
                                    class="mr-2 inline h-8 w-8 animate-spin fill-pink-700 text-gray-200 dark:fill-pink-500 dark:text-gray-600"
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

                                <span> Loading notification settings... </span>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
