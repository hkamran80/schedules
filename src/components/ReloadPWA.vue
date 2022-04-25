<script setup lang="ts">
/// <reference types="vite-plugin-pwa/client" />
import { useRegisterSW } from "virtual:pwa-register/vue";

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();
const close = async () => {
    offlineReady.value = false;
    needRefresh.value = false;
};
</script>

<template>
    <div
        v-if="needRefresh"
        class="absolute bottom-7 right-7 bg-gray-100 dark:bg-ut-grey text-black dark:text-white px-6 py-4 rounded-lg"
    >
        <div class="flex flex-col" role="alert">
            <div class="message mt-1">
                <span> An update is available! </span>
            </div>
            <div class="flex items-center align-middle mt-2 space-x-4">
                <button
                    class="button bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg"
                    @click="updateServiceWorker()"
                >
                    Update
                </button>

                <button
                    class="button bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg"
                    @click="close"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
</template>
