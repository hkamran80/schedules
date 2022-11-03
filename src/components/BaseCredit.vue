<script setup lang="ts">
import { SVGProps } from "lucide-vue-next";
import { FunctionalComponent } from "vue";

const props = defineProps<{
    name: string;
    credit: string;
    icon: FunctionalComponent<SVGProps>;
}>();
</script>

<template>
    <div class="w-full flex items-center space-x-3">
        <component :is="props.icon" />

        <div>
            <p
                class="text-lg font-bold leading-snug"
                v-text="props.name"
            />
            <p class="text-sm" v-text="props.credit" />
        </div>
    </div>
</template>
