<script setup lang="ts">
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";
import { X } from "lucide-vue-next";

const props = defineProps<{
    show: boolean;
}>();
const emit = defineEmits<{
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
                            class="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-black"
                        >
                            <DialogTitle
                                as="h3"
                                class="flex items-center space-x-3 text-xl font-medium leading-6 text-gray-900 dark:text-gray-100"
                            >
                                <span class="flex-1"> Notifications </span>

                                <button type="button" @click="emit('hide')">
                                    <X />
                                </button>
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
                                    class="inline-flex w-full justify-center rounded-lg bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm transition hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                    @click="emit('enable')"
                                >
                                    Enable
                                </button>
                                <button
                                    type="button"
                                    class="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-100 bg-white px-4 py-2 text-base font-medium text-black shadow-sm transition hover:bg-gray-100 focus:outline-none dark:border-none dark:bg-ut-grey dark:text-gray-300 dark:hover:bg-ut-grey-lighter sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
