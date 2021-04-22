<template>
    <v-card class="mx-auto">
        <v-card-title class="mb-1">
            <v-row align="center">
                <v-col class="text-wrap--break">
                    Release Notes
                </v-col>
                <v-col cols="2" class="text-right">
                    <v-btn
                        icon
                        color="primary"
                        href="https://github.com/hkamran80/schedules"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <v-icon v-text="mdiGithub" />
                    </v-btn>
                    <v-btn icon color="primary" @click="closeDialog">
                        <v-icon v-text="mdiClose" />
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-subtitle v-text="$appVersion" />
        <v-card-text>
            <v-expansion-panels v-model="openPanels">
                <v-expansion-panel
                    v-for="(items, version) in releaseNotes"
                    :key="version"
                >
                    <v-expansion-panel-header>
                        {{ version }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <span
                            v-for="rnItem of items"
                            :key="rnItem"
                            class="releasenotes-item"
                            v-text="rnItem"
                        />
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>
    </v-card>
</template>

<script>
import releaseNotesJSON from "@/releaseNotes.json";
import { mdiClose, mdiGithub } from "@mdi/js";

export default {
    name: "ReleaseNotes",
    data: function() {
        return {
            releaseNotes: {},
            openPanels: 0,
            mdiClose: mdiClose,
            mdiGithub: mdiGithub
        };
    },
    created() {
        this.loadReleaseNotes();
    },
    methods: {
        loadReleaseNotes: function() {
            Object.keys(releaseNotesJSON)
                .reverse()
                .forEach(versionCode => {
                    this.releaseNotes[versionCode] =
                        releaseNotesJSON[versionCode];
                });
        },
        closeDialog: function() {
            this.$emit("close");
        }
    }
};
</script>

<style scoped>
.releasenotes-item {
    display: block;
    margin-bottom: 5px;
}
</style>
