<script setup lang="ts">
const props = defineProps<{
    header?: string;
    title: string;
    description?: string;
    centerText?: boolean;
}>();
</script>

<template>
    <div
        class="w-full bg-white dark:bg-ut-grey rounded-lg shadow dark:shadow-none ring-2 ring-gray-100 dark:ring-0"
    >
        <div
            class="w-full flex items-center justify-between p-6"
            :class="{ 'text-center': props.centerText }"
        >
            <div class="flex-1">
                <span
                    v-if="props.header"
                    class="text-sm text-gray-500 dark:text-gray-400"
                    v-text="props.header"
                />
                <h3
                    class="text-gray-900 dark:text-white text-lg font-medium"
                    v-text="props.title"
                />
                <p
                    v-if="props.description"
                    class="mt-1 text-gray-700 dark:text-gray-300 whitespace-normal"
                    v-text="props.description"
                />
            </div>
        </div>
    </div>
</template>
