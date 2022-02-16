<template>
    <utds-layout>
        <utds-header title="Welcome! Select a schedule to begin!" />

        <v-alert type="error" color="#A80000" v-if="error">
            {{ error }}
        </v-alert>

        <a
            href="https://schedules.unisontech.org"
            target="_blank"
            rel="noopener noreferrer"
            class="text-wrap--break"
            style="width: 100%"
            v-if="$edgeMode"
        >
            <v-alert type="info">
                You're using the edge (beta) version of Schedules. To go to the
                main site, click this alert or go to
                https://schedules.unisontech.org.
            </v-alert>
        </a>

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
                <v-icon medium left v-text="scheduleIcons[schedule.icon]" />
                <span v-text="schedule.name" />
            </v-card-title>
        </v-card>

        <v-card
            to="/schedule/countdown"
            title="Countdown"
            aria-label="Countdown"
            color="#C2185B"
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
            @click="releaseNotesDialog = true"
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
            @click="aboutDialog = true"
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
            @click="helpDialog = true"
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
            @click="analyticsNotice = true"
        >
            <v-card-title>
                Analytics Notice
            </v-card-title>
        </v-card>

        <v-dialog v-model="releaseNotesDialog" width="500" scrollable>
            <utds-release-notes
                :currentVersion="currentVersion"
                :rawReleaseNotes="releaseNotes"
                githubRepository="hkamran80/schedules"
                :markdown="true"
                @close="releaseNotesDialog = false"
            />
        </v-dialog>
        <v-dialog v-model="analyticsNotice" width="500" scrollable>
            <analytics-notice @close="analyticsNotice = false" />
        </v-dialog>
        <v-dialog v-model="aboutDialog" width="500" scrollable>
            <about :version="currentVersion" @close="aboutDialog = false" />
        </v-dialog>
        <v-dialog v-model="helpDialog" width="500" scrollable>
            <help-center
                @openHelpTopic="openHelpTopic"
                @close="helpDialog = false"
            />
        </v-dialog>
        <v-dialog v-model="helpTopicDialog" width="800" scrollable>
            <help-center-topic
                :key="helpTopicId"
                :id="helpTopicId"
                :metadata="helpTopicMetadata"
                @close="closeHelpTopic"
            />
        </v-dialog>
    </utds-layout>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from "@vue/composition-api";
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

import { Nullable } from "@/models/types";
import { generateNotFoundMessage } from "@/constructs/strings";
import { HelpCenterTopic as HelpCenterTopicInterface } from "@/models/helpcenter";

const AnalyticsNotice = () => import("@/components/AnalyticsNotice.vue");
const About = () => import("@/components/About.vue");
const HelpCenter = () => import("@/components/HelpCenter.vue");
const HelpCenterTopic = () => import("@/components/HelpCenterTopic.vue");

export default defineComponent({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(_: any, context: SetupContext) {
        const releaseNotesDialog = ref(false);
        const analyticsNotice = ref(false);
        const aboutDialog = ref(false);
        const helpDialog = ref(false);
        const helpTopicDialog = ref(false);

        const helpTopicId = ref(null as Nullable<string>);
        const helpTopicMetadata = ref(
            null as Nullable<HelpCenterTopicInterface>
        );

        const error = (context.root.$route.query.notFound
            ? generateNotFoundMessage(
                  context.root.$route.query.notFound as string
              )
            : null) as Nullable<string>;

        const openHelpTopic = (
            id: string,
            metadata: HelpCenterTopicInterface
        ) => {
            helpTopicId.value = id;
            helpTopicMetadata.value = metadata;
            helpTopicDialog.value = true;
        };
        const closeHelpTopic = () => {
            helpTopicId.value = null;
            helpTopicMetadata.value = null;
            helpTopicDialog.value = false;
        };

        return {
            // Versions
            currentVersion,
            releaseNotes,

            // Dialogs
            releaseNotesDialog,
            analyticsNotice,
            aboutDialog,
            helpDialog,
            helpTopicDialog,

            // Help Topic
            helpTopicId,
            helpTopicMetadata,
            openHelpTopic,
            closeHelpTopic,

            // General Information
            error,

            // Icons
            mdiPlus,
            mdiTimerSand,
            mdiAlertOutline,
            scheduleIcons: { mdiSchoolOutline },
        };
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
