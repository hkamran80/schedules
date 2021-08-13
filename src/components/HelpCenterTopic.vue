<template>
    <v-card>
        <v-card-title>
            Help Center: {{ metadata.name }}

            <v-spacer />

            <v-btn icon color="primary" @click="closeDialog">
                <v-icon v-text="mdiClose" />
            </v-btn>
        </v-card-title>
        <v-card-subtitle v-text="metadata.description" />

        <v-card-text class="my-3">
            <v-progress-linear
                color="primary lighten-1"
                background-color="primary lighten-4"
                indeterminate
                v-if="!markdown && !error"
            />

            <div v-else-if="markdown && !error" v-html="markdown" />
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
import { HelpCenterTopic } from "@/structures/helpcenter";
import { UtdsStringHelpers } from "utds-component-library";
import { Nullable } from "@/structures/types";

export default defineComponent({
    props: {
        id: { type: String, required: true, default: "help-center-demo" },
        metadata: {
            type: Object as () => HelpCenterTopic,
            required: true,
            default: function() {
                return { name: "", description: "", videoLink: null };
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
                markdown.value = UtdsStringHelpers.renderMarkdown(data.default);
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
