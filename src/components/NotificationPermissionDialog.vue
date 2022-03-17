<script setup lang="ts">
import feather from "feather-icons";
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";

const props = defineProps<{
    show: boolean;
}>();
const emit =
    defineEmits<{
        (e: "hide"): void;
        (e: "enable"): void;
        (e: "disable"): void;
    }>();
</script>

<template>
    <TransitionRoot appear :show="props.show" as="template">
        <Dialog as="div" @close="emit('hide')">
            <div
                class="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-60"
            >
                <div class="min-h-screen px-4 text-center">
                    <TransitionChild
                        as="template"
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
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <div
                            class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-black shadow-xl rounded-lg"
                        >
                            <DialogTitle
                                as="h3"
                                class="text-xl font-medium leading-6 text-gray-900 dark:text-gray-100 flex space-x-3 items-center"
                            >
                                <span class="flex-1"> Notifications </span>

                                <button
                                    type="button"
                                    @click="emit('hide')"
                                    v-html="feather.icons.x.toSvg()"
                                />
                            </DialogTitle>

                            <div class="mt-4">
                                <p class="text-black dark:text-white">
                                    Schedules relies on notifications to tell
                                    you when periods are close to ending or are
                                    ending.
                                </p>
                            </div>

                            <div class="mt-4 flex flex-col sm:flex-row-reverse">
                                <button
                                    type="button"
                                    class="w-full inline-flex justify-center rounded-lg shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition"
                                    @click="emit('enable')"
                                >
                                    Enable
                                </button>
                                <button
                                    type="button"
                                    class="mt-3 w-full inline-flex justify-center border border-gray-100 dark:border-none rounded-lg shadow-sm px-4 py-2 bg-white dark:bg-gray-900 text-base font-medium text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition"
                                    @click="emit('disable')"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
