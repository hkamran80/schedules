<script setup lang="ts">
import { useTitle } from "@vueuse/core";
import { useMainStore } from "../stores/main";
import { ref } from "vue";
import feather from "feather-icons";
import NavigationBar from "../components/NavigationBar.vue";
import Card from "../components/LinkableCard.vue";
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";
import ReleaseNotes from "../components/ReleaseNotes.vue";

useTitle("Schedules");

const store = useMainStore();
const aboutDialog = ref<boolean>(false);
const releaseNotesDialog = ref<boolean>(false);

const pickTextColorBasedOnBgColorAdvanced = (
    bgColor: string,
    lightColor: string,
    darkColor: string,
): string => {
    const color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const uicolors = [r / 255, g / 255, b / 255];
    const c = uicolors.map((col) => {
        if (col <= 0.03928) {
            return col / 12.92;
        }

        return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];

    return L > 0.179 ? darkColor : lightColor;
};
</script>

<template>
    <NavigationBar />

    <div class="mt-10 md:mt-16">
        <span class="text-2xl"> Select a schedule to begin! </span>

        <div class="mt-6 flex flex-col space-y-8">
            <div class="flex flex-col space-y-4">
                <router-link
                    v-for="(schedule, id) in store.schedules"
                    :key="id"
                    :to="`/schedule/${id}`"
                    class="w-full px-6 py-4 rounded-lg text-left"
                    :style="[
                        `background-color: ${schedule.color}`,
                        `color: ${pickTextColorBasedOnBgColorAdvanced(
                            schedule.color,
                            '#FFFFFF',
                            '#000000',
                        )}`,
                    ]"
                    v-text="schedule.name"
                />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    type="button"
                    class="w-full px-6 py-4 rounded-lg text-left ring-2 dark:ring-0 ring-gray-100 dark:bg-gray-900"
                    @click="aboutDialog = true"
                >
                    About
                </button>

                <router-link
                    to="/help"
                    class="w-full px-6 py-4 rounded-lg text-left ring-2 dark:ring-0 ring-gray-100 dark:bg-gray-900"
                >
                    Help Center
                </router-link>

                <button
                    type="button"
                    class="w-full px-6 py-4 rounded-lg text-left ring-2 dark:ring-0 ring-gray-100 dark:bg-gray-900"
                    @click="releaseNotesDialog = true"
                >
                    Release Notes
                </button>
            </div>
        </div>
    </div>

    <TransitionRoot appear :show="aboutDialog" as="template">
        <Dialog as="div" @close="aboutDialog = false">
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
                            class="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-black shadow-xl rounded-lg"
                        >
                            <DialogTitle
                                as="h3"
                                class="text-xl font-medium leading-6 text-gray-900 dark:text-gray-100 flex"
                            >
                                <div class="flex-1 flex flex-col space-y-1">
                                    <span> About </span>
                                    <span class="text-sm">
                                        Version {{ store.version }}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    @click="aboutDialog = false"
                                    v-html="feather.icons.x.toSvg()"
                                />
                            </DialogTitle>

                            <div
                                class="mt-6 prose dark:prose-invert max-w-none"
                            >
                                <p>
                                    Schedules is an app for schedules. It tells
                                    you exactly what the current period is and
                                    how much time is remaining in a period, as
                                    well as the next period and starting time.
                                </p>

                                <h3>Credits</h3>
                                <div
                                    class="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
                                >
                                    <Card
                                        title="H. Kamran"
                                        description="Developer"
                                        link="https://hkamran.com"
                                        center-text
                                    />
                                    <Card
                                        title="J. Quam"
                                        link="https://twitter.com/josephius3"
                                        description="UI/UX Design and Logo Design"
                                        center-text
                                    />
                                    <Card
                                        title="Andrew Zheng"
                                        link="https://getfind.app"
                                        description="UI/UX Design"
                                        center-text
                                    />
                                </div>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

    <ReleaseNotes
        :show="releaseNotesDialog"
        @hide="releaseNotesDialog = false"
    />
</template>
