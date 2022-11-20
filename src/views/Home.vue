<script setup lang="ts">
import { useTitle } from "@vueuse/core";
import { useMainStore } from "../stores/main";
import { computed, ref } from "vue";
import feather from "feather-icons";
import NavigationBar from "../components/NavigationBar.vue";
import ScheduleCard from "../components/ScheduleCard.vue";
import ScheduleVariantSelectionDialog from "../components/ScheduleVariantSelectionDialog.vue";
import Credit from "../components/Credit.vue";
import { User, Layers, Layout } from "lucide-vue-next";
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";
import type { ScheduleTypes, ScheduleVariant } from "../types/schedule";

useTitle("Schedules");

const store = useMainStore();
const aboutDialog = ref<boolean>(false);

const variantSchedules = computed(() => {
    const ids = Object.keys(store.schedules);

    return Object.fromEntries(
        Object.entries(
            ids.reduce((previous, id) => {
                const rootId = id.split("-").slice(0, 3).join("-");
                return {
                    ...previous,
                    [rootId]: [...(previous[rootId] || []), id],
                };
            }, {} as { [id: string]: string[] }),
        ).filter(([, ids]) => ids.length > 1),
    );
});

const schedulesList = computed(() => {
    const scheduleIds = Object.keys(store.schedules);
    const variants = Object.values(variantSchedules.value).flat();
    const withoutVariants = scheduleIds.filter(
        (id) => variants.indexOf(id) === -1,
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
                    : {
                          name: store
                              .getSchedule(variantSchedules.value[id][0])
                              ?.name.replace(/\s\(.*\)/, ""),
                          color: store.getSchedule(
                              variantSchedules.value[id][0],
                          )?.color,
                          variants: variantSchedules.value[id].map((id) => ({
                              id,
                              name: (store
                                  .getSchedule(id)
                                  ?.name.match(/\(.*\)/) ?? [
                                  "Unknown",
                              ])[0].replace(/\(|\)/g, ""),
                          })),
                      },
        }),
        {},
    ) as { [id: string]: ScheduleTypes };
});

const variantSelectionDialog = ref<boolean>(false);
const currentVariant = ref<ScheduleVariant | null>(null);
</script>

<template>
    <NavigationBar />

    <div class="mt-10 md:mt-16">
        <span class="text-2xl"> Select a schedule to begin! </span>

        <a class="mt-6 flex flex-col space-y-8">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ScheduleCard
                    v-for="(schedule, id) in schedulesList"
                    :key="id"
                    :schedule-id="(id as string)"
                    :schedule="schedule"
                    @select="
                        (scheduleVariant) => {
                            currentVariant = scheduleVariant;
                            variantSelectionDialog = true;
                        }
                    "
                />
            </div>

            <a
                href="https://go.unisontech.org/schreq"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full rounded-lg bg-pink-700 px-6 py-3 text-left text-white transition-colors duration-300 hover:bg-pink-600"
            >
                Missing your schedule?
            </a>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <a
                    href="https://apps.apple.com/app/apple-store/id6444194250?pt=125715921&ct=Schedules%20(Web)&mt=8"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="my-5 w-full rounded-lg bg-pink-700 px-6 py-3 text-left text-white transition-colors duration-300 hover:bg-pink-600"
                >
                    Download Schedules on the App Store!
                </a>
                <a
                    href="https://play.google.com/store/apps/details?id=com.hkamran.schedules"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="my-5 w-full rounded-lg bg-pink-700 px-6 py-3 text-left text-white transition-colors duration-300 hover:bg-pink-600"
                >
                    Download Schedules on the Play Store!
                </a>
            </div>

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

    <ScheduleVariantSelectionDialog
        v-if="currentVariant !== null"
        :show="variantSelectionDialog"
        :variant="currentVariant"
        @hide="
            () => {
                variantSelectionDialog = false;
                currentVariant = null;
            }
        "
    />

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
                            class="my-8 inline-block w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-black"
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
                                <div class="not-prose">
                                    <ul class="space-y-3">
                                        <li>
                                            <Credit
                                                name="H. Kamran"
                                                credit="Developer"
                                                :icon="User"
                                                url="https://hkamran.com"
                                            />
                                        </li>
                                        <li>
                                            <Credit
                                                name="J. Quam"
                                                credit="UI/UX Design, Logo Design"
                                                :icon="Layers"
                                                url="https://unsplash.com/@jquam"
                                            />
                                        </li>
                                        <li>
                                            <Credit
                                                name="Andrew Zheng"
                                                credit="UI/UX Design"
                                                :icon="Layout"
                                                url="https://getfind.app"
                                            />
                                        </li>
                                        <li>
                                            <Credit
                                                name="Krishna R."
                                                credit="UX Design"
                                                :icon="Layout"
                                            />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
