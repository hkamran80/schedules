<template>
    <v-card>
        <v-card-title class="text-wrap--break">
            Settings

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

        <v-card-text>
            <div class="my-3">
                <v-switch
                    v-model="twentyFourHourStatus"
                    label="Twenty-four Hour Time"
                    inset
                    hide-details
                    readonly
                    @click="setTFHStatus"
                />
            </div>

            <div v-if="$edgeMode || $developmentMode">
                <v-divider class="my-4" />

                <v-btn
                    block
                    color="primary"
                    class="mb-3"
                    title="Toggle Debug Mode"
                    aria-label="Toggle Debug Mode"
                    @click="toggleDebugMode"
                >
                    Toggle Debug Mode
                </v-btn>
            </div>

            <v-divider class="my-4" />

            <!-- Period Names -->
            <div class="mb-5">
                <h3 class="mb-5">
                    Period Names
                </h3>

                <v-btn
                    block
                    color="primary"
                    class="mb-3"
                    @click="openPeriodNamesEdit"
                >
                    Edit
                </v-btn>
                <v-btn
                    block
                    color="primary"
                    class="mb-3"
                    @click="openPeriodNamesImport"
                >
                    Import
                </v-btn>
                <v-btn block color="primary" @click="openPeriodNamesExport">
                    Export
                </v-btn>
            </div>

            <v-divider class="my-4" />

            <!-- Notifications -->
            <div class="mb-5">
                <h3 class="mb-5">
                    Notifications
                </h3>

                <v-btn
                    block
                    color="primary"
                    class="mb-3"
                    @click="openNotificationsEdit"
                >
                    Edit
                </v-btn>
                <v-btn
                    block
                    color="primary"
                    class="mb-3"
                    @click="openNotificationsImport"
                >
                    Import
                </v-btn>
                <v-btn block color="primary" @click="openNotificationsExport">
                    Export
                </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { mdiClose } from "@mdi/js";
import { loadDatetime } from "@/composables/dateTime";

export default defineComponent({
    setup(_, { emit }) {
        const closeDialog = () => emit("close");
        const { twentyFourHourStatus, setTFHStatus } = loadDatetime();

        const openPeriodNamesEdit = () => emit("openPeriodNamesEdit");
        const openPeriodNamesImport = () => emit("openPeriodNamesImport");
        const openPeriodNamesExport = () => emit("openPeriodNamesExport");
        const openNotificationsEdit = () => emit("openNotificationsEdit");
        const openNotificationsImport = () => emit("openNotificationsImport");
        const openNotificationsExport = () => emit("openNotificationsExport");
        const toggleDebugMode = () => emit("toggleDebugMode");

        return {
            twentyFourHourStatus,
            setTFHStatus,
            closeDialog,
            openPeriodNamesEdit,
            openPeriodNamesImport,
            openPeriodNamesExport,
            openNotificationsEdit,
            openNotificationsImport,
            openNotificationsExport,

            toggleDebugMode,

            // Icons
            mdiClose,
        };
    },
});
</script>
