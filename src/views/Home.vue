<template>
    <utds-layout>
        <utds-header title="Welcome! Select a schedule to begin!" />

        <v-card
            v-for="(schedule, id) in schedules"
            :key="id"
            :color="schedule.color"
            :to="`/schedule/${id}`"
            :title="schedule.name"
            :aria-label="schedule.name"
            class="mx-auto schedule-card text-wrap--break"
            dark
            outlined
        >
            <v-card-title>
                <v-icon medium left v-text="$data[schedule.icon]" />
                <span v-text="schedule.name" />
            </v-card-title>
        </v-card>

        <v-card
            to="/schedule/countdown"
            title="Countdown"
            aria-label="Countdown"
            color="primary"
            class="mx-auto schedule-card text-wrap--break"
            dark
            outlined
        >
            <v-card-title>
                <v-icon medium left v-text="mdiTimerSand" />
                <span>Countdown</span>
            </v-card-title>
        </v-card>

        <v-divider class="my-5" />

        <v-card
            title="Release notes"
            aria-label="Release notes"
            class="mx-auto schedule-card text-wrap--break"
            outlined
            @click="dialogs.releaseNotes = true"
        >
            <v-card-title>
                Release Notes
            </v-card-title>
        </v-card>

        <v-card
            title="Privacy notice"
            aria-label="Privacy notice"
            class="mx-auto schedule-card text-wrap--break"
            outlined
            @click="dialogs.privacy = true"
        >
            <v-card-title>
                Privacy Notice
            </v-card-title>
        </v-card>

        <v-dialog v-model="dialogs.releaseNotes" width="750" scrollable>
            <utds-release-notes
                :currentVersion="currentVersion"
                :rawReleaseNotes="releaseNotes"
                githubRepository="hkamran80/schedules"
                @close="dialogs.releaseNotes = false"
            />
        </v-dialog>
        <v-dialog v-model="dialogs.privacy" width="750" scrollable>
            <privacy
                @installUmami="installUmami"
                @uninstallUmami="uninstallUmami"
                @close="closeDialogs"
            />
        </v-dialog>
    </utds-layout>
</template>

<script lang="ts">
import Vue from "vue";
import {
    UtdsLayout,
    UtdsHeader,
    UtdsReleaseNotes,
} from "utds-component-library";
import { mdiPlus, mdiSchoolOutline, mdiTimerSand } from "@mdi/js";
import { version as currentVersion } from "../../package.json";
import releaseNotes from "@/releaseNotes.json";

const Privacy = () => import("@/components/dialogs/Privacy.vue");

export default Vue.extend({
    props: {
        schedules: {
            type: Object,
            required: true,
            default: function() {
                return {};
            },
        },
    },
    components: { UtdsLayout, UtdsHeader, UtdsReleaseNotes, Privacy },
    data() {
        return {
            currentVersion,
            releaseNotes,
            dialogs: {
                releaseNotes: false,
                privacy: false,
            },
            mdiPlus,
            mdiSchoolOutline,
            mdiTimerSand,
        };
    },
    methods: {
        closeDialogs(): void {
            this.dialogs.releaseNotes = false;
            this.dialogs.privacy = false;
        },
    },
});
</script>

<style scoped>
.v-card.schedule-card {
    padding: 0 5px;
    margin: 10px 0;
    text-align: center;
}
.v-card.schedule-card i.v-icon {
    margin-right: 15px;
}
</style>
