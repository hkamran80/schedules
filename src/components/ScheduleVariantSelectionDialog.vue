<script setup lang="ts">
import feather from "feather-icons";
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";
import type { ScheduleVariant } from "../types/schedule";

const props = defineProps<{
    show: boolean;
    variant: ScheduleVariant;
}>();
const emit = defineEmits<{
    (e: "hide"): void;
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
                            class="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-ut-grey"
                        >
                            <DialogTitle
                                as="h3"
                                class="flex items-center space-x-3 text-xl font-medium leading-6 text-gray-900 dark:text-gray-100"
                            >
                                <div class="flex flex-1 flex-col space-y-1">
                                    <span> Select a variant </span>
                                    <span
                                        class="text-sm"
                                        v-text="props.variant.name"
                                    />
                                </div>

                                <button
                                    type="button"
                                    @click="emit('hide')"
                                    v-html="feather.icons.x.toSvg()"
                                />
                            </DialogTitle>

                            <div
                                class="mt-4 grid max-h-128 grid-cols-1 gap-2 overflow-y-auto"
                            >
                                <router-link
                                    v-for="localVariant in props.variant
                                        .variants"
                                    :key="localVariant.id"
                                    :to="`/schedule/${localVariant.id}`"
                                    class="rounded-lg px-4 py-2 text-left text-black ring-2 ring-inset ring-gray-200 transition hover:bg-gray-200 dark:text-white dark:ring-gray-800 dark:hover:bg-gray-800"
                                    v-text="localVariant.name"
                                />
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
