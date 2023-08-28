<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
</script>

<template>
    <section class="flex h-screen flex-col justify-center space-y-4">
        <div class="flex">
            <span class="flex-1" />
            <Loader2
                :size="48"
                class="animate-spin justify-center text-pink-700 dark:text-pink-400"
            />
            <span class="flex-1" />
        </div>
        <h1
            class="text-center text-2xl font-semibold text-gray-900 dark:text-gray-100"
        >
            Loading your account, please wait...
        </h1>
    </section>
</template>
