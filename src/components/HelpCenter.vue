<template>
    <v-card>
        <v-card-title>
            Help Center

            <v-spacer />

            <v-btn icon color="primary" @click="closeDialog">
                <v-icon v-text="mdiClose" />
            </v-btn>
        </v-card-title>

        <v-card-text class="my-3">
            <v-card
                class="mx-auto"
                outlined
                v-for="(metadata, id) of helpCenterTopics"
                :key="id"
            >
                <v-card-title>
                    {{ metadata.name }}

                    <v-spacer />

                    <v-btn
                        icon
                        color="primary"
                        @click="openHelpTopic(id, metadata)"
                    >
                        <v-icon v-text="mdiChevronRight" />
                    </v-btn>
                </v-card-title>
            </v-card>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { mdiClose, mdiChevronRight } from "@mdi/js";
import { HelpCenterTopic, HelpCenterTopics } from "@/structures/helpcenter";
import helpCenterTopics from "@/helpCenter.json";

export default defineComponent({
    setup(_, { emit }) {
        const closeDialog = () => emit("close");

        const openHelpTopic = (id: string, metadata: HelpCenterTopic) =>
            emit("openHelpTopic", id, metadata);

        return {
            helpCenterTopics: helpCenterTopics as HelpCenterTopics,

            // Functions
            closeDialog,
            openHelpTopic,

            // Icons
            mdiClose,
            mdiChevronRight,
        };
    },
});
</script>
