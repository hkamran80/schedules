<script setup lang="ts">
import Card from "./Card.vue";

const props = defineProps<{
    header?: string;
    title: string;
    description?: string;
    centerText?: boolean;
    link?: string;
}>();
</script>

<template>
    <router-link v-if="link && link.startsWith('/')" :to="props.link">
        <Card
            class="transition-colors duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-ut-grey-lighter"
            :header="props.header"
            :title="props.title"
            :description="props.description"
            :center-text="props.centerText"
        />
    </router-link>

    <!-- eslint-disable-next-line vuejs-accessibility/anchor-has-content -->
    <a
        v-else-if="link"
        :href="props.link"
        target="_blank"
        rel="noopener noreferrer"
    >
        <Card
            class="transition-colors duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-ut-grey-lighter"
            :header="props.header"
            :title="props.title"
            :description="props.description"
            :center-text="props.centerText"
        />
    </a>

    <Card
        v-else
        :header="props.header"
        :title="props.title"
        :description="props.description"
        :center-text="props.centerText"
    />
</template>
