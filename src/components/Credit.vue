<script setup lang="ts">
import { SVGProps } from "lucide-vue-next";
import { FunctionalComponent } from "vue";
import BaseCredit from "./BaseCredit.vue";

const props = defineProps<{
    name: string;
    credit: string;
    icon: FunctionalComponent<SVGProps>;
    url?: string;
}>();
</script>

<template>
    <!-- eslint-disable-next-line vuejs-accessibility/anchor-has-content -->
    <a
        v-if="props.url && props.url.trim()"
        :href="props.url"
        target="_blank"
        rel="noopener noreferrer"
    >
        <BaseCredit
            :name="props.name"
            :credit="props.credit"
            :icon="props.icon"
        />
    </a>

    <BaseCredit
        v-else
        :name="props.name"
        :credit="props.credit"
        :icon="props.icon"
    />
</template>
