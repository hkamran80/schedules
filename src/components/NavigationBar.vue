<script setup lang="ts">
import { useToggle } from "@vueuse/core";
import feather from "feather-icons";
import { useRoute } from "vue-router";
import { isDark } from "../composables/dark";

const toggleDark = useToggle(isDark);
const { name } = useRoute();
</script>

<template>
    <h1 class="text-4xl font-bold flex items-center space-x-2 md:space-x-4">
        <span
            v-if="name === 'Home'"
            class="flex-1 text-pink-700 dark:text-pink-500"
        >
            Schedules
        </span>
        <router-link
            v-else
            to="/"
            title="Home"
            class="flex-1 hover:text-pink-700 dark:hover:text-pink-500"
        >
            Schedules
        </router-link>

        <a
            class="rounded-lg text-gray-700 dark:text-gray-300 hover:text-pink-700 dark:hover:text-pink-500 p-2"
            href="https://form.typeform.com/to/g0MlHGXj"
            target="_blank"
            rel="noopener noreferrer"
            title="Feedback"
            v-html="feather.icons['message-square'].toSvg()"
        />
        <button
            type="button"
            class="rounded-lg text-gray-700 dark:text-gray-300 hover:text-pink-700 dark:hover:text-pink-500 p-2"
            title="Toggle theme"
            @click="() => toggleDark()"
            v-html="feather.icons[isDark ? 'moon' : 'sun'].toSvg()"
        />
    </h1>
</template>
