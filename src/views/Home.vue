<template>
    <utds-layout>
        <utds-header title="Welcome! Select a schedule to begin!" />

        <v-alert type="error" color="#A80000" v-if="error">
            {{ error }}
        </v-alert>

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
            title="About"
            aria-label="About"
            class="mx-auto schedule-card text-wrap--break"
            outlined
            @click="dialogs.about = true"
        >
            <v-card-title>
                About
            </v-card-title>
        </v-card>

        <v-card
            title="Help Center"
            aria-label="Help Center"
            class="mx-auto schedule-card text-wrap--break"
            outlined
            @click="dialogs.help = true"
        >
            <v-card-title>
                Help Center
            </v-card-title>
        </v-card>

        <v-card
            title="Analytics notice"
            aria-label="Analytics notice"
            class="mx-auto schedule-card text-wrap--break"
            outlined
            @click="dialogs.analytics = true"
        >
            <v-card-title>
                Analytics Notice
            </v-card-title>
        </v-card>

        <v-dialog v-model="dialogs.releaseNotes" width="500" scrollable>
            <utds-release-notes
                :currentVersion="currentVersion"
                :rawReleaseNotes="releaseNotes"
                githubRepository="hkamran80/schedules"
                :markdown="true"
                @close="dialogs.releaseNotes = false"
            />
        </v-dialog>
        <v-dialog v-model="dialogs.analytics" width="500" scrollable>
            <analytics-notice @close="dialogs.analytics = false" />
        </v-dialog>
        <v-dialog v-model="dialogs.about" width="500" scrollable>
            <about :version="currentVersion" @close="dialogs.about = false" />
        </v-dialog>
        <v-dialog v-model="dialogs.help" width="500" scrollable>
            <help-center
                @openHelpTopic="openHelpTopic"
                @close="dialogs.help = false"
            />
        </v-dialog>
        <v-dialog v-model="dialogs.helpTopic" width="800" scrollable>
            <help-center-topic
                :id="helpTopic.id"
                :metadata="helpTopic.metadata"
                @close="dialogs.helpTopic = false"
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
import {
    mdiPlus,
    mdiSchoolOutline,
    mdiTimerSand,
    mdiAlertOutline,
} from "@mdi/js";
import { version as currentVersion } from "../../package.json";
import releaseNotes from "@/releaseNotes.json";

import { Nullable } from "@/structures/types";
import { generateNotFoundMessage } from "@/constructs/strings";
import { HelpCenterTopic as HelpCenterTopicInterface } from "@/structures/helpcenter";

const AnalyticsNotice = () => import("@/components/AnalyticsNotice.vue");
const About = () => import("@/components/About.vue");
const HelpCenter = () => import("@/components/HelpCenter.vue");
const HelpCenterTopic = () => import("@/components/HelpCenterTopic.vue");

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
    components: {
        UtdsLayout,
        UtdsHeader,
        UtdsReleaseNotes,
        AnalyticsNotice,
        About,
        HelpCenter,
        HelpCenterTopic,
    },
    data() {
        return {
            currentVersion,
            releaseNotes,
            dialogs: {
                releaseNotes: false,
                analytics: false,
                about: false,
                help: false,
                helpTopic: false,
            },
            helpTopic: {
                id: null as Nullable<string>,
                metadata: null as Nullable<HelpCenterTopicInterface>,
            },
            error: (this.$route.query.notFound
                ? generateNotFoundMessage(this.$route.query.notFound as string)
                : null) as Nullable<string>,
            mdiPlus,
            mdiSchoolOutline,
            mdiTimerSand,
            mdiAlertOutline,
        };
    },
    methods: {
        openHelpTopic(id: string, metadata: HelpCenterTopicInterface): void {
            this.helpTopic.id = id;
            this.helpTopic.metadata = metadata;
            this.dialogs.helpTopic = true;
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
