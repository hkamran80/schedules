<script setup lang="ts">
import { useToggle } from "@vueuse/core";
import feather from "feather-icons";
import { MessageSquare, Moon, Sun } from "lucide-vue-next";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { isDark } from "../composables/dark";

const toggleDark = useToggle(isDark);
const { name } = useRoute();
</script>

<template>
    <h1 class="flex items-center space-x-2 text-4xl font-bold md:space-x-4">
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

        <!-- eslint-disable-next-line vuejs-accessibility/anchor-has-content -->
        <a
            class="rounded-lg p-2 text-gray-700 hover:text-pink-700 dark:text-gray-300 dark:hover:text-pink-500"
            href="https://form.typeform.com/to/g0MlHGXj"
            target="_blank"
            rel="noopener noreferrer"
            title="Feedback"
        >
            <MessageSquare />
        </a>
        <button
            type="button"
            class="rounded-lg p-2 text-gray-700 hover:text-pink-700 dark:text-gray-300 dark:hover:text-pink-500"
            title="Toggle theme"
            @click="() => toggleDark()"
        >
            <Moon v-if="isDark" />
            <Sun v-else />
        </button>
    </h1>
</template>
