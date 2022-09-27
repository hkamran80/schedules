<script setup lang="ts">
import feather from "feather-icons";

import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";
import { ref, toRef, watch, watchEffect } from "vue";
import { watchOnce } from "@vueuse/core";
import { scheduleId } from "../composables/scheduleState";
import { emptyPeriodNames, periodNames } from "../composables/storage";
import type { PeriodNames } from "../types/periods";

const props = defineProps<{
    show: boolean;
}>();
const emit = defineEmits<{
    (e: "hide"): void;
}>();

const modelStorage = ref<PeriodNames | null>(emptyPeriodNames.value);

const showProp = toRef(props, "show");
watch(showProp, () => {
    if (scheduleId.value && periodNames) {
        modelStorage.value = periodNames.value;
    } else {
        watchOnce(scheduleId, () => {
            if (periodNames) {
                modelStorage.value = periodNames.value;
            }
        });
    }
});

watchEffect(() => {
    if (periodNames && modelStorage.value) {
        periodNames.value = modelStorage.value;
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
                                <span class="flex-1"> Period Names </span>

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
                                    v-for="(_, defaultName) in modelStorage"
                                    :key="defaultName"
                                >
                                    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
                                    <label
                                        :for="`${(defaultName as string)
                                            .replace(/[^A-Za-z0-9\s]/g, '')
                                            .replace(/\s\s/gm, ' ')
                                            .replace(/\s/gm, '-')
                                            .toLowerCase()}`"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        v-text="defaultName"
                                    />
                                    <input
                                        :id="`${(defaultName as string)
                                            .replace(/[^A-Za-z0-9\s]/g, '')
                                            .replace(/\s\s/gm, ' ')
                                            .replace(/\s/gm, '-')
                                            .toLowerCase()}`"
                                        v-model="modelStorage[defaultName]"
                                        type="text"
                                        class="mt-1 block w-full rounded-lg py-2 px-4 ring-2 ring-inset ring-gray-200 focus:outline-none focus:ring-pink-700 dark:bg-black dark:text-white dark:ring-gray-800 dark:focus:ring-pink-500 sm:text-sm"
                                        :placeholder="(defaultName as string)"
                                    />
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

                                <span> Loading period names... </span>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
