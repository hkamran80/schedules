<script setup lang="ts">
import { Home, ChevronRight } from "lucide-vue-next";
const props = defineProps<{
    basePath?: string;
    baseLabel: string;
    currentLabel?: string;
}>();
</script>

<template>
    <nav class="mb-6 flex" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-4">
            <li>
                <div>
                    <router-link
                        to="/"
                        class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                    >
                        <span class="sr-only">Home</span>
                        <Home />
                    </router-link>
                </div>
            </li>
            <li>
                <div class="flex items-center">
                    <ChevronRight />

                    <router-link
                        v-if="props.basePath"
                        :to="props.basePath"
                        class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                        v-text="props.baseLabel"
                    />

                    <span
                        v-else
                        class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                        v-text="props.baseLabel"
                    />
                </div>
            </li>
            <li v-if="props.currentLabel">
                <div class="flex items-center">
                    <ChevronRight />

                    <span
                        class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                        v-text="props.currentLabel"
                    />
                </div>
            </li>
        </ol>
    </nav>
</template>
