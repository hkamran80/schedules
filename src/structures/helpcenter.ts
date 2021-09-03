import { Nullable } from "@/structures/types";

export interface HelpCenterTopic {
    name: string;
    description: string;
    videoLink: Nullable<string>;
}

export interface HelpCenterTopics {
    [id: string]: HelpCenterTopic;
}
