<template>
    <utds-center-layout>
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

        <div v-if="$developmentMode">
            <v-divider class="my-5" />

            <v-card
                :to="{ name: 'NewSchedule' }"
                title="Create a new schedule"
                aria-label="Create a new schedule"
                class="mx-auto schedule-card text-wrap--break"
                outlined
            >
                <v-card-title>
                    <v-icon medium left v-text="mdiPlus" />
                    New Schedule
                </v-card-title>
            </v-card>
        </div>

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
            <release-notes @close="closeDialogs" />
        </v-dialog>
        <v-dialog v-model="dialogs.privacy" width="750" scrollable>
            <privacy
                @installUmami="installUmami"
                @uninstallUmami="uninstallUmami"
                @close="closeDialogs"
            />
        </v-dialog>
    </utds-center-layout>
</template>

<script>
import { UtdsCenterLayout, UtdsHeader } from "utds-component-library";
const ReleaseNotes = () => import("@/components/dialogs/ReleaseNotes.vue");
const Privacy = () => import("@/components/dialogs/Privacy.vue");

import { mdiPlus, mdiSchoolOutline } from "@mdi/js";

export default {
    props: {
        schedules: {
            type: Object,
            required: true,
            default: function() {
                return {};
            }
        }
    },
    components: { UtdsCenterLayout, UtdsHeader, ReleaseNotes, Privacy },
    data() {
        return {
            dialogs: {
                releaseNotes: false,
                privacy: false
            },
            mdiPlus: mdiPlus,
            mdiSchoolOutline: mdiSchoolOutline
        };
    },
    methods: {
        closeDialogs() {
            this.dialogs.releaseNotes = false;
            this.dialogs.privacy = false;
        }
    }
};
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
