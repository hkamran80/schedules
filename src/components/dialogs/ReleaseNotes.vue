<template>
    <v-card class="mx-auto">
        <v-card-title class="mb-1">
            Release Notes
            <v-spacer />
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
        </v-card-title>
        <v-card-subtitle v-text="version" />
        <v-card-text>
            <v-expansion-panels v-model="openPanels">
                <v-expansion-panel
                    v-for="release in releaseNotes"
                    :key="release.version"
                >
                    <v-expansion-panel-header v-text="release.version" />
                    <v-expansion-panel-content class="changelog">
                        <span
                            v-for="change in release.changelog"
                            :key="change"
                            v-text="change"
                        />
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>
    </v-card>
</template>

<script>
import releaseNotesJson from "@/releaseNotes.json";
import pkg from "../../../package.json";
import { mdiClose, mdiGithub } from "@mdi/js";

export default {
    name: "ReleaseNotes",
    data: function() {
        return {
            releaseNotes: {},
            version: pkg.version,
            openPanels: 0,
            mdiClose: mdiClose,
            mdiGithub: mdiGithub,
        };
    },
    created() {
        this.loadReleaseNotes();
    },
    methods: {
        loadReleaseNotes: function() {
            this.releaseNotes = Object.entries(releaseNotesJson)
                .reverse()
                .map((release) => {
                    return { version: release[0], changelog: release[1] };
                });
        },
        closeDialog: function() {
            this.$emit("close");
        },
    },
};
</script>

<style scoped>
.changelog span {
    display: block;
    margin-bottom: 5px;
}
</style>
