<script setup lang="ts">
import Breadcrumbs from "../components/Breadcrumbs.vue";
import NavigationBar from "../components/NavigationBar.vue";
import { useHelpCenterStore } from "../stores/helpCenter";

const helpCenterStore = useHelpCenterStore();
</script>

<template>
    <NavigationBar />

    <div class="mt-10 md:mt-16">
        <Breadcrumbs base-label="Help Center" />

        <span class="text-2xl"> Select a topic </span>

        <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <router-link
                v-for="topic in helpCenterStore.topics"
                :key="topic.id"
                :to="`/help/${topic.id}`"
                class="w-full rounded-lg px-6 py-4 text-left ring-2 ring-gray-100 transition-colors duration-300 ease-in-out dark:bg-ut-grey dark:ring-0 dark:hover:bg-ut-grey-light"
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
