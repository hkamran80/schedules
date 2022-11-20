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
                await fetch("https://cfg-schedules.unisontech.org/help/topics")
            ).json()) as HelpCenterTopic[];
        },
        async loadTopicContent(topicId: string) {
            const content = await (
                await fetch(
                    `https://cfg-schedules.unisontech.org/help/topic/${topicId}`,
                )
            ).text();

            this.markdown[topicId] =
                content === "404: Not Found"
                    ? "Error 404: Topic Not Found"
                    : content;
        },
    },
});
