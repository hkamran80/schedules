<template>
    <v-card>
        <v-card-title class="text-wrap--break">
            About

            <v-spacer />

            <v-btn icon color="primary" @click="closeDialog">
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
                        - Design and Testing
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
