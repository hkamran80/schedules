import { Nullable } from "@/models/types";

export interface HelpCenterTopic {
    name: string;
    description: string;
    videoLink: Nullable<string>;
}

export interface HelpCenterTopics {
    [id: string]: HelpCenterTopic;
}
