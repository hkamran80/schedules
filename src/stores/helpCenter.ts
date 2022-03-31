import { defineStore } from "pinia";
import type { HelpCenterTopic } from "../types/helpCenter";

export const useHelpCenterStore = defineStore("helpCenter", {
    state: () => {
        return {
            topics: null as HelpCenterTopic[] | null,
            markdown: {} as { [topicId: string]: string },
        };
    },
    getters: {
        getTopic: (state) => {
            return (topicId: string) => {
                if (state.topics) {
                    const topic = state.topics.find(
                        (topic) => topic.id === topicId,
                    );

                    return topic ? topic : null;
                } else {
                    return null;
                }
            };
        },
    },
    actions: {
        async loadTopics() {
            this.topics = (await (
                await fetch(
                    "https://raw.githubusercontent.com/hkamran80/schedules-helpcenter/main/topics.json",
                )
            ).json()) as HelpCenterTopic[];
        },
        async loadTopicContent(topicId: string) {
            const content = (
                await (
                    await fetch(
                        `https://raw.githubusercontent.com/hkamran80/schedules-helpcenter/main/topics/${topicId}.md`,
                    )
                ).text()
            );

            this.markdown[topicId] =
                content === "404: Not Found"
                    ? "Error 404: Topic Not Found"
                    : content;
        },
    },
    persist: { key: "schedules.helpCenter" },
});
