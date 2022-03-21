<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useMainStore } from "./stores/main";

const store = useMainStore();

onBeforeMount(async () => await store.loadSchedules());
</script>

<template>
    <div
        class="min-h-screen max-w-7xl mx-auto pt-16 md:pt-12 px-12 md:px-10 2xl:px-0 pb-20 text-black dark:text-white"
    >
        <router-view />
    </div>

    <footer
        class="text-gray-600 text-center text-sm -mt-32 md:-mt-16 px-6 sm:px-0 max-w-2xl mx-auto flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-5 pb-12 sm:pb-0 items-center"
    >
        <span class="flex-1 text-center sm:text-left">
            Copyright &copy; {{ new Date().getFullYear() }} UNISON Technologies
            Inc. All rights reserved.
        </span>

        <div
            class="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-6 items-center"
        >
            <a
                href="https://unisontech.org/legal/terms"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:underline"
            >
                Terms of Service
            </a>

            <a
                href="https://unisontech.org/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:underline"
            >
                Privacy Policy
            </a>
        </div>
    </footer>
</template>
