<script setup lang="ts">
import { useTitle } from "@vueuse/core";
import feather from "feather-icons";
import { resizeIcon } from "@hkamran/utility-web";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { onBeforeMount } from "vue";
import { useMainStore } from "../stores/main";

import NavigationBar from "../components/NavigationBar.vue";

const store = useMainStore();

onBeforeMount(async () => {
    if (store.releaseNotes.length === 0) {
        await store.loadReleaseNotes();
    }
});

useTitle("Release Notes | Schedules");
</script>

<template>
    <NavigationBar />

    <div class="mx-auto mt-8 max-w-2xl">
        <header class="flex flex-col space-y-1">
            <nav class="mb-2 flex" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-4">
                    <li>
                        <div>
                            <router-link
                                to="/"
                                class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                            >
                                <span class="sr-only">Home</span>
                                <span
                                    aria-hidden="true"
                                    v-html="
                                        resizeIcon(
                                            feather.icons.home.toSvg(),
                                            18,
                                        )
                                    "
                                />
                            </router-link>
                        </div>
                    </li>
                    <li>
                        <div class="flex items-center">
                            <span
                                aria-hidden="true"
                                v-html="
                                    resizeIcon(
                                        feather.icons['chevron-right'].toSvg(),
                                        18,
                                    )
                                "
                            />

                            <span
                                class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                Release Notes
                            </span>
                        </div>
                    </li>
                </ol>
            </nav>

            <span class="text-3xl"> Release Notes </span>
            <span class="text-lg" v-text="`Version ${store.version}`" />
        </header>

        <div class="mt-6 space-y-3">
            <Disclosure
                v-for="release in store.releaseNotes.reverse()"
                :key="release.version"
                v-slot="{ open }"
            >
                <DisclosureButton class="flex w-full items-center">
                    <div class="flex flex-1 flex-col text-left text-sm">
                        <span class="font-medium text-black dark:text-white">
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
                                open ? 'chevron-up' : 'chevron-down'
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
                        class="prose prose-sm mt-3 prose-li:my-0.5 dark:prose-invert"
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
</template>
