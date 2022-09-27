<script setup lang="ts">
const props = defineProps<{
    header?: string;
    title: string;
    description?: string;
    centerText?: boolean;
    largerDescription?: boolean;
}>();
</script>

<template>
    <div
        class="w-full rounded-lg bg-white shadow ring-2 ring-gray-100 dark:bg-ut-grey dark:shadow-none dark:ring-0"
    >
        <div
            class="flex w-full items-center justify-between p-6"
            :class="{ 'text-center': props.centerText }"
        >
            <div class="flex-1 space-y-1">
                <span
                    v-if="props.header"
                    class="text-sm text-gray-500 dark:text-gray-400"
                    v-text="props.header"
                />
                <h3
                    class="font-medium text-gray-900 dark:text-white"
                    :class="{ 'text-lg': !props.largerDescription }"
                    v-text="props.title"
                />
                <p
                    v-if="props.description"
                    class="whitespace-normal text-gray-700 dark:text-gray-300"
                    :class="{ 'text-lg': props.largerDescription }"
                    v-text="props.description"
                />
            </div>
        </div>
    </div>
</template>
