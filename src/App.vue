<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useMainStore } from "./stores/main";
import { useHelpCenterStore } from "./stores/helpCenter";
import ReloadPWA from "./components/ReloadPWA.vue";

const store = useMainStore();
const helpCenterStore = useHelpCenterStore();

onBeforeMount(async () => {
    await store.loadSchedules();
    await helpCenterStore.loadTopics();
});
</script>

<template>
    <ReloadPWA />

    <div
        class="mx-auto min-h-screen max-w-7xl px-12 pt-16 pb-20 text-black dark:text-white md:px-10 md:pt-12 2xl:px-0"
    >
        <router-view />
    </div>

    <footer
        class="mx-auto -mt-32 flex max-w-sm flex-col items-center space-y-3 px-6 pt-20 pb-12 text-center text-xs text-gray-600 sm:flex-row sm:space-y-0 sm:space-x-5 sm:px-0 sm:pb-6 md:-mt-24 md:max-w-2xl md:pt-8 md:text-sm"
    >
        <span class="flex-1 text-center sm:text-left">
            Copyright &copy; {{ new Date().getFullYear() }} UNISON Technologies
            Inc. All rights reserved.
        </span>

        <div
            class="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
        >
            <a
                href="https://unisontech.org/legal/terms"
                target="_blank"
                rel="noopener noreferrer"
                class="p-1 hover:underline md:p-0"
            >
                Terms of Service
            </a>

            <a
                href="https://unisontech.org/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                class="p-1 hover:underline md:p-0"
            >
                Privacy Policy
            </a>
        </div>
    </footer>
</template>
