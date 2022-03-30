<script setup lang="ts">
import { useTitle } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
import { useHelpCenterStore } from "../stores/helpCenter";
import { computed } from "vue";
import MarkdownIt from "markdown-it";
import feather from "feather-icons";
import { resizeIcon } from "@hkamran/utility-web";

import NavigationBar from "../components/NavigationBar.vue";

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

    <div v-if="topic" class="mt-10 md:mt-16 max-w-2xl mx-auto">
        <header class="flex-1 flex flex-col space-y-2">
            <nav class="flex mb-6" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-4">
                    <li>
                        <div>
                            <router-link
                                to="/"
                                class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                            >
                                <span class="sr-only">Home</span>
                                <span
                                    aria-hidden="true"
                                    v-html="
                                        resizeIcon(
                                            feather.icons.home.toSvg(),
                                            18,
                                        )
                                    "
                                />
                            </router-link>
                        </div>
                    </li>
                    <li>
                        <div class="flex items-center">
                            <span
                                aria-hidden="true"
                                v-html="
                                    resizeIcon(
                                        feather.icons['chevron-right'].toSvg(),
                                        18,
                                    )
                                "
                            />

                            <router-link
                                to="/help"
                                class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                Help Center
                            </router-link>
                        </div>
                    </li>
                    <li>
                        <div class="flex items-center">
                            <span
                                aria-hidden="true"
                                v-html="
                                    resizeIcon(
                                        feather.icons['chevron-right'].toSvg(),
                                        18,
                                    )
                                "
                            />

                            <span
                                class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                                v-text="topic.name"
                            />
                        </div>
                    </li>
                </ol>
            </nav>

            <span class="text-3xl" v-text="topic.name" />
            <span class="text-xl" v-text="topic.description" />
        </header>

        <div
            class="mt-6 prose dark:prose-invert max-w-none"
            v-html="content"
        ></div>
    </div>
</template>
