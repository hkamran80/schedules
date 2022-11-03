<script setup lang="ts">
import { useTitle } from "@vueuse/core";
import { useMainStore } from "../stores/main";
import { computed, ref } from "vue";
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

useTitle("Schedules");

const store = useMainStore();
const aboutDialog = ref<boolean>(false);

const variantSchedules = computed(() => {
    const ids = Object.keys(store.schedules);
    const rootIds: { [id: string]: string[] } = {};

    ids.forEach((id) => {
        const rootId = id.split("-").slice(0, 3).join("-");
        if (rootIds[rootId] === undefined) {
            rootIds[rootId] = [id];
        } else {
            rootIds[rootId] = [...rootIds[rootId], id];
        }
    });

    return Object.fromEntries(
        Object.entries(rootIds).filter(([, ids]) => ids.length > 1),
    );
});

const schedulesList = computed(() => {
    const scheduleIds = Object.keys(store.schedules);
    const variantIds = Object.values(variantSchedules.value).flat();
    const withoutVariants = scheduleIds.filter(
        (id) => variantIds.indexOf(id) === -1,
    );
    const variantEntries = Object.entries(variantSchedules.value);

    const idList = variantEntries
        .map(([variantId, ids], index) => ({
            variantId,
            index:
                scheduleIds.indexOf(ids[0]) -
                variantEntries
                    .slice(0, index)
                    .map(([, ids]) => ids.length)
                    .reduce((partialSum, a) => partialSum + a, 0) +
                variantEntries.slice(0, index).length,
        }))
        .reduce(
            (previous, { variantId, index }) => [
                ...previous.slice(0, index),
                variantId,
                ...previous.slice(index),
            ],
            withoutVariants,
        );

    return idList.reduce(
        (previous, id) => ({
            ...previous,
            [id]:
                withoutVariants.indexOf(id) !== -1
                    ? store.getSchedule(id)
                    : { variantIds: variantSchedules.value[id] },
        }),
        {},
    );
});

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

        <a class="mt-6 flex flex-col space-y-8">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <router-link
                    v-for="(schedule, id) in store.schedules"
                    :key="id"
                    :to="`/schedule/${id}`"
                    class="w-full rounded-lg px-6 py-4 text-left"
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

            <a
                href="https://play.google.com/store/apps/details?id=com.hkamran.schedules"
                target="_blank"
                rel="noopener noreferrer"
                class="my-5 w-full rounded-lg bg-pink-700 px-6 py-3 text-left text-white transition-colors duration-300 hover:bg-pink-600"
            >
                <span
                    class="float-right inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800 md:float-none md:mr-1"
                >
                    NEW
                </span>

                <span>
                    Schedules now has an Android app! Click to open the Play
                    Store!
                </span>
            </a>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <button
                    type="button"
                    class="w-full rounded-lg px-6 py-4 text-left ring-2 ring-gray-100 transition-colors duration-300 ease-in-out dark:bg-ut-grey dark:ring-0 dark:hover:bg-ut-grey-lighter"
                    @click="aboutDialog = true"
                >
                    About
                </button>

                <router-link
                    to="/help"
                    class="w-full rounded-lg px-6 py-4 text-left ring-2 ring-gray-100 transition-colors duration-300 ease-in-out dark:bg-ut-grey dark:ring-0 dark:hover:bg-ut-grey-lighter"
                >
                    Help Center
                </router-link>

                <!-- <router-link
                    to="/changelog"
                    class="w-full px-6 py-4 rounded-lg text-left ring-2 dark:ring-0 ring-gray-100 dark:bg-ut-grey dark:hover:bg-ut-grey-lighter transition-colors duration-300 ease-in-out"
                >
                    Release Notes
                </router-link> -->
            </div>
        </a>
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
                            class="my-8 inline-block w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-black"
                        >
                            <DialogTitle
                                as="h3"
                                class="flex text-xl font-medium leading-6 text-gray-900 dark:text-gray-100"
                            >
                                <div class="flex flex-1 flex-col space-y-1">
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
                                class="prose mt-6 max-w-none dark:prose-invert"
                            >
                                <p>
                                    Schedules is an app for schedules. It tells
                                    you exactly what the current period is and
                                    how much time is remaining in a period, as
                                    well as the next period and starting time.
                                </p>

                                <h3>Credits</h3>
                                <div
                                    class="not-prose grid grid-cols-1 items-center gap-6 md:grid-cols-2"
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
</template>
