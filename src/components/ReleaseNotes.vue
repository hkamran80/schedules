<script setup lang="ts">
import feather from "feather-icons";

import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/vue";
import { useMainStore } from "../stores/main";
import { onBeforeMount } from "vue";

const props = defineProps<{
    show: boolean;
}>();
const emit = defineEmits<{ (e: "hide"): void }>();

const store = useMainStore();

onBeforeMount(async () => {
    if (store.releaseNotes.length === 0) {
        await store.loadReleaseNotes();
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
                                    <span> Release Notes </span>
                                    <span class="text-sm">
                                        Version {{ store.version }}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    class="focus:outline-none"
                                    @click="emit('hide')"
                                    v-html="feather.icons.x.toSvg()"
                                />
                            </DialogTitle>

                            <div
                                class="mt-2 space-y-3 max-h-128 overflow-y-auto"
                            >
                                <Disclosure
                                    v-for="release in store.releaseNotes"
                                    :key="release.version"
                                    v-slot="{ open }"
                                >
                                    <DisclosureButton
                                        class="w-full flex items-center"
                                    >
                                        <div
                                            class="flex-1 flex flex-col text-sm text-left"
                                        >
                                            <span
                                                class="font-medium text-black dark:text-white"
                                            >
                                                Version {{ release.version }}
                                            </span>
                                            <span
                                                class="text-gray-600 dark:text-gray-400"
                                                v-text="release.date"
                                            />
                                        </div>
                                        <span
                                            class="text-sm text-gray-500 dark:text-gray-400"
                                            v-html="
                                                feather.icons[
                                                    open
                                                        ? 'chevron-up'
                                                        : 'chevron-down'
                                                ].toSvg()
                                            "
                                        />
                                    </DisclosureButton>

                                    <transition
                                        enter-active-class="transition duration-100 ease-out"
                                        enter-from-class="transform scale-95 opacity-0"
                                        enter-to-class="transform scale-100 opacity-100"
                                        leave-active-class="transition duration-75 ease-out"
                                        leave-from-class="transform scale-100 opacity-100"
                                        leave-to-class="transform scale-95 opacity-0"
                                    >
                                        <DisclosurePanel
                                            class="mt-3 prose prose-sm dark:prose-invert prose-li:my-0.5"
                                        >
                                            <ul>
                                                <li
                                                    v-for="change in release.changelog"
                                                    :key="change"
                                                    v-text="change"
                                                />
                                            </ul>
                                        </DisclosurePanel>
                                    </transition>
                                </Disclosure>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
