<template>
    <v-card>
        <v-card-title>
            Analytics Notice

            <v-spacer />

            <v-btn icon color="primary" @click="closeDialog">
                <v-icon v-text="mdiClose" />
            </v-btn>
        </v-card-title>

        <v-card-text>
            <div>
                <p>
                    Schedules uses the open-source anonymous analytics platform
                    <a
                        href="https://umami.is"
                        target="_blank"
                        rel="noopener noreferrer"
                        >Umami</a
                    >
                    for tracking page views.
                </p>

                <p>
                    <v-switch
                        v-model="allowed"
                        label="Enable Analytics"
                        inset
                        hide-details
                        readonly
                        class="mb-5"
                        @click="setUmamiStatus"
                        :disabled="$developmentMode"
                    />
                </p>
            </div>

            <v-divider class="my-5" />

            <div>
                <h4 class="mb-2">About Umami</h4>
                <div class="ut-blockquote">
                    <p>
                        Umami is a simple, easy to use, self-hosted web
                        analytics solution. The goal is to provide you with a
                        friendlier, privacy-focused alternative to Google
                        Analytics and a free, open-sourced alternative to paid
                        solutions. Umami collects only the metrics you care
                        about and everything fits on a single page.
                    </p>
                    <p>
                        <i>
                            &mdash;
                            <a
                                href="https://umami.is/docs/about"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Umami
                            </a>
                        </i>
                    </p>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from "@vue/composition-api";
import { mdiClose } from "@mdi/js";
import {
    installUmami,
    umamiInstallStatus,
    uninstallUmami,
} from "@/composables/umami";

export default defineComponent({
    setup(_, context: SetupContext) {
        const closeDialog = () => context.emit("close");

        const { allowed, setStatus } = umamiInstallStatus();
        const setUmamiStatus = () => {
            if (!context.root.$developmentMode) {
                setStatus(context);

                if (allowed.value === false) {
                    uninstallUmami(context.root);
                } else if (allowed.value === true) {
                    installUmami(context.root);
                }
            }
        };

        return {
            closeDialog,

            // Umami
            allowed,
            setUmamiStatus,

            // Icons
            mdiClose,
        };
    },
});
</script>

<style scoped>
.ut-blockquote {
    border-left: 2px solid lightgray;
    padding-left: 15px;
}
</style>
