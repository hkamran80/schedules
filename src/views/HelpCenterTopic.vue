<script setup lang="ts">
import { useTitle } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
import { useHelpCenterStore } from "../stores/helpCenter";
import { computed } from "vue";
import MarkdownIt from "markdown-it";

import NavigationBar from "../components/NavigationBar.vue";
import Breadcrumbs from "../components/Breadcrumbs.vue";

useTitle("Help Center | Schedules");
const { params } = useRoute();
const { push } = useRouter();

const helpCenterStore = useHelpCenterStore();
const topic = computed(() => helpCenterStore.getTopic(params.id as string));

let ids = helpCenterStore.topics?.map((topic) => topic.id) || [];
if (ids.length > 0 && ids.indexOf(params.id as string) === -1) {
    push({ name: "HelpCenter" });
} else {
    useTitle(`${topic.value?.name} | Help Center | Schedules`);
}
helpCenterStore.$subscribe(() => {
    let ids = helpCenterStore.topics?.map((topic) => topic.id) || [];
    if (ids.length > 0 && ids.indexOf(params.id as string) === -1) {
        push({ name: "HelpCenter" });
    } else {
        useTitle(`${topic.value?.name} | Help Center | Schedules`);
    }
});

const md = new MarkdownIt({});

const content = computed(() => {
    if (topic.value) {
        if (
            Object.keys(helpCenterStore.markdown).indexOf(topic.value.id) !== -1
        ) {
            return md
                .render(helpCenterStore.markdown[topic.value.id])
                .replace(
                    /<a([^>]+)>(.+?)<\/a>/gi,
                    `<a$1 target="_blank" rel="noopener noreferrer" title="$2" aria-label="$2">$2</a>`,
                );
        } else {
            helpCenterStore.loadTopicContent(topic.value.id);
            return null;
        }
    }

    return null;
});
</script>

<template>
    <NavigationBar />

    <div v-if="topic" class="mx-auto mt-10 max-w-2xl md:mt-12">
        <header class="flex flex-1 flex-col space-y-2">
            <Breadcrumbs
                base-path="/help"
                base-label="Help Center"
                :current-label="topic.name"
            />

            <div class="text-center md:text-left">
                <p class="text-3xl" v-text="topic.name" />
                <p class="text-xl" v-text="topic.description" />
            </div>
        </header>

        <div
            class="prose mt-6 max-w-none dark:prose-invert"
            v-html="content"
        ></div>
    </div>
</template>
