<template>
    <v-card>
        <v-card-title class="text-wrap--break">
            Help Center: {{ metadata.name }}

            <v-spacer />

            <v-btn
                icon
                color="primary"
                title="YouTube link to topic"
                aria-label="YouTube link to topic"
                target="_blank"
                :href="metadata.videoLink"
                v-if="metadata.videoLink"
            >
                <v-icon v-text="mdiYoutube" />
            </v-btn>
            <v-btn
                icon
                color="primary"
                title="Close dialog"
                aria-label="Close dialog"
                @click="closeDialog"
            >
                <v-icon v-text="mdiClose" />
            </v-btn>
        </v-card-title>

        <v-card-text class="my-3">
            <v-progress-linear
                color="primary lighten-1"
                background-color="primary lighten-4"
                indeterminate
                v-if="!markdown && !error"
            />

            <div
                id="markdown-content"
                class="text-wrap--break"
                v-else-if="markdown && !error"
                v-html="markdown"
            />
            <span v-else-if="!markdown && error" v-text="error" />
            <span v-else>
                An unknown error occurred. Please try again.
            </span>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from "@vue/composition-api";
import { mdiClose, mdiYoutube } from "@mdi/js";
import { HelpCenterTopic } from "@/models/helpcenter";
import { UtdsStringHelpers } from "utds-component-library";
import { Nullable } from "@/models/types";
import marked from "marked";

export default defineComponent({
    props: {
        id: { type: String, required: true, default: "help-center-demo" },
        metadata: {
            type: Object as () => HelpCenterTopic,
            required: true,
            default: function() {
                return {
                    name: "Help Center Demo",
                    description: "This is a demo for the help center",
                    videoLink: null,
                };
            },
        },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(props: any, { emit }: SetupContext) {
        const closeDialog = () => emit("close");
        const markdown = ref(null as Nullable<string>);
        const error = ref(null as Nullable<string>);

        import(`raw-loader!@/help-center/${props.id}.md`)
            .then((data) => {
                let count = 0;
                markdown.value = marked(
                    data.default.replace(/</g, "&lt;").replace(/>/g, "&gt;")
                )
                    .replaceAll(
                        UtdsStringHelpers.linkElementRegex,
                        `<a$1 target="_blank" rel="noopener noreferrer" title="$2" aria-label="$2">$2</a>`
                    )
                    .replaceAll("<h3", (x: string) => {
                        if (count === 0) {
                            count++;
                            return x;
                        } else {
                            return "<br /><h3";
                        }
                    });
            })
            .catch((loaderError) => {
                error.value = loaderError;
            });

        return {
            // Markdown
            markdown,
            error,

            // Functions
            closeDialog,

            // Icons
            mdiClose,
            mdiYoutube,
        };
    },
});
</script>

<style scoped>
#markdown-content h3 {
    display: block;
    margin-top: 5px;
}
</style>
