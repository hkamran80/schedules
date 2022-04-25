<script setup lang="ts">
import NavigationBar from "../components/NavigationBar.vue";
import { useHelpCenterStore } from "../stores/helpCenter";

const helpCenterStore = useHelpCenterStore();
</script>

<template>
    <NavigationBar />

    <div class="mt-10 md:mt-16">
        <span class="text-2xl"> Select a topic </span>

        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <router-link
                v-for="topic in helpCenterStore.topics"
                :key="topic.id"
                :to="`/help/${topic.id}`"
                class="w-full px-6 py-4 rounded-lg text-left ring-2 dark:ring-0 ring-gray-100 dark:bg-ut-grey dark:hover:bg-ut-grey-lighter transition-colors duration-300 ease-in-out"
            >
                <span class="block" v-text="topic.name" />
                <span
                    class="text-sm text-gray-500 dark:text-gray-400"
                    v-text="topic.description"
                />
            </router-link>
        </div>
    </div>
</template>
