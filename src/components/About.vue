<template>
    <v-card>
        <v-card-title class="text-wrap--break">
            About

            <v-spacer />

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

        <v-card-subtitle v-text="version" />

        <v-card-text>
            <div>
                <p>
                    Schedules is an app for schedules. It tells you exactly what
                    the current period is and how much time is remaining in a
                    period, as well as the next period and starting time.
                </p>
            </div>

            <v-divider class="my-5" />

            <div>
                <h4 class="mb-2">Credits</h4>

                <ul>
                    <li>
                        <a
                            href="https://hkamran.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            >H. Kamran</a
                        >
                        - Developer
                    </li>
                    <li>
                        <a
                            href="https://twitter.com/josephius3"
                            target="_blank"
                            rel="noopener noreferrer"
                            >J. Quam</a
                        >
                        - Design, Testing, and Logo
                    </li>
                    <li>
                        <a
                            href="https://getfind.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            >A. Zheng</a
                        >
                        - Design and Testing
                    </li>
                </ul>
            </div>

            <v-divider class="my-5" />

            <div>
                <h4 class="mb-2">Legal</h4>
                <p>
                    By using this service, you agree to the
                    <a
                        href="https://unisontech.org/legal/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        >Terms of Service</a
                    >
                    and the
                    <a
                        href="https://unisontech.org/legal/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        >Privacy Policy</a
                    >.
                </p>
            </div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { mdiClose } from "@mdi/js";

export default defineComponent({
    props: { version: { type: String, required: true, default: "x.x.x" } },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(props: any, { emit }) {
        const closeDialog = () => emit("close");

        return {
            closeDialog,

            // Icons
            mdiClose,
        };
    },
});
</script>
