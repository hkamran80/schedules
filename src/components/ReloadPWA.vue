<script setup lang="ts">
/// <reference types="vite-plugin-pwa/client" />
import { useRegisterSW } from "virtual:pwa-register/vue";
import { RefreshCw } from "lucide-vue-next";

const { needRefresh, updateServiceWorker } = useRegisterSW();
</script>

<template>
    <div v-if="needRefresh" class="fixed inset-x-0 bottom-0 pb-2 sm:pb-5">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div class="rounded-lg bg-pink-700 p-2 shadow-lg sm:p-3">
                <div class="flex flex-wrap items-center justify-between">
                    <div class="flex w-0 flex-1 items-center">
                        <span class="flex rounded-lg bg-pink-900 p-2">
                            <RefreshCw class="h-5 w-5 text-white" />
                        </span>
                        <p class="ml-3 truncate font-medium text-white">
                            An update is available for Schedules!
                        </p>
                    </div>
                    <div
                        class="order-3 mt-2 w-full flex-shrink-0 items-center sm:order-2 sm:mt-0 md:w-auto"
                    >
                        <button
                            class="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-pink-600 shadow-sm transition-colors duration-300 hover:bg-indigo-50"
                            @click="updateServiceWorker()"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
