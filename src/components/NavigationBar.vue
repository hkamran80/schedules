<script setup lang="ts">
import { useToggle } from "@vueuse/core";
import { MessageSquare, Moon, Sun } from "lucide-vue-next";
import { useRoute } from "vue-router";
import { isDark } from "../composables/dark";
import { LogIn, LogOut } from "lucide-vue-next";
import { supabase, supabaseSession } from "../composables/auth";

const toggleDark = useToggle(isDark);
const { name } = useRoute();

const logout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
};
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

        <router-link
            v-if="!supabaseSession"
            to="/login"
            class="rounded-lg p-2 text-gray-700 hover:text-pink-700 dark:text-gray-300 dark:hover:text-pink-500"
            title="Login"
        >
            <LogIn />
        </router-link>
        <button
            v-else
            type="button"
            class="rounded-lg p-2 text-gray-700 hover:text-pink-700 dark:text-gray-300 dark:hover:text-pink-500"
            title="Log out"
            @click="logout"
        >
            <LogOut />
        </button>

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
